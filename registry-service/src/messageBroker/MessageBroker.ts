import amqp, { Options } from "amqplib";
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
     * Protocol used for establishing RabbitMQ connection.
     */
    protocol: string

    /**
     * Hostname used for establishing RabbitMQ connection.
     */
    hostname: string

    /**
     * port number used for establishing RabbitMQ connection.
     */
    port: number

    /**
     * RabbitMQ authentication mechanism.
     */
    readonly authMechanisim = ['PLAIN', 'AMQPLAIN', 'EXTERNAL']

    /**
     * Username for connecting to rabbitMQ
     */
    private username: string;

    /**
     * Password for connecting to RabbitMQ
     */
    private password: string

    /**
     * ConnectionAttemptInterval
     */
    readonly connectionAttemptInterval: number =  5000

    /**
     * All registered message handlers, used for handing messages by token.
     */
    private registeredMessageHandlers: Array<MessageHandler> = [];

    constructor(RMQSettings: {protocol: string, hostname: string, port: number, username: string, password: string}){
        this.protocol = RMQSettings.protocol;
        this.hostname = RMQSettings.hostname;
        this.port = RMQSettings.port;
        this.username = RMQSettings.username;
        this.password = RMQSettings.password;

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
        try {
            return await amqp.connect({protocol: this.protocol, hostname: this.hostname, port: this.port, username: this.username, password: this.password});
        } catch (err) {
            throw("Failed to connect to to RabbitMQ")
        }
    }

    public prepareChannel = async ():Promise<amqp.Channel> => {
        const connection = await this.activeConnection;
        const channel = connection.createChannel();
        return channel;
    }
}

export default new MessageBroker(config.mqSettings)
