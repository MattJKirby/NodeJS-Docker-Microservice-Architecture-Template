import config from '../../configuration/default'
import amqp, { Channel, Connection, Options } from "amqplib";
import { IMqConfig } from "../../configuration/ConfigurationTypes";

export class mqConnection {
    /**
     * RabbitMQ connecton settings from IAppConfig
     */
    private mqSettings: IMqConfig

    /**
     * Active rabbitMQ connection
     */
    public activeConnection?: Promise<Connection>

    constructor(mqSettings: IMqConfig, connectionOptions?: {newConnection?: boolean}){
        this.mqSettings = mqSettings;

        if(connectionOptions?.newConnection === true){
            this.activeConnection = this.connect();
        }
    }

    public connect = async (): Promise<Connection> => {
        return new Promise(async (resolve) => {
            const interval = setInterval(async () => {
                try{
                    resolve(await amqp.connect(this.mqSettings))
                    clearInterval(interval)
                } catch (error) {
                    console.log("Unable to establish message broker connection. Retrying...");
                }
            }, 5000)
        });
    }
}

export default new mqConnection(config.mqSettings, {newConnection: true})