"use client";
import Field from "@/components/Field";
import { Select } from "@mantine/core";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import classes from "@/app/styles/Select.module.css";
import { FaArrowRight } from "react-icons/fa6";
import { artisanRegSchema } from "@/utils/validation/auth";
import { IRegisterArtisanPayload } from "@/lib/features/auth/auth";
import { IRegisterArtisansTextField } from "@/app/pro/get-started/page";
import { useRouter } from "next/navigation";

type Props = {
  next: () => void;
  data: IRegisterArtisanPayload;
  updateField: (val: IRegisterArtisansTextField) => void;
};

const icon = <IoIosArrowDown />;

const PersonalInformation = (props: Props) => {
  const router = useRouter()
  const [skillsVal, setSkillsVal] = useState<string>(
    props.data.skills || ""
  );
  return (
    <div className="">
      <h2 className="font-semibold mt-10">Personal Information</h2>
      <Formik
        initialValues={{
          fname: props.data.fname || "",
          lname: props.data.lname || "",
          email: props.data.email || "",
          address: props.data.address || "",
          city: props.data.city || "",
          state: props.data.state || "",
          phone: props.data.phone || "",
        }}
        onSubmit={(values) => {
          props.updateField({ ...values, skills: skillsVal });
          props.next();
        }}
        validationSchema={artisanRegSchema}
      >
        {({ dirty, isValid }) => (
          <Form>
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
                  name="phone"
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
              <p className="text-[0.88rem] text-gray-500 mb-2">
                Select services
              </p>
              <div className="border w-full   rounded-md">
                <Select
                  classNames={{
                    input: classes.input2,
                  }}
                  size="md"
                  value={skillsVal}
                  onChange={(val) => {
                    if (val) setSkillsVal(val);
                  }}
                  data={[
                    {
                      label: "Plumber",
                      value: "Plumber",
                    },
                    {
                      label: "Catering services",
                      value: "Catering services",
                    },
                    {
                      label: "Crochet",
                      value: "Crochet",
                    },
                    {
                      label: "Laptop repairs",
                      value: "Laptop repairs",
                    },
                    {
                      label: "Phone repairs",
                      value: "Phone repairs",
                    },
                    {
                      label: "Capenter",
                      value: "Capenter",
                    },
                  ]}
                  rightSection={icon}
                  placeholder="Select"
                />
              </div>
            </div>
            <div className="mt-8 flex">
              <button type="button" onClick={() => router.push("/pro/auth/login")} className="underline text-gray-500">Already have an account</button>
              <button
                disabled={!isValid}
                className="bg-primary disabled:cursor-not-allowed text-white ml-auto py-2 px-4 rounded-md flex items-center"
              >
                <p className="mr-2">Next</p>
                <FaArrowRight />
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PersonalInformation;
