import { Express } from "express";

import { requireAuth } from "./middlewares/requireAuthentication";

import { readSessionsSchema, loginSchema, resetPasswordSchema, setPasswordSchema, deleteSessionSchema, deleteInactiveSessionsSchema } from "./schemas/authentication.schema";
import { findOwnSessionController, findOwnSessionsHistoryController, loginController, logoutController, resetPasswordController, setNewPasswordController, deleteSessionController, deleteInactiveSessionsController } from "./controllers/authentication.controller";

import { createAdminSchema, readAdminSchema, readAdminsSchema, updateCurrentAdminNameSchema, updateCurrentAdminEmailSchema, updateCurrentAdminPasswordSchema, updateAdminRoleSchema, disableAdminSchema, deleteAdminSchema } from "./schemas/admin.schema";
import { createAdminController, readAdminController, readAdminsController, updateCurrentAdminNameController, updateCurrentAdminEmailController, updateCurrentAdminPasswordController, updateAdminRoleController, disableAdminController, deleteAdminController } from "./controllers/admin.controller";

import { createSkillSchema, readSkillSchema, readSkillsSchema, updateSkillSchema, deleteSkillSchema } from "./schemas/skill.schema";
import { createSkillController, readSkillController, readSkillsController, updateSkillController, deleteSkillController } from "./controllers/skill.controller";

import { createExperienceSchema, readExperienceSchema, readExperiencesSchema, updateExperienceSchema, deleteExperienceSchema } from "./schemas/experience.schema";
import { createExperienceController, readExperienceController, readExperiencesController, updateExperienceController, deleteExperienceController } from "./controllers/experience.controller";

import validateInputs from "./middlewares/validateInputs";

const routes = (app: Express) => {
  // ------------------------- AUTHENTICATION -------------------------
  app.post("/authentication/login", [validateInputs(loginSchema)], loginController);
  app.post("/authentication/logout", requireAuth, logoutController);
  app.get("/authentication/session", [requireAuth, validateInputs(readSessionsSchema)], findOwnSessionController);
  app.get("/authentication/sessions", [requireAuth, validateInputs(readSessionsSchema)], findOwnSessionsHistoryController);
  app.delete("/authentication/inactive-sessions", [requireAuth, validateInputs(deleteInactiveSessionsSchema)], deleteInactiveSessionsController);

  // ------------------------- ADMINS -------------------------
  app.post("/admins", [requireAuth, validateInputs(createAdminSchema)], createAdminController);
  app.get("/admins/:id", [requireAuth, validateInputs(readAdminSchema)], readAdminController);
  app.get("/admins", [requireAuth, validateInputs(readAdminsSchema)], readAdminsController);
  app.patch("/admins/update-profile", [requireAuth, validateInputs(updateCurrentAdminNameSchema)], updateCurrentAdminNameController);
  app.patch("/admins/update-email", [requireAuth, validateInputs(updateCurrentAdminEmailSchema)], updateCurrentAdminEmailController);
  app.patch("/admins/update-password", [requireAuth, validateInputs(updateCurrentAdminPasswordSchema)], updateCurrentAdminPasswordController);
  app.patch("/admins/:id/update-role", [requireAuth, validateInputs(updateAdminRoleSchema)], updateAdminRoleController);
  app.patch("/admins/:id/disable", [requireAuth, validateInputs(disableAdminSchema)], disableAdminController);
  app.delete("/admins/:id", [requireAuth, validateInputs(deleteAdminSchema)], deleteAdminController);

  // ------------------------- SKILLS -------------------------
  app.post("/skills", [requireAuth, validateInputs(createSkillSchema)], createSkillController);
  app.get("/skills/:id", [validateInputs(readSkillSchema)], readSkillController);
  app.get("/skills", [validateInputs(readSkillsSchema)], readSkillsController);
  app.patch("/skills/:id", [requireAuth, validateInputs(updateSkillSchema)], updateSkillController);
  app.delete("/skills/:id", [requireAuth, validateInputs(deleteSkillSchema)], deleteSkillController);

  // ------------------------- EXPERIENCES -------------------------
  app.post("/experiences", [requireAuth, validateInputs(createExperienceSchema)], createExperienceController);
  app.get("/experiences/:id", [validateInputs(readExperienceSchema)], readExperienceController);
  app.get("/experiences", [validateInputs(readExperiencesSchema)], readExperiencesController);
  app.patch("/experiences/:id", [requireAuth, validateInputs(updateExperienceSchema)], updateExperienceController);
  app.delete("/experiences/:id", [requireAuth, validateInputs(deleteExperienceSchema)], deleteExperienceController);
};

export default routes;
