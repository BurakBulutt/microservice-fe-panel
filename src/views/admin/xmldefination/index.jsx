import DefaultTable from "../../../components/table/DefaultTable";
import { xmlDefinitionColumnsData } from "../../../components/table/columnsData";
import React, { useCallback, useEffect, useState } from "react";
import { FaIdCard, FaTrash } from "react-icons/fa";
import { useFormik } from "formik";
import CustomModal from "../../../components/modal";
import IdCard from "../../../components/idcard";
import { useTranslation } from "react-i18next";
import { useToast } from "../../../utils/toast/toast";

import Header from "../../../components/header";
import ActionButton from "../../../components/actionbutton";
import Card from "components/card";
import Paginator from "components/table/Paginator";
import { XmlDefinitionService } from "service/XmlDefinitionService";
import * as Yup from "yup";
import XmlDefinitionDialog from "./components/dialog";

const service = new XmlDefinitionService();

const XmlDefinition = (props) => {
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
  const { t } = useTranslation();
  const toast = useToast();
  const [requestParams, setRequestParams] = useState({
    page: 0,
    size: 10,
  });

  const baseItem = {
    type: "CONTENT",
    base64: null,
  };
  const formik = useFormik({
    initialValues: baseItem,
    validationSchema: Yup.object({
      type: Yup.string().required("Type is Required"),
      base64: Yup.string().required("File is Required"),
    }),
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: (values) => {
      importXmlDefinition(values)
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
      .getAll(requestParams)
      .then((response) => {
        if (response.status === 200) {
          setItems(response.data);
        }
      })
      .catch((error) => {
        catchError(error, {});
      });
  }, [requestParams, catchError]);

  const importXmlDefinition = (request) => {
    service
    .import(request)
    .then((response) => {
      if (response.status === 201) {
        toast.success(t("success"), {
          onClose: getItems,
        });
        hideDialog();
      }
    })
    .catch((error) => {
      catchError(error, {});
    });
  };
  const deleteXmlDefinition = (id) => {
    service
      .delete(id)
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
    formik.resetForm();
    formik.setValues(baseItem);
    setDialogVisible(true);
  };
  const handleDelete = (id) => {
    deleteXmlDefinition(id);
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
            onClick={() => handleDelete(data.id)}
            icon={<FaTrash size={24} />}
            color={"red"}
            label={t("delete")}
          />
        </div>
      );
    },
    [props.actionButtons]
  );

  const modalComponent = useCallback((data, accessor) => {
    return (
      <p className="text-inherit block font-sans text-xl font-normal leading-relaxed text-navy-800 antialiased dark:text-white">
        {data}
      </p>
    );
  }, []);

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <XmlDefinitionDialog
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
        columnsData={xmlDefinitionColumnsData}
        tableData={items.content}
        actionButtons={actionButtons}
        selectedItems={selectedItems}
        handleSelect={handleSelect}
        onPageChange={onPageChange}
        modalComponent={modalComponent}
      />
      <Paginator page={items.page} onPageChange={onPageChange} />
    </Card>
  );
};

export default XmlDefinition;
