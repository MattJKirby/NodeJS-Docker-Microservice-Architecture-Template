import amqp, { Options } from "amqplib";
import { BrokerAction } from "./BrokerAction";
import { IBrokerMessage } from "./IBrokerMessage";
import { MessageBroker } from "./MessageBroker";
import { MessageHandler } from "./MessageHandler";

export class MessageConsumer extends BrokerAction{
    public queueName: string
    private registeredMessageHandlers: Array<MessageHandler> = [];

    constructor(messageBroker: MessageBroker, queueName: string){
        super(messageBroker)
        this.queueName = queueName;
    }

    public subscribe = async () => {
        const channel = await this.activeChannel;
        channel.consume(this.queueName, (msg) => {
            if(msg !== null) {
                try{
                    const receivedMessage = JSON.parse(msg.content.toString());
                    this.executeHandler(receivedMessage);
                    channel.ack(msg)
                } catch (err){
                    channel.nack(msg);
                }
            }
        })
    }

    private executeHandler(message: IBrokerMessage){
        if(message.handlerToken !== null){
            const messageHandler = this.registeredMessageHandlers.find(x => x.uniqueToken === message.handlerToken);
            messageHandler?.invokeHandler(message)
        } else {
            throw("Handler token not found on received message.")
        }
    }

    public registerMessageHandler = (token: string, handlerFunction: Function): void => {
        if(this.registeredMessageHandlers.filter(handler => handler.uniqueToken === token && handler.handlerQueue === this.queueName).length < 1){
            this.registeredMessageHandlers.push(new MessageHandler(this.queueName, token, handlerFunction));
        }    
    }

    public unsubscribe = async () => {
        const channel = await this.activeChannel;
        channel.close();
    }
}