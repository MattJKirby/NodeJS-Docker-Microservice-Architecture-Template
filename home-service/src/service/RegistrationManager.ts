import { IRegistrationConfig } from "../../configuration/ConfigurationTypes";
import MessageBroker from "../messageBroker/MessageBroker";
import { MessageConsumer } from "../messageBroker/MessageConsumer";
import { MessagePublisher } from "../messageBroker/MessagePublisher";
import { IBrokerMessage } from "../messageBroker/IBrokerMessage";
import { BrokerMessage } from "../messageBroker/BrokerMessage";
import { ServiceStatus } from "./ServiceStatus";
import { IServiceMetaData } from "./ServiceMetaData";

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

    public registerService = async (registrationParams: IServiceMetaData, status: ServiceStatus): Promise<void> =>{
        return this.registrationPromise = new Promise((resolve, reject) => {
            this.resolve = resolve
            this.registrationPublisher.sendMessage(this.config.messageRequestQueue, new BrokerMessage("register", registrationParams));
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

    public registrationHealthCheck = (status: ServiceStatus) => {
        console.log(this.uid)
        if(false){
            status = ServiceStatus.ERROR
        }
        this.registrationPublisher.sendMessage(this.config.messageRequestQueue,new BrokerMessage("healthCheck", {uid: this.uid, status: status}));
    }

}