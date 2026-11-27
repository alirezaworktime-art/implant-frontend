/* ---------- m21 (owner, 2026-11-13): writing with a pen on tablets (pen notes «توضیح با قلم», the lab-order handwriting page, the signature pad). Before: the palm resting on the screen scrolled the page or the window, text got selected, and when the palm was lifted (or touched the pad) the pen stroke was cut or jumped. Now, for the three pads: (1) one pointer draws at a time; while a pen is near (seen in the last 10 s) finger/palm touches on the pad are ignored, and a pen takes over from a touch; lifting any other finger no longer ends the stroke; leaving the pad edge no longer ends it; (2) while a pad is open and a pen is in use, touches do not scroll the page; (3) while a pad is open nothing but input boxes can be selected, no long-press menu, no drag. Client only. ---------- */
const M21 = { ids: ['fxNtCv', 'h9C', 'sgnPad'], act: null, pen: 0 };
const m21Pad = t => t && t.id && M21.ids.includes(t.id) ? t : null;
const m21Open = () => M21.ids.some(id => { const c = document.getElementById(id); return c && c.isConnected && c.getClientRects().length > 0 });
const m21PenNear = () => Date.now() - M21.pen < 10000;
const m21Cls = () => { const on = m21Open(); if (document.documentElement.classList.contains('m21pen') !== on) document.documentElement.classList.toggle('m21pen', on); return on };
['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'pointerleave', 'pointerout', 'lostpointercapture'].forEach(type => document.addEventListener(type, e => {
  if (e.pointerType === 'pen') M21.pen = Date.now();
  if (type === 'pointerdown') m21Cls();
  const cv = m21Pad(e.target); if (!cv) { return }
  const stop = () => { e.stopImmediatePropagation(); if (type === 'pointerdown' || type === 'pointermove') e.preventDefault() }, a = M21.act && M21.act.cv === cv && cv.isConnected ? M21.act : (M21.act = null);
  if (type === 'pointerdown') {
    if (e.pointerType === 'touch' && m21PenNear()) return stop(); /* palm while a pen is in use */
    if (a) { if (a.id === e.pointerId) return; if (!(e.pointerType === 'pen' && a.type !== 'pen')) return stop(); /* second finger */
      try { cv.dispatchEvent(new PointerEvent('pointerup', { pointerId: a.id, pointerType: a.type, bubbles: false })) } catch (x) { } /* the pen takes over: close the touch stroke */ }
    M21.act = { cv, id: e.pointerId, type: e.pointerType }; try { const s = getSelection(); if (s && s.rangeCount && !s.isCollapsed) s.removeAllRanges() } catch (x) { } return }
  if (type === 'pointerleave' || type === 'pointerout') { if (a) return stop(); return } /* the stroke ends on pointerup, not at the edge */
  if (a && e.pointerId !== a.id) return stop();
  if (!a && type === 'pointermove' && e.pointerType === 'touch' && m21PenNear()) return stop();
  if (a && (type === 'pointerup' || type === 'pointercancel' || type === 'lostpointercapture')) { if (type === 'lostpointercapture') { try { cv.dispatchEvent(new PointerEvent('pointerup', { pointerId: a.id, pointerType: a.type, bubbles: false })) } catch (x) { } } M21.act = null }
}, true));
/* no page scroll from the palm while writing */
document.addEventListener('touchmove', e => { if (!(M21.act || m21PenNear())) return; if (!m21Open()) return; const t = e.target, inPad = !!m21Pad(t); if (!inPad && !M21.act && t && t.closest && t.closest('input,textarea,select')) return; if (e.cancelable) e.preventDefault() }, { passive: false, capture: true });
document.addEventListener('touchstart', e => { if (m21Pad(e.target) && e.cancelable) e.preventDefault() }, { passive: false, capture: true });
['selectstart', 'contextmenu', 'dragstart'].forEach(type => document.addEventListener(type, e => { if (!m21Open()) return; const t = e.target && e.target.nodeType === 3 ? e.target.parentNode : e.target; if (t && t.closest && t.closest('input,textarea,[contenteditable]')) return; if (type === 'contextmenu' && !(m21Pad(t) || M21.act || m21PenNear())) return; e.preventDefault() }, true));
