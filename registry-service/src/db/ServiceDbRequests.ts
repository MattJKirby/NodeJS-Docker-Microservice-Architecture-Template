import ServiceSchema from "../../models/ServiceSchema";
import { ServiceStatus } from "../service/ServiceStatus";

export class ServiceDbRequests {
    
    // /**
    //  * Find Service instances by various service parameters.
    //  */
    // public static getInstances = async (queryOptions: {name?: string, version?: string, UID?: string}): Promise<Service[]> => {
    //     return await ServiceSchema.find(queryOptions);
    // }

    /**
     * Get single service by by various service parameters
     */
    public static getService = async (queryOptions: {UID?: string}) => {
        return await ServiceSchema.findOne(queryOptions);
    }

    /**
     * Add a new service to the database
     */
    // public static addService = async (service: Service): Promise<Service> => {
    //     try{
    //         await ServiceSchema.create({
    //             name: service.name, 
    //             version: service.version, 
    //             hostname: service.hostname, 
    //             port: service.port, 
    //             registeredAt: service.registeredAt, 
    //             lastHealthCheck: service.lastHealthCheck, 
    //             status: service.status, 
    //             UID: service.UID
    //         });
    //     } catch(error){
    //         console.log(`Error registering service: ${service.UID}. ${error}`)
    //     } 
    //     return service;
    // }

    /**
     * Find service by uid and update
     */
    public static updateStatusAndHealthCheckByUid = async (uid: string, status: ServiceStatus) => {
        await ServiceSchema.findOneAndUpdate({UID: uid}, {lastHealthCheck: Date.now(), status: status});
    }

    /**
     * Find services older than a certain threshold and update status
     */
    public static updateAllServicesByHealthCheckAge = async (healthCheckAge: number, serviceUpdateParams: {status?: ServiceStatus}) => {
        const UnavailableThreshold = new Date(Date.now() - (healthCheckAge * 1000))
        await ServiceSchema.updateMany({lastHealthCheck: {"$lt" : UnavailableThreshold}}, serviceUpdateParams)
    }

    /**
     * Purge all services
     */
    public static purgeServices = async () => {
        await ServiceSchema.deleteMany({});
    }

    public static getAllRegisteredServices = async () => {
        return await ServiceSchema.find();
    }
}