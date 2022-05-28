import { IRegistrationConfig } from "../../configuration/ConfigurationTypes";
import Config from '../../configuration/default'
import { IBrokerMessage } from "../messageBroker/IBrokerMessage";
import { BrokerMessage } from "../messageBroker/BrokerMessage";
import { ServiceStatus } from "./ServiceStatus";
import { IServiceMetaData, ServiceMetaData } from "./ServiceMetaData";
import { IMessageBroker } from "../messageConnector/IMessageBroker";
import { mqPublisher } from "../messageConnector/mqPublisher";
import { mqConsumer } from "../messageConnector/mqConsumer";
import mqConnection from "../messageConnector/mqConnection";
import { mqChannelProvider } from "../messageConnector/mqChannelProvider";


export class RegistrationManager {
    /**
     * Registration config
     */
    config: IRegistrationConfig

    /**
     * Used for publishing registration related messages
     */
    brokerPublisher: mqPublisher = new mqPublisher(mqConnection, {persistingChannel: true});

    /**
     * Used for consuming registration messages
     */
    brokerConsumer: mqConsumer =  new mqConsumer(mqConnection, {persistingChannel: true});

    resolve!: (value: string) => void;

    constructor(registrationConfig: IRegistrationConfig){
        this.config = registrationConfig;
      
        this.brokerConsumer.subscribe(this.config.serviceResponseQueue, {usePersistingChannel: true});
        this.brokerConsumer.registerMessageHandler(this.config.serviceResponseQueue, "assignToken", async (msg: IBrokerMessage) => await this.handleRegistration(msg));
    }

    public registerService = async (meta: IServiceMetaData, status: ServiceStatus): Promise<string> =>{
        return new Promise<string>((resolve, reject) => {
            this.resolve = resolve
            this.registrationRequest(status,meta);
        });
    }

    private handleRegistration = async (msg: IBrokerMessage): Promise<void> => {
        this.brokerConsumer.closeActiveChannel();
        this.resolve(msg.messageContent.registrationToken);
    }

    public registrationRequest = async(status: ServiceStatus, meta: IServiceMetaData, uid?: string) => {
        this.brokerPublisher.sendMessage(this.config.messageRequestQueue,new BrokerMessage("register", {uid: uid, status: status, metaData: meta}),{usePersistingChannel: true});
    }
}

export default new RegistrationManager(Config.serviceRegistration)