import { Request, Router } from "express";
import ServiceSchema from "../models/ServiceSchema";
import { ServiceDbRequests } from "../src/db/ServiceDbRequests";

export const serviceRouter = Router();


serviceRouter.get('/:uid', async (req, res) => {

    // const x = async () => {
    //     return await ServiceSchema.find({})
    // }

    // const b = await x()

    const { uid }  = req.params

    // RegistrationManager.test(req.params.uid)
    
    // res.json({result: b});
    res.json({request: req.params})
  });

  serviceRouter.get('/', async (req, res) => {
    const serviceList = async () => {
        return ServiceDbRequests.getAllRegisteredServices()
    }

    res.json({services: await serviceList()})
  })

