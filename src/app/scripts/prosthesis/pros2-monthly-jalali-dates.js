/* ---------- pros2: monthly jalali dates ---------- */
function jAddM(iso,n){if(!iso)return '';if(!n)return iso;const p=toEn(jDay(iso)).split('/').map(Number);let y=p[0],m=p[1]+n;while(m>12){m-=12;y++}const ml=m<=6?31:m<=11?30:(parseJ(y+'/12/30')&&toEn(jDay(parseJ(y+'/12/30'))).endsWith('/12/30')?30:29);return parseJ(y+'/'+m+'/'+Math.min(p[2],ml))}
const mkSheet=(id,inner)=>{let s=$(id);if(!s){s=document.createElement('div');s.className='sheet';s.id=id;s.hidden=true;document.body.appendChild(s)}s.innerHTML='<div class="in">'+inner+'</div>';return s};

