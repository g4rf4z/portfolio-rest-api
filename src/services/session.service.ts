import type { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { handlePrismaError } from "../utils/errors";

// CREATE SESSION
export const createSession = async (
  data: Prisma.SessionCreateArgs["data"],
  options: Omit<Prisma.SessionCreateArgs, "data"> = {}
) => {
  try {
    return await prisma.session.create({ data, ...options });
  } catch (error) {
    throw handlePrismaError(error, "session");
  }
};

// FIND SESSION
export const findSession = async (
  params: Prisma.SessionFindUniqueOrThrowArgs["where"],
  options: Omit<Prisma.SessionFindUniqueOrThrowArgs, "where"> = {}
) => {
  try {
    return await prisma.session.findFirstOrThrow({ where: params, ...options });
  } catch (error) {
    throw handlePrismaError(error, "session");
  }
};

// UPDATE MANY SESSIONS
export const updateSessions = async (
  params: Prisma.SessionUpdateManyArgs["where"],
  data: Prisma.SessionUpdateManyArgs["data"]
) => {
  try {
    return await prisma.session.updateMany({ where: params, data });
  } catch (error) {
    throw handlePrismaError(error, "session");
  }
};

// UPDATE SESSION
export const updateSession = async (
  params: Prisma.SessionUpdateArgs["where"],
  data: Prisma.SessionUpdateArgs["data"],
  options: Omit<Prisma.SessionUpdateArgs, "where" | "data">
) => {
  try {
    return await prisma.session.update({
      where: params,
      data,
      ...options,
    });
  } catch (error) {
    throw handlePrismaError(error, "session");
  }
};
