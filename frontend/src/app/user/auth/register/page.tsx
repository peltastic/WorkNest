"use client"
import RegisterForm from "@/components/Forms/RegisterForm";
import { useRouter } from "next/navigation";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";

type Props = {};

const RegisterPage = (props: Props) => {
  const router = useRouter()
  return (
    <section className="flex bg-bg1">
      <div className="min-h-screen border w-[50%] user-auth-bg "></div>
      <div className="w-[50%]">
        <div className="px-20 mt-20 flex items-center">
          <div className="w-full">
          <div onClick={() => router.push("/") } className=" cursor-pointer flex items-center mb-4">
              <IoIosArrowBack />
              <h1 className="underline text-gray-500 ">Home</h1>
            </div>
            <h2 className="text-2xl font-medium"> Create an account</h2>
            <div className="w-full">
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
