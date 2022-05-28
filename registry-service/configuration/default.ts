import { IConfig, IEnvironmentConfig } from "./ConfigurationTypes";

/* Configuration options for different environments */
const Config: IConfig = {
    dev: {
        app: {
            port:  Number(process.env.PORT) || 3000,
            hostname: 'registry-service',
            version: process.env.npm_package_version || '1.0.0',
            name: process.env.npm_package_name || 'registry-service',
            title: 'Service Registry (DEV)'
        },
        db: {
            host: 'mongo',
            port: 27017,
            name: 'serviceRegistry'
        },
        mqSettings: {
            protocol: 'amqp',
            hostname: 'rabbitmq',
            port: 5672,
            username: process.env.RABBITMQ_DEFAULT_USER || 'myuser',
            password: process.env.RABBITMQ_DEFAULT_PASS || 'mypassword',
        },
        serviceRegistration: {
            serviceRequestQueue: "registry-service.registration",
            serviceResponseQueue: "registry-service.registration"
        }
    },

    test: {
        app: {
            port:  Number(process.env.PORT) || 3000,
            hostname: 'registry-service',
            version: process.env.npm_package_version || '1.0.0',
            name: process.env.npm_package_name || 'registry-service',
            title: 'Service Registry (TEST)'
        },
        db: {
            host: 'mongo',
            port: 27017,
            name: 'serviceRegistry'
        },
        mqSettings: {
            protocol: 'amqp',
            hostname: 'rabbitmq',
            port: 5672,
            username: process.env.RABBITMQ_DEFAULT_USER || 'myuser',
            password: process.env.RABBITMQ_DEFAULT_PASS || 'mypassword',
        },
        serviceRegistration: {
            serviceRequestQueue: "registry-service.registration",
            serviceResponseQueue: "registry-service.registration"
        }
    }
}
export default Config[process.env.NODE_ENV as keyof typeof Config || 'dev']



