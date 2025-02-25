"nav"
import { hastoken } from "@/utils/helperFunction";
import { notify } from "@/utils/notification";
import { removeCookie } from "@/utils/storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  type?: "login" | "signup";
};

const ProNav = (props: Props) => {
  const router = useRouter()
  const hasToken = hastoken("ar_token");
  return (
    <nav className="flex justify-between py-8 px-10  bg-tertiary">
      <div className="mr-auto">
        <p className="text-2xl font-semibold">
          WORKNEST <span className="text-lg">Pro</span>
        </p>
      </div>
      {hasToken ? (
        <div className="flex items-center">
            <div className="flex items-center">
          <Link href={"/pro/chats"} className=" border-b b border-b-black text-black1 font-light mr-6 text-lg">
            <p>Messages</p>
          </Link>
          <button onClick={() => {
            removeCookie("ar_token")
            notify("success", "Logged out")
            router.push("/pro/auth/login")
          } } className="cursor-pointer bg-secondary text-white  py-2 px-4 rounded-xl">
           Logout
          </button>
        </div>
        </div>
      ) : (
        <Link href={"/pro/auth/login"}>
          <button className="bg-primary px-8 py-2 rounded-md text-white">
            {props.type === "login" ? "Log in" : "Register as pro"}
          </button>
        </Link>
      )}
    </nav>
  );
};

export default ProNav;
