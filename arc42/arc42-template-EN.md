# Introduction and Goals {#section-introduction-and-goals}

This section introduces The Weather Archive and explains underlying goals and requirements, which we pursue in the development of the new Weather Archive web applicaiton. 

### What is The Weather Archive

The Weather Archive is a platform for historical weather data. Having installed multiple cemeras across all european major cities, we want to provide historical weather data freely on the internet.
- Using our own API, we can provide high-resolution visual weather footage
- We pass metadata like humidity, air pressure at certain points in time


## Requirements Overview
Our target is to create a new web application, which displays historical weather data. These cameras take high-resolution pictures every five minutes, and we have to create an applicaiton, which 
- is accessible via browser across the entire world
- can scale with ease
- is reasonably performant in its response time (< 2 seconds)
- has below 0.5 % downtime each year
- is extensible and maintainable
- offers a good usability for website visitors
- use serverless technologies to minimize idle-costs

We aim to provide an application that is up to modern standards in visual as well as technical aspects, but also allows us to start small, and scale up to cover very high traffic loads.

| Id | Requirement | Explanation |
| ------- | ------- | ------- |
| F1 | Use loosely coupled microservices | As we aim to grow and potentially add new functionalities, we have to keep our system modular and extensible. Furthermore, there shall be minimum downtimes, which is why we need to decouple our functionalities as much as possible. |
| F2 | Worlwide availability | Our applicaition needs to be accessible to the biggestmost userbase possible. Anyone requiring european wether cam footage should be able to do, primarily via our web application. |
| F3 | Horizontal scalability | We need to be scalable in times of high demand, but also have to reduce idle costs, which is why we are going to use serverless functions inside our cloud infrstructure. |
| F4 | Response times below three seconds | Our weather cams provide high-resolution footage. Furthermore, we need to process video material to provide moving imagery, and we are going to use serverless functions to avoid idle costs. Still, our response times need to as low as possible. | 
| F4 | Visual usability assistance | Our users should be guided through the use of our web app. Thus, we have to keep to UX standards and aid them by useful features along their visits. | 
| F5 | Event-driven architecture | A lot of our backend processing can take place asynchronously, so we are able to reap the benefits of event-driven architectures. | 

## Quality Goals {#_quality_goals}
The following table explains our three most important quality goals

| Id | Quality Goal | Explanation |
| ------- | ------- | ------- |
| QG1 | Maintainability | Our system may need to be modified in the future, so adding, modifying or improving system components based on changes in environemt or requirements needs to be easily doable. |
| QG2 | Reliability | Our system can handle a strongly varying number of traffic from across the globe. Errors within our system do not lead to total system outages, but rather only to outages of small system components. |
| QG3 | Operability | The system can be understood, learned, used and is attractive to our users. |

## Stakeholders {#_stakeholders}
There are plenty of stakeholders, which hold some special interest in our system. The following section lists our main stakeholders and puts there interests in relation.

| Who | Interests |
| ------- | ------- |
| Software Architects | Require good understanding of software architecure, underlying thoughts and requirements as well as stakeholders. |
| Software Developers | Require an understanding of our system's software components and the overall system architecture. Are in need of a secure and modular environment, that makes adapting the sytem straightforward. |
| End users | Need ease of use when accessing our web application. The do not want to spend time learning how to achieve their desired task. Also, they want speedy performance, so as little loading time as possible. |
| DevOps Team | Want to have parts of the development process automated, in order to save time and improve efficiency. Want the software architecture to be modular and finegrained, in order to split up developers into smaller teams. They love the cloud. |
| Requirements Engineers | Need understanding of all stakeholders. Need clear documentations and require an understanding of system boundaries. |
| Meteorological Agencies | Want access to our data, in order to potentially use it for their own services. |


# Architecture Constraints {#section-architecture-constraints}
In order to achieve our quality goals and fulfill requirements, there are certain aspects that limit our freedom. These architectural constraints a listed below.

