**Common Challenge for Monolithic Application**
- Scalability: how to scale individual components within a single monolithic system (MUST SCALE THE ENTIRE SYSTEM)
- Performance Bottlenecks: the entire application depends on the services that with the worst performance
- Maintainability: Codebase becomes larger and harder to manage & New features increase the risk of breaking shit

Monolithic vs. Microservices
- Monolithic: Single application with tightly coupled modules with One codebase, one database
- Microservices Architecture: independent services, each with its own functionality and database. Services communicate via APIs
# Definition of Distributed System
- A system where multiple services run independently across different machines
- Different services work together to achieve a common goal. 
- Pro 
	- Scalability — can scale certain service individually 
	- Flexibility services can be deployed and updated independently 
	- Fault Tolerance — if one service fails, others can continue operating 
- Con
	- Complexity — requires managing and coordinating multiple services 
	- Network Latency — adds overhead due to internal service communication 
	- Data Consistency — hard to keep data synchronized across multiple services
## Distributed System vs. Microservices  
Distributed system is a broader concept where components run on multiple machines. And Microservices are one kind where services are **small, independent and loosely coupled**. 
# Breaking Monolithic Architecture
Common SOP
- Identify boundaries: separated by business functionality or bounded context
- Service independence
	- Independently deployable and scalable
	- Avoid tight coupling between services
- Service communication
	- Service interact via REST APIs, gRPC, or message queues
	- Synchronous vs. Asynchronous communication trades offs
Question to ask
- What services should be independent?
- How do we ensure smooth communication?
- How do we manage data consistency across services?
# Microservices 101

## Database management
- each Microservice manage its own database and schema
- Potential Challenges:  
	- Transaction management issues — 2 PC design, SAGA design
	- Data duplication 
	- Slow performance —Asyn, Multi-threading
## Components
- Service Discovery: enable services to find each other dynamically as the service scale dynamically 
- Service Registry: centralized directory where services register their locations with a service name
	- no hardcode IP address
	- enable automatic load balancing 
- API Gateway: manage external request and routes them to services (Client <--> Backend)
	- Example:  Spring Cloud Gateway
		- Route: defines where and how request should be forward
		- Predicate: a condition that matches incoming HTTP requests 
		- Filter: modify requests or responses before forwarding to the destination service
- Core Services: connect directly to database but not to other services
- Composite services: connect to one or more core services but not connect to database
## Observability
It is extremely important to implement **Logging**, **Monitoring**, and **Tracing** because we want the ability to monitor and understand the internal state of a system from the outside based on the data it generates
### Real-world tools
- Logging: ELK Stack
- Metrics Monitoring: Kubesphere
- Tracing and Service Monitoring: Kiali

[https://medium.com/@jyoti1308/designing-proximity-service-yelp-7472e1f20cee](https://medium.com/@jyoti1308/designing-proximity-service-yelp-7472e1f20cee)