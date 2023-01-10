import { object, string, TypeOf, enum as zodEnum } from "zod";
import { validatePasswordComplexity } from "../utils/customValidators";

const TYPE_VALUES = ["admin", "user"] as const;

// ------------------------- LOGIN -------------------------
export const loginSchema = object({
  params: object({
    type: zodEnum(TYPE_VALUES),
  }).strict(),
  body: object({
    data: object({
      email: string(),
      password: string(),
    }).strict(),
  }).strict(),
});

// ------------------------- LOGOUT -------------------------
export const logoutSchema = object({
  params: object({
    type: zodEnum(TYPE_VALUES),
  }).strict(),
});

// ------------------------- RESET PASSWORD -------------------------
export const resetPasswordSchema = object({
  params: object({
    type: zodEnum(TYPE_VALUES),
  }).strict(),
  body: object({
    data: object({
      email: string().email(),
    }).strict(),
  }).strict(),
});

// ------------------------- SET PASSWORD -------------------------
export const setPasswordSchema = object({
  params: object({
    type: zodEnum(TYPE_VALUES),
    id: string(),
    token: string(),
  }).strict(),
  body: object({
    data: object({
      password: string().min(8),
      passwordConfirmation: string().optional(),
    })
      .strict()
      .refine((data) => validatePasswordComplexity(data.password, 3))
      .refine((data) => data.password === data.passwordConfirmation),
  }).strict(),
});

// ------------------------- EXPORTS -------------------------
export type LoginInput = TypeOf<typeof loginSchema>;
export type LogoutInput = TypeOf<typeof logoutSchema>;
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
export type SetPasswordInput = TypeOf<typeof setPasswordSchema>;