| Topic | Constraint |
|-----|------|
| Cloud Infrastructure | We need to use the cloud, which makes us prone to vendor lock-in. |
| High resolution imagery | As our images are very high resolution, we might need to vertically scale up, or downsize our instances, in order to quickly process these files. |
| Serverless functions | These functions can slow down our entire application, as they are required to cold-start frequently. |
| Data storage in serverless environments | We cannot store data well when working with serverless functions, as they are stateless, so we have to find a workaround for that. |
| Provider limitations | All limitations for concurrency, and lifetime configurations are limited to some degree by cloud providers, so we have to adhere to their limitations. |
| Costs | We can only afford so much infrastrucutre, so we have to make sure we do not exceed our budget when using auto-scaling features adn the like. |
| Data consistency | If we use caching mechanisms for performance benefits, we might suffer constraints regarding data consistency, so we have to take this into consideration. | 
| Data Privacy | Occasionally, there will be people walking around in our camera footage. We might have to take additional measures in order to blur faces, license plates and more. Also we have to consider which data will eventually end up in the cloud, and which GDPR / HIIPA constraints we therefore need to consider. |

# Context and Scope {#section-context-and-scope}

The main players of our system are the system itself, which has an interface to its users on the one hand, and an interface to the weather cams on the other hand. Weather cams also receive information from our telemtetric sensors, so that we can add metadata about air pressure and such to our files. Also, system administrators have a special interface to our system, as they need to have priviledged access.

## Business Context {#_business_context}
The diagram shows the main interfaces between our system and outside actors, such as users, admins and our weather cams, which are physically distributed across Europe. 
![Business Context Diagram](images/Business%20Context.drawio.png)

## Technical Context {#_technical_context}
In terms of technical interfaces, there are plenty of interfaces within our system. Users and Webcams all require the API, in order to reach the sysems internal functionalities. Our microservices, serverless functions, as well as our databases will have an interface to our API and event system.
![Technical Context Diagram](images/Technical%20Context.png)

# Solution Strategy {#section-solution-strategy}
To fulfill the requirements and achieve the outlined quality goals, the following solution strategy will be implemented:

### Architectural Solution Strategy
The following solution strategies are applied in regards to our architectural challenges. 

| Topic | Solution Strategy |
|-----|------|
| Microservices-based Architecture | The system will be designed as a collection of loosely coupled microservices (F1) to enhance modularity and maintainability (QG1). This approach also enables independent scaling and reduces the risk of total system failure (QG2). Each service will have a specific responsibility, such as image processing, metadata management, and user interactions. | 
| Event-driven Architecture | Asynchronous processing of tasks, such as image processing and metadata generation, will be handled via an event-driven architecture (F5). This will improve system performance and ensure scalability (F3). |
| Serverless Computing | Wherever possible, serverless technologies like AWS Lambda will be used to minimize idle costs and enable horizontal scalability (F3). Stateless serverless functions will handle transient, compute-intensive operations, such as image resizing or metadata handling. |

### Data Storage and Processing
The following solution strategies are applied to challenges regarding data persistence. 

| Topic | Solution Strategy |
|-----|------|
| Cloud-native Storage | High-resolution images and video files will be stored in scalable, cloud-native storage services like Amazon S3 or Google Cloud Storage. Metadata and application data will reside in globally distributed databases such as DynamoDB or Firebase Firestore, ensuring low-latency access worldwide (F2). |
| Image Optimization | To meet performance requirements (F4), high-resolution images will be dynamically resized based on the requesting device’s capabilities. This process will be automated using serverless functions and caching layers. |
| **Optional:** Content Delivery Network | A CDN could be used to cache static assets, including weather imagery, and serve them efficiently to end users (F2, F4). This will also reduce load on the backend services and ensure consistent response times under high traffic conditions. |


### Scalability and Performance
The following solution strategies are applied to challenges regarding scalability and performance. 

| Topic | Solution Strategy |
|-----|------|
| Horizontal Scaling | Auto-scaling mechanisms will be employed to handle fluctuating traffic loads, particularly during peak periods (F3). Services will scale independently based on their specific workloads. |
| Cold Start Mitigation | Techniques like keeping serverless functions warm for critical endpoints or pre-compiling dependencies will be implemented to mitigate latency caused by cold starts. |


### Usability and Design
The following solution strategies are applied to challenges regarding usability and design. 

| Topic | Solution Strategy |
|-----|------|
| Intuitive User Interface | The web application will adhere to modern UX/UI standards (F4). Features like search functionality and guided user flows will ensure a seamless experience for end users (QG3). |


