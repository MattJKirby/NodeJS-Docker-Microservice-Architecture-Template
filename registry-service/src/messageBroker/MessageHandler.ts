import { IBrokerMessage } from "./IBrokerMessage";

export class MessageHandler {
    /**
     * Queue that the message handler will act on.
     */
    public handlerQueue: string
    /**
     * Unique token for accessing registered handler methods.
     */
    public uniqueToken: string

    /**
     * Function for handling message.
     */
    private handlerFunction: Function

    constructor(queue: string, uniqueToken: string, handlerFunction: Function){
        this.handlerQueue = queue;
        this.uniqueToken = uniqueToken;
        this.handlerFunction = handlerFunction;
    }

    public invokeHandler(message: IBrokerMessage){
        this.handlerFunction(message);
    }
}