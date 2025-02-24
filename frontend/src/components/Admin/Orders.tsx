"use client"
import { IUnverifiedArtisanData } from "@/lib/features/admin/users";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MenuComponent from "../MenuComponent";
import { IoIosArrowDown } from "react-icons/io";

export interface IOrders {
  customer: string;
  date: string;
  phone: string;
  status: string;
}

export const orders_columns: ColumnDef<IOrders>[] = [
  {
    accessorKey: "customer",
    header: () => <div className="pl-10">Customer</div>,
    cell: ({ row }) => {
      return (
        <div className={` pl-10 py-6 w-[7rem] xl:w-auto flex items-center`}>
          <p className="text-gray-1 text-[0.88rem] ml-2">
            {row.getValue("customer")}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      return (
        <div className={` py-6 w-[7rem] xl:w-auto`}>
          <p className="text-gray-1 text-[0.88rem] ">{row.getValue("phone")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return (
        <div className={` py-6 w-[7rem] xl:w-auto`}>
          <p className="text-gray-1 text-[0.88rem] ">{row.getValue("date")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className={` py-6 w-[7rem] xl:w-auto`}>
          <p className="text-gray-1 text-[0.88rem] ">
            {row.getValue("status")}
          </p>
        </div>
      );
    },
  },

  {
    id: "select",
    cell: ({ row }) => {
      const router = useRouter();

      return (
        <MenuComponent
          target={
            <div className="float-right">
              <button className="transition-all hover:bg-blue-1 duration-500 px-4 py-2 rounded-md items-center bg-black text-white flex">
                <p className="mr-1 font-medium text-[0.88rem]">Actions</p>
                <IoIosArrowDown />
              </button>
            </div>
          }
        >
          <div className="bg-white ">
            <ul className="px-1 text-gray-6 text-[0.88rem]">
              <li className="py-1 px-4 hover:bg-gray-bg-1 transition-all rounded-md">
                <button>Message</button>
              </li>
            </ul>
          </div>
        </MenuComponent>
      );
    },
  },
];
