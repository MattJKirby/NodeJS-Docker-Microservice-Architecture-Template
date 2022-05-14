import { IRegistrationConfig } from "../../configuration/ConfigurationTypes";
import MessageBroker from "../messageBroker/MessageBroker";
import { MessageConsumer } from "../messageBroker/MessageConsumer";
import { MessagePublisher } from "../messageBroker/MessagePublisher";
import { IBrokerMessage } from "../messageBroker/IBrokerMessage";
import { BrokerMessage } from "../messageBroker/BrokerMessage";
import { ServiceStatus } from "./ServiceStatus";
import { IServiceMetaData, ServiceMetaData } from "./ServiceMetaData";

export class RegistrationManager {
    /**
     * Registration config
     */
    config: IRegistrationConfig

    /**
     * Registration uid assigned by the registry service.
     */
    uid?: string;

    /**
     * Used for publishing registration related messages
     */
    registrationPublisher: MessagePublisher;

    /**
     * Used for consuming registration messages
     */
    registrationConsumer: MessageConsumer;

    registrationPromise?: Promise<void>
    
    resolve!: (value: void | PromiseLike<void>) => void;

    constructor(registrationConfig: IRegistrationConfig){
        this.config = registrationConfig;
        this.registrationPublisher = new MessagePublisher(MessageBroker);
        this.registrationConsumer = new MessageConsumer(MessageBroker, this.config.genericResponseQueue);

        this.registrationConsumer.subscribe()
        this.bindMessageHandlers();
    }

    public registerService = async (meta: IServiceMetaData, status: ServiceStatus): Promise<void> =>{
        return this.registrationPromise = new Promise((resolve, reject) => {
            this.resolve = resolve
            this.registrationRequest("register",status,meta);
        });
    }

    private bindMessageHandlers = (): void => {
        this.registrationConsumer.registerMessageHandler("assignToken", (msg: IBrokerMessage) => this.handleRegistration(msg))
    }

    private handleRegistration = (msg: IBrokerMessage): void => {
        this.uid = msg.messageContent.registrationToken;
        this.registrationConsumer.unsubscribe();
        this.resolve();
    }

    public registrationRequest = async(registrationType: string, status: ServiceStatus, meta: IServiceMetaData) => {
        this.registrationPublisher.sendMessage(this.config.messageRequestQueue,new BrokerMessage(registrationType, {uid: this.uid, status: status, metaData: meta}));
    }
    

}