import { IEnvironmentConfig } from "./IEnvironmentConfig";

const dev = {
    app: {
        port:  3000,
        version: process.env.npm_package_version || '1.0.0',
        name: process.env.npm_package_name || 'registry-service',
        title: 'Registry Service (DEV)'
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
    }
}

const test: IEnvironmentConfig = {
    app: {
        port: 3000,
        version: process.env.npm_package_version || '1.0.0',
        name: process.env.npm_package_name || 'registry-service',
        title: 'Registry Service (TEST)'
    },
    db: {
        host: 'mongo',
        port: 27017,
        name: 'db'
    }
}

/* Configuration options for different environments */
const config: any = {
    dev,
    test
}

export default config[process.env.Node_ENV || "dev"]



