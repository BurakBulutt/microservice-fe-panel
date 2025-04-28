import { usersColumnsData } from "../../../components/table/columnsData";
import {
  FaEdit,
  FaIdCard,
  FaMailBulk,
  FaTrash,
  FaUserLock,
} from "react-icons/fa";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { UserService } from "../../../service/UserService";
import UserDialog from "./components/dialog";
import { useFormik } from "formik";
import {
  UserCreateValidationSchema,
  UserUpdateValidationSchema,
} from "../../../utils/validation/ValidationSchemas";
import DefaultTable from "../../../components/table/DefaultTable";
import CustomModal from "../../../components/modal";
import IdCard from "../../../components/idcard";
import { useTranslation } from "react-i18next";
import { useToast } from "../../../utils/toast/toast";
import Header from "../../../components/header";
import ActionButton from "../../../components/actionbutton";
import Card from "components/card";
import Paginator from "components/table/Paginator";

const service = new UserService();

const Users = (props) => {
  const [items, setItems] = useState({
    content: [],
    page: {
      number: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
    },
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [validationSchema, setValidationSchema] = useState(
    UserCreateValidationSchema
  );
  const { t } = useTranslation();
  const toast = useToast();
  const [requestParams, setRequestParams] = useState({
    page: 0,
    size: 10,
    username: null,
  });

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
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMounted: false,
    onSubmit(values) {
      if (values.id) {
        updateItem(values);
      } else {
        createItem(values);
      }
      setDialogVisible(false);
    },
  });

  const catchError = useCallback(
    (error, options) => {
      toast.error(error.message, options);
    },
    [toast]
  );

  const getItems = useCallback(() => {
    service
      .filter(requestParams)
      .then((response) => {
        if (response.status === 200) {
          setItems(response.data);
        }
      })
      .catch((error) => {
        catchError(error, {});
      });
  }, [requestParams, catchError]);

  const createItem = (request) => {
    service
      .createUser(request)
      .then((response) => {
        if (response.status === 201) {
          toast.success(t("success"), {
            onClose: getItems,
          });
        }
      })
      .catch((error) => {
        catchError(error, {});
      });
  };

  const updateItem = (request) => {
    service
      .updateUser(request.id, request)
      .then((response) => {
        if (response.status === 204) {
          toast.success(t("success"), {
            onClose: getItems,
          });
        }
      })
      .catch((error) => {
        catchError(error, {});
      });
  };

  const deleteItem = (id) => {
    service
      .deleteUser(id)
      .then((response) => {
        if (response.status === 204) {
          toast.success(t("success"), {
            onClose: getItems,
          });
        }
      })
      .catch((error) => {
        catchError(error, {});
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
      .catch((error) => {
        catchError(error, {});
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
      .catch((error) => {
        catchError(error, {});
      });
  };

  useEffect(() => {
    getItems();
  }, [getItems]);

  const handleSubmitFormik = () => {
    formik.handleSubmit();
  };
  const hideDialog = () => {
    formik.resetForm();
    setDialogVisible(false);
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
    deleteItem(id);
  };
  const handleVerify = (id) => {
    verifyUser(id);
  };
  const handleResetPassword = (id) => {
    userResetPassword(id);
  };

  const handleSelect = useCallback((e, items) => {
    if (e.target.checked) {
      setSelectedItems((prev) =>
        Array.isArray(items)
          ? [...new Set([...prev, ...items])]
          : [...prev, items]
      );
    } else {
      setSelectedItems((prev) =>
        Array.isArray(items)
          ? prev.filter((item) => !items.includes(item))
          : prev.filter((item) => item !== items)
      );
    }
  }, []);

  const onPageChange = useCallback((page, size) => {
    setRequestParams((prev) => {
      if (prev.page === page && prev.size === size) return prev;

      setSelectedItems([]);
      return { ...prev, page, size };
    });
  }, []);

  const searchKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      const value = e.target.value.trim();

      setRequestParams((prevState) => ({
        ...prevState,
        page: 0,
        username: value ? value : null,
      }));
    }
  }, []);

  const actionButtons = useCallback(
    (data) => {
      return props.actionButtons ? (
        props.actionButtons(data)
      ) : (
        <div className="flex space-x-2">
          <CustomModal
            title={"ID"}
            component={<IdCard id={data.id} />}
            extra={
              "flex cursor-pointer items-center justify-center rounded-lg bg-brand-500 p-2 text-white hover:bg-brand-600"
            }
            buttonText={<FaIdCard size={24} />}
          />
          <ActionButton
            onClick={() => handleUpdate(data)}
            icon={<FaEdit size={24} />}
            color={"blue"}
            label={t("update")}
          />
          <ActionButton
            onClick={() => handleDelete(data.id)}
            icon={<FaTrash size={24} />}
            color={"red"}
            label={t("delete")}
          />
          <ActionButton
            onClick={() => handleVerify(data.id)}
            icon={<FaMailBulk size={24} />}
            color={"yellow"}
            label={t("emailVerified")}
          />
          <ActionButton
            onClick={() => handleResetPassword(data.id)}
            icon={<FaUserLock size={24} />}
            color={"green"}
            label={t("resetPassword")}
          />
        </div>
      );
    },
    [props.actionButtons]
  );

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <UserDialog
        formik={formik}
        dialogVisible={dialogVisible}
        hideDialog={hideDialog}
        handleSubmitFormik={handleSubmitFormik}
      />
      <Header
        onBulkDelete={() => console.log(selectedItems)}
        itemsLength={selectedItems.length}
        onCreate={handleCreate}
        searchKeyDown={searchKeyDown}
        component={props.header}
      />
      <DefaultTable 
        columnsData={usersColumnsData}
        tableData={items.content}
        actionButtons={actionButtons}
        selectedItems={selectedItems}
        handleSelect={handleSelect}
        onPageChange={onPageChange}
      />
      <Paginator page={items.page} onPageChange={onPageChange} />
    </Card>
  );
};
export default Users;
