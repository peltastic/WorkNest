import Layout from "@/components/Layout";
import ProLayout from "@/components/Pro/ProLayout";
import Link from "next/link";
import React from "react";

type Props = {};

const SuccessPageArtisanReg = (props: Props) => {
  return (
    <Layout>
      <div className="mx-auto w-[35rem] pt-[20rem]">
        <p className="text-center text-4xl font-medium mb-6">
          Booking successful
        </p>
        <p className="text-center mb-10">
          Booking request has been sent to artisan for review, you will get an
          email soon
        </p>
        <Link href={"/feed"}>
          <button className="bg-primary block text-white py-3 w-[20rem] mx-auto rounded-md text-center">
            Go home
          </button>
        </Link>
      </div>
    </Layout>
  );
};

export default SuccessPageArtisanReg;
