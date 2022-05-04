import { Request, Router } from "express";
import ServiceSchema from "../models/ServiceSchema";
import { ServiceDbRequests } from "../src/db/ServiceDbRequests";
import  RegistrationManager  from '../src/registration/RegistrationManager';

export const serviceRouter = Router();


serviceRouter.get('/:uid', async (req, res) => {

    // const x = async () => {
    //     return await ServiceSchema.find({})
    // }

    // const b = await x()

    const { uid }  = req.params

    RegistrationManager.test(req.params.uid)
    
    // res.json({result: b});
    res.json({request: req.params})
  });

  serviceRouter.get('/', async (req, res) => {
    const serviceList = async () => {
        console.log("Called")
        return ServiceDbRequests.getAllRegisteredServices()
    }

    console.log(await serviceList());

    res.json({services: await serviceList()})
  })

