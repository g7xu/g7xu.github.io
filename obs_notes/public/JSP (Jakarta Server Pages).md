# MVC
- Stands for Model-View-Controller
- An architecture pattern that separates the application into three business components to separate business logic and presentation
- manage complex applications by dividing responsibilities
- Composition
	- Model: manage data and business logic
	- View: handles layout and display
	- Control: handles user input and interactions
![[Screenshot 2026-01-22 at 12.05.35 PM.png]]
## Advantages of choosing MVC
- Separation of Concerns: adheres to SOLID principles
- Readability and Maintainability: Modification in one component have minimal impact on others
- Reusability: Components can be reused across different parts of the application 
- Testability: Each component can be tested independently
## Apply MVC to Java Web Application
- Minimizes HTML code in Controller
	- No More out.println(..) in Servlet code since HTML is separated into view layer
- Minimizes business logic in View
	- No more large scriptlets in JSP code since business logic is moved to model
	- Use JSTL instead of scriptlet if applicable
# JSP 101
- Stands for Jakarta Server Pages which develop web pages by embedding Java code into HTML
- Facilities the separation of the view layer from the business logic in web application
- Allow us to create dynamic content, including fields like dropdown, checkboxes, with values fetched from a database
- code embedded using JSP tags `<%...%>`
## Pro
- easy to modify regular HTML since servlet code can be written directly into the JSP
- good performance due to the ability to embed of dynamic elements 
- platform-independent
- JSP used as view layer in MVC
- Built on top of the Java Servlets API, providing access to powerful Enterprise product
## JSP Lifecycle
- A JSP lifecycle can be defined as the entire process from its creation until its destruction
- paths follow by a JSP
	- JSP Page translation -- The JSP page is translated into a servlet by the JSP engine (jsp --> java)
	- JSP Page Compilation -- The translated servlet is compiled into a servlet class
- Initialization Phase -- The JSP servlet is initialized by calling the `jspInit()` method
- Request Processing Phase -- The JSP servlet processes client requests by calling the `_jspService()` method
- Cleanup Phase -- The JSP servlet is termianted by calling the jspDestory() method
## JSP Scripting Elements
### JSP Declaration
- A declaration tag is a piece of Java code for declaring variables, methods, and classes
- If we declare a variable or method inside declaration tag is means that the declaration is made inside the servlet class but outside the service method
- Usage
	- Declare a static member, or an instance variable
	- Define methods
- Syntax: `<%!...%>`
### JSP Scriptlet
- A Scriptlet tag allows you to write Java code directly into a wJSP file
- When generating the servlet from JSP, the JSP container places the statements within the scriptlet tag into the `_jspService()` method
- Usage: execute every time a request is sent to the JSP
- Syntax: `<%...%>`
### JSP Expression
- Expression tag allows you to output the value of a Java expression directly into the HTML
- When generating the servlet from JSP, the JSP container evaluates the expression and inserts the result into the response
- Produces a scriptless JSP page
- Usage: simple expressions and values that need to be displayed on the web page
- Syntax: `<%=...%>`
### JSP Comment
- Notes
- Syntax: `<%--...--%>`
### JSP Directive
- instructions to the JSP container that provide global information about an entire JSP page
- impact how JSP container process the JSP file and generates servlet code during translation phase
- Directives can have multiple attributes sepcified as space-separated key-value pairs
- Usage: 
	- import statement for the java class
	- Global Config
- Syntax: `<%@ directive attirbute="..."%>`
#### JSP Page Directive
- provides global settings and configurations that apply to the entire JSP page
- affects various aspects of the page such as scripting language, content type, character encoding, error pages, and etc.
- Usage:
	- config page attributes
	- set import statements for including Java classes and packages
	- Define error pages and session management settings
- Syntax: `<%@ page attribute="value"%>`
#### JSP Include Directive
- include the content of another file in current JSP page during translation phase
- can be HTML, JSP, text file
- Usage:
	- Reuse common static resources like headers, footers, navigation bars (sources that will not change after the translation phase)
	- Maintain consistency across multiple JSP pages by including the same content
- Syntax: `<%@ include file="relativeURL" %>`
#### JSP Taglib Directive
- declare and include a tag library in a JSP page (making custom or standard tags available for use within the JSP)
- Tags from the tag library are used to encapsulate reusable functionality in JSP pages
- Use cases:
	- Utilize custom tags to handle repetitive tasks
	- Integrate standard tag library like JSTL for tasks like iteration, conditional processing, and etc.
- Syntax: `<%@ taglib prefix="prefix" uri="uri"%>`
### JSP Standard Action Tag
- JSP Actions are XML-Like tags that provides dynamic behavior in JSP pages
- Use case:
	- Dynamically include resources during request processing phase
	- Reuse and manipulate the JavaBean components
	- Control and execution flow 
- Syntax: `<jsp:action_name attribute="value">`
#### Common Used JSP Action Tags
| JSP Action Tags     | Description                                                                                                                       | Example                                                           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **jsp:useBean**     | Instantiates or locates a target JavaBean object with the given scope. If the bean does not exist, it is created and initialized. | `<jsp:useBean id="order" class="com.xxx.Order" scope="session"/>` |
| **jsp:setProperty** | Sets the property value of a JavaBean.                                                                                            | `<jsp:setProperty name="order" property="id" value="1"/>`         |
| **jsp:getProperty** | Fetches the property value of a JavaBean.                                                                                         | `<jsp:getProperty name="order" property="id"/>`                   |
| **jsp:include**     | Include a resource in the current JSP file at request time.                                                                       | `<jsp:include page="footer.jsp" />`                               |
| **jsp:forward**     | Forward the current request to another resource.                                                                                  | `<jsp:forward page="result.jsp" />`                               |
| **jsp:param**       | Used to provide additional key-value information during `jsp:include` and `jsp:forward`.                                          | `<jsp:param name="id" value="12" />`                              |
# Expression Language
A feature that simplifies the access and manipulation of data in JSP pages
- Allows access data from **JSP implicit objects** and **JavaBeans**
- Supports operators and functions
EL Syntax: `${el-expression}`
# JSP Implicit Objects
- An implicit object is created by web container and contain information related to a particular request, page, session, or application
- Pro
	- Provides direct access to commonly used obj without needing explicit creation or management
	- Facilities easy access to data across different scopes, including page, request, session, and applications
	- Makes it easy to fetch and use data during interaction between JSP pages and other components 
