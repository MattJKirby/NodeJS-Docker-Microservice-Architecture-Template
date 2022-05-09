import { ServiceDbRequests } from "../db/ServiceDbRequests";
import { BrokerMessage } from "../messageBroker/BrokerMessage";
import { IBrokerMessage } from "../messageBroker/IBrokerMessage";
import MessageBroker from "../messageBroker/MessageBroker";
import { MessageConsumer } from "../messageBroker/MessageConsumer";
import { MessagePublisher } from "../messageBroker/MessagePublisher";
import { IService } from "../service/IService";
import { Service } from "../service/Service";
import { ServiceStatus } from "../service/ServiceStatus";

/**
 * Service Manager Singleton
 * Controls the registration, handles updates, renewals and deletion of services.
 */
class RegistrationManager{
    readonly queueStub: string = ".registration";
    registrationConsumer: MessageConsumer
    registrationPublisher: MessagePublisher

    constructor(){
        this.registrationConsumer = new MessageConsumer(MessageBroker, "registry-service.registration");
        this.registrationConsumer.subscribe();

        this.registrationPublisher = new MessagePublisher(MessageBroker);
        this.bindMessageHandlers(); 
        this.initaliseRegister()
    }

    /**
     * Registers any relevant message broker handlers 
     */
    private bindMessageHandlers(): void {
        this.registrationConsumer.registerMessageHandler("register", (msg: IBrokerMessage) => this.handleRegistrationRequest(msg, this.registrationPublisher));
        this.registrationConsumer.registerMessageHandler("healthCheck", (msg: IBrokerMessage) => this.handleHealthCheck(msg));
    }

    /**
     * Generates a service uid using name, version and service instance from db.
     */
    private generateServiceUID = async (request: IService): Promise<string> => {
        return `${request.name}_${request.version}_${(await ServiceDbRequests.getInstances({name: request.name, version: request.version})).length}`;
    }

    /**
     * MessageBroker handler function used for registering new services
     */
    private handleRegistrationRequest = async (msg: IBrokerMessage, publisher:MessagePublisher) => {
        if(await ServiceDbRequests.getService({UID: msg.messageContent.registrationToken}) === null){
            this.makeNewRegistration(msg,publisher)
        }  
    }

    /**
     * Register new service, assert queue for message broker and send response to generic service queue.
     * If supplied uid is undefined, generate a new uid.
     */
    private makeNewRegistration = async (msg: IBrokerMessage, publisher:MessagePublisher) => {
        let uid = msg.messageContent.uid ==! undefined ? msg.messageContent.uid : await this.generateServiceUID(msg.messageContent.metaData);
        await ServiceDbRequests.addService(new Service(msg.messageContent.metaData, uid)).then((service) => {
            publisher.sendMessage(`${service.name}.registration`, new BrokerMessage("assignToken", {registrationToken: service.UID}));
        });
    }

    /**
     * Refresh the service healthcheck.
     * If no service is found with the msg uid, register a service with that uid.
     */
    private handleHealthCheck = async (msg: IBrokerMessage) => {
        this.handleUnresponsiveServices();
        if (await ServiceDbRequests.getService({UID:msg.messageContent.uid}) !== null){
            await ServiceDbRequests.updateStatusAndHealthCheckByUid(msg.messageContent.uid, msg.messageContent.status)
        } else {
            this.makeNewRegistration(msg, this.registrationPublisher)
        }
    }

    /**
     * Mark service as unavailable if healthcheck is missed
     */
    private handleUnresponsiveServices = async () => {
        await ServiceDbRequests.updateAllServicesByHealthCheckAge(5, {status: ServiceStatus.UNAVAILABLE})
    }

    /**
     * Flush all registration records and any pending registration queue messages.
     */
    private initaliseRegister = async () => {
        (await this.registrationConsumer.activeChannel).purgeQueue(this.registrationConsumer.queueName);
        await ServiceDbRequests.purgeServices();
        
    }

    public test = async (uid: string) => {
        console.log(true,uid)
        this.registrationPublisher.sendMessage(`${uid}`, new BrokerMessage("test", {test: uid}))  
    }
}

export default new RegistrationManager();