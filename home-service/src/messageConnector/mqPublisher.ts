import { Channel } from "amqplib";
import { mqChannelProvider } from "./mqChannelProvider";
import { mqConnection } from "./mqConnection";

export class mqPublisher extends mqChannelProvider {
    channel?: Promise<Channel>

    constructor(connection: mqConnection, options?: {persistingChannel?: boolean}){
        super(connection);
        if(options?.persistingChannel == true){
            this.channel = this.openChannel();
        }
    }

    public sendMessage = async (queueName: string,message: any, options?: {usePersistingChannel?: boolean}):Promise<void> => {
        let channel = this.channel;
        
        if(!options?.usePersistingChannel){
            channel = this.openChannel();
        }

        const outboundMessage = Buffer.from(JSON.stringify(message));

        channel?.then(ch => {
            ch.sendToQueue(queueName, outboundMessage);
            if(!options?.usePersistingChannel){
                mqChannelProvider.closeActiveChannel(ch);
            }
        });
    }
}