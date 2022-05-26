import { ServiceDbRequests } from "../db/ServiceDbRequests";
import { BrokerMessage } from "../messageBroker/BrokerMessage";
import { IBrokerMessage } from "../messageBroker/IBrokerMessage";
import MessageBroker from "../messageBroker/MessageBroker";
import { MessageConsumer } from "../messageBroker/MessageConsumer";
import { MessagePublisher } from "../messageBroker/MessagePublisher";
import { ServiceStatus } from "../service/ServiceStatus";
import ServiceSchema from "../../models/ServiceSchema";
import ServiceRegistrationFactory from "./ServiceRegistrationFactory";
import { ServiceRegistration } from "../service/ServiceRegistration";
import { IDatabaseConnection } from "../utility/IDatabaseConnection";
import mongoose from "mongoose";

/**
 * Service Manager 
 * Controls the registration, handles updates, renewals and deletion of services.
 */
export class RegistrationManager {
    readonly queueStub: string = ".registration";
    registrationConsumer: MessageConsumer
    registrationPublisher: MessagePublisher

    constructor(){
        this.registrationConsumer = new MessageConsumer(MessageBroker, "registry-service.registration");
        this.registrationConsumer.subscribe();

        this.registrationPublisher = new MessagePublisher(MessageBroker);
        this.initaliseRegister().then(() => {
            this.bindMessageHandlers(); 
        }) 
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
        this.newRegistration(msg,publisher).then((registration) => {
            publisher.sendMessage(`${registration.name}.registration`, new BrokerMessage("assignToken", {registrationToken: registration.instance.uid}));
        })
    }

    /**
     * Register new service, assert queue for message broker and send response to generic service queue.
     * If supplied uid is undefined, generate a new uid.
     */
    private newRegistration = async (msg: IBrokerMessage, publisher:MessagePublisher):Promise<ServiceRegistration> => {
        const registration = ServiceRegistrationFactory.newRegistration(msg.messageContent.metaData, msg.messageContent.uid);
        console.log(`Registering: ${registration.instance.uid}`)
       
        await ServiceSchema.findOneAndUpdate({name: registration.name, version: registration.version}, { $addToSet: { instances: registration.instance }}, {upsert: true});
        return registration; 
    }

    /**
     * Refresh the service healthcheck.
     * If no service is found with the msg uid, register a service with that uid.
     */
    private handleHealthCheck = async (msg: IBrokerMessage) => {
        this.handleUnresponsiveServices();
        if (await ServiceDbRequests.getServiceInstance({"instances.uid": msg.messageContent.uid}) !== null){
            await ServiceDbRequests.updateStatusAndHealthCheckByUid(msg.messageContent.uid, msg.messageContent.status)
        } else {
            await this.newRegistration(msg, this.registrationPublisher)
        }
    }

    /**
     * Mark service as unavailable if healthcheck is missed
     */
    private handleUnresponsiveServices = async () => {
        await ServiceDbRequests.updateAllServicesByHealthCheckAge(5, {"instances.$[].status": ServiceStatus.UNAVAILABLE})
    }

    /**
     * Flush all registration records and any pending registration queue messages.
     */
    private initaliseRegister = async () => {
        await ServiceDbRequests.purgeServices();
        (await this.registrationConsumer.activeChannel).purgeQueue(this.registrationConsumer.queueName);
       
    }

    public test = async (uid: string) => {
        console.log(true,uid)
        this.registrationPublisher.sendMessage(`${uid}`, new BrokerMessage("test", {test: uid}))  
    }
}