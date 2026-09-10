# AbsenSiswa — Versi Guru Saja

Versi ini mengikuti rancangan terbaru: **tidak ada login murid**. Hanya guru yang dapat login dan mengelola absensi.

## Fitur
- Form Login Guru.
- Username guru + password.
- Password guru tetap **2334**, tetapi yang disimpan di `data_guru.json` adalah SHA-256.
- Pilihan kelas menggunakan `<select>`.
- Tombol **Login** masuk ke dashboard dan **Batal** mengosongkan username/password.
- Fitur **Lupa Password** dengan kode pemulihan admin/sekolah dan pembuatan password baru.
- Dashboard menampilkan daftar siswa dari kelas yang dipilih.
- Pilihan tahun ajaran.
- Absen: Hadir, Izin, Sakit, Alpha.
- Edit dan hapus nama siswa.
- Ekspor/rekap bulanan ke CSV.
- Cetak laporan absensi bulanan.
- Tema gelap sebagai default + tombol tema terang, tersimpan di browser.
- Backend opsional untuk sinkronisasi absensi dan perubahan data siswa lintas perangkat.

## Data siswa
File `data_siswa.json` dari project lama **tetap harus dipertahankan di repository GitHub**. ZIP ini sengaja tidak mengganti file tersebut karena data siswa asli tidak tersedia di paket terakhir yang diedit.

Format lama yang didukung adalah objek dengan nama kelas sebagai key, misalnya:
```json
{
  "X TKJ": [
    {"no":1,"nama":"Nama Siswa","jk":"L"}
  ]
}
```

## Login
Username bebas sesuai username guru yang digunakan. Password awal: `2334`.

### Lupa Password
Untuk versi tugas/demo ini tersedia pemulihan password menggunakan kode pemulihan. **Kode pemulihan demo: `ABSEN-2026`**. Setelah kode benar, guru dapat membuat password baru. Password baru disimpan sebagai SHA-256 di browser (`localStorage`). Pada versi produksi, proses reset sebaiknya dilakukan melalui backend dengan akun/admin dan token pemulihan yang aman.

> Catatan: SHA-256 di frontend cocok untuk tugas/demo, tetapi bukan pengganti autentikasi server yang aman untuk aplikasi produksi.

## Sinkronisasi lintas perangkat
GitHub Pages sendiri tidak dapat menyimpan perubahan absensi ke perangkat lain. Jika ingin guru di HP/laptop A mengubah data dan perangkat lain melihat data yang sama, jalankan `server.js` pada backend dan isi `API_BASE_URL` di `config.js`.

Jalankan:
```bash
npm start
```

Lalu ubah:
```js
window.ABSENSI_CONFIG = { API_BASE_URL: "https://alamat-server-anda" };
```

Backend menyediakan:
- `GET/PUT /api/attendance?class=...&year=...&date=...`
- `GET/PUT /api/students?class=...`

## Catatan edit/hapus siswa
Tanpa backend, edit/hapus nama siswa disimpan di `localStorage` browser. Dengan backend aktif, perubahan dikirim ke server agar dapat digunakan perangkat lain.
