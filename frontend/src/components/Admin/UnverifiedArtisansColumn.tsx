import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import FileImg from "/public/assets/dashboard/file.svg";
import Link from "next/link";
import MenuComponent from "../MenuComponent";
import { IoIosArrowDown } from "react-icons/io";
import { AspectRatio } from "@mantine/core";
import { useAcceptUnverifiedArtisanMutation } from "@/lib/features/admin/users";
import { nprogress } from "@mantine/nprogress";
import { useEffect } from "react";
import { notify } from "@/utils/notification";
import { useRouter } from "next/navigation";

export interface IUnverifiedArtisans {
  fullname: string;
  city: string;
  state: string;
  means_of_id: string;
  profile_pic: string;
  email: string;
    skills: string
  id: string;
}

export const unverified_columns: ColumnDef<IUnverifiedArtisans>[] = [
  {
    accessorKey: "fullname",
    header: () => <div className="pl-10">Full name</div>,
    cell: ({ row }) => {
      return (
        <div className={` pl-10 py-6 w-[7rem] xl:w-auto flex items-center`}>
          <AspectRatio ratio={1800 / 1800}>
            <img
              alt="profile-pic"
              src={row.original.profile_pic}
              width={100}
              height={100}
              className="rounded-full w-[2rem] h-[2rem]"
            />
          </AspectRatio>

          <p className="text-gray-1 text-[0.88rem] ml-2">
            {row.getValue("fullname")}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => {
      return (
        <div className={` py-6 w-[7rem] xl:w-auto`}>
          <p className="text-gray-1 text-[0.88rem] ">{row.getValue("city")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return (
        <div className={` py-6 w-[7rem] xl:w-auto`}>
          <p className="text-gray-1 text-[0.88rem] ">{row.getValue("email")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => {
      return (
        <div className="w-[10rem] xl:w-auto">
          <p className="text-gray-1 text-[0.88rem]">{row.getValue("state")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "means_of_id",
    header: "Means of ID",
    cell: ({ row }) => {
      return (
        <div className="w-[10rem] xl:w-auto">
          <Link
            href={row.original.means_of_id}
            target="_blank"
            className="underline"
          >
            download
          </Link>
        </div>
      );
    },
  },
  //   {
  //     accessorKey: "uploaded_by",
  //     header: "Uploaded By",
  //     cell: ({ row }) => {
  //       return (
  //         <div className="w-[10rem] xl:w-auto">
  //           <p className="text-gray-1 text-[0.88rem]">
  //             {row.getValue("uploaded_by")}
  //           </p>
  //         </div>
  //       );
  //     },
  //   },
  {
    id: "select",
    cell: ({ row }) => {
      const router = useRouter();
      const [verifyUser, { isSuccess, isError, data, error }] =
        useAcceptUnverifiedArtisanMutation();

      useEffect(() => {
        if (isError) {
          nprogress.complete();
          notify(
            "error",
            "",
            (error as any).data?.message || "An Error Occured"
          );
        }

        if (isSuccess) {
          nprogress.start();
          notify(
            "success",
            "Email has been sent to artisan to complete verification process"
          );
          nprogress.complete();
        }
      }, [isError, isSuccess]);
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
              <li
                onClick={() => {
                  nprogress.start();
                  verifyUser(row.original.id);
                }}
                className="py-1 px-4 hover:bg-gray-bg-1 transition-all rounded-md"
              >
                <button>Accept</button>
              </li>
            </ul>
          </div>
        </MenuComponent>
      );
    },
  },
];
