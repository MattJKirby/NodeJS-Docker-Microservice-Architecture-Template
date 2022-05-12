import { ServiceStatus } from "./ServiceStatus"

export class ServiceInstance {
    hostname: string
    port: number
    registeredAt: Date
    lastHealthCheck: Date
    uid: string
    status: ServiceStatus

    constructor(hostname: string, port: number, uid: string){
        this.hostname = hostname;
        this.port = port;
        this.registeredAt = new Date();
        this.lastHealthCheck = new Date();
        this.uid = uid;
        this.status = ServiceStatus.INITIALIZING
    }
}