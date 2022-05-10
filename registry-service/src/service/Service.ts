import { IService } from "./IService"
import { ServiceStatus } from "./ServiceStatus"

/**
 * Describes a registered service. TODO: Instances
 */
export class Service implements IService{
    name: string
    version: string
    hostname: string
    port: number
    registeredAt: Date
    lastHealthCheck: Date
    UID: string
    status: ServiceStatus

    constructor(service: {name: string, version: string, hostname: string, port: number}, UID: string){
        this.name = service.name;
        this.version = service.version;
        this.hostname = service.hostname;
        this.port = service.port;
        this.registeredAt = new Date();
        this.lastHealthCheck = new Date();
        this.UID = UID;
        this.status = ServiceStatus.INITIALIZING
    }
}