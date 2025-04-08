import React from "react";
import { FaRegCopy } from "react-icons/fa";
import { useToast } from "../../utils/toast/toast";
import { useTranslation } from "react-i18next";

const IdCard = (props) => {
  const { id } = props;
  const { t } = useTranslation();
  const toast = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success(t("copy.success"), {
        icon: <FaRegCopy />,
      });
    } catch (err) {
      toast.error(t("copy.fail"), {
        icon: <FaRegCopy />,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div className="text-2xl font-semibold text-navy-700 dark:text-white">
        <span className="font-mono">{id}</span>
      </div>
      <button
        onClick={handleCopy}
        className="flex items-center justify-center rounded-full p-3 text-3xl text-gray-600 transition duration-200 hover:text-brand-500 dark:text-white"
      >
        <FaRegCopy />
      </button>
    </div>
  );
};

export default IdCard;
