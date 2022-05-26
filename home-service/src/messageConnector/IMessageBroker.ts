import { mqConsumer } from "./mqConsumer"
import { mqPublisher } from "./mqPublisher"

export type IMessageBroker = {
    brokerConsumer: mqConsumer;
    brokerPublisher: mqPublisher;

    bindMessageHandlers: () => void;
}