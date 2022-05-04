import mongoose from 'mongoose';
import config from '../../configuration/default'

/**
 * Mongo Connection singleton
 */
class MongoConnection{
    hostname: string
    databaseName: string
    port: number

    constructor(config: {host: string, name: string, port: number}){
        this.hostname = config.host;
        this.databaseName = config.name;
        this.port = config.port;
    }

    /**
     * Construct a mongodb connection uri with the given parameters
     * @returns 
     */
    private constructMongoConnectionUri = (): string => {
        return `mongodb://${this.hostname}:${this.port}/${this.databaseName}`
    }

    /**
     * Initalise a new mongodb connection
     */
    public initaliseConnection = async () => {
        try{
            await mongoose.connect(this.constructMongoConnectionUri())
        } catch(err) {
            console.log(err)
        }
    }
}

export default new MongoConnection(config.db)
