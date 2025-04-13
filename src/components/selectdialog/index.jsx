import React from "react";

import {Dialog} from "@headlessui/react";
import {useDisclosure} from "@chakra-ui/hooks";
import {useTranslation} from "react-i18next";

const SelectDialog=(props) => {
    const {extra,buttonText,component} = props;
    const {isOpen,onOpen,onClose} = useDisclosure();
    const {t} = useTranslation();

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
            <Dialog.Panel className="z-20 max-h-[80vh] w-full max-w-fit overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg space-y-4 dark:!bg-navy-900 dark:border-brand-400">
              <Dialog.Title
                as="h3"
                className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-white"
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
                      {t("close")}
                  </button>
                  <button
                      type="button"
                      className="cursor-pointer rounded-md bg-green-500 px-4 py-2 font-bold text-white"
                      onClick={() => {
                          props.onSave();
                          onClose();
                      }}
                  >
                      {t("save")}
                  </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    );
}
export default SelectDialog;