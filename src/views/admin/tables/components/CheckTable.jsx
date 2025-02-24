import React, {useState} from "react";
import Checkbox from "components/checkbox";
import Card from "components/card";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {TablePagination} from "@mui/material";

function CheckTable(props) {
  const { tableData, columnsData} = props;
  const [sorting, setSorting] = useState([]);
  const columnHelper = createColumnHelper();
  const columns = createColumns(columnsData);
  let data = tableData ? tableData : [];
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
                    checked={props.selectedItems.includes(info.row.id)}
                    onChange={(e) => {props.handleSelect(e,info.row.id)}}
                />
                <p className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
                  {info.getValue()}
                </p>
              </div>
            ) : columnsData.type === "boolean" ? (
                <div
                    className={`flex items-center px-2 rounded-full ${
                        Boolean(info.getValue()) ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{ width: "fit-content" }}
                >
                    <p className="text-sm font-bold text-white">
                        {Boolean(info.getValue()) ? columnsData.booleanTrue : columnsData.booleanFalse}
                    </p>
                </div>
            ) : columnsData.type === "date" ? (
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                    {new Date(info.getValue()).toISOString().split('T')[0]}
                </p>
            ) : (
                //default text
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                    {info.getValue()}
                </p>
            )
        })
      );
    });
      tableColumns.push(
          columnHelper.accessor("action", {
          id:"action",
          header: () => (
              <p className="text-sm font-bold text-gray-600 dark:text-white">
                  ACTION
              </p>
          ),
          cell : (info) => (
              props.actionButtons(info.row.original)
          )
      }));
    return tableColumns;
  }

    const rawsPerPage = () => {
        let array = [10,20];
        if (Math.ceil(props.count/2) > 20) {
            array.push(Math.ceil(props.count/2));
        }
        if (Math.ceil(props.count) > 20) {
            array.push(Math.ceil(props.count));
        }
        return array;
    }

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <header className="relative flex items-center justify-between pt-4">
        {props.header}
      </header>
      <div className="mt-2 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-start"
                    >
                      <div className="items-center justify-between text-xs text-gray-200">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: "",
                          desc: "",
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    </th>
                  );
                })}
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
            className="ml-3 text-sm !font-bold text-navy-700 dark:text-white"
            sx={{
                "& .MuiTablePagination-selectLabel": { fontWeight: "bold" },
                "& .MuiTablePagination-displayedRows": { fontWeight: "bold" },
                "& .MuiSelect-select": { fontWeight: "bold" }
            }}
            count={props.count}
            page={props.page}
            onPageChange={(e,newPage)=>props.onPageChange(e,newPage)}
            rowsPerPage={props.rowsPerPage}
            onRowsPerPageChange={props.handleChangeRowsPerPage}
            rowsPerPageOptions={rawsPerPage()}
        />
    </Card>
  );
}

export default CheckTable;
