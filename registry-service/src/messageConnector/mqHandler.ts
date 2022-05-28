import { mqMessage } from "./mqMessage";

export class mqHandler {
    /**
     * Queue that the message handler will act on.
     */
    public handlerQueue: string
    /**
     * Unique token for accessing registered handler methods.
     */
    public handlerToken: string

    /**
     * Function for handling message.
     */
    private handlerFunction: Function

    constructor(queue: string, handlerToken: string, handlerFunction: Function){
        this.handlerQueue = queue;
        this.handlerToken = handlerToken;
        this.handlerFunction = handlerFunction;
    }

    public invokeHandler(message: mqMessage){
        this.handlerFunction(message);
    }
}