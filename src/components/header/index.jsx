import React, { memo } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Header = memo(
  ({ onCreate, onBulkDelete, itemsLength, extra }) => {
    const { t } = useTranslation();

    return (
      <div className="flex items-center justify-between space-x-4 py-4">
        <button
          className="flex flex-col items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-base font-bold text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200"
          onClick={onCreate}
        >
          <FaPlus />
          {t("create")}
        </button>
        <button
          className={`flex flex-col items-center gap-2 rounded-xl px-5 py-3 text-base font-bold text-white transition duration-200 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 
                    ${
                      itemsLength === 0
                        ? "cursor-not-allowed bg-red-300"
                        : "bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-400"
                    }`}
          onClick={onBulkDelete}
        >
          <FaTrash />
          {t("deleteBulk")}
        </button>
        {extra}
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.itemsLength === nextProps.itemsLength
);

export default Header;
