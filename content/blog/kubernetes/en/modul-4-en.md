---
title: Module 4 - Troubleshooting Kubernetes Cluster
date: 2025-11-21
---

## 4.1. Troubleshooting Node

Nodes are the foundation of all Kubernetes workloads. When a node has issues, Pods may fail to be created, get evicted, or cannot be scheduled.

### 4.1.1. Failed Node

A node is in `NotReady` status if the kubelet cannot communicate with the API server.

Common causes:

- kubelet is dead
- container runtime is dead
- node network failed
- kubelet certificate expired
- disk full

Check commands:

```bash
kubectl get nodes
kubectl describe node <node>
```

### 4.1.2. Disk Pressure / Memory Pressure

Kubernetes has *Node Conditions*:

| Condition          | Meaning                                   |
| ------------------ | ----------------------------------------- |
| MemoryPressure     | Node is running out of memory             |
| DiskPressure       | Node is running out of disk/inodes        |
| PIDPressure        | Too many processes                        |
| NetworkUnavailable | Node has no network connectivity          |

If one of them is `True`, kubelet may perform eviction.

### 4.1.3. Kubelet Issues

Common issues:

* failed to pull image
* cannot contact API server
* cgroup driver mismatch
* invalid kubelet certificate

Kubelet logs:

```bash
journalctl -u kubelet -f
```

### 4.1.4. Container Runtime Issues

Runtime issues affect Pods directly.

Common issues:

* runtime dead
* snapshotter corrupt
* image failed to pull

Runtime logs:

```bash
journalctl -u containerd -f
```

or CRI-O:

```bash
journalctl -u crio -f
```

---

## 4.2. Troubleshooting Cluster Components

### 4.2.1. ETCD

Common issues:

* disk full
* high latency
* lost quorum

Check health:

```bash
ETCDCTL_API=3 etcdctl endpoint health
```

### 4.2.2. API Server

Common issues:

* `kubectl` timeout
* repeated restarts
* expired certificate

API server logs:

```bash
kubectl logs -n kube-system kube-apiserver-<node>
```

### 4.2.3. Scheduler

Issues:

* Pod stuck `Pending`
* affinity/taints causing scheduling failure

Logs:

```bash
kubectl logs -n kube-system kube-scheduler-<node>
```

### 4.2.4. Controller Manager

Issues:

* HPA not working
* Deployment not scaling

Logs:

```bash
kubectl logs -n kube-system kube-controller-manager-<node>
```
---

## 4.3. Logs & Output Streams

### 4.3.1. stdout & stderr Container

Containers must write logs to:

* `stdout`
* `stderr`

Log location on node:

```
/var/log/pods/
/var/log/containers/
```

### 4.3.2. Log Rotation

Unrotated logs can cause DiskPressure.

Containerd configuration:

```
/etc/containerd/config.toml
```

### 4.3.3. Containerd Shim Logs

Shim handles container lifecycle.

Log location:

```
/run/containerd/io.containerd.runtime.v2.task/k8s.io/<container>
```

---

## 4.4. Understanding Pod Status

### 4.4.1. Basic Pod Status

| Status    | Meaning                                   |
| --------- | ----------------------------------------- |
| Pending   | Pod not created yet or image being pulled |
| Running   | Pod is running                            |
| Succeeded | Container exit code 0                     |
| Failed    | Exit code non-zero                        |
| Unknown   | Node cannot be contacted                  |

### 4.4.2. Evicted

Pod deleted because of:

* DiskPressure
* MemoryPressure
* inodes exhausted

Check reason:

```bash
kubectl describe pod <pod>
```

Evicted Pods cannot be restarted.

### 4.4.3. OOMKilled

Occurs when application uses memory exceeding the limit.

Solution:

* increase limit
* optimize application

### 4.4.4. CrashLoopBackOff

Container crashes repeatedly.

Causes:

* wrong configuration
* wrong environment
* application exits non-zero

Debug:

```bash
kubectl logs <pod> --previous
```

### 4.4.5. ImagePullBackOff / ErrImagePull

Causes:

* wrong image
* no registry access

### 4.4.6. ContainerCreating

Stuck if:

* CNI failed
* CSI failed
* runtime error
* ErrImagePull
* ImagePullBackOff

# End of Module 4

This module discusses Kubernetes troubleshooting techniques at the node level, control plane components, container runtime, and logging systems. Additionally, this module explains various Pod statuses such as *Evicted*, *OOMKilled*, *CrashLoopBackOff*, and common error conditions often encountered in Kubernetes cluster operations.
