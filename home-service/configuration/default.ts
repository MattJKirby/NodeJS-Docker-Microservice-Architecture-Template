import { IConfig, IEnvironmentConfig } from "./ConfigurationTypes";

/* Configuration options for different environments */
const Config: IConfig = {
    dev: {
        app: {
            port:  Number(process.env.PORT) || 3000,
            hostname: 'home-service',
            version: process.env.npm_package_version || '1.0.0',
            name: process.env.npm_package_name || 'home-service',
            title: 'Home Service (DEV)'
        },
        db: {
            host: 'mongo',
            port: 27017,
            name: 'homeService'
        },
        mqSettings: {
            protocol: 'amqp',
            hostname: 'rabbitmq',
            port: 5672,
            username: process.env.RABBITMQ_DEFAULT_USER || 'myuser',
            password: process.env.RABBITMQ_DEFAULT_PASS || 'mypassword',
        },
        serviceRegistration: {
            messageRequestQueue: "registry-service.registration",
            genericResponseQueue: "home-service.registration"
        }
    },

    test: {
        app: {
            port: 3000,
            hostname: 'home-service',
            version: process.env.npm_package_version || '1.0.0',
            name: process.env.npm_package_name || 'home-service',
            title: 'Home Service (TEST)'
        },
        mqSettings: {
            protocol: 'amqp',
            hostname: 'rabbitmq',
            port: 5672,
            username: process.env.RABBITMQ_DEFAULT_USER || 'myuser',
            password: process.env.RABBITMQ_DEFAULT_PASS || 'mypassword',
        },
        db: {
            host: 'mongo',
            port: 27017,
            name: 'db'
        },
        serviceRegistration: {
            messageRequestQueue: "registry-service.registration",
            genericResponseQueue: "home-service.registration"
        }
    }
}
export default Config[process.env.NODE_ENV as keyof typeof Config || 'dev']



