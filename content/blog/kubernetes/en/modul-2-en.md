---
title: Module 2 - Cluster Installation and Management with kubeadm
date: 2025-11-21
---

## 2.1. kubeadm Concepts
kubeadm is the official Kubernetes tool designed to bootstrap a cluster in a simple, consistent, and standard-compliant way.

### 2.1.1. Purpose of kubeadm
The focus of kubeadm is:
- Creating new control plane nodes.
- Generating Kubernetes components such as API server, scheduler, and controller-manager.
- Initializing kubelet and cluster configuration.
- Generating tokens and certificates required for node join.

kubeadm is **not** a Kubernetes distribution, but a minimal framework for building a cluster.

### 2.1.2. When to Use kubeadm vs Managed Kubernetes

**Use kubeadm when:**
- Managing on-prem clusters manually.
- Needing full control over control plane configuration.
- Environment requires specific hardware or OS combinations.
- Learning Kubernetes architecture in depth.

**Use Managed Kubernetes (GKE, RANCHER, AKS, EKS) when:**
- Wanting full automation of the control plane.
- Wanting high SLA without maintaining etcd and API server.
- Small teams wanting to focus on applications, not the cluster.
- Needing cloud-native features like node pool autoscaling.

kubeadm gives high flexibility but requires mature operational skills.

### 2.1.3. Cluster Bootstrap Architecture

When running `kubeadm init`, the following process occurs:
1. kubeadm validates the environment (CPU, kernel, cgroups, firewall).
2. Creates cluster configuration file (kubeadm-config).
3. Initializes directory `/etc/kubernetes/`.
4. Generates certificates for API server, kubelet, controller-manager, and scheduler.
5. Initializes etcd (stacked mode).
6. Runs API server, scheduler, and controller-manager via static Pods.
7. Generates kubeconfig for admin and kubelet.
8. Generates token for worker node join.

In other words, kubeadm sets up a **complete minimal control plane** ready to accept worker nodes.

---

## 2.2. Creating a Cluster with kubeadm

### 2.2.1. Generate config

Use kubeadm to create a configuration template:

```bash
kubeadm config print init-defaults > kubeadm-config.yaml
```

Example Pod network CIDR setting:

```yaml
networking:
  podSubnet: "10.244.0.0/16"
```

### 2.2.2. Running `kubeadm init`

Initialize control plane:

```bash
sudo kubeadm init --config kubeadm-config.yaml
```

After completion:

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

Then install CNI (e.g., Calico or Flannel).


### 2.2.3. Join Control Plane Node

To add a new control plane node:

```bash
kubeadm join <LOAD_BALANCER_DNS>:6443 --token <token> \
  --discovery-token-ca-cert-hash sha256:<hash> \
  --control-plane
```

The new node will:

* Pull cluster configuration
* Get control plane certificates
* Run APIServer, scheduler, and controller-manager components as static Pods


### 2.2.4. Join Worker Node

Worker nodes simply run:

```bash
kubeadm join <LOAD_BALANCER_DNS>:6443 --token <token> \
  --discovery-token-ca-cert-hash sha256:<hash>
```

Worker nodes only run:

* kubelet
* kube-proxy
* Application Pods according to scheduler instructions

---

## 2.3. Managing the Cluster

### 2.3.1. Upgrade Control Plane

kubeadm provides a safe and staged upgrade mechanism:

```bash
sudo apt-get install -y --allow-change-held-packages kubeadm=<version>
sudo kubeadm upgrade apply <version>
sudo apt-get install -y --allow-change-held-packages kubelet=<version>
sudo systemctl restart kubelet
```

Upgrade is done one control plane node at a time.


### 2.3.2. Upgrade Worker Nodes

Upgrading worker nodes is simpler:

```bash
sudo apt-get install kubeadm=<version>
sudo kubeadm upgrade node
sudo apt-get install kubelet=<version>
sudo systemctl restart kubelet
```


### 2.3.3. Backup & Restore: ETCD Snapshot

Backup etcd:

```bash
ETCDCTL_API=3 etcdctl snapshot save snapshot.db
```

Restore snapshot (stacked etcd):

```bash
ETCDCTL_API=3 etcdctl snapshot restore snapshot.db --data-dir /var/lib/etcd
```

Note: etcd is the *most critical* component in the cluster.


### 2.3.4. Node Maintenance (cordon, drain, uncordon)

**Cordon** – mark node so it doesn't accept new Pods:

```bash
kubectl cordon node1
```

**Drain** – move Pods from node for maintenance:

```bash
kubectl drain node1 --ignore-daemonsets --delete-emptydir-data
```

**Uncordon** – return node to schedulable state:

```bash
kubectl uncordon node1
```

---

## 2.4. Implementing Highly Available Control Plane

### 2.4.1. External Load Balancer

For HA control plane, load must be balanced to multiple API servers:

* Can use **HAProxy**, **Nginx**, or **Keepalived** (Virtual IP).
* All control planes run on port 6443.

Example HAProxy configuration:

```
frontend apiserver
  bind *:6443
  mode tcp
  default_backend apiserver_nodes

backend apiserver_nodes
  mode tcp
  balance roundrobin
  server cp1 10.0.0.11:6443 check
  server cp2 10.0.0.12:6443 check
  server cp3 10.0.0.13:6443 check
```

### 2.4.2. Stacked vs External etcd

**Stacked etcd (kubeadm default)**

* etcd resides on the control plane node
* Simpler, easier to setup
* Suitable for small–medium clusters

**External etcd**

* etcd is separated from the control plane
* Better availability and performance
* Used for large clusters or critical production

### 2.4.3. HA Topology Best Practices

* Minimum 3 control plane nodes
* If using stacked etcd, node count must be odd
* Use load balancer with active health check
* Separate planes physically (different rack or zone)
* Ensure time sync (NTP) runs well
* Use CNI that supports HA clusters (e.g., Calico, Cilium)

---

# End of Module 2

This module discusses basic kubeadm concepts, the process of building a Kubernetes cluster from scratch, and cluster lifecycle management including upgrades, backups, and high availability implementation.
