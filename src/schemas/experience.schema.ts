import { object, string, number, boolean, date, TypeOf, nativeEnum } from "zod";

// CREATE EXPERIENCE
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

// FIND EXPERIENCES
export const listExperiencesSchema = object({
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

// FIND EXPERIENCE
export const findExperienceSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

// UPDATE EXPERIENCE
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

// DELETE EXPERIENCE
export const deleteExperienceSchema = object({
  params: object({
    id: string(),
  }).strict(),
});

export type CreateExperienceInput = TypeOf<typeof createExperienceSchema>;
export type ListExperiencesInput = TypeOf<typeof listExperiencesSchema>;
export type FindExperienceInput = TypeOf<typeof findExperienceSchema>;
export type UpdateExperienceInput = TypeOf<typeof updateExperienceSchema>;
export type DeleteExperienceInput = TypeOf<typeof deleteExperienceSchema>;
