# Standard Java Application Development

Putting everything into a ZIP file

- **.ear** (enterprise application), **.war** (web application), **.jar** (standalone application)
- streamline Java Application Development
- Difference
    - JAR: only requires a Java installation
    - WAR: only requires a Java EE Web Profile-compliant application server
        - Servlet and JSP API
        - images, HTML, property files and complied Java code
    - EAR: A fully Java Platform, Enterprise Edition-compliant application server
        - EE API (use all the function in Java EE)

# Maven

**Maven** automates these tasks

- Full Name: Apache Maven
- Dependency management
- Central repository system: dependencies can be loaded from the file system or public repo

## Maven - Project Structure
```
maven-project/
├── pom.xml                 # collections of command center
├── src/
│   ├── main/
│   │   ├── java/           # Java Code
│   │   └── resources/      # configuration files or assets
│   └── test/               # Test Code
│       ├── java/
│       └── resources/
└── target/                 # any product of code goes to target section
```

### POM File (XML format)

- describe project
- manages dependencies: garbing packages from MAVEN online source
- configures plugins for building the software
- define relationships among modules of multi-module projects

**section 1** — meta information

- `groupId`: the author's org
- `artifactId`: the name of the project
- `version`: product version (`Major_No.Minor_No.UpdateNo`)
- `packaging`: jar or war or ear
- `name`: the displayed project name

**section 2** — property (a key value pair section that will be used in later part)

**section 4** — dependencies

each dependency has

- `groupId`: company
- `artifactId`: company project
- `version`: product version
- `scope`: (optional) when to include the dependency

dependency category

- API: rules, methods, and tools that allow user to get **what** without worry about **how**
- Library: A collection of pre-written code that allows user to complete common takes but with more control over
- Framework: a structured foundation for building (well thought out code that do 99% of the job for you)

## Maven - Lifecycle

streamline and execute command for certain stage of the project

three major steps (**clean**, **default**, **site**); each step has a multiple phase; each phase has goal (extra shit)

classic one:

- clean phase (clean stage): delete anything in the target folder
- compile phase (Default stage):
- deploy phase (Default stage):
- test phase (Default stage):
- install phase (Default stage): install the JAR file onto the .m2 file

Example Command:

`MVN {{phase in Clean stage}} {{phase in Default stage}} {{phase in Site stage}}`

## Multi-Module Project

- aggregator POM that manages a group of submodules (child Maven projects)
- Super POM file in root directory and sub POM file in the module folders
- Manage the intricate dependency between each module

Advantage

- Modularity and Code Reusability
- Easier Dependency Management
- Simplified Build Process

### Parent POM File Feature

- `<packaging>pom</packaging>`
- dependency management control the version of dependency of child module