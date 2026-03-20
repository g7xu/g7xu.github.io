Bugs and errors are inevitable regardless of developer skill. While some problems like `OutOfMemoryError` are unrecoverable system-level failures, most issues are situations the program didn't anticipate. Exceptions give us a structured way to catch and recover from these.

Java distinguishes between checked exceptions (foreseeable environmental failures like I/O and database issues — the compiler forces you to handle them) and unchecked exceptions (programming logic errors like null references — they surface at runtime). In a web application, both types can occur across every layer.

We need a systematic approach to handle these exceptions at the right layer, log them with enough context to trace root causes, and return consistent, meaningful responses to users -- never exposing raw stack traces or whitelabel error pages.

# Exception Occurrence by Service Layer
In [[MVC]] framework with different Service Layer(Repo, Service, Controller), we want to make sure we are clear with two questions: what can go wrong? best practice to handle them
## Repository Layer
The Repository is responsible for interacting with database. Any Exception around database, such as connection failures, query errors, timeouts, constrain violations.

**Best Practice:**
- catch all client error and throw custom exception
	- Ex. query from user is not found
- Throw default exception
	- Ex. let Spring throw the DataAccessException
## Service Layer
The service layer is used to handle business logic. Any Exception around these should be handled, such as Business logic error, Data integrity, External services error

**Service Error CheatSheet:**
- Client did something wrong (invalid field, business rule violation) -> 400 with error message
- Concurrency conflict (ex. two users modify same thing) -> Retry or Non-recoverable
- [[#Repository Layer]] issue -> Let it propagate upward to [[#Controller Layer]]
- Code error ->  Non-recoverable

**Best Practice:**
- client error should be thrown using custom exception and additional info
- Any non-recoverable exception should be propagated
## Controller Layer
The controller layer handled incoming HTTP request, so handle any exception related to HTTP-related check. The controller is the first line of defense where the incoming HTTP request hits the application and it's where we catch and translate the errors into proper status code

**Controller Error CheatSheet:**
- client side problem (sent a `POST` to a `GET` or hits non-existing URL) -> 405 (Method Not Allowed) / 404 (Not Found)
- "you send me garbage" (Required Field Error, Invalid Data in the request, Deserialization Error) -> 400 (bad Request)
- Code Error -> 500 (Internal Server Error) (make sure we log the full stack trace)

**Best Practice:**
- handle anything related to http issues
- All exception should be handled properly
	- Error Response with different Stat
	- consistent format

## Service is used to handle business logic
- Business logic error
- Data integrity
- External service error

Types of Exception
- Request invalid with conflicting fields: 400 with error message
- Business logic violation: 400 with error message
- Concurrency/Race Condition: Retry or Non-Recoverable
- Repository Layer Error: propagate Exception
- Code Error: Non-recoverable

Best Practice in Service layer
- Any client errors should be thrown using a custom exception with additional information
- Any non-recoverable exceptions should be propagated
	- why: this type of exception is typically caused by system or underlying infrastructure issues
	- for non-recoverable exceptions, they should be propagated directly rather than attempting to handle them
## Bubble up mechanism
Exceptions bubble up through layers, with each layer adding additional context. At the end, toward the client, we provide clear and consistent status codes. Throughout the process, we log details for internal transparency across all layers.
![[error_handling_dual_track.svg|697]]
# Exception Handling
While we have define a systematic way of logging exceptions, how do handling them so that:
- for user: understand situation 
- for developer: details with root cause

so that: **we never give user a whitelabel Error Page or StackTrace**

**Core strategies:**
- Logging: log messages in internal window
- Error Response: Response to user
- Retry: try again baby!!
- Ignore: do nothing 
- Throw next exceptions: adding additional info
## Exception Handling Strategy - Logging
- Logs are records of a program's execution, used to troubleshoot and monitor its status
- Crucial aspect of exception handling in web application
	- Logging allows developers to track issues, diagnose problems, and monitor the application's health
	- Proper Logging includes error message, stack trace, and contextual information to aid in debugging and maintenance
- SLF4J or Log4J to standardize the process in java 
- Logging in python
## Exception Handling Strategy - Error Response
- Spring provides the application developer with a default exception handling mechanism
	- If we visit the API using browser client, it will return a "white label error page"
	- if we visit the API using machine client, it will return a JSON response
- ErrorMvcAutoConfiguration - inject 4 beans
	- ErrorPageCutomizer
	- BasicErrorController
	- DefaultErrorViewResolver
	- DefaultErrorAttributes
## Exception Handling Strategy - Retry
- The retry mechanism can improve the resilience of web application by automatically reattempting failed operations 
- Good with dealing with transient issue such as network timeouts or temporary service unavailability 
- this strategy itself it anti-pattern (if ignore or handle unappricately, more issues will arise)
- This strategy should include the following consideration 
	- Back-off policy
	- Limited on the number of retries
	- Handling idempotency to avoid duplicate operations
## Exception Handling Strategy - Ignore
- Sometimes it is appropriate to ignore certain exceptions if they are deemed non-critical or expected under specific conditions
	- when deleting a user account, it is non-critical if the user's session does not exist
- This strategy helps maintain the flow of the application without interruption
- This strategy should be implemented carefully to ensure exception are not masked (choose wisely on what to surpressing and what to show/logging)
## Exception Handling Strategy - New Exception
- Re-throwing exceptions allows higher-level components to handle errors appropriately
- (translate an exception)
- This is useful when lower-level components cannot effectively manage the exception or when additional context needs to be provided before handling it
- By re-throwing exceptions, developers can maintain a clean separation of concerns and ensure that exception-handling logic is centralized
# Logging
## motivation 
- debugging and troubleshooting
	- To record exception and errors
	- To display objects (request and response)
- Performance monitoring
	- server speed
- Health and maintenance
	- system health
- Core business checkpoint
	- validation (missing properties)
	- status check (only active use can perform actions)
## Logging format 
- Date and Time: Millisecond precision and easily sortable
- Log Level: ERROR, WARN, INFO, DEBUG, or TRACE
- Process ID
- "-" separator to distinguish the start of actual log messages
- Thread name: Enclosed in square brackets 
- Logger name: source of class name
- The log message
# Error Response
## @ExceptionHandler
- works at @Controller level
- It is used within a controller to handle exceptions thrown by methods in that controller
- so we
	- Capture specific exceptions and return custom responses
	- Support handling multiple exception types
- returns a ResponseEntity or custom messages, allowing flexibility in determine 
- Drawbacks: only active for the specific controller
# @HandlerExceptionResolver
- Old approach to the problem
- Resolve any exceptions thrown by the application
- Allow us to implement a uniform exception handling mechanism
# @ControllerAdvice
- Popular choice
- consolidate multiple, scatter @ExceptionHandler into global error handling component
- Enables a mechanism that make use of ResponseEntity



