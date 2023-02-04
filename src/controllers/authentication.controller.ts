import type { Request, Response } from "express";
import type { Prisma } from "@prisma/client";
import type { JwtTokenData } from "../utils/jwt.utils";

import crypto from "crypto";

import { readAdmin, updateAdmin } from "../services/admin.service";
import { CustomError, handleError } from "../utils/errors";
import { compareData, hashString } from "../utils/hash.utils";
import { newAccessToken, newRefreshToken } from "../utils/jwt.utils";
import { checkAdminClearance } from "../utils/checkPermissions";

import {
  createResetPasswordToken,
  findResetPasswordToken,
  updateResetPasswordToken,
  updateResetPasswordTokens,
} from "../services/resetPasswordToken.service";

import {
  createSession,
  readSessions,
  updateSessions,
  deleteSession,
  deleteSessions,
  readSession,
} from "../services/session.service";

import type {
  ReadSessionsInput,
  LoginInput,
  ResetPasswordInput,
  SetPasswordInput,
  DeleteSessionInput,
  DeleteInactiveSessionsInput,
} from "../schemas/authentication.schema";

// ------------------------- CONTROLLER -> FIND OWN SESSION -------------------------
export const findOwnSessionController = async (
  req: Request<{}, {}, ReadSessionsInput["body"]>,
  res: Response
) => {
  try {
    const findOwnSessionOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        type: true,
        isActive: true,
        userAgent: true,
        admin: true,
        ownerId: true,
      },
    };
    const foundOwnSession = await readSession(
      { ownerId: res.locals?.account?.id, isActive: true },
      findOwnSessionOptions
    );

    return res.send(foundOwnSession);
  } catch (error) {
    return handleError(error, res);
  }
};

// ------------------------- CONTROLLER -> FIND OWN SESSIONS HISTORY -------------------------
export const findOwnSessionsHistoryController = async (
  req: Request<{}, {}, ReadSessionsInput["body"]>,
  res: Response
) => {
  try {
    const findOwnSessionsHistoryOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        type: true,
        isActive: true,
        userAgent: true,
        admin: true,
        ownerId: true,
      },
    };
    const foundOwnSessionsHistory = await readSessions(
      { ownerId: res.locals?.account?.id },
      findOwnSessionsHistoryOptions
    );
    if (foundOwnSessionsHistory.length === 0) return res.status(204).send();
    return res.send(foundOwnSessionsHistory);
  } catch (error) {
    return handleError(error, res);
  }
};

// ------------------------- LOGIN CONTROLLER -------------------------
export const loginController = async (
  req: Request<{}, {}, LoginInput["body"]>,
  res: Response
) => {
  try {
    let foundOwner;
    let badCredentials = new CustomError({
      path: "global",
      code: 401,
      message: "invalid_credentials",
    });

    // check if account exist
    try {
      const findOwnerParams = { email: req.body.data.email };
      foundOwner = await readAdmin(findOwnerParams);
    } catch (error) {
      throw badCredentials;
    }

    // check password match
    const passwordsMatch = await compareData(
      foundOwner.password,
      req.body.data.password
    );

    if (!passwordsMatch) {
      throw badCredentials;
    }

    // create a new session
    const createSessionData: Prisma.SessionCreateInput = {
      userAgent: req.get("user-agent") || null,
      admin: {
        connect: { id: foundOwner.id },
      },
    };

    const createdSessionOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        userAgent: true,
        admin: true,
      },
    };
    const createdSession = await createSession(
      createSessionData,
      createdSessionOptions
    );

    // revoke all active sessions
    updateSessions(
      {
        ownerId: foundOwner.id,
        isActive: true,
        NOT: { id: createdSession.id },
      },
      { isActive: false }
    );

    // generate tokens
    const tokenData: JwtTokenData = {
      account: {
        id: foundOwner.id,
        firstname: foundOwner.firstname,
        lastname: foundOwner.lastname,
        email: foundOwner.email,
        role: foundOwner.role,
      },
      session: {
        id: createdSession.id,
      },
    };

    const accessToken = newAccessToken(tokenData);
    const refreshToken = newRefreshToken(tokenData);

    // set cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 9000000, // 15 minutes
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 604800000, // 7 days
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    // send session data
    delete (createdSession as any)?.admin?.password;
    return res.send(createdSession);
  } catch (error) {
    handleError(error, res);
  }
};

