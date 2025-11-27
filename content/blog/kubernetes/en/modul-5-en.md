---
title: Module 5 - Cluster and Application Monitoring
date: 2025-11-21
---

## 5.1. Metrics and Telemetry

Kubernetes monitoring requires multiple data sources because the cluster consists of many components generating different metrics. This section explains the main metric sources in Kubernetes.

### 5.1.1. Metrics Server

Metrics Server is a lightweight component used by Kubernetes for:

- Horizontal Pod Autoscaler (HPA)
- Vertical Pod Autoscaler (VPA)
- `kubectl top` command

Metrics Server collects **CPU and memory** metrics from kubelet via `/stats/summary` API.

Characteristics:

- Data is not persistent
- Not a full monitoring solution
- Only for autoscaling and basic observability

### 5.1.2. Prometheus

Prometheus is the most common monitoring solution in Kubernetes.

Capabilities:

- Scrape metrics via HTTP endpoints (`/metrics`)
- Query using PromQL
- Time-series storage
- Alerting (Alertmanager)

Prometheus is usually installed via **Prometheus Operator**, which manages:

- Prometheus instances
- Alertmanager
- Grafana dashboards
- ServiceMonitor and PodMonitor

Prometheus stores persistent data, suitable for long-term observability.

### 5.1.3. Node Exporter

Node Exporter is used to expose OS-level metrics on every node.

Collected metrics:

- CPU usage
- Disk I/O
- Network throughput
- Filesystem usage
- Hardware metrics

Node Exporter works alongside Prometheus as a scrape target.

### 5.1.4. Kube-State-Metrics

Kube-State-Metrics is a service that exposes **Kubernetes object states**, not CPU/memory metrics.

Example metrics:

- number of ready Pods
- number of unstable Deployments
- Node conditions
- Volume conditions
- HPA, PVC, DS, RS, Job, CronJob information, etc.

In other words:

- Node Exporter → OS metrics
- Metrics Server → Realtime CPU/Memory
- Prometheus → time-series persistence
- Kube-State-Metrics → Kubernetes API state

---

## 5.2. Monitoring Resource Usage

Kubernetes provides several levels of observability:

### 5.2.1. CPU, Memory, Network

Basic monitoring includes:

- CPU usage per Pod, container, node
- memory usage (RSS, working set)
- Pod and node network bandwidth
- packet drops/network latency

Grafana is often used to display graphs of these resources.

### 5.2.2. Pod-Level Monitoring

Metrics to watch:

- CPU usage per Pod
- Memory usage per Pod
- Restarts
- Pod readiness and liveness
- Request latency (if having HTTP metrics)

Source: Metrics Server + Prometheus (cAdvisor metrics).

### 5.2.3. Container-Level Monitoring

Besides general usage metrics, CPU observation on containers must consider that Kubernetes uses **cgroups** to perform *CPU slicing*. This means CPU is not given as physical cores, but as processing time quotas (CPU time) sliced into periods. If a container has `resources.limits.cpu: 1`, it means it gets a full 1 vCPU quota, not a specific core, but 1000 millicores of CPU time every scheduler period.

Because CPU is given in time-slices (not dedicated cores), containers can experience **CPU throttling** when trying to use more CPU than the defined limit. Prometheus via cAdvisor provides metrics like `container_cpu_usage_seconds_total` and `container_cpu_cfs_throttled_seconds_total` to monitor this throttling phenomenon.

Important container-level metrics:

- CPU usage (time-slice based)
- CPU throttling (container held back by cgroup)
- Memory limit usage (RSS, working set)
- Container restarts
- Disk I/O usage (read/write bytes)
- Network usage (TX/RX bytes, drops, errors)

cAdvisor, running as part of kubelet, is the main source for container-level observability.

### 5.2.4. Node-Level Monitoring

At the node level, CPU also works using the **CFS (Completely Fair Scheduler)** mechanism which allocates CPU shares for all containers based on limits and Pod requests. If the total container limits on a node exceed the physical CPU capacity, Kubernetes still allows it (overcommit). Consequently, throttling can occur on many containers simultaneously.

Node Exporter provides node-level metrics for:

- total CPU usage
- CPU idle, user, system, iowait
- load average (process queue indicator)
- memory usage and pressure
- filesystem usage and inode usage
- kernel metrics (context switches, interrupts)
- systemd service health (kubelet, runtime, networking)

Node-level monitoring is important to see:

- if CPU request values are too high causing the scheduler to choose the wrong node
- if total limits are too large causing massive throttling
- if the bottleneck comes from disk I/O or network interface

Node Exporter + Prometheus gives a picture of physical node capacity, while cAdvisor gives granular observation per container. The combination of both provides complete insight between allocated *CPU slicing* on containers and *capacity usage* occurring on the physical node.

---

## 5.3. Visualization Tools

Monitoring visualization is crucial for debugging and capacity planning.

### 5.3.1. Grafana

Grafana is used for Prometheus dashboarding.

Uses:

- HPA Dashboard
- Node monitoring
- Pod/container usage
- Application latency
- Visual alerts

### 5.3.2. Lens / OpenLens

Lens provides a cluster GUI view:

- Node health
- Pod logs
- Resource usage
- Events

Does not replace monitoring, but is very helpful for daily observability.

---

# End of Module 5

This module explains the main monitoring components in Kubernetes, including Metrics Server, Prometheus, Node Exporter, and Kube-State-Metrics. This module also discusses CPU, memory, and network resource monitoring techniques at the Pod, container, and node levels, and introduces visualization tools like Grafana and Lens for operational monitoring.
