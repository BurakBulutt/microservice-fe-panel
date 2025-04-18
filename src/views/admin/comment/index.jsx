import DefaultTable from "../../../components/table/DefaultTable";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import { commentColumnsData } from "../../../components/table/columnsData";
import { CommentService } from "../../../service/CommentService";
import { FaEdit, FaIdCard, FaTrash } from "react-icons/fa";
import UserBanner from "./components/user";
import Reply from "./components/reply";
import CommentDialog from "./components/dialog";
import { useTranslation } from "react-i18next";
import { useToast } from "../../../utils/toast/toast";
import CustomModal from "../../../components/modal";
import IdCard from "../../../components/idcard";
import { useFormik } from "formik";
import {
  CommentCreateValidationSchema,
  CommentUpdateValidationSchema,
} from "../../../utils/validation/ValidationSchemas";

import ActionButton from "../../../components/actionbutton";
import Header from "../../../components/header";
import SearchBox from "../../../components/searchbox";

const Comment = (props) => {
  const { targetId } = props;
  const [items, setItems] = useState({
    content: [],
    page: null,
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const service = useMemo(() => new CommentService(),[]);
  const { t } = useTranslation();
  const toast = useToast();
  const [validationSchema, setValidationSchema] = useState(
    CommentCreateValidationSchema
  );
  const [dialogVisible, setDialogVisible] = useState(false);
  const [requestParams, setRequestParams] = useState({
    page: 0,
    size: 10,
    target: null,
  });

  const baseItem = {
    content: "",
    userId: null,
    type: "COMMENT",
    targetId: null,
    parentId: null,
  };
  const formik = useFormik({
    validationSchema: validationSchema,
    initialValues: baseItem,
    validateOnMount: false,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      if (values.id) {
        updateItem(values);
      } else {
        createItem(values);
      }
      setDialogVisible(false);
    },
  });

  const catchError = useCallback((error, options) => {
    toast.error(error.message, options);
  }, [toast]);

  const getItems = useCallback(() => {
    if (targetId) {
      service
          .getAllByTarget(requestParams, targetId)
          .then((response) => {
            if (response.status === 200) {
              setItems(response.data);
            }
          })
          .catch((error) => {
            catchError(error,{});
          });
    } else {
      service
          .getAll(requestParams)
          .then((response) => {
            if (response.status === 200) {
              setItems(response.data);
            }
          })
          .catch((error) => {
            catchError(error,{});
          });
    }
  }, [requestParams, catchError, service,targetId]);

  useEffect(() => {
    getItems();
  }, [getItems]);

  const createItem = (request) => {
    service
      .create(request)
      .then((response) => {
        if (response.status === 201) {
          toast.success(t("success"), {
            onClose: getItems
          });
        }
      })
      .catch((error) => {
        catchError(error,{});
      });
  };

  const updateItem = (request) => {
    service
      .update(request.id, request)
      .then((response) => {
        if (response.status === 204) {
          toast.success(t("success"),{
            onClose: getItems
          });
        }
      })
      .catch((error) => {
        catchError(error,{});
      });
  };

  const deleteItem = (id) => {
    service
        .delete(id)
        .then((response) => {
          if (response.status === 204) {
            toast.success(t("success"), {
              onClose: getItems
            });
          }
        })
        .catch((error) => {
          catchError(error,{});
        });
  }

  const handleSubmitFormik = () => {
    if (formik.values.type === "COMMENT") {
      formik.setFieldValue("parentId", null);
    }
    formik.handleSubmit();
  };
  const hideDialog = () => {
    formik.resetForm();
    setDialogVisible(false);
  };
  const handleCreate = () => {
    setValidationSchema(CommentCreateValidationSchema);
    formik.setValues(baseItem);
    setDialogVisible(true);
  };
  const handleUpdate = (data) => {
    setValidationSchema(CommentUpdateValidationSchema);
    formik.setValues({
      id: data.id,
      content: data.content,
    });
    setDialogVisible(true);
  };
  const handleDelete = (id) => {
    deleteItem(id);
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
    setRequestParams((prevState) => ({ ...prevState, page: 0 }));

    if (e.key === "Enter") {
      const value = e.target.value.trim();
      if (value) {
        setRequestParams((prevState) => ({
          ...prevState,
          target: value,
        }));
      } else {
        setRequestParams((prevState) => ({ ...prevState, target: null }));
      }
    }
  }, []);

  const header = useCallback(() => {
    return (
        <div className="flex w-full flex-row items-center justify-between">
          {props.header ? (
              props.header()
          ) : (
              <Header
                  onBulkDelete={() => console.log(selectedItems)}
                  itemsLength={selectedItems.length}
                  onCreate={handleCreate}
              />
          )}
          <SearchBox onKeyDown={searchKeyDown} />
        </div>
    );
  },[selectedItems,props.header]);

  const actionButtons = useCallback((data) => {
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
      </div>
    );
  },[props.actionButtons]);

  const modalComponent = useCallback((data, accessor) => {
    switch (accessor) {
      case "content":
        return (
          <p className="text-inherit block font-sans text-xl font-normal leading-relaxed text-navy-800 antialiased dark:text-white">
            {data}
          </p>
        );
      case "user":
        return <UserBanner data={data} />;
      case "parent":
        return data && <Reply data={Array(data)} />;
      case "commentList":
        return <Reply data={data} />;
      default:
        return <></>;
    }
  },[]);

  return items.page && (
    <>
      <CommentDialog
        formik={formik}
        dialogVisible={dialogVisible}
        hideDialog={hideDialog}
        handleSubmitFormik={handleSubmitFormik}
      />
      <DefaultTable
        header={header}
        columnsData={commentColumnsData}
        tableData={items}
        selectedItems={selectedItems}
        actionButtons={actionButtons}
        handleSelect={handleSelect}
        onPageChange={onPageChange}
        modalComponent={modalComponent}
      />
    </>
  );
};

export default Comment;
