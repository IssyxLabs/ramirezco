// Idioma ES/EN: cada elemento con data-en guarda su traducción; el español es el HTML original.
(function () {
  const KEY = 'rc_lang';
  const WA = '34614038473';
  const msg = {
    es: 'Hola, me interesa la casa en Rincón de Guayabitos',
    en: "Hi, I'm interested in the home in Rincón de Guayabitos"
  };
  function get() { try { return localStorage.getItem(KEY) || 'es'; } catch (e) { return 'es'; } }
  function set(l) { try { localStorage.setItem(KEY, l); } catch (e) {} }
  function apply(l) {
    document.documentElement.lang = l;
    document.querySelectorAll('[data-en]').forEach(el => {
      if (!el.dataset.es) el.dataset.es = el.innerHTML;
      el.innerHTML = l === 'en' ? el.dataset.en : el.dataset.es;
    });
    document.querySelectorAll('[data-ph-en]').forEach(el => {
      if (!el.dataset.phEs) el.dataset.phEs = el.placeholder;
      el.placeholder = l === 'en' ? el.dataset.phEn : el.dataset.phEs;
    });
    document.querySelectorAll('.wa-link').forEach(a => {
      a.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg[l]);
    });
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('lang-on', b.dataset.lang === l);
    });
    document.querySelectorAll('video[data-src-es]').forEach(v => {
      const s = l === 'en' ? v.dataset.srcEn : v.dataset.srcEs;
      if (v.getAttribute('src') !== s) { v.setAttribute('src', s); v.load(); }
    });
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-btn').forEach(b => b.addEventListener('click', () => { set(b.dataset.lang); apply(b.dataset.lang); }));
    const m = document.getElementById('menuBtn'), n = document.getElementById('mobileNav');
    if (m && n) m.addEventListener('click', () => n.classList.toggle('hidden'));
    const f = document.getElementById('contactForm');
    if (f) f.addEventListener('submit', e => {
      e.preventDefault();
      const l = get();
      const d = new FormData(f);
      const txt = (l === 'en' ? 'Hi, I am ' : 'Hola, soy ') + (d.get('nombre') || '') + '. ' + (d.get('mensaje') || msg[l]);
      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(txt), '_blank');
    });
    // Galería: clic abre visor
    const lb = document.getElementById('lightbox');
    if (lb) {
      const img = lb.querySelector('img');
      document.querySelectorAll('[data-full]').forEach(t => t.addEventListener('click', () => { img.src = t.dataset.full; lb.classList.remove('hidden'); lb.classList.add('flex'); }));
      lb.addEventListener('click', () => { lb.classList.add('hidden'); lb.classList.remove('flex'); });
    }
    apply(get());
  });
})();
