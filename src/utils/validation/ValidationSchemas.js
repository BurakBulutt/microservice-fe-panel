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

const commentOptions = ["COMMENT","REPLY"];

export const UserCreateValidationSchema = Yup.object({
  firstName: Yup.string().required("Name is Required"),
  lastName: Yup.string().required("Surname is Required"),
  username: Yup.string().required("Username is Required"),
  email : Yup.string().email("Should be Mail Format").required("Email Required"),
  password: Yup.string()
      .min(8, "Password Must Be At Least 8 Characters")
      .required("Password is required")
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+=-{};:'<>,./?])[a-zA-Z0-9!@#$%^&*()_+=-{};:'<>,./?]{8,}$/, "Password Must Contain At Least One Uppercase Letter And One Special Character"),
  passwordRe: Yup.string()
      .oneOf([Yup.ref('password')], "Passwords Do Not Match")
      .required("Password Re is Required"),
  isPasswordTemporary: Yup.bool().required("Temporary Password switch is Required"),
  enabled: Yup.bool().required("Enable Switch Required"),
  emailVerified: Yup.bool().required("Email Verify Switch Required"),
  birthdate: Yup.string().required("Birthdate is required"),
});

export const UserUpdateValidationSchema = Yup.object({
  firstName: Yup.string().required("Name is Required"),
  lastName: Yup.string().required("Surname is Required"),
  email : Yup.string().email("Should Be Mail Format").required("Email Required"),
  enabled: Yup.bool().required("Enable Switch Required"),
  emailVerified: Yup.bool().required("Email Verify Switch Required"),
  birthdate: Yup.string().required("Birthdate is required"),
});

export const ContentValidationSchema = Yup.object({
  name: Yup.string().required("Name is Required"),
  description: Yup.string().required("Description is Required"),
  slug: Yup.string().required("Slug is Required"),
  startDate: Yup.string().required("Start Date is Required").typeError("Type Error"),
  type : Yup.string().required("Type is Required").oneOf(typeOptions.map(option => option.value),"Option Error"),
  episodeTime : Yup.number().required("Episode is Required"),
  categories : Yup.array().min(1,"Minimum 1 Item")
});

export const MediaValidationSchema = Yup.object({
  description: Yup.string().required("Description is Required"),
  count: Yup.number().required("Count is Required"),
  publishDate: Yup.string().required("Publish Date is Required").typeError("Type Error"),
});

export const CategoryValidationSchema = Yup.object({
  name: Yup.string().required("Name is Required"),
  description: Yup.string().required("Description is Required"),
  slug: Yup.string().required("Slug is Required"),
});

export const CommentCreateValidationSchema = Yup.object({
  content: Yup.string().required("Content is Required"),
  userId: Yup.string().required("User is Required").nonNullable(),
  targetId: Yup.string().required("Target is Required").nonNullable(),
  type: Yup.string()
      .required("Type is Required")
      .oneOf(commentOptions),
  parentId: Yup.string()
      .when("type", {
        is: "REPLY",
        then: (schema) => schema.required("Parent is Required").nonNullable(),
        otherwise: (schema) => schema.notRequired().nullable(),
      }),
});

export const CommentUpdateValidationSchema = Yup.object({
  content: Yup.string().required("Content is Required"),
});
