import mongoose from 'mongoose';
import { IDbConfig } from '../../configuration/ConfigurationTypes';
import config from '../../configuration/default'
import { IDatabaseConnection } from './IDatabaseConnection';

/**
 * Mongo Connection singleton
 */
class MongoConnection implements IDatabaseConnection<typeof mongoose>{
    hostname: string
    databaseName: string
    port: number
    connection: Promise<typeof mongoose>

    constructor(config: IDbConfig){
        this.hostname = config.host;
        this.databaseName = config.name;
        this.port = config.port;
    
        this.connection = this.initaliseDbConnection();
    }

    /**
     * Construct a mongodb connection uri with the given parameters
     * @returns 
     */
    private constructConnectionUri = (): string => {
        return `mongodb://${this.hostname}:${this.port}/${this.databaseName}`
    }

    /**
     * Initalise a new mongodb connection
     */
    public initaliseDbConnection = (): Promise<typeof mongoose> => {
        return mongoose.connect(this.constructConnectionUri())
    }
}

export default new MongoConnection(config.db);
