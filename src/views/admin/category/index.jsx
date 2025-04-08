import DefaultTable from "../../../components/table/CheckTable";
import { categoryColumnsData } from "../../../components/table/columnsData";
import React, { useEffect, useState } from "react";
import { FaEdit, FaIdCard, FaPlus, FaTrash } from "react-icons/fa";
import { useFormik } from "formik";
import { CategoryValidationSchema } from "../../../utils/validation/ValidationSchemas";
import CategoryDialog from "./components/dialog";
import { CategoryService } from "../../../service/CategoryService";
import CustomModal from "../../../components/modal";
import IdCard from "../../../components/idcard";
import { FiSearch } from "react-icons/fi";
import {useTranslation} from "react-i18next";
import {useToast} from "../../../utils/toast/toast";

const Category = (props) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState(undefined);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const[nameFilter, setNameFilter] = useState("");
  const service = new CategoryService();
  const {t} = useTranslation();
  const toast = useToast();

  const baseItem = {
    name: "",
    description: "",
    slug: "",
  };
  const formik = useFormik({
    initialValues: baseItem,
    validationSchema: CategoryValidationSchema,
    onSubmit: (values) => {
      if (values.id) {
        updateItem(values.id, values);
      } else {
        createItem(values);
      }
    },
  });

  useEffect(() => {
    const params = {
      page: page,
      size: size,
    }
    if (nameFilter.length > 0) {
      params.name = nameFilter;
    }
    getItems(params);
  }, [page, size,nameFilter]);

  const getItems = (params) => {
    service.getAll(params).then((response) => {
      if (response.status === 200) {
        setItems(response.data);
      }
    }).catch((error) => {
      catchError(error);
    });
  };
  const createItem = (request) => {
    service.create(request).then((response) => {
      if (response.status === 201) {
        toast.success(t("success"), {
          onClose: () => getItems({page:page, size:size})
        });
        hideDialog();
      }
    }).catch((error) => {
      catchError(error);
    });
  };
  const updateItem = (id, request) => {
    service.update(id, request).then((response) => {
      if (response.status === 204) {
        toast.success(t("success"));
        hideDialog();
      }
    }).catch((error) => {
      catchError(error);
    });
  };
  const deleteItem = (id) => {
    service.delete(id).then((response) => {
      if (response.status === 204) {
        toast.success(t("success"), {
          onClose: () => getItems({page:page, size:size})
        });
      }
    }).catch((error) => {
      catchError(error);
    });
  };

  const catchError = (error) => {
    toast.error(error.message);
  }

  const hideDialog = () => {
    formik.resetForm();
    setDialogVisible(false);
    setSubmitted(false);
  };
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
  const handleSubmitFormik = () => {
    formik.handleSubmit();
    setSubmitted(true);
    setDialogVisible(false);
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
    setPage(page);
    setSelectedItems([]);
  };
  const handleOnRowsPerPageChange = (size) => {
    setSize(size);
    setSelectedItems([]);
  };

  const header = () => {
    return props.header ? (
      props.header
    ) : (
      <div className="w-full flex flex-row justify-between items-center">
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
        setNameFilter(value);
      } else {
        setNameFilter("");
      }
    }
  };
  const actionButtons = (data) => {
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
        <button
          className="flex cursor-pointer items-center justify-center rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
          onClick={() => handleUpdate(data)}
          aria-label="Güncelle"
        >
          <FaEdit size={24} />
        </button>
        <button
          className="flex cursor-pointer items-center justify-center rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
          onClick={() => deleteItem(data.id)}
          aria-label="Veriyi Sil"
        >
          <FaTrash size={24} />
        </button>
      </div>
    );
  };

  return (
    <>
      <CategoryDialog
        formik={formik}
        dialogVisible={dialogVisible}
        hideDialog={hideDialog}
        submitted={submitted}
        handleSubmitFormik={handleSubmitFormik}
      />
      <DefaultTable
        header={header}
        columnsData={categoryColumnsData}
        tableData={items}
        selectedItems={selectedItems}
        actionButtons={actionButtons}
        handleSelect={handleSelect}
        handleMultipleSelect={handleMultipleSelect}
        handlePageChange={handlePageChange}
        handleOnRowsPerPageChange={handleOnRowsPerPageChange}
      />
    </>
  );
};

export default Category;
