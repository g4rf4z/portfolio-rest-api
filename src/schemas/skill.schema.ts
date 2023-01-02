import { object, string, number, boolean, TypeOf, nativeEnum } from "zod";

// CREATE SKILL
export const createSkillSchema = object({
  body: object({
    data: object({
      name: string(),
      icon: string(),
      iconWeight: string(),
      iconColor: string(),
      progress: number(),
    }).strict(),
  }).strict(),
});

// FIND SKILLS
export const listSkillsSchema = object({
  body: object({
    params: object({
      id: string().optional(),
      name: string(),
      icon: string(),
      iconWeight: string(),
      iconColor: string(),
      progress: number(),
    })
      .strict()
      .optional(),
  }).strict(),
});

// FIND SKILL
export const findSkillSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

// UPDATE SKILL
export const updateSkillSchema = object({
  params: object({
    id: string(),
  }).strict(),
  body: object({
    data: object({
      name: string(),
      icon: string(),
      iconWeight: string(),
      iconColor: string(),
      progress: number(),
    }).strict(),
  }).strict(),
});

// DELETE SKILL
export const deleteSkillSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

export type CreateSkillInput = TypeOf<typeof createSkillSchema>;
export type ListSkillsInput = TypeOf<typeof listSkillsSchema>;
export type FindSkillInput = TypeOf<typeof findSkillSchema>;
export type UpdateSkillInput = TypeOf<typeof updateSkillSchema>;
export type DeleteSkillInput = TypeOf<typeof deleteSkillSchema>;
