import React from "react";

import {Dialog} from "@headlessui/react";
import {useDisclosure} from "@chakra-ui/hooks";
import {FaCheck, FaDiscord, FaTimes} from "react-icons/fa";

const SelectDialog=(props) => {
    const {extra,buttonText,component} = props;
    const {isOpen,onOpen,onClose} = useDisclosure();

    const close = (e) => {
        props.onClose(e);
        onClose(e);
    }

    return (
      <div>
        <button
            className={extra}
            onClick={onOpen}
        >
          {buttonText}
        </button>
        <Dialog
          open={isOpen}
          onClose={close}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          <div className="flex min-h-screen items-center justify-center">
            <Dialog.Panel className="z-20 h-full max-h-[100vh] w-full max-w-6xl overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg space-y-4">
              <Dialog.Title
                as="h3"
                className="mb-4 text-lg font-medium leading-6 text-gray-900"
              >
                {" "}
              </Dialog.Title>
              {component}
              <div className="flex justify-end gap-2">
                  <button
                      type="button"
                      className="cursor-pointer rounded-md bg-red-500 px-4 py-2 font-bold text-white"
                      onClick={close}
                  >
                      Close
                  </button>
                  <button
                      type="button"
                      className="cursor-pointer rounded-md bg-green-500 px-4 py-2 font-bold text-white"
                      onClick={(e) => {
                          props.onSave(e);
                          onClose();
                      }}
                  >
                      Save
                  </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    );
}
export default SelectDialog;