# 🏟️ Sportify Booking System

Sportify adalah aplikasi booking lapangan olahraga berbasis web yang memungkinkan pengguna untuk melakukan reservasi secara online dengan sistem yang terstruktur, mulai dari pemesanan hingga verifikasi pembayaran oleh admin.

🔗 Demo Website: https://sportifybooking.vercel.app/

---

## ✨ Fitur Utama

### 👤 Autentikasi
- Register & Login manual (email + password)
- Login dengan Google (OAuth)
- Sistem autentikasi menggunakan JWT

### 📅 Booking Lapangan
- Booking lapangan secara online
- Status booking:
  - `pending`
  - `confirmed`
  - `rejected`
- Informasi detail booking (tanggal, waktu, lapangan)

### 💳 Pembayaran
- Upload bukti pembayaran
- Menampilkan nominal sesuai booking
- Verifikasi pembayaran oleh admin

### ⏳ Auto Expired Booking
- Booking otomatis dibatalkan jika tidak dibayar dalam waktu tertentu

### 🛠️ Admin Panel (Basic)
- Melihat data booking
- Verifikasi pembayaran
- Mengubah status booking

---

## 🏗️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js    
- JWT Authentication
- OAuth Google

### Database
- PostgreSQL

### Deployment
- Frontend: Vercel
- Backend: Railway

### sportify-fullstack/
├── frontend/        # Client (UI)
├── backend/         # Server (API)
├── README.md

### 🔐 Alur Autentikasi Google (OAuth)

1. User klik tombol **Login with Google**
2. Redirect ke Google OAuth
3. Callback ke backend (`/auth/google/callback`)
4. Backend generate JWT
5. User berhasil login ke sistem

---

## 📌 Best Practice yang Digunakan

- Pemisahan struktur frontend & backend
- Environment variable untuk keamanan
- JWT untuk session management
- Validasi alur booking (pending → confirm/reject)
- Modularisasi API (controller / route)