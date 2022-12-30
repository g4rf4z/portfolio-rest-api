import { handleError } from "../utils/errors";
import { checkAdminClearance } from "../utils/checkPermissions";
import {
  createSkill,
  findManySkills,
  findUniqueSkill,
  updateSkill,
  deleteSkill,
} from "../services/skill.service";
import type { Request, Response } from "express";
import {
  CreateSkillInput,
  FindSkillInput,
  ListSkillsInput,
  UpdateSkillInput,
  DeleteSkillInput,
  createSkillSchema,
} from "../schemas/skill.schema";

// CREATE SKILL CONTROLLER
export const createSkillController = async (
  req: Request<{}, {}, CreateSkillInput["body"]>,
  res: Response
) => {
  if (!checkAdminClearance(res, ["SUPERADMIN", "ADMIN"])) return;

  try {
    // Create a new skill.
    const createSkillOptions = {
      select: {
        id: true,
        createdAt: true,
        name: true,
        icon: true,
        iconWeight: true,
        iconColor: true,
        progress: true,
      },
    };

    const createdSkill = await createSkillSchema(
      req.body.data,
      createSkillOptions
    );
    return res.send(createdSkill);
  } catch (error) {
    return handleError(error, res);
  }
};

// SKILL LIST CONTROLLER
export const listSkillsController = async (
  req: Request<{}, {}, ListSkillsInput["body"]>,
  res: Response
) => {
  try {
    const listOptions = {
      select: {
        id: true,
        createdAt: true,
        name: true,
        icon: true,
        iconWeight: true,
        iconColor: true,
        progress: true,
      },
    };
    const foundAdmins = await findManySkills(req.body.params, listOptions);
    if (foundAdmins.length === 0) return res.status(204).send();
    return res.send(foundAdmins);
  } catch (error) {
    return handleError(error, res);
  }
};

// FIND SKILL CONTROLLER
export const findSkillController = async (
  req: Request<FindSkillInput["params"], {}, {}>,
  res: Response
) => {
  try {
    const findSkillOptions = {
      select: {
        id: true,
        createdAt: true,
        name: true,
        icon: true,
        iconWeight: true,
        iconColor: true,
        progress: true,
      },
    };
    const foundAdmin = await findUniqueSkill(req.params, findSkillOptions);
    return res.send(foundAdmin);
  } catch (error) {
    return handleError(error, res);
  }
};

// UPDATE SKILL CONTROLLER
export const updateAdminRoleController = async (
  req: Request<UpdateSkillInput["params"], {}, UpdateSkillInput["body"]>,
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

    const updateSkillOptions = {
      select: {
        id: true,
        createdAt: true,
        name: true,
        icon: true,
        iconWeight: true,
        iconColor: true,
        progress: true,
      },
    };

    const updatedAdmin = await updateSkill(
      { id: req.params.id },
      req.body.data,
      updateSkillOptions
    );
    return res.send(updatedAdmin);
  } catch (error) {
    return handleError(error, res);
  }
};

// DELETE ADMIN CONTROLLER
export const deleteSkillController = async (
  req: Request<DeleteSkillInput["params"], {}, {}>,
  res: Response
) => {
  try {
    if (!checkAdminClearance(res, ["SUPERADMIN", "ADMIN"])) return;

    const deleteSkillOptions = {
      select: {
        id: true,
        createdAt: true,
        name: true,
        icon: true,
        iconWeight: true,
        iconColor: true,
        progress: true,
      },
    };

    const deletedSkill = await deleteSkill(
      { id: req.params.id },
      deleteSkillOptions
    );

    return res.send(deletedSkill);
  } catch (error) {
    return handleError(error, res);
  }
};
