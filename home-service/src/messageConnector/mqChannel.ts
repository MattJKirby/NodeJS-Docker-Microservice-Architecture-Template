import amqp, { Channel, Connection, Options } from "amqplib";
import { mqConnection } from "./mqConnection";

export class mqChannel {
    private connection: mqConnection
    public channel?: Promise<Channel>

    constructor(connection: mqConnection, channelOptions?: {openChannel?: boolean}){
        this.connection = connection;
        if(channelOptions?.openChannel !== null){
            this.channel = this.openNewChannel();
        }
    }

    public openNewChannel = async (): Promise<amqp.Channel> => {
        return (await this.connection.activeConnection).createChannel();
    }

    public closeActiveChannel = async ():Promise<void> => {
       await (await this.channel!).close();
    }

    public assertQueue = async (queueName: string, options?: Options.AssertQueue): Promise<void> => {  
        (await this.channel!).assertQueue(queueName, options);
    } 
}