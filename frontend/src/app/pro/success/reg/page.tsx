import ProLayout from "@/components/Pro/ProLayout";
import Link from "next/link";
import React from "react";

type Props = {};

const SuccessPageArtisanReg = (props: Props) => {
  return (
    <ProLayout type="login">
      <div className="mx-auto w-[35rem] pt-[20rem]">
        <p className="text-center text-4xl font-medium mb-6">Information saved successfully</p>
        <p className="text-center mb-10">
          Verifaction process takes two to three days, after approval an email
          will be sent to you to set your password
        </p>
        <Link href={"/"} >
        <button className="bg-primary block text-white py-3 w-[20rem] mx-auto rounded-md text-center">
          Go home
        </button>
        </Link>
      </div>
    </ProLayout>
  );
};

export default SuccessPageArtisanReg;
