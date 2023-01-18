import { Request, Response } from "express";
import { checkAdminClearance } from "../utils/checkPermissions";
import { hashString } from "../utils/hash.utils";
import { handleError } from "../utils/errors";

import {
  createAdmin,
  readAdmin,
  readAdmins,
  updateAdmin,
  deleteAdmin,
} from "../services/admin.service";

import {
  CreateAdminInput,
  FindAdminInput,
  ListAdminsInput,
  UpdateCurrentAdminInput,
  UpdateCurrentAdminEmailInput,
  UpdateCurrentAdminPasswordInput,
  UpdateAdminRoleInput,
  DisableAdminInput,
  DeleteAdminInput,
} from "../schemas/admin.schema";

// ------------------------- CREATE ADMIN CONTROLLER -------------------------
export const createAdminController = async (
  req: Request<{}, {}, CreateAdminInput["body"]>,
  res: Response
) => {
  if (!checkAdminClearance(res, ["SUPERADMIN", "ADMIN"])) return;

  try {
    if (
      res.locals?.account?.role === "ADMIN" &&
      ["SUPERADMIN", "ADMIN"].includes(req.body.data.role || "")
    ) {
      req.body.data.role = "USER";
    }

    req.body.data.password = await hashString(req.body.data.password);
    delete req.body.data.passwordConfirmation;
    const createAdminOptions = {
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
    const createdAdmin = await createAdmin(req.body.data, createAdminOptions);
    return res.send(createdAdmin);
  } catch (error) {
    return handleError(error, res);
  }
};

// ------------------------- READ ADMIN CONTROLLER -------------------------
export const readAdminController = async (
  req: Request<FindAdminInput["params"], {}, {}>,
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

// ------------------------- READ ADMINS CONTROLLER -------------------------
export const readAdminsController = async (
  req: Request<{}, {}, ListAdminsInput["body"]>,
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

// ------------------------- UPDATE CURRENT ADMIN NAME CONTROLLER -------------------------
export const updateCurrentAdminNameController = async (
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
        nickname: true,
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

// ------------------------- UPDATE CURRENT ADMIN EMAIL CONTROLLER -------------------------
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
        nickname: true,
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

// ------------------------- UPDATE ADMIN ROLE CONTROLLER -------------------------
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

// ------------------------- DISABLE ADMIN CONTROLLER -------------------------
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
        nickname: true,
        email: true,
        role: true,
        isActive: true,
      },
    };
    if (res.locals.account.role === "ADMIN") {
      const foundAdmin = await readAdmin(req.params);
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

// ------------------------- DELETE ADMIN CONTROLLER -------------------------
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
        nickname: true,
        email: true,
        role: true,
        isActive: true,
      },
    };
    if (res.locals.account.role === "ADMIN") {
      const foundAdmin = await readAdmin(req.params);
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
