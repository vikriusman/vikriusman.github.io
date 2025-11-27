---
title: Modul 0 - Pengantar dan Fondasi
date: 2025-11-21
---

## 0.1. Mengapa Kubernetes?

Kubernetes hadir sebagai evolusi dari kebutuhan industri untuk mengelola aplikasi skala besar secara otomatis, stabil, dan efisien. Sebelum Kubernetes populer, proses deployment aplikasi melalui beberapa fase:

### Evolusi Deployment Aplikasi
1. **Bare Metal (Server Fisik)**  
   - Tidak ada isolasi antar aplikasi  
   - Provisioning lambat  
   - Scaling membutuhkan hardware baru  

2. **Virtual Machines (VM)**  
   - Isolasi lebih baik, tetapi tetap berat  
   - Konsumsi resource besar  
   - Deployment masih lambat dan kompleks  

3. **Containers**  
   - Ringan dan cepat  
   - Konsisten antara environment  
   - Cocok untuk model CI/CD modern  

4. **Container Orchestration**  
   - Dibutuhkan untuk mengelola ratusan container  
   - Menyediakan scaling, recovery, networking otomatis  
   - Kubernetes menjadi standar de facto  

### Kebutuhan Modern yang Mendorong Kubernetes
- Scalability otomatis  
- High availability  
- Observability dan logging terpusat  
- Deployment otomatis dan deklaratif  
- Portabilitas cloud dan on-prem  
- Ekosistem yang luas dan berkelanjutan  

### Kelemahan Deployment Manual (Tanpa Orchestrator)
- Scaling harus dilakukan manual  
- Tidak ada auto-healing  
- Load balancing sulit dikelola  
- Konfigurasi sulit direplikasi  
- Recovery membutuhkan intervensi manusia  
- Tidak ada mekanisme health check bawaan  

### Alasan Kubernetes Menjadi Standar Industri
- Didukung CNCF dan komunitas global  
- Digunakan perusahaan teknologi besar  
- Konsisten di seluruh platform  
- Deklaratif dan otomatis  
- Extensible melalui CRD dan operator  
- Stabil dan terus berkembang  

---

## 0.2. Use Case yang Cocok untuk Kubernetes

Kubernetes bukan untuk semua kondisi. Ia bekerja sangat baik dalam skenario berikut:

### Workload Ideal untuk Kubernetes
- Microservices skala menengah hingga besar  
- Sistem yang membutuhkan autoscaling dinamis  
- Aplikasi dengan lifecycle cepat (CI/CD intensif)  
- Multi-tenant platform  
- Event-driven workloads  

---

## 0.3. Kapan Tidak Menggunakan Kubernetes

Banyak organisasi salah menggunakan Kubernetes ketika sebenarnya kebutuhan mereka tidak sekompleks itu.

### Kondisi di Mana Kubernetes Tidak Disarankan
- Workload sederhana (1–3 service)  
- Tim kecil tanpa DevOps/SRE yang berpengalaman  
- Budget hardware atau cloud terbatas  
- Aplikasi monolitik yang jarang diubah  
- Kebutuhan real-time latency sangat ketat  
- Lingkungan air-gapped tanpa dukungan ahli  
- Workload stateful berat tanpa kebutuhan horizontal scaling  

---

## 0.4. Konsep Dasar Container dan Orchestration

### Apa Itu Container?

Container adalah unit eksekusi ringan yang diisolasi melalui *namespaces* dan *cgroups*. Container memungkinkan aplikasi berjalan secara konsisten di berbagai environment karena setiap container membawa filesystem, dependensi, dan konfigurasi sendiri tanpa mengganggu sistem host.

### Apa Itu cgroups?

**cgroups (control groups)** adalah fitur pada kernel Linux yang digunakan untuk mengontrol dan mengelola penggunaan resource oleh proses atau grup proses. Fungsi utama cgroups mencakup:

- Membatasi penggunaan resource (CPU, memory, I/O)
- Mengukur penggunaan resource per proses atau per grup
- Mengatur prioritas proses
- Mengisolasi resource antar container
- Mencegah satu container menghabiskan seluruh resource node

cgroups digunakan oleh container runtime seperti **containerd** dan **CRI-O** untuk memastikan setiap container hanya menggunakan resource sesuai batas yang ditentukan dalam konfigurasi Pod Kubernetes.

Dengan bantuan cgroups, Kubernetes dapat menerapkan *resource requests* dan *limits* secara efektif sehingga workload berjalan lebih stabil dan adil di dalam cluster.

### Apa Itu Image?
Image adalah blueprint dari container yang bersifat immutable. Image berisi filesystem dan konfigurasi runtime.

### Container Runtime vs Container Engine

| Komponen           | Fungsi|
|--------------------|-------------------------------------------------------------|
| Container Runtime  | Menjalankan container (misalnya: containerd, CRI-O)         |
| Container Engine   | Mengelola image dan menyediakan CLI (misalnya: Docker CLI)  |


