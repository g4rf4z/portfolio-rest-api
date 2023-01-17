import config from "config";
import jwt from "jsonwebtoken";
import { findSession } from "../services/session.service";
import { User } from "@prisma/client";

import type { AccountType, Admin, AdminRole, Session } from "@prisma/client";

const privateKey = config.get<string>("privateKey");
const publicKey = config.get<string>("publicKey");

export type JwtTokenData = {
  type: AccountType;
  account: {
    id: string;
    lastname: string;
    firstname: string;
    email: string;
    role: AdminRole;
  };
  session: {
    id: string;
  };
};

export type AdminSession = Session & { admin: Admin };
export type UserSession = Session & { user: User };

export const signJwt = (
  object: Object,
  options?: jwt.SignOptions | undefined
) => {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

export const verifyJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, publicKey) as JwtTokenData;
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === "token expired",
      decoded: null,
    };
  }
};

export const reIssueAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  const { decoded } = verifyJwt(refreshToken) as any;
  if (!decoded || !decoded["sessionId"]) return false;

  // find corresponding session
  const Params = { id: decoded.sessionId, isActive: true };
  let foundSession: AdminSession | UserSession;
  let account: Admin | User | undefined = undefined;

  try {
    switch (decoded.type) {
      case "ADMIN":
        foundSession = (await findSession(findSessionParams, {
          include: { admin: true },
        })) as AdminSession;
        account = foundSession.admin;
        break;
      case "USER":
        foundSession = (await findSession(findSessionParams, {
          include: { user: true },
        })) as UserSession;
        account = foundSession.user;
        break;
      default:
        return false;
    }
  } catch {
    return false;
  }

  // create new access token
  return newAccessToken({
    type: decoded.type,
    account: account,
    session: { id: foundSession.id },
  });
};

export const newAccessToken = (tokenData: JwtTokenData) => {
  return signJwt(tokenData, {
    expiresIn: config.get<string>("refreshTokenTtl"),
  });
};

export const newRefreshToken = (tokenData: JwtTokenData) => {
  return signJwt(
    {
      type: tokenData.type,
      accountId: tokenData.account.id,
      sessionId: tokenData.session.id,
    },
    { expiresIn: config.get<string>("refreshTokenTtl") }
  );
};
