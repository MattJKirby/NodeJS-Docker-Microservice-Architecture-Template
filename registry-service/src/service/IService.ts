export interface IService {
    name: string;
    version: string;
    hostname: string;
    port: number;
    registeredAt: Date;
    lastHealthCheck: Date;
    uid?: string;
}
