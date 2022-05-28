import express, {Application, Request, Response} from 'express';
import Config from './configuration/default';
import RegistrationManager from './src/service/RegistrationManager';
import { Service } from './src/service/Service';


const app:Application = express();

//Handles service registration and healthChecks with service registry
const service = new Service(Config,RegistrationManager);

app.use(express.json());

app.get("/", (req:Request, res:Response): Response => {
    return res.json({result: req.socket.remoteAddress, result2: req.socket.remotePort});
}) 


const server = app.listen(Config.app.port, ():void => {
  console.log(`Service: '${Config.app.name}' (${Config.app.version}) Running here 👉 https://localhost:${Config.app.port}`);  
});

