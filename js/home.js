document.addEventListener('DOMContentLoaded', ()=>{
  const stage = document.querySelector('.stage');
  stage.style.opacity = 0;
  stage.style.transform = 'translateY(8px)';
  requestAnimationFrame(()=>{
    stage.style.transition = 'opacity .6s ease, transform .6s ease';
    stage.style.opacity = 1;
    stage.style.transform = 'translateY(0)';
  });

  const mk = (label, left, top, w, h, href)=>{
    const el = document.createElement('a');
    el.setAttribute('aria-label', label);
    el.className = 'hotspot';
    el.style.left = `var(${left})`;
    el.style.top = `var(${top})`;
    el.style.width = `var(${w})`;
    el.style.height = `var(${h})`;
    el.href = href;
    document.body.appendChild(el);
  };

  mk('Ir a Sorteo', '--home-sorteo-left','--home-sorteo-top','--home-sorteo-w','--home-sorteo-h','sorteo.html');
  mk('Ir a Kumite', '--home-kumite-left','--home-kumite-top','--home-kumite-w','--home-kumite-h','kumite.html');
  mk('Ir a Kata',   '--home-kata-left','--home-kata-top','--home-kata-w','--home-kata-h','kata.html');
});