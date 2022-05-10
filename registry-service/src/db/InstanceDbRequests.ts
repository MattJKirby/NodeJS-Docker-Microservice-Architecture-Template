import ServiceInstanceSchema from "../../models/ServiceInstanceSchema"

export class InstanceDbRequests {
    public static incrementInstance = async (type: string) => {
        return await ServiceInstanceSchema.findOneAndUpdate({type: type}, {$inc : {'instances' : 1}}, {new: true, upsert: true})
    }

     /**
     * Purge all services
     */
      public static purgeInstances = async () => {
        await ServiceInstanceSchema.deleteMany({});
    }
}