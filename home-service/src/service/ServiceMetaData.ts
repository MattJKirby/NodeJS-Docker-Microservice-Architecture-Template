import { IAppConfig } from "../../configuration/ConfigurationTypes";
import { ServiceStatus } from "./ServiceStatus";

export interface IServiceMetaData {
    name: string;
    version: string;
    hostname: string;
    port: number;
}

export class ServiceMetaData {
     /**
     * Service name
     */
      name: string

      /**
       * Service version
       */
      version: string
  
      /**
       * Service hostname
       */
      hostname: string
  
      /**
       * Service port number
       */
      port: number

    constructor(config: IAppConfig){
        this.name = config.name;
        this.version = config.version
        this.hostname = config.hostname
        this.port = config.port;

    }
}


