import { Request, Response, NextFunction } from "express";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    firstname = undefined,
    lastname = undefined,
    email = undefined,
    role = undefined,
  } = res.locals?.account;

  if (!firstname || !lastname || !email) return res.sendStatus(403);

  if (!["SUPERADMIN", "ADMIN"].includes(role)) return res.sendStatus(403);

  return next();
};
