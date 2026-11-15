/* ===== primitivas SAP GUI ===== */
const E=(h)=>{const d=document.createElement('div');d.innerHTML=h.trim();return d.firstChild;};
let D={};                       /* estado acumulado de datos */
const g=(k,def)=>D[k]!=null?D[k]:(def||'');

const C={
 menubar:(m,sys)=>`<div class="mbar"><span>☰</span>${m.map(x=>`<u><i>${x[0]}</i>${x.slice(1)}</u>`).join('')}
   <span class="sys">${sys}</span><span>▶ 🔓 &nbsp;— ❐ ✕</span></div>`,
 title:(t)=>`<div class="tband"><span>‹</span><span class="logo">SAP</span><span class="ttl">${t}</span></div>`,
 toolbar:(o={})=>`<div class="tbar">${o.nocmd?'':`<span class="cmd" data-t="tcode">${g('tcode')}</span>`}
   ${(o.items||[]).map(i=>typeof i==='string'?`<span class="a">${i}</span>`
     :`<span class="${i.ic?'ic':'a'}${i.red?' red':''}" ${i.k?`data-t="${i.k}"`:''}>${i.t}</span>`).join('')}
   <span class="rt">${(o.right||['🔍','🖨','Finalizar']).map(r=>`<span class="${r==='Finalizar'?'a':''}">${r}</span>`).join('')}</span></div>`,
 field:(f)=>{
   const val=f.k?g(f.k,f.val):(f.val||'');
   if(f.type==='btn') return `<span class="gb w" style="min-width:${f.w||170}px;height:26px" ${f.k?`data-t="${f.k}"`:''}>${f.lb}</span>`;
   if(f.type==='txt') return `<span ${f.k?`data-t="${f.k}"`:''}>${val||f.lb||''}</span>`;
   if(f.type==='sub') return `<span style="display:block;width:100%;margin:2px 0 6px">${f.lb}</span>`;
   if(f.type==='check')return `<span class="ck" ${f.k?`data-t="${f.k}"`:''}><i>${val||f.on?'✓':''}</i>${f.lb||''}</span>`;
   const inner=f.type==='select'
     ?`<span class="sel" style="${f.w?`min-width:${f.w}px`:''}">${val||f.ph||''}</span>`
     :`<span class="in ${f.ro?'ro':''} ${f.txt?'txt':''}" style="${f.w?`min-width:${f.w}px`:''}">${val}</span>`;
   return `<span class="row" style="margin:0;display:inline-flex" ${f.k?`data-t="${f.k}"`:''}>
     ${f.lb?`<span class="lb" style="${f.lw?`width:${f.lw}px`:''}">${f.lb}${f.req?'<span class="req">*</span>':''}</span>`:''}
     ${inner}${f.f4?'<span class="f4">🔍</span>':''}${f.desc?`<span>${f.dk?g(f.dk):f.desc}</span>`:''}</span>`;},
 form:(r)=>r.map(x=>`<div class="row">${x.map(C.field).join('')}</div>`).join(''),
 gbox:(t,r)=>`<div class="gbox">${t?`<div class="gtitle">${t}</div>`:''}${C.form(r)}</div>`,
 radios:(t,i,s)=>`<div class="gbox"><div class="gtitle">${t}</div>${i.map((x,n)=>
   `<div class="rd" data-t="rd-${x}"><i class="${n===s?'on':''}"></i>${x}</div>`).join('')}</div>`,
 tabs:(l,on,id)=>`<div class="tabs" ${id?`data-t="${id}"`:''}><span class="exp">⊟</span>${l.map(t=>
   `<span class="tb ${t===on?'on':''}" data-t="tab-${t}">${t}</span>`).join('')}</div>`,
 alv:(cols,rows,id,min)=>{
   const rs=(typeof rows==='string'?(D[rows]||[]):rows)||[];
   const body=rs.map(r=>`<tr>${r.map(c=>{const o=typeof c==='object'?c:{v:c};
     return `<td class="${o.r?'r':''} ${o.t?'t':''}">${o.v??''}</td>`;}).join('')}</tr>`).join('')
     +Array.from({length:Math.max(0,(min||6)-rs.length)},()=>`<tr>${cols.map(()=>'<td></td>').join('')}</tr>`).join('');
   return `<table class="alv" ${id?`data-t="${id}"`:''}><tr>${cols.map(c=>
     `<th style="width:${c.w||70}px" data-t="col-${id||''}-${c.t}">${c.t}</th>`).join('')}</tr>${body}</table>`;},
 buttons:(l)=>`<div class="btns">${l.map(b=>`<span class="gb" data-t="btn-${b}">${b}</span>`).join('')}</div>`,
 status:(o={})=>{if(o.sin)return '';const m=o.mk?g(o.mk):(o.msg||'');
   return `<div class="status" data-t="status"><span class="${o.err?'e':(o.ok?'o':'')}">${
   o.err?'⛔ ':(o.ok&&m?'✅ ':'')}${m}</span><span class="rt">${(o.btn||[]).map((b,i)=>
   `<span class="pb ${i?'o':''}" data-t="btn-${b}">${b}</span>`).join('')}</span></div>`;}
};

