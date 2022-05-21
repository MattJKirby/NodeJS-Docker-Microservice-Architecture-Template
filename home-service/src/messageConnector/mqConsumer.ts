import { Channel } from "amqplib";
import { mqMessage } from "./mqMessage"
import { mqChannel } from "./mqChannel";
import { mqConnection } from "./mqConnection";
import { mqHandler } from "./mqHandler";

export class mqConsumer extends mqChannel {
   private activeChannel: Promise<Channel>
   private registeredHandlers: Array<mqHandler> = [];

    constructor(connection: mqConnection){
        super(connection);
        this.activeChannel = super.openNewChannel();
    }

    public subscribe = async (queue: string) => {
        const channel = await this.activeChannel;
        channel.consume(queue, (msg) => {
            try{
                this.executeHandler(JSON.parse(msg!.content.toString()));
                channel.ack(msg!)
            } catch (err){
                channel.nack(msg!);
            }
        })
    }

    private executeHandler(message: mqMessage){
        try {
            const messageHandler = this.registeredHandlers.find(x => x.handlerToken === message.handlerToken);
            messageHandler?.invokeHandler(message)
        } catch {
            throw("Handler token not found on received message.")
        }
    }

    public registerMessageHandler = (token: string, handlerFunction: Function, queueName: string): void => {
        if(this.registeredHandlers.filter(handler => handler.handlerToken === token && handler.handlerQueue === queueName).length < 1){
            this.registeredHandlers.push(new mqHandler(queueName, token, handlerFunction));
        }    
    }


}