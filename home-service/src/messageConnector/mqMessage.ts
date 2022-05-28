export class mqMessage{
    public handlerToken: string
    public messageContent: any

    constructor(token: string, content: any){
        this.handlerToken = token;
        this.messageContent = content;
    }
}