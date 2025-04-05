import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/modal";
import { useDisclosure } from "@chakra-ui/hooks";
import Card from "../card";


const CustomModal = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {component,title} = props;

  return (
    <div>
      <div onClick={onOpen}>
        <button className="linear rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
          {"show"}
        </button>
      </div>
      <Modal isOpen={isOpen} onClose={onClose} className="!z-[1010]">
        <ModalOverlay className="bg-[#000] !opacity-30" />
        <ModalContent className="!z-[1002] !m-auto !w-max min-w-[350px] !max-w-[85%] md:top-[12vh]">
          <ModalBody className="overflow-y-auto">
            <Card extra="px-[30px] pt-[35px] pb-[40px] max-w-[450px] flex flex-col !z-[1004]">
              <h1 className="mb-[20px] text-2xl font-bold">{title}</h1>
              {component}
              <button
                onClick={onClose}
                className="mt-4 linear rounded-xl border-2 border-red-500 px-5 py-3 text-base font-medium text-red-500 transition duration-200 hover:bg-red-600/5 active:bg-red-700/5 dark:border-red-400 dark:bg-red-400/10 dark:text-white dark:hover:bg-red-300/10 dark:active:bg-red-200/10"
              >
                {"KAPAT"}
              </button>
            </Card>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};
export default CustomModal;
