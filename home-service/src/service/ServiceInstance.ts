import config from '../../configuration/default'
import { IBrokerMessage } from '../messageBroker/IBrokerMessage';
import MessageBroker from '../messageBroker/MessageBroker'
import { MessageConsumer } from '../messageBroker/MessageConsumer';
import { ServiceMetaData } from './ServiceMetaData';
import { RegistrationManager } from './RegistrationManager';
import { ServiceStatus } from './ServiceStatus';
import { IEnvironmentConfig } from '../../configuration/ConfigurationTypes';
import { IMessageBroker } from '../messageConnector/IMessageBroker';
import { mqConsumer } from '../messageConnector/mqConsumer';
import { mqPublisher } from '../messageConnector/mqPublisher';


/**
 * Service Instance Singleton
 */
class ServiceInstance {
   /**
    * Service meta data
    */
   serviceMetaData: ServiceMetaData

    /**
     * Service status
     */
    status: ServiceStatus = ServiceStatus.INITIALIZING

    /**
     * Handles service registration
     */
    registrationManager: RegistrationManager

    /**
     * Message consumer that consumes messages directy to this service by it's regisered uid.
     */
    instanceConsumer?: MessageConsumer

    constructor(config: IEnvironmentConfig){
        this.serviceMetaData = new ServiceMetaData(config.app);
        this.registrationManager = new RegistrationManager(config.serviceRegistration)
    }

    public registerService = () => {
        this.registrationManager.registerService(this.serviceMetaData, this.status).then(() => {
            this.initializeMessageConsumer();
            this.startHealthChecks();  
            this.status = ServiceStatus.IDLE;
        })
    }

    private initializeMessageConsumer = () => {
        this.instanceConsumer = new MessageConsumer(MessageBroker, `${this.registrationManager.uid}`);
        this.instanceConsumer.assertQueue(this.registrationManager.uid!, {durable: false, autoDelete: true});
        this.instanceConsumer.subscribe();
        this.bindInstanceMessageHandlers(this.instanceConsumer);
    }

    private bindInstanceMessageHandlers = (consumer: MessageConsumer) => {
        consumer.registerMessageHandler("test", (msg: IBrokerMessage) => console.log("TEST",msg));
    }

    private startHealthChecks = () => {
        setInterval(() => {
            this.registrationManager.registrationRequest("healthCheck",this.status, this.serviceMetaData);
        }, 5000)
    }   
}

export default new ServiceInstance(config)