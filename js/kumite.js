(function(){
  const { loadState, saveState, stateKeys, openPopup } = window.CB;
  const KEY = stateKeys.kumite;

  let state = loadState(KEY, {
    timeSec: 120,
    running: false,
    aka: { waza:0, ippon:0, pen:0, dq:false },
    shi: { waza:0, ippon:0, pen:0, dq:false },
    finInmediata: true,
    puntosParaGanar: 1
  });

  let raf = null, lastTick = 0;

  document.addEventListener('DOMContentLoaded', ()=>{
    mkHot('Volver', '--kumite-volver-left','--kumite-volver-top','--kumite-volver-w','--kumite-volver-h', ()=>{
      window.location.href = 'index.html';
    });
    mkHot('Pantalla emergente', '--kumite-pop-left','--kumite-pop-top','--kumite-pop-w','--kumite-pop-h', ()=>{
      openPopup('kumite_view.html');
      saveState(KEY, state);
    });
    mkHot('Fin inmediata por ippon', '--kumite-fin-left','--kumite-fin-top','--kumite-fin-w','--kumite-fin-h', ()=>{
      state.finInmediata = !state.finInmediata;
      saveState(KEY, state);
    });
    mkHot('Puntos para ganar', '--kumite-pg-left','--kumite-pg-top','--kumite-pg-w','--kumite-pg-h', ()=>{
      const val = prompt('Cantidad de IPPONES para ganar (entero >=1):', String(state.puntosParaGanar));
      if (val==null) return;
      const n = parseInt(val, 10);
      if (!isFinite(n) || n < 1) return;
      state.puntosParaGanar = n;
      saveState(KEY, state);
    });
    mkHot('Iniciar', '--kumite-init-left','--kumite-init-top','--kumite-init-w','--kumite-init-h', ()=>{
      if (!state.running){
        state.running = true; lastTick = performance.now();
        loop();
        saveState(KEY, state);
      }
    });
    mkHot('Reiniciar tiempo', '--kumite-reinit-left','--kumite-reinit-top','--kumite-reinit-w','--kumite-reinit-h', ()=>{
      state.timeSec = defaultSeconds();
      state.running = false;
      saveState(KEY, state);
      render();
    });
    mkHot('Reiniciar todo', '--kumite-reset-left','--kumite-reset-top','--kumite-reset-w','--kumite-reset-h', ()=>{
      state = {
        timeSec: defaultSeconds(),
        running: false,
        aka: { waza:0, ippon:0, pen:0, dq:false },
        shi: { waza:0, ippon:0, pen:0, dq:false },
        finInmediata: state.finInmediata,
        puntosParaGanar: state.puntosParaGanar
      };
      saveState(KEY, state);
      render();
    });
    mkHot('2 minutos', '--kumite-2m-left','--kumite-2m-top','--kumite-2m-w','--kumite-2m-h', ()=>{
      state.timeSec = 120; state.running=false; saveState(KEY, state); render();
    });
    mkHot('5 minutos', '--kumite-5m-left','--kumite-5m-top','--kumite-5m-w','--kumite-5m-h', ()=>{
      state.timeSec = 300; state.running=false; saveState(KEY, state); render();
    });
    mkHot('Tiempo a elección', '--kumite-anytime-left','--kumite-anytime-top','--kumite-anytime-w','--kumite-anytime-h', ()=>{
      const val = prompt('Minutos (1-10):', String(Math.round(state.timeSec/60)));
      if (val==null) return;
      const n = parseInt(val,10);
      if (!isFinite(n) || n<1 || n>10) return;
      state.timeSec = n*60; state.running=false; saveState(KEY, state); render();
    });
    mkCounter('--aka-waza-left','--aka-waza-top','--aka-waza-w','--aka-waza-h', ()=>{ state.aka.waza=Math.max(0, state.aka.waza-1); commit(); }, ()=>{ state.aka.waza+=1; commit(); });
    mkCounter('--aka-ippon-left','--aka-ippon-top','--aka-ippon-w','--aka-ippon-h', ()=>{ state.aka.ippon=Math.max(0, state.aka.ippon-1); commit(); }, ()=>{ state.aka.ippon+=1; checkWin(); commit(); });
    mkCounter('--aka-pen-left','--aka-pen-top','--aka-pen-w','--aka-pen-h', ()=>{ state.aka.pen=Math.max(0, state.aka.pen-1); commit(); }, ()=>{ state.aka.pen=Math.min(3, state.aka.pen+1); if (state.aka.pen>=3){ state.aka.dq=true; } commit(); });
    mkCounter('--shi-waza-left','--shi-waza-top','--shi-waza-w','--shi-waza-h', ()=>{ state.shi.waza=Math.max(0, state.shi.waza-1); commit(); }, ()=>{ state.shi.waza+=1; commit(); });
    mkCounter('--shi-ippon-left','--shi-ippon-top','--shi-ippon-w','--shi-ippon-h', ()=>{ state.shi.ippon=Math.max(0, state.shi.ippon-1); commit(); }, ()=>{ state.shi.ippon+=1; checkWin(); commit(); });
    mkCounter('--shi-pen-left','--shi-pen-top','--shi-pen-w','--shi-pen-h', ()=>{ state.shi.pen=Math.max(0, state.shi.pen-1); commit(); }, ()=>{ state.shi.pen=Math.min(3, state.shi.pen+1); if (state.shi.pen>=3){ state.shi.dq=true; } commit(); });
    buildOverlays();
    render();
  });

  function defaultSeconds(){ return state.timeSec>0? state.timeSec : 120; }

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

  function mkCounter(left, top, w, h, onLeft, onRight){
    const el = document.createElement('div');
    el.className = 'hotspot';
    el.style.left = `var(${left})`;
    el.style.top = `var(${top})`;
    el.style.width = `var(${w})`;
    el.style.height = `var(${h})`;
    el.addEventListener('click', (e)=>{
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < rect.width/2) onLeft(); else onRight();
    });
    document.body.appendChild(el);
  }

  let timerText, akaScoreText, shiScoreText;
  function buildOverlays(){
    timerText = document.createElement('div');
    timerText.className='overlay-text';
    timerText.style.left = 'var(--kumite-time-disp-left)';
    timerText.style.top = 'var(--kumite-time-disp-top)';
    timerText.style.width = 'var(--kumite-time-disp-w)';
    timerText.style.height = 'var(--kumite-time-disp-h)';
    timerText.style.fontSize = '56px';
    timerText.style.textAlign = 'center';
    document.body.appendChild(timerText);
    akaScoreText = document.createElement('div');
    akaScoreText.className='overlay-text';
    akaScoreText.style.left = 'var(--kumite-score-aka-left)';
    akaScoreText.style.top = 'var(--kumite-score-aka-top)';
    akaScoreText.style.width = 'var(--kumite-score-aka-w)';
    akaScoreText.style.height = 'var(--kumite-score-aka-h)';
    akaScoreText.style.fontSize = '40px';
    akaScoreText.style.textAlign = 'center';
    document.body.appendChild(akaScoreText);
    shiScoreText = document.createElement('div');
    shiScoreText.className='overlay-text';
    shiScoreText.style.left = 'var(--kumite-score-shi-left)';
    shiScoreText.style.top = 'var(--kumite-score-shi-top)';
    shiScoreText.style.width = 'var(--kumite-score-shi-w)';
    shiScoreText.style.height = 'var(--kumite-score-shi-h)';
    shiScoreText.style.fontSize = '40px';
    shiScoreText.style.textAlign = 'center';
    document.body.appendChild(shiScoreText);
  }

  function checkWin(){
    if (!state.finInmediata) return;
    const target = state.puntosParaGanar;
    if (state.aka.ippon >= target) endBout('AKA');
    if (state.shi.ippon >= target) endBout('SHIRO');
  }

  function endBout(winner){
    state.running = false;
    saveState(KEY, state);
    timerText.classList.remove('flash');
    void timerText.offsetWidth;
    timerText.classList.add('flash');
  }

  function commit(){ saveState(KEY, state); render(); }

  function loop(t){
    if (!state.running) return;
    raf = requestAnimationFrame(loop);
    if (!lastTick) lastTick = t||performance.now();
    const now = t||performance.now();
    const dt = (now - lastTick)/1000;
    if (dt>=1){
      const secs = Math.max(0, Math.floor(state.timeSec - dt));
      state.timeSec = secs;
      lastTick = now;
      if (secs <= 0){
        state.running = false;
        saveState(KEY, state);
        render(true);
        cancelAnimationFrame(raf);
        return;
      }
      saveState(KEY, state);
      render();
    }
  }

  function render(flash=false){
    const mm = Math.floor(state.timeSec/60).toString().padStart(2,'0');
    const ss = Math.floor(state.timeSec%60).toString().padStart(2,'0');
    timerText.textContent = mm+':'+ss;
    if (flash){ timerText.classList.remove('flash'); void timerText.offsetWidth; timerText.classList.add('flash'); }
    const akaPts = state.aka.ippon*1.0 + state.aka.waza*0.5;
    const shiPts = state.shi.ippon*1.0 + state.shi.waza*0.5;
    akaScoreText.textContent = akaPts.toFixed(1).replace('.0','');
    shiScoreText.textContent = shiPts.toFixed(1).replace('.0','');
  }

  window.onCBState = (key, value)=>{
    if (key === KEY){ state = value || state; render(); }
  };
})();