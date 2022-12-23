import { Express, Request, Response } from "express";
// Middlewares
import validateInputs from "./middlewares/validateInputs";
import { requireAuth } from "./middlewares/requireAuthentication";
// Authentication
import {
  loginSchema,
  logoutSchema,
  resetPasswordSchema,
  setPasswordSchema,
} from "./schemas/authentication.schema";
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

const routes = (app: Express) => {
  // Healthcheck -------------------------------------------------------
  app.get("/", (req, res) => {
    return res.send({ mesage: "Lille Esport API" });
  });

  // Login check -------------------------------------------------------

  // Authentication
  app.get(
    "/sessions/:type/isLoggedIn",
    [requireAuth()],
    (req: Request, res: Response) => {
      return res.send({
        message: "Login status: true",
        role: res.locals.account.role,
        firstname: res.locals.account.firstname,
        lastname: res.locals.account.lastname,
      });
    }
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
  app.post(
    "/reset-password/:type",
    [validateInputs(resetPasswordSchema)],
    resetPasswordController
  );
  app.post(
    "/reset-password/:type/:id/:token",
    [validateInputs(setPasswordSchema)],
    setNewPasswordController
  );

  // Admins
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
};

export default routes;
