import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { handlePrismaError } from "../utils/errors";

// ------------------------- CREATE SKILL SERVICE -------------------------
export const createSkill = async (
  data: Prisma.SkillCreateArgs["data"],
  options: Omit<Prisma.SkillCreateArgs, "data"> = {}
) => {
  try {
    return await prisma.skill.create({ data, ...options });
  } catch (error) {
    throw handlePrismaError(error, "skill");
  }
};

// ------------------------- READ SKILL SERVICE -------------------------
export const readSkill = async (
  params: Prisma.SkillFindUniqueOrThrowArgs["where"],
  options: Omit<Prisma.SkillFindUniqueOrThrowArgs, "where"> = {}
) => {
  try {
    return await prisma.skill.findUniqueOrThrow({ where: params, ...options });
  } catch (error) {
    throw handlePrismaError(error, "skill");
  }
};

// ------------------------- READ SKILLS SERVICE -------------------------
export const readSkills = async (
  params: Prisma.SkillFindManyArgs["where"],
  options: Omit<Prisma.SkillFindManyArgs, "where"> = {}
) => {
  try {
    return await prisma.skill.findMany({ where: params, ...options });
  } catch (error) {
    throw handlePrismaError(error, "skill");
  }
};

// ------------------------- UPDATE SKILL SERVICE -------------------------
export const updateSkill = async (
  params: Prisma.SkillUpdateArgs["where"],
  data: Prisma.SkillUpdateArgs["data"],
  options: Omit<Prisma.SkillUpdateArgs, "where" | "data"> = {}
) => {
  try {
    return await prisma.skill.update({
      where: params,
      data,
      ...options,
    });
  } catch (error) {
    throw handlePrismaError(error, "skill");
  }
};

// ------------------------- DELETE SKILL SERVICE -------------------------
export const deleteSkill = async (
  params: Prisma.SkillDeleteArgs["where"],
  options: Omit<Prisma.SkillDeleteArgs, "where">
) => {
  try {
    return await prisma.skill.delete({
      where: params,
      ...options,
    });
  } catch (error) {
    throw handlePrismaError(error, "skill");
  }
};
