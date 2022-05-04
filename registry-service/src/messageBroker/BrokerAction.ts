import { MessageBroker } from "./MessageBroker"
import amqp, { Options } from "amqplib";

export class BrokerAction {
    messageBroker: MessageBroker
    activeChannel: Promise<amqp.Channel>

    constructor(messageBroker: MessageBroker){
        this.messageBroker = messageBroker;
        this.activeChannel = this.messageBroker.prepareChannel();
    }

    public assertQueue = async (queueName: string, options?: Options.AssertQueue) => {
        const channel = await this.activeChannel;
        channel.assertQueue(queueName, options);
    }

}