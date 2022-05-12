import { IServiceMetaData } from "../service/IServceMetaData";
import { ServiceInstance } from "../service/ServiceInstance";
import { ServiceRegistration } from "../service/ServiceRegistration";
import { v4 as uuidv4 } from 'uuid';

/**
 * Singleton used for creating service registrations
 * Also generates UUIDs using service metaData
 */
class ServiceRegistrationFactory {
    
    /**
     * Generates a service uid using name, version and service instance from db.
     */
     private static generateServiceUid = (serviceMetaData: IServiceMetaData): string => {
        return `${serviceMetaData.name}_${serviceMetaData.version}_${uuidv4()}`;
    }
    
    /**
     * Checks if a uid has already been assigned, if not, generate a new one. 
     */
    public static newRegistration = (serviceMetaData: IServiceMetaData, uid: string): ServiceRegistration => {
        if(uid === undefined) {
            uid = ServiceRegistrationFactory.generateServiceUid(serviceMetaData);
            return new ServiceRegistration(serviceMetaData.name, serviceMetaData.version, new ServiceInstance(serviceMetaData.hostname, serviceMetaData.port, uid));
        } else {
            throw new Error("Can't create registration for existing service.")
        } 
    }
}

export default ServiceRegistrationFactory;