import React, { useState } from "react";
import { FieldHookConfig, useField } from "formik";
import { IoMdEye } from "react-icons/io";
import { IoEyeOff } from "react-icons/io5";

interface OtherProps {
  label: string;
  classname: string;
  placeholder: string;
  password?: boolean;
  changed?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  borderError?: boolean;
  smallLabel?: boolean;
  labelClass?: string;
  disabled?: boolean;
  labelColor?: string;
  required?: boolean;
}

const Field = (props: FieldHookConfig<string> & OtherProps) => {
  const [field, meta, helpers] = useField(props);
  const [typePassword, setTypePassword] = useState<boolean>(true);

  return (
    <div className="w-full">
      <label className="">
        {props.label && (
          <div className="flex">
            <p
              className={`${
                props.labelColor || "text-gray-500"
              }   text-[0.88rem] ${props.labelClass} ${
                props.smallLabel ? "text-sm" : ""
              }  mb-2 `}
            >
              {props.label}
            </p>
            {props.required && (
              <p className={`${props.labelColor || "text-gray-600"} `}>*</p>
            )}
          </div>
        )}

        <div className="relative ">
          <input
            disabled={props.disabled}
            autoComplete="off"
            {...field}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (props.changed) {
                props.changed(e);
              }
              field.onChange(e);
            }}
            // value={props.value}
            placeholder={props.placeholder}
            type={typePassword && props.password ? "password" : "text"}
            className={`${
              props.classname
            } border text-input-text-color outline-none border-gray-2 py-3 px-4 rounded-md placeholder:text-gray-2 ${
              meta.error && meta.touched
                ? "border border-errorRed"
                : "border border-gray8"
            }`}
          />
          {props.password ? (
            <div
              onClick={() => setTypePassword(!typePassword)}
              className="text-  xl cursor-pointer text-[#828080] absolute right-4 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              {typePassword ? <IoEyeOff /> : <IoMdEye />}
            </div>
          ) : null}
        </div>
      </label>
      {meta.touched && meta.error ? (
        <div className="text-[#e74f4f] mt-2 text-xs font-medium ">
          {meta.error}
        </div>
      ) : null}
    </div>
  );
};

export default Field;
