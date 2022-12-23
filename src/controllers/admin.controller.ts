import { AdminRole } from "@prisma/client";
import { handleError } from "../utils/errors";
import { hashString } from "../utils/hash.utils";
import { checkAdminClearance } from "../utils/checkPermissions";
import {
  createAdmin,
  deleteAdmin,
  findManyAdmins,
  findUniqueAdmin,
  updateAdmin,
} from "../services/admin.service";

import type { Request, Response } from "express";
import type {
  CreateAdminInput,
  DeleteAdminInput,
  DisableAdminInput,
  FindAdminInput,
  ListAdminsInput,
  UpdateAdminRoleInput,
  UpdateCurrentAdminEmailInput,
  UpdateCurrentAdminInput,
  UpdateCurrentAdminPasswordInput,
} from "../schemas/admin.schema";

// ADMIN CREATE CONTROLLER
export const createAdminController = async (
  req: Request<{}, {}, CreateAdminInput["body"]>,
  res: Response
) => {
  if (!checkAdminClearance(res, ["SUPERADMIN", "ADMIN"])) return;

  try {
    // check role, update if needed
    if (
      res.locals?.account?.role === "ADMIN" &&
      ["SUPERADMIN", "ADMIN"].includes(req.body.data.role || "")
    ) {
      req.body.data.role = "USER";
    }

    // password hash
    req.body.data.password = await hashString(req.body.data.password);
    delete req.body.data.passwordConfirmation;

    // create the new admin
    const createAdminOptions = {
      select: {
        id: true,
        createdAt: true,
        firstname: true,
        lastname: true,
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

// ADMIN LIST CONTROLLER
export const listAdminsController = async (
  req: Request<{}, {}, ListAdminsInput["body"]>,
  res: Response
) => {
  try {
    const listAdminsOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        isActive: true,
      },
    };
    const foundAdmins = await findManyAdmins(
      req.body.params,
      listAdminsOptions
    );
    if (foundAdmins.length === 0) return res.status(204).send();
    return res.send(foundAdmins);
  } catch (error) {
    return handleError(error, res);
  }
};

// ADMIN FIND CONTROLLER
export const findAdminController = async (
  req: Request<FindAdminInput["params"], {}, {}>,
  res: Response
) => {
  try {
    const findAdminOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        isActive: true,
      },
    };
    const foundAdmin = await findUniqueAdmin(req.params, findAdminOptions);
    return res.send(foundAdmin);
  } catch (error) {
    return handleError(error, res);
  }
};

// ADMIN UPDATE ROLE CONTROLLER
export const updateAdminRoleController = async (
  req: Request<
    UpdateAdminRoleInput["params"],
    {},
    UpdateAdminRoleInput["body"]
  >,
  res: Response
) => {
  if (!checkAdminClearance(res, ["SUPERADMIN", "ADMIN"])) return;

  try {
    // check role, update if needed
    if (
      res.locals?.account?.role === "ADMIN" &&
      ["SUPERADMIN", "ADMIN"].includes(req.body.data.role || "")
    ) {
      req.body.data.role = "USER";
    }

    const updateAdminOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        firstname: true,
        lastname: true,
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

// DISABLE ADMIN CONTROLLER
export const disableAdminController = async (
  req: Request<DisableAdminInput["params"], {}, {}>,
  res: Response
) => {
  try {
    if (!checkAdminClearance(res, ["SUPERADMIN", "ADMIN"])) return;

    const updateAdminOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        isActive: true,
      },
    };

    // let updatedAdmin;
    if (res.locals.account.role === "ADMIN") {
      const foundAdmin = await findUniqueAdmin(req.params);
      if (["SUPERADMIN", "ADMIN"].includes(foundAdmin.role)) {
        res.status(403).send();
      }
    }

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

// DELETE ADMIN CONTROLLER
export const deleteAdminController = async (
  req: Request<DeleteAdminInput["params"], {}, {}>,
  res: Response
) => {
  try {
    if (!checkAdminClearance(res, ["SUPERADMIN", "ADMIN"])) return;

    const deleteAdminOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        isActive: true,
      },
    };

    // let updatedAdmin;
    if (res.locals.account.role === "ADMIN") {
      const foundAdmin = await findUniqueAdmin(req.params);
      if (["SUPERADMIN", "ADMIN"].includes(foundAdmin.role)) {
        res.status(403).send();
      }
    }

    const deletedAdmin = await deleteAdmin(
      { id: req.params.id },
      deleteAdminOptions
    );

    return res.send(deletedAdmin);
  } catch (error) {
    return handleError(error, res);
  }
};

// CURRENT ADMIN UPDATE CONTROLLER
export const updateCurrentAdminController = async (
  req: Request<{}, {}, UpdateCurrentAdminInput["body"]>,
  res: Response
) => {
  try {
    const updateAdminOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        isActive: true,
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

// CURRENT ADMIN UPDATE EMAIL CONTROLLER
export const updateCurrentAdminEmailController = async (
  req: Request<{}, {}, UpdateCurrentAdminEmailInput["body"]>,
  res: Response
) => {
  try {
    const updateAdminOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        isActive: true,
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

// CURRENT ADMIN UPDATE PASSWORD CONTROLLER
export const updateCurrentAdminPasswordController = async (
  req: Request<{}, {}, UpdateCurrentAdminPasswordInput["body"]>,
  res: Response
) => {
  try {
    // password hash
    req.body.data.newPassword = await hashString(req.body.data.newPassword);

    await updateAdmin(
      { id: res.locals.account.id },
      { password: req.body.data.newPassword }
    );

    return res.status(204).send();
  } catch (error) {
    return handleError(error, res);
  }
};
