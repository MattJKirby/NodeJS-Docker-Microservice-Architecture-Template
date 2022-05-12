import InstanceSchema from "../InstanceSchema";

export const notEmpty = (instances: typeof InstanceSchema[]) => {
    return instances.length > 0;
}