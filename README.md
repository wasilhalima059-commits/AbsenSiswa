# Absensi Digital — Redesigned

Buka `index.html` melalui server lokal/HTTPS. Jangan mengandalkan `file://` karena browser dapat memblokir fetch JSON dan Web Crypto pada sebagian lingkungan.

Contoh server lokal:

```bash
python -m http.server 8080
```

Lalu buka `http://localhost:8080/`.

File utama:

- `index.html` — login dua langkah.
- `absensi_digital.html` — dashboard absensi.
- `script.js` — data loading, SHA-256, class selection, dan autentikasi.
- `data_siswa.json` — dataset runtime dengan identifier yang sudah di-hash.
- `AUDIT.md` — hasil audit dan catatan keamanan.
