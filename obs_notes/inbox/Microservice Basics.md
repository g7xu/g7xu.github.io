# What is Microservice?

## Definition
- A **distributed system** is a system where components run on multiple machines and work together toward a common goal.
- **Microservices** are a *specific type* of distributed system where services are:
  - Small  
  - Independent  
  - Loosely coupled
## Pros
- **Scalability** — scale individual services instead of the whole system  
- **Flexibility** — deploy & update independently  
- **Fault Tolerance** — failure of one service does not break others  
## Cons
- **Complexity** — harder to manage, debug and implement
- **Network Latency** — overhead due to service-to-service calls  
- **Data Consistency Issues** — harder to synchronize data  

---
# Making Microservices

## Identify Boundaries
- Split by **business functionality** or **bounded context**
## Service Independence
- Services should be **independently deployable** and **scalable**  
- Avoid **tight coupling** between services  
## Service Communication
- REST, gRPC, Message Queues  
- **Synchronous vs Asynchronous** trade-offs  

---
# Key Components

## Service Discovery
- Helps microservices find each other dynamically  
- Supports dynamic scaling (instances frequently change)
## Service Registry
- Central directory where services **register their address**  
- Benefits:
  - No hardcoded IP  
  - Automatic load balancing  
## API Gateway
- Single entry point for external requests  
- Routes, secures, and manages API traffic  
- Examples: Spring Cloud Gateway, Istio, AWS API Gateway, Google Cloud Endpoints  
### Spring Cloud Gateway – Key Building Blocks
- **Route** — defines where requests go  
- **Predicate** — matches incoming requests  
- **Filter** — modifies requests/responses  
## Core Service
- Connects directly to a database  
- Does **not** depend on other services  
## Composite Service
- Does **not** connect to a database  
- Orchestrates multiple core services  

---
# Separate Databases
- Each service owns and manages its own data  
- Schema changes happen independently  
- Allows independent scaling  
**Challenges**
- Cross-service transactions  
- Data duplication  
- Slow cross-service queries  
---
# Observability in Microservices

Ability to understand system state from the data it produces  
### Key Areas
- Logging  
- Monitoring  
- Tracing  
### Tools
- **Logging:** ELK Stack  
- **Metrics:** Prometheus, Grafana, Kubesphere  
- **Tracing:** Jaeger, Zipkin, Kiali  