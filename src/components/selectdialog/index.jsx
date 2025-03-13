import React from "react";

import {Dialog} from "@headlessui/react";
import {useDisclosure} from "@chakra-ui/hooks";

const SelectDialog=(props) => {
    const {isOpen,onOpen,onClose} = useDisclosure();

    return (
      <div>
        <button
            className="w-full rounded-xl bg-gradient-to-br from-[#EA52F8] to-[#0066FF] px-5 py-3 text-base font-medium text-white transition duration-200 hover:shadow-lg hover:shadow-[#0066FF]/25"          onClick={onOpen}
        >
          {props.buttonText}
        </button>
        <Dialog
          open={isOpen}
          onClose={onClose}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          <div className="flex min-h-screen items-center justify-center">
            <Dialog.Panel className="z-20 h-full max-h-[100vh] w-full max-w-6xl overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
              <Dialog.Title
                as="h3"
                className="mb-4 text-lg font-medium leading-6 text-gray-900"
              >
                {" "}
              </Dialog.Title>
              {props.component}
              <div className="mt-4 flex justify-end">
                  <button
                      type="button"
                      className="linear flex flex-row items-center rounded-xl bg-green-500 px-5 py-3 text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200"
                      data-ripple-light
                      onClick={onClose}
                  >
                      <svg
                          className="mr-2 fill-white"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          height="16"
                          width="16"
                      >
                          <path d="M7.979 14.771Q7.792 14.771 7.615 14.698Q7.438 14.625 7.271 14.458L3.75 10.938Q3.458 10.646 3.469 10.219Q3.479 9.792 3.771 9.5Q4.062 9.208 4.49 9.208Q4.917 9.208 5.188 9.5L8.021 12.333L14.833 5.521Q15.104 5.229 15.521 5.229Q15.938 5.229 16.229 5.521Q16.5 5.812 16.5 6.219Q16.5 6.625 16.229 6.917L8.688 14.458Q8.521 14.625 8.344 14.698Q8.167 14.771 7.979 14.771Z" />
                      </svg>
                      Save all changes
                  </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    );
}
export default SelectDialog;