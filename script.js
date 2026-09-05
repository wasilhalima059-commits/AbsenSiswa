// Memetakan tingkat kelas ke nama key dalam dataSiswa
const mapKelas = {
  "10": ["X TITL", "X TKJ", "X TKR", "X TP"],
  "11": ["XI TITL", "XI TKJ", "XI TKR", "XI TP"],
  "12": ["XII TITL", "XII TKJ", "XII TKR.1", "XII TKR.2", "XII TP"]
};

// Fungsi saat Tingkat Kelas dipilih
function updateDaftarKelas() {
  const tingkat = document.getElementById("selectTingkat").value;
  const selectKelas = document.getElementById("selectKelas");
  
  // Reset opsi kelas
  selectKelas.innerHTML = '<option value="">-- Pilih Kelas --</option>';

  if (tingkat && mapKelas[tingkat]) {
    mapKelas[tingkat].forEach(kelas => {
      const option = document.createElement("option");
      option.value = kelas;
      option.textContent = kelas;
      selectKelas.appendChild(option);
    });
  }

  // Reset isi tabel
  document.getElementById("bodySiswa").innerHTML = "";
}

// Fungsi saat Kelas/Jurusan dipilih untuk menampilkan daftar siswa
function tampilkanSiswa() {
  const kelas = document.getElementById("selectKelas").value;
  const tbody = document.getElementById("bodySiswa");
  tbody.innerHTML = "";

  if (kelas && dataSiswa[kelas]) {
    dataSiswa[kelas].forEach(s => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${s.no}</td>
        <td>${s.nis}</td>
        <td>${s.nisn || '-'}</td>
        <td>${s.nama}</td>
        <td>${s.jk}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}