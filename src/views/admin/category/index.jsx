import DefaultTable from "../../../components/table/CheckTable";
import { categoryColumnsData } from "../../../components/table/columnsData";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {FaEdit, FaIdCard, FaTrash} from "react-icons/fa";
import { useFormik } from "formik";
import { CategoryValidationSchema } from "../../../utils/validation/ValidationSchemas";
import CategoryDialog from "./components/dialog";
import { CategoryService } from "../../../service/CategoryService";
import CustomModal from "../../../components/modal";
import IdCard from "../../../components/idcard";
import {useTranslation} from "react-i18next";
import {useToast} from "../../../utils/toast/toast";

import Header from "../../../components/header";
import SearchBox from "../../../components/searchbox";
import ActionButton from "../../../components/actionbutton";

const Category = (props) => {
  const [items, setItems] = useState({
    content: [],
    page: {
      number: null,
      size: null,
      totalElements: null,
      totalPages: null,
    },
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const service = useMemo(() => new CategoryService(), []);
  const {t} = useTranslation();
  const toast = useToast();
  const [requestParams, setRequestParams] = useState({
    page: 0,
    size: 10,
    name: null,
  });

  const baseItem = {
    name: "",
    description: "",
    slug: "",
  };
  const formik = useFormik({
    initialValues: baseItem,
    validationSchema: CategoryValidationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: (values) => {
      if (values.id) {
        updateItem(values.id, values);
      } else {
        createItem(values);
      }
    },
  });

  const catchError = useCallback((error, options) => {
    toast.error(error.message, options);
  }, [toast]);

  const getItems = useCallback(() => {
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
  }, [requestParams, catchError, service]);

  const createItem = (request) => {
    service.create(request).then((response) => {
      if (response.status === 201) {
        toast.success(t("success"), {
          onClose: getItems
        });
        hideDialog();
      }
    }).catch((error) => {
      catchError(error,{});
    });
  };
  const updateItem = (id, request) => {
    service.update(id, request).then((response) => {
      if (response.status === 204) {
        toast.success(t("success"),{
          onClose: getItems
        });
        hideDialog();
      }
    }).catch((error) => {
      catchError(error,{});
    });
  };
  const deleteItem = (id) => {
    service.delete(id).then((response) => {
      if (response.status === 204) {
        toast.success(t("success"), {
          onClose: getItems
        });
      }
    }).catch((error) => {
      catchError(error,{});
    });
  };


  useEffect(() => {
    getItems();
  }, [getItems]);


  const handleSubmitFormik = () => {
    formik.handleSubmit();
  }
  const hideDialog = () => {
    formik.resetForm();
    setDialogVisible(false);
  }
  const handleCreate = () => {
    formik.resetForm();
    formik.setValues(baseItem);
    setDialogVisible(true);
  };
  const handleUpdate = (data) => {
    formik.resetForm();
    formik.setValues(data);
    setDialogVisible(true);
  };
  const handleDelete = (id) => {
    deleteItem(id);
  }

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
    setRequestParams((prev) => ({ ...prev, page: page, size: size }));
    setSelectedItems([]);
  }, []);

  const searchKeyDown = useCallback((e) => {
    setRequestParams((prevState) => ({ ...prevState, page: 0 }));

    if (e.key === "Enter") {
      const value = e.target.value.trim();
      if (value) {
        setRequestParams((prevState) => ({
          ...prevState,
          name: value,
        }));
      } else {
        setRequestParams((prevState) => ({ ...prevState, name: null }));
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
              extra={"flex cursor-pointer items-center justify-center rounded-lg bg-brand-500 p-2 text-white hover:bg-brand-600"}
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
              label={t("delete")}/>
        </div>
    );
  },[props.actionButtons]);

  return (
    <div>
      <CategoryDialog
        formik={formik}
        dialogVisible={dialogVisible}
        hideDialog={hideDialog}
        handleSubmitFormik={handleSubmitFormik}
      />
      <DefaultTable
        header={header}
        columnsData={categoryColumnsData}
        tableData={items}
        selectedItems={selectedItems}
        actionButtons={actionButtons}
        handleSelect={handleSelect}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default Category;
