import { mqChannelProvider } from "./mqChannelProvider";
import { mqConnection } from "./mqConnection";

export class mqPublisher extends mqChannelProvider {
 
    constructor(connection: mqConnection, options?: {persistingChannel?: boolean}){
        super(connection, options);
    }

    public sendMessage = async (queueName: string,message: any, options?: {usePersistingChannel?: boolean}):Promise<void> => {
        let channel = this.activeChannel;
        if(!options?.usePersistingChannel)
            channel = this.openChannel();

        const outboundMessage = Buffer.from(JSON.stringify(message));

        channel?.then(ch => {
            ch.sendToQueue(queueName, outboundMessage);
            if(!options?.usePersistingChannel){
                ch.close();
            }
        });
    }
}