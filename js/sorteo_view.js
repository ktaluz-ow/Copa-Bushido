(function(){
  const { loadState, stateKeys } = window.CB;
  const KEY_PAIRS = stateKeys.sortedPairs;
  let pairs = loadState(KEY_PAIRS, []);
  let container;

  document.addEventListener('DOMContentLoaded', ()=>{
    container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = 'var(--sorteo-list-left)';
    container.style.top = 'var(--sorteo-list-top)';
    container.style.width = 'var(--sorteo-list-w)';
    container.style.height = 'var(--sorteo-list-h)';
    container.style.overflow = 'hidden';
    document.body.appendChild(container);
    render(true);
  });

  function render(animate=false){
    container.innerHTML='';
    const rowH = 36;
    pairs.forEach((p)=>{
      const row = document.createElement('div');
      row.style.position='relative';
      row.style.height=rowH+'px';
      row.style.margin='4px 0';
      row.style.display='flex';
      row.style.alignItems='center';
      row.style.justifyContent='space-between';
      row.style.fontSize='18px';
      const left = document.createElement('div');
      left.textContent = p.a ? p.a.n : '— BYE —';
      const right = document.createElement('div');
      right.textContent = p.b ? p.b.n : '';
      row.appendChild(left);
      row.appendChild(right);
      container.appendChild(row);
    });
    if (animate){
      container.animate([
        { transform:'scale(1) rotate(0deg)', filter:'blur(0px)' },
        { transform:'scale(1.02) rotate(2deg)', filter:'blur(1px)' },
        { transform:'scale(1) rotate(0deg)', filter:'blur(0px)' }
      ], { duration: 500, easing: 'ease-in-out' });
    }
  }

  window.onCBState = (key, value)=>{
    if (key === KEY_PAIRS){ pairs = value || []; render(true); }
  };
})();