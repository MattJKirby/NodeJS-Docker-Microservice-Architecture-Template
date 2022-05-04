import express, {Application, Request, Response} from 'express';
import Config from './configuration/default';

import ServiceInstance from './src/service/ServiceInstance';


const app:Application = express();

// Configure the rabbitMQ message broker system
ServiceInstance.registerService();

app.use(express.json());

app.get("/", (req:Request, res:Response): Response => {
    return res.json({result: req.socket.remoteAddress, result2: req.socket.remotePort});
}) 

const server = app.listen(Config.app.port, ():void => {
  console.log(`Service: '${Config.app.name}' (${Config.app.version}) Running here 👉 https://localhost:${Config.app.port}`);  
});

