// Shared state + utilities for controller <-> viewer sync
(function(){
  const NAMESPACE = 'copa-bushido';
  const bc = ('BroadcastChannel' in window) ? new BroadcastChannel(NAMESPACE) : null;

  function loadState(key, def){
    try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch(e){ return def; }
  }
  function saveState(key, value){
    localStorage.setItem(key, JSON.stringify(value));
    if (bc) bc.postMessage({ key, value });
    else {
      try { if (window.opener) window.opener.postMessage({key, value, ns:NAMESPACE}, '*'); } catch(_){}
      try { if (window.parent && window.parent!==window) window.parent.postMessage({key, value, ns:NAMESPACE}, '*'); } catch(_){}
    }
  }

  window.addEventListener('keydown', (e)=>{
    if (e.key.toLowerCase() === 'd') document.body.classList.toggle('debug');
  });

  window.CB = {
    bc, loadState, saveState,
    stateKeys: {
      sorteopool: 'cb.sorteo.participants',
      sortedPairs: 'cb.sorteo.pairs',
      etiquetaMode: 'cb.sorteo.etiquetaMode',
      kumite: 'cb.kumite.state'
    },
    openPopup(url){
      const w = 1280, h = 720;
      const left = Math.max(0, (screen.width - w)/2);
      const top = Math.max(0, (screen.height - h)/2);
      const win = window.open(url, 'copa_bushido_view', `width=${w},height=${h},left=${left},top=${top}`);
      return win;
    },
    shuffle(arr){
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
  };

  if (bc) {
    bc.onmessage = (e)=>{
      const {key, value} = e.data || {};
      if (key && typeof window.onCBState === 'function') window.onCBState(key, value);
    };
  } else {
    window.addEventListener('message', (e)=>{
      const data = e.data || {}; if (data.ns !== NAMESPACE) return;
      const {key, value} = data;
      if (key && typeof window.onCBState === 'function') window.onCBState(key, value);
    });
  }
})();