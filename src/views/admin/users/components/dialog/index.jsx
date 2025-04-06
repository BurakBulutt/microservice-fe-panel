import { Dialog } from "@headlessui/react";
import React from "react";
import Switch from "../../../../../components/switch";
import InputField from "../../../../../components/fields/InputField";

const UserDialog = (props) => {
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
            {formik.values?.id ? "Kullanıcı Düzenle" : "Kullanıcı Oluştur"}
          </Dialog.Title>
          <div className="mb-4">
            <InputField
                label="Ad"
                placeholder="First Name"
                name="firstName"
                type="text"
                state={formik.errors?.firstName && "error"}
                value={formik.values?.firstName}
                onChange={formik.handleChange}
            />
            {formik.errors.firstName && (
              <div className="text-red-500">{formik.errors.firstName}</div>
            )}
          </div>
          <div className="mb-4">
            <InputField
                label="Soyad"
                placeholder="Last Name"
                name="lastName"
                type="text"
                state={formik.errors?.lastName && "error"}
                value={formik.values?.lastName}
                onChange={formik.handleChange}
            />
            {formik.errors.lastName && (
              <div className="text-red-500">{formik.errors.lastName}</div>
            )}
          </div>
          <div className="mb-4">
            <InputField
                label="Email"
                placeholder="Email"
                name="email"
                type="email"
                state={formik.errors?.email && "error"}
                value={formik.values?.email}
                onChange={formik.handleChange}
            />
            {formik.errors.email && (
              <div className="text-red-500">{formik.errors.email}</div>
            )}
          </div>
          {!formik.values?.id && (
            <>
              <div className="mb-4">
                <InputField
                    label="Kullanıcı Adı"
                    placeholder="Kullanıcı Adı"
                    name="username"
                    type="text"
                    state={formik.errors?.username && "error"}
                    value={formik.values?.username}
                    onChange={formik.handleChange}
                />
                {formik.errors.username && (
                  <div className="text-red-500">{formik.errors.username}</div>
                )}
              </div>
              <div className="mb-4">
                <InputField
                    label="Şifre"
                    placeholder="Şifre"
                    name="password"
                    type="password"
                    state={formik.errors?.password && "error"}
                    value={formik.values?.password}
                    onChange={formik.handleChange}
                />
                {formik.errors.password && (
                  <div className="text-red-500">{formik.errors.password}</div>
                )}
              </div>
              <div className="mb-4">
                <InputField
                    label="Şifre Tekrar"
                    placeholder="Şifre Tekrar"
                    name="passwordRe"
                    type="password"
                    state={formik.errors?.passwordRe && "error"}
                    value={formik.values?.passwordRe}
                    onChange={formik.handleChange}
                />
                {formik.errors.passwordRe && (
                    <div className="text-red-500">{formik.errors.passwordRe}</div>
                )}
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-navy-700 dark:text-white">Geçici Şifre</label>
                <Switch
                  id="isPasswordTemporary"
                  checked={formik.values.isPasswordTemporary}
                  onChange={(e) => {
                    formik.setFieldValue("isPasswordTemporary", e.target.checked);
                  }}
                />
              </div>
            </>
          )}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-navy-700 dark:text-white">Aktif</label>
            <Switch
                id="enabled"
                checked={formik.values.enabled}
                onChange={(e) => {
                  formik.setFieldValue("enabled", e.target.checked);
                }}
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-navy-700 dark:text-white">Email Doğrulanmış</label>
            <Switch
                id="emailVerified"
                checked={formik.values.emailVerified}
                onChange={(e) => {
                  formik.setFieldValue("emailVerified", e.target.checked);
                }}
            />
          </div>
          <div className="mb-4">
            <InputField
                label="Doğum Tarihi"
                placeholder="Doğum Tarihi"
                name="birthdate"
                type="date"
                state={formik.errors?.birthdate && "error"}
                value={formik.values?.birthdate}
                onChange={formik.handleChange}
            />
            {formik.errors.birthdate  && (
                <div className="text-red-500">{formik.errors.birthdate}</div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={hideDialog}
              className="cursor-pointer mr-2 rounded-md bg-red-500 px-4 py-2 font-bold text-white"
            >
              Close
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-md bg-green-500 px-4 py-2 font-bold text-white"
              onClick={handleSubmitFormik}
            >
              {formik.values?.id ? "Save" : "Update"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
export default UserDialog;
