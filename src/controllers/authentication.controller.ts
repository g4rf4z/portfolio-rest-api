import type { Request, Response } from "express";
import type { Prisma } from "@prisma/client";
import type { JwtTokenData } from "../utils/jwt.utils";

import crypto from "crypto";
import { sendEmail } from "../utils/nodemailer";

import { readAdmin, updateAdmin } from "../services/admin.service";
import { CustomError, handleError } from "../utils/errors";
import { compareData, hashString } from "../utils/hash.utils";
import { newAccessToken, newRefreshToken } from "../utils/jwt.utils";

import {
  createResetPasswordToken,
  findResetPasswordToken,
  updateResetPasswordToken,
  updateResetPasswordTokens,
} from "../services/resetPasswordToken.service";

import { createSession, updateSessions } from "../services/session.service";

import type {
  LoginInput,
  ResetPasswordInput,
  SetPasswordInput,
} from "../schemas/authentication.schema";

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

    // Check if account exists
    try {
      const findOwnerParams = { email: req.body.data.email };
      foundOwner = await readAdmin(findOwnerParams);
    } catch (error) {
      throw badCredentials;
    }

    // Check if passwords match
    const passwordsMatch = await compareData(
      foundOwner.password,
      req.body.data.password
    );

    if (!passwordsMatch) {
      throw badCredentials;
    }

    // Create new session
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
        userAgent: true,
        admin: true,
      },
    };
    const createdSession = await createSession(
      createSessionData,
      createdSessionOptions
    );

    // Revoke active sessions
    updateSessions(
      {
        ownerId: foundOwner.id,
        isActive: true,
        NOT: { id: createdSession.id },
      },
      { isActive: false }
    );

    // Generate tokens
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

    // Set cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 900000, // 15 minutes
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

    // Send session data
    delete (createdSession as any)?.admin?.password;
    return res.send(createdSession);
  } catch (error) {
    handleError(error, res);
  }
};

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

export const resetPasswordController = async (
  req: Request<{}, {}, ResetPasswordInput["body"]>,
  res: Response
) => {
  let tokenSent = {
    message: "Password reset email has been sent (if the account exist)",
  };

  try {
    let foundAccount;

    // Checks if account exists.
    const foundAccountParams = { email: req.body.data.email };
    foundAccount = await readAdmin(foundAccountParams);

    // Invalidates previous reset password tokens.
    await updateResetPasswordTokens(
      { id: foundAccount.id },
      { isValid: false }
    );

    // Generates reset password token and save it to the database.
    let token = crypto.randomBytes(32).toString("hex");
    const tokenHash = await hashString(token);
    const createTokenData = {
      expiresAt: new Date(new Date().getTime() + 5 * 60000), // Expires after 3 minutes.
      token: tokenHash,
      ownerId: foundAccount.id,
    };
    await createResetPasswordToken(createTokenData);

    await sendEmail({
      to: foundAccount.email,
      subject: "Password Reset",
      text: "Reset password link",
      html: `<p>Bonjour,</p>
        <p>Veuillez cliquer sur le lien ci-dessous afin de valider votre nouvelle adresse email:</p>
        <p>Id: ${foundAccount.id}</p><p>ResetPasswordToken: ${token}</p>
        <a href="https://votre-domaine.com/validate-email?token=">Je valide ma nouvelle adresse email</a>
        <p>À bientôt !</p>`,
    });

    return res.status(200).send(tokenSent);
  } catch (error) {
    if (error instanceof CustomError && error.message === "not_found") {
      return res.status(200).send(tokenSent);
    }
    return handleError(error, res);
  }
};

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
