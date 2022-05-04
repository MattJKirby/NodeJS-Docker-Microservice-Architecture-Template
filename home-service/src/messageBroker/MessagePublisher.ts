import amqp, { Options } from "amqplib";
import { BrokerAction } from "./BrokerAction";
import { MessageBroker } from "./MessageBroker";

export class MessagePublisher extends BrokerAction{

    constructor(messageBroker: MessageBroker){
        super(messageBroker);
    }

    public sendMessage = async (queueName: string,message: any):Promise<void> => {
        const channel = await this.activeChannel;
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
    }

    public closeChannel = async ():Promise<void> => {
        const channel = await this.activeChannel;
        channel.close()
    }

}