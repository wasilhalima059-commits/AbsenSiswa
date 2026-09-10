const http=require('http'),fs=require('fs'),path=require('path');
const PORT=process.env.PORT||3000,ATT=path.join(__dirname,'attendance_store.json'),STU=path.join(__dirname,'students_store.json');
function read(file,fallback={}){try{return JSON.parse(fs.readFileSync(file,'utf8'))}catch{return fallback}}
function write(file,data){fs.writeFileSync(file,JSON.stringify(data,null,2))}
function send(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,PUT,OPTIONS','Access-Control-Allow-Headers':'Content-Type'});res.end(JSON.stringify(data))}
function body(req){return new Promise((resolve,reject)=>{let s='';req.on('data',c=>s+=c);req.on('end',()=>{try{resolve(s?JSON.parse(s):{})}catch(e){reject(e)}})})}
const server=http.createServer(async(req,res)=>{if(req.method==='OPTIONS')return send(res,204,{});const u=new URL(req.url,`http://${req.headers.host}`);if(u.pathname==='/api/attendance'){const cls=u.searchParams.get('class')||'',year=u.searchParams.get('year')||'2026/2027',date=u.searchParams.get('date')||'';const key=`${cls}__${year}__${date}`,db=read(ATT);if(req.method==='GET')return send(res,200,db[key]||{});if(req.method==='PUT'){const b=await body(req);db[key]=b;write(ATT,db);return send(res,200,{ok:true})}}
if(u.pathname==='/api/students'){const cls=u.searchParams.get('class')||'',db=read(STU);if(req.method==='GET')return send(res,200,db[cls]||[]);if(req.method==='PUT'){const b=await body(req);db[cls]=Array.isArray(b)?b:[];write(STU,db);return send(res,200,{ok:true})}}
return send(res,404,{error:'Not found'})});server.listen(PORT,()=>console.log(`Absensi backend berjalan di port ${PORT}`));
