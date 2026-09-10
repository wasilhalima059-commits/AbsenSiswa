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
- **Kenaikan kelas otomatis:** contoh X TP pada 2026/2027 akan menjadi XI TP pada 2027/2028, lalu XII TP pada 2028/2029. Pola yang sama berlaku untuk X/XI/XII TITL, TKJ, TKR, TP, termasuk TKR.1/TKR.2.
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

## Catatan penting data kelas

Daftar **Pilih Kelas** di halaman login sekarang **tidak lagi ditulis manual**. Sistem membaca nama kelas yang benar-benar memiliki data dari `data_siswa.json` milik project lama.

Jadi:
- jangan menghapus atau mengganti `data_siswa.json` lama saat mengunggah file ZIP ini ke GitHub;
- kelas yang kosong/tidak memiliki siswa tidak akan ditampilkan;
- dashboard guru juga mengambil kelas dari file data siswa yang sama;
- kalau `data_siswa.json` tidak ada, login akan menampilkan pesan error, bukan dropdown kelas kosong.

## Kenaikan kelas otomatis
Pada dashboard, pilihan **Tahun Ajaran** terhubung dengan kelas awal saat guru login. Jika guru login sebagai **X TP** pada **2026/2027**, lalu memilih **2027/2028**, sistem otomatis memindahkan tampilan menjadi **XI TP**. Jika memilih **2028/2029**, menjadi **XII TP**. Siswa dari kelas sebelumnya ikut dibawa ke tahun ajaran baru saat belum ada daftar siswa tersimpan untuk tahun tersebut.

Pola jurusan dipertahankan, misalnya `X TKJ → XI TKJ → XII TKJ`, `X TITL → XI TITL → XII TITL`, dan `X TKR.1 → XI TKR.1 → XII TKR.1`. Kelas XII adalah tingkat akhir sehingga tidak dibuat menjadi XIII.

Jika guru mengganti kelas secara manual pada dashboard, kelas tersebut menjadi titik awal baru untuk perhitungan kenaikan pada pergantian tahun ajaran berikutnya. Data daftar siswa dan absensi dipisahkan berdasarkan kelas + tahun ajaran agar data tahun lama tetap tersimpan.
