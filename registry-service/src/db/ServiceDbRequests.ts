import ServiceSchema from "../../models/ServiceSchema";
import { ServiceStatus } from "../service/ServiceStatus";

export class ServiceDbRequests {
    
    /**
     * Get single service by by various service parameters
     */
    public static getServiceInstance = async (query: any) => {
        return await ServiceSchema.findOne(query);
    }

    /**
     * Find service by uid and update
     */
    public static updateStatusAndHealthCheckByUid = async (uid: string, status: ServiceStatus) => {
        await ServiceSchema.findOneAndUpdate({"instances.uid": uid}, {"instances.$.lastHealthCheck": Date.now(), "instances.$.status": status});
    }

    /**
     * Find services older than a certain threshold in seconds and update status
     */
    public static updateAllServicesByHealthCheckAge = async (healthCheckAge: number, serviceUpdateParams: any) => {
        const UnavailableThreshold = new Date(Date.now() - (healthCheckAge * 1000))
        await ServiceSchema.updateMany({"instances.lastHealthCheck": {"$lt" : UnavailableThreshold}}, serviceUpdateParams)
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