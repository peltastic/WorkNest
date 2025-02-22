"use client";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import Field from "../Field";
import Link from "next/link";
import { userAuthSchema } from "@/utils/validation/auth";
import { useRegisterAsUserMutation } from "@/lib/features/auth/auth";
import { nprogress } from "@mantine/nprogress";
import { notify } from "@/utils/notification";
import { setTokenCookie } from "@/utils/storage";
import Spinner from "../Spinner";
import { useRouter } from "next/navigation";

type Props = {};

const RegisterForm = (props: Props) => {
  const router = useRouter();
  const [registerUser, { isError, isLoading, isSuccess, error, data }] =
    useRegisterAsUserMutation();

  useEffect(() => {
    if (isError) {
      nprogress.complete();
      notify("error", "", (error as any).data?.message || "An Error Occured");
    }

    if (isSuccess) {
      nprogress.start();
      notify("success", "Registeration successful!", "Please log in");
      setTokenCookie(data.token);
      nprogress.complete()
      router.push("/feed");
    }
  }, [isError, isSuccess, isLoading]);
  return (
    <Formik
      initialValues={{
        fname: "",
        lname: "",
        email: "",
        mobile: "",
        address: "",
        city: "",
        state: "",
        password: "",
        confirm_password: "",
      }}
      validationSchema={userAuthSchema}
      onSubmit={({
        address,
        city,
        email,
        fname,
        lname,
        mobile,
        password,
        state,
      }) => {
        registerUser({
          address,
          city,
          fname,
          lname,
          password,
          phone: mobile,
          state,
          email,
          role: "customer"
        });
      }}
    >
      {({ dirty, isValid }) => (
        <Form className="w-full">
          <div className="grid grid-cols-2 w-full gap-x-8 mt-8">
            <div className="">
              <Field
                name="fname"
                classname="w-full"
                label="First name"
                placeholder="Enter first name"
              />
            </div>
            <div className="">
              <Field
                name="lname"
                classname="w-full"
                label="Last name"
                placeholder="Enter last name"
              />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-8">
            <div className="">
              <Field
                name="email"
                classname="w-full"
                label="Email"
                placeholder="example@gmail.com"
              />
            </div>
            <div className="">
              <Field
                name="mobile"
                classname="w-full"
                label="Phone number"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
          <div className="mt-6">
            <Field
              name="address"
              classname="w-full"
              label="Address"
              placeholder="Your residential address"
            />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-8">
            <div className="">
              <Field
                name="city"
                classname="w-full"
                label="City"
                placeholder="Residential city"
              />
            </div>
            <div className="">
              <Field
                name="state"
                classname="w-full"
                label="State"
                placeholder="Residential state"
              />
            </div>
          </div>
          <div className="mt-6">
            <Field
              name="password"
              password
              classname="w-full"
              label="Password"
              placeholder="Enter your password"
            />
          </div>
          <div className="mt-6">
            <Field
              name="confirm_password"
              password
              classname="w-full"
              label="Confirm Password"
              placeholder="Re-enter your password"
            />
          </div>
          <p className="mt-6 text-gray-400">
            Already have an account?{" "}
            <span className="underline">
              <Link href={"/user/auth/login"}>login</Link>
            </span>
          </p>
          <button
            disabled={isLoading}
            className="disabled:opacity-55 flex justify-center disabled:cursor-not-allowed bg-primary text-white w-full mt-10 py-4 rounded-md"
          >
            {isLoading ? (
              <div className="w-[1rem] py-1">
                <Spinner />
              </div>
            ) : (
              <p>Create an account</p>
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
