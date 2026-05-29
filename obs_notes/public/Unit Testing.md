logic or ways to check if code logic performs as expected 

Two Main Types:
- Unit Testing: testing of individual behaviors on different functional groups within an application (JUnit + Mockito)
- Integration Testing: testing correct overall functionality of multiple functional groups interacting within an application
- Accept Testing (UAT): verify the entire application including UI (Through UI)
# Why Testing
- Quality of Code: ensures existing logic is not broken by additional features as the application grows
- Documentation
- Test Driven Development: writing test cases before actual code, ensure the developer thinks thoroughly about business requirements and logic


![[Pasted image 20260113125505.png]]
# Perform testing
## Testing Scenarios
- Happy Path Test: normal test cases
- Exception Path Test Case: programs handle faulty scenarios
- Edge Case: edge case
## Write deterministic test cases
the test result should to change without a change in the code or test
## Test Naming Convention
- Package: Same as the source code
- Test Cases
	- GIVEN-WHEN-THEN structure
	- GIVEN: context of behavior
	- WHEN: the action that triggers it
	- THEN: the expected return
## Testing edge functions
- void return type
	- Checking input
	- Check exception
	- delete the shit
- private method (Through public methods)
# JUnit Module
- testing framework is widely used to perform unit testing on Java projects
- making sure to differentiate the JUnit 4 and JUnit 5
- Annotations
	- @ExtendWith: allow integration with additional modules
	- @Test: Marks a method as a test method for JUnit to execute
	- @DisplayName: Customize test case names in the report
	- @Disabled: Prevent execution of a test
- life cycle annotation
	- @BeforeAll: run before all test
	- @BeforeEach: run before each test
	- @AfterEach: run after each test
	- @AfterAll: run after all test
## Assertion
- Key to validate if the output from code is expected
- From JUnit 5, we cna use lambdas in assertion
- JUnit 5 also introduced `assertAll()` that allows us to group assertions and report any failed assertions with a MultipleFailuresError
- assertThrows: assert the Exception for the `Exception Path Test Case`
- assertEquals: utilize the equal func of the object
- assertSame: utilize the equal sign of the programming language
# Sprint Testing with JUnit
- Dependency injection
- when testing
	- Controller - Make/Mock an API call to a certain endpoint
	- Service - Test business logic
	- Repository - Test data-related operations
- Spring Testing specific annotation
	- @ExtendWith(SpringExtension.class)
		- Override several methods to process Unit Testing
	- @SpringBootTest
		- It creates ApplicationContext, which holds all the beans you need in the application
	- @AutoConfigureMockMvc
		- Start the mock servlet
	- @WebMvcTest
		- Only bootstrap the certain controller
# Mockito
Achieving isolation which separating components to test them individually. We focus on testing one unit at a time

Mockito is used to mock interface so that dummy functionality can be added to mock interface that can be used in unit testing
- When testing the controller layer, we only want to focus on testing (fake object on real interface)

Mockito - Basic Annotations
- @Mock
	- It helps to create a Mock object, where we can stub/simulate the behavior of the object
	- It takes a Class as its parameters
- @Spy
	- It helps to create a Partial Mock object, where methods will be directly invoked unless those methods are stubbed
	- It takes an Instance as its parameter
- @InjectMocks
	- It injects mock fields into the object that needs to be tested automatically
	- It takes a Class as its parameter

Stubbing: Configure the mock and define what to do when specific methods of the mock are called
```java
when(xxx.method()).thenReturn()
doReturn().when(xxx).method()
when().thenCallRealMethod()
when().thenThrow()
```

Verify
- Once a mock or spy has been used, we can verify that specific interactions took place
- syntax `verify(mock, VerificationMode)`

Testing in Repository
- verify our queries that retrieve, insert, update, and delete data
- call the database, but, without affecting the actual data
- Annotations
	- @DataJpaTest -- load only the repository
	- @TestMethod(MethodOrder.OrderAnnotation.class) -- Specify which test cases need to run first
	- @ActiveProfiles -- Specif another profile that needs to be used during the test
	- @Order -- On the method level, define the order of test cases
	- @Rollback  -- Spring  will roll back all data changes
# Test Driven Development 
## Code Coverage
- Code coverage is a software metric used to measure how many lines of our code are executed during automated tests
- **JaCoco** is a good tool to check the testing code coverage
## Test first
- create test case first
- developers create codes to meet test case requirements
- move to the next failed test case