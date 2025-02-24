import { Dialog } from "@headlessui/react";
import React from "react";
import Switch from "../../../../components/switch";

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
            <label className="block text-gray-700">Ad</label>
            <input
              type="text"
              name="firstName"
              onChange={formik.handleChange}
              value={formik.values.firstName}
              className="w-full rounded-md border px-3 py-2"
            />
            {formik.errors.firstName && dialogVisible && (
              <div className="text-red-500">{formik.errors.firstName}</div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Soyad</label>
            <input
              type="text"
              name="lastName"
              onChange={formik.handleChange}
              value={formik.values.lastName}
              className="w-full rounded-md border px-3 py-2"
            />
            {formik.errors.lastName && dialogVisible && (
              <div className="text-red-500">{formik.errors.lastName}</div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              className="w-full rounded-md border px-3 py-2"
            />
            {formik.errors.email && dialogVisible && (
              <div className="text-red-500">{formik.errors.email}</div>
            )}
          </div>
          {!formik.values?.id && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">Kullanıcı Adı</label>
                <input
                  type="text"
                  name="username"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  className="w-full rounded-md border px-3 py-2"
                />
                {formik.errors.username && dialogVisible && (
                  <div className="text-red-500">{formik.errors.username}</div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Şifre</label>
                <input
                  type="password"
                  name="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  className="w-full rounded-md border px-3 py-2"
                />
                {formik.errors.password && dialogVisible && (
                  <div className="text-red-500">{formik.errors.password}</div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Şifre Tekrar</label>
                <input
                  type="password"
                  name="passwordRe"
                  onChange={formik.handleChange}
                  value={formik.values.passwordRe}
                  className="w-full rounded-md border px-3 py-2"
                />
                {formik.errors.passwordRe && dialogVisible && (
                    <div className="text-red-500">{formik.errors.passwordRe}</div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Geçici Şifre</label>
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
            <label className="block text-gray-700">Aktif</label>
            <Switch
                id="enabled"
                checked={formik.values.enabled}
                onChange={(e) => {
                  formik.setFieldValue("enabled", e.target.checked);
                }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email Doğrulanmış</label>
            <Switch
                id="emailVerified"
                checked={formik.values.emailVerified}
                onChange={(e) => {
                  formik.setFieldValue("emailVerified", e.target.checked);
                }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Doğum Tarihi</label>
            <input
                type="birthdate"
                name="birthdate"
                onChange={formik.handleChange}
                value={formik.values.birthdate}
                className="w-full rounded-md border px-3 py-2"
            />
            {formik.errors.birthdate && dialogVisible && (
                <div className="text-red-500">{formik.errors.birthdate}</div>
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
export default UserDialog;
