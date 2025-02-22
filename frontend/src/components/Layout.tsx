import React, { ReactNode } from "react";
import Navbar from "./Navbar";

type Props = {
  children: ReactNode;
};

const Layout = (props: Props) => {
  return (
    <div className="">
      <Navbar />
      <main className="px-10">{props.children}</main>
    </div>
  );
};

export default Layout;
