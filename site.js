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
      const img = document.getElementById('lbImg'), cnt = document.getElementById('lbCount');
      const thumbs = [...document.querySelectorAll('[data-full]')], srcs = thumbs.map(t => t.dataset.full);
      let cur = 0, x0 = null;
      const show = i => {
        cur = (i + srcs.length) % srcs.length;
        img.style.opacity = 0;
        img.onload = () => { img.style.opacity = 1; };
        img.src = srcs[cur];
        cnt.textContent = (cur + 1) + ' / ' + srcs.length;
        [cur + 1, cur - 1].forEach(j => { const p = new Image(); p.src = srcs[(j + srcs.length) % srcs.length]; });
      };
      const open = i => { show(i); lb.classList.remove('hidden'); lb.classList.add('flex'); document.body.style.overflow = 'hidden'; };
      const close = () => { lb.classList.add('hidden'); lb.classList.remove('flex'); document.body.style.overflow = ''; };
      thumbs.forEach((t, i) => t.addEventListener('click', () => open(i)));
      document.getElementById('lbPrev').addEventListener('click', e => { e.stopPropagation(); show(cur - 1); });
      document.getElementById('lbNext').addEventListener('click', e => { e.stopPropagation(); show(cur + 1); });
      document.getElementById('lbClose').addEventListener('click', close);
      lb.addEventListener('click', e => { if (e.target === lb) close(); });
      img.addEventListener('click', e => { e.stopPropagation(); show(cur + 1); });
      document.addEventListener('keydown', e => {
        if (lb.classList.contains('hidden')) return;
        if (e.key === 'ArrowRight') show(cur + 1);
        else if (e.key === 'ArrowLeft') show(cur - 1);
        else if (e.key === 'Escape') close();
      });
      lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend', e => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0; x0 = null;
        if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
      });
    }
    // Redes sociales: cuentas aún no creadas
    let tt;
    document.querySelectorAll('.soc').forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      let t = document.getElementById('socToast');
      if (!t) {
        t = document.createElement('div'); t.id = 'socToast'; t.setAttribute('role', 'status');
        t.className = 'fixed top-24 left-1/2 -translate-x-1/2 z-[70] bg-ivory text-navy text-sm font-medium px-5 py-3 rounded-full shadow-xl border border-sand transition-opacity duration-300 opacity-0 pointer-events-none whitespace-nowrap';
        document.body.appendChild(t);
      }
      t.textContent = a.dataset.soc + ' · ' + (get() === 'en' ? 'Account pending to link' : 'Cuenta pendiente por enlazar');
      t.classList.remove('opacity-0');
      clearTimeout(tt); tt = setTimeout(() => t.classList.add('opacity-0'), 2600);
    }));
    apply(get());
  });
})();
