---
title: Module 6 - Application Deployment and Configuration
date: 2025-11-21
---

## 6.1. Application Deployment

### 6.1.1. Concepts of Pod, ReplicaSet, and Deployment

**Pod**
A Pod is the smallest execution unit in Kubernetes. A Pod contains one or more containers running together and sharing a network namespace. Pods are *ephemeral* and can be terminated at any time by the kubelet or scheduler.

**ReplicaSet**
ReplicaSet is responsible for maintaining the number of Pods according to the configuration. If a Pod dies, the ReplicaSet will create a new Pod to replace it.

**Deployment**
Deployment provides *lifecycle management* mechanisms for stateless applications. Deployment creates and manages ReplicaSets and provides:

- Rolling update (update without downtime)
- Rollback (return to previous version)
- Versioning via ReplicaSet
- Update strategy (RollingUpdate / Recreate)

Deployment is used for **stateless** applications like web APIs, frontends, worker services, etc.


### 6.1.2. Deployment Strategies

Deployment supports two main strategies:

1. **RollingUpdate** (default)
   New version Pods are created gradually while deleting old Pods. Suitable for zero-downtime deployment.

2. **Recreate**
   Deletes all old Pods first then creates new Pods. Suitable for applications that cannot run two versions at the same time.

Example RollingUpdate strategy configuration:

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
```

### 6.1.3. Rolling Updates

To view rolling update status:

```bash
kubectl rollout status deployment/myapp
```

Rolling updates allow application updates without downtime, by keeping a minimum number of Pods available during the process.

### 6.1.4. Rollbacks

Rollback is used when a new version causes errors or performance issues. Kubernetes keeps ReplicaSet history to support quick rollbacks.

```bash
kubectl rollout undo deployment/myapp
kubectl rollout history deployment/myapp
```

### 6.1.5. DaemonSet

DaemonSet ensures one Pod runs on **every node** of the cluster, or specific nodes via selector. New Pods are automatically created when new nodes are added.

DaemonSet use cases:

* Logging agent (Fluentd, Vector, Filebeat)
* Monitoring agent (Node Exporter)
* Security agent (Falco)

DaemonSet is suitable when an application must always exist on every node.

### 6.1.6. StatefulSet

StatefulSet is used for **stateful** applications requiring:

* Consistent Pod identity (`pod-0`, `pod-1`)
* Persistent storage attached per Pod
* Ordered startup/shutdown

Use cases:

* Databases (Cassandra, MongoDB, CockroachDB)
* Message queues (Kafka, RabbitMQ)
* Distributed stateful systems

StatefulSet provides stability properties that Deployment does not have.

### 6.1.7. Job

Job runs a Pod **once until completion** (exit code 0). If the Pod fails, the Job will restart it.

Use cases:

* Database migration
* Batch report
* ETL processing
* One-time script execution

### 6.1.8. CronJob

CronJob runs Jobs based on a cron schedule.

Use cases:

* Routine backup
* Weekly log cleanup
* Cache refresh

CronJob provides an automatic scheduling mechanism for batch workloads.

---

## 6.2. ConfigMaps & Secrets

Kubernetes separates configuration from container images via ConfigMaps and Secrets.

### 6.2.1. ConfigMaps

Used for:

* Environment variables
* Configuration files
* Command arguments

Mount as file or environment variable:

```yaml
envFrom:
  - configMapRef:
      name: app-config
```

### 6.2.2. Secrets

Used for sensitive information:

* API keys
* Database passwords
* TLS certificates

Mount as file or environment variable.

### 6.2.3. Best Practices

* Use *encryption at rest* (KMS / envelope encryption)
* Do not commit Secrets to Git
* Use RBAC to limit access
* Use `SecretProviderClass` for external integration (Vault, AWS Secrets Manager)

---

## 6.3. Autoscaling

Autoscaling allows applications to adjust resources to workload.

### 6.3.1. Horizontal Pod Autoscaler (HPA)

Increases/decreases the number of Pods based on:

* CPU usage
* Memory usage
* Custom metrics (metrics-server / Prometheus Adapter)

Example:

```bash
kubectl autoscale deployment myapp --cpu-percent=70 --min=2 --max=10
```

### 6.3.2. Vertical Pod Autoscaler (VPA)

Adjusts application **resource limits** automatically. Suitable for:

* workloads with unstable resource consumption
* machine learning or data processing applications

VPA has three modes:

* Off
* Recommend
* Auto

### 6.3.3. Cluster Autoscaler (Bonus)

Creates node pool autoscale based on cluster capacity. Works in cloud:

* GKE
* EKS
* AKS

Cluster Autoscaler adds nodes when Pods cannot be placed, and removes idle nodes to save costs.

## 6.4. Primitives for Self-Healing

Self-healing is a core Kubernetes principle, ensuring applications keep running even if failures occur.

### 6.4.1. Liveness Probe

Checks if the application is still alive. If it fails, the container will be restarted.

Example:

```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
```

### 6.4.2. Readiness Probe

Checks if the application is ready to accept traffic. If it fails, the Pod is removed from Service endpoints.

### 6.4.3. Startup Probe

Used for slow-starting applications. Startup probe prevents liveness probe from killing the application too early.


### 6.4.4. Resource Requests & Limits

* `requests` → value for scheduler to choose node
* `limits` → maximum CPU/memory limit

Resource limits prevent:

* Out-of-memory (OOMKilled)
* CPU starvation and severe throttling

---

# End of Module 6

This module explains various Kubernetes resources like Deployment, ReplicaSet, DaemonSet, StatefulSet, Job, and CronJob, and their functions in running various types of applications. This module also discusses rolling update strategies, rollbacks, application configuration using ConfigMaps and Secrets, autoscaling mechanisms (HPA, VPA), and primitives enabling application self-healing like probes and resource limits.
