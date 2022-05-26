import amqp, { Channel, Connection, Options } from "amqplib";
import { mqConnection } from "./mqConnection";

export class mqChannelProvider {
    private connection: mqConnection

    constructor(connection: mqConnection){
        this.connection = connection;
    }

    public openChannel = async (): Promise<amqp.Channel> => {
        const activeConnection = await this.connection.activeConnection;

        if(activeConnection !== undefined){
            return activeConnection.createChannel();
        } else {
            throw("Can't open channel. Connection undefined.")
        };
    }

    public static closeActiveChannel = async (channel: Channel):Promise<void> => {
        await channel?.close();
    }

    public assertQueue = async (queueName: string, channelOptions?: Options.AssertQueue): Promise<void> => {
        const channel = await this.openChannel()
        
        channel.assertQueue(queueName, channelOptions).then(() => {
            channel.close();
        })
    } 
}