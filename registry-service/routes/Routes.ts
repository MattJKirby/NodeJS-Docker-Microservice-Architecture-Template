import { Router } from "express";
import RegistrationManager from "../src/registration/RegistrationManager";
import { serviceRouter } from "./ServiceRouter";

export const routes = Router();

routes.use('/services',serviceRouter);



  