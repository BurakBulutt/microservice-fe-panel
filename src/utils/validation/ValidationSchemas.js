import * as Yup from "yup";

export const LoginRequestSchema = Yup.object({
  username: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  password: Yup.string().required("Bu Alan Boş Bırakılamaz"),
});

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
  //requiredActions: Yup.array().required("Bu Alan Boş Bırakılamaz"),
  birthdate: Yup.string().required("Birthdate is required"),
});

export const UserUpdateValidationSchema = Yup.object({
  firstName: Yup.string().required("Name is required"),
  lastName: Yup.string().required("Surname is required"),
  email : Yup.string().email("Should be Mail Format").required("Email Required"),
  enabled: Yup.bool().required("Bu Alan Boş Bırakılamaz"),
  emailVerified: Yup.bool().required("Bu Alan Boş Bırakılamaz"),
  //requiredActions: Yup.array().required("Bu Alan Boş Bırakılamaz"),
  birthdate: Yup.string().required("Birthdate is required"),
});

export const CategoryValidationSchema = Yup.object({
  name: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  description: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  slug: Yup.string().required("Bu Alan Boş Bırakılamaz"),
});

export const ProductValidationSchema = Yup.object({
  name: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  description: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  slug: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  code: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  originalPrice: Yup.number().required("Bu Alan Boş Bırakılamaz")
      .typeError("Geçersiz Veri Tipi"),
  quantity: Yup.number().required("Bu Alan Boş Bırakılamaz")
      .typeError("Geçersiz Veri Tipi"),
  mainCategoryId: Yup.string().required("Bu Alan Boş Bırakılamaz"),
});

export const CampaignValidationSchema = Yup.object({
  name: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  description: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  campaignScope: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  priceEffect: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  expirationDate: Yup.date().required("Bu Alan Boş Bırakılamaz")
      .typeError("Geçersiz Veri Tipi"),
  discount: Yup.number().required("Bu Alan Boş Bırakılamaz"),
  priority: Yup.number().required("Bu Alan Boş Bırakılamaz"),
  isActive: Yup.bool().required("Bu Alan Boş Bırakılamaz"),
});
