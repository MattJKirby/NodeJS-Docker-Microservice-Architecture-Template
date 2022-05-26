import { mqMessage } from "./mqMessage"
import { mqChannelProvider as mqChannelProvider } from "./mqChannelProvider";
import { mqHandler } from "./mqHandler";
import { mqConnection } from "./mqConnection";

export class mqConsumer extends mqChannelProvider {
    private registeredHandlers: Array<mqHandler> = [];

    constructor(connection: mqConnection){
        super(connection);
    }

    public subscribe = async (queue: string) => {
        const channel = await this.openChannel();
        if(channel !== undefined){
            channel.consume(queue, (msg) => {
                try{
                    const messageContent = JSON.parse(msg!.content.toString());
                    this.executeHandler(messageContent, queue);
                    channel.ack(msg!)
                } catch (err){
                    channel.nack(msg!);
                }
            })
        }
    }

    private executeHandler(message: mqMessage, queue: string){
        try {
            const messageHandler = this.registeredHandlers.find(x => x.handlerToken === message.handlerToken && x.handlerQueue === queue);
            messageHandler?.invokeHandler(message)
        } catch {
            throw("Handler token not found on received message.")
        }
    }

    public registerMessageHandler = (queueName: string, token: string, handlerFunction: Function): void => {
        if(this.registeredHandlers.filter(handler => handler.handlerToken === token && handler.handlerQueue === queueName).length < 1){
            this.registeredHandlers.push(new mqHandler(queueName, token, handlerFunction));
        }    
    }
}