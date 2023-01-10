import { handleError } from "../utils/errors";
import { checkAdminClearance } from "../utils/checkPermissions";
import {
  createExperience,
  findManyExperiences,
  findUniqueExperience,
  updateExperience,
  deleteExperience,
} from "../services/experience.service";
import type { Request, Response } from "express";
import {
  CreateExperienceInput,
  FindExperienceInput,
  ListExperiencesInput,
  UpdateExperienceInput,
  DeleteExperienceInput,
} from "../schemas/experience.schema";

// CREATE EXPERIENCE CONTROLLER
export const createExperienceController = async (
  req: Request<{}, {}, CreateExperienceInput["body"]>,
  res: Response
) => {
  if (!checkAdminClearance(res, ["SUPERADMIN", "ADMIN"])) return;

  try {
    const createExperienceOptions = {
      select: {
        id: true,
        createdAt: true,
        position: true,
        company: true,
        city: true,
        country: true,
        from: true,
        to: true,
        tasks: true,
      },
    };

    const createdExperience = await createExperience(
      req.body.data,
      createExperienceOptions
    );
    return res.send(createdExperience);
  } catch (error) {
    return handleError(error, res);
  }
};

// EXPERIENCE LIST CONTROLLER
export const listExperiencesController = async (
  req: Request<{}, {}, ListExperiencesInput["body"]>,
  res: Response
) => {
  try {
    const listOptions = {
      select: {
        id: true,
        createdAt: true,
        position: true,
        company: true,
        city: true,
        country: true,
        from: true,
        to: true,
        tasks: true,
      },
    };
    const foundExperiences = await findManyExperiences(
      req.body.params,
      listOptions
    );
    if (foundExperiences.length === 0) return res.status(204).send();
    return res.send(foundExperiences);
  } catch (error) {
    return handleError(error, res);
  }
};

// FIND EXPERIENCE CONTROLLER
export const findExperienceController = async (
  req: Request<FindExperienceInput["params"], {}, {}>,
  res: Response
) => {
  try {
    const findExperienceOptions = {
      select: {
        id: true,
        createdAt: true,
        position: true,
        company: true,
        city: true,
        country: true,
        from: true,
        to: true,
        tasks: true,
      },
    };
    const foundExperience = await findUniqueExperience(
      req.params,
      findExperienceOptions
    );
    return res.send(foundExperience);
  } catch (error) {
    return handleError(error, res);
  }
};

// UPDATE EXPERIENCE CONTROLLER
export const updateExperienceController = async (
  req: Request<
    UpdateExperienceInput["params"],
    {},
    UpdateExperienceInput["body"]
  >,
  res: Response
) => {
  if (!checkAdminClearance(res, ["SUPERADMIN", "ADMIN"])) return;

  try {
    const updateExperienceOptions = {
      select: {
        id: true,
        createdAt: true,
        position: true,
        company: true,
        city: true,
        country: true,
        from: true,
        to: true,
        tasks: true,
      },
    };

    const updatedExperience = await updateExperience(
      { id: req.params.id },
      req.body.data,
      updateExperienceOptions
    );
    return res.send(updatedExperience);
  } catch (error) {
    return handleError(error, res);
  }
};

// DELETE EXPERIENCE CONTROLLER
export const deleteExperienceController = async (
  req: Request<DeleteExperienceInput["params"], {}, {}>,
  res: Response
) => {
  try {
    if (!checkAdminClearance(res, ["SUPERADMIN", "ADMIN"])) return;

    const deleteExperienceOptions = {
      select: {
        id: true,
        createdAt: true,
        position: true,
        company: true,
        city: true,
        country: true,
        from: true,
        to: true,
        tasks: true,
      },
    };

    const deletedExperience = await deleteExperience(
      { id: req.params.id },
      deleteExperienceOptions
    );

    return res.send(deletedExperience);
  } catch (error) {
    return handleError(error, res);
  }
};