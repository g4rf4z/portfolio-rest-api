import { object, string, TypeOf } from "zod";

// ------------------------- CREATE EXPERIENCE SCHEMA -------------------------
export const createExperienceSchema = object({
  body: object({
    data: object({
      position: string(),
      company: string(),
      city: string(),
      country: string(),
      from: string(),
      to: string(),
      tasks: string(),
    }).strict(),
  }).strict(),
});

// ------------------------- READ EXPERIENCE SCHEMA -------------------------
export const readExperienceSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

// ------------------------- READ EXPERIENCES SCHEMA -------------------------
export const readExperiencesSchema = object({
  body: object({
    params: object({
      id: string().optional(),
      position: string(),
      company: string(),
      city: string(),
      country: string(),
      from: string(),
      to: string(),
      tasks: string(),
    })
      .strict()
      .optional(),
  }).strict(),
});

// ------------------------- UPDATE EXPERIENCE SCHEMA -------------------------
export const updateExperienceSchema = object({
  params: object({
    id: string(),
  }).strict(),
  body: object({
    data: object({
      position: string(),
      company: string(),
      city: string(),
      country: string(),
      from: string(),
      to: string(),
      tasks: string(),
    }).strict(),
  }).strict(),
});

// ------------------------- DELETE EXPERIENCE SCHEMA -------------------------
export const deleteExperienceSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

export type CreateExperienceInput = TypeOf<typeof createExperienceSchema>;
export type FindExperienceInput = TypeOf<typeof readExperienceSchema>;
export type ListExperiencesInput = TypeOf<typeof readExperiencesSchema>;
export type UpdateExperienceInput = TypeOf<typeof updateExperienceSchema>;
export type DeleteExperienceInput = TypeOf<typeof deleteExperienceSchema>;
