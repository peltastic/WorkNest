"use client"
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import Field from "../Field";
import { useSetArtisanPasswordMutation } from "@/lib/features/auth/auth";
import Spinner from "../Spinner";
import { nprogress } from "@mantine/nprogress";
import { notify } from "@/utils/notification";
import { useRouter, useSearchParams } from "next/navigation";
import { setPasswordSchema } from "@/utils/validation/auth";

type Props = {};

const SetPassword = (props: Props) => {
  const router = useRouter();
  const search = useSearchParams();
  const searchVal = search.get("token");
  const [setArtisanPassword, { isLoading, isError, isSuccess, error }] =
    useSetArtisanPasswordMutation();

  useEffect(() => {
    if (isError) {
      nprogress.complete();
      notify("error", "", (error as any).data?.message || "An Error Occured");
    }

    if (isSuccess) {
      nprogress.start();
      notify("success", "Password set successfully! Please log in");
      nprogress.complete();
      router.push("/pro/auth/login");
    }
  }, [isError, isSuccess]);
  return (
    <Formik
      initialValues={{
        password: "",
        confirmPassword: "",
      }}
      onSubmit={({ password }) => {
        if (searchVal) {
          setArtisanPassword({
            password,
            token: searchVal,
          });
        }
      }}
      validationSchema={setPasswordSchema}
    >
      {({ dirty, isValid }) => (
        <Form className="w-full">
          <div className="mt-6">
            <Field
              name="password"
              classname="w-full"
              label="Password"
              placeholder="Enter password"
              password
            />
          </div>
          <div className="mt-6">
            <Field
              name="confirmPassword"
              classname="w-full"
              label="Password"
              placeholder="Enter password confirmation"
              password
            />
          </div>

          <button
            disabled={isLoading || !searchVal || !isValid}
            className="disabled:opacity-55 flex justify-center disabled:cursor-not-allowed bg-primary text-white w-full mt-10 py-4 rounded-md"
          >
            {isLoading ? (
              <div className="w-[1rem] py-1">
                <Spinner />
              </div>
            ) : (
              <p>Set password</p>
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default SetPassword;
