import * as Yup from "yup";

const typeOptions = [
  {
    display: "SERIES",
    value: "SERIES",
  },
  {
    display: "MOVIE",
    value: "MOVIE",
  },
];

export const UserCreateValidationSchema = Yup.object({
  firstName: Yup.string().required("Name is required"),
  lastName: Yup.string().required("Surname is required"),
  username: Yup.string().required("Username is required"),
  email : Yup.string().email("Should be Mail Format").required("Email Required"),
  password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required")
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+=-{};:'<>,./?])[a-zA-Z0-9!@#$%^&*()_+=-{};:'<>,./?]{8,}$/, "Password must contain at least one uppercase letter and one special character"),
  passwordRe: Yup.string()
      .oneOf([Yup.ref('password')], "Passwords do not match")
      .required("Password Re is required"),
  isPasswordTemporary: Yup.bool().required("Bu Alan Boş Bırakılamaz"),
  enabled: Yup.bool().required("Bu Alan Boş Bırakılamaz"),
  emailVerified: Yup.bool().required("Bu Alan Boş Bırakılamaz"),
  birthdate: Yup.string().required("Birthdate is required"),
});

export const UserUpdateValidationSchema = Yup.object({
  firstName: Yup.string().required("Name is required"),
  lastName: Yup.string().required("Surname is required"),
  email : Yup.string().email("Should be Mail Format").required("Email Required"),
  enabled: Yup.bool().required("Bu Alan Boş Bırakılamaz"),
  emailVerified: Yup.bool().required("Bu Alan Boş Bırakılamaz"),
  birthdate: Yup.string().required("Birthdate is required"),
});

export const ContentCreateValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  slug: Yup.string().required("Slug is Required"),
  startDate: Yup.string().required("StartDate is Required").typeError("Type Error"),
  type : Yup.string().required("Bu Alan Boş Bırakılamaz").oneOf(typeOptions.map(option => option.value),"Option Error"),
  episodeTime : Yup.number().required("Bu Alan Boş Bırakılamaz"),
  categories : Yup.array().min(1,"Minimum 1 Item")
});

export const ContentUpdateValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  slug: Yup.string().required("Slug is Required"),
  startDate: Yup.string().required("StartDate is Required").typeError("Type Error"),
  type : Yup.string().required("Bu Alan Boş Bırakılamaz").oneOf(typeOptions.map(option => option.value),"Option Error"),
  episodeTime : Yup.number().required("Bu Alan Boş Bırakılamaz"),
  categories : Yup.array().min(1,"Minimum 1 Item")
});

export const MediaValidationSchema = Yup.object({
  description: Yup.string().required("Description is required"),
  count: Yup.number().required("Count is required"),
  publishDate: Yup.string().required("Publish Date is Required").typeError("Type Error"),
});

export const CategoryValidationSchema = Yup.object({
  name: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  description: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  slug: Yup.string().required("Bu Alan Boş Bırakılamaz"),
});

