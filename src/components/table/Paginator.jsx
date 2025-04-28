import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

const Paginator = ({ page, onPageChange }) => {
  const { t } = useTranslation();
  const currentPage = page.number + 1;
  const pageCount = page.totalPages;

  const isNextPage = currentPage < pageCount;
  const isPreviousPage = currentPage > 1;
  
  const pageNumbers = useMemo(() => {
    const totalPages = pageCount;
    const delta = 2;
    const range = [];

    for (let i = Math.max(1, currentPage - delta);i <= Math.min(totalPages, currentPage + delta);i++) {
      range.push(i);
    }

    return range;
  },[currentPage, pageCount]);

  const pageSizeOptions = useMemo(() => {
    const base = [1, 10, 20, 50];
    const shouldAddTotal = page.totalElements > Math.max(...base);

    return shouldAddTotal ? [...base, page.totalElements] : base;
  },[page.totalElements]);


  const handleSizeChange = useCallback((e) => {
    const newSize = parseInt(e.target.value, 10);
    onPageChange(0, newSize);
  }, [onPageChange]);

  const handlePageChange = useCallback((newPage) => {
    onPageChange(newPage - 1, page.size);
  }, [onPageChange, page.size]);

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t px-4 py-3 sm:flex-row">
      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-white">
        <span>
          {t("page")} {currentPage} / {pageCount}
        </span>
        <select
          aria-label="Page size"
          className="h-9 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-brand-500 dark:border-white/10 dark:bg-navy-900 dark:text-white dark:focus:border-brand-400"
          value={page.size}
          onChange={handleSizeChange}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
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

        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
              pageNum === currentPage
                ? "bg-brand-500 text-white dark:bg-brand-400"
                : "border border-gray-300 bg-white text-gray-800 dark:border-gray-400 dark:bg-navy-900 dark:text-white"
            }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
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

export default Paginator;
