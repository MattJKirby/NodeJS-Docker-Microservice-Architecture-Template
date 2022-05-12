import { ServiceDbRequests } from "../db/ServiceDbRequests";
import { BrokerMessage } from "../messageBroker/BrokerMessage";
import { IBrokerMessage } from "../messageBroker/IBrokerMessage";
import MessageBroker from "../messageBroker/MessageBroker";
import { MessageConsumer } from "../messageBroker/MessageConsumer";
import { MessagePublisher } from "../messageBroker/MessagePublisher";
import { ServiceStatus } from "../service/ServiceStatus";
import ServiceSchema from "../../models/ServiceSchema";
import ServiceRegistrationFactory from "./ServiceRegistrationFactory";

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
     * MessageBroker handler function used for registering new services
     */
    private handleRegistrationRequest = async (msg: IBrokerMessage, publisher:MessagePublisher) => {
            await this.newRegistration(msg,publisher)

    }

    /**
     * Register new service, assert queue for message broker and send response to generic service queue.
     * If supplied uid is undefined, generate a new uid.
     */
    private newRegistration = async (msg: IBrokerMessage, publisher:MessagePublisher) => {
        try{
            const registration = ServiceRegistrationFactory.newRegistration(msg.messageContent.metaData, msg.messageContent.uid);
            await ServiceSchema.findOneAndUpdate({name: registration.name, version: registration.version}, { $push: { instances: registration.instance }}, {upsert: true, new: true})
        } catch (error) {
            console.log(`Error registering service: ${msg.messageContent.uid}`)
        }
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
            this.newRegistration(msg, this.registrationPublisher)
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