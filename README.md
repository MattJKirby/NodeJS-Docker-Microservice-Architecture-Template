# NodeJS-Docker-Microservice-Architecture-Template

## What is this?
A template for starting projects utilizing the microfrontends, microservices docker-compose and the MERN stack. (MongoDB, Express, NodeJS and ReactJS).
The microfront end UI is accessible behind an NginX gateway and contains a basic host app that consumers a simple component from the other microfrontend.


## TODO:
- Ensure Secrets are not kept within the docker containers. 
- Ensure there are no pre-existing RabbitMQ channel dependencies. All requiored channels should be created on container start
- 
