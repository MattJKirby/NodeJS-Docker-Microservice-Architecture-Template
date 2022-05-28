import { Router } from "express";
import { serviceRouter } from "./ServiceRouter";

export const routes = Router();

routes.use('/services',serviceRouter);



  