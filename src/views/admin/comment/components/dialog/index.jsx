import { Dialog } from "@headlessui/react";
import React, {useEffect, useState} from "react";

import {useDisclosure} from "@chakra-ui/hooks";
import {FaEdit} from "react-icons/fa";
import TextField from "../../../../../components/fields/TextField";

const CommentDialog = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {data,handleUpdate} = props;
    const initComment = data?.content;
    const [field,setField] = useState(initComment);
    const [fieldState, setFieldState] = useState("success");

    useEffect(() => {
        if (field.length <= 0){
            setFieldState("error");
        }else {
            setFieldState("success");
        }
    }, [field]);


    const handleEvent =(e) => {
        console.log(data);
        console.log(e.target.value);
        setField(e.target.value);
    }

    return (
      <div>
        <button
          className="flex cursor-pointer items-center justify-center rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
          onClick={onOpen}
          aria-label="Güncelle"
        >
          <FaEdit size={24} />
        </button>
        <Dialog
          open={isOpen}
          onClose={onClose}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          <div className="flex min-h-screen items-center justify-center">
            <Dialog.Panel className="z-20 h-full max-h-[80vh]  w-full max-w-lg overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
              <Dialog.Title
                as="h3"
                className="mb-4 text-lg font-medium leading-6 text-gray-900"
              >
                {"Düzenle"}
              </Dialog.Title>
              <div className="mb-4">
                <TextField
                  id="textarea"
                  state={fieldState}
                  label="Comment"
                  placeholder="Yorum Yap"
                  cols="30"
                  rows="7"
                  value={field}
                  onChange={handleEvent}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-2 cursor-pointer rounded-md bg-red-500 px-4 py-2 font-bold text-white"
                >
                  İptal
                </button>
                <button
                    disabled={fieldState === "error"}
                  type="button"
                  className="cursor-pointer rounded-md bg-green-500 px-4 py-2 font-bold text-white"
                  onClick={() => {
                    handleUpdate(data.id, field);
                    onClose();
                  }}
                >
                  {"Kaydet"}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    );
};
export default CommentDialog;
