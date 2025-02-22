"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

// import NoDataImg from "/public/assets/dashboard/no-data.png";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Skeleton } from "@mantine/core";
// import SelectComponent from "../Select/SelectComponent";
import { useEffect, useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  subtitle?: string;
  faded?: boolean;
  showMoreBtnContent?: string;
  link?: string;
  clicked?: () => void;
  loaderLength?: number;
  isFetching?: boolean;
  dropdownFilter?: boolean;
  dropdowndata?: { label: string; value: string }[];
  updateDropdownData?: (val: string) => void;
  dropdownValue?: string;
  dropdownDefaultVal?: string;
  emptyHeader?: string;
  emptyBody?: string;
  setRowSelectData?: (val: any) => void;
  crew?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  subtitle,
  title,
  faded,
  showMoreBtnContent,
  link,
  clicked,
  isFetching,
  loaderLength,
  dropdownFilter,
  dropdowndata,
  updateDropdownData,
  dropdownValue,
  dropdownDefaultVal,
  emptyBody,
  emptyHeader,
  setRowSelectData,
  crew,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelectionState] = useState({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: (val) => {
      // table.toggleAllRowsSelected(false)
      setRowSelectionState(val);
      setRowSelectData && setRowSelectData(val);
    },
    state: {
      rowSelection: rowSelection,
    },
  });

  useEffect(() => {
    table.toggleAllRowsSelected(false);
  }, [crew]);
  const router = useRouter();

  return (
    <div className=" ">
      <div className="w-full mr-auto text-black-4 border border-b-0 border-stroke-5 bg-white text-[1.13rem] py-6 font-medium px-7 rounded-ss-md flex flex-wrap sm:flex-nowrap items-center rounded-se-md">
        <div className=" mr-auto w-full sm:w-auto">
          <p>{title}</p>
          <p className="text-gray-1 text-[0.88rem]">{subtitle}</p>
        </div>
        <div className="">
          {showMoreBtnContent && (
            <button
              onClick={() => {
                if (link) {
                  router.push(link);
                }
                clicked && clicked();
              }}
              className="mt-8 sm:mt-0 bg-black-3 text-white px-4 hover:bg-blue-1 transition-all py-2 rounded-md text-[0.88rem]"
            >
              {showMoreBtnContent}
            </button>
          )}
          {/* {dropdownFilter &&
            dropdowndata &&
            updateDropdownData &&
            dropdownValue && (
              <SelectComponent
                value={dropdownValue}
                data={dropdowndata}
                label=""
                defaultValue={dropdownDefaultVal}
                placeholder=""
                setValueProps={(val) => {
                  if (val) {
                    updateDropdownData(val);
                  }
                }}
              />
            )} */}
        </div>
      </div>
      {isFetching ? (
        <div className="bg-white mt-2">
          {loaderLength &&
            Array.from({
              length: loaderLength,
            }).map((el, index) => (
              <div className="mb-3" key={index.toString()}>
                <Skeleton height={70} />
              </div>
            ))}
        </div>
      ) : (
        <Table className="table-auto overflow-hidden border border-stroke-5 shadow-xl">
          {table.getRowModel().rows?.length ? (
            <TableHeader className=" text-gray-1 ">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className={`${
                    faded
                      ? "bg-white border-t border-t-white"
                      : "bg-gray-bg-5 border border-stroke-5"
                  }  `}
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
          ) : null}
          <TableBody className="bg-white">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`${
                    faded && index % 2 === 0 ? "bg-gray-bg-1" : null
                  } border border-stroke-5`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <td>

                <div className="w-full py-[4rem]">
                  {/* <Image src={NoDataImg} alt="no-data" className="mx-auto" /> */}
                  <h1 className="py-8 text-black-4 text-[1.13rem] font-medium text-center">
                    {emptyHeader}
                  </h1>
                  <h2 className="text-[0.88rem] text-center text-gray-1 w-[20rem] mx-auto">
                    {emptyBody}
                  </h2>
                </div>
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

// Any requests you have made will show up here. Start today by
// creating a request.
