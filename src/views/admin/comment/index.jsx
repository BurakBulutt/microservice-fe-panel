import DefaultTable from "../../../components/table/CheckTable";
import React, { useEffect, useState } from "react";
import { commentColumnsData } from "../../../components/table/columnsData";
import { useKeycloak } from "@react-keycloak/web";
import { CommentService } from "../../../service/CommentService";
import { FaEdit, FaTrash } from "react-icons/fa";
import {toast} from "react-toastify";
import UserBanner from "./components/user";
import Reply from "./components/reply";
import CommentDialog from "./components/dialog";

const Comment = (props) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState(undefined);
  const { keycloak } = useKeycloak();
  const service = new CommentService(keycloak);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  useEffect(() => {
    if (keycloak.authenticated) {
      getItems({ page: page, size: size });
    }
  }, [keycloak.authenticated]);

  useEffect(() => {
    if (items !== undefined) {
      getItems({ page: page, size: size });
    }
  }, [page, size]);

  const getItems = (params) => {
    service.getAll(params).then(response => {
      if (response.status === 200) {
        setItems(response.data);
      }else {
        toast.error("Something went wrong", {
          position:'top-center',
          autoClose : 3000
        })
      }
    })
  }

  const handleUpdate = (id,data) => {
    service.update(id,{content:data}).then(response => {
      if (response.status === 200) {
        toast.success("Update Success",{
          position : 'top-center',
          autoClose : 3000
        })
      }
    })
  };

  const handleDelete = (id) => {
    service.delete(id).then((response) => {
      if (response.status === 200) {
        toast.success("Delete Success", {
          position: "top-center",
          autoClose: 3000,
          onClose: getItems,
        });
      }
    })
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
    setSelectedItems([])
    setPage(page);
  };

  const handleOnRowsPerPageChange = (size) => {
    setSelectedItems([])
    setSize(size);
  };

  const header = () => {
    return (
      <div className="flex items-center justify-between space-x-4 py-4">
        <button
          className={`rounded-xl px-5 py-3 text-base font-bold text-white transition duration-200 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 
                    ${
                      selectedItems.length === 0
                        ? "cursor-not-allowed bg-red-300"
                        : "bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-400"
                    }`}
          onClick={() => {
            console.log(selectedItems);
          }}
        >
          Toplu Sil
        </button>
      </div>
    );
  };
  const actionButtons = (data) => {
    return (
      <div className="flex space-x-2">
        <CommentDialog data={data} handleUpdate={handleUpdate} />
        <button
          className="flex cursor-pointer items-center justify-center rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
          onClick={() => handleDelete(data.id)}
          aria-label="Veriyi Sil"
        >
          <FaTrash size={24} />
        </button>
      </div>
    );
  };
  const modalComponent = (data,accessor) => {
    switch (accessor) {
      case "content":
        return <p className="text-navy-800 block font-sans text-xl font-normal leading-relaxed text-inherit antialiased dark:text-white">
          {data}
        </p>
      case "user":
        return <UserBanner data={data}/>
      case "parent":
        return data && <Reply data={Array(data)}/>
      case "commentList":
        return <Reply data={data}/>
      default:
        return <></>
    }
  }
  return (
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
  );
};

export default Comment;
