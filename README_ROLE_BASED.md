# AbsenSiswa — Role Based

Upload/replace file berikut ke repository yang sudah ada:
- `index.html`
- `script.js`
- `absensi_digital.html`
- `data_guru.json`

**Pertahankan `data_siswa.json` lama.** File tersebut sudah berisi data siswa dan hash NIS/NISN.

## Login
- Guru: password `2334`.
- Murid: NIS atau NISN yang cocok dengan `nis_hash` atau `nisn_hash`.

SHA-256 password guru:
`44d39c6e5e7b45bfc2187fb3c89be58c5a3dc6a54d2a0075402c551c14ea1459`

## Hak akses
- Guru: dapat mengubah status Hadir/Izin/Sakit/Alpha dan memakai tombol Semua Hadir.
- Murid: hanya dapat melihat status, tanpa kontrol pengeditan.

## Catatan penyimpanan
Versi ini memakai `localStorage`, karena project berjalan sebagai static site/GitHub Pages. Artinya rekap tersimpan pada browser/perangkat tempat guru melakukan input dan **tidak otomatis tersinkron ke HP/perangkat lain**.

Jika ingin guru merekap dari satu perangkat lalu murid melihat rekap yang sama dari perangkat lain, project perlu backend/database.

## Deploy
Buka melalui GitHub Pages/HTTPS agar `crypto.subtle` dan `fetch()` bekerja dengan baik.
