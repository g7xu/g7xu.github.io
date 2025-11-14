# System Design Approach

## Initial Planning Steps

Before designing a system, determine whether the focus is on:

- **OOAD (Object-Oriented Analysis & Design)**  
or  
- **Large-Scale System Architecture**

This sets the scope for how deep you go into components, storage, APIs, and scaling.

---

# Core System Design Process

1. **Clarify Requirements**  
   Understand product goals, user flows, business rules, constraints.

2. **Define Data Storage**  
   Choose database types (SQL / NoSQL) and design schemas.

3. **Define Services & APIs**  
   Map business logic to API endpoints, services, and system boundaries.

4. **Plan for Scaling**  
   Design both **application** and **database** scaling strategies.
   - Determine expected load (QPS, daily active users)
   - Estimate instance requirements
   - Identify bottlenecks and limits early

---

# Documentation Framework

## Product Requirements Document (PRD)

- Defines features, expected behavior, and constraints  
- Acts as a business blueprint for engineering  
- Example: eBay mobile app download banner  
  - Where should the banner appear?  
  - How often should it appear?  
  - How will success be measured?

## Technical Design Document (TDD)

- Contains all technical architecture decisions  
- Includes:
  - Data storage and schemas  
  - Services and APIs  
  - Scaling strategy  
  - Error handling & security considerations  

---

# Software Development Life Cycle (SDLC)

SDLC provides a systematic process for building high-quality software while managing cost and time.

---

## Phase 1: Requirement Analysis

- **Study Current System**  
  Assess workflows, identify inefficiencies, gather performance data.

- **Identify User Requirements**  
  Interviews, surveys, shadowing, focus groups.

- **Resource Planning**  
  Budgeting, team size, tooling requirements.

- **Schedule Planning**  
  Milestones, timelines, cost estimations.

---

## Phase 2: Design

### High-Level Design (HLD)

- Technology stack (e.g., Java, Python, Docker, MySQL)  
- Architecture (Monolithic vs Microservices)  

### Low-Level Design (LLD)

- Business logic flows  
- Database schema design  
- Error handling strategy  
- Security, authentication, and access control

---

## Phase 3: Implementation

- **Backend Development**  
  Java, JavaScript, or chosen backend language

- **Frontend Development**  
  Framework selection, component architecture, state management

- **Best Practices**  
  Design patterns, SOLID principles, code documentation

---

## Phase 4: Testing

### Functional Testing

- Unit tests  
- Integration tests  

### Non-Functional Testing

- Performance  
- Usability  
- Security  
- Compatibility across devices/browsers  

---

## Phase 5: Deployment

### Deployment Models

- **On-Premises**  
  - Full ownership and control  
  - Higher initial costs  

- **Cloud Deployment**  
  - AWS, Azure, GCP  
  - Elasticity, flexibility, managed services  

---

## Phase 6: Maintenance

- Bug fixes  
- Feature enhancements  
- Performance optimizations  
- System monitoring and alerting  

---

# SDLC Models

## Waterfall Model

- Sequential and rigid  
- Heavy documentation  
- Minimal customer feedback  
- Suitable for well-defined requirements  

## Agile Model (≈90% industry adoption)

- Iterative and flexible  
- Continuous customer feedback  
- Short development cycles  
- Collaboration prioritized over documentation  

---

# Agile Framework: Scrum

## Core Components

### Sprint Structure

- Time-boxed (commonly 2 weeks)  
- Each sprint delivers a usable product increment

### Scrum Roles

- **Product Owner**  
  Owns product backlog and prioritization

- **Scrum Master**  
  Facilitates process, removes blockers

- **Development Team**  
  Developers, QA engineers, DevOps, UI/UX designers, architects

### Scrum Events

- **Sprint Planning**  
  Define sprint goals and tasks

- **Daily Stand-ups**  
  Short updates and blocker identification

- **Sprint Review**  
  Showcase completed work to stakeholders

- **Sprint Retrospective**  
  Analyze what went well and what needs improvement

### Scrum Artifacts

- **Product Backlog** — prioritized user stories  
- **Sprint Backlog** — tasks for the current sprint  
- **Product Increment** — completed, releasable work  

---

# Development Environments

1. **Local Environment** — developer’s personal workspace  
2. **Development (Dev)** — shared team integration environment  
3. **Quality Assurance (QA)** — testing by QA team  
4. **User Acceptance Testing (UAT)** — validated by end-users or clients  
5. **Staging** — production-like environment for final validation  
6. **Production** — live environment for end users  

---

# Key Roles in Development

- **Project Manager** — timeline and resource management  
- **Product Manager** — market research, PRD creation  
- **UI/UX Designer** — interface and experience design  
- **System Architect** — overall system blueprint  
- **Developers** — frontend, backend, full-stack  
- **QA Engineer** — test planning and validation  
- **DevOps Engineer** — CI/CD and deployment automation  

---

# Practical Application

## From Theory to Practice

- **Requirement Analysis**  
  PRD, user stories, prototyping

- **Design**  
  Tech selection, TDD creation, architecture reviews

- **Implementation**  
  Code development, unit testing

- **Testing**  
  Ensure feature quality and reliability

- **Deployment**  
  Move through environments → Production

- **Maintenance**  
  Long-term support and iteration

---

# Success Measurement

- Define clear KPIs and metrics  
- Establish data collection processes  
- Use A/B testing or randomized sampling  
- Create continuous feedback loops  
