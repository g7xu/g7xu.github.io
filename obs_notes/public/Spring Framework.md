A Super Framework in the realm of Java Dev. With this you can:
-  Execute a Java method within a database transaction without directly dealing with transaction APIs
- Expose a local Java method as a remote procedure call using RESTful Web Service
- Convert a local Java method into a message handler for messaging system using Spring abstractions
# Advantage of Spring
- Predefined Templates: exception handling, connection management, and query execution
- Loose Coupling (Dependency Injection)
- Easy to Test
- Modularity: choose and use only the modules you need
## Inversion of Control
one of the key design principles of Spring: **Declare what you need, and let an external system handle the rest**
- Control Shift: Dependencies are managed externally rather than by the object itself
- Loose Coupling: Objects focus on their functionality not on creating or managing (Dependency injection)
# IoC Container
An inversion of Control (IoC) container manages the lifecycle of objects (beans), configuration and dependencies. The container ensures that beans are instantiated, wired, and configured properly without requiring developer to explicitly manage their lifecycle or dependencies .
- Responsible for:
	- Bean Management
	- Dependency Injection
	- Lifecycle Management
	- Configuration Handling
## How does IoC Container Work
### Application Setup Phase
Goal: Read Configuration
- Configuration Parsing
- Bean Def
- Class Scanning
### Application Startup Phase
Goal: Creates Beans
- Instantiation
- Eager Initialization
- Lazy Initialization
- Singleton
- Prototype
### Bean Creation Phase
Goal: Manages Dependencies
- Dependency Injection
- @Autowired
- Constructor Injection
- Setter Injection
- Field Injection
### Initialization Phase and Shutdown Phase
Goal:  Handles the Lifecycle
- Initialization
- @PostConstruct
- afterPropertiesSet
- Destruction
- @PreDestroy
- destroy-method 
# BeanFactory vs. ApplicationContext
- initialization Strategy
	- BeanFactory: Lazy initialization
	- ApplicationContext: Eager initialization
- Enterprise Features
	- BeanFactory: Basic dependency injection
	- ApplicationContext: AOP, events, and internationalization
- Configuration Formats
	- BeanFactory: XML
	- ApplicationContext: More
- Use Cases
	- BeanFactory: lightweight or simple applications
	- ApplicationContext: industry standard
## Injection method
When Spring attempts to inject an object, it treats it like a regular object and requires an entry point for injection
### 3 primary methods of dependency injection
- Constructor Injection
- Setter Injection
- Field Injection
- Setter Injection is more flexible as it allows optional or late-bound dependencies![[Screenshot 2026-01-16 at 10.05.53 PM.png]]
### Constructor Injection
- At object creation, dependencies are injected mandatorily
- All dependencies must be provided
- High Code Clarity; all dependencies are explicitly declared in constructor
- Use Case: Mandatory dependencies, especially when the class has core dependencies
### Setter Injection
- After object creation, injected via setter methods
- some dependencies can be optional
- Medium Code Clarity: dependencies are described through setter methods
- Use Case: Optional dependencies or scenarios where dependencies are dynamically replaced
### Field Injection
- After object creation, injected directly into fields
- some dependencies can be optional
- Code Clarity: dependencies are hidden in fields
- Use Case: Simple classes
## Circular Dependency
- occur when two or more beans are dependent on each other in a circular fashion
- loop that cannot be resolved by the dependency injection container, leading to application startup failures

**example of circular dependency**
```java
SalesDept
	@Autowired
	private final CostSuppDept costSup
	
	updateSalesStrat(feedback) {
		costSup.getCustFeedback()... // using CostSuppDept
	}
	getOrderData()
	
CostSuppDept
	getCustFeedback()
	proproitizeSupp(orderData) // using SalesDept
```
**resolution: introduce another class**
```java
SalesDept

	getOrderData()
	
CostSuppDept
	getCustFeedback()
	proproitizeSupp(orderData) // using SalesDept
	
Drive
	@Autowired
	private final CostSuppDept costSup
	
	@Autowired
	private final SalesDept sales
	
	
	void updateSalesStrat(feedback) {
		salesDept.updateSalesStrat(
			costSuppDept.getCustFeedback
		)
	}
```
# Annotation-Based Configuration
Bean definitions and dependency injections are written directly in the class.
- Core Annotation
	- @Component, @Service, @Repository, @Controller, 
	- @Configuration, @Bean -- defining configuration classes 
		- @Configuration indicates the class provides the configuration for Spring Beans
		- @Bean is used within the configuration class to define specific Beans and control their instantiation and initialization process
- Dependency Injection
	- @Autowired, @Qualifier
- Scanning Scope
	- @ComponentScan
# Bean Matching
- Default Matching Rules
	- Spring matches the required dependency by type
	- If multiple Beans match the type, Spring throws an exception, indicating it cannot decide which Bean in inject
- Resolution
	- @Primary: the default Bean with higher priority
	- @Qualifier: explicitly specify the name of the Bean to inject
# Spring Bean Scopes
Define how Bean instances are created and their visibility scope
- Singleton: a single bean definition to a single object instance for each Spring IoC container
- Prototype: Scopes a single bean definition to any number of object instances
- Request: each HTTP request has a bean
- Session: single bean for each HTTP request
- Global Session: Portlet application. When runs in a Portlet container, it is built on some number of portlets 
# Spring Lifecycle
- @PostConstruct
	- Marks a method to be executed after dependency injection is complete, during the initialization phase
	- Commonly used to initialize resources or perform preprocessing logic
- @PreDestory
	- Marks a method to be executed before the Spring container destory the Bean
	- Commonly used to release resources or perform cleanup logic
# Spring Boot
Another layer of simplicity
- Automatic component scanning
- Server Configuration
- starter modules: spring-boot-starter
Scaffolding tool for Spring, which it simplifies configuration complexity, introduces out-of-the-box features, and provides convenient tools to help developers build production-grade application more quickly

**Pro**
- Developing Spring-based application is extremely simple
- No need to write template code, XML configuration, or redundant annotations
- Easy integration with other Spring features, such as Spring JDBC, Spring ORM, Spring AOP, and Spring Security
- Provides an embedded HTTP server
- Automatic component scanning
- Spring Boot comes with an embedded Tomcat
- Project Dependency Management
	- Starter Modules: spring-boot-starter
	- Automatic Version Compatibility: Spring Boot's official BOM

**mechanism**
- @EnableAutoConfiguration: Enables Spring Boot's auto-configuration mechanism
- @ComponentScan: Enables the scanning of @Componennt in the package where the application resides
- @Configuration: Allows registering additional beans in the context or importing other configuration classes
- @SpringBootApplication annotation is typically placed on the main class and implicitly defines a base "search package" to scan for specific components

Scan through all the JAR dependencies and added to the project
Non-invasive auto configuration: define customized Bean
Disable Specific Auto-Configuration Classes