function render(s){
 const R=(r)=>{switch(r.tipo){
  case 'form':   return `<div class="sect">${C.form(r.rows)}</div>`;
  case 'head':   return `<div class="sect" style="padding:9px 12px">${C.form(r.rows)}</div>`;
  case 'cols':   return `<div class="sect"><div class="cols">${r.cols.map(c=>`<div>${C.form(c)}</div>`).join('')}</div></div>`;
  case 'gbox':   return `<div class="sect">${C.gbox(r.titulo,r.rows)}</div>`;
  case 'gcols':  return `<div class="sect"><div class="cols">${r.cols.map(c=>
                    c.radios?C.radios(c.titulo,c.radios,c.sel):C.gbox(c.titulo,c.rows)).join('')}</div></div>`;
  case 'tabs':   return C.tabs(r.items,r.on,r.id);
  case 'panel':  return `<div class="panel">${r.cols?`<div class="cols">${r.cols.map(c=>`<div>${C.form(c)}</div>`).join('')}</div>`:C.form(r.rows||[])}</div>`;
  case 'alv':    return `<div class="sect" style="padding:8px 10px">${r.titulo?`<div style="margin-bottom:5px">${r.titulo}</div>`:''}${C.alv(r.cols,r.rows||[],r.id,r.min)}</div>`;
  case 'buttons':return C.buttons(r.items);
  case 'tree':   return `<div class="tree" data-t="${r.id||'arbol'}"><div class="lp">
                    ${(r.nodos||[]).map(n=>`<div class="tn ${n.c||''}">${n.ar?`<span class="ar">${n.ar}</span>`:''}
                      <span class="fd">${n.ic||''}</span>${n.t}</div>`).join('')}
                    ${Array.from({length:Math.max(0,22-(r.nodos||[]).length)},()=>'<div class="tn"></div>').join('')}
                    <div class="grip">⋮</div></div><div class="rp"></div></div>`;
  case 'cmdbar': return `<div class="cmdbar" data-t="${r.id||'cmdbar'}"><span class="wide"></span>
                    ${(r.btn||[]).map(b=>`<span class="pb" data-t="btn-${b}">${b}</span>`).join('')}</div>`;
  case 'sub':    return `<div class="sect" style="padding:6px 12px;display:flex;gap:9px;align-items:center">
                    <span style="width:20px;height:20px;border:1px solid #8696a9;color:#5b738b;display:inline-flex;
                    align-items:center;justify-content:center;font-size:11px">${r.abierto?'⊟':'⊞'}</span>${r.titulo||''}</div>`;
  default:return '';}};
 return `<div class="gui">${C.menubar(s.menus,s.sistema)}${C.title(s.tk?g(s.tk,s.titulo):s.titulo)}
   ${C.toolbar(s.toolbar||{})}${s.regiones.map(R).join('')}${C.status(s.status||{})}</div>`;
}


/* ===== sociedad operativa — Parametros_SAP_Grupo_Portland_v2.xlsx ===== */
/* n: razón social · c: razón social corta · m: nombre del centro · cen: centro / puesto exped.
   ofi: oficina de ventas · mon: moneda local · alm: almacenes [principal, secundario, otro]   */
