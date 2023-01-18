import { Express } from "express";
import { requireAuth } from "./middlewares/requireAuthentication";

import validateInputs from "./middlewares/validateInputs";

import {
  deleteSessionSchema,
  deleteSessionsSchema,
  loginSchema,
  logoutSchema,
  resetPasswordSchema,
  retrieveIsLoggedInSchema,
  retrieveSessionsSchema,
  setPasswordSchema,
} from "./schemas/authentication.schema";

import {
  deleteSessionController,
  deleteSessionsController,
  loginController,
  logoutController,
  resetPasswordController,
  retrieveIsLoggedInController,
  retrieveSessionsController,
  setNewPasswordController,
} from "./controllers/authentication.controller";

import {
  createAdminSchema,
  readAdminSchema,
  readAdminsSchema,
  updateCurrentAdminNameSchema,
  updateAdminRoleSchema,
  disableAdminSchema,
  deleteAdminSchema,
  updateCurrentAdminEmailSchema,
} from "./schemas/admin.schema";

import {
  createAdminController,
  readAdminController,
  readAdminsController,
  updateCurrentAdminNameController,
  updateAdminRoleController,
  disableAdminController,
  deleteAdminController,
  updateCurrentAdminEmailController,
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

const routes = (app: Express) => {
  // ------------------------- HEALTH CHECK -------------------------
  app.get("/", (req, res) => {
    return res.send({ message: "portfolio-rest-api is working" });
  });

  // ------------------------- SESSIONS -------------------------
  app.get(
    "/sessions/is-logged-in",
    [requireAuth("ADMIN"), validateInputs(retrieveIsLoggedInSchema)],
    retrieveIsLoggedInController
  );
  app.get(
    "/sessions/sessions",
    [requireAuth("ADMIN"), validateInputs(retrieveSessionsSchema)],
    retrieveSessionsController
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
    "/admins/update-name",
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
    [requireAuth("ADMIN"), validateInputs(updateCurrentAdminEmailSchema)],
    updateCurrentAdminEmailController
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
  app.get("/skills", [validateInputs(readSkillsSchema)], readSkillsController);
  app.get(
    "/skills/:id",
    [validateInputs(readSkillSchema)],
    readSkillController
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
    [validateInputs(readExperiencesSchema)],
    readExperiencesController
  );
  app.get(
    "/experiences/:id",
    [validateInputs(readExperienceSchema)],
    readExperienceController
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