### Maintainability and Extensibility
The following solution strategies are applied to challenges regarding maintainability and extensibility. 

| Topic | Solution Strategy |
|-----|------|
| API-driven Design | The system will expose functionalities via RESTful APIs to support easy integration with external services and future extensions (F1, QG1). |
| Modular Codebase | By adhering to best practices in modular software design, the system will allow developers to add or modify components with minimal disruption (QG1). |

# Building Block View {#section-building-block-view}
In this sectioon, we will give insights to layers of our syetem, each getting more and more detailed. 

## Whitebox Overall System {#_whitebox_overall_system}

The following sdiagram shows the Top-Level View of our system. Further down, we will go into more detail on the lower level implementations of some building blocks. 

![Building Block View](images/Building%20Block%20View.drawio.png)

The reasons we decided to split our system that way are explained in the above sections. Driving considerations and goals are maintainability, extensibility as well as reliability. 

### BB1: The Weather Archive  {#__name_black_box_1}

![Leve 1: The Weather Archive](images/Black%20Box%201.drawio.png)


If you use tabular form you will only describe your black boxes with
name and responsibility according to the following schema:

+-----------------------+-----------------------------------------------+
| **Black**              | **Responsibility**                            |
+=======================+===============================================+
| *\<black box 1>*      |  *\<Text>*                                    |
+-----------------------+-----------------------------------------------+
| *\<black box 2>*      |  *\<Text>*                                    |
+-----------------------+-----------------------------------------------+






-   black box descriptions of the contained building blocks. For these
    we offer you alternatives:

    -   use *one* table for a short and pragmatic overview of all
        contained building blocks and their interfaces

    -   use a list of black box descriptions of the building blocks
        according to the black box template (see below). Depending on
        your choice of tool this list could be sub-chapters (in text
        files), sub-pages (in a Wiki) or nested elements (in a modeling
        tool).

-   (optional:) important interfaces, that are not explained in the
    black box templates of a building block, but are very important for
    understanding the white box. Since there are so many ways to specify
    interfaces why do not provide a specific template for them. In the
    worst case you have to specify and describe syntax, semantics,
    protocols, error handling, restrictions, versions, qualities,
    necessary compatibilities and many things more. In the best case you
    will get away with examples or simple signatures.





If you use a list of black box descriptions then you fill in a separate
black box template for every important building block . Its headline is
the name of the black box.

### \<Name black box 1> {#__name_black_box_1}

Here you describe \<black box 1> according the the following black box
template:

-   Purpose/Responsibility

-   Interface(s), when they are not extracted as separate paragraphs.
    This interfaces may include qualities and performance
    characteristics.

-   (Optional) Quality-/Performance characteristics of the black box,
    e.g.availability, run time behavior, ....

-   (Optional) directory/file location

-   (Optional) Fulfilled requirements (if you need traceability to
    requirements).

-   (Optional) Open issues/problems/risks

*\<Purpose/Responsibility>*

*\<Interface(s)>*

*\<(Optional) Quality/Performance Characteristics>*

*\<(Optional) Directory/File Location>*

*\<(Optional) Fulfilled Requirements>*

*\<(optional) Open Issues/Problems/Risks>*

### \<Name black box 2> {#__name_black_box_2}

*\<black box template>*

### \<Name black box n> {#__name_black_box_n}

*\<black box template>*

### \<Name interface 1> {#__name_interface_1}

...

### \<Name interface m> {#__name_interface_m}

## Level 2 {#_level_2}

Here you can specify the inner structure of (some) building blocks from
level 1 as white boxes.

You have to decide which building blocks of your system are important
enough to justify such a detailed description. Please prefer relevance
over completeness. Specify important, surprising, risky, complex or
volatile building blocks. Leave out normal, simple, boring or
standardized parts of your system

### White Box *\<building block 1>* {#_white_box_emphasis_building_block_1_emphasis}

...describes the internal structure of *building block 1*.

*\<white box template>*

### White Box *\<building block 2>* {#_white_box_emphasis_building_block_2_emphasis}

*\<white box template>*

...

### White Box *\<building block m>* {#_white_box_emphasis_building_block_m_emphasis}