const SOCS={
 CL11:{gv:'CL1',n:'DISTRIBUIDORA PORTLAND S.A.',c:'DISTRIBUIDORA PORTLAND',r:'Distribuidora Portland',m:'Portland Chile',cen:'CLD1',ofi:'CLO1',mon:'CLP',p:'Chile',
       alm:['EC01 PLANTA LA GRANJA','EC02 PLANTA SAN ANTONIO','BE01 WAREHOUSING (STGO.)'],ewm:1},
 CL12:{gv:'CL2',n:'EPOXA S.A.',c:'EPOXA',r:'EPOXA',m:'Epoxa Chile',cen:'CLD2',ofi:'CLO2',mon:'CLP',p:'Chile',
       alm:['EC01 PLANTA LA GRANJA','EC02 PLANTA SAN ANTONIO','BE01 WAREHOUSING (STGO.)'],ewm:1},
 CL13:{gv:'CL3',n:'PORTLAND TERMINALES MARITIMOS SPA',c:'PORTLAND TERMINALES MARITIMOS',r:'PTM',m:'PTM Chile',cen:'CLD3',ofi:'CLO3',mon:'CLP',p:'Chile',alm:null},
 CL14:{gv:'CL4',n:'PEREZ & JACARD S.A',c:'PEREZ & JACARD',r:'Perez & Jacard',m:'Perez&Jacard Chile',cen:'CLD4',ofi:'CLO4',mon:'CLP',p:'Chile',alm:null},
 CL15:{gv:'CL5',n:'DP NOVICIADO S.A',c:'DP NOVICIADO',r:'DP Noviciado',m:'DP Noviciado Chile',cen:'CLD5',ofi:'CLO5',mon:'CLP',p:'Chile',alm:null},
 CL16:{gv:'CL6',n:'PJ PORTLAND SPA',c:'PJ PORTLAND',r:'PJ Portland',m:'PJ Portland Chile',cen:'CLA1',ofi:'CLO6',mon:'CLP',p:'Chile',alm:null},
 PE11:{gv:'PE1',n:'PORTLAND PERU SAC',c:'PORTLAND PERU',r:'Portland Perú',m:'Portland Perú',cen:'PED1',ofi:'PE01',mon:'PEN',p:'Perú',
       alm:['2002 TRALSA','2013 DQM 400-11','2019 DQM NO CONFORME']},
 CO11:{gv:'CO1',n:'PORTLAND COLOMBIA SAS',c:'PORTLAND COLOMBIA',r:'Portland Colombia',m:'Portland Colombia',cen:'COD1',ofi:'COO1',mon:'COP',p:'Colombia',
       alm:['PD1B POPULAR DE DEPOSITO (BOGOTA)','AL1M APIX LOGISTICA (MOSQUERA)','BVE1 ALGRANEL BUENAVENTURA']}
};
const ALM_NA='(sin almacén definido)';
function socSel(){
  try{const q=new URLSearchParams(location.search).get('soc'); if(q&&SOCS[q]) return q;}catch(e){}
  try{const v=localStorage.getItem('simsap_soc'); if(v&&SOCS[v]) return v;}catch(e){}
  return null;
}
/* F = sociedad con que está escrito el spec · S = sociedad elegida */
function remapper(S,F){
  const T=SOCS[S]||SOCS[F];
  const alm=(T&&T.alm)||[ALM_NA,ALM_NA,ALM_NA];
  const SK=(S&&SOCS[S])?S:F;
  const ph=s=>s.replace(/\{ALM([123])(c?)\}/g,(m,n,c)=>{const a=alm[n-1]; return c?(a===ALM_NA?a:a.split(' ')[0]):a;})
               .replace(/\{SEGc\}/g,'Z'+SK).replace(/\{SEG\}/g,'Z'+SK+' '+SOCS[SK].n);
  if(!S||S===F) return ph;
  const K=SOCS[F], mapa={};
  [[K.n,T.n],[K.c,T.c],[K.m,T.m],[F,S],[K.cen,T.cen],[K.ofi,T.ofi],[K.mon,T.mon],[K.gv,T.gv]]
    .forEach(([a,b])=>{ if(a!==b) mapa[a]=b; });
  if(F==='PE11') mapa['Portland Peru']=T.r;
  const keys=Object.keys(mapa).sort((a,b)=>b.length-a.length).map(k=>k.replace(/[.*+?^${}()|[\]\\&]/g,'\\$&'));
  const re=keys.length?new RegExp('(?<![A-Za-z0-9])('+keys.join('|')+')(?![A-Za-z0-9])','g'):null;
  return s=>ph(re?s.replace(re,m=>mapa[m]??m):s);
}
function remapDeep(o,f){
  if(typeof o==='string') return f(o);
  if(Array.isArray(o)) return o.map(x=>remapDeep(x,f));
  if(o&&typeof o==='object'){const r={};for(const k in o) r[k]=remapDeep(o[k],f);return r;}
  return o;
}

/* transacción que se muestra en el campo de comandos según la pantalla */
const SCRTX={mm01ini:'MM01',mm01vistas:'MM01',mm01:'MM01',migo:'MIGO',miro:'MIRO',me21n:'ME21N',me21npos:'ME21N',bp:'BP',bpseg:'BP',edoc:'EDOC_COCKPIT',f110:'F110',f110prop:'F110',md04:'MD04',vl06o:'VL06O',
 mi01:'MI01',mmbe:'MMBE',mm01niv:'MM01',vlres:'VL02N',vfres:'VF01'};
/* ===== motor de guía ===== */
let PASOS=[],nav=[],cur=-1,last='';
function boot(G){
 const S=socSel();
 const F=G.soc||'PE11'; G=remapDeep(G,remapper(S,F)); G.soc=F; if(S){ try{localStorage.setItem('simsap_soc',S);}catch(e){} }
 const bk=document.querySelector('#side .bk');
 if(bk && S) bk.href='../compendio.html?soc='+S;
 const sel=document.getElementById('socsel');
 if(sel){
   sel.innerHTML='<option value="">Según manual ('+F+')</option>'+Object.keys(SOCS).map(k=>
     `<option value="${k}" ${k===S?'selected':''}>${k} · ${SOCS[k].r}</option>`).join('');
   sel.onchange=()=>{const v=sel.value; try{v?localStorage.setItem('simsap_soc',v):localStorage.removeItem('simsap_soc');}catch(e){}
     location.search=v?('?soc='+v):'';};
 }
 document.title=G.tx+' · '+G.titulo+' — Simulador SAP Portland';
 document.getElementById('h1').textContent=G.titulo;
 const SS=SOCS[S||F];
 document.getElementById('sub').innerHTML=G.tx+' · '+G.modulo+'<br>'+(G.sub||'')+'<br><b>'+(S||F)+' · '+SS.n+'</b>'+(SS.ewm?'<br>⚠️ Bodegas propias en SAP EWM: algunos pasos de almacén cambian.':'')+(!SS.alm?'<br>⚠️ Sin almacenes definidos en el maestro de parámetros.':'');
 PASOS=G.pasos; const box=document.getElementById('list'); let k=0;
 PASOS.forEach(s=>{
  if(s.g){box.appendChild(E(`<div class="gr">${s.g}</div>`));return;}
  const i=k++; const d=document.createElement('div');
  d.className='st'+(s.crit?' cr':''); d.dataset.i=i;
  d.innerHTML=`<div class="n">${i+1}</div><div>${s.h}</div>`;
  d.onclick=()=>go(i); box.appendChild(d); nav.push(s);
 });
 go(0);
}
function go(i){
 i=Math.max(0,Math.min(nav.length-1,i)); cur=i;
 D={}; for(let j=0;j<=i;j++) Object.assign(D,nav[j].set||{});
 const s=nav[i];
 { let ctx=''; for(let j=0;j<=i;j++){const p=nav[j]; if(p.tc) ctx=p.tc; else if(p.set&&p.set.tcode) ctx=p.set.tcode; else if(SCRTX[p.screen]) ctx=SCRTX[p.screen];}
   D.tcode=ctx; }
 const html=render(SCREENS[s.screen](s.tab));
 if(html!==last){document.getElementById('gui').innerHTML=html;last=html;}
 else{document.querySelectorAll('.hl').forEach(e=>e.classList.remove('hl','hl-cr','hl2'));
      document.querySelectorAll('.badge').forEach(e=>e.remove());}
 document.querySelectorAll('.st').forEach(e=>{const j=+e.dataset.i;
   e.classList.toggle('on',j===i); e.classList.toggle('done',j<i);});
 const el=document.querySelector(`[data-t="${s.target}"]`);
 if(el){el.classList.add('hl'); if(s.crit)el.classList.add('hl-cr');
  if(getComputedStyle(el).position==='static')el.style.position='relative';
  el.appendChild(E(`<span class="badge ${s.crit?'cr':''}">${i+1}</span>`));
  el.scrollIntoView({block:'center',behavior:'smooth'});}
 const prevTab=i>0&&nav[i-1].screen===s.screen?nav[i-1].tab:null;
 const xtra=(s.tab&&s.tab!==prevTab&&!String(s.target).startsWith('tab-'))?[{a:'tab-'+s.tab,nb:1}]:[];
 xtra.forEach(o=>{const x=document.querySelector(`[data-t="${o.a}"]`); if(x){x.classList.add('hl','hl2');}});
 (s.also||[]).forEach((a,n)=>{const x=document.querySelector(`[data-t="${a}"]`); if(!x)return;
   x.classList.add('hl','hl2'); if(getComputedStyle(x).position==='static')x.style.position='relative';
   x.appendChild(E(`<span class="badge b2">${i+1}${'abcdefgh'[n]}</span>`));});
 const t=document.getElementById('tip'); t.className=s.crit?'cr':'';
 t.innerHTML=`<span class="k">Paso ${i+1} de ${nav.length}</span> — ${s.h}<span class="d">${s.d||''}</span>`;
 document.getElementById('pfill').style.width=((i+1)/nav.length*100)+'%';
 document.getElementById('prev').disabled=i===0;
 document.getElementById('next').disabled=i===nav.length-1;
 document.querySelector('.st.on')?.scrollIntoView({block:'nearest'});
}
addEventListener('DOMContentLoaded',()=>{
 document.getElementById('prev').onclick=()=>go(cur-1);
 document.getElementById('next').onclick=()=>go(cur+1);
 addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();go(cur+1);}
  if(e.key==='ArrowLeft')go(cur-1);});
 boot(GUIA);
});
