import * as Yup from "yup";

export const userAuthSchema = Yup.object({
  email: Yup.string().lowercase().trim().email().required("Email is required"),
  lname: Yup.string().required("Last name is required"),
  fname: Yup.string().required("First name is required"),
  mobile: Yup.string().required("Phone number is required"),
  state: Yup.string().required("State number is required"),
  address: Yup.string().required("Address number is required"),
  city: Yup.string().required("City number is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords doesn't match")
    .required("Password Confirmation is Required"),
});

export const artisanRegSchema = Yup.object({
  email: Yup.string().lowercase().trim().email().required("Email is required"),
  lname: Yup.string().required("Last name is required"),
  fname: Yup.string().required("First name is required"),
  phone: Yup.string().required("Phone number is required"),
  state: Yup.string().required("State number is required"),
  address: Yup.string().required("Address number is required"),
  city: Yup.string().required("City number is required"),
});

export const loginSchema = Yup.object({
  email: Yup.string().lowercase().trim().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const setPasswordSchema = Yup.object({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords doesn't match")
    .required("Password Confirmation is Required"),
});
