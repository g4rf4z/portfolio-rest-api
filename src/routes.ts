import { Express } from "express";

import { requireAuth } from "./middlewares/requireAuthentication";

import {
  readSessionsSchema,
  loginSchema,
  logoutSchema,
  resetPasswordSchema,
  setPasswordSchema,
  deleteSessionSchema,
  deleteInactiveSessionsSchema,
} from "./schemas/authentication.schema";
import {
  findOwnSessionController,
  findOwnSessionsHistoryController,
  loginController,
  logoutController,
  resetPasswordController,
  setNewPasswordController,
  deleteSessionController,
  deleteInactiveSessionsController,
} from "./controllers/authentication.controller";

import {
  createAdminSchema,
  readAdminSchema,
  readAdminsSchema,
  updateCurrentAdminNameSchema,
  updateCurrentAdminEmailSchema,
  updateCurrentAdminPasswordSchema,
  updateAdminRoleSchema,
  disableAdminSchema,
  deleteAdminSchema,
} from "./schemas/admin.schema";
import {
  createAdminController,
  readAdminController,
  readAdminsController,
  updateCurrentAdminNameController,
  updateCurrentAdminEmailController,
  updateCurrentAdminPasswordController,
  updateAdminRoleController,
  disableAdminController,
  deleteAdminController,
} from "./controllers/admin.controller";

import {
  createSkillSchema,
  readSkillSchema,
  readSkillsSchema,
  updateSkillSchema,
  deleteSkillSchema,
} from "./schemas/skill.schema";
import {
  createSkillController,
  readSkillController,
  readSkillsController,
  updateSkillController,
  deleteSkillController,
} from "./controllers/skill.controller";

import {
  createExperienceSchema,
  readExperienceSchema,
  readExperiencesSchema,
  updateExperienceSchema,
  deleteExperienceSchema,
} from "./schemas/experience.schema";
import {
  createExperienceController,
  readExperienceController,
  readExperiencesController,
  updateExperienceController,
  deleteExperienceController,
} from "./controllers/experience.controller";

import validateInputs from "./middlewares/validateInputs";

const routes = (app: Express) => {
  // ------------------------- SESSIONS -------------------------
  app.get(
    "/session",
    [requireAuth("ADMIN"), validateInputs(readSessionsSchema)],
    findOwnSessionController
  );
  app.get(
    "/sessions",
    [requireAuth("ADMIN"), validateInputs(readSessionsSchema)],
    findOwnSessionsHistoryController
  );
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
    "/inactive-sessions",
    [requireAuth("ADMIN"), validateInputs(deleteInactiveSessionsSchema)],
    deleteInactiveSessionsController
  );

  // ------------------------- ADMINS -------------------------
  app.post(
    "/admins",
    [requireAuth("ADMIN"), validateInputs(createAdminSchema)],
    createAdminController
  );
  app.get(
    "/admins/:id",
    [requireAuth("ADMIN"), validateInputs(readAdminSchema)],
    readAdminController
  );
  app.get(
    "/admins",
    [requireAuth("ADMIN"), validateInputs(readAdminsSchema)],
    readAdminsController
  );
  app.patch(
    "/admins/update-profile",
    [requireAuth("ADMIN"), validateInputs(updateCurrentAdminNameSchema)],
    updateCurrentAdminNameController
  );
  app.patch(
    "/admins/update-email",
    [requireAuth("ADMIN"), validateInputs(updateCurrentAdminEmailSchema)],
    updateCurrentAdminEmailController
  );
  app.patch(
    "/admins/update-password",
    [requireAuth("ADMIN"), validateInputs(updateCurrentAdminPasswordSchema)],
    updateCurrentAdminPasswordController
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
  app.get(
    "/skills/:id",
    [validateInputs(readSkillSchema)],
    readSkillController
  );
  app.get("/skills", [validateInputs(readSkillsSchema)], readSkillsController);
  app.patch(
    "/skills/:id",
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
    "/experiences/:id",
    [validateInputs(readExperienceSchema)],
    readExperienceController
  );
  app.get(
    "/experiences",
    [validateInputs(readExperiencesSchema)],
    readExperiencesController
  );
  app.patch(
    "/experiences/:id",
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
