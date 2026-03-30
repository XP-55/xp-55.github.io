const q=(s)=>document.querySelector(s);

const b64urlDecode=(str)=>{
  str=str.trim();
  str=str.replace(/-/g,"+").replace(/_/g,"/");
  const pad=str.length%4?4-(str.length%4):0;
  str=str+"=".repeat(pad);
  const bin=atob(str);
  const bytes=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
};
const b64urlEncode=(str)=>{
  const bytes=new TextEncoder().encode(str);
  let bin="";for(let i=0;i<bytes.length;i++)bin+=String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
};
const tryJSON=(s)=>{try{return JSON.stringify(JSON.parse(s),null,2)}catch{return s}};

// IP
(() => {
  const ipInput=q("#ip-input");
  const ipLookup=q("#ip-lookup");
  const ipMy=q("#ip-my");
  const ipResult=q("#ip-result");
  if(!ipResult) return;
  const render=(obj)=>{ipResult.textContent=JSON.stringify(obj,null,2)};
  const lookupSelf=async()=>{
    try{
      const v4=await fetch("https://api.ipify.org?format=json").then(r=>r.json()).catch(()=>null);
      const v6=await fetch("https://api64.ipify.org?format=json").then(r=>r.json()).catch(()=>null);
      let geo=null;
      try{ geo=await fetch("https://ipapi.co/json/").then(r=>r.json()) }catch{}
      render({ipv4:v4&&v4.ip,ipv6:v6&&v6.ip,geo:geo&&{ip:geo.ip,country:geo.country_name,region:geo.region,city:geo.city,asn:geo.asn,org:geo.org}});
    }catch{ ipResult.textContent="查询失败" }
  };
  ipMy&&ipMy.addEventListener("click",lookupSelf);
  ipLookup&&ipLookup.addEventListener("click",async()=>{
    const v=(ipInput&&ipInput.value||"").trim();
    if(!v){ lookupSelf(); return }
    try{
      const geo=await fetch(`https://ipapi.co/${encodeURIComponent(v)}/json/`).then(r=>r.json());
      render(geo);
    }catch{ ipResult.textContent="查询失败" }
  });
})();

// JWT
(() => {
  const input=q("#jwt-input");
  const outH=q("#jwt-header");
  const outP=q("#jwt-payload");
  const err=q("#jwt-error");
  if(!input) return;
  const parse=()=>{
    if(err) err.textContent="";
    if(outH) outH.textContent="-";
    if(outP) outP.textContent="-";
    const raw=input.value.trim();
    if(!raw) return;
    const parts=raw.split(".");
    if(parts.length<2){ if(err) err.textContent="格式错误：应为 header.payload.signature"; return }
    try{
      const h=b64urlDecode(parts[0]);
      const p=b64urlDecode(parts[1]);
      if(outH) outH.textContent=tryJSON(h);
      if(outP) outP.textContent=tryJSON(p);
    }catch(e){ if(err) err.textContent=e.message||"解析失败" }
  };
  input.addEventListener("input",parse);
})();

// 时间戳
(() => {
  const input=q("#ts-input");
  const local=q("#ts-local");
  const utc=q("#ts-utc");
  const sec=q("#ts-seconds");
  const ms=q("#ts-millis");
  const nowS=q("#ts-now-sec");
  const nowM=q("#ts-now-ms");
  if(!local) return;
  const fmt=(d)=>{
    const f=new Intl.DateTimeFormat(undefined,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"});
    return f.format(d);
  };
  const compute=()=>{
    const v=(input&&input.value||"").trim();
    if(!v){ local.textContent=utc.textContent=sec.textContent=ms.textContent="-"; return }
    let n=Number(v);
    if(Number.isNaN(n)){ local.textContent="无效时间戳"; utc.textContent=sec.textContent=ms.textContent="-"; return }
    if(v.length<=10) n*=1000;
    const d=new Date(n);
    local.textContent=fmt(d);
    utc.textContent=d.toISOString().replace("T"," ").replace("Z"," UTC");
    sec.textContent=Math.floor(n/1000).toString();
    ms.textContent=Math.floor(n).toString();
  };
  input&&input.addEventListener("input",compute);
  nowS&&nowS.addEventListener("click",()=>{ if(input){ input.value=Math.floor(Date.now()/1000).toString(); input.dispatchEvent(new Event("input")) }});
  nowM&&nowM.addEventListener("click",()=>{ if(input){ input.value=Date.now().toString(); input.dispatchEvent(new Event("input")) }});
})();

// 文本 Base64
(() => {
  const tin=q("#b64t-input");
  const tout=q("#b64t-output");
  const encBtn=q("#b64t-encode");
  const decBtn=q("#b64t-decode");
  const urlsafe=q("#b64t-urlsafe");
  if(!tout) return;
  const enc=()=>{
    const t=tin&&tin.value||"";
    if(urlsafe&&urlsafe.checked){ tout.value=b64urlEncode(t); return }
    const bytes=new TextEncoder().encode(t); let bin=""; for(let i=0;i<bytes.length;i++) bin+=String.fromCharCode(bytes[i]);
    tout.value=btoa(bin);
  };
  const dec=()=>{
    const v=tin&&tin.value||"";
    try{
      if(urlsafe&&urlsafe.checked){ tout.value=b64urlDecode(v); return }
      const bin=atob(v); const bytes=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
      tout.value=new TextDecoder().decode(bytes);
    }catch{ tout.value="解码失败" }
  };
  encBtn&&encBtn.addEventListener("click",enc);
  decBtn&&decBtn.addEventListener("click",dec);
})();

