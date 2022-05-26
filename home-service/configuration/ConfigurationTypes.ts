export interface IConfig {
    readonly dev: IEnvironmentConfig
    readonly test: IEnvironmentConfig
}

export interface IEnvironmentConfig {
    readonly app: IAppConfig
    readonly db: IDbConfig
    readonly mqSettings: IMqConfig
    readonly serviceRegistration: IRegistrationConfig
}

export interface IAppConfig {
    readonly port: number,
    readonly hostname: string,
    readonly version: string,
    readonly name: string,
    readonly title: string
}

export interface IDbConfig {
    readonly host: string,
    readonly port: number,
    readonly name: string
}

export interface IMqConfig {
    readonly protocol: string,
    readonly hostname: string,
    readonly port: number,
    readonly username: string,
    readonly password: string
}

export interface IRegistrationConfig {
    readonly messageRequestQueue: string
    readonly serviceResponseQueue: string
}