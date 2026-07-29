// ═══ Drawer menu ═══
(function () {
  var btn = document.getElementById('menu-open');
  var closeBtn = document.getElementById('menu-close');
  var drawer = document.getElementById('drawer');
  var overlay = document.getElementById('drawer-overlay');
  if (!btn || !drawer) return;

  function open() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    closeBtn.focus();
  }
  function close() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.focus();
  }
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('open')) close();
  });
})();

// ═══ Scroll reveal ═══
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function (el) { obs.observe(el); });
})();

// ═══ Form async submit (Formspree) ═══
(function () {
  var form = document.getElementById('analisi-form');
  if (!form) return;
  var msg = document.getElementById('f-msg');
  var btn = document.getElementById('f-submit');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = 'Invio in corso…';
    msg.className = 'form-msg';
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(function (res) {
      if (res.ok) {
        form.reset();
        msg.textContent = 'Richiesta inviata. Ti rispondo personalmente entro 24-48 ore.';
        msg.className = 'form-msg ok';
      } else {
        msg.textContent = 'Qualcosa è andato storto. Riprova, o scrivimi direttamente via email.';
        msg.className = 'form-msg err';
      }
    }).catch(function () {
      msg.textContent = 'Connessione non riuscita. Riprova, o scrivimi direttamente via email.';
      msg.className = 'form-msg err';
    }).finally(function () {
      btn.disabled = false;
      btn.textContent = 'Invia la richiesta';
    });
  });
})();

// ═══ B — numeri che contano ═══
(function () {
  var els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fmt(v, dec) { return dec > 0 ? v.toFixed(dec).replace('.', ',') : Math.round(v).toString(); }
  function run(el) {
    var target = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.decimals || '0', 10);
    var pre = el.dataset.prefix || '';
    var suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = pre + fmt(target, dec) + suf; return; }
    var t0 = null, dur = 1100;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + fmt(target * e, dec) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.4 });
  els.forEach(function (el) { io.observe(el); });
})();
