import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";

const Paginator = ({ table, page }) => {
  const { t } = useTranslation();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageCount = table.getPageCount();
  const isPreviousPage = table.getCanPreviousPage();
  const isNextPage = table.getCanNextPage();

  const getPageNumbers = () => {
    const totalPages = pageCount;
    const delta = 2;
    const range = [];

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    return range;
  };

  const getPageOptions = () => {
    const base = [1, 10, 20, 50];
    const totalElements = page.totalElements;
    const shouldAddTotal = totalElements > Math.max(...base);

    return shouldAddTotal ? [...base, totalElements] : base;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t px-4 py-3 sm:flex-row">
      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-white">
        <span>
          {t("page")} {currentPage} / {pageCount}
        </span>
        <select
          aria-label="Page size"
          className="h-9 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-brand-500 dark:border-white/10 dark:bg-navy-900 dark:text-white dark:focus:border-brand-400"
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {getPageOptions().map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!isPreviousPage}
          className={`flex h-9 w-9 items-center justify-center rounded-full border ${
            isPreviousPage
              ? "border-gray-300 bg-white text-gray-800 dark:border-gray-500 dark:bg-navy-900 dark:text-white"
              : "cursor-not-allowed opacity-40"
          }`}
          aria-label="Previous Page"
        >
          <FaAngleLeft size={12} />
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => table.setPageIndex(page - 1)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
              page === currentPage
                ? "bg-brand-500 text-white dark:bg-brand-400"
                : "border border-gray-300 bg-white text-gray-800 dark:border-gray-400 dark:bg-navy-900 dark:text-white"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => table.nextPage()}
          disabled={!isNextPage}
          className={`flex h-9 w-9 items-center justify-center rounded-full border ${
            isNextPage
              ? "border-gray-300 bg-white text-gray-800 dark:border-gray-500 dark:bg-navy-900 dark:text-white"
              : "cursor-not-allowed opacity-40"
          }`}
          aria-label="Next Page"
        >
          <FaAngleRight size={12} />
        </button>
      </div>
    </div>
  );
};

function propsAreEqual(prevProps, nextProps) {

  console.log("prevTableSize",prevProps.table.getState().pagination.pageSize);
  console.log("nextTableSize",nextProps.table.getState().pagination.pageSize);

  return (
    prevProps.table.getState().pagination.pageSize === prevProps.page.size &&
    prevProps.table.getState().pagination.pageIndex === prevProps.page.number &&
    prevProps.page.number === nextProps.page.number &&
    prevProps.page.size === nextProps.page.size &&
    prevProps.page.totalElements === nextProps.page.totalElements &&
    prevProps.page.totalPages === nextProps.page.totalPages
  );
}

export default memo(Paginator,propsAreEqual);