*\<white box template>*

## Level 3 {#_level_3}

Here you can specify the inner structure of (some) building blocks from
level 2 as white boxes.

When you need more detailed levels of your architecture please copy this
part of arc42 for additional levels.

### White Box \<\_building block x.1\_\> {#_white_box_building_block_x_1}

Specifies the internal structure of *building block x.1*.

*\<white box template>*

### White Box \<\_building block x.2\_\> {#_white_box_building_block_x_2}

*\<white box template>*

### White Box \<\_building block y.1\_\> {#_white_box_building_block_y_1}

*\<white box template>*

# Runtime View {#section-runtime-view}

::: formalpara-title
**Contents**
:::

The runtime view describes concrete behavior and interactions of the
system's building blocks in form of scenarios from the following areas:

-   important use cases or features: how do building blocks execute
    them?

-   interactions at critical external interfaces: how do building blocks
    cooperate with users and neighboring systems?

-   operation and administration: launch, start-up, stop

-   error and exception scenarios

Remark: The main criterion for the choice of possible scenarios
(sequences, workflows) is their **architectural relevance**. It is
**not** important to describe a large number of scenarios. You should
rather document a representative selection.

::: formalpara-title
**Motivation**
:::

You should understand how (instances of) building blocks of your system
perform their job and communicate at runtime. You will mainly capture
scenarios in your documentation to communicate your architecture to
stakeholders that are less willing or able to read and understand the
static models (building block view, deployment view).

::: formalpara-title
**Form**
:::

There are many notations for describing scenarios, e.g.

-   numbered list of steps (in natural language)

-   activity diagrams or flow charts

-   sequence diagrams

-   BPMN or EPCs (event process chains)

-   state machines

-   ...

