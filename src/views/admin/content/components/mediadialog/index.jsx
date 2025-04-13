import { Dialog } from "@headlessui/react";
import React from "react";
import InputField from "../../../../../components/fields/InputField";
import {useTranslation} from "react-i18next";

const MediaDialog = (props) => {
    const {formik,dialogVisible,hideDialog,handleSubmitFormik} = props;
    const {t} = useTranslation();

    return (
        <Dialog
            open={dialogVisible}
            onClose={hideDialog}
            className="fixed inset-0 z-10 overflow-y-auto"
        >
            <div className="flex min-h-screen items-center justify-center">
                <Dialog.Panel className="z-20 h-full max-h-[80vh]  w-full max-w-lg overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg dark:!bg-navy-900 dark:border-brand-400">
                    <Dialog.Title
                        as="h3"
                        className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-white"
                    >
                        {formik.values?.id ? t("update") : t("create")}
                    </Dialog.Title>
                    <div className="mb-4">
                        <InputField
                            label={t("description")}
                            placeholder={t("description")}
                            name="description"
                            type="text"
                            state={formik.errors?.description &&  "error"}
                            value={formik.values?.description}
                            onChange={(e) => {
                                formik.handleChange(e);
                            }}
                        />
                        {formik.errors.description &&  (
                            <div className="ml-2 mt-2 text-red-500">{formik.errors.description}</div>
                        )}
                    </div>
                    <div className="mb-4">
                        <InputField
                            label={t("episodeNumber")}
                            placeholder={t("episodeNumber")}
                            name="count"
                            type="number"
                            state={formik.errors?.count &&  "error"}
                            value={formik.values?.count}
                            onChange={(e) => {
                                formik.handleChange(e);
                            }}
                        />
                        {formik.errors.count && (
                            <div className="ml-2 mt-2 text-red-500">{formik.errors.count}</div>
                        )}
                    </div>
                    <div className="mb-4">
                        <InputField
                            label={t("publishDate")}
                            placeholder={t("publishDate")}
                            name="publishDate"
                            type="date"
                            state={formik.errors?.publishDate &&  "error"}
                            value={formik.values.publishDate}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.publishDate && (
                            <div className="ml-2 mt-2 text-red-500">{formik.errors.publishDate}</div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={hideDialog}
                            className="cursor-pointer rounded-md bg-red-500 px-4 py-2 font-bold text-white"
                        >
                            {t("close")}
                        </button>
                        <button
                            type="button"
                            className="cursor-pointer rounded-md bg-green-500 px-4 py-2 font-bold text-white"
                            onClick={handleSubmitFormik}
                        >
                            {formik.values?.id ? t("update") : t("create")}
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};
export default MediaDialog;
