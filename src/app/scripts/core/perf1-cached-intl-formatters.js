
/* perf1: cached Intl formatters */
(function(){for(const K of ['DateTimeFormat','NumberFormat']){const D=Intl[K],C=new Map();const W=function(l,o){const k=JSON.stringify([l,o]);let f=C.get(k);if(!f){f=new D(l,o);C.set(k,f)}return f};W.prototype=D.prototype;W.supportedLocalesOf=D.supportedLocalesOf.bind(D);Intl[K]=W}})();