// ------------------------- LOGOUT CONTROLLER -------------------------
export const logoutController = async (req: Request, res: Response) => {
  try {
    // revoke all active sessions
    res.locals = {};
    updateSessions(
      { ownerId: res.locals?.account?.id, isActive: true },
      { isActive: false }
    );

    // send new token to overwrite the previous one
    res.cookie("accessToken", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.cookie("refreshToken", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.send({ message: "Logout successful" });
  } catch (error) {
    handleError(error, res);
  }
};

// ------------------------- RESET PASSWORD -------------------------
export const resetPasswordController = async (
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response
) => {
  let tokenSent = {
    message: "Password reset email has been sent (if the account exist)",
  };
  try {
    let foundAccount;

    // check if account exist
    const foundAccountParams = { email: req.body.data.email };
    foundAccount = await readAdmin(foundAccountParams);

    // invalidate previous reset password tokens
    await updateResetPasswordTokens(
      { id: foundAccount.id },
      { isValid: false }
    );

    // generate reset password token and save it
    let token = crypto.randomBytes(32).toString("hex");
    const tokenHash = await hashString(token);
    const createTokenData = {
      expiresAt: new Date(new Date().getTime() + 5 * 60000), // expires in 3 minutes
      token: tokenHash,
      ownerId: foundAccount.id,
    };
    await createResetPasswordToken(createTokenData);

    // send email
    // await sendEmail({
    //   to: foundAccount.email,
    //   subject: "Password Reset - Lille Esport",
    //   text: "Reset password link",
    //   html: `<p>Id: ${foundAccount.id}</p><p>ResetPasswordToken: ${token}</p>`,
    // });

    return res.status(200).send(tokenSent);
  } catch (error) {
    if (error instanceof CustomError && error.message === "not_found") {
      return res.status(200).send(tokenSent);
    }
    return handleError(error, res);
  }
};

// ------------------------- SET PASSWORD -------------------------
export const setNewPasswordController = async (
  req: Request<SetPasswordInput["params"], {}, SetPasswordInput["body"]>,
  res: Response
) => {
  try {
    let foundToken;
    try {
      foundToken = await findResetPasswordToken({
        ownerId: req.params.id,
        isValid: true,
        expiresAt: {
          gte: new Date(),
        },
      });
    } catch (error) {
      return res.status(498).send();
    }

    const tokenMatch = await compareData(foundToken.token, req.params.token);
    if (!tokenMatch) return res.status(498).send();

    // invalidate token
    await updateResetPasswordToken({ id: foundToken.id }, { isValid: false });

    // hash password
    req.body.data.password = await hashString(req.body.data.password);
    delete req.body.data.passwordConfirmation;

    // set new password
    await updateAdmin(
      { id: req.params.id },
      { password: req.body.data.password }
    );

    return res.status(200).send({ message: "Successfully updated password" });
  } catch (error) {
    return handleError(error, res);
  }
};

// ------------------------- CONTROLLER -> DELETE SESSION BY ID -------------------------
export const deleteSessionController = async (
  req: Request<DeleteSessionInput["params"], {}, {}>,
  res: Response
) => {
  try {
    if (!checkAdminClearance(res, ["SUPERADMIN", "ADMIN"])) return;

    const deleteSessionOptions = {
      select: {
        id: true,
        createdAt: true,
        type: true,
        isActive: true,
        userAgent: true,
        admin: true,
        user: true,
        ownerId: true,
      },
    };
    const deletedSession = await deleteSession(
      { id: req.params.id },
      deleteSessionOptions
    );
    return res.send(deletedSession);
  } catch (error) {
    return handleError(error, res);
  }
};

// ------------------------- CONTROLLER -> DELETE ALL INACTIVE SESSIONS -------------------------
export const deleteInactiveSessionsController = async (
  req: Request<DeleteInactiveSessionsInput["params"], {}, {}>,
  res: Response
) => {
  try {
    if (!checkAdminClearance(res, ["SUPERADMIN", "ADMIN"])) return;

    const deletedInactiveSessions = await deleteSessions({ isActive: false });
    return res.send(deletedInactiveSessions);
  } catch (error) {
    return handleError(error, res);
  }
};
