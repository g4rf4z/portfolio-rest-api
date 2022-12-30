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
    const foundSkills = await findManySkills(req.body.params, listOptions);
    if (foundSkills.length === 0) return res.status(204).send();
    return res.send(foundSkills);
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
    const foundSkill = await findUniqueSkill(req.params, findSkillOptions);
    return res.send(foundSkill);
  } catch (error) {
    return handleError(error, res);
  }
};

// UPDATE SKILL CONTROLLER
export const updateSkillController = async (
  req: Request<UpdateSkillInput["params"], {}, UpdateSkillInput["body"]>,
  res: Response
) => {
  if (!checkAdminClearance(res, ["SUPERADMIN", "ADMIN"])) return;

  try {
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

    const updatedSkill = await updateSkill(
      { id: req.params.id },
      req.body.data,
      updateSkillOptions
    );
    return res.send(updatedSkill);
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
