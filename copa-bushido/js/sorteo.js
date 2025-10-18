(function(){
  const { loadState, saveState, stateKeys, openPopup, shuffle } = window.CB;
  const KEY_POOL = stateKeys.sorteopool;
  const KEY_PAIRS = stateKeys.sortedPairs;
  const KEY_ETMODE = stateKeys.etiquetaMode;

  let participantes = loadState(KEY_POOL, []);
  let pairs = loadState(KEY_PAIRS, []);
  let etiquetaMode = loadState(KEY_ETMODE, false);

  document.addEventListener('DOMContentLoaded', ()=>{
    mkHot('Volver', '--sorteo-volver-left','--sorteo-volver-top','--sorteo-volver-w','--sorteo-volver-h', ()=>{
      window.location.href = 'index.html';
    });
    mkHot('Pantalla emergente', '--sorteo-pop-left','--sorteo-pop-top','--sorteo-pop-w','--sorteo-pop-h', ()=>{
      openPopup('sorteo_view.html');
      saveState(KEY_POOL, participantes);
      saveState(KEY_PAIRS, pairs);
    });
    mkHot('Etiqueta', '--sorteo-etiqueta-left','--sorteo-etiqueta-top','--sorteo-etiqueta-w','--sorteo-etiqueta-h', ()=>{
      etiquetaMode = !etiquetaMode;
      saveState(KEY_ETMODE, etiquetaMode);
      renderList();
    });
    mkHot('Girar', '--sorteo-girar-left','--sorteo-girar-top','--sorteo-girar-w','--sorteo-girar-h', ()=>{
      doPairing();
    });

    buildListArea();
    renderList();
  });

  function mkHot(label, left, top, w, h, onClick){
    const el = document.createElement('button');
    el.className = 'hotspot';
    el.setAttribute('aria-label', label);
    el.style.left = `var(${left})`;
    el.style.top = `var(${top})`;
    el.style.width = `var(${w})`;
    el.style.height = `var(${h})`;
    el.addEventListener('click', onClick);
    document.body.appendChild(el);
  }

  let listArea;
  function buildListArea(){
    listArea = document.createElement('div');
    listArea.style.position = 'absolute';
    listArea.style.left = 'var(--sorteo-list-left)';
    listArea.style.top = 'var(--sorteo-list-top)';
    listArea.style.width = 'var(--sorteo-list-w)';
    listArea.style.height = 'var(--sorteo-list-h)';
    listArea.style.overflow = 'auto';
    listArea.style.scrollbarWidth = 'none';
    listArea.style.msOverflowStyle = 'none';
    listArea.className = 'sorteo-listarea';
    const style = document.createElement('style');
    style.textContent = '.sorteo-listarea::-webkit-scrollbar{display:none;}';
    document.head.appendChild(style);
    document.body.appendChild(listArea);

    if (participantes.length === 0) {
      for (let i=0;i<8;i++) participantes.push({id:crypto.randomUUID(), nombre:'', etiqueta:null});
      saveState(KEY_POOL, participantes);
    }
  }

  function renderList(){
    listArea.innerHTML = '';
    const rowH = 36;
    participantes.forEach((p, idx)=>{
      const row = document.createElement('div');
      row.style.position = 'relative';
      row.style.height = rowH+'px';
      row.style.margin = '4px 0';
      row.dataset.id = p.id;

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'invisible-input';
      input.style.left = '0';
      input.style.top = '4px';
      input.style.width = '60%';
      input.style.color = '#fff';
      input.placeholder = '';
      input.value = p.nombre;
      input.addEventListener('change', ()=>{
        p.nombre = input.value.trim();
        saveState(KEY_POOL, participantes);
      });
      input.addEventListener('keydown', (e)=>{
        if (e.key === 'Enter') {
          if (idx === participantes.length - 1) {
            participantes.push({id:crypto.randomUUID(), nombre:'', etiqueta:null});
            saveState(KEY_POOL, participantes);
            renderList();
            setTimeout(()=>{
              const last = listArea.querySelector('input.invisible-input:last-of-type');
              last && last.focus();
            }, 0);
          } else {
            const next = input.parentElement.nextSibling?.querySelector('input');
            next && next.focus();
          }
        }
        if (etiquetaMode){
          if (e.key.toLowerCase() === 'm'){ p.etiqueta = 'M'; e.preventDefault(); saveState(KEY_POOL, participantes); renderList(); }
          if (e.key.toLowerCase() === 'j'){ p.etiqueta = 'J'; e.preventDefault(); saveState(KEY_POOL, participantes); renderList(); }
          if (e.key.toLowerCase() === 'x'){ p.etiqueta = null; e.preventDefault(); saveState(KEY_POOL, participantes); renderList(); }
        }
      });

      row.addEventListener('click', ()=>{
        if (!etiquetaMode) return;
        p.etiqueta = p.etiqueta === 'M' ? 'J' : p.etiqueta === 'J' ? null : 'M';
        saveState(KEY_POOL, participantes);
        renderList();
      });

      row.appendChild(input);
      listArea.appendChild(row);
    });
  }

  function doPairing(){
    const arr = participantes.filter(p => p.nombre);
    if (arr.length < 2){
      saveState(KEY_PAIRS, []);
      return;
    }
    const pool = shuffle(arr.slice());
    const Gm = pool.filter(p=>p.etiqueta==='M');
    const Gj = pool.filter(p=>p.etiqueta==='J');
    const Gu = pool.filter(p=>!p.etiqueta);
    const result = [];
    function pop(arr){ return arr.length ? arr.splice(Math.floor(Math.random()*arr.length),1)[0] : null; }
    while (Gm.length && Gj.length){ result.push([pop(Gm), pop(Gj)]); }
    while (Gm.length && Gu.length){ result.push([pop(Gm), pop(Gu)]); }
    while (Gj.length && Gu.length){ result.push([pop(Gj), pop(Gu)]); }
    while (Gm.length >= 2){ result.push([pop(Gm), pop(Gm)]); }
    while (Gj.length >= 2){ result.push([pop(Gj), pop(Gj)]); }
    let single = Gm[0] || Gj[0] || Gu[0] || null;
    if (single) result.push([single, null]); // BYE
    const pairs = result.map(([a,b])=> ({ a: a ? {n:a.nombre,e:a.etiqueta} : null, b: b ? {n:b.nombre,e:b.etiqueta} : null }));
    saveState(KEY_PAIRS, pairs);
  }

  window.onCBState = (key, value)=>{
    if (key === KEY_POOL){ participantes = value; renderList(); }
    if (key === KEY_PAIRS){ /* no animation in controller */ }
    if (key === KEY_ETMODE){ etiquetaMode = value; }
  };
})();