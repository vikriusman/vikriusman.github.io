---
title: Modul 6 - Deployment dan Konfigurasi Aplikasi
date: 2025-11-21
---

## 6.1. Application Deployment

### 6.1.1. Konsep Pod, ReplicaSet, dan Deployment

**Pod**  
Pod adalah unit eksekusi terkecil dalam Kubernetes. Pod berisi satu atau lebih container yang berjalan bersama dan berbagi network namespace. Pod bersifat *ephemeral* dan dapat dihentikan kapan saja oleh kubelet atau scheduler.

**ReplicaSet**  
ReplicaSet bertugas menjaga jumlah Pod tetap sesuai konfigurasi. Jika sebuah Pod mati, ReplicaSet akan membuat Pod baru untuk menggantikannya.

**Deployment**  
Deployment menyediakan mekanisme *lifecycle management* untuk aplikasi stateless. Deployment membuat dan mengelola ReplicaSet serta menyediakan:

- Rolling update (update tanpa downtime)
- Rollback (kembali ke versi sebelumnya)
- Versioning melalui ReplicaSet
- Strategi update (RollingUpdate / Recreate)

Deployment digunakan untuk aplikasi **stateless** seperti web API, frontend, worker service, dsb.


### 6.1.2. Strategi Deployment

Deployment mendukung dua strategi utama:

1. **RollingUpdate** (default)  
   Pod versi baru dibuat bertahap sambil menghapus Pod lama. Cocok untuk zero-downtime deployment.

2. **Recreate**  
   Menghapus semua Pod lama terlebih dahulu lalu membuat Pod baru. Cocok untuk aplikasi yang tidak boleh menjalankan dua versi pada waktu bersamaan.

Contoh konfigurasi strategi RollingUpdate:

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
```

### 6.1.3. Rolling Updates

Untuk melihat status rolling update:

```bash
kubectl rollout status deployment/myapp
```

Rolling update memungkinkan pembaruan aplikasi tanpa downtime, dengan menjaga jumlah minimal Pod tetap tersedia selama proses.

### 6.1.4. Rollbacks

Rollback digunakan ketika versi baru menyebabkan error atau masalah performa. Kubernetes menyimpan riwayat ReplicaSet untuk mendukung rollback cepat.

```bash
kubectl rollout undo deployment/myapp
kubectl rollout history deployment/myapp
```

### 6.1.5. DaemonSet

DaemonSet memastikan satu Pod berjalan pada **setiap node** cluster, atau node tertentu melalui selector. Pod baru otomatis dibuat ketika node baru ditambahkan.

Use case DaemonSet:

* Logging agent (Fluentd, Vector, Filebeat)
* Monitoring agent (Node Exporter)
* Security agent (Falco)

DaemonSet cocok saat aplikasi harus selalu ada di setiap node.

### 6.1.6. StatefulSet

StatefulSet digunakan untuk aplikasi **stateful** yang membutuhkan:

* Identitas Pod yang konsisten (`pod-0`, `pod-1`)
* Storage persisten yang melekat sesuai Pod
* Urutan startup/shutdown yang teratur

Use case:

* Database (Cassandra, MongoDB, CockroachDB)
* Message queue (Kafka, RabbitMQ)
* Sistem distributed stateful

StatefulSet memberikan properti stabilitas yang tidak dimiliki Deployment.

### 6.1.7. Job

Job menjalankan Pod **sekali hingga selesai** (exit code 0). Jika Pod gagal, Job akan menjalankannya kembali.

Use case:

* Migrasi database
* Batch report
* ETL processing
* One-time script execution

### 6.1.8. CronJob

CronJob menjalankan Job berdasarkan jadwal cron.

Use case:

* Backup rutin
* Log cleanup mingguan
* Refresh cache

CronJob memberi mekanisme penjadwalan otomatis untuk workload batch.

---

## 6.2. ConfigMaps & Secrets

Kubernetes memisahkan konfigurasi dari container image melalui ConfigMaps dan Secrets.

### 6.2.1. ConfigMaps

Digunakan untuk:

* Environment variables
* File konfigurasi
* Command argument

Mount sebagai file atau environment variable:

```yaml
envFrom:
  - configMapRef:
      name: app-config
```

### 6.2.2. Secrets

Digunakan untuk informasi sensitif:

* API keys
* Database password
* TLS certificates

Mount sebagai file atau environment variable.

### 6.2.3. Best Practices

* Gunakan *encryption at rest* (KMS / envelope encryption)
* Jangan commit Secret ke Git
* Gunakan RBAC untuk membatasi akses
* Gunakan `SecretProviderClass` untuk integrasi eksternal (Vault, AWS Secrets Manager)

---

## 6.3. Autoscaling

Autoscaling memungkinkan aplikasi menyesuaikan resource terhadap beban kerja.

### 6.3.1. Horizontal Pod Autoscaler (HPA)

Menambah/menurunkan jumlah Pod berdasarkan:

* CPU usage
* Memory usage
* Custom metrics (metrics-server / Prometheus Adapter)

Contoh:

```bash
kubectl autoscale deployment myapp --cpu-percent=70 --min=2 --max=10
```

### 6.3.2. Vertical Pod Autoscaler (VPA)

Mengatur **resource limits** aplikasi secara otomatis. Cocok untuk:

* workload yang konsumsi resourcenya tidak stabil
* aplikasi machine learning atau data processing

VPA memiliki tiga mode:

* Off
* Recommend
* Auto

### 6.3.3. Cluster Autoscaler (Bonus)

Membuat node pool autoscale berdasarkan kapasitas cluster. Berfungsi di cloud:

* GKE
* EKS
* AKS

Cluster Autoscaler menambah node saat Pod tidak mendapat tempat, dan menghapus node idle untuk menghemat biaya.

## 6.4. Primitives untuk Self-Healing

Self-healing adalah prinsip inti Kubernetes, memastikan aplikasi tetap berjalan walaupun terjadi kegagalan.

### 6.4.1. Liveness Probe

Memeriksa apakah aplikasi masih hidup. Jika gagal, container akan direstart.

Contoh:

```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
```

### 6.4.2. Readiness Probe

Memeriksa apakah aplikasi sudah siap menerima traffic. Jika gagal, Pod dikeluarkan dari Service endpoint.

### 6.4.3. Startup Probe

Digunakan untuk aplikasi yang lambat startup. Startup probe mencegah liveness probe membunuh aplikasi terlalu cepat.


### 6.4.4. Resource Requests & Limits

* `requests` → nilai untuk scheduler memilih node
* `limits` → batas maksimum CPU/memori

Resource limit mencegah:

* Out-of-memory (OOMKilled)
* CPU starvation dan throttling parah

---

# Akhir Modul 6.

Modul ini menjelaskan berbagai resource Kubernetes seperti Deployment, ReplicaSet, DaemonSet, StatefulSet, Job, dan CronJob, serta fungsinya dalam menjalankan berbagai jenis aplikasi. Modul ini juga membahas strategi rolling updates, rollback, konfigurasi aplikasi menggunakan ConfigMaps dan Secrets, mekanisme autoscaling (HPA, VPA), serta primitives yang memungkinkan aplikasi melakukan self-healing seperti probes dan resource limits.