import { object, string, number, TypeOf } from "zod";

// ------------------------- CREATE SKILL SCHEMA -------------------------
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

// ------------------------- READ SKILL SCHEMA -------------------------
export const readSkillSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

// ------------------------- READ SKILLS SCHEMA -------------------------
export const readSkillsSchema = object({
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

// ------------------------- UPDATE SKILL SCHEMA -------------------------
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

// ------------------------- DELETE SKILLS SCHEMA -------------------------
export const deleteSkillSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

export type CreateSkillInput = TypeOf<typeof createSkillSchema>;
export type FindSkillInput = TypeOf<typeof readSkillSchema>;
export type ListSkillsInput = TypeOf<typeof readSkillsSchema>;
export type UpdateSkillInput = TypeOf<typeof updateSkillSchema>;
export type DeleteSkillInput = TypeOf<typeof deleteSkillSchema>;
