import { IAppConfig, IEnvironmentConfig } from '../../configuration/ConfigurationTypes';
import config from '../../configuration/default'
import { BrokerMessage } from '../messageBroker/BrokerMessage';
import { IBrokerMessage } from '../messageBroker/IBrokerMessage';
import MessageBroker from '../messageBroker/MessageBroker'
import { MessageConsumer } from '../messageBroker/MessageConsumer';
import { MessagePublisher } from '../messageBroker/MessagePublisher';
import { IServiceMetaData, ServiceMetaData } from './ServiceMetaData';
import { RegistrationManager } from './RegistrationManager';
import { ServiceStatus } from './ServiceStatus';

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

    instanceConsumer?: MessageConsumer

    constructor(config: IEnvironmentConfig){
        this.serviceMetaData = new ServiceMetaData(config.app);
        this.registrationManager = new RegistrationManager(config.serviceRegistration)
    }

    public registerService = () => {
        this.registrationManager.registerService(this.serviceMetaData, this.status).then(() => {
            this.startRegistrationHealthChecks();
            this.instanceConsumer = new MessageConsumer(MessageBroker, `${this.registrationManager.uid}`);
            if(this.registrationManager.uid !== undefined){
                this.instanceConsumer.assertQueue(this.registrationManager.uid, {durable: false, autoDelete: true})
                this.instanceConsumer.registerMessageHandler("test", (msg: IBrokerMessage) => console.log("TEST",msg));
                this.instanceConsumer.subscribe();
                this.status = ServiceStatus.IDLE
            }  
        })
    }

    private startRegistrationHealthChecks = () => {
        setInterval(() => {
            if(this.registrationManager.uid !== null){
                this.registrationManager.registrationHealthCheck(this.status);
            }
        }, 5000)
    }   
}

export default new ServiceInstance(config)