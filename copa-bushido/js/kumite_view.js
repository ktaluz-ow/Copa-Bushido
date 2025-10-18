(function(){
  const { loadState, stateKeys } = window.CB;
  const KEY = stateKeys.kumite;
  let state = loadState(KEY, {});
  let timerText, akaScoreText, shiScoreText;

  document.addEventListener('DOMContentLoaded', ()=>{
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
    render();
  });

  function render(){
    const mm = Math.floor(state.timeSec/60||0).toString().padStart(2,'0');
    const ss = Math.floor((state.timeSec||0)%60).toString().padStart(2,'0');
    timerText.textContent = mm+':'+ss;
    const akaPts = (state.aka?.ippon||0)*1.0 + (state.aka?.waza||0)*0.5;
    const shiPts = (state.shi?.ippon||0)*1.0 + (state.shi?.waza||0)*0.5;
    akaScoreText.textContent = akaPts.toFixed(1).replace('.0','');
    shiScoreText.textContent = shiPts.toFixed(1).replace('.0','');
  }

  window.onCBState = (key, value)=>{
    if (key === KEY){ state = value||{}; render(); }
  };
})();