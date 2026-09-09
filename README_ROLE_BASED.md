# AbsenSiswa — Role Based + Sync Lintas Perangkat

## Isi paket
- `index.html` — login 3 tahap: kelas → peran → kredensial.
- `script.js` — SHA-256 dan autentikasi berbasis data.
- `absensi_digital.html` — dashboard guru/murid.
- `data_guru.json` — hanya menyimpan hash SHA-256 password guru.
- `config.js` — alamat backend sinkronisasi.
- `server.js` + `package.json` — backend Node.js opsional untuk rekap bersama.

> **Penting:** `data_siswa.json` dari repository lama tetap diperlukan. Paket ini sengaja tidak mengganti dataset siswa yang sudah ada.

## Login
- Guru: pilih kelas, pilih Guru, isi nama guru dan password yang sudah ditetapkan.
- Murid: pilih kelas, pilih Murid, lalu masukkan NIS/NISN.
- NIS/NISN dicocokkan dengan `nis_hash` atau `nisn_hash` menggunakan SHA-256.

## Hak akses
- Guru: dapat mengubah Hadir/Izin/Sakit/Alpha dan memakai tombol Semua Hadir.
- Murid: hanya membaca rekap.

## Sinkronisasi HP/laptop berbeda
GitHub Pages adalah hosting statis, sehingga `localStorage` saja **tidak** dapat membuat data dari HP guru muncul di HP murid. Paket ini menyediakan backend Node.js ringan.

1. Deploy folder ini pada layanan yang bisa menjalankan Node.js.
2. Jalankan `npm start` (atau `node server.js`).
3. Salin URL backend ke `config.js`, contoh: `API_BASE_URL: "https://domain-backend-kamu.example"`.
4. Frontend GitHub Pages akan membaca/menulis rekap ke endpoint `/api/attendance` dan melakukan polling otomatis setiap 3 detik.

Jika `API_BASE_URL` kosong, aplikasi tetap berjalan dalam mode lokal sebagai fallback.

## Keamanan SHA-256
SHA-256 adalah **hash satu arah**, bukan enkripsi. File JSON hanya menyimpan hash password/identifier yang memang perlu diverifikasi. Nama siswa dan kelas harus tetap dapat dibaca aplikasi karena ditampilkan pada tabel. Untuk keamanan produksi, autentikasi sebaiknya dilakukan di server dengan password hashing modern dan otorisasi berbasis sesi/token; jangan menganggap hash yang ada di frontend sebagai rahasia.

## Deploy GitHub Pages
Upload/replace file frontend di repository bersama `data_siswa.json` lama. Aktifkan GitHub Pages. Jika menggunakan backend, isi `API_BASE_URL` dengan URL HTTPS backend.
