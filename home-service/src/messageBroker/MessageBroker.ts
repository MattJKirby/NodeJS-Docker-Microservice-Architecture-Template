import amqp, { Options } from "amqplib";
import { IMqConfig } from "../../configuration/ConfigurationTypes";
import config from '../../configuration/default'
import { MessageHandler } from "./MessageHandler";

/**
 * Message Broker singleton
 */
export class MessageBroker{

    /**
     * Active connection. This should be kept open for as long as possible since opening
     * connections is expensive.
     */
    activeConnection: Promise<amqp.Connection>

    /**
     * RMQ settings from app config
     */
    private rmqSettings: IMqConfig

    /**
     * RabbitMQ authentication mechanism.
     */
    readonly authMechanisim = ['PLAIN', 'AMQPLAIN', 'EXTERNAL']

    /**
     * ConnectionAttemptInterval
     */
    readonly connectionAttemptInterval: number =  5000

    constructor(mqSettings: IMqConfig){
        this.rmqSettings = mqSettings;
        this.activeConnection = this.establishConnection();
    }

    /**
     * Trys to establish a connection.
     * If connection attempt fails, new attmepts will be made until one succeeds. 
     * @returns connection promise
     */
    private establishConnection = async (): Promise<amqp.Connection> => {
        return new Promise(async (resolve) => {
            try{
                //Initally, try make connection attempt
                resolve(await this.attemptConnection());
            } catch {
                //If initial connection attempt fails, wait and try new attempt until connection succeeds.
                const attemptInterval = setInterval(async () => {
                     try{
                        resolve(await this.attemptConnection());
                        clearInterval(attemptInterval)
                     } catch (error) {} 
                }, this.connectionAttemptInterval)
            }
        });  
    };

    private attemptConnection = async (): Promise<amqp.Connection> => {
        return await amqp.connect({protocol: this.rmqSettings.protocol, hostname: this.rmqSettings.hostname, 
            port: this.rmqSettings.port, username: this.rmqSettings.username, password: this.rmqSettings.password});
    }

    public prepareChannel = async ():Promise<amqp.Channel> => {
        const connection = await this.activeConnection;     
        return connection.createChannel();
    }
}

export default new MessageBroker(config.mqSettings)
