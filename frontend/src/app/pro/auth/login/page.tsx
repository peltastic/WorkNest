"use client"
import LoginForm from "@/components/Forms/LoginForm";
import { useRouter } from "next/navigation";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";

type Props = {};

const LoginAsPro = (props: Props) => {
  const router = useRouter();
  return (
    <section className="flex bg-bg1">
      <div className="min-h-screen border w-[50%] pro-auth-bg"></div>
      <div className="w-[50%] flex flex-col justify-center items-center">
        <div className="px-20 mt-20 flex w-full ">
          <div className="w-full">
            <div
              onClick={() => router.push("/")}
              className=" cursor-pointer flex items-center mb-4"
            >
              <IoIosArrowBack />
              <h1 className="underline text-gray-500 ">Home</h1>
            </div>
            <h2 className="text-2xl font-medium">Log into your account</h2>
            <div className="w-full">
              <LoginForm loginType="artisan" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginAsPro;
