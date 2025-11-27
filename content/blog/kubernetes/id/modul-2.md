---
title: Modul 2 - Instalasi dan Manajemen Cluster dengan kubeadm
date: 2025-11-21
---

## 2.1. Konsep kubeadm
kubeadm adalah tool resmi Kubernetes yang dirancang untuk melakukan bootstrap cluster dengan cara yang sederhana, konsisten, dan sesuai standar.

### 2.1.1. Tujuan kubeadm
Fokus kubeadm adalah:
- Membuat control plane node baru.
- Menghasilkan komponen-komponen Kubernetes seperti API server, scheduler, dan controller-manager.
- Menginisialisasi kubelet dan konfigurasi cluster.
- Menghasilkan token dan sertifikat yang diperlukan untuk node join.

kubeadm **bukan** distribution Kubernetes, melainkan kerangka minimal untuk membangun cluster.

### 2.1.2. Kapan Menggunakan kubeadm vs Managed Kubernetes

**Gunakan kubeadm ketika:**
- Mengelola cluster on-prem secara manual.
- Butuh kontrol penuh atas konfigurasi control plane.
- Lingkungan membutuhkan kombinasi hardware atau OS spesifik.
- Mempelajari arsitektur Kubernetes secara mendalam.

**Gunakan Managed Kubernetes (GKE, RANCHER, AKS, EKS) ketika:**
- Menginginkan otomatisasi penuh terhadap control plane.
- Menginginkan SLA tinggi tanpa harus memelihara etcd dan API server.
- Tim kecil yang ingin fokus pada aplikasi, bukan cluster.
- Memerlukan fitur cloud-native seperti autoscaling node pool.

kubeadm memberi fleksibilitas tinggi, tetapi membutuhkan keterampilan operasional yang matang.

### 2.1.3. Arsitektur Bootstrap Cluster

Ketika menjalankan `kubeadm init`, proses berikut terjadi:
1. kubeadm memvalidasi lingkungan (CPU, kernel, cgroups, firewall).
2. Membuat file konfigurasi cluster (kubeadm-config).
3. Menginisialisasi directory `/etc/kubernetes/`.
4. Menghasilkan sertifikat untuk API server, kubelet, controller-manager, dan scheduler.
5. Menginisialisasi etcd (stacked mode).
6. Menjalankan API server, scheduler, dan controller-manager via static Pod.
7. Menghasilkan kubeconfig untuk admin dan kubelet.
8. Menghasilkan token untuk worker node join.

Dengan kata lain, kubeadm men-setup **control plane minimal lengkap** yang siap menerima worker nodes.

---

## 2.2. Membuat Cluster dengan kubeadm

### 2.2.1. Generate config

Gunakan kubeadm untuk membuat template konfigurasi:

```bash
kubeadm config print init-defaults > kubeadm-config.yaml
```

Contoh pengaturan CIDR jaringan Pod:

```yaml
networking:
  podSubnet: "10.244.0.0/16"
```

### 2.2.2. Menjalankan `kubeadm init`

Inisialisasi control plane:

```bash
sudo kubeadm init --config kubeadm-config.yaml
```

Setelah selesai:

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

Lalu instal CNI (misal Calico atau Flannel).


### 2.2.3. Join Control Plane Node

Untuk menambahkan node control plane baru:

```bash
kubeadm join <LOAD_BALANCER_DNS>:6443 --token <token> \
  --discovery-token-ca-cert-hash sha256:<hash> \
  --control-plane
```

Node baru akan:

* Menarik konfigurasi cluster
* Mendapat sertifikat control plane
* Menjalankan komponen APIServer, scheduler, dan controller-manager sebagai static Pod


### 2.2.4. Join Worker Node

Worker node cukup menjalankan:

```bash
kubeadm join <LOAD_BALANCER_DNS>:6443 --token <token> \
  --discovery-token-ca-cert-hash sha256:<hash>
```

Worker node hanya menjalankan:

* kubelet
* kube-proxy
* Pod aplikasi sesuai instruksi scheduler

---

## 2.3. Mengelola Cluster

### 2.3.1. Upgrade Control Plane

kubeadm menyediakan mekanisme upgrade yang aman dan berjenjang:

```bash
sudo apt-get install -y --allow-change-held-packages kubeadm=<version>
sudo kubeadm upgrade apply <version>
sudo apt-get install -y --allow-change-held-packages kubelet=<version>
sudo systemctl restart kubelet
```

Upgrade dilakukan satu control plane node pada satu waktu.


### 2.3.2. Upgrade Worker Nodes

Upgrade worker nodes lebih sederhana:

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

Catatan: etcd adalah komponen *paling kritikal* dalam cluster.


### 2.3.4. Node Maintenance (cordon, drain, uncordon)

**Cordon** – menandai node supaya tidak menerima Pod baru:

```bash
kubectl cordon node1
```

**Drain** – memindahkan Pod dari node untuk perbaikan:

```bash
kubectl drain node1 --ignore-daemonsets --delete-emptydir-data
```

**Uncordon** – mengembalikan node jadi schedulable:

```bash
kubectl uncordon node1
```

---

## 2.4. Implementasi Highly Available Control Plane

### 2.4.1. External Load Balancer

Untuk HA control plane, beban harus diseimbangkan ke beberapa API server:

* Bisa menggunakan **HAProxy**, **Nginx**, atau **Keepalived** (Virtual IP).
* Semua control plane berjalan pada port 6443.

Contoh konfigurasi HAProxy:

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

**Stacked etcd (default kubeadm)**

* etcd berada pada node control plane
* Simpler, lebih mudah di-setup
* Cocok untuk cluster kecil–menengah

**External etcd**

* etcd dipisahkan dari control plane
* Ketersediaan dan performa lebih baik
* Digunakan untuk cluster besar atau produksi kritikal

### 2.4.3. HA Topology Best Practices

* Minimal 3 control plane node
* Jika menggunakan stacked etcd, jumlah node harus ganjil
* Gunakan load balancer dengan health check aktif
* Pisahkan plane secara fisik (rack atau zone berbeda)
* Pastikan time sync (NTP) berjalan baik
* Gunakan CNI yang mendukung HA cluster (mis. Calico, Cilium)

---

# Akhir Modul 2.

Modul ini membahas konsep dasar kubeadm, proses membangun cluster Kubernetes dari nol, serta pengelolaan lifecycle cluster termasuk upgrade, backup, dan penerapan high availability.