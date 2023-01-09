import { Express, Request, Response } from "express";
// Middlewares
import validateInputs from "./middlewares/validateInputs";
import { requireAuth } from "./middlewares/requireAuthentication";
// Authentication
import { loginSchema, logoutSchema, resetPasswordSchema, setPasswordSchema } from "./schemas/authentication.schema";
import {
  loginController,
  logoutController,
  resetPasswordController,
  setNewPasswordController,
} from "./controllers/authentication.controller";
// Admins
import {
  createAdminSchema,
  deleteAdminSchema,
  disableAdminSchema,
  findAdminSchema,
  listAdminsSchema,
  updateAdminRoleSchema,
} from "./schemas/admin.schema";
import {
  createAdminController,
  deleteAdminController,
  disableAdminController,
  findAdminController,
  listAdminsController,
  updateAdminRoleController,
} from "./controllers/admin.controller";

// SKILL IMPORTS
import {
  createSkillSchema,
  listSkillsSchema,
  findSkillSchema,
  updateSkillSchema,
  deleteSkillSchema,
} from "./schemas/skill.schema";

import {
  createSkillController,
  listSkillsController,
  findSkillController,
  updateSkillController,
  deleteSkillController,
} from "./controllers/skill.controller";

// EXPERIENCE IMPORTS
import {
  createExperienceSchema,
  listExperiencesSchema,
  findExperienceSchema,
  updateExperienceSchema,
  deleteExperienceSchema,
} from "./schemas/experience.schema";

import {
  createExperienceController,
  listExperiencesController,
  findExperienceController,
  updateExperienceController,
  deleteExperienceController,
} from "./controllers/experience.controller";

const routes = (app: Express) => {
  // Healthcheck ----------------------------------------------------------------------------------------------------
  app.get("/", (req, res) => {
    return res.send({ message: "Portfolio REST API is working" });
  });

  // Sessions -------------------------------------------------------------------------------------------------
  app.get("/sessions/:type/isLoggedIn", [requireAuth()], (req: Request, res: Response) => {
    return res.send({
      account: res.locals.account,
    });
  });
  app.post("/sessions/:type/login", [validateInputs(loginSchema)], loginController);
  app.post("/sessions/:type/logout", [requireAuth(), validateInputs(logoutSchema)], logoutController);
  app.post("/reset-password/:type", [validateInputs(resetPasswordSchema)], resetPasswordController);
  app.post("/reset-password/:type/:id/:token", [validateInputs(setPasswordSchema)], setNewPasswordController);

  // Admins ---------------------------------------------------------------------------------------------------------
  app.post("/admins", [requireAuth("ADMIN"), validateInputs(createAdminSchema)], createAdminController);
  app.get("/admins", [requireAuth("ADMIN"), validateInputs(listAdminsSchema)], listAdminsController);
  app.get("/admins/:id", [requireAuth("ADMIN"), validateInputs(findAdminSchema)], findAdminController);
  app.patch(
    "/admins/:id/update-role",
    [requireAuth("ADMIN"), validateInputs(updateAdminRoleSchema)],
    updateAdminRoleController
  );
  app.patch("/admins/:id/disable", [requireAuth("ADMIN"), validateInputs(disableAdminSchema)], disableAdminController);
  app.delete("/admins/:id", [requireAuth("ADMIN"), validateInputs(deleteAdminSchema)], deleteAdminController);

  // Skills ----------------------------------------------------------------------------------------------------------
  app.post("/skills", [requireAuth("ADMIN"), validateInputs(createSkillSchema)], createSkillController);
  app.get("/skills", [validateInputs(listSkillsSchema)], listSkillsController);
  app.get("/skills/:id", [validateInputs(findSkillSchema)], findSkillController);
  app.patch("/skills/:id/update-role", [requireAuth("ADMIN"), validateInputs(updateSkillSchema)], updateSkillController);
  app.delete("/skills/:id", [requireAuth("ADMIN"), validateInputs(deleteSkillSchema)], deleteSkillController);

  // Experiences ------------------------------------------------------------------------------------------------------
  app.post("/experiences", [requireAuth("ADMIN"), validateInputs(createExperienceSchema)], createExperienceController);
  app.get("/experiences", [validateInputs(listExperiencesSchema)], listExperiencesController);
  app.get("/experiences/:id", [validateInputs(findExperienceSchema)], findExperienceController);
  app.patch(
    "/experiences/:id/update-role",
    [requireAuth("ADMIN"), validateInputs(updateExperienceSchema)],
    updateExperienceController
  );
  app.delete("/experiences/:id", [requireAuth("ADMIN"), validateInputs(deleteExperienceSchema)], deleteExperienceController);
};

export default routes;
