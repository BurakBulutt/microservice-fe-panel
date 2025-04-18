import React, {
  useCallback,
  useEffect,
  useMemo,
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
import { memo } from "react";
import Paginator from "./Paginator";

const columnHelper = createColumnHelper();

const DefaultTable = ({
  tableData,
  columnsData,
  modalComponent,
  selectedItems,
  handleSelect,
  onPageChange,
  actionButtons,
  header,
}) => {
  const { t } = useTranslation();
  const displayEnumVal = useCallback((data, enumType) => {
    const type = enumFactory(enumType);
    const msg = type[data]?.display;
    return t(`${msg}`)?.toUpperCase();
  }, []);
  const [openPhotoId, setOpenPhotoId] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: tableData.page.number,
    pageSize: tableData.page.size,
  });
  const data = tableData.content;
  const pageCount = tableData.page.totalPages;

  const createColumns = useMemo(() => {
    return [
      ...columnsData
        .sort((a, b) => a.priority - b.priority)
        .map((col, index) => {
          return columnHelper.accessor(col.accessor, {
            id: col.accessor,
            header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                {t(col.header || col.accessor).toUpperCase()}
              </p>
            ),
            cell: (info) => {
              const value = info.getValue();

              if (col.type === "boolean") {
                return (
                  <div className={`inline-block rounded-lg px-3 py-2 text-xs font-bold uppercase text-white transition duration-200 ${
                    value ? "bg-green-500 dark:bg-green-400" : "bg-red-500 dark:bg-red-400"
                  }`}>
                    {t(value ? col.booleanTrue : col.booleanFalse)}
                  </div>
                );
              }

              if (col.type === "date") {
                return <p className="text-sm font-bold text-navy-700 dark:text-white">{new Date(value).toISOString().split("T")[0]}</p>;
              }

              if (col.type === "image") {
                const trimmed = value?.trim();
                return (
                  <div className="ml-3">
                    <img
                      className="h-auto w-full max-w-[100px] rounded-lg object-cover cursor-pointer"
                      onClick={() => setOpenPhotoId(info.row.id)}
                      src={trimmed}
                      alt=""
                    />
                    {openPhotoId === info.row.id && (
                      <Lightbox
                        mainSrc={trimmed}
                        onCloseRequest={() => setOpenPhotoId(null)}
                      />
                    )}
                  </div>
                );
              }

              if (col.type === "modal") {
                return (
                  <CustomModal
                    title={t(col.accessor)}
                    component={modalComponent(value, col.accessor)}
                    extra="linear rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white"
                    buttonText={t("show").toUpperCase()}
                  />
                );
              }

              if (col.type === "enum") {
                return (
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    {displayEnumVal(value, col.enumType)}
                  </p>
                );
              }

              if (col.type === "list") {
                return (
                  <div className="flex flex-wrap gap-2">
                    {value?.map((item, i) => (
                      <div
                        key={i}
                        className={`rounded-lg px-3 py-2 text-xs font-bold uppercase text-white bg-${col.listColor}-500 dark:bg-${col.listColor}-400`}
                      >
                        {item[col.nameLabel]}
                      </div>
                    ))}
                  </div>
                );
              }

              const content = (
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  {value}
                </p>
              );

              return index === 0 ? (
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedItems.includes(info.row.original.id)}
                    onChange={(e) => handleSelect(e, info.row.original.id)}
                  />
                  {content}
                </div>
              ) : (
                content
              );
            },
          });
        }),
      columnHelper.accessor("action", {
        id: "action",
        header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">{t("action").toUpperCase()}</p>,
        cell: (info) => actionButtons(info.row.original),
        enableSorting: false
      }),
    ];
  }, [columnsData, selectedItems, t, actionButtons, handleSelect, modalComponent, displayEnumVal, openPhotoId]);

  const table = useReactTable({
    data,
    columns: createColumns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount,
    manualPagination: true,
    debugTable: false,
  });

  useEffect(() => {
    onPageChange(pagination.pageIndex, pagination.pageSize);
  }, [pagination, onPageChange]);

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
                        <Checkbox
                          defaultChecked={false}
                          colorScheme="brandScheme"
                          me="10px"
                          checked={data.every((item) => selectedItems.includes(item.id))}
                          onChange={(e) => handleSelect(e, data.map((item) => item.id))}
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
      <Paginator table={table} page={tableData.page} />
    </Card>
  );
};

export default memo(DefaultTable);
