import { object, string, nativeEnum, boolean, TypeOf } from "zod";
import { AdminRole } from "@prisma/client";
import { validatePasswordComplexity } from "../utils/customValidators";

// ------------------------- CREATE ADMIN SCHEMA -------------------------
export const createAdminSchema = object({
  body: object({
    data: object({
      firstname: string(),
      lastname: string(),
      nickname: string().min(3),
      email: string().email(),
      password: string().min(8),
      passwordConfirmation: string().optional(),
      role: nativeEnum(AdminRole).optional(),
    })
      .strict()
      .refine((data) => validatePasswordComplexity(data.password, 3))
      .refine((data) => data.password === data.passwordConfirmation),
  }).strict(),
});

// ------------------------- READ ADMIN SCHEMA -------------------------
export const readAdminSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

// ------------------------- READ ADMINS SCHEMA -------------------------
export const readAdminsSchema = object({
  body: object({
    params: object({
      id: string().optional(),
      firstname: string().optional(),
      lastname: string().optional(),
      email: string().email().optional(),
      role: nativeEnum(AdminRole).optional(),
      isActive: boolean().optional(),
    })
      .strict()
      .optional(),
  }).strict(),
});

// ------------------------- UPDATE CURRENT ADMIN NAME SCHEMA -------------------------
export const updateCurrentAdminNameSchema = object({
  body: object({
    data: object({
      lastname: string().optional(),
      firstname: string().optional(),
      nickname: string().optional(),
    }).strict(),
  }).strict(),
});

// ------------------------- UPDATE CURRENT ADMIN EMAIL SCHEMA -------------------------
export const updateCurrentAdminEmailSchema = object({
  body: object({
    data: object({
      email: string().email(),
    }).strict(),
  }).strict(),
});

// ------------------------- UPDATE CURRENT ADMIN PASSWORD SCHEMA -------------------------
export const updateCurrentAdminPasswordSchema = object({
  body: object({
    data: object({
      password: string(),
      newPassword: string().min(8),
      newPasswordConfirmation: string().optional(),
    })
      .strict()
      .refine((data) => validatePasswordComplexity(data.newPassword, 3))
      .refine((data) => data.newPassword === data.newPasswordConfirmation),
  }).strict(),
});

// ------------------------- UPDATE ADMIN ROLE SCHEMA -------------------------
export const updateAdminRoleSchema = object({
  params: object({
    id: string(),
  }).strict(),
  body: object({
    data: object({
      role: nativeEnum(AdminRole),
    }).strict(),
  }).strict(),
});

// ------------------------- DISABLE ADMIN SCHEMA -------------------------
export const disableAdminSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

// ------------------------- DELETE ADMIN SCHEMA -------------------------
export const deleteAdminSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

export type CreateAdminInput = TypeOf<typeof createAdminSchema>;
export type FindAdminInput = TypeOf<typeof readAdminSchema>;
export type ListAdminsInput = TypeOf<typeof readAdminsSchema>;
export type UpdateCurrentAdminNameInput = TypeOf<
  typeof updateCurrentAdminNameSchema
>;
export type UpdateCurrentAdminEmailInput = TypeOf<
  typeof updateCurrentAdminEmailSchema
>;
export type UpdateCurrentAdminPasswordInput = TypeOf<
  typeof updateCurrentAdminPasswordSchema
>;
export type UpdateAdminRoleInput = TypeOf<typeof updateAdminRoleSchema>;
export type DisableAdminInput = TypeOf<typeof disableAdminSchema>;
export type DeleteAdminInput = TypeOf<typeof deleteAdminSchema>;