See [Runtime View](https://docs.arc42.org/section-6/) in the arc42
documentation.

## \Runtime Scenario 1: Real-Time Weather Data Processing {#__runtime_scenario_1}

<img src="https://github.com/CooopeIR/servl-weathercams/blob/master/arc42/images/runtimeview1.png" width="400">


Description:

The Data Ingestion Service collects data from sensors and external APIs.
Preprocessed data is sent to the Data Storage Module.
The Data Analysis Engine fetches new data and updates insights.
External systems request insights via the API Gateway.

## \Runtime Scenario 2: Data Retrieval for Historical Analysis {#__runtime_scenario_2}

<img src="https://github.com/CooopeIR/servl-weathercams/blob/master/arc42/images/runtimeview2.png" width="400">


Description:

1. External systems request historical weather data via the API Gateway.

2. The API Gateway queries the Data Storage Module for relevant data.

3. The requested data is formatted and sent to the external system.

## \Runtime Scenario 3: Predictive Analysis Execution {#__runtime_scenario_3}

<img src="https://github.com/CooopeIR/servl-weathercams/blob/master/arc42/images/runtimeview3.png" width="400">


Description:
1. The Data Analysis Engine triggers predictive models based on new data.

2. Results are stored in the Data Storage Module.

3. The API Gateway provides the predictions to external systems upon reques

# Deployment View {#section-deployment-view}

::: formalpara-title
**Content**
:::

The deployment view describes:

1.  technical infrastructure used to execute your system, with
    infrastructure elements like geographical locations, environments,
    computers, processors, channels and net topologies as well as other
    infrastructure elements and

2.  mapping of (software) building blocks to that infrastructure
    elements.

Often systems are executed in different environments, e.g. development
environment, test environment, production environment. In such cases you
should document all relevant environments.

Especially document a deployment view if your software is executed as
distributed system with more than one computer, processor, server or
container or when you design and construct your own hardware processors
and chips.

From a software perspective it is sufficient to capture only those
elements of an infrastructure that are needed to show a deployment of
your building blocks. Hardware architects can go beyond that and
describe an infrastructure to any level of detail they need to capture.

::: formalpara-title
**Motivation**
:::

Software does not run without hardware. This underlying infrastructure
can and will influence a system and/or some cross-cutting concepts.
Therefore, there is a need to know the infrastructure.

Maybe a highest level deployment diagram is already contained in section
3.2. as technical context with your own infrastructure as ONE black box.
In this section one can zoom into this black box using additional
deployment diagrams:

-   UML offers deployment diagrams to express that view. Use it,
    probably with nested diagrams, when your infrastructure is more
    complex.

-   When your (hardware) stakeholders prefer other kinds of diagrams
    rather than a deployment diagram, let them use any kind that is able
    to show nodes and channels of the infrastructure.

See [Deployment View](https://docs.arc42.org/section-7/) in the arc42
documentation.

## Infrastructure Level 1 {#_infrastructure_level_1}

Describe (usually in a combination of diagrams, tables, and text):

-   distribution of a system to multiple locations, environments,
    computers, processors, .., as well as physical connections between
    them

-   important justifications or motivations for this deployment
    structure

-   quality and/or performance features of this infrastructure

-   mapping of software artifacts to elements of this infrastructure

For multiple environments or alternative deployments please copy and
adapt this section of arc42 for all relevant environments.

***\<Overview Diagram>***

Motivation

:   *\<explanation in text form>*

Quality and/or Performance Features

:   *\<explanation in text form>*

Mapping of Building Blocks to Infrastructure

:   *\<description of the mapping>*

## Infrastructure Level 2 {#_infrastructure_level_2}

Here you can include the internal structure of (some) infrastructure
elements from level 1.

Please copy the structure from level 1 for each selected element.

### *\<Infrastructure Element 1>* {#__emphasis_infrastructure_element_1_emphasis}

*\<diagram + explanation>*

### *\<Infrastructure Element 2>* {#__emphasis_infrastructure_element_2_emphasis}

*\<diagram + explanation>*

...

### *\<Infrastructure Element n>* {#__emphasis_infrastructure_element_n_emphasis}

*\<diagram + explanation>*

# Cross-cutting Concepts {#section-concepts}

::: formalpara-title
**Content**
:::

This section describes overall, principal regulations and solution ideas
that are relevant in multiple parts (= cross-cutting) of your system.
Such concepts are often related to multiple building blocks. They can
include many different topics, such as

-   models, especially domain models

-   architecture or design patterns

-   rules for using specific technology

-   principal, often technical decisions of an overarching (=
    cross-cutting) nature

-   implementation rules

::: formalpara-title
**Motivation**
:::

Concepts form the basis for *conceptual integrity* (consistency,
homogeneity) of the architecture. Thus, they are an important
contribution to achieve inner qualities of your system.

Some of these concepts cannot be assigned to individual building blocks,
e.g. security or safety.

::: formalpara-title
**Form**
:::

The form can be varied:

-   concept papers with any kind of structure

-   cross-cutting model excerpts or scenarios using notations of the
    architecture views

-   sample implementations, especially for technical concepts

-   reference to typical usage of standard frameworks (e.g. using
    Hibernate for object/relational mapping)

::: formalpara-title
**Structure**
:::

A potential (but not mandatory) structure for this section could be:

-   Domain concepts

-   User Experience concepts (UX)

-   Safety and security concepts

-   Architecture and design patterns

-   \"Under-the-hood\"

-   development concepts

-   operational concepts

Note: it might be difficult to assign individual concepts to one
specific topic on this list.

![Possible topics for crosscutting
concepts](images/08-concepts-EN.drawio.png)

See [Concepts](https://docs.arc42.org/section-8/) in the arc42
documentation.

## *\<Concept 1>* {#__emphasis_concept_1_emphasis}

*\<explanation>*

## *\<Concept 2>* {#__emphasis_concept_2_emphasis}

*\<explanation>*

...

## *\<Concept n>* {#__emphasis_concept_n_emphasis}

*\<explanation>*

# Architecture Decisions {#section-design-decisions}

::: formalpara-title
**Contents**
:::

Important, expensive, large scale or risky architecture decisions
including rationales. With \"decisions\" we mean selecting one
alternative based on given criteria.

Please use your judgement to decide whether an architectural decision
should be documented here in this central section or whether you better
document it locally (e.g. within the white box template of one building
block).

Avoid redundancy. Refer to section 4, where you already captured the
most important decisions of your architecture.

::: formalpara-title
**Motivation**
:::

Stakeholders of your system should be able to comprehend and retrace
your decisions.

::: formalpara-title
**Form**
:::

Various options:

-   ADR ([Documenting Architecture
    Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions))
    for every important decision

-   List or table, ordered by importance and consequences or:

-   more detailed in form of separate sections per decision

See [Architecture Decisions](https://docs.arc42.org/section-9/) in the
arc42 documentation. There you will find links and examples about ADR.

# Quality Requirements {#section-quality-scenarios}

::: formalpara-title
**Content**
:::

This section contains all quality requirements as quality tree with
scenarios. The most important ones have already been described in
section 1.2. (quality goals)

Here you can also capture quality requirements with lesser priority,
which will not create high risks when they are not fully achieved.

::: formalpara-title
**Motivation**
:::

Since quality requirements will have a lot of influence on architectural
decisions you should know for every stakeholder what is really important
to them, concrete and measurable.

See [Quality Requirements](https://docs.arc42.org/section-10/) in the
arc42 documentation.

## Quality Tree {#_quality_tree}

::: formalpara-title
**Content**
:::

The quality tree (as defined in ATAM -- Architecture Tradeoff Analysis
Method) with quality/evaluation scenarios as leafs.

::: formalpara-title
**Motivation**
:::

The tree structure with priorities provides an overview for a sometimes
large number of quality requirements.

::: formalpara-title
**Form**
:::

The quality tree is a high-level overview of the quality goals and
requirements:

-   tree-like refinement of the term \"quality\". Use \"quality\" or
    \"usefulness\" as a root

-   a mind map with quality categories as main branches

In any case the tree should include links to the scenarios of the
following section.

## Quality Scenarios {#_quality_scenarios}

::: formalpara-title
**Contents**
:::

Concretization of (sometimes vague or implicit) quality requirements
using (quality) scenarios.

These scenarios describe what should happen when a stimulus arrives at
the system.

For architects, two kinds of scenarios are important:

-   Usage scenarios (also called application scenarios or use case
    scenarios) describe the system's runtime reaction to a certain
    stimulus. This also includes scenarios that describe the system's
    efficiency or performance. Example: The system reacts to a user's
    request within one second.

-   Change scenarios describe a modification of the system or of its
    immediate environment. Example: Additional functionality is
    implemented or requirements for a quality attribute change.

::: formalpara-title
**Motivation**
:::

Scenarios make quality requirements concrete and allow to more easily
measure or decide whether they are fulfilled.

Especially when you want to assess your architecture using methods like
ATAM you need to describe your quality goals (from section 1.2) more
precisely down to a level of scenarios that can be discussed and
evaluated.

::: formalpara-title
**Form**
:::

Tabular or free form text.

# Risks and Technical Debts {#section-technical-risks}

::: formalpara-title
**Contents**
:::

A list of identified technical risks or technical debts, ordered by
priority

::: formalpara-title
**Motivation**
:::

"Risk management is project management for grown-ups" (Tim Lister,
Atlantic Systems Guild.)

This should be your motto for systematic detection and evaluation of
risks and technical debts in the architecture, which will be needed by
management stakeholders (e.g. project managers, product owners) as part
of the overall risk analysis and measurement planning.

::: formalpara-title
**Form**
:::

List of risks and/or technical debts, probably including suggested
measures to minimize, mitigate or avoid risks or reduce technical debts.

See [Risks and Technical Debt](https://docs.arc42.org/section-11/) in
the arc42 documentation.

# Glossary {#section-glossary}

::: formalpara-title
**Contents**
:::

The most important domain and technical terms that your stakeholders use
when discussing the system.

You can also see the glossary as source for translations if you work in
multi-language teams.

::: formalpara-title
**Motivation**
:::

You should clearly define your terms, so that all stakeholders

-   have an identical understanding of these terms

-   do not use synonyms and homonyms

A table with columns \<Term> and \<Definition>.

Potentially more columns in case you need translations.

See [Glossary](https://docs.arc42.org/section-12/) in the arc42
documentation.

+-----------------------+-----------------------------------------------+
| Term                  | Definition                                    |
+=======================+===============================================+
| *\<Term-1>*           | *\<definition-1>*                             |
+-----------------------+-----------------------------------------------+
| *\<Term-2>*           | *\<definition-2>*                             |
+-----------------------+-----------------------------------------------+
