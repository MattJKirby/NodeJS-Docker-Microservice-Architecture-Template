import { ServiceMetaData } from './ServiceMetaData';
import { RegistrationProvider } from './RegistrationProvider';
import { ServiceStatus } from './ServiceStatus';
import { IEnvironmentConfig } from '../../configuration/ConfigurationTypes';
import { mqConsumer } from '../messageConnector/mqConsumer';
import mqConnection from '../messageConnector/mqConnection';


/**
 * Service
 */
export class Service {
    /**
     * Service meta data
     */
    serviceMetaData: ServiceMetaData

    /**
     * Service uid
     */
    uid: Promise<string>

    /**
     * Service status
     */
    status: ServiceStatus = ServiceStatus.INITIALIZING

    /**
     * Message consumer that consumes messages directy to this service by it's regisered uid.
     */
    serviceConsumer: mqConsumer = new mqConsumer(mqConnection)

    constructor(config: IEnvironmentConfig, registrationManager: RegistrationProvider){
        this.serviceMetaData = new ServiceMetaData(config.app);
        this.uid = registrationManager.registerService(this.serviceMetaData,this.status);
        this.initializeRegisteredService(registrationManager)
    }

    private initializeRegisteredService = async (registrationManager: RegistrationProvider) => {
        this.serviceConsumer.subscribe(await this.uid, {usePersistingChannel: true})
        this.serviceConsumer.assertQueue(await this.uid, {durable: false, autoDelete: true});
        this.status = ServiceStatus.IDLE;
        setInterval(async () => registrationManager.registrationRequest(this.status,this.serviceMetaData,await this.uid), 5000)
    }  
}

