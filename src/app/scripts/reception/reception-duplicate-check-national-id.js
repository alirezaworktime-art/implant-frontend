/* ---------- reception: duplicate check + national id ---------- */
let DUP_T=null;
function rcDupCheck(){clearTimeout(DUP_T);DUP_T=setTimeout(()=>{const el=$('rcDup');if(!el)return;const nid=toEn($('rc_nid').value).replace(/\D/g,''),ph=toEn($('rc_phone').value).replace(/\D/g,''),nm=$('rc_name').value.trim();
    $('rcNidW').hidden=true;
    if(!nid){el.hidden=true;return}
    const hits=[...ARCHIVE.map(d=>({id:d.id,name:d.name,nid:d.nid,jalali:d.jalali,st:statusKey(d)})),...QITEMS.filter(x=>!ARCHIVE.some(a=>a.id===x.id)).map(x=>({id:x.id,name:x.name,nid:x.nid,phone:x.phone,st:'wait'}))]
      .filter(x=>(RC_EDIT!==x.id)&&(nid&&toEn(x.nid||'')===nid));
    if(!hits.length){el.hidden=true;return}
    const x=hits[0];el.hidden=false;el.innerHTML=`این بیمار قبلاً پرونده دارد: <b>${esc(x.name)}</b>${x.jalali?' · تأیید '+esc(x.jalali):''} <button class="btn sm ghost" type="button" data-file="${esc(x.id)}" data-fname="${esc(x.name)}">دیدن پرونده</button>`},350)}

