(() => {
  'use strict';
  const SESSION_KEY = 'absensi_session_v2';
  const DATA_URL = 'data_siswa.json';
  const map = {
    X: ['X TITL','X TKJ','X TKR','X TP'],
    XI: ['XI TITL','XI TKJ','XI TKR','XI TP'],
    XII: ['XII TITL','XII TKJ','XII TKR.1','XII TKR.2','XII TP']
  };
  let data = {};
  let selectedClass = '';
  const $ = id => document.getElementById(id);
  const normalize = value => String(value ?? '').trim();
  const setLoading = show => $('loading')?.classList.toggle('show', show);
  const setError = message => {
    const box = $('errorBox');
    if (!box) return;
    box.textContent = message || '';
    box.classList.toggle('hidden', !message);
  };
  async function sha256(value) {
    const bytes = new TextEncoder().encode(normalize(value));
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2,'0')).join('');
  }
  function renderClasses() {
    const grid = $('classGrid');
    if (!grid) return;
    grid.innerHTML = '';
    Object.entries(map).forEach(([tingkat, kelas]) => kelas.forEach(k => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'class-btn';
      button.dataset.class = k;
      const suffix = k.slice(tingkat.length).trim();
      button.innerHTML = `<strong>${tingkat}</strong><small>${suffix}</small>`;
      button.addEventListener('click', () => selectClass(k));
      grid.appendChild(button);
    }));
  }
  function selectClass(kelas) {
    selectedClass = kelas;
    document.querySelectorAll('.class-btn').forEach(b => b.classList.toggle('active', b.dataset.class === kelas));
    const box = $('selectedClass');
    box.textContent = `✓ Kelas dipilih: ${kelas}`;
    box.style.display = 'block';
    const btn = $('continueBtn');
    btn.disabled = false;
    btn.style.opacity = '1';
  }
  function goLogin() {
    if (!selectedClass) return;
    $('stepClass').classList.add('hidden');
    $('stepLogin').classList.remove('hidden');
    $('authTitle').textContent = 'Verifikasi identitas';
    $('authSubtitle').textContent = 'Masukkan NISN yang terdaftar pada kelas ini.';
    $('stepLabel').textContent = '02 / 02';
    $('progressBar').style.width = '100%';
    $('selectedClassLogin').textContent = `✓ Kelas aktif: ${selectedClass}`;
    setError('');
    $('nisnInput').focus();
  }
  function goBack() {
    $('stepLogin').classList.add('hidden');
    $('stepClass').classList.remove('hidden');
    $('authTitle').textContent = 'Pilih kelas';
    $('authSubtitle').textContent = 'Tentukan kelas terlebih dahulu sebelum login.';
    $('stepLabel').textContent = '01 / 02';
    $('progressBar').style.width = '50%';
    $('nisnInput').value = '';
    setError('');
  }
  async function login() {
    const nisn = normalize($('nisnInput').value);
    setError('');
    if (!nisn) return setError('NISN belum diisi.');
    if (!data[selectedClass]) return setError('Data kelas belum tersedia.');
    setLoading(true);
    try {
      const hash = await sha256(nisn);
      const student = data[selectedClass].find(s => s.nisn_hash === hash);
      if (!student) {
        setLoading(false);
        return setError('NISN tidak ditemukan pada kelas yang dipilih. Periksa kelas dan NISN lalu coba lagi.');
      }
      const session = { version: 2, className: selectedClass, uid: student.uid, nisnHash: hash, loginAt: Date.now() };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      sessionStorage.setItem('absensi_nisn_runtime', nisn);
      location.href = 'absensi_digital.html';
    } catch (error) {
      console.error(error);
      setError('Browser ini tidak dapat menjalankan Web Crypto API. Gunakan browser modern melalui HTTPS/localhost.');
      setLoading(false);
    }
  }
  async function boot() {
    try {
      const response = await fetch(DATA_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error('Gagal memuat data siswa');
      data = await response.json();
      renderClasses();
      $('continueBtn').addEventListener('click', goLogin);
      $('backBtn').addEventListener('click', goBack);
      $('loginBtn').addEventListener('click', login);
      $('nisnInput').addEventListener('keydown', e => { if (e.key === 'Enter') login(); });
    } catch (error) {
      console.error(error);
      $('authSubtitle').textContent = 'Data siswa gagal dimuat. Jalankan project melalui server lokal/HTTPS.';
      $('continueBtn').disabled = true;
    }
  }
  boot();
})();
