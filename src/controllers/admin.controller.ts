import { Request, Response } from "express";

import { checkAdminClearance } from "../utils/checkPermissions";
import { hashString } from "../utils/hash.utils";
import { handleError } from "../utils/errors";
import { sendEmail } from "../utils/nodemailer";

import {
  createAdmin,
  readAdmin,
  readAdmins,
  updateAdmin,
  deleteAdmin,
} from "../services/admin.service";

import type {
  CreateAdminInput,
  ReadAdminInput,
  ReadAdminsInput,
  UpdateCurrentAdminInput,
  UpdateCurrentAdminEmailInput,
  UpdateCurrentAdminPasswordInput,
  UpdateAdminRoleInput,
  DisableAdminInput,
  DeleteAdminInput,
} from "../schemas/admin.schema";

export const createAdminController = async (
  req: Request<{}, {}, CreateAdminInput["body"]>,
  res: Response
) => {
  if (!checkAdminClearance(res, ["SUPERADMIN"])) return;

  try {
    if (
      res.locals?.account?.role === "ADMIN" &&
      ["SUPERADMIN", "ADMIN"].includes(req.body.data.role || "")
    ) {
      req.body.data.role = "ADMIN";
    }

    req.body.data.password = await hashString(req.body.data.password);
    delete req.body.data.passwordConfirmation;
    const createAdminOptions = {
      select: {
        id: true,
        createdAt: true,
        firstname: true,
        lastname: true,
        nickname: true,
        email: true,
        role: true,
        isActive: true,
      },
    };
    const createdAdmin = await createAdmin(req.body.data, createAdminOptions);
    return res.send(createdAdmin);
  } catch (error) {
    return handleError(error, res);
  }
};

export const readAdminController = async (
  req: Request<ReadAdminInput["params"], {}, {}>,
  res: Response
) => {
  try {
    const readAdminOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        firstname: true,
        lastname: true,
        nickname: true,
        email: true,
        role: true,
        isActive: true,
      },
    };
    const foundAdmin = await readAdmin(req.params, readAdminOptions);
    return res.send(foundAdmin);
  } catch (error) {
    return handleError(error, res);
  }
};

export const readAdminsController = async (
  req: Request<{}, {}, ReadAdminsInput["body"]>,
  res: Response
) => {
  try {
    const readAdminsOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        firstname: true,
        lastname: true,
        nickname: true,
        email: true,
        role: true,
        isActive: true,
      },
    };
    const foundAdmins = await readAdmins(req.body.params, readAdminsOptions);
    if (foundAdmins.length === 0) return res.status(204).send();
    return res.send(foundAdmins);
  } catch (error) {
    return handleError(error, res);
  }
};

export const updateCurrentAdminController = async (
  req: Request<{}, {}, UpdateCurrentAdminInput["body"]>,
  res: Response
) => {
  try {
    const updateAdminOptions = {
      select: {
        firstname: true,
        lastname: true,
        nickname: true,
      },
    };
    const updatedAdmin = await updateAdmin(
      { id: res.locals.account.id },
      req.body.data,
      updateAdminOptions
    );
    return res.send(updatedAdmin);
  } catch (error) {
    return handleError(error, res);
  }
};

export const updateCurrentAdminEmailController = async (
  req: Request<{}, {}, UpdateCurrentAdminEmailInput["body"]>,
  res: Response
) => {
  try {
    const updateAdminOptions = {
      select: {
        email: true,
      },
    };
    const updatedAdmin = await updateAdmin(
      { id: res.locals.account.id },
      req.body.data,
      updateAdminOptions
    );
    if (updatedAdmin.email !== res.locals.account.email) {
      await sendEmail({
        to: updatedAdmin.email,
        subject: "Modification de ton adresse email",
        text: `Ton adresse email a été mise à jour avec succès. Désormais, ton identifiant de connexion est ${updatedAdmin.email}. Si tu n'es pas à l'origine de cette modification, je t'invites à me contacter immédiatement via le formulaire de contact.`,
        html: `<p>Ton adresse email a été mise à jour avec succès.<br>
      Désormais, ton identifiant de connexion est ${updatedAdmin.email}.<br>
      Si tu n'es pas à l'origine de cette modification, je t'invites à me contacter immédiatement via le formulaire de contact.</p>`,
      });
    }
    return res.send(updatedAdmin);
  } catch (error) {
    return handleError(error, res);
  }
};

export const updateCurrentAdminPasswordController = async (
  req: Request<{}, {}, UpdateCurrentAdminPasswordInput["body"]>,
  res: Response
) => {
  try {
    const updateAdminOptions = {
      select: {
        password: true,
      },
    };
    const updatedAdmin = await updateAdmin(
      { id: res.locals.account.id },
      req.body.data,
      updateAdminOptions
    );
    console.log(3);
    return res.send(updatedAdmin);
  } catch (error) {
    return handleError(error, res);
  }
};

export const updateAdminRoleController = async (
  req: Request<
    UpdateAdminRoleInput["params"],
    {},
    UpdateAdminRoleInput["body"]
  >,
  res: Response
) => {
  if (!checkAdminClearance(res, ["SUPERADMIN"])) return;

  try {
    if (
      res.locals?.account?.role === "ADMIN" &&
      ["SUPERADMIN", "ADMIN"].includes(req.body.data.role || "")
    ) {
      req.body.data.role = "ADMIN";
    }

    const updateAdminOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        firstname: true,
        lastname: true,
        nickname: true,
        email: true,
        role: true,
        isActive: true,
      },
    };
    const updatedAdmin = await updateAdmin(
      { id: req.params.id },
      req.body.data,
      updateAdminOptions
    );
    return res.send(updatedAdmin);
  } catch (error) {
    return handleError(error, res);
  }
};

export const disableAdminController = async (
  req: Request<DisableAdminInput["params"], {}, {}>,
  res: Response
) => {
  try {
    if (!checkAdminClearance(res, ["SUPERADMIN"])) return;

    const updateAdminOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        firstname: true,
        lastname: true,
        nickname: true,
        email: true,
        role: true,
        isActive: true,
      },
    };

    const updatedAdmin = await updateAdmin(
      { id: req.params.id },
      { isActive: false },
      updateAdminOptions
    );
    return res.send(updatedAdmin);
  } catch (error) {
    return handleError(error, res);
  }
};

export const deleteAdminController = async (
  req: Request<DeleteAdminInput["params"], {}, {}>,
  res: Response
) => {
  try {
    if (!checkAdminClearance(res, ["SUPERADMIN"])) return;

    const deleteAdminOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        firstname: true,
        lastname: true,
        nickname: true,
        email: true,
        role: true,
        isActive: true,
      },
    };
    const deletedAdmin = await deleteAdmin(
      { id: req.params.id },
      deleteAdminOptions
    );
    return res.send(deletedAdmin);
  } catch (error) {
    return handleError(error, res);
  }
};
