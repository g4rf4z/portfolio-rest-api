import { object, string, nativeEnum, boolean, enum as zodEnum, TypeOf } from "zod";
import { AccountType, AdminRole } from "@prisma/client";
import { validatePasswordComplexity } from "../utils/customValidators";

const TYPE_VALUES = ["admin", "user"] as const;

// ------------------------- READ IS LOGGED IN SCHEMA -------------------------
export const retrieveIsLoggedInSchema = object({
  body: object({
    params: object({
      id: string().optional(),
      type: nativeEnum(AccountType).optional(),
      isActive: boolean().optional(),
      userAgent: string().optional(),
      admin: nativeEnum(AdminRole).optional(),
      ownerId: string().optional(),
    })
      .strict()
      .optional(),
  }).strict(),
});

// ------------------------- RETRIEVE SESSIONS SCHEMA -------------------------
export const retrieveSessionsSchema = object({
  body: object({
    params: object({
      id: string().optional(),
      type: nativeEnum(AccountType).optional(),
      isActive: boolean().optional(),
      userAgent: string().optional(),
      admin: nativeEnum(AdminRole).optional(),
      ownerId: string().optional(),
    })
      .strict()
      .optional(),
  }).strict(),
});

// ------------------------- LOGIN SCHEMA -------------------------
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

// ------------------------- LOGOUT SCHEMA -------------------------
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

// ------------------------- DELETE SESSION SCHEMA -------------------------
export const deleteSessionSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

// ------------------------- DELETE SESSIONS SCHEMA -------------------------
export const deleteSessionsSchema = object({
  params: object({
    isActive: boolean().optional(),
  }).strict(),
});

// ------------------------- EXPORTS -------------------------
export type RetrieveIsLoggedInInput = TypeOf<typeof retrieveIsLoggedInSchema>;
export type RetrieveSessionsInput = TypeOf<typeof retrieveSessionsSchema>;
export type LoginInput = TypeOf<typeof loginSchema>;
export type LogoutInput = TypeOf<typeof logoutSchema>;
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
export type SetPasswordInput = TypeOf<typeof setPasswordSchema>;
export type DeleteSessionInput = TypeOf<typeof deleteSessionSchema>;
export type DeleteSessionsInput = TypeOf<typeof deleteSessionsSchema>;
