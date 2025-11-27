---
title: Module 0 - Introduction and Foundation
date: 2025-11-21
---

## 0.1. Why Kubernetes?

Kubernetes emerged as an evolution of the industry's need to manage large-scale applications automatically, stably, and efficiently. Before Kubernetes became popular, the application deployment process went through several phases:

### Application Deployment Evolution
1. **Bare Metal (Physical Servers)**
   - No isolation between applications
   - Slow provisioning
   - Scaling requires new hardware

2. **Virtual Machines (VM)**
   - Better isolation, but still heavy
   - High resource consumption
   - Deployment is still slow and complex

3. **Containers**
   - Lightweight and fast
   - Consistent across environments
   - Suitable for modern CI/CD models

4. **Container Orchestration**
   - Needed to manage hundreds of containers
   - Provides automatic scaling, recovery, networking
   - Kubernetes became the de facto standard

### Modern Needs Driving Kubernetes
- Automatic scalability
- High availability
- Centralized observability and logging
- Automatic and declarative deployment
- Cloud and on-prem portability
- Extensive and sustainable ecosystem

### Disadvantages of Manual Deployment (Without Orchestrator)
- Scaling must be done manually
- No auto-healing
- Load balancing is difficult to manage
- Configuration is hard to replicate
- Recovery requires human intervention
- No built-in health check mechanism

### Reasons Kubernetes Became the Industry Standard
- Supported by CNCF and global community
- Used by major tech companies
- Consistent across platforms
- Declarative and automatic
- Extensible through CRDs and operators
- Stable and continuously evolving

---

## 0.2. Use Cases Suitable for Kubernetes

Kubernetes is not for every condition. It works very well in the following scenarios:

### Ideal Workloads for Kubernetes
- Medium to large scale microservices
- Systems requiring dynamic autoscaling
- Applications with fast lifecycles (intensive CI/CD)
- Multi-tenant platforms
- Event-driven workloads

---

## 0.3. When Not to Use Kubernetes

Many organizations misuse Kubernetes when their needs are actually not that complex.

### Conditions Where Kubernetes Is Not Recommended
- Simple workloads (1–3 services)
- Small teams without experienced DevOps/SRE
- Limited hardware or cloud budget
- Monolithic applications that are rarely changed
- Very strict real-time latency requirements
- Air-gapped environments without expert support
- Heavy stateful workloads without horizontal scaling needs

---

## 0.4. Basic Concepts of Container and Orchestration

### What Is a Container?

A container is a lightweight execution unit isolated through *namespaces* and *cgroups*. Containers allow applications to run consistently across various environments because each container carries its own filesystem, dependencies, and configuration without disturbing the host system.

### What Are cgroups?

**cgroups (control groups)** are a feature in the Linux kernel used to control and manage resource usage by processes or groups of processes. The main functions of cgroups include:

- Limiting resource usage (CPU, memory, I/O)
- Measuring resource usage per process or per group
- Setting process priorities
- Isolating resources between containers
- Preventing one container from exhausting all node resources

cgroups are used by container runtimes like **containerd** and **CRI-O** to ensure each container only uses resources according to the limits defined in the Kubernetes Pod configuration.

With the help of cgroups, Kubernetes can apply *resource requests* and *limits* effectively so that workloads run more stably and fairly within the cluster.

### What Is an Image?
An image is a blueprint of a container that is immutable. An image contains the filesystem and runtime configuration.

### Container Runtime vs Container Engine

| Component          | Function |
|--------------------|-------------------------------------------------------------|
| Container Runtime  | Runs containers (e.g., containerd, CRI-O)                 |
| Container Engine   | Manages images and provides CLI (e.g., Docker CLI)          |


Kubernetes uses runtimes compatible with CRI (Container Runtime Interface).

### What Is Orchestration?
Orchestration is the automation of container management:
- Scheduling containers to nodes
- Scaling
- Automatic recovery
- Networking
- Load balancing
- Health checks

### Reconciliation Loop
Main concept of Kubernetes:
"Kubernetes always tries to reconcile the actual state with the declared state."

If a user declares that 5 Pods must be running but only 2 are active, Kubernetes will create 3 additional Pods.

### Control Plane vs Data Plane

The Kubernetes architecture is divided into two large layers: **Control Plane** and **Data Plane**. Both have different responsibilities but complement each other to keep cluster operations stable, consistent, and automated.


### Control Plane

The Control Plane is the components responsible for **controlling the entire cluster**. It stores the cluster state, makes scheduling decisions, manages object lifecycles, and ensures that the actual condition of the cluster always matches the condition declared by the user.

Main components of the Control Plane:

#### 1. kube-apiserver
- Central component and main entry point to the entire cluster.
- Provides REST API used by `kubectl`, dashboard, scheduler, controllers, and all other Kubernetes components.
- Handles authentication, authorization, admission control, and object validation.
- Runs in stateless mode, so it can be replicated for high availability.

#### 2. etcd
- Key-value database that stores Kubernetes *state* consistently.
- Stores all declarative objects like Pods, Deployments, Services, Nodes, ConfigMaps, etc.
- *Distributed and consistent*, using the **Raft** algorithm.
- Is the most critical component; damage to etcd = cluster cannot work.

#### 3. kube-scheduler
- Tasked with determining which node will run a Pod.
- Makes decisions based on:
  - resource availability (CPU, memory)
  - affinity/anti-affinity
  - taints/tolerations
  - topology spread constraints
  - custom scheduler extension
- Scheduler only determines *placement*, not running the Pod.

#### 4. kube-controller-manager
- Manages all *controller loops* in Kubernetes.
- Each controller monitors the desired state and actual state, then makes changes to reconcile the two.
- Types of controllers running inside it:
  - Node controller
  - Deployment controller
  - ReplicaSet controller
  - Job controller
  - Endpoints controller
  - ServiceAccount controller
- Represents the core of the Kubernetes **reconciliation loop** mechanism.


### Data Plane

The Data Plane is the part of the cluster that **runs applications**. Nodes running container workloads are in this layer. The Data Plane is responsible for executing instructions determined by the Control Plane.

Components of the Data Plane:

#### 1. kubelet
- Agent running on every node.
- Tasked with running Pods based on instructions from kube-apiserver.
- Ensures containers keep running according to PodSpec configuration.
- Reports node status and container status to the Control Plane.
- Manages container lifecycle through Container Runtime Interface (CRI).

#### 2. Container Runtime
- Software that runs and manages containers on the node.
- Operates under kubelet instructions.
- Example runtimes:
  - containerd (most common)
  - CRI-O
- Responsible for:
  - running containers
  - stopping containers
  - managing images, sandboxes, and filesystems
  - interacting with kernel cgroups and namespaces

#### 3. kube-proxy
- Manages routing and forwarding traffic between Services and Pods.
- Programs IPTables or IPVS to build internal load balancing.
- Ensures connectivity between Pods within the cluster as well as with external Services.

#### 4. Pods and Containers
- The actual application execution units.
- A Pod contains one or more containers sharing:
  - network namespace
  - IPC
  - volumes
- Containers inside a Pod are processes running the application or business service.

---

# End of Module 0

This module provides the conceptual foundation to understand the motivation, context, and basics of Kubernetes before entering cluster installation and operation in the following modules.
