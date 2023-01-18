import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { handlePrismaError } from "../utils/errors";

// ------------------------- CREATE SESSION -------------------------
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

// ------------------------- READ IS LOGGED IN -------------------------
export const retrieveIsLoggedIn = async (
  params: Prisma.SessionFindManyArgs["where"],
  options: Omit<Prisma.SessionFindManyArgs, "where"> = {}
) => {
  try {
    return await prisma.session.findMany({ where: params, ...options });
  } catch (error) {
    throw handlePrismaError(error, "session");
  }
};

// ------------------------- READ SESSION -------------------------
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

// ------------------------- READ SESSIONS -------------------------
export const retrieveSessions = async (
  params: Prisma.SessionFindManyArgs["where"],
  options: Omit<Prisma.SessionFindManyArgs, "where"> = {}
) => {
  try {
    return await prisma.session.findMany({ where: params, ...options });
  } catch (error) {
    throw handlePrismaError(error, "session");
  }
};

// ------------------------- UPDATE SESSION -------------------------
export const updateSession = async (
  params: Prisma.SessionUpdateArgs["where"],
  data: Prisma.SessionUpdateArgs["data"],
  options: Omit<Prisma.SessionUpdateArgs, "where" | "data">
) => {
  try {
    return await prisma.session.update({ where: params, data, ...options });
  } catch (error) {
    throw handlePrismaError(error, "session");
  }
};

// ------------------------- UPDATE SESSIONS -------------------------
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

// ------------------------- DELETE SESSION -------------------------
export const deleteSession = async (
  params: Prisma.SessionDeleteArgs["where"],
  options: Omit<Prisma.SessionDeleteArgs, "where">
) => {
  try {
    return await prisma.session.delete({ where: params, ...options });
  } catch (error) {
    throw handlePrismaError(error, "session");
  }
};

// ------------------------- DELETE SESSIONS -------------------------
export const deleteSessions = async (
  params: Prisma.SessionDeleteManyArgs["where"],
  options: Omit<Prisma.SessionDeleteManyArgs, "where"> = {}
) => {
  try {
    return await prisma.session.deleteMany({ where: params, ...options });
  } catch (error) {
    throw handlePrismaError(error, "session");
  }
};