Kubernetes menggunakan runtime yang kompatibel dengan CRI (Container Runtime Interface).

### Apa Itu Orchestration?
Orchestration adalah otomatisasi manajemen container:  
- Penjadwalan container ke node  
- Scaling  
- Recovery otomatis  
- Networking  
- Load balancing  
- Health checks  

### Reconciliation Loop
Konsep utama Kubernetes:  
"Kubernetes selalu mencoba menyamakan kondisi aktual dengan kondisi yang dideklarasikan."

Jika user menyatakan 5 Pod harus berjalan tetapi hanya 2 yang aktif, Kubernetes akan membuat 3 Pod tambahan.

### Control Plane vs Data Plane

Arsitektur Kubernetes dibagi menjadi dua lapisan besar: **Control Plane** dan **Data Plane**. Keduanya memiliki tanggung jawab berbeda namun saling melengkapi untuk menjaga operasional cluster tetap stabil, konsisten, dan otomatis.


### Control Plane

Control Plane adalah komponen-komponen yang bertanggung jawab untuk **mengendalikan keseluruhan cluster**. Ia menyimpan state cluster, mengambil keputusan scheduling, mengelola lifecycle objek, dan memastikan bahwa kondisi aktual cluster selalu sesuai dengan kondisi yang dideklarasikan oleh user.

Komponen-komponen utama Control Plane:

#### 1. kube-apiserver
- Komponen sentral dan pintu masuk utama ke seluruh cluster.
- Menyediakan REST API yang digunakan oleh `kubectl`, dashboard, scheduler, controller, dan seluruh komponen Kubernetes lainnya.
- Menangani autentikasi, otorisasi, admission control, dan validasi objek.
- Berjalan dalam mode stateless, sehingga dapat direplikasi untuk high availability.

#### 2. etcd
- Database key-value yang menyimpan *state* Kubernetes secara konsisten.
- Menyimpan seluruh objek deklaratif seperti Pod, Deployment, Service, Node, ConfigMap, dll.
- Bersifat *distributed and consistent*, menggunakan algoritma **Raft**.
- Merupakan komponen paling kritikal; kerusakan pada etcd = cluster tidak dapat bekerja.

#### 3. kube-scheduler
- Bertugas menentukan node mana yang akan menjalankan Pod.
- Mengambil keputusan berdasarkan:
  - resource availability (CPU, memory)
  - affinity/anti-affinity
  - taints/tolerations
  - topology spread constraints
  - custom scheduler extension
- Scheduler hanya menentukan *penempatan*, bukan menjalankan Pod.

#### 4. kube-controller-manager
- Mengelola seluruh *controller loop* dalam Kubernetes.
- Setiap controller memantau desired state dan actual state, lalu melakukan perubahan untuk menyamakan keduanya.
- Jenis controller yang berjalan di dalamnya:
  - Node controller
  - Deployment controller
  - ReplicaSet controller
  - Job controller
  - Endpoints controller
  - ServiceAccount controller
- Mewakili inti dari mekanisme **reconciliation loop** Kubernetes.


### Data Plane

Data Plane adalah bagian dari cluster yang **menjalankan aplikasi**. Node-node yang menjalankan workload container berada di layer ini. Data Plane bertanggung jawab untuk mengeksekusi instruksi yang ditentukan oleh Control Plane.

Komponen-komponen Data Plane:

#### 1. kubelet
- Agen yang berjalan pada setiap node.
- Bertugas menjalankan Pod berdasarkan instruksi dari kube-apiserver.
- Memastikan container tetap berjalan sesuai konfigurasi PodSpec.
- Melaporkan status node dan status container ke Control Plane.
- Mengelola lifecycle container melalui Container Runtime Interface (CRI).

#### 2. Container Runtime
- Software yang menjalankan dan mengelola container pada node.
- Beroperasi di bawah instruksi kubelet.
- Contoh runtime:
  - containerd (paling umum)
  - CRI-O
- Bertanggung jawab untuk:
  - menjalankan container
  - menghentikan container
  - mengelola image, sandbox, dan filesystem
  - berinteraksi dengan cgroups dan namespaces kernel

#### 3. kube-proxy
- Mengelola routing dan forwarding traffic antara Service dan Pod.
- Memprogram IPTables atau IPVS untuk membangun load balancing internal.
- Memastikan konektivitas antar Pod di dalam cluster serta dengan external Service.

#### 4. Pods dan Container
- Unit eksekusi aplikasi yang sebenarnya.
- Pod berisi satu atau lebih container yang berbagi:
  - network namespace
  - IPC
  - volume
- Container di dalam Pod adalah proses yang menjalankan aplikasi atau service bisnis.

---

# Akhir Modul 0

Modul ini memberikan fondasi konseptual untuk memahami motivasi, konteks, dan dasar-dasar Kubernetes sebelum masuk ke instalasi dan operasi cluster pada modul-modul berikutnya.
