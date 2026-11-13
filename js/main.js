/* Mina Armanious — slide-show website. No dependencies. */
(function () {
  'use strict';

  var CONFIG = {
    email: 'mina_osama_61@hotmail.com',
    phone: '+201009399889',
    linkedin: 'https://www.linkedin.com/in/mina-armanious/',
    quoteInterval: 8000
  };

  var html = document.documentElement;
  var deck = document.getElementById('deck');
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var topbar = document.getElementById('topbar');
  var rail = document.getElementById('rail');
  var controls = document.getElementById('controls');
  var titleEl = document.getElementById('slideTitle');
  var progressBar = document.getElementById('progressBar');
  var curEl = document.getElementById('cur');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var hint = document.getElementById('hint');
  var menuBtn = document.getElementById('menuBtn');
  var contents = document.getElementById('contents');
  var contentsList = document.getElementById('contentsList');
  var langBtn = document.getElementById('langBtn');
  var toast = document.getElementById('toast');
  var current = 0;
  var lang = 'en';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(key, val) {
    try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) { return null; }
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function showToast(msg) {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(showToast.t); showToast.t = setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }
  function slideTitle(s) { return lang === 'ar' ? s.getAttribute('data-title-ar') : s.getAttribute('data-title'); }

  /* Stagger order for entrance animations */
  slides.forEach(function (s) {
    s.querySelectorAll('[data-anim]').forEach(function (el, i) { el.style.setProperty('--i', Math.min(i, 10)); });
  });

  /* ---------- Rail + contents ---------- */
  function buildNav() {
    rail.innerHTML = ''; contentsList.innerHTML = '';
    slides.forEach(function (s, i) {
      var a = document.createElement('a');
      a.href = '#' + s.id; a.setAttribute('aria-label', slideTitle(s));
      a.innerHTML = '<span>' + slideTitle(s) + '</span>';
      a.setAttribute('aria-current', String(i === current));
      rail.appendChild(a);
      var li = document.createElement('li');
      li.innerHTML = '<a href="#' + s.id + '"><span>' + pad(i + 1) + '</span>' + slideTitle(s) + '</a>';
      li.firstChild.setAttribute('aria-current', String(i === current));
      contentsList.appendChild(li);
    });
  }
  document.getElementById('tot').textContent = pad(slides.length);

  /* ---------- Go to slide ---------- */
  function goTo(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    slides[i].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }
  function slideEndVisible() {
    var s = slides[current]; var r = s.getBoundingClientRect();
    return r.bottom <= deck.clientHeight + 4;
  }
  prevBtn.addEventListener('click', function () { goTo(current - 1); });
  nextBtn.addEventListener('click', function () { goTo(current + 1); });

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var target = document.getElementById(a.getAttribute('href').slice(1));
    if (!target || !target.classList.contains('slide')) return;
    e.preventDefault(); setContents(false); goTo(slides.indexOf(target));
  });

  document.addEventListener('keydown', function (e) {
    if (e.target.closest('input, textarea, [contenteditable]')) return;
    if (e.key === 'Escape' && !contents.hidden) { setContents(false); menuBtn.focus(); return; }
    if (e.target.closest('.carousel') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return;
    var rtl = html.dir === 'rtl';
    var nextKeys = ['ArrowDown', 'PageDown', ' ', rtl ? 'ArrowLeft' : 'ArrowRight'];
    var prevKeys = ['ArrowUp', 'PageUp', rtl ? 'ArrowRight' : 'ArrowLeft'];
    if (nextKeys.indexOf(e.key) > -1) {
      if ((e.key === 'ArrowDown' || e.key === ' ') && !slideEndVisible()) return; // let tall slides scroll first
      e.preventDefault(); goTo(current + 1);
    } else if (prevKeys.indexOf(e.key) > -1) {
      if (e.key === 'ArrowUp' && slides[current].getBoundingClientRect().top < -4) return;
      e.preventDefault(); goTo(current - 1);
    } else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(slides.length - 1); }
  });

  /* ---------- Active slide tracking ---------- */
  function setActive(i) {
    if (i === current && setActive.ran) return;
    setActive.ran = true;
    slides.forEach(function (s, k) {
      s.classList.toggle('is-active', k === i);
      if (k === i) s.classList.add('was-seen');
    });
    current = i;
    var s = slides[i];
    var light = s.classList.contains('s-light');
    topbar.classList.toggle('on-light', light);
    rail.classList.toggle('on-light', light);
    controls.classList.toggle('on-light', light);
    titleEl.textContent = i === 0 ? '' : pad(i + 1) + ' · ' + slideTitle(s);
    curEl.textContent = pad(i + 1);
    progressBar.style.width = ((i + 1) / slides.length * 100) + '%';
    prevBtn.disabled = i === 0; nextBtn.disabled = i === slides.length - 1;
    rail.querySelectorAll('a').forEach(function (a, k) { a.setAttribute('aria-current', String(k === i)); });
    contentsList.querySelectorAll('a').forEach(function (a, k) { a.setAttribute('aria-current', String(k === i)); });
    if (i > 0 && hint) hint.classList.add('gone');
    if (history.replaceState) history.replaceState(null, '', i === 0 ? location.pathname + location.search : '#' + s.id);
    runCounters(s);
  }
  if ('IntersectionObserver' in window) {
    var ratios = slides.map(function () { return 0; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { ratios[slides.indexOf(en.target)] = en.isIntersecting ? en.intersectionRect.height : 0; });
      var best = 0; ratios.forEach(function (r, k) { if (r > ratios[best]) best = k; });
      setActive(best);
    }, { root: deck, threshold: [0, .15, .3, .5, .7, .9, 1] });
    slides.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Touch: swipe left/right also changes slide ---------- */
  var tx = 0, ty = 0;
  deck.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  deck.addEventListener('touchend', function (e) {
    if (e.target.closest('.carousel')) return;
    var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) {
      var forward = html.dir === 'rtl' ? dx > 0 : dx < 0;
      goTo(current + (forward ? 1 : -1));
    }
  }, { passive: true });

  /* ---------- Contents overlay ---------- */
  function setContents(open) {
    contents.hidden = !open;
    document.body.classList.toggle('contents-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    if (open) { var a = contentsList.querySelector('a[aria-current="true"]') || contentsList.querySelector('a'); if (a) a.focus(); }
  }
  menuBtn.addEventListener('click', function () { setContents(contents.hidden); });

  /* ---------- Animated counters ---------- */
  function fmt(n) { return n >= 1000 ? n.toLocaleString('en-US') : String(n); }
  function runCounters(slide) {
    slide.querySelectorAll('[data-count]').forEach(function (el) {
      if (el.dataset.done) return; el.dataset.done = '1';
      var end = parseFloat(el.getAttribute('data-count')); var suffix = el.getAttribute('data-suffix') || '';
      if (reduceMotion) { el.textContent = fmt(end) + suffix; return; }
      var t0 = null, dur = 1400;
      function step(t) {
        if (!t0) t0 = t; var p = Math.min(1, (t - t0) / dur); var e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(end * e)) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------- Carousels ---------- */
  document.querySelectorAll('[data-car]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var car = document.getElementById(btn.getAttribute('data-car'));
      var card = car.firstElementChild; var step = card ? card.getBoundingClientRect().width + 18 : 300;
      var dir = parseInt(btn.getAttribute('data-dir'), 10) * (html.dir === 'rtl' ? -1 : 1);
      car.scrollBy({ left: dir * step, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Endorsements ---------- */
  var quotes = Array.prototype.slice.call(document.querySelectorAll('#quotes .q'));
  var qDots = document.getElementById('qDots');
  var qi = 0, qTimer = null;
  quotes.forEach(function (q, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-label', String(i + 1));
    b.setAttribute('aria-selected', String(i === 0));
    b.addEventListener('click', function () { showQuote(i, true); });
    qDots.appendChild(b);
  });
  function showQuote(i, user) {
    qi = (i + quotes.length) % quotes.length;
    quotes.forEach(function (q, k) { q.classList.toggle('is-on', k === qi); });
    qDots.querySelectorAll('button').forEach(function (b, k) {
      b.setAttribute('aria-selected', 'false'); if (k === qi) { void b.offsetWidth; b.setAttribute('aria-selected', 'true'); }
    });
    if (user) restartQuotes();
  }
  function restartQuotes() {
    clearInterval(qTimer);
    if (reduceMotion) { qDots.classList.add('paused'); return; }
    qTimer = setInterval(function () { if (slides[current] && slides[current].id === 'endorsements') showQuote(qi + 1); }, CONFIG.quoteInterval);
  }
  document.getElementById('qPrev').addEventListener('click', function () { showQuote(qi - 1, true); });
  document.getElementById('qNext').addEventListener('click', function () { showQuote(qi + 1, true); });
  var qWrap = document.getElementById('quotes');
  qWrap.addEventListener('mouseenter', function () { clearInterval(qTimer); qDots.classList.add('paused'); });
  qWrap.addEventListener('mouseleave', function () { qDots.classList.remove('paused'); restartQuotes(); });
  restartQuotes();

  /* ---------- Language ---------- */
  var TEXT = {
    en: { vcard: 'Contact card downloaded', prev: 'Previous slide', next: 'Next slide' },
    ar: { vcard: 'تم تنزيل بطاقة الاتصال', prev: 'الشريحة السابقة', next: 'الشريحة التالية' }
  };
  var EN_TITLE = document.title;
  var AR_TITLE = 'مينا أرمانيوس | الملف التنفيذي';
  function setLang(next) {
    lang = next; var ar = next === 'ar';
    document.querySelectorAll('[data-ar]').forEach(function (el) {
      if (!el.hasAttribute('data-en')) el.setAttribute('data-en', el.innerHTML);
      el.innerHTML = ar ? el.getAttribute('data-ar') : el.getAttribute('data-en');
    });
    document.querySelectorAll('[data-ar-alt]').forEach(function (el) {
      if (!el.hasAttribute('data-en-alt')) el.setAttribute('data-en-alt', el.alt);
      el.alt = ar ? el.getAttribute('data-ar-alt') : el.getAttribute('data-en-alt');
    });
    html.lang = ar ? 'ar' : 'en'; html.dir = ar ? 'rtl' : 'ltr';
    document.title = ar ? AR_TITLE : EN_TITLE;
    langBtn.textContent = ar ? 'EN' : 'عربي';
    langBtn.lang = ar ? 'en' : 'ar';
    langBtn.setAttribute('aria-label', ar ? 'View the site in English' : 'عرض الموقع باللغة العربية');
    prevBtn.setAttribute('aria-label', TEXT[lang].prev); nextBtn.setAttribute('aria-label', TEXT[lang].next);
    buildNav();
    var s = slides[current]; titleEl.textContent = current === 0 ? '' : pad(current + 1) + ' · ' + slideTitle(s);
    store('lang', next);
  }
  langBtn.addEventListener('click', function () { setLang(lang === 'ar' ? 'en' : 'ar'); });

  /* ---------- Optional documents: hide links to files not uploaded yet ---------- */
  if (location.protocol.indexOf('http') === 0 && window.fetch) {
    document.querySelectorAll('[data-optional]').forEach(function (a) {
      fetch(a.getAttribute('href'), { method: 'HEAD' }).then(function (r) { if (!r.ok) a.hidden = true; }).catch(function () { a.hidden = true; });
    });
  }

  /* ---------- Save contact card (vCard) ---------- */
  var vcardBtn = document.getElementById('vcardBtn');
  if (vcardBtn) vcardBtn.addEventListener('click', function () {
    var v = ['BEGIN:VCARD', 'VERSION:3.0', 'N:Armanious;Mina;Osama;;', 'FN:Mina Osama Armanious',
      'TITLE:Venture Capital & Private Equity Legal Lead', 'ORG:Banque Misr', 'EMAIL;TYPE=INTERNET:' + CONFIG.email,
      'TEL;TYPE=CELL:' + CONFIG.phone, 'URL:' + CONFIG.linkedin, 'ADR;TYPE=WORK:;;;Cairo;;;Egypt', 'END:VCARD'].join('\r\n');
    var url = URL.createObjectURL(new Blob([v], { type: 'text/vcard' }));
    var a = document.createElement('a'); a.href = url; a.download = 'Mina_Armanious.vcf';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    showToast(TEXT[lang].vcard);
  });

  /* ---------- Start ---------- */
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
  var startLang = new URLSearchParams(location.search).get('lang') || store('lang');
  if (startLang === 'ar') setLang('ar'); else buildNav();
  setActive(0);
  var startId = location.hash.slice(1);
  var startIdx = slides.findIndex(function (s) { return s.id === startId; });
  if (startIdx > 0) setTimeout(function () { slides[startIdx].scrollIntoView({ block: 'start' }); }, 60);
})();
