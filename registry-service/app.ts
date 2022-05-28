import express, {Application} from 'express';
import config from './configuration/default'
import cors from "cors";
import axios from 'axios';
import mongoose from 'mongoose';

import { routes } from './routes/Routes';
import { RegistrationManager } from './src/registration/RegistrationManager';


// Server configuration
const server:Application = express();

//Initialise registration Manager 
const registrationManager = new RegistrationManager()

// Express and routes configuration
server.use(express.json());
server.use("/",routes);



// axios.get("http://home-service:3000/").then(res => {
//   console.log(res.data)
// })




//If connection has been initalised, start listening.
mongoose.connection.once('open', () => {
  server.listen(config.app.port, ():void => {
    console.log(`Service: '${config.app.name}' (${config.app.version}) Running here 👉 https://localhost:${config.app.port}`);
  });
})





