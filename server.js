// Backend opsional untuk sinkronisasi lintas perangkat.
// Jalankan dengan Node.js 18+: node server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'attendance_store.json');
const ORIGIN = process.env.ALLOWED_ORIGIN || '*';

function load(){ try { return JSON.parse(fs.readFileSync(DATA_FILE,'utf8')); } catch { return {}; } }
function save(data){ fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); }
function send(res, code, body){ res.writeHead(code, {'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':ORIGIN,'Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'GET,PUT,OPTIONS'}); res.end(JSON.stringify(body)); }

const server = http.createServer((req,res)=>{
  if(req.method === 'OPTIONS') return send(res,204,{});
  const url = new URL(req.url, `http://${req.headers.host}`);
  if(url.pathname !== '/api/attendance') return send(res,404,{error:'Not found'});
  const className = url.searchParams.get('class');
  const date = url.searchParams.get('date');
  if(!className || !date) return send(res,400,{error:'class dan date wajib diisi'});
  const key = `${className}__${date}`;
  const store = load();
  if(req.method === 'GET') return send(res,200,store[key] || {});
  if(req.method === 'PUT'){
    let raw=''; req.on('data',c=>{ raw += c; if(raw.length > 1000000) req.destroy(); });
    req.on('end',()=>{ try { const value=JSON.parse(raw||'{}'); if(!value || typeof value !== 'object' || Array.isArray(value)) throw Error(); store[key]=value; save(store); send(res,200,{ok:true}); } catch { send(res,400,{error:'JSON tidak valid'}); } });
    return;
  }
  return send(res,405,{error:'Method not allowed'});
});
server.listen(PORT,()=>console.log(`Absensi backend aktif di port ${PORT}`));
