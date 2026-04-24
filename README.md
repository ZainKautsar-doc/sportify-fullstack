# Sportify Booking System

Sportify adalah aplikasi booking lapangan olahraga berbasis web yang memungkinkan pengguna melakukan reservasi secara online dengan alur yang terstruktur, mulai dari pemesanan hingga verifikasi pembayaran oleh admin.

**Live Demo:** https://sportifybooking.vercel.app/

---

## Fitur Utama

### Autentikasi
- Register dan login menggunakan email dan password
- Login dengan Google (OAuth 2.0)
- Autentikasi berbasis JWT

### Booking Lapangan
- Pemesanan lapangan secara online
- Pemilihan tanggal, waktu, dan jenis lapangan
- Status booking:
  - `pending`
  - `confirmed`
  - `rejected`

### Pembayaran
- Upload bukti pembayaran
- Nominal otomatis sesuai dengan booking
- Verifikasi pembayaran oleh admin

### Auto Expired Booking
- Booking akan otomatis dibatalkan jika tidak diselesaikan dalam batas waktu tertentu

### Admin Panel
- Melihat dan mengelola data booking
- Verifikasi pembayaran
- Mengubah status booking

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- JWT Authentication
- Google OAuth

### Database
- PostgreSQL

### Deployment
- Frontend: Vercel
- Backend: Railway

---

## Struktur Project

```
sportify-fullstack/
├── frontend/        # Client (UI)
├── backend/         # Server (API)
└── README.md
```

---

## Alur Autentikasi Google (OAuth)

1. User memilih login dengan Google
2. Sistem melakukan redirect ke halaman OAuth Google
3. Setelah autentikasi berhasil, user diarahkan kembali ke endpoint callback (`/auth/google/callback`)
4. Backend memproses data user dan menghasilkan JWT
5. User berhasil masuk ke dalam sistem

---

## Best Practice yang Digunakan

- Pemisahan arsitektur frontend dan backend
- Penggunaan environment variable untuk konfigurasi sensitif
- Manajemen sesi menggunakan JWT
- Validasi alur status booking untuk menjaga konsistensi data
- Struktur modular pada backend (routes, controllers)

---