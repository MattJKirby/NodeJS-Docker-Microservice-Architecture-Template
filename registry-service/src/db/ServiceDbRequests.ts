import ServiceSchema from "../../models/ServiceSchema";
import { ServiceStatus } from "../service/ServiceStatus";
import MongoConnection from "../utility/MongoConnection";

export class ServiceDbRequests {
    /**
     * Get single service by by various service parameters
     */
    public static getServiceInstance = async (query: any) => {
        return MongoConnection.connection.then(async () => {
            return await ServiceSchema.findOne(query);
        });
    }

    /**
     * Find service by uid and update
     */
    public static updateStatusAndHealthCheckByUid = async (uid: string, status: ServiceStatus) => {
        return MongoConnection.connection.then(async () => {
            return await ServiceSchema.findOneAndUpdate({"instances.uid": uid}, {"instances.$.lastHealthCheck": Date.now(), "instances.$.status": status});
        });
    }

    /**
     * Find services older than a certain threshold in seconds and update status
     */
    public static updateAllServicesByHealthCheckAge = async (healthCheckAge: number, serviceUpdateParams: any) => {
        const UnavailableThreshold = new Date(Date.now() - (healthCheckAge * 1000))
        return MongoConnection.connection.then(async () => {
            await ServiceSchema.updateMany({"instances.lastHealthCheck": {"$lt" : UnavailableThreshold}}, serviceUpdateParams)
        });
    }

    /**
     * Purge all services
     */
    public static purgeServices = async () => {
        return MongoConnection.connection.then(async () => {
            await ServiceSchema.deleteMany({});
        });
    }

    /**
     * Returns all service register entries
     */
    public static getAllRegisteredServices = async () => {
        return MongoConnection.connection.then(async () => {
            return await ServiceSchema.find();
        });
    }
}