import RegisterForm from "@/components/Forms/RegisterForm";
import React from "react";

type Props = {};

const RegisterPage = (props: Props) => {
  return (
    <section className="flex bg-bg1">
      <div className="min-h-screen border w-[50%] user-auth-bg "></div>
      <div className="w-[50%]">
        <div className="px-20 mt-20 flex items-center">
          <div className="w-full">
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
