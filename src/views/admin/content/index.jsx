import { contentsColumnsData } from "../../../components/table/columnsData";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {FaEdit, FaIdCard, FaTrash} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { ContentService } from "../../../service/ContentService";
import DefaultTable from "../../../components/table/DefaultTable";
import CustomModal from "../../../components/modal";
import IdCard from "../../../components/idcard";
import {useTranslation} from "react-i18next";
import {useToast} from "../../../utils/toast/toast";
import Header from "../../../components/header";
import SearchBox from "../../../components/searchbox";
import ActionButton from "../../../components/actionbutton";

const Content = (props) => {
  const [items, setItems] = useState({
    content: [],
    page: null,
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const location = useLocation();
  const {t} = useTranslation();
  const service = useMemo(() => new ContentService(), []);
  const toast = useToast();
  const navigate = useNavigate();
  const [requestParams, setRequestParams] = useState({
    page: 0,
    size: 10,
    name: null,
    category:null
  });

  const catchError = useCallback((error, options) => {
    toast.error(error.message, options);
  }, [toast]);

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
  }, [requestParams, catchError, service]);

  const deleteContent = (id) => {
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
          catchError(error);
        });
  };

  useEffect(() => {
    getItems();
  }, [getItems]);

  const handleCreate = () => {
    navigate(location.pathname + "/create");
  };
  const handleUpdate = (data) => {
    navigate(location.pathname + `/update/${data.id}`);
  };
  const handleDelete = (id) => {
    deleteContent(id);
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

  return items.page && (
    <DefaultTable
      header={header}
      columnsData={contentsColumnsData}
      tableData={items}
      selectedItems={selectedItems}
      actionButtons={actionButtons}
      handleSelect={handleSelect}
      onPageChange={onPageChange}
    />
  );
};
export default Content;
