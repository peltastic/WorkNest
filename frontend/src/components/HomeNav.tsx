import Link from "next/link";
import React from "react";

type Props = {};

const HomeNav = (props: Props) => {
  return (
    <nav className="flex justify-between py-8 px-10 bg-tertiary">
      <div className="">
        <p className="text-2xl font-semibold">WORKNEST</p>
      </div>    
      <div className="">
        <ul className="flex space-x-8 font-light text-lg">
          <li>
            <p>Home</p>
          </li>
          <li>
            <p>Blog</p>
          </li>
          <li>
            <p>Contact</p>
          </li>
        </ul>
      </div>
      <div className="">
        <Link href={"/feed"} className="cursor-pointer bg-bg1 font-light py-2 px-4 rounded-2xl">Book a Service</Link>
      </div>
    </nav>
  );
};

export default HomeNav;
