---
title: Modul 4 - Troubleshooting Kubernetes Cluster
date: 2025-11-21
---

## 4.1. Troubleshooting Node

Node merupakan fondasi dari seluruh workload Kubernetes. Ketika node mengalami masalah, Pod dapat gagal dibuat, ter-evict, atau tidak bisa dijadwalkan.

### 4.1.1. Failed Node

Node berada dalam status `NotReady` jika kubelet tidak dapat berkomunikasi dengan API server.

Penyebab umum:

- kubelet mati
- container runtime mati
- network node gagal
- sertifikat kubelet expired
- disk penuh

Perintah pengecekan:

```bash
kubectl get nodes
kubectl describe node <node>
```

### 4.1.2. Disk Pressure / Memory Pressure

Kubernetes memiliki *Node Conditions*:

| Kondisi            | Arti                                      |
| ------------------ | ----------------------------------------- |
| MemoryPressure     | Node kehabisan memori                     |
| DiskPressure       | Node kehabisan disk/inode                 |
| PIDPressure        | Terlalu banyak proses                     |
| NetworkUnavailable | Node tidak memiliki konektivitas jaringan |

Jika salah satu bernilai `True`, kubelet dapat melakukan eviction.

### 4.1.3. Kubelet Issues

Masalah umum:

* gagal pull image
* tidak bisa kontak API server
* cgroup driver mismatch
* sertifikat kubelet invalid

Log kubelet:

```bash
journalctl -u kubelet -f
```

### 4.1.4. Container Runtime Issues

Masalah runtime mempengaruhi Pod langsung.

Masalah umum:

* runtime mati
* snapshotter corrupt
* image gagal ditarik

Log runtime:

```bash
journalctl -u containerd -f
```

atau CRI-O:

```bash
journalctl -u crio -f
```

---

## 4.2. Troubleshooting Cluster Components

### 4.2.1. ETCD

Masalah umum:

* disk penuh
* latency tinggi
* quorum hilang

Cek health:

```bash
ETCDCTL_API=3 etcdctl endpoint health
```

### 4.2.2. API Server

Masalah umum:

* timeout `kubectl`
* restart berulang
* sertifikat expired

Log API server:

```bash
kubectl logs -n kube-system kube-apiserver-<node>
```

### 4.2.3. Scheduler

Masalah:

* Pod stuck `Pending`
* affinity/taints menyebabkan gagal scheduling

Log:

```bash
kubectl logs -n kube-system kube-scheduler-<node>
```

### 4.2.4. Controller Manager

Masalah:

* HPA tidak bekerja
* Deployment tidak scale

Log:

```bash
kubectl logs -n kube-system kube-controller-manager-<node>
```
---

## 4.3. Logs & Output Streams

### 4.3.1. stdout & stderr Container

Container harus menulis log ke:

* `stdout`
* `stderr`

Lokasi log pada node:

```
/var/log/pods/
/var/log/containers/
```

### 4.3.2. Log Rotation

Log yang tak ter-rotate bisa menyebabkan DiskPressure.

Konfigurasi containerd:

```
/etc/containerd/config.toml
```

### 4.3.3. Containerd Shim Logs

Shim menangani lifecycle container.

Lokasi log:

```
/run/containerd/io.containerd.runtime.v2.task/k8s.io/<container>
```

---

## 4.4. Memahami Status Pod

### 4.4.1. Status Dasar Pod

| Status    | Arti                                      |
| --------- | ----------------------------------------- |
| Pending   | Pod belum dibuat atau image sedang dipull |
| Running   | Pod berjalan                              |
| Succeeded | Container exit code 0                     |
| Failed    | Exit code non-zero                        |
| Unknown   | Node tidak dapat dihubungi                |

### 4.4.2. Evicted

Pod dihapus karena:

* DiskPressure
* MemoryPressure
* inode habis

Cek alasan:

```bash
kubectl describe pod <pod>
```

Evicted Pod tidak bisa dijalankan ulang.

### 4.4.3. OOMKilled

Terjadi ketika aplikasi menggunakan memori melebihi limit.

Solusi:

* tingkatkan limit
* optimasi aplikasi

### 4.4.4. CrashLoopBackOff

Container crash berulang.

Penyebab:

* konfigurasi salah
* environment salah
* aplikasi exit non-zero

Debug:

```bash
kubectl logs <pod> --previous
```

### 4.4.5. ImagePullBackOff / ErrImagePull

Penyebab:

* image salah
* tidak ada akses registry

### 4.4.6. ContainerCreating

Stuck jika:

* CNI gagal
* CSI gagal
* runtime error
* ErrImagePull
* ImagePullBackOff

# Akhir Modul 4.

Modul ini membahas teknik troubleshooting Kubernetes pada level node, komponen control plane, container runtime, serta sistem logging. Selain itu, modul ini menjelaskan berbagai status Pod seperti *Evicted*, *OOMKilled*, *CrashLoopBackOff*, dan kondisi error umum yang sering ditemui dalam operasi cluster Kubernetes.