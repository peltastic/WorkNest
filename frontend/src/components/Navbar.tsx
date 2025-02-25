"use client"
import { hastoken } from "@/utils/helperFunction";
import { notify } from "@/utils/notification";
import { removeCookie } from "@/utils/storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const Navbar = (props: Props) => {
  const router = useRouter()
  const hasToken = hastoken("token");
  return (
    <nav className="flex justify-between py-8 px-10 bg-tertiary">
      <div className="mr-auto">
        <p className="text-2xl font-semibold">WORKNEST</p>
      </div>
      {hasToken ? (
        <div className="flex items-center">
          <Link href={"/user/chats"} className=" border-b b border-b-black text-black1 font-light mr-6 text-lg">
            <p>Messages</p>
          </Link>
          <button onClick={() => {
            removeCookie("token")
            notify("success", "Logged out")
            router.push("/user/auth/login")
          } } className="cursor-pointer bg-secondary text-white  py-2 px-4 rounded-xl">
           Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center">
          <Link href={"/user/auth/login"} className=" text-black1 font-light mr-6 text-lg">
            <p>Log in</p>
          </Link>
          <button onClick={() => router.push("/user/auth/register")} className="bg-secondary  py-2 px-4 rounded-xl">
            Create an account
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
