import { IRegistrationConfig } from "../../configuration/ConfigurationTypes";
import MessageBroker from "../messageBroker/MessageBroker";
import { MessageConsumer } from "../messageBroker/MessageConsumer";

import { IBrokerMessage } from "../messageBroker/IBrokerMessage";
import { BrokerMessage } from "../messageBroker/BrokerMessage";
import { ServiceStatus } from "./ServiceStatus";
import { IServiceMetaData, ServiceMetaData } from "./ServiceMetaData";
import { IMessageBroker } from "../messageConnector/IMessageBroker";
import { mqPublisher } from "../messageConnector/mqPublisher";
import { mqConsumer } from "../messageConnector/mqConsumer";
import mqConnection from "../messageConnector/mqConnection";
import { mqChannelProvider } from "../messageConnector/mqChannelProvider";


export class RegistrationManager implements IMessageBroker {
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
    brokerPublisher: mqPublisher = new mqPublisher(mqConnection, {persistingChannel: true});

    /**
     * Used for consuming registration messages
     */
    brokerConsumer: mqConsumer =  new mqConsumer(mqConnection, {persistingChannel: true});

    registrationPromise?: Promise<void>
    
    resolve!: (value: void | PromiseLike<void>) => void;

    constructor(registrationConfig: IRegistrationConfig){
        this.config = registrationConfig;
      
        this.brokerConsumer.subscribe(this.config.serviceResponseQueue, {usePersistingChannel: true});
        this.bindMessageHandlers();
    }

    public registerService = async (meta: IServiceMetaData, status: ServiceStatus): Promise<void> =>{
        return this.registrationPromise = new Promise((resolve, reject) => {
            this.resolve = resolve
            this.registrationRequest("register",status,meta);
        });
    }

    public bindMessageHandlers = (): void => {
        this.brokerConsumer.registerMessageHandler(this.config.serviceResponseQueue, "assignToken", async (msg: IBrokerMessage) => await this.handleRegistration(msg));
    }

    private handleRegistration = async (msg: IBrokerMessage): Promise<void> => {
        this.uid = msg.messageContent.registrationToken;
        this.brokerConsumer.closeActiveChannel();
        this.resolve();
    }

    public registrationRequest = async(registrationType: string, status: ServiceStatus, meta: IServiceMetaData) => {
        this.brokerPublisher.sendMessage(this.config.messageRequestQueue,new BrokerMessage(registrationType, {uid: this.uid, status: status, metaData: meta}),{usePersistingChannel: true});
    }
}