import React, {useEffect, useState} from "react";
import Checkbox from "components/checkbox";
import Card from "components/card";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { TablePagination } from "@mui/material";
import CustomModal from "../../components/modal/index";

function DefaultTable(props) {
  const { tableData, columnsData } = props;
  const [sorting, setSorting] = useState([]);
  const [openPhotoId, setOpenPhotoId] = useState(null);
  const [data,setData] = useState([]);
  const columnHelper = createColumnHelper();
  const columns = createColumns(columnsData);

  useEffect(() => {
    if (tableData?.content?.length) {
      setData(tableData.content);
    }
  }, [columns]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const openLightbox = (id) => {
    setOpenPhotoId(id);
  };

  const closeLightbox = () => {
    setOpenPhotoId(null);
  };

  function createColumns(columnsDatas) {
    const tableColumns = [];
    columnsDatas.forEach((columnsData, index) => {
      tableColumns.push(
        columnHelper.accessor(columnsData.accessor, {
          id: columnsData.accessor,
          header: () => (
            <p className="text-sm font-bold text-gray-600 dark:text-white">
              {columnsData.Header}
            </p>
          ),
          cell: (info) =>
            index === 0 ? (
              <div className="flex items-center">
                <Checkbox
                  defaultChecked={false}
                  colorScheme="brandScheme"
                  me="10px"
                  checked={props.selectedItems?.includes(info.row.original.id)}
                  onChange={(e) => {
                    props.handleSelect(e, info.row.original.id);
                  }}
                />
                {columnsData.type === "image" ? (
                  <div className="ml-3">
                    <img
                      className="h-auto w-full max-w-[100px] rounded-lg object-cover"
                      onClick={() => openLightbox(info.row.id)}
                      src={info.getValue().trim()}
                      alt="#"
                    />
                    {openPhotoId === info.row.id && (
                      <Lightbox
                        mainSrc={info.getValue().trim()}
                        onCloseRequest={closeLightbox}
                      />
                    )}
                  </div>
                ) : (
                  <p className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
                    {info.getValue()}
                  </p>
                )}
              </div>
            ) : columnsData.type === "boolean" ? (
              Boolean(info.getValue()) ? (
                <div className="inline-block rounded-lg bg-green-500 px-3 py-2 text-xs font-bold uppercase text-white transition duration-200 dark:bg-green-400">
                  {columnsData.booleanTrue}
                </div>
              ) : (
                <div className="inline-block rounded-lg bg-red-500 px-3 py-2 text-xs font-bold uppercase text-white transition duration-200 dark:bg-red-400">
                  {columnsData.booleanFalse}
                </div>
              )
            ) : columnsData.type === "date" ? (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {new Date(info.getValue()).toISOString().split("T")[0]}
              </p>
            ) : columnsData.type === "image" ? (
              <div>
                <img
                  className="h-auto w-full max-w-[100px] rounded-lg object-cover"
                  onClick={() => openLightbox(info.row.id)}
                  src={info.getValue()}
                  alt="#"
                />
              </div>
            ) : columnsData.type === "modal" ? (
                <CustomModal title={columnsData.Header} component={props.modalComponent(info.getValue(),columnsData.accessor)}/>
            ) : (
              //default text
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {info.getValue()}
              </p>
            ),
        })
      );
    });
    tableColumns.push(
      columnHelper.accessor("action", {
        id: "action",
        header: () => (
          <p className="text-sm font-bold text-gray-600 dark:text-white">
            ACTION
          </p>
        ),
        cell: (info) => props.actionButtons(info.row.original),
      })
    );
    return tableColumns;
  }

  const rowsPerPage = (totalElements) => {
    let array = [10];
    if (totalElements > 10) array.push(25);
    if (totalElements > 25) array.push(50);
    if (totalElements > 50) {
      if (Math.floor(totalElements / 2) > 50)
        array.push(Math.floor(totalElements / 2));
      array.push(totalElements);
    }
    return array;
  };

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <header className="relative flex items-center justify-between pt-4">
        {props.header()}
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
                                checked={data?.length && data.every((item) => props.selectedItems.includes(item.id))}
                                onChange={(e) => {
                                  const allIds = data.map((item) => item.id);
                                  props.handleMultipleSelect(e, allIds);
                                  console.log(sorting);
                                }}
                            />
                        )}
                        <div className="text-xs text-gray-200" onClick={header.column.getToggleSortingHandler()}>
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
      <TablePagination
        component="div"
        count={tableData?.page?.totalElements}
        page={tableData?.page?.number}
        onPageChange={(e, page) => props.handlePageChange(page)}
        rowsPerPage={tableData?.page?.size}
        rowsPerPageOptions={rowsPerPage(tableData?.page?.totalElements)}
        onRowsPerPageChange={(e) =>
          props.handleOnRowsPerPageChange(parseInt(e.target.value, 10))
        }
        sx={{
          fontWeight: "bold",
          color: "black",
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            {
              fontWeight: "bold",
            },
          "& .MuiSelect-select": {
            fontWeight: "bold",
          },
          "& .MuiIconButton-root": {
            color: "black",
            transition: "color 0.2s ease-in-out",
            "&:hover": {
              color: "#555",
            },
            "&:disabled": {
              color: "#ccc",
            },
          },
        }}
        className="dark:text-white dark:[&_.MuiIconButton-root:hover]:text-gray-400 dark:[&_.MuiIconButton-root]:text-white"
      />
    </Card>
  );
}
export default DefaultTable;