## Implicit Object variables

| Name            | Type                | Description                                                                                          |
| --------------- | ------------------- | ---------------------------------------------------------------------------------------------------- |
| **request**     | HttpServletRequest  | Allows access to request parameters, headers, attributes, etc.                                       |
| **response**    | HttpServletResponse | Used to set response headers, status codes, etc.                                                     |
| **out**         | JspWriter           | Used to send (write) content to the client                                                           |
| **session**     | HttpSession         | Allows access to the session across multiple requests from the same user                             |
| **application** | ServletContext      | Allows access to the web application context, shared among all servlets and JSPs in the application  |
| **config**      | ServletConfig       | Allows access to the servlet configuration specific to the current JSP page                          |
| **pageContext** | PageContext         | Access to all the namespaces associated with a JSP page                                              |
| **page**        | Object              | Refers to the current JSP page. Allows access to the methods and properties of the current JSP page  |
| **exception**   | Throwable           | Represents exceptions thrown during the execution of the JSP page when the JSP page is an errorPage. |
## Implicit Objects in JSP Expression Language (EL)
A lot easier to extract the value related to the Implicit object

| Name                 | Type        | Description                                          |
| -------------------- | ----------- | ---------------------------------------------------- |
| **pageScope**        | Map         | Access attributes stored in page scope               |
| **requestScope**     | Map         | Access attributes stored in request scope            |
| **sessionScope**     | Map         | Access attributes stored in session scope            |
| **applicationScope** | Map         | Access attributes stored in application scope        |
| **param**            | Map         | Access request parameters as strings                 |
| **paramValues**      | Map         | Access request parameters as arrays of string values |
| **initParam**        | Map         | Access context initialization parameters             |
| **pageContext**      | PageContext | Same as JSP implicit pageContext object.             |
| **header**           | Map         | Access request header as string                      |
| **headerValues**     | Map         | Access request header as an array of string values   |
| **cookie**           | Map         | Access cookies in JSP                                |
# JSTL
- Stands for JSP Standard Tag Library
- encapsulate core functionalities into simple, standard tags, making JSP development easier and more maintainable
- JSTL is exposed as multiple tag libraries, each serving a specific purpose
	- Core: basic func: variable support, flow control, URL management, and miscellaneous operations
	- XML: Functionalities up support working with XML data including parsing, transformation, and XPath expression
	- Internationalization: used to support formatting numbers, dates, and internationalization
	- Database: simplify database operations
	- Functions: supports utility functions for string manipulation and collection handling
## JSTL - Core Tag Library
- Syntax to use the Core Tag Library: `<%@ taglib prefix="c" uri="..." %>`
- Common Used Tags
	- `<c:out value="${expression}">`: output value of an expression  
	- `<c:if test="${expression}">`: conditionally renders the content  
	- `<c:choose>`, `<c:when test="${expression}">`, `<c:otherwise>`: conditional logic similar to `switch` / `if-else` in Java  
	- `<c:set var="variableName" value="value" scope="scope" />`: set the value of a variable in a specified scope (**page** scope is default)  
	- `<c:forEach var="item" items="${collection}"> ... </c:forEach>`: iterates over a collection of items  
	- `<c:catch var="exception"> ... </c:catch>`: catches any `Throwable` and optionally stores it as a variable for later usage  
	- `<c:url var="url" value="path"> <c:param name="paramName" value="paramValue" /> </c:url>`: constructs a URL with optional query parameters  
	- `<c:redirect url="destinationUrl" />`: redirects user from the current page to another URL  
	- `<c:import url="resourceUrl" var="variableName" />`: imports content from a URL or another resource  
## JSTL - XML Tag Library
- Syntax to Use the XML Tag Library: `<%@ taglib prefix="x" uri="..." %>`
- Common Used Tags
	- `<x:parse var="xmlDoc" xml="${xmlString}" />`: Parses an XML document or XML string and assigns the resulting XML structure to a specific variable
	- `<x: out select="$xmlDoc/root/element" />`: Displays the result of an XPath expression evaluated against a parsed XML document. Similar to JSP expression but used specifically for XML data
## JSTL - Internationalization Tag Library
- Syntax to Use the i18n Tag Library: `<%@ taglib prefix="fmt" uri="..." %>`
- Common Used Tags
	- Parsed the given dataString with the target pattern to a Data object
	- Format Date object to the specific format
	- Format numbers to the specific date format
## JSTL - SQL Tag Library
- Syntax to Use the SQL Tag Library: `%@ taglib prefix="sql" uri="..." %`
- Common Used Tags
	- Execute an SQL query to the target datasource and stores the result
	- Execute query to extract data
## JSTL - Functions
- Syntax to Use the Functions: `<%@ taglib prefix="fn" uri="..." %>`
- Common Used Tags
	- `fn:length(...)`
	- `fn:contains(input, substr)`