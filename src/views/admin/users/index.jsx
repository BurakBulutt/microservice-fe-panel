import { usersColumnsData } from "../../../components/table/columnsData";
import {
  FaEdit,
  FaIdCard,
  FaMailBulk,
  FaPlus,
  FaTrash,
  FaUserLock,
} from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { UserService } from "../../../service/UserService";
import UserDialog from "./components/dialog";
import { useFormik } from "formik";
import {
  UserCreateValidationSchema,
  UserUpdateValidationSchema,
} from "../../../utils/validation/ValidationSchemas";
import DefaultTable from "../../../components/table/CheckTable";
import CustomModal from "../../../components/modal";
import IdCard from "../../../components/idcard";
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useToast } from "../../../utils/toast/toast";

const Users = (props) => {
  const [items, setItems] = useState(undefined);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationSchema, setValidationSchema] = useState(
    UserCreateValidationSchema
  );
  const { t } = useTranslation();
  const service = new UserService();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [usernameFilter, setUsernameFilter] = useState("");
  const toast = useToast();

  const baseRequest = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    passwordRe: "",
    isPasswordTemporary: false,
    enabled: false,
    emailVerified: false,
    requiredActions: [],
    birthdate: "",
  };
  const formik = useFormik({
    initialValues: baseRequest,
    validationSchema: validationSchema,
    onSubmit(values) {
      if (values.id) {
        updateUser(values);
      } else {
        createUser(values);
      }
    },
  });

  useEffect(() => {
    const params = {
      page: page,
      size: size,
    };
    if (usernameFilter.length > 0) {
      params.username = usernameFilter;
    }
    getItems(params);
  }, [page, size, usernameFilter]);

  const getItems = (params) => {
    service.getAllUsers(params).then((response) => {
      if (response.status === 200) {
        setItems(response.data);
      }
    });
  };

  const createUser = (request) => {
    service
      .createUser(request)
      .then((response) => {
        if (response.status === 201) {
          toast.success(t("success"), {
            onClose: getItems,
          });
          hideDialog();
        }
      })
      .catch((error) => {
        if (error.status === 409) {
          toast.error(t("conflictUsernameOrEmail"));
        }
      });
  };

  const updateUser = (request) => {
    service
      .updateUser(request.id, request)
      .then((response) => {
        if (response.status === 204) {
          toast.success(t("success"), {
            onClose: getItems,
          });
          hideDialog();
        }
      })
      .catch((err) => {
        if (err.status === 404) {
          toast.error(`${t("notFound")} -> ${request.id}`);
        } else if (err.status === 409) {
          toast.error(t("conflictUsernameOrEmail"));
        }
      });
  };

  const deleteUser = (id) => {
    service
      .deleteUser(id)
      .then((response) => {
        if (response.status === 204) {
          toast.success(t("success"), {
            onClose: getItems,
          });
        }
      })
      .catch((err) => {
        if (err.status === 404) {
          toast.error(`${t("notFound")} -> ${id}`);
        }
      });
  };

  const verifyUser = (id) => {
    service
      .verifyEmail(id)
      .then((response) => {
        if (response.status === 204) {
          toast.success(t("success"), {
            onClose: getItems,
          });
        }
      })
      .catch((err) => {
        if (err.status === 404) {
          toast.error(`${t("notFound")} -> ${id}`);
        }
      });
  };

  const userResetPassword = (id) => {
    service
      .resetUserPassword(id)
      .then((response) => {
        if (response.status === 204) {
          toast.success(t("success"), {
            onClose: getItems,
          });
        }
      })
      .catch((err) => {
        if (err.status === 404) {
          toast.error(`${t("notFound")} -> ${id}`);
        }
      });
  };

  const hideDialog = () => {
    formik.resetForm();
    setDialogVisible(false);
    setSubmitted(false);
  };
  const handleCreate = () => {
    setValidationSchema(UserCreateValidationSchema);
    formik.setValues(baseRequest);
    setDialogVisible(true);
  };
  const handleUpdate = (user) => {
    setValidationSchema(UserUpdateValidationSchema);
    formik.setValues(user);
    setDialogVisible(true);
  };
  const handleDelete = (id) => {
    deleteUser(id);
  };
  const handleVerify = (id) => {
    verifyUser(id);
  };
  const handleResetPassword = (id) => {
    userResetPassword(id);
  };
  const handleSubmitFormik = () => {
    setSubmitted(true);
    formik.handleSubmit();
  };

  const handleSelect = (e, id) => {
    if (e.target.checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    }
  };
  const handleMultipleSelect = (e, targets) => {
    if (e.target.checked) {
      setSelectedItems((prev) => [...new Set([...prev, ...targets])]);
    } else {
      setSelectedItems((prev) =>
        prev.filter((item) => !targets.includes(item))
      );
    }
  };

  const handlePageChange = (page) => {
    setSelectedItems([]);
    setPage(page);
  };
  const handleOnRowsPerPageChange = (size) => {
    setSize(size);
    setSelectedItems([]);
  };

  const header = () => {
    return (
      <div className="flex w-full flex-row items-center justify-between">
        {props.header ? props.header : (
            <div className="flex items-center justify-between space-x-4 py-4">
              <button
                  className="flex flex-col items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-base font-bold text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200"
                  onClick={() => handleCreate()}
              >
                <FaPlus />
                {t("save")}
              </button>
              <button
                  className={`flex flex-col items-center gap-2 rounded-xl px-5 py-3 text-base font-bold text-white transition duration-200 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 
                    ${
                      selectedItems.length === 0
                          ? "cursor-not-allowed bg-red-300"
                          : "bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-400"
                  }`}
                  onClick={() => {
                    console.log(selectedItems);
                  }}
              >
                <FaTrash />
                {t("deleteBulk")}
              </button>
            </div>
        )}
        <div className="flex h-full items-center rounded-full bg-lightPrimary pb-4 pt-4 text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
          <p className="pl-3 pr-2 text-xl">
            <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
          <input
            type="text"
            placeholder="Search..."
            className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
            onKeyDown={searchKeyDown}
          />
        </div>
      </div>
    );
  };
  const searchKeyDown = (e) => {
    if (e.key === "Enter") {
      const value = e.target.value.trim();
      if (value) {
        setUsernameFilter(value);
      } else {
        setUsernameFilter("");
      }
    }
  };
  const actionButtons = (data) => {
    return props.actionButtons ? props.actionButtons(data) : (
      <div className="flex space-x-2">
        <CustomModal
            title={"ID"}
            component={<IdCard id={data.id} />}
            extra={"flex cursor-pointer items-center justify-center rounded-lg bg-brand-500 p-2 text-white hover:bg-brand-600"}
            buttonText={<FaIdCard size={24} />}
        />
        <button
          className="flex cursor-pointer items-center justify-center rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
          onClick={() => handleUpdate(data)}
          aria-label={t("update")}
        >
          <FaEdit size={24} />
        </button>
        <button
          className="flex cursor-pointer items-center justify-center rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
          onClick={() => handleDelete(data.id)}
          aria-label={t("delete")}
        >
          <FaTrash size={24} />
        </button>
        <button
          className="flex cursor-pointer items-center justify-center rounded-lg bg-yellow-500 p-2 text-white hover:bg-yellow-600"
          onClick={() => handleVerify(data.id)}
          aria-label={t("emailVerified")}
        >
          <FaMailBulk size={24} />
        </button>
        <button
          className="flex cursor-pointer items-center justify-center rounded-lg bg-green-500 p-2 text-white hover:bg-green-600"
          onClick={() => handleResetPassword(data.id)}
          aria-label={t("resetPassword")}
        >
          <FaUserLock size={24} />
        </button>
      </div>
    );
  };

  return (
    <div>
      <UserDialog
        formik={formik}
        dialogVisible={dialogVisible}
        hideDialog={hideDialog}
        submitted={submitted}
        handleSubmitFormik={handleSubmitFormik}
      />
      <DefaultTable
        header={header}
        columnsData={usersColumnsData}
        tableData={items}
        actionButtons={actionButtons}
        selectedItems={selectedItems}
        handleSelect={(e, id) => handleSelect(e, id)}
        handleMultipleSelect={handleMultipleSelect}
        handlePageChange={handlePageChange}
        handleOnRowsPerPageChange={handleOnRowsPerPageChange}
      />
    </div>
  );
};
export default Users;
