import { Dialog } from "@headlessui/react";
import React from "react";
import InputField from "../../../../../components/fields/InputField";
import {useTranslation} from "react-i18next";

const CategoryDialog = (props) => {
    const {formik,submitted,dialogVisible,handleSubmitFormik,hideDialog} = props;
    const {t} = useTranslation();

    const createSlug = (name) => {
        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        formik.setFieldValue("slug",slug);
    };

    return (
        <div>
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
                            {formik.values?.id ? t("update") : t("save")}
                        </Dialog.Title>
                        <div className="mb-4">
                            <InputField
                                label={t("name")}
                                placeholder={t("name")}
                                name="name"
                                type="text"
                                state={formik.errors.name && submitted && "error"}
                                value={formik.values?.name}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    createSlug(e.target.value);
                                }}
                            />
                            {formik.errors.name && submitted &&(
                                <div className="ml-2 mt-2 text-red-500">{formik.errors.name}</div>
                            )}
                        </div>
                        <div className="mb-4">
                            <InputField
                                label={t("description")}
                                placeholder={t("description")}
                                name="description"
                                type="text"
                                state={formik.errors.description && submitted && "error"}
                                value={formik.values?.description}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                }}
                            />
                            {formik.errors.description && submitted &&(
                                <div className="ml-2 mt-2 text-red-500">{formik.errors.description}</div>
                            )}
                        </div>
                        <div className="mb-4">
                            <InputField
                                disabled={true}
                                label={t("slug")}
                                placeholder={t("slug")}
                                name="slug"
                                type="text"
                                state={formik.errors.slug && submitted && "error"}
                                value={formik.values.slug}
                            />
                            {formik.errors.slug && submitted &&(
                                <div className="ml-2 mt-2 text-red-500">{formik.errors.slug}</div>
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
                                {t("save")}
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};
export default CategoryDialog;
