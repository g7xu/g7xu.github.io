# Web Server
##  Computer vs. Web Server
- web server: a computer with CPU, motherboard, disk storage, power 
- difference between a computer and web server
	-  web server a computer with specific compatibility 
	- web server is computer, but not all computers are web servers
## Common Web Servers
- Apache HTTP Server
- Internet info servervice
- Nginx Web Server
## Web Server user story
1. user enter URL
2. DNS return the IP address
3. browser sents HTTP request to the web server using the IP address specified by the domain name server
4. the web server return the page to the IP address of your computer
5. your browser render 

Web Service Terminologies
- SMTP Server -- Simple Mail Transfer Protocol server: emails transactions
- FTP Server - File Transfer Protocol: standard network protocol used for the transfer of computer files between a client and a server on a computer network
- ISP -- Internet Service Provider: companies who propvide you service in terms of internet connection to connect to the internet
- DNS -- Domain Name System: When someone type in domain name to find the IP that hosts your site. When you register the domain name, your IP address should be put in a DNS along with your domain name
# Deployment
Definition: activities that make a software system available for use which you will publish the content to the machine that hosts our web application, **remotely**
## Deployment Scenario
### individual developer
- runnable on locally computer
- using local machine(own computer) & local network
### Company & Organization
- More machines, all in a server room
- deploy on those things
###  Renting a server
- rent a server
- purchase machines, and rent a room for storage costs money
- hire hardware engineers and guards costs money
- publish our content to the machine that hots our web application, remotely
### Modern Cloud Service
 - Pay for the amount we used
- AWS, Azure, GCP
## Environment
Once we have implemented some features, others need to have access to your application
needs to push our application to some other servers/Data Center
Ex.
- local/dev env
- QA env
- UAT
- Pre-Production/Staging Env
- Production Env
Why many
- human error
- hold an additional application QA
### Spring Profiles
- core feature of the framework -- allowing us to map our beans to different profiles -- dev, test, prod
- define profiles ()
	- application.yml -default
	- application-dev.yml - Dev
	- application-qa.yml - QA
- Use Profiles
	- set spring.profile.active 
	- JVM Parameters
## Deployment consideration
- will user still be able to access your application
	- downtime - when we close and start a new application, downtime?
- will you allow all users to use those new features
	- Control Experiment
- what if something goes wrong with the new version of your application
	- Rollback - we go back to the previous functional version
## Deployment Strategies
- Big Bang Deployment - Take the entire application down and then new version of the application is deployed
- Blue-Green Box Deployment -- two versions
	- Blue version (old and stable)
	- Green version (new)
	- once the green version is tested and certified to work (shift the traffic from Blue to Green)
- Rolling Deployment -- Keep one version but replace the old version with a new version during deployment
- Canary Deployment -- keep both stable and new version, with the stable version serving most users and the new version serving a small pool of test users

# Docker
while the program has no problem on deploying on my computer, it doesn't means that it has no problem in deploying to other computer
## Virtual Machine vs. Container
### Virtual Machine 
- multiple VM on a server to reduce the underutilized hardware resources
- Allow organization to install multiple OS in multiple environment
- creating a VM layer where separate application can be ran separately with custom Operating system and own version control system
### Docker
- A container runs upon a computer's kernel (light-weight, efficient)

## Docker Components
### DockerFile
instruction on making the docker image
### Docker Daemon
- listens for Docker API request
- Manage images, containers, networks and volumes 
### Docker Client
- Docker CLI
### Docker Registry
- A registry stores Docker Images (DockerHub)
### Docker Desktop 
- GUI to build, run image and container
- contains Docker Daemon & Docker Client
## Docker Objects
### Images
- read only template with instructions to create a Docker Container
- based on other images
- images provide by others
- images act as a stack of layers
### Containers
- A runnable instance of an image
### Network
- Makes container to connect to and communicate with each other, or to non-Docker workloads
	- makes container to connect to and communicate with each other, or to non-Docker workloads 
### Volume
- Storage Spaces for the container


docker build --> create an image from the dockerfile
docker run --> create an container out form the docker image
docker start
docker stop
docker log
docker push
docker pull

![[dockerFile Demo.mov]]





