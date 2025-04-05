import { Dialog } from "@headlessui/react";
import React from "react";
import InputField from "../../../../../components/fields/InputField";
import {useDisclosure} from "@chakra-ui/hooks";

const MediaDialog = (props) => {
    const {formik,dialogVisible,hideDialog,submitted,handleSubmitFormik} = props;

    return (
        <Dialog
            open={dialogVisible}
            onClose={hideDialog}
            className="fixed inset-0 z-10 overflow-y-auto"
        >
            <div className="flex min-h-screen items-center justify-center">
                <Dialog.Panel className="z-20 h-full max-h-[80vh]  w-full max-w-lg overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
                    <Dialog.Title
                        as="h3"
                        className="mb-4 text-lg font-medium leading-6 text-gray-900"
                    >
                        {formik.values?.id ? "Medya Düzenle" : "Medya Oluştur"}
                    </Dialog.Title>
                    <div className="mb-4">
                        <InputField
                            label="Description"
                            placeholder="description"
                            name="description"
                            type="text"
                            state={formik.errors?.description && submitted && "error"}
                            value={formik.values?.description}
                            onChange={(e) => {
                                formik.handleChange(e);
                            }}
                        />
                        {formik.errors.description && submitted && (
                            <div className="ml-2 mt-2 text-red-500">{formik.errors.description}</div>
                        )}
                    </div>
                    <div className="mb-4">
                        <InputField
                            label="Count"
                            placeholder="count"
                            name="count"
                            type="number"
                            state={formik.errors?.count && submitted && "error"}
                            value={formik.values?.count}
                            onChange={(e) => {
                                formik.handleChange(e);
                            }}
                        />
                        {formik.errors.count && submitted &&(
                            <div className="ml-2 mt-2 text-red-500">{formik.errors.count}</div>
                        )}
                    </div>
                    <div className="mb-4">
                        <InputField
                            label="Publish Date"
                            placeholder="publish date"
                            name="publishDate"
                            type="date"
                            state={formik.errors?.publishDate && submitted && "error"}
                            value={formik.values.publishDate}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.publishDate && submitted &&(
                            <div className="ml-2 mt-2 text-red-500">{formik.errors.publishDate}</div>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={hideDialog}
                            className="cursor-pointer mr-2 rounded-md bg-red-500 px-4 py-2 font-bold text-white"
                        >
                            İptal
                        </button>
                        <button
                            type="button"
                            className="cursor-pointer rounded-md bg-green-500 px-4 py-2 font-bold text-white"
                            onClick={handleSubmitFormik}
                        >
                            {formik.values?.id ? "Güncelle" : "Kaydet"}
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};
export default MediaDialog;
