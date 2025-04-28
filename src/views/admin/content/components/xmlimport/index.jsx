import { useDisclosure } from "@chakra-ui/hooks";
import { Dialog } from "@headlessui/react";
import { useFormik } from "formik";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaDochub, FaUpload } from "react-icons/fa";
import { XmlDefinitionService } from "service/XmlDefinitionService";
import { useToast } from "utils/toast/toast";
import * as Yup from "yup";

const service = new XmlDefinitionService();

const XmlImportDialog = ({ type }) => {
  const { t } = useTranslation();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();

  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState(null);

  const baseRequest = {
    type: type,
    base64: null,
  };
  const formik = useFormik({
    initialValues: baseRequest,
    validationSchema: Yup.object({
      type: Yup.string().required("Type is Required"),
      base64: Yup.string().required("File is Required"),
    }),
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: (values) => {
      service
        .import(values)
        .then((response) => {
          if (response.status === 201) {
            toast.success(t("success"));
            closeDialog();
          }
        })
        .catch((error) => {
          catchError(error, {});
        });
    },
  });

  const catchError = useCallback(
    (error, options) => {
      toast.error(error.message, options);
    },
    [toast]
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".xml")) {
      toast.error(t("onlyXmlFilesAreAllowed"));
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(",")[1];
      formik.setFieldValue("base64", base64String);
      setSelectedFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const closeDialog = () => {
    formik.resetForm();
    setSelectedFileName(null);
    onClose();
  };

  return (
    <div>
      <button
        className="flex flex-col items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-base font-bold text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
        onClick={onOpen}
      >
        <FaDochub />
        {t("importXml")}
      </button>
      <Dialog
        open={isOpen}
        onClose={closeDialog}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex min-h-screen items-center justify-center">
          <Dialog.Panel className="z-20 h-full max-h-[100vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg dark:border-brand-400 dark:!bg-navy-900">
            <Dialog.Title
              as="h3"
              className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              {t("importXml")}
            </Dialog.Title>
            <div
              className="flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-6 text-center hover:border-brand-500 dark:border-white/10 dark:hover:border-brand-400"
              onClick={() => fileInputRef.current.click()}
            >
              <FaUpload className="mb-2 text-4xl text-brand-500 dark:text-brand-400" />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-200">
                {selectedFileName ? selectedFileName : t("clickToUpload")}
              </p>
              <input
                type="file"
                accept=".xml"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              {formik.errors.type && (
                <div className="ml-2 mt-2 text-red-500">
                  {formik.errors.type}
                </div>
              )}
              {formik.errors.base64 && (
                <div className="ml-2 mt-2 text-red-500">
                  {formik.errors.base64}
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={closeDialog}
                className="mr-2 cursor-pointer rounded-md bg-red-500 px-4 py-2 font-bold text-white"
              >
                {t("close")}
              </button>
              <button
                type="button"
                onClick={formik.handleSubmit}
                className="cursor-pointer rounded-md bg-green-500 px-4 py-2 font-bold text-white"
              >
                {t("save")}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default XmlImportDialog;
