import { Express, Request, Response } from "express";

import validateInputs from "./middlewares/validateInputs";
import { requireAuth } from "./middlewares/requireAuthentication";

import {
  deleteSessionSchema,
  deleteSessionsSchema,
  loginSchema,
  logoutSchema,
  resetPasswordSchema,
  setPasswordSchema,
} from "./schemas/authentication.schema";
import {
  deleteSessionController,
  deleteSessionsController,
  loginController,
  logoutController,
  resetPasswordController,
  setNewPasswordController,
} from "./controllers/authentication.controller";

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
  // ------------------------- HEALTH CHECK -------------------------
  app.get("/", (req, res) => {
    return res.send({ message: "Portfolio REST API is working" });
  });

  // ------------------------- SESSIONS -------------------------
  app.get(
    "/sessions/:type/isLoggedIn",
    [requireAuth()],
    (req: Request, res: Response) => {
      return res.send({
        account: res.locals.account,
      });
    }
  );
  // app.get("/sessions/:type/status", [requireAuth(), validateInputs(statusSchema)], statusController);
  app.post(
    "/sessions/:type/login",
    [validateInputs(loginSchema)],
    loginController
  );
  app.post(
    "/sessions/:type/logout",
    [requireAuth(), validateInputs(logoutSchema)],
    logoutController
  );
  app.delete(
    "/sessions/:id",
    [requireAuth("ADMIN"), validateInputs(deleteSessionSchema)],
    deleteSessionController
  );
  app.delete(
    "/sessions",
    [requireAuth("ADMIN"), validateInputs(deleteSessionsSchema)],
    deleteSessionsController
  );

  // ------------------------- ADMINS -------------------------
  app.post(
    "/admins",
    [requireAuth("ADMIN"), validateInputs(createAdminSchema)],
    createAdminController
  );
  app.get(
    "/admins",
    [requireAuth("ADMIN"), validateInputs(listAdminsSchema)],
    listAdminsController
  );
  app.get(
    "/admins/:id",
    [requireAuth("ADMIN"), validateInputs(findAdminSchema)],
    findAdminController
  );
  app.patch(
    "/admins/:id/update-role",
    [requireAuth("ADMIN"), validateInputs(updateAdminRoleSchema)],
    updateAdminRoleController
  );
  app.patch(
    "/admins/:id/disable",
    [requireAuth("ADMIN"), validateInputs(disableAdminSchema)],
    disableAdminController
  );
  app.delete(
    "/admins/:id",
    [requireAuth("ADMIN"), validateInputs(deleteAdminSchema)],
    deleteAdminController
  );

  // ------------------------- SKILLS -------------------------
  app.post(
    "/skills",
    [requireAuth("ADMIN"), validateInputs(createSkillSchema)],
    createSkillController
  );
  app.get("/skills", [validateInputs(listSkillsSchema)], listSkillsController);
  app.get(
    "/skills/:id",
    [validateInputs(findSkillSchema)],
    findSkillController
  );
  app.patch(
    "/skills/:id/update-role",
    [requireAuth("ADMIN"), validateInputs(updateSkillSchema)],
    updateSkillController
  );
  app.delete(
    "/skills/:id",
    [requireAuth("ADMIN"), validateInputs(deleteSkillSchema)],
    deleteSkillController
  );

  // ------------------------- EXPERIENCES -------------------------
  app.post(
    "/experiences",
    [requireAuth("ADMIN"), validateInputs(createExperienceSchema)],
    createExperienceController
  );
  app.get(
    "/experiences",
    [validateInputs(listExperiencesSchema)],
    listExperiencesController
  );
  app.get(
    "/experiences/:id",
    [validateInputs(findExperienceSchema)],
    findExperienceController
  );
  app.patch(
    "/experiences/:id/update-role",
    [requireAuth("ADMIN"), validateInputs(updateExperienceSchema)],
    updateExperienceController
  );
  app.delete(
    "/experiences/:id",
    [requireAuth("ADMIN"), validateInputs(deleteExperienceSchema)],
    deleteExperienceController
  );
};

export default routes;
