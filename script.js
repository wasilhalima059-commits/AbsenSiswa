(()=>{"use strict";
const SESSION_KEY="absensi_session_v4", PASSWORD_OVERRIDE_KEY="absensi_password_override_v1", DATA_URL="data_siswa.json";
const $=id=>document.getElementById(id);
let studentData={};

async function sha256(value){
  const bytes=new TextEncoder().encode(String(value??""));
  const hash=await crypto.subtle.digest("SHA-256",bytes);
  return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("")
}

async function getGuruData(){
  try{
    const r=await fetch("data_guru.json",{cache:"no-store"});
    if(r.ok)return await r.json();
  }catch{}
  return {};
}

async function getExpectedPasswordHash(){
  const override=localStorage.getItem(PASSWORD_OVERRIDE_KEY);
  if(override)return override;
  const d=await getGuruData();
  return d.password_sha256||d.password_hash||await sha256("2334");
}

async function getRecoveryHash(){
  const d=await getGuruData();
  return d.recovery_code_sha256||"";
}

function classNamesFromData(data){
  // Format utama data_siswa.json: {"X TKJ":[...], "XI TKJ":[...], ...}
  if(data && !Array.isArray(data) && typeof data==="object"){
    return Object.entries(data)
      .filter(([name,students])=>String(name).trim() && Array.isArray(students) && students.length>0)
      .map(([name])=>String(name).trim());
  }

  // Cadangan bila data siswa berbentuk array dan setiap siswa menyimpan nama kelas.
  if(Array.isArray(data)){
    const fields=["kelas","class","rombel","className","kelas_nama","Kelas"];
    const set=new Set();
    data.forEach(s=>{
      if(!s || typeof s!=="object")return;
      const value=fields.map(k=>s[k]).find(v=>String(v??"").trim());
      if(value)set.add(String(value).trim());
    });
    return [...set];
  }
  return [];
}

function fillClasses(classes){
  const el=$("className");
  if(!el)return;
  el.innerHTML='<option value="">-- Pilih kelas --</option>';
  classes.forEach(c=>{
    const o=document.createElement("option");
    o.value=c;
    o.textContent=c;
    el.appendChild(o);
  });
  el.disabled=classes.length===0;
}

async function loadStudentData(){
  const r=await fetch(DATA_URL,{cache:"no-store"});
  if(!r.ok)throw new Error("data_siswa.json tidak ditemukan");
  studentData=await r.json();
  const classes=classNamesFromData(studentData);
  fillClasses(classes);
  if(!classes.length)throw new Error("Tidak ada kelas yang memiliki data siswa.");
  return classes;
}

function studentsForClass(className){
  if(studentData && !Array.isArray(studentData))return Array.isArray(studentData[className])?studentData[className]:[];
  if(Array.isArray(studentData)){
    const fields=["kelas","class","rombel","className","kelas_nama","Kelas"];
    return studentData.filter(s=>fields.some(k=>String(s?.[k]??"").trim()===className));
  }
  return [];
}

async function login(e){
  e.preventDefault();
  const username=$("username").value.trim(),password=$("password").value,className=$("className").value,error=$("error");
  error.classList.add("hidden");
  if(!username||!password||!className){error.textContent="Username, password, dan kelas wajib diisi.";error.classList.remove("hidden");return}

  // Pastikan kelas yang dipilih memang berasal dari data siswa lama.
  if(!studentsForClass(className).length){error.textContent="Kelas tidak memiliki data siswa atau tidak ditemukan.";error.classList.remove("hidden");return}

  const hash=await sha256(password),expected=await getExpectedPasswordHash();
  if(hash!==expected){error.textContent="Password guru salah.";error.classList.remove("hidden");return}
  sessionStorage.setItem(SESSION_KEY,JSON.stringify({role:"guru",username,className,loginAt:new Date().toISOString()}));
  location.href="absensi_digital.html";
}

function clearForm(){
  $("username").value="";
  $("password").value="";
  $("className").value="";
  $("error").classList.add("hidden");
  $("username").focus();
}

function openReset(){
  ["recoveryCode","newPassword","confirmPassword"].forEach(id=>$(id).value="");
  $("resetError").classList.add("hidden");
  $("resetSuccess").classList.add("hidden");
  $("resetModal").classList.remove("hidden");
  $("recoveryCode").focus();
}
function closeReset(){$("resetModal").classList.add("hidden")}

async function resetPassword(){
  const code=$("recoveryCode").value,newPassword=$("newPassword").value,confirm=$("confirmPassword").value,error=$("resetError"),success=$("resetSuccess");
  error.classList.add("hidden");success.classList.add("hidden");
  if(!code||!newPassword||!confirm){error.textContent="Semua kolom pemulihan wajib diisi.";error.classList.remove("hidden");return}
  if(newPassword.length<4){error.textContent="Password baru minimal 4 karakter.";error.classList.remove("hidden");return}
  if(newPassword!==confirm){error.textContent="Konfirmasi password tidak sama.";error.classList.remove("hidden");return}
  const recoveryHash=await getRecoveryHash();
  if(!recoveryHash||await sha256(code)!==recoveryHash){error.textContent="Kode pemulihan salah.";error.classList.remove("hidden");return}
  localStorage.setItem(PASSWORD_OVERRIDE_KEY,await sha256(newPassword));
  success.textContent="Password berhasil diubah. Silakan tutup jendela ini dan login dengan password baru.";
  success.classList.remove("hidden");
  $("password").value="";
}

async function init(){
  const error=$("error");
  try{
    const classes=await loadStudentData();
    const hint=document.createElement("div");
    hint.className="hint";
    hint.id="classHint";
    hint.textContent=`${classes.length} kelas tersedia dari data_siswa.json.`;
    $("className").insertAdjacentElement("afterend",hint);
  }catch(e){
    console.error(e);
    const el=$("className");
    el.innerHTML='<option value="">-- Data kelas tidak tersedia --</option>';
    el.disabled=true;
    error.textContent="Daftar kelas gagal dimuat dari data_siswa.json. Pastikan file data siswa lama tetap ada di folder utama GitHub Pages.";
    error.classList.remove("hidden");
  }
}

$("loginForm").addEventListener("submit",login);
$("cancel").addEventListener("click",clearForm);
$("forgotPassword").addEventListener("click",e=>{e.preventDefault();openReset()});
$("closeReset").addEventListener("click",closeReset);
$("saveNewPassword").addEventListener("click",resetPassword);
$("resetModal").addEventListener("click",e=>{if(e.target===$("resetModal"))closeReset()});
init();
})();
