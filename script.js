(() => {
"use strict";
const DATA_URL="data_siswa.json", TEACHER_URL="data_guru.json", SESSION_KEY="absensi_session_v3";
const CLASS_MAP={X:["X TITL","X TKJ","X TKR","X TP"],XI:["XI TITL","XI TKJ","XI TKR","XI TP"],XII:["XII TITL","XII TKJ","XII TKR.1","XII TKR.2","XII TP"]};
let data={},selectedClass="",selectedRole="";
const $=id=>document.getElementById(id), norm=v=>String(v??"").trim();
async function sha256(v){const d=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(norm(v)));return [...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,"0")).join("")}
function setStep(n){document.getElementById("classStep").classList.toggle("hidden",n!==1);document.getElementById("roleStep").classList.toggle("hidden",n!==2);document.getElementById("loginStep").classList.toggle("hidden",n!==3);$("step").textContent=`0${n} / 03`;$("bar").style.width=(n*33.333)+"%";}
function renderClasses(){let g=$("classGrid");Object.entries(CLASS_MAP).forEach(([level,arr])=>arr.forEach(c=>{let b=document.createElement("button");b.className="choice";b.innerHTML=`<b>${level}</b><small>${c.slice(level.length).trim()}</small>`;b.onclick=()=>{selectedClass=c;document.querySelectorAll("#classGrid .choice").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("classNext").disabled=false};g.appendChild(b)}))}
function showError(m){$("error").textContent=m;$("error").classList.toggle("hidden",!m)}
$("classNext").onclick=()=>{setStep(2);$("selectedClass").textContent="✓ Kelas: "+selectedClass};
$("backRole").onclick=()=>setStep(1);
document.querySelectorAll("[data-role]").forEach(b=>b.onclick=()=>{selectedRole=b.dataset.role;document.querySelectorAll("[data-role]").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("roleNext").disabled=false});
$("roleNext").onclick=()=>{setStep(3);$("summary").textContent=`✓ ${selectedClass} • ${selectedRole==="guru"?"Guru":"Murid"}`;$("teacherNameWrap").classList.toggle("hidden",selectedRole!=="guru");$("credentialLabel").textContent=selectedRole==="guru"?"Password guru":"NIS / NISN murid";$("credential").placeholder=selectedRole==="guru"?"Masukkan password":"Masukkan NIS atau NISN";$("credential").type=selectedRole==="guru"?"password":"text";$("credential").focus()};
$("backLogin").onclick=()=>setStep(2);
$("loginBtn").onclick=async()=>{showError("");let value=norm($("credential").value);let teacherName=norm($("teacherName").value);if(selectedRole==="guru"&&!teacherName)return showError("Nama guru belum diisi.");if(!value)return showError("Data login belum diisi.");try{
if(selectedRole==="guru"){let cfg=await fetch(TEACHER_URL,{cache:"no-store"}).then(r=>r.json());if(await sha256(value)!==cfg.password_sha256)return showError("Password guru salah.")}
else {let students=data[selectedClass]||[];let h=await sha256(value);let s=students.find(x=>x.nis_hash===h||x.nisn_hash===h);if(!s)return showError("NIS/NISN tidak ditemukan pada kelas yang dipilih.");sessionStorage.setItem(SESSION_KEY,JSON.stringify({role:"murid",className:selectedClass,uid:s.uid,loginAt:Date.now()}))}
if(selectedRole==="guru")sessionStorage.setItem(SESSION_KEY,JSON.stringify({role:"guru",className:selectedClass,teacherName,loginAt:Date.now()}));
location.href="absensi_digital.html";
}catch(e){console.error(e);showError("Gagal memuat data. Pastikan file JSON tersedia dan situs dibuka melalui HTTPS.")}};
(async()=>{try{data=await fetch(DATA_URL,{cache:"no-store"}).then(r=>r.json());renderClasses()}catch(e){$("subtitle").textContent="Data siswa gagal dimuat."}})();
})();