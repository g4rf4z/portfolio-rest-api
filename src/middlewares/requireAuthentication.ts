import { AccountType } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

export const requireAuth = (accountType?: AccountType) => (req: Request, res: Response, next: NextFunction) => {
  let type = accountType;
  if (!type) type = req.params.type.toUpperCase() as AccountType;
  if (type && res?.locals?.type !== type) return res.sendStatus(403);

  const { firstname = undefined, lastname = undefined, email = undefined, role = undefined } = res.locals?.account;

  if (!firstname || !lastname || !email) return res.sendStatus(403);

  switch (res?.locals?.type) {
    case "ADMIN":
      if (!["SUPERADMIN", "ADMIN", "USER", "GUEST"].includes(role)) return res.sendStatus(403);
      break;
    case "USER":
      if (!["USER"].includes(role)) return res.sendStatus(403);
      break;
  }

  return next();
};
