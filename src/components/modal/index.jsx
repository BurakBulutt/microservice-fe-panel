import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/modal";
import { useDisclosure } from "@chakra-ui/hooks";
import Card from "../card";
import { useTranslation } from "react-i18next";
import React from "react";

const CustomModal = ({ component, title, extra, buttonText }) => {
      const { isOpen, onOpen, onClose } = useDisclosure();
      const { t } = useTranslation();

      return (
          <div>
            <button className={extra} onClick={onOpen}>
              {buttonText}
            </button>
            <Modal isOpen={isOpen} onClose={onClose} className="!z-[1010]">
              <ModalOverlay className="bg-[#000] !opacity-30" />
              <ModalContent className="!z-[1002] !m-auto !w-max min-w-[350px] !max-w-[85%] md:top-[12vh]">
                <ModalBody className="overflow-y-auto">
                  <Card extra="px-[30px] pt-[35px] pb-[40px] flex flex-col !z-[1004]">
                    <h1 className="mb-[20px] text-center text-2xl font-bold">
                      {title.toUpperCase()}
                    </h1>
                    {component}
                    <button
                        onClick={onClose}
                        className="linear mt-4 rounded-xl border-2 border-brand-500 px-5 py-3 text-base font-medium text-brand-500 transition duration-200 hover:bg-brand-600/5 active:bg-brand-700/5 dark:border-brand-400 dark:bg-brand-400/10 dark:text-white dark:hover:bg-brand-300/10 dark:active:bg-brand-200/10"
                    >
                      {t("close").toUpperCase()}
                    </button>
                  </Card>
                </ModalBody>
              </ModalContent>
            </Modal>
          </div>
      );
    }
export default CustomModal;
