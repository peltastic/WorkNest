import Link from "next/link";
import React from "react";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <nav className="flex justify-between py-8 px-10 bg-tertiary">
      <div className="mr-auto">
        <p className="text-2xl font-semibold">WORKNEST</p>
      </div>
      <div className="flex items-center">
        <Link href={"/"} className=" text-black1 font-light mr-6 text-lg">
          <p>Log in</p>
        </Link>
        <button className="bg-secondary  py-2 px-4 rounded-xl">
          Create an account
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
