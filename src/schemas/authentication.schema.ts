import { AccountType, AdminRole } from "@prisma/client";
import {
  object,
  string,
  boolean,
  TypeOf,
  enum as zodEnum,
  nativeEnum,
} from "zod";
import { validatePasswordComplexity } from "../utils/customValidators";

const TYPE_VALUES = ["admin", "user"] as const;

// ------------------------- SCHEMA -> READ SESSIONS -------------------------
export const readSessionsSchema = object({
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

// ------------------------- SCHEMA -> LOGIN -------------------------
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

// ------------------------- SCHEMA -> LOGOUT -------------------------
export const logoutSchema = object({
  params: object({
    type: zodEnum(TYPE_VALUES),
  }).strict(),
});

// ------------------------- SCHEMA -> RESET PASSWORD -------------------------
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

// ------------------------- SCHEMA -> SET PASSWORD -------------------------
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

// ------------------------- SCHEMA -> DELETE SESSION BY ID -------------------------
export const deleteSessionSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

// ------------------------- SCHEMA -> DELETE ALL INACTIVE SESSIONS -------------------------
export const deleteInactiveSessionsSchema = object({
  params: object({
    isActive: boolean().optional(),
  }).strict(),
});

export type ReadSessionsInput = TypeOf<typeof readSessionsSchema>;
export type LoginInput = TypeOf<typeof loginSchema>;
export type LogoutInput = TypeOf<typeof logoutSchema>;
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
export type SetPasswordInput = TypeOf<typeof setPasswordSchema>;
export type DeleteSessionInput = TypeOf<typeof deleteSessionSchema>;
export type DeleteInactiveSessionsInput = TypeOf<
  typeof deleteInactiveSessionsSchema
>;
