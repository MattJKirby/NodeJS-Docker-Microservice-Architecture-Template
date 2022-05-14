import { IService } from "./IService"
import { ServiceInstance } from "./ServiceInstance"
import { ServiceStatus } from "./ServiceStatus"

/**
 * Describes a registered service. 
 * Instances store all the specific info pertaining to the instance that is registered.
 */
export class ServiceRegistration{
    name: string
    version: string
    instance: ServiceInstance

    constructor(name: string, version: string, instance: ServiceInstance){
        this.name = name;
        this.version = version;
        this.instance = instance;
    }
}