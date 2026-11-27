/* ---------- m43f (owner, 2026-11-17): manager «تنظیمات» → «پزشکان، کارکنان، سهم پزشک…»: the new name is chosen from the personal accounts of the
   clinic (the people the manager already defined) instead of being typed; «نام دیگر…» still allows typing. The role box follows the account. ---------- */
(function(){
let USERS=null,asked=false;
const nrm=s=>{try{return normN(s)}catch(e){return String(s||'').trim()}};
const KIND={doctor:'doc',surgery:'asst',staff:'recep',consultant:'staff',accountant:'staff',inventory:'staff',lab:'staff',manager:'staff'};
function cand(){const have=((typeof M14!=='undefined'&&M14&&M14.payees)||[]).map(p=>p.name),L=[];(USERS||[]).forEach(u=>{const n=String(u.name||'').trim();if(!n||u.active===0||u.active===false||u.lab)return;if(have.some(x=>nrm(x)===nrm(n))||L.some(x=>nrm(x.n)===nrm(n)))return;L.push({n,r:u.role})});return L}
function fit(){const i=$('m14Name');if(!i||!i.closest('#m14Box'))return;const lab=i.closest('label');if(!lab||lab.querySelector('#m43fSel'))return;const L=cand();
  i.insertAdjacentHTML('beforebegin',`<select id="m43fSel" aria-label="نام تازه"><option value="">— انتخاب کنید —</option>${L.map(x=>`<option value="${esc(x.n)}" data-r="${esc(x.r||'')}">${esc(x.n)}</option>`).join('')}<option value="__">نام دیگر… (نوشتن)</option></select>`);
  i.hidden=true;i.value='';if(!L.length&&USERS){$('m43fSel').value='__';i.hidden=false}}
{const _r=m14Render;m14Render=function(){const r=_r.apply(this,arguments);try{fit();if(!USERS&&!asked&&ROLE==='manager'){asked=true;api('userList',{}).then(j=>{USERS=(j&&(j.items||j.users||j.rows))||[];const s=$('m43fSel');if(s){s.remove();fit()}}).catch(()=>{USERS=[];const s=$('m43fSel');if(s){s.remove();fit()}})}}catch(e){console.error('m43f',e)}return r}}
document.addEventListener('change',e=>{const s=e.target;if(!s||s.id!=='m43fSel')return;const i=$('m14Name');if(!i)return;if(s.value==='__'){i.hidden=false;i.value='';i.focus()}else{i.hidden=true;i.value=s.value;const o=s.options[s.selectedIndex],k=KIND[(o&&o.dataset.r)||''],K=$('m14Kind');if(k&&K)K.value=k}});
window.m43f={cand,reset:()=>{USERS=null;asked=false}};
})();
