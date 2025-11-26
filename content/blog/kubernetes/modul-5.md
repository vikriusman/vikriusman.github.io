---
title: Modul 5 - Monitoring Cluster dan Aplikasi
date: 2025-11-21
---

## 5.1. Metrik dan Telemetri

Monitoring Kubernetes membutuhkan beberapa sumber data, karena cluster terdiri dari banyak komponen yang menghasilkan metrik berbeda. Bagian ini menjelaskan sumber metrik utama di Kubernetes.

### 5.1.1. Metrics Server

Metrics Server adalah komponen ringan yang digunakan Kubernetes untuk:

- Horizontal Pod Autoscaler (HPA)
- Vertical Pod Autoscaler (VPA)
- `kubectl top` command

Metrics Server mengumpulkan metrik **CPU dan memori** dari kubelet via API `/stats/summary`.

Ciri:

- Data tidak persisten
- Bukan solusi monitoring penuh
- Hanya untuk autoscaling dan observability dasar

### 5.1.2. Prometheus

Prometheus adalah solusi monitoring paling umum di Kubernetes.

Kemampuan:

- Scrape metrik via HTTP endpoints (`/metrics`)
- Query menggunakan PromQL
- Penyimpanan time-series
- Alerting (Alertmanager)

Prometheus biasanya dipasang melalui **Prometheus Operator**, yang mengelola:

- Prometheus instances
- Alertmanager
- Grafana dashboards
- ServiceMonitor dan PodMonitor

Prometheus menyimpan data persisten, cocok untuk observability jangka panjang.

### 5.1.3. Node Exporter

Node Exporter digunakan untuk menampilkan metrik level OS di setiap node.

Metrik yang dikumpulkan:

- CPU usage
- Disk I/O
- Network throughput
- Filesystem usage
- Hardware metrics

Node Exporter bekerja berdampingan dengan Prometheus sebagai target scrape.

### 5.1.4. Kube-State-Metrics

Kube-State-Metrics adalah service yang memaparkan **state objek Kubernetes**, bukan metrik CPU/memori.

Contoh metrik:

- jumlah Pod yang siap
- jumlah Deployment yang tidak stabil
- kondisi Node
- kondisi Volume
- informasi HPA, PVC, DS, RS, Job, CronJob, dsb.

Dengan kata lain:

- Node Exporter → metrik OS  
- Metrics Server → CPU/Memori realtime  
- Prometheus → time-series persistence  
- Kube-State-Metrics → state Kubernetes API  

---

## 5.2. Monitoring Resource Usage

Kubernetes menyediakan beberapa tingkatan observability:

### 5.2.1. CPU, Memory, Network

Monitoring dasar mencakup:

- penggunaan CPU per Pod, container, node
- penggunaan memory (RSS, working set)
- bandwidth network Pod dan node
- packet drops/latency network

Grafana sering digunakan untuk menampilkan grafik resource ini.

### 5.2.2. Pod-Level Monitoring

Metrik yang diperhatikan:

- CPU usage per Pod
- Memory usage per Pod
- Restarts
- Pod readiness dan liveness
- Latency request (jika memiliki HTTP metrics)

Sumber: Metrics Server + Prometheus (cAdvisor metrics).

### 5.2.3. Container-Level Monitoring

Selain metrik pemakaian umum, observasi CPU pada container harus memperhatikan bahwa Kubernetes menggunakan **cgroups** untuk melakukan *CPU slicing*. Ini berarti CPU tidak diberikan sebagai core fisik, tetapi sebagai jatah waktu proses (CPU time) yang dipotong-potong dalam bentuk kuota. Jika container memiliki `resources.limits.cpu: 1`, artinya ia mendapat jatah 1 vCPU penuh, bukan core tertentu, melainkan 1000 millicores CPU time setiap periode scheduler.

Karena CPU diberikan dalam bentuk time-slice (bukan dedicated core), container dapat mengalami **CPU throttling** ketika mencoba menggunakan lebih banyak CPU daripada limit yang ditentukan. Prometheus melalui cAdvisor menyediakan metrik seperti `container_cpu_usage_seconds_total` dan `container_cpu_cfs_throttled_seconds_total` untuk memantau fenomena throttling ini.

Metrik container-level yang penting:

- CPU usage (berbasis time-slice)
- CPU throttling (container ditahan oleh cgroup)
- Memory limit usage (RSS, working set)
- Container restarts
- Disk I/O usage (read/write bytes)
- Network usage (TX/RX bytes, drops, errors)

cAdvisor, yang berjalan sebagai bagian dari kubelet, menjadi sumber metrik utama untuk container-level observability.

### 5.2.4. Node-Level Monitoring

Pada level node, CPU juga bekerja menggunakan mekanisme **CFS (Completely Fair Scheduler)** yang memberikan jatah CPU bagi seluruh container berdasarkan limit dan request Pod. Jika total limit container di node melebihi kapasitas CPU secara fisik, Kubernetes tetap memperbolehkannya (overcommit). Akibatnya, throttling dapat terjadi pada banyak container sekaligus.

Node Exporter menyediakan metrik node-level untuk:

- total CPU usage
- CPU idle, user, system, iowait
- load average (indikator antrean proses)
- memory usage dan pressure
- filesystem usage dan inode usage
- kernel metrics (context switches, interrupts)
- systemd service health (kubelet, runtime, networking)

Monitoring node-level penting untuk melihat:

- apakah nilai CPU request terlalu tinggi sehingga scheduler salah memilih node
- apakah total limit terlalu besar dan menyebabkan throttling masif
- apakah bottleneck berasal dari disk I/O atau network interface

Node Exporter + Prometheus memberikan gambaran kapasitas fisik node, sedangkan cAdvisor memberikan observasi granular per container. Kombinasi keduanya memberikan insight lengkap antara *CPU slicing* yang dialokasikan pada container dan *capacity usage* yang terjadi pada node fisik.

---

## 5.3. Tools Visualisasi

Visualisasi monitoring sangat penting untuk debugging dan capacity planning.

### 5.3.1. Grafana

Grafana digunakan untuk dashboarding Prometheus.

Kegunaan:

- Dashboard HPA
- Node monitoring
- Pod/container usage
- Latency aplikasi
- Alerts visual

### 5.3.2. Lens / OpenLens

Lens menyediakan tampilan GUI cluster:

- Node health
- Pod logs
- Resource usage
- Events

Tidak menggantikan monitoring, tetapi sangat membantu observability harian.

---

# Akhir Modul 5.

Modul ini menjelaskan komponen monitoring utama dalam Kubernetes, termasuk Metrics Server, Prometheus, Node Exporter, dan Kube-State-Metrics. Modul ini juga membahas teknik pemantauan resource CPU, memory, dan network di tingkat Pod, container, dan node, serta memperkenalkan tools visualisasi seperti Grafana dan Lens untuk monitoring operasional.

