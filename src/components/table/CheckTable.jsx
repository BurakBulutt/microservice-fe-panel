import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Checkbox from "components/checkbox";
import Card from "components/card";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import CustomModal from "../../components/modal/index";
import { useTranslation } from "react-i18next";
import enumFactory from "../../utils/enum/enumFactory";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { memo } from "react";


const DefaultTable = memo(({ tableData, columnsData,modalComponent,selectedItems,handleSelect,onPageChange,actionButtons,header }) => {
  const { t } = useTranslation();
  const firstRender = useRef(true);
  const columnHelper = createColumnHelper();
  const displayEnumVal = useCallback((data, enumType) => {
    const type = enumFactory(enumType);
    const msg = type[data]?.display;
    return t(`${msg}`)?.toUpperCase();
  },[t]);
  const [openPhotoId, setOpenPhotoId] = useState(null);
  const createColumns = useCallback(
    (columnsDatas) => {
      const tableColumns = [];

      columnsDatas
        .sort((a, b) => a.priority - b.priority)
        .forEach((columnsData, index) => {
          tableColumns.push(
            columnHelper.accessor(columnsData.accessor, {
              id: columnsData.accessor,
              header: () => (
                <p className="text-sm font-bold text-gray-600 dark:text-white">
                  {columnsData.header
                    ? t(`${columnsData.header}`).toUpperCase()
                    : t(`${columnsData.accessor}`).toUpperCase()}
                </p>
              ),
              cell: (info) => {
                const baseContent =
                  columnsData.type === "boolean" ? (
                    Boolean(info.getValue()) ? (
                      <div className="inline-block rounded-lg bg-green-500 px-3 py-2 text-xs font-bold uppercase text-white transition duration-200 dark:bg-green-400">
                        {t(`${columnsData.booleanTrue}`)}
                      </div>
                    ) : (
                      <div className="inline-block rounded-lg bg-red-500 px-3 py-2 text-xs font-bold uppercase text-white transition duration-200 dark:bg-red-400">
                        {t(`${columnsData.booleanFalse}`)}
                      </div>
                    )
                  ) : columnsData.type === "date" ? (
                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                      {new Date(info.getValue()).toISOString().split("T")[0]}
                    </p>
                  ) : columnsData.type === "image" ? (
                    <div className="ml-3">
                      <img
                        className="h-auto w-full max-w-[100px] rounded-lg object-cover"
                        onClick={() => setOpenPhotoId(info.row.id)}
                        src={info.getValue().trim()}
                        alt="#"
                      />
                      {openPhotoId === info.row.id && (
                        <Lightbox
                          mainSrc={info.getValue().trim()}
                          onCloseRequest={() => setOpenPhotoId(null)}
                        />
                      )}
                    </div>
                  ) : columnsData.type === "modal" ? (
                    <CustomModal
                      title={t(`${columnsData.accessor}`)}
                      component={modalComponent(
                        info.getValue(),
                        columnsData.accessor
                      )}
                      extra={
                        "linear rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                      }
                      buttonText={t("show").toUpperCase()}
                    />
                  ) : columnsData.type === "enum" ? (
                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                      {displayEnumVal(info.getValue(), columnsData.enumType)}
                    </p>
                  ) : columnsData.type === "list" ? (
                    <div className="flex flex-wrap gap-2">
                      {info.getValue()?.map((item, i) => (
                        <div
                          key={i}
                          className={`flex justify-center rounded-lg px-3 py-2 text-center text-xs font-bold uppercase text-white transition duration-200 bg-${columnsData.listColor}-500 dark:bg-${columnsData.listColor}-400`}
                        >
                          {item[columnsData.nameLabel]}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                      {info.getValue()}
                    </p>
                  );

                return index === 0 ? (
                  <div className="flex items-center gap-4">
                    <MemoizedCheckbox
                      checked={selectedItems.includes(
                        info.row.original.id
                      )}
                      onChange={(e) =>
                        handleSelect(e, info.row.original.id)
                      }
                    />
                    {baseContent}
                  </div>
                ) : (
                  baseContent
                );
              },
            })
          );
        });

      tableColumns.push(
        columnHelper.accessor("action", {
          id: "action",
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              {t("action").toUpperCase()}
            </p>
          ),
          cell: (info) => actionButtons(info.row.original),
        })
      );

      return tableColumns;
    },
    [displayEnumVal, openPhotoId,columnHelper,t,actionButtons,handleSelect,modalComponent,selectedItems]
  );
  const columns = useMemo(
    () => createColumns(columnsData),
    [columnsData, createColumns]
  );
  const data = tableData.content;
  const pageCount = tableData.page.totalPages;
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: tableData.page.number,
    pageSize: tableData.page.size,
  });

  const coreRowModel = useMemo(() => getCoreRowModel(), []);
  const sortedRowModel = useMemo(() => getSortedRowModel(), []);
  const paginationRowModel = useMemo(() => getPaginationRowModel(), []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: coreRowModel,
    getSortedRowModel: sortedRowModel,
    getPaginationRowModel: paginationRowModel,
    pageCount: pageCount,
    manualPagination: true,
    debugTable: false,
  });

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    onPageChange(pagination.pageIndex, pagination.pageSize);
  }, [pagination.pageIndex, pagination.pageSize,onPageChange]);

  const getPageOptions = () => {
    const totalElements = tableData.page.totalElements;
    const baseOptions = [1, 10, 20, 50];

    const allSmaller = baseOptions.every((opt) => totalElements > opt);

    const options = [...baseOptions];
    if (allSmaller) {
      options.push(totalElements);
    }

    return options;
  };

  const Pagination = () => {
    const currentPage = table.getState().pagination.pageIndex + 1;
    const pageCount = table.getPageCount();
    const isPreviousPage = table.getCanPreviousPage();
    const isNextPage = table.getCanNextPage();

    const getPageNumbers = () => {
      const pages = [];

      if (currentPage > 1) {
        pages.push(currentPage - 1);
      }

      pages.push(currentPage);

      if (currentPage < pageCount) {
        pages.push(currentPage + 1);
      }

      return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
      <div className="flex items-center space-x-2">
        {isPreviousPage && (
          <button
            onClick={() => table.previousPage()}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-800 dark:border-gray-500 dark:bg-navy-900 dark:text-white"
          >
            <FaAngleLeft size={12} />
          </button>
        )}

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

        {isNextPage && (
          <button
            onClick={() => table.nextPage()}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-800 dark:border-gray-500 dark:bg-navy-900 dark:text-white"
          >
            <FaAngleRight size={12} />
          </button>
        )}
      </div>
    );
  };

  const MemoizedCheckbox = React.memo(
    ({ checked, onChange }) => {
      return (
        <Checkbox
          defaultChecked={false}
          colorScheme="brandScheme"
          me="10px"
          checked={checked}
          onChange={onChange}
        />
      );
    },
    (prevProps, nextProps) =>
      prevProps.checked === nextProps.checked &&
      prevProps.onChange === nextProps.onChange
  );

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <header className="relative flex items-center justify-between pt-4">
        {header()}
      </header>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-start"
                  >
                    <div className="flex items-center space-x-4">
                      {index === 0 && (
                        <MemoizedCheckbox
                          checked={data.every((item) =>
                            selectedItems.includes(item.id)
                          )}
                          onChange={(e) =>
                            handleSelect(
                              e,
                              data.map((item) => item.id)
                            )
                          }
                        />
                      )}
                      <div
                        className="text-xs text-gray-200"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: "",
                          desc: "",
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0, data.length)
              .map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          className="min-w-[150px] border-white/0 py-3  pr-4"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between border-t px-4 py-3">
        <div className="flex items-center space-x-4 text-sm text-gray-400 dark:text-white">
          <span>
            {t("page")} {table.getState().pagination.pageIndex + 1} /{" "}
            {table.getPageCount()}
          </span>
          <select
            className="flex h-9 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-brand-500 dark:border-white/10 dark:bg-navy-900 dark:text-white dark:focus:border-brand-400"
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
        <Pagination />
      </div>
    </Card>
  );
},(prevProps,newProps) => 
prevProps.tableData === newProps.tableData && 
prevProps.columnsData === newProps.columnsData &&
prevProps.selectedItems === newProps.selectedItems && 
prevProps.handleSelect === newProps.handleSelect &&
prevProps.onPageChange === newProps.onPageChange
)

export default DefaultTable;
