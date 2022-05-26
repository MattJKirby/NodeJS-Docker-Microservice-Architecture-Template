import amqp, { Channel, Connection, Options } from "amqplib";
import { mqConnection } from "./mqConnection";

export class mqChannelProvider {
    private connection: mqConnection
    public activeChannel?: Promise<Channel>

    constructor(connection: mqConnection, options?: {persistingChannel?: boolean}){
        this.connection = connection;
        if(options?.persistingChannel){
            this.activeChannel = this.openChannel();
        }
    }

    public openChannel = async (): Promise<amqp.Channel> => {
        const activeConnection = await this.connection.activeConnection;

        if(activeConnection !== undefined){
            return activeConnection.createChannel();
        } else {
            throw("Can't open channel. Connection undefined.")
        };
    }

    public closeActiveChannel = async ():Promise<void> => {
        await (await this.activeChannel)?.close();
    }

    public assertQueue = async (queueName: string, channelOptions?: Options.AssertQueue): Promise<void> => {
        const channel = await this.openChannel()
        
        channel.assertQueue(queueName, channelOptions).then(() => {
            channel.close();
        })
    } 
}