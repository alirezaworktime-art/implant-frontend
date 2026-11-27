/* ---------- events ---------- */
document.addEventListener('click',async e=>{const t=e.target.closest&&e.target.closest('button');if(!t)return;
  if(t.id==='tabFin'){if(dirty&&!$('viewForm').hidden){alertMsg('اول فرم را ذخیره کنید.');return}show('fin');return}
  if(t.dataset.fsec){FIN.sec=t.dataset.fsec;finRender();return}
  if(t.dataset.perk){const [id,k]=t.dataset.perk.split(':');FIN.per[id]=perRange(k);finRender();return}
  if(t.dataset.pergo){perRead(t.dataset.pergo);finRender();return}
  if(t.dataset.frc){const [pid,st]=t.dataset.frc.split(':');t.disabled=true;try{await api('paySet',{pid,st});await api('finSync');finMsg(st==='ok'?'چک وصول شد و به بانک رفت.':st==='bounce'?'چک برگشتی ثبت شد؛ مبلغ دوباره بدهی بیمار شد.':'به انتظار برگشت.');finRender()}catch(err){finMsg(err.message,1);t.disabled=false}return}
  if(t.dataset.mvgo==='rcv'){const day=parseJ($('mv_day').value.trim());t.disabled=true;try{await api('finMove',{sendId:uuid(),m:{t:'rcv',day,amount:mv('mv_amt'),from:$('mv_from').value,acc:$('mv_acc').value,desc:$('mv_desc').value}});finMsg('دریافت ثبت شد.');finRender()}catch(err){finMsg(err.message,1)}finally{t.disabled=false}return}
  if(t.dataset.pyt){FIN.pay.t=t.dataset.pyt;const c=t.closest('section');c.innerHTML='<h3>پرداخت</h3>'+payForm();payHow();return}
  if(t.id==='pyGo'){payGo(t);return}
  if(t.id==='byGo'){const day=parseJ($('by_day').value.trim());t.disabled=true;try{await api('finMove',{sendId:uuid(),m:{t:'buy',day,pname:$('by_v').value.trim(),acc:$('by_acc').value,amount:mv('by_amt'),vat:mv('by_vat'),desc:$('by_desc').value.trim()?'خرید از '+$('by_v').value.trim()+' — '+$('by_desc').value.trim():''}});finMsg('خرید ثبت شد.');finRender()}catch(err){finMsg(err.message,1)}finally{t.disabled=false}return}
  if(t.dataset.fco){const [id,op]=t.dataset.fco.split(':');let day='';if(op==='paid'){const d=await uxPrompt('تاریخ پاس شدن (خالی = تاریخ سررسید)','','date','ثبت پاس شدن','پاس شدن چک');if(d===null)return;day=d?parseJ(d):''}else if(!await uxConfirm(op==='void'?'این چک باطل شود؟':op==='bounce'?'برگشت چک ثبت شود؟':'پاس شدن برگردانده شود؟',op==='void'?'ابطال چک':op==='bounce'?'ثبت برگشت چک':'برگرداندن پاس شدن',true))return;
    try{await api('finChqo',{op,id,day});finMsg('انجام شد.');finRender()}catch(err){finMsg(err.message,1)}return}
  if(t.id==='xfGo'){t.disabled=true;try{await api('finMove',{sendId:uuid(),m:{t:'xfer',day:parseJ($('xf_day').value.trim()),from:$('xf_from').value,to:$('xf_to').value,amount:mv('xf_amt'),fee:mv('xf_fee'),desc:$('xf_desc').value.trim()}});finMsg('انتقال ثبت شد.');finRender()}catch(err){finMsg(err.message,1)}finally{t.disabled=false}return}
  if(t.dataset.fdp){FIN.docp=t.dataset.fdp;finRender();return}
  if(t.dataset.fdpay){FIN.sec='pay';FIN.pay.t='doctor';await finRender();if($('py_party'))$('py_party').value='d:'+t.dataset.fdpay;return}
  if(t.id==='prGo'){FIN.pm=[Number(toEn($('pr_y').value))||jYM()[0],Number($('pr_m').value)];finRender();return}
  if(t.dataset.prslip!==undefined){const x=FIN.prows[+t.dataset.prslip],[y,m]=FIN.pm||jYM();printHTML(prSlip(x,jmRange(y,m).l));return}
  if(t.dataset.prsave!==undefined){const [y,m]=FIN.pm||jYM(),r=jmRange(y,m),post=t.dataset.prsave==='1';if(post&&!await uxConfirm('سند حقوق '+r.l+' ثبت شود؟ بعد از ثبت، فقط با ابطال سند قابل تغییر است.','ثبت سند حقوق',false))return;
    t.disabled=true;try{await api('finPayrollSave',{month:r.k,day:parseJ($('pr_day').value.trim()),post,rows:FIN.prows});finMsg(post?'سند حقوق ثبت شد.':'محاسبه و ذخیره شد.');finRender()}catch(err){finMsg(err.message,1)}finally{t.disabled=false}return}
  if(t.id==='vfAdd'){vRead();FIN.vl.push({acc:'',dr:0,cr:0});t.closest('section').innerHTML='<h3>سند دستی</h3>'+vForm();return}
  if(t.dataset.vld!==undefined){vRead();FIN.vl.splice(+t.dataset.vld,1);t.closest('section').innerHTML='<h3>سند دستی</h3>'+vForm();return}
  if(t.id==='vfGo'){vRead();const day=parseJ(FIN.vday);t.disabled=true;try{await api('finMove',{sendId:uuid(),m:{t:'voucher',day,desc:FIN.vdesc,open:FIN.vopen,lines:FIN.vl.map(l=>({acc:l.acc,dr:l.dr,cr:l.cr,pname:l.pname,party:l.pname?'o:'+normN(l.pname):''}))}});FIN.vl=null;FIN.vdesc='';finMsg('سند ثبت شد.');finRender()}catch(err){finMsg(err.message,1)}finally{t.disabled=false}return}
  if(t.dataset.fjv){const n=await uxPrompt('علت ابطال سند','','text','ابطال سند','ابطال سند');if(!n)return;try{await api('finDocVoid',{did:t.dataset.fjv,note:n});finMsg('سند باطل شد.');finRender()}catch(err){finMsg(err.message,1)}return}
  if(t.dataset.fla){FIN.led={acc:t.dataset.fla,party:''};await finRender();$('fl_acc')&&$('fl_acc').scrollIntoView({behavior:'smooth'});return}
  if(t.dataset.flp!==undefined){FIN.led={acc:FIN.pacc||'1106',party:t.dataset.flp,pn:t.dataset.flpn};await finRender();$('fl_acc')&&$('fl_acc').scrollIntoView({behavior:'smooth'});return}
  if(t.id==='flNoP'){FIN.led.party='';finRender();return}
  if(t.id==='bdGo'){FIN.by=Number(toEn($('bd_y').value))||jYM()[0];FIN.bm=Number($('bd_m').value);finRender();return}
  if(t.dataset.bdsave){const y=FIN.by||jYM()[0],m=FIN.bm||jYM()[1],months=t.dataset.bdsave==='12'?[...Array(12)].map((_,i)=>jmRange(y,i+1).k):[jmRange(y,m).k],rows=[];document.querySelectorAll('[data-bd]').forEach(i=>months.forEach(k=>rows.push({month:k,acc:i.dataset.bd,amount:mvv(i.value)})));
    try{await api('finBudget',{op:'save',rows});finMsg('بودجه ذخیره شد.');finRender()}catch(err){finMsg(err.message,1)}return}
  if(t.dataset.fst){FIN.stab=t.dataset.fst;finRender();return}
  if(t.dataset.fse!==undefined){const [k,id]=t.dataset.fse.split(':');fseEdit(k,id);return}
  if(t.dataset.sesave){const [k,id]=t.dataset.sesave.split(':');fseSave(k,id);return}
  if(t.id==='seClose'){$('fsSheet').hidden=true;return}
  if(t.id==='feeSave'){const rows=[...document.querySelectorAll('[data-fee]')].map(i=>{const [svc,payee]=i.dataset.fee.split('|');return {svc,payee,amount:mvv(i.value)}});t.disabled=true;try{await api('finCatSave',{t:'fees',x:{rows}});finMsg('تعرفه‌ی سهم پزشکان ذخیره شد.');await finCat(true)}catch(err){finMsg(err.message,1)}finally{t.disabled=false}return}
  if(t.id==='costSave'){const rows=[...document.querySelectorAll('[data-cost]')].map(i=>({k:i.dataset.cost,cost:mvv(i.value)}));try{await api('finCatSave',{t:'cost',x:{rows}});finMsg('ذخیره شد.')}catch(err){finMsg(err.message,1)}return}
  if(t.id==='gsSave'){const x={};['vatRate','insEmp','insEr','taxRate','stdHours','otRate'].forEach(k=>x[k]=toEn($('gs_'+k).value));['taxFree','labUnit'].forEach(k=>x[k]=mv('gs_'+k));['posAcc','bankAcc','cashAcc'].forEach(k=>x[k]=$('gs_'+k).value);
    x.vatCats=[...document.querySelectorAll('[data-gvc]')].filter(i=>i.checked).map(i=>i.dataset.gvc);const ld=$('gs_lockDay').value.trim();x.lockDay=ld?parseJ(ld):'';if(ld&&!x.lockDay)return finMsg('تاریخ بستن دوره را درست بنویسید.',1);
    try{await api('finCatSave',{t:'set',x});finMsg('تنظیمات ذخیره شد.');await finCat(true)}catch(err){finMsg(err.message,1)}return}});
