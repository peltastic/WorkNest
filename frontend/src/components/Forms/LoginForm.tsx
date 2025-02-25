"use client";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import Field from "../Field";
import Link from "next/link";
import {
  useLoginAsAdminMutation,
  useLoginAsUserMutation,
} from "@/lib/features/auth/auth";
import { nprogress } from "@mantine/nprogress";
import { notify } from "@/utils/notification";
import { setAdminTokenCookie, setArtisanTokenCookie, setTokenCookie } from "@/utils/storage";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/utils/validation/auth";
import Spinner from "../Spinner";

type Props = {
  loginType?: "admin" | "artisan";
};

const LoginForm = (props: Props) => {
  const router = useRouter();
  const [loginAsUser, { isError, isLoading, isSuccess, error, data }] =
    useLoginAsUserMutation();
  const [loginAsAdmin, result] = useLoginAsAdminMutation();

  useEffect(() => {
    if (isError) {
      nprogress.complete();
      notify("error", "", (result.error as any)?.data?.message || "An Error Occured");
    }

    if (isSuccess) {
      nprogress.start();
      notify("success", "Login successful!");
      if (props.loginType === "artisan") {
        setArtisanTokenCookie(data.token)
        router.push("/pro/orders")
      } else {
        router.push("/feed");

        setTokenCookie(data.token);
      }
      nprogress.complete();
    }
  }, [isError, isSuccess]);

  useEffect(() => {
    if (result.isError) {
      nprogress.complete();
      notify("error", "", (result.error as any).data?.message || "An Error Occured");
    }
    if (result.isSuccess) {
      notify("success", "Login successful!");
      nprogress.start();
      setAdminTokenCookie(result.data.token)
      nprogress.complete();
      router.push("/admin/unverified-artisans");
    }
  }, [result.isError, result.isSuccess]);

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      onSubmit={(values) => {
        if (props.loginType === "admin") {
          loginAsAdmin(values);
        } else {
          loginAsUser(values);
        }
      }}
      validationSchema={loginSchema}
    >
      {({ dirty, isValid }) => (
        <Form className="w-full">
          <div className="mt-8">
            <Field
              name="email"
              classname="w-full"
              label="Email"
              placeholder="example@gmail.com"
            />
          </div>
          <div className="mt-6">
            <Field
              name="password"
              classname="w-full"
              label="Password"
              placeholder="Enter password"
              password
            />
          </div>
          {props.loginType === "admin" ? null : <p className="mt-6 text-gray-400">
            Don't have an account?{" "}
            <span className="underline">
              <Link href={props.loginType === "artisan" ? "/pro/auth/register" : "/user/auth/register"}>create one</Link>
            </span>
          </p>}
          <button
            disabled={isLoading}
            className="disabled:opacity-55 flex justify-center disabled:cursor-not-allowed bg-primary text-white w-full mt-10 py-4 rounded-md"
          >
            {isLoading || result.isLoading ? (
              <div className="w-[1rem] py-1">
                <Spinner />
              </div>
            ) : (
              <p>Login</p>
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
