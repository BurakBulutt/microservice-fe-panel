import DefaultTable from "../../../components/table/CheckTable";
import React, { useEffect, useState } from "react";
import { commentColumnsData } from "../../../components/table/columnsData";
import { CommentService } from "../../../service/CommentService";
import { FaEdit, FaIdCard, FaPlus, FaTrash } from "react-icons/fa";
import UserBanner from "./components/user";
import Reply from "./components/reply";
import CommentDialog from "./components/dialog";
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useToast } from "../../../utils/toast/toast";
import CustomModal from "../../../components/modal";
import IdCard from "../../../components/idcard";
import { useFormik } from "formik";
import {
  CommentCreateValidationSchema,
  CommentUpdateValidationSchema,
} from "../../../utils/validation/ValidationSchemas";

const Comment = (props) => {
  const {targetId} = props;
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState(undefined);
  const service = new CommentService();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [targetFilter, setTargetFilter] = useState("");
  const { t } = useTranslation();
  const toast = useToast();
  const [validationSchema, setValidationSchema] = useState(
    CommentCreateValidationSchema
  );
  const [dialogVisible, setDialogVisible] = useState(false);
  const [submitted,setSubmitted] = useState(false);

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
    onSubmit: (values) => {
      if (values.id) {
        updateItem(values);
      } else {
        createItem(values);
      }
    }
  });

  useEffect(() => {
    const params = {
      page: page,
      size: size,
    };
    if (targetFilter.length > 0) {
      params.target = targetFilter;
    }
    getItems(params);
  }, [page, size, targetFilter]);

  const getItems = (params) => {
    if (targetId) {
      service
          .getAllByTarget(params,targetId)
          .then((response) => {
            if (response.status === 200) {
              setItems(response.data);
            }
          })
          .catch((error) => {
            catchError(error);
          });
    } else {
      service
          .getAll(params)
          .then((response) => {
            if (response.status === 200) {
              setItems(response.data);
            }
          })
          .catch((error) => {
            catchError(error);
          });
    }
  };

  const createItem = (request) => {
    service
        .create(request)
        .then((response) => {
          if (response.status === 201) {
            toast.success(t("success"),{
              onClose: () => getItems({
                page: page,
                size: size,
              })
            });
            hideDialog();
          }
        })
        .catch((error) => {
          catchError(error);
        });
  };

  const updateItem = (request) => {
    service
      .update(request.id, request)
      .then((response) => {
        if (response.status === 204) {
          toast.success(t("success"));
        }
      })
      .catch((error) => {
        catchError(error);
      });
  };

  const handleDelete = (id) => {
    service
      .delete(id)
      .then((response) => {
        if (response.status === 204) {
          toast.success(t("success"), {
            onClose: () => getItems({
              page: page,
              size: size,
            })
          });
          hideDialog();
        }
      })
      .catch((error) => {
        catchError(error);
      });
  };

  const catchError = (error) => {
    toast.error(error.message);
  };

  const hideDialog = () => {
    formik.resetForm();
    setDialogVisible(false);
    setSubmitted(false);
  };

  const handleSubmitFormik = () => {
    if (formik.values.type === "COMMENT") {
      formik.setFieldValue("parentId", null);
    }
    formik.handleSubmit();
    setSubmitted(true);
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
    setSelectedItems([]);
    setSize(size);
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
                {t("create")}
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
        <div className="flex h-full items-center rounded-full bg-lightPrimary pb-4 pt-4 text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[350px]">
          <p className="pl-3 pr-2 text-xl">
            <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
          <input
            type="text"
            placeholder="Search..."
            className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white"
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
        setTargetFilter(value);
      } else {
        setTargetFilter("");
      }
    }
  };
  const actionButtons = (data) => {
    return props.actionButtons ? props.actionButtons(data) : (
      <div className="flex space-x-2">
        <CustomModal
          title={"ID"}
          component={<IdCard id={data.id} />}
          extra={
            "flex cursor-pointer items-center justify-center rounded-lg bg-brand-500 p-2 text-white hover:bg-brand-600"
          }
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
      </div>
    );
  };

  const modalComponent = (data, accessor) => {
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
  };

  return (
    <>
      <CommentDialog
          formik={formik}
          dialogVisible={dialogVisible}
          hideDialog={hideDialog}
          submitted={submitted}
          handleSubmitFormik={handleSubmitFormik}/>
      <DefaultTable
        header={header}
        columnsData={commentColumnsData}
        tableData={items}
        selectedItems={selectedItems}
        actionButtons={actionButtons}
        handleSelect={handleSelect}
        handleMultipleSelect={handleMultipleSelect}
        handlePageChange={handlePageChange}
        handleOnRowsPerPageChange={handleOnRowsPerPageChange}
        modalComponent={modalComponent}
      />
    </>
  );
};

export default Comment;
