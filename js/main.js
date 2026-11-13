/* Mina Armanious — website behaviour. No dependencies. */
(function () {
  'use strict';

  var CONFIG = {
    email: 'mina_osama_61@hotmail.com',
    phone: '+201009399889',
    linkedin: 'https://www.linkedin.com/in/mina-armanious/',
    quoteInterval: 8000
  };

  var html = document.documentElement;
  var header = document.getElementById('header');
  var nav = document.getElementById('nav');
  var menuBtn = document.getElementById('menuBtn');
  var langBtn = document.getElementById('langBtn');
  var toast = document.getElementById('toast');
  var scrollBar = document.getElementById('scrollBar');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lang = 'en';

  function store(key, val) {
    try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) { return null; }
  }
  function showToast(msg) {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(showToast.t); showToast.t = setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }

  /* ---------- Harmonised logo sizing ----------
     Equal visual weight: wide wordmarks get shorter, square emblems taller. */
  function sizeLogo(img) {
    var holder = img.closest('.lg'); if (!holder || !img.naturalWidth) return;
    var base = parseFloat(getComputedStyle(holder).getPropertyValue('--lh')) || 34;
    var ratio = img.naturalWidth / img.naturalHeight;
    var maxW = parseFloat(getComputedStyle(holder).getPropertyValue('--lw')) || 9999;
    var h = base * Math.min(1.45, Math.max(0.62, Math.pow(2.4 / ratio, 0.5)));
    if (h * ratio > maxW) h = maxW / ratio;
    holder.querySelectorAll('img').forEach(function (i) { i.style.height = h.toFixed(1) + 'px'; });
  }
  document.querySelectorAll('.lg img:first-child').forEach(function (img) {
    if (img.complete) sizeLogo(img); else img.addEventListener('load', function () { sizeLogo(img); });
  });

  /* ---------- Header, progress bar, active section ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a'));
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('solid', y > 40);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    scrollBar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    var mid = y + window.innerHeight * 0.35, active = null;
    sections.forEach(function (s) { if (s.offsetTop <= mid) active = s.id; });
    navLinks.forEach(function (a) { a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + active)); });
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? (lang === 'ar' ? 'إغلاق القائمة' : 'Close menu') : (lang === 'ar' ? 'فتح القائمة' : 'Open menu'));
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 1180 && nav.classList.contains('open')) setMenu(false); });

  /* ---------- Reveal, counters, chart, speed bars ---------- */
  function fmt(n) { return n >= 1000 ? n.toLocaleString('en-US') : String(n); }
  function count(el) {
    if (el.dataset.done) return; el.dataset.done = '1';
    var end = parseFloat(el.getAttribute('data-count')), suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) { el.textContent = fmt(end) + suffix; return; }
    var t0 = null;
    function step(t) {
      if (!t0) t0 = t; var p = Math.min(1, (t - t0) / 1600), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(end * e)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var reveals = document.querySelectorAll('.rv, #chart, #speed');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        en.target.querySelectorAll('[data-count]').forEach(count);
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    reveals.forEach(function (el) {
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.setProperty('--d', Math.min(sib, 6) * 80 + 'ms');
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('[data-count]').forEach(count);
  }

  /* ---------- Tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var ink = document.querySelector('.tab-ink');
  function moveInk() {
    var t = tabs.filter(function (x) { return x.getAttribute('aria-selected') === 'true'; })[0]; if (!t || !ink) return;
    ink.style.left = t.offsetLeft + 'px'; ink.style.width = t.offsetWidth + 'px';
  }
  function selectTab(t, focus) {
    tabs.forEach(function (x) {
      var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) t.focus(); moveInk();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (e) {
      var dir = (e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0) * (html.dir === 'rtl' ? -1 : 1);
      if (dir) { e.preventDefault(); selectTab(tabs[(i + dir + tabs.length) % tabs.length], true); }
    });
  });
  window.addEventListener('resize', moveInk);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveInk);
  moveInk();

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
    qTimer = setInterval(function () { showQuote(qi + 1); }, CONFIG.quoteInterval);
  }
  document.getElementById('qPrev').addEventListener('click', function () { showQuote(qi - 1, true); });
  document.getElementById('qNext').addEventListener('click', function () { showQuote(qi + 1, true); });
  var qWrap = document.getElementById('quotes');
  qWrap.addEventListener('mouseenter', function () { clearInterval(qTimer); qDots.classList.add('paused'); });
  qWrap.addEventListener('mouseleave', function () { qDots.classList.remove('paused'); restartQuotes(); });
  restartQuotes();

  /* ---------- Language ---------- */
  var EN_TITLE = document.title;
  var AR_TITLE = 'مينا أرمانيوس | مستشار قانوني لرأس المال المخاطر والملكية الخاصة والبنوك';
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
    store('lang', next);
    requestAnimationFrame(moveInk);
  }
  langBtn.addEventListener('click', function () { setLang(lang === 'ar' ? 'en' : 'ar'); });
  var startLang = new URLSearchParams(location.search).get('lang') || store('lang');
  if (startLang === 'ar') setLang('ar');

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
    showToast(lang === 'ar' ? 'تم تنزيل بطاقة الاتصال' : 'Contact card downloaded');
  });

  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
