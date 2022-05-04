import { IBrokerMessage } from "./IBrokerMessage";

export class BrokerMessage implements IBrokerMessage{
    handlerToken: string;
    messageContent: any;

    constructor(token: string, content: any){
        this.handlerToken = token;
        this.messageContent = content;
    }
}