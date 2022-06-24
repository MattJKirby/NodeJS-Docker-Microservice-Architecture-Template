import { ServiceDbRequests } from "../db/ServiceDbRequests";
import { ServiceStatus } from "../service/ServiceStatus";
import ServiceSchema from "../../models/ServiceSchema";
import ServiceRegistrationFactory from "./ServiceRegistrationFactory";
import { ServiceRegistration } from "../service/ServiceRegistration";

import { mqConsumer } from "../messageConnector/mqConsumer";
import mqConnection from "../messageConnector/mqConnection";
import { mqPublisher } from "../messageConnector/mqPublisher";
import { mqMessage } from "../messageConnector/mqMessage";
import { mqChannelProvider } from "../messageConnector/mqChannelProvider";

/**
 * Service Manager 
 * Controls the registration, handles updates, renewals and deletion of services.
 */
export class RegistrationManager {
    readonly registrationQueue: string = "registry-service.registration";
    registrationConsumer: mqConsumer = new mqConsumer(mqConnection, {persistingChannel: true})
    registrationPublisher: mqPublisher = new mqPublisher(mqConnection, {persistingChannel: true})

    constructor(){
        this.initaliseRegister().then(() => {
            this.registrationConsumer.subscribe(this.registrationQueue,{usePersistingChannel: true});
            this.bindMessageHandlers(); 
        }) 
    }

    /**
     * Registers any relevant message broker handlers 
     */
    private bindMessageHandlers(): void {
        this.registrationConsumer.registerMessageHandler(this.registrationQueue,"register", (msg: mqMessage) => this.handleRegistrationRequest(msg, this.registrationPublisher));
    }

    /**
     * MessageBroker handler function used for registering new services
     */
    private handleRegistrationRequest = async (msg: mqMessage, publisher:mqPublisher) => {
        this.handleUnresponsiveServices();
        if (await ServiceDbRequests.getServiceInstance({"instances.uid": msg.messageContent.uid}) !== null){
            this.handleHealthCheck(msg);
        } else {
            const registration = await this.newRegistration(msg);
            publisher.sendMessage(`${registration.name}.registration`, new mqMessage("assignToken", {registrationToken: registration.instance.uid}));
        }    
    }

    /**
     * Register new service, assert queue for message broker and send response to generic service queue.
     * If supplied uid is undefined, generate a new uid.
     */
    private newRegistration = async (msg: mqMessage):Promise<ServiceRegistration> => {
        const registration = ServiceRegistrationFactory.newRegistration(msg.messageContent.metaData, msg.messageContent.uid);
        console.log(`Registering: ${registration.instance.uid}`)
        await ServiceSchema.findOneAndUpdate({name: registration.name, version: registration.version}, { $addToSet: { instances: registration.instance }}, {upsert: true});
        return registration; 
    }

    /**
     * Refresh the service healthcheck.
     */
    private handleHealthCheck = async (msg: mqMessage) => {
        await ServiceDbRequests.updateStatusAndHealthCheckByUid(msg.messageContent.uid, msg.messageContent.status)
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
        await this.registrationConsumer.assertQueue(this.registrationQueue, {durable: false, autoDelete: true})
        await (await this.registrationConsumer.activeChannel)?.purgeQueue(this.registrationQueue);
    }

    public test = async (uid: string) => {
        console.log(true,uid)
        this.registrationPublisher.sendMessage(`${uid}`, new mqMessage("test", {test: uid}))  
    }
}