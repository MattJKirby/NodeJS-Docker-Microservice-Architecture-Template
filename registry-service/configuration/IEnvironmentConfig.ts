export interface IEnvironmentConfig {
    app: {
        name: string,
        title: string,
        version: string,
        port: number
    },
    db: {
        host: string,
        port: number,
        name: string,
    }
}

