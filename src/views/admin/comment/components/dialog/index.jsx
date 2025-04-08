import { Dialog } from "@headlessui/react";
import React from "react";

import TextField from "../../../../../components/fields/TextField";
import { useTranslation } from "react-i18next";
import InputField from "../../../../../components/fields/InputField";
import Selectdialog from "../../../../../components/selectdialog";
import Content from "../../../content";
import Comment from "../../index";
import Media from "../../../content/components/media";
import Users from "../../../users";

const CommentDialog = (props) => {
  const { formik, dialogVisible, hideDialog,submitted,handleSubmitFormik } = props;
  const { t } = useTranslation();
  const [selected, setSelected] = React.useState(null);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [selectedParent, setSelectedParent] = React.useState(null);
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

  const getComponent = (option) => {
    switch (option) {
      case "CONTENT": return <Content header={header()} actionButtons={actionButtons} />
      case "MEDIA": return <Media header={header()} actionButtons={actionButtons} />
      default: return <></>;
    }
  }

  const handleSelect = (data) => {
    setSelected(data);
  };

  const handleSelectUser = (data) => {
    setSelectedUser(data);
  };

  const handleSelectParent = (data) => {
    console.log("parent comment:",data);
    setSelectedParent(data);
  };

  const actionButtons = (data) => {
    return (
      <div className="flex space-x-2">
        <button
          className="flex cursor-pointer items-center justify-center rounded-lg bg-green-300 p-2 text-white hover:bg-green-400"
          onClick={() => handleSelect(data)}
        >
          {"SEÇ"}
        </button>
      </div>
    );
  };

  const header = () => {
    return selected ? (
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-md transition-all hover:shadow-lg">
        <p className="text-lg font-semibold text-gray-800">{selected.name ? selected.name : selected.id}</p>
      </div>
    ) : (
        <div></div>
    )
  };

  const actionButtonsUsers = (data) => {
    return (
        <div className="flex space-x-2">
          <button
              className="flex cursor-pointer items-center justify-center rounded-lg bg-green-300 p-2 text-white hover:bg-green-400"
              onClick={() => handleSelectUser(data)}
          >
            {"SEÇ"}
          </button>
        </div>
    );
  };

  const headerUsers = () => {
    return selectedUser ? (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-md transition-all hover:shadow-lg">
          <p className="text-lg font-semibold text-gray-800">{selectedUser.name ? selectedUser.name : selectedUser.id}</p>
        </div>
    ) : (
        <div></div>
    )
  };

  const actionButtonsParent = (data) => {
    return (
        <div className="flex space-x-2">
          <button
              className="flex cursor-pointer items-center justify-center rounded-lg bg-green-300 p-2 text-white hover:bg-green-400"
              onClick={() => handleSelectParent(data)}
          >
            {"SEÇ"}
          </button>
        </div>
    );
  };

  const headerParent = () => {
    return selectedParent ? (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-md transition-all hover:shadow-lg">
          <p className="text-lg font-semibold text-gray-800">{selectedParent.id}</p>
        </div>
    ) : (
        <div></div>
    )
  };

  const onClose = () => {
    setSelected(null);
  }

  const onSave = () => {
    if (selected) {
      formik.setFieldValue("targetId", selected.id);
    }
  }

  const onUserClose = () => {
    setSelectedUser(null);
  }

  const onUserSave = () => {
    if (selectedUser) {
      formik.setFieldValue("userId", selectedUser.id);
    }
  }

  const onParentClose = () => {
    setSelectedParent(null);
  }

  const onParentSave = () => {
    if (selectedParent) {
      formik.setFieldValue("parentId", selectedParent.id);
    }
  }

  const clearTarget = () => {
    formik.setFieldValue("targetId", "");
    setSelected(null);
  }

  const hide = () => {
    onParentClose();
    onUserClose();
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
        <Dialog.Panel className="z-20 h-full max-h-[80vh]  w-full max-w-lg overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
          <Dialog.Title
            as="h3"
            className="mb-4 text-lg font-medium leading-6 text-gray-900"
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
                          formik.setFieldValue("parentId",null);
                          setSelectedParent(null);
                        }
                        formik.handleChange(e);
                      }}
                  >
                    {typeOptions.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="text-black dark:text-white"
                        >
                          {option.display}
                        </option>
                    ))}
                  </select>
                  {formik.errors.type && submitted && (
                      <div className="ml-2 mt-2 text-red-500">{formik.errors.type}</div>
                  )}
                </div>
                <div className="mb-4 flex flex-col justify-between gap-2">
                  <InputField
                      disabled={true}
                      label={t("target")}
                      placeholder={t("target")}
                      name="targetId"
                      type="text"
                      state={formik.errors.targetId && submitted && "error"}
                      value={formik.values.targetId}
                  />
                  {formik.errors.targetId && submitted && (
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
                          clearTarget();
                        }}
                    >
                      {componentOptions.map((option) => (
                          <option
                              key={option.value}
                              value={option.value}
                              className="text-black dark:text-white"
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
                          component={getComponent(targetComponent)}
                          onSave={onSave}
                          onClose={onClose}
                      />
                    </div>
                    <div className="flex-1">
                      <button
                          type="button"
                          onClick={clearTarget}
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
                          state={formik.errors.parentId && submitted && "error"}
                          value={formik.values.parentId}
                      />
                      {formik.errors.parentId && submitted && (
                          <div className="ml-2 mt-2 text-red-500">
                            {formik.errors.parentId}
                          </div>
                      )}
                      <div className="flex flex-row justify-between gap-2">
                        <div className="flex-1">
                          <Selectdialog
                              extra="w-full rounded-xl bg-gradient-to-br from-[#EA52F8] to-[#0066FF] px-5 py-3 text-base font-medium text-white transition duration-200 hover:shadow-lg hover:shadow-[#0066FF]/25"
                              buttonText={t("user")}
                              component={<Comment targetId={formik.values.targetId} header={headerParent()} actionButtons={actionButtonsParent} />}
                              onSave={onParentSave}
                              onClose={onParentClose}
                          />
                        </div>
                        <div className="flex-1">
                          <button
                              type="button"
                              onClick={() => {
                                formik.setFieldValue("parentId", "");
                                setSelectedParent(null);
                              }}
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
                      state={formik.errors.userId && submitted && "error"}
                      value={formik.values.userId}
                  />
                  {formik.errors.userId && submitted && (
                      <div className="ml-2 mt-2 text-red-500">
                        {formik.errors.userId}
                      </div>
                  )}
                  <div className="flex flex-row justify-between gap-2">
                    <div className="flex-1">
                      <Selectdialog
                          extra="w-full rounded-xl bg-gradient-to-br from-[#EA52F8] to-[#0066FF] px-5 py-3 text-base font-medium text-white transition duration-200 hover:shadow-lg hover:shadow-[#0066FF]/25"
                          buttonText={t("user")}
                          component={<Users header={headerUsers()} actionButtons={actionButtonsUsers} />}
                          onSave={onUserSave}
                          onClose={onUserClose}
                      />
                    </div>
                    <div className="flex-1">
                      <button
                          type="button"
                          onClick={() => {
                            formik.setFieldValue("userId", "");
                            setSelectedUser(null);
                          }}
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
              state={formik.errors.content && submitted && "error"}
              label={t("comment")}
              placeholder={t("comment")}
              cols="30"
              rows="7"
              value={formik.values.content}
              onChange={formik.handleChange}
            />
            {formik.errors.content && submitted && (
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
              onClick={handleSubmitFormik}
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