function vRead(){FIN.vday=($('vf_day')||{}).value||FIN.vday;FIN.vdesc=($('vf_desc')||{}).value||'';FIN.vopen=!!($('vf_open')&&$('vf_open').checked);document.querySelectorAll('[data-vl]').forEach(i=>{const l=FIN.vl[+i.dataset.i];if(!l)return;const k=i.dataset.vl;if(k==='dr'||k==='cr')l[k]=mvv(i.value);else if(k==='party')l.pname=i.value.trim();else l[k]=i.value})}
document.addEventListener('change',async e=>{const t=e.target;if(!t||!t.id&&!t.dataset)return;
  if(t.id==='py_how'){payHow();return}
  if(t.id==='fiQ'){FIN.invq=t.value.trim();finRender();return}
  if(t.id==='jr_src'){FIN.jsrc=t.value;finRender();return}if(t.id==='jr_void'){FIN.jvoid=t.checked;finRender();return}
  if(t.id==='tb_lvl'){FIN.tlvl=t.value;finRender();return}if(t.id==='fl_acc'){FIN.led={acc:t.value,party:''};finRender();return}if(t.id==='fp_acc'){FIN.pacc=t.value;finRender();return}
  if(t.id==='rc_acc'){FIN.rec.acc=t.value;finRender();return}if(t.id==='rc_stm'){FIN.rec.stm=mvv(t.value);finRender();return}
  if(t.dataset&&t.dataset.frec){try{await api('finRec',{lid:t.dataset.frec,on:t.checked})}catch(err){finMsg(err.message,1)}return}
  if(t.dataset&&t.dataset.vl){vRead();t.closest('section').innerHTML='<h3>سند دستی</h3>'+vForm();return}
  if(t.dataset&&t.dataset.pr){const x=FIN.prows[+t.dataset.i];if(!x)return;x[t.dataset.pr]=t.dataset.pr==='otH'?Number(toEn(t.value))||0:mvv(t.value)}});

