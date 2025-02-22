import Link from "next/link";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AdminLayout = (props: Props) => {
  return (
    <>
      <nav className="flex justify-between py-8 px-10  bg-tertiary">
        <div className="mr-auto">
          <p className="text-2xl font-semibold">
            WORKNEST <span className="text-lg">Admin</span>
          </p>
        </div>
      </nav>
      <main className="px-10 bg-bg1 min-h-screen">{props.children}</main>
    </>
  );
};

export default AdminLayout;
