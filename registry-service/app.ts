import express, {Application} from 'express';
import config from './configuration/default'
import cors from "cors";
import axios from 'axios';
import mongoose from 'mongoose';
import MongoConnection from './src/utility/MongoConnection';
import  ServiceSchema  from './models/ServiceSchema'
import { Service } from './src/service/Service';
import { routes } from './routes/Routes';


// Server configuration
const server:Application = express();

// Initalise connection to mongodb
MongoConnection.initaliseConnection();

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





