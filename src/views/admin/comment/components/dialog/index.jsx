import { Dialog } from "@headlessui/react";
import React, {useCallback} from "react";

import TextField from "../../../../../components/fields/TextField";
import { useTranslation } from "react-i18next";
import InputField from "../../../../../components/fields/InputField";
import Selectdialog from "../../../../../components/selectdialog";
import Content from "../../../content";
import Comment from "../../index";
import Media from "../../../content/components/media";
import Users from "../../../users";

const CommentDialog = (props) => {
  const { formik, dialogVisible, hideDialog,handleSubmitFormik } = props;
  const { t } = useTranslation();
  const [selected, setSelected] = React.useState({
    target: null,
    user: null,
    parent: null,
  });
  const [targetComponent, setTargetComponent] = React.useState("CONTENT");

  const typeOptions = [
    {
      display: t("comment"),
      value: "COMMENT",
    },
    {
      display: t("reply"),
      value: "REPLY",
    },
  ];

  const componentOptions = [
    {
      display: t("content"),
      value: "CONTENT",
    },
    {
      display: t("media"),
      value: "MEDIA",
    },
  ];

  const handleSelect = useCallback((data,key) => {
    setSelected((prev) => ({...prev, [key]: data}));
  },[]);

  const header = useCallback((key) => {
    return selected[key] ? (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-md transition-all hover:shadow-lg">
          <p className="text-lg font-semibold text-gray-800">{selected[key]?.name ? selected[key].name : selected[key]?.id}</p>
        </div>
    ) : (
        <div></div>
    )
  },[selected]);

  const actionButtons = useCallback((data,key) => {
    return (
        <div className="flex space-x-2">
          <button
              className="flex cursor-pointer items-center justify-center rounded-lg bg-green-300 p-2 text-white hover:bg-green-400"
              onClick={() => handleSelect(data,key)}
          >
            {t("choose")}
          </button>
        </div>
    );
  },[handleSelect,t]);

  const getComponent = useCallback(() => {
    switch (targetComponent) {
      case "CONTENT": return <Content header={() => header("target")} actionButtons={(data) => actionButtons(data,"target")} />
      case "MEDIA": return <Media metaComponent={false} header={() => header("target")} actionButtons={(data) => actionButtons(data,"target")} />
      default: return <></>;
    }
  },[targetComponent,actionButtons,header]);


  const onSave = (formikLabel,key) => {
    if (selected[key]) {
      formik.setFieldValue(formikLabel, selected[key].id);
    }
  }

  const onClose = (key) => {
    setSelected((prev) => ({...prev, [key]: null}));
  }

  const clearFormik = (formikLabel,key) => {
    formik.setFieldValue(formikLabel, "");
    setSelected((prev) => ({...prev, [key]: null}));
  }

  const hide = () => {
    onClose();
    hideDialog();
  }

  return (
      <Dialog
          open={dialogVisible}
          onClose={hide}
          className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex min-h-screen items-center justify-center">
          <Dialog.Panel className="z-20 h-full max-h-[80vh]  w-full max-w-lg overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg dark:!bg-navy-900 dark:border-brand-400">
            <Dialog.Title
                as="h3"
                className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              {formik.values.id ? t("update") : t("create")}
            </Dialog.Title>
            {!formik.values.id && (
                <>
                  <div className="mb-4">
                    <label className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
                      {t("type")}
                    </label>
                    <select
                        className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:text-white dark:focus:border-blue-400"
                        value={formik.values.type}
                        name="type"
                        onChange={(e) => {
                          if (e.target.value === "COMMENT") {
                            clearFormik("parentId", "parent");
                          }
                          formik.handleChange(e);
                        }}
                    >
                      {typeOptions.map((option) => (
                          <option
                              key={option.value}
                              value={option.value}
                              className="text-black dark:text-white dark:bg-navy-900"
                          >
                            {option.display}
                          </option>
                      ))}
                    </select>
                    {formik.errors.type &&  (
                        <div className="ml-2 mt-2 text-red-500">
                          {formik.errors.type}
                        </div>
                    )}
                  </div>
                  <div className="mb-4 flex flex-col justify-between gap-2">
                    <InputField
                        disabled={true}
                        label={t("target")}
                        placeholder={t("target")}
                        name="targetId"
                        type="text"
                        state={formik.errors.targetId &&  "error"}
                        value={formik.values.targetId}
                    />
                    {formik.errors.targetId &&  (
                        <div className="ml-2 mt-2 text-red-500">
                          {formik.errors.targetId}
                        </div>
                    )}
                    <div>
                      <label className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
                        {t("targetType")}
                      </label>
                      <select
                          className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:text-white dark:focus:border-blue-400"
                          value={targetComponent}
                          name="targetComponent"
                          onChange={(e) => {
                            setTargetComponent(e.target.value);
                            clearFormik("targetId", "target");
                          }}
                      >
                        {componentOptions.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                className="text-black dark:text-white dark:bg-navy-900"
                            >
                              {option.display}
                            </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-row justify-between gap-2">
                      <div className="flex-1">
                        <Selectdialog
                            extra="w-full rounded-xl bg-gradient-to-br from-[#EA52F8] to-[#0066FF] px-5 py-3 text-base font-medium text-white transition duration-200 hover:shadow-lg hover:shadow-[#0066FF]/25"
                            buttonText={t("target")}
                            component={getComponent()}
                            onSave={() => onSave("targetId", "target")}
                            onClose={() => onClose("target")}
                        />
                      </div>
                      <div className="flex-1">
                        <button
                            type="button"
                            onClick={() => {
                              clearFormik("targetId", "target");
                              clearFormik("parentId", "parent");
                            }}
                            className="w-full rounded-xl bg-gradient-to-br from-[#FF416C] to-[#FF4B2B] px-5 py-3 text-base font-medium text-white transition duration-200 hover:shadow-lg hover:shadow-[#FF416C]/50"
                        >
                          {t("clear")}
                        </button>
                      </div>
                    </div>
                  </div>
                  {formik.values.type === "REPLY" && formik.values.targetId && (
                      <div className="mb-4 flex flex-col justify-between gap-2">
                        <InputField
                            disabled={true}
                            label={t("parent")}
                            placeholder={t("parent")}
                            name="parentId"
                            type="text"
                            state={formik.errors.parentId &&  "error"}
                            value={formik.values.parentId}
                        />
                        {formik.errors.parentId &&  (
                            <div className="ml-2 mt-2 text-red-500">
                              {formik.errors.parentId}
                            </div>
                        )}
                        <div className="flex flex-row justify-between gap-2">
                          <div className="flex-1">
                            <Selectdialog
                                extra="w-full rounded-xl bg-gradient-to-br from-[#EA52F8] to-[#0066FF] px-5 py-3 text-base font-medium text-white transition duration-200 hover:shadow-lg hover:shadow-[#0066FF]/25"
                                buttonText={t("parent")}
                                component={
                                  <Comment
                                      targetId={formik.values.targetId}
                                      header={() => header("parent")}
                                      actionButtons={(data) =>
                                          actionButtons(data, "parent")
                                      }
                                  />
                                }
                                onSave={() => onSave("parentId", "parent")}
                                onClose={() => onClose("parent")}
                            />
                          </div>
                          <div className="flex-1">
                            <button
                                type="button"
                                onClick={() => clearFormik("parentId", "parent")}
                                className="w-full rounded-xl bg-gradient-to-br from-[#FF416C] to-[#FF4B2B] px-5 py-3 text-base font-medium text-white transition duration-200 hover:shadow-lg hover:shadow-[#FF416C]/50"
                            >
                              {t("clear")}
                            </button>
                          </div>
                        </div>
                      </div>
                  )}
                  <div className="mb-4 flex flex-col justify-between gap-2">
                    <InputField
                        disabled={true}
                        label={t("user")}
                        placeholder={t("user")}
                        name="userId"
                        type="text"
                        state={formik.errors.userId &&  "error"}
                        value={formik.values.userId}
                    />
                    {formik.errors.userId &&  (
                        <div className="ml-2 mt-2 text-red-500">
                          {formik.errors.userId}
                        </div>
                    )}
                    <div className="flex flex-row justify-between gap-2">
                      <div className="flex-1">
                        <Selectdialog
                            extra="w-full rounded-xl bg-gradient-to-br from-[#EA52F8] to-[#0066FF] px-5 py-3 text-base font-medium text-white transition duration-200 hover:shadow-lg hover:shadow-[#0066FF]/25"
                            buttonText={t("user")}
                            component={
                              <Users
                                  header={() => header("user")}
                                  actionButtons={(data) => actionButtons(data, "user")}
                              />
                            }
                            onSave={() => onSave("userId", "user")}
                            onClose={() => onClose("user")}
                        />
                      </div>
                      <div className="flex-1">
                        <button
                            type="button"
                            onClick={() => clearFormik("userId", "user")}
                            className="w-full rounded-xl bg-gradient-to-br from-[#FF416C] to-[#FF4B2B] px-5 py-3 text-base font-medium text-white transition duration-200 hover:shadow-lg hover:shadow-[#FF416C]/50"
                        >
                          {t("clear")}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
            )}
            <div className="mb-4">
              <TextField
                  id="content"
                  state={formik.errors.content &&  "error"}
                  label={t("comment")}
                  placeholder={t("comment")}
                  cols="30"
                  rows="7"
                  value={formik.values.content}
                  onChange={formik.handleChange}
              />
              {formik.errors.content &&  (
                  <div className="ml-2 mt-2 text-red-500">
                    {formik.errors.content}
                  </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                  type="button"
                  onClick={hide}
                  className="cursor-pointer rounded-md bg-red-500 px-4 py-2 font-bold text-white"
              >
                {t("close")}
              </button>
              <button
                  type="button"
                  className="cursor-pointer rounded-md bg-green-500 px-4 py-2 font-bold text-white"
                  onClick={() => {
                    handleSubmitFormik();
                    setSelected({
                      target: null,
                      user: null,
                      parent: null,
                    });
                  }}
              >
                {t("save")}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
  );
};

export default CommentDialog;
