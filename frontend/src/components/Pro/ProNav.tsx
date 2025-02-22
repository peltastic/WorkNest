import Link from "next/link";
import React from "react";

type Props = {
  type?: "login" | "signup";
};

const ProNav = (props: Props) => {
  return (
    <nav className="flex justify-between py-8 px-10  bg-tertiary">
      <div className="mr-auto">
        <p className="text-2xl font-semibold">
          WORKNEST <span className="text-lg">Pro</span>
        </p>
      </div>
      <Link href={"/pro/auth/login"}>
      <button className="bg-primary px-8 py-2 rounded-md text-white">{props.type === "login" ? "Log in" : "Register as pro"}</button>
      </Link>
    </nav>
  );
};

export default ProNav;
