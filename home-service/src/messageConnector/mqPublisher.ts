import { Channel } from "amqplib";
import { mqChannel } from "./mqChannel";
import { mqConnection } from "./mqConnection";

export class mqPublisher extends mqChannel{

    constructor(connection: mqConnection){
        super(connection,{openChannel: true});
    }

    public sendMessage = async (queueName: string,message: any):Promise<void> => {
        (await super.channel!).sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
    }
}