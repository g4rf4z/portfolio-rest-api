import { AdminRole } from "@prisma/client";
import { object, string, boolean, TypeOf, nativeEnum } from "zod";
import { validatePasswordComplexity } from "../utils/customValidators";

export const createAdminSchema = object({
  body: object({
    data: object({
      firstname: string(),
      lastname: string(),
      email: string().email(),
      nickname: string().min(3),
      password: string().min(8),
      passwordConfirmation: string().optional(),
      role: nativeEnum(AdminRole).optional(),
    })
      .strict()
      .refine((data) => validatePasswordComplexity(data.password, 3))
      .refine((data) => data.password === data.passwordConfirmation),
  }).strict(),
});

export const listAdminsSchema = object({
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

export const findAdminSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

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

export const disableAdminSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

export const deleteAdminSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

export const updateCurrentAdminSchema = object({
  body: object({
    data: object({
      firstname: string().optional(),
      lastname: string().optional(),
    }).strict(),
  }).strict(),
});

export const updateCurrentAdminEmailSchema = object({
  body: object({
    data: object({
      email: string().email(),
    }).strict(),
  }).strict(),
});

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

export type CreateAdminInput = TypeOf<typeof createAdminSchema>;
export type ListAdminsInput = TypeOf<typeof listAdminsSchema>;
export type FindAdminInput = TypeOf<typeof findAdminSchema>;
export type UpdateAdminRoleInput = TypeOf<typeof updateAdminRoleSchema>;
export type DisableAdminInput = TypeOf<typeof disableAdminSchema>;
export type DeleteAdminInput = TypeOf<typeof deleteAdminSchema>;

export type UpdateCurrentAdminInput = TypeOf<typeof updateCurrentAdminSchema>;
export type UpdateCurrentAdminEmailInput = TypeOf<
  typeof updateCurrentAdminEmailSchema
>;
export type UpdateCurrentAdminPasswordInput = TypeOf<
  typeof updateCurrentAdminPasswordSchema
>;
