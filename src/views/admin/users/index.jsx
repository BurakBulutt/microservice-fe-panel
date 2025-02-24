import CheckTable from "../tables/components/CheckTable";
import { usersColumnsData } from "../tables/variables/columnsData";
import { FaEdit, FaMailBulk, FaTrash, FaUserLock } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { UserService } from "../../../service/UserService";
import { useKeycloak } from "@react-keycloak/web";
import UserDialog from "./components/UserDialog";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import {
  UserCreateValidationSchema,
  UserUpdateValidationSchema,
} from "../../../utils/validation/ValidationSchemas";

const Users = () => {
  const { keycloak } = useKeycloak();
  const [users, setUsers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationSchema, setValidationSchema] = useState(UserCreateValidationSchema);
  const service = new UserService(keycloak);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (keycloak.authenticated) {
      getUsers(page, rowsPerPage);
    }
  }, [count]);

  useEffect(() => {
    if (keycloak.authenticated) {
      getCount();
    }
  }, [keycloak.authenticated]);

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

  const getCount = () => {
    service.usersCount().then((response) => {
      if (response.status === 200) {
        setCount(response.data);
      }
      console.log(response);
    });
  };

  const getUsers = (page, size) => {
    service.getAllUsers({ page: page, size: size }).then((response) => {
      if (response.status === 200) {
        setUsers(response.data);
      }
      console.log(response);
    });
  };

  const createUser = (request) => {
    service
      .createUser(request)
      .then((response) => {
        if (response.status === 201) {
          toast.success("Create Success", {
            position: "top-center",
            autoClose: 3000,
            onClose: getCount,
          });
          hideDialog();
        }
      })
      .catch((error) => {
        if (error.status === 409) {
          toast.error(`User Exists : ${request.username}`, {
            position: "top-center",
            autoClose: 3000,
          });
        }
      });
  };

  const updateUser = (request) => {
    service
      .updateUser(request.id, request)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Update Success", {
            position: "top-center",
            autoClose: 3000,
            onClose: getUsers(page,rowsPerPage),
          });
          hideDialog();
        }
      })
      .catch((err) => {
        if (err.status === 404) {
          toast.error(`User Not Found -> ${request.id}`, {
            position: "top-center",
            autoClose: 3000,
          });
        }
      });
  };

  const handleDelete = (id) => {
    service
      .deleteUser(id)
      .then((response) => {
        if (response.status === 204) {
          toast.success("Delete Success", {
            position: "top-center",
            autoClose: 3000,
            onClose: getCount,
          });
        }
      })
      .catch((err) => {
        if (err.status === 404) {
          toast.error(`User Not Found -> ${id}`, {
            position: "top-center",
            autoClose: 3000,
          });
        }
      });
  };

  const handleVerify = (id) => {
    service
      .verifyEmail(id)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Delete Success", {
            position: "top-center",
            autoClose: 3000,
            onClose: getCount,
          });
        }
      })
      .catch((err) => {
        if (err.status === 404) {
          toast.error(`User Not Found -> ${id}`, {
            position: "top-center",
            autoClose: 3000,
          });
        } else if (err.status === 500) {
          toast.error(`INTERNAL SERVER ERROR`, {
            position: "top-center",
            autoClose: 3000,
          });
        }
      });
  };

  const handleResetPassword = (id) => {
    service
      .resetUserPassword(id)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Delete Success", {
            position: "top-center",
            autoClose: 3000,
            onClose: getCount,
          });
        }
      })
      .catch((err) => {
        if (err.status === 404) {
          toast.error(`User Not Found -> ${id}`, {
            position: "top-center",
            autoClose: 3000,
          });
        } else if (err.status === 500) {
          toast.error(`INTERNAL SERVER ERROR`, {
            position: "top-center",
            autoClose: 3000,
          });
        }
      });
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
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const header = () => {
    return (
      <div className="flex items-center justify-between space-x-4 py-4">
        <button
          className="rounded-lg bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
          onClick={() => {
            handleCreate();
          }}
        >
          Yeni
        </button>

        <button
          className={`rounded-lg px-4 py-2 font-bold text-white 
                    ${
                      selectedItems.length === 0
                        ? "cursor-not-allowed bg-red-300"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
          onClick={() => {}}
        >
          Toplu Sil
        </button>
      </div>
    );
  };
  const actionButtons = (data) => {
    return (
      <div className="flex space-x-2">
        <button
          className="flex cursor-pointer items-center justify-center rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
          onClick={() => handleUpdate(data)}
          aria-label="Güncelle"
        >
          <FaEdit size={24} />
        </button>
        <button
          className="flex cursor-pointer items-center justify-center rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
          onClick={() => handleDelete(data.id)}
          aria-label="Veriyi Sil"
        >
          <FaTrash size={24} />
        </button>
        <button
          className="flex cursor-pointer items-center justify-center rounded-lg bg-yellow-500 p-2 text-white hover:bg-yellow-600"
          onClick={() => handleVerify(data.id)}
          aria-label="Verify Email"
        >
          <FaMailBulk size={24} />
        </button>
        <button
          className="flex cursor-pointer items-center justify-center rounded-lg bg-green-500 p-2 text-white hover:bg-green-600"
          onClick={() => handleResetPassword(data.id)}
          aria-label="Reset Password"
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
      <CheckTable
        header={header()}
        columnsData={usersColumnsData}
        tableData={users}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        setPage={(newPage) => setPage(newPage)}
        onPageChange={(e, newPage) => handleChangePage(e, newPage)}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        actionButtons={actionButtons}
        selectedItems={selectedItems}
        handleSelect={(e, id) => handleSelect(e, id)}
      />
    </div>
  );
};
export default Users;
