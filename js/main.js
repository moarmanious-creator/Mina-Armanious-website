/* Mina Armanious — site behaviour. No dependencies. */
(function () {
  'use strict';

  /* ---------- Settings: edit these in one place ---------- */
  var CONFIG = {
    email: 'mina_osama_61@hotmail.com',
    phone: '+201009399889',
    linkedin: 'https://www.linkedin.com/in/mina-armanious/',
    // Paste a booking link here (Google Calendar appointment schedule or Calendly)
    // and every "Request a meeting" button will open it. Empty = opens an email.
    bookingUrl: ''
  };

  var html = document.documentElement;
  var header = document.getElementById('header');
  var nav = document.getElementById('nav');
  var menuBtn = document.getElementById('menuBtn');
  var langBtn = document.getElementById('langBtn');
  var toast = document.getElementById('toast');

  function store(key, val) {
    try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) { return null; }
  }
  function showToast(msg) {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(showToast.t); showToast.t = setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }

  /* ---------- Language (English / Arabic) ---------- */
  var lang = 'en';
  var TEXT = {
    en: { menuOpen: 'Open menu', menuClose: 'Close menu', vcard: 'Contact card downloaded', shown: ' transactions shown' },
    ar: { menuOpen: 'فتح القائمة', menuClose: 'إغلاق القائمة', vcard: 'تم تنزيل بطاقة الاتصال', shown: ' صفقات معروضة' }
  };
  var EN_TITLE = document.title;
  var AR_TITLE = 'مينا أرمانيوس | مستشار قانوني للبنوك والتمويل ورأس المال المخاطر';

  function setLang(next) {
    lang = next;
    var ar = next === 'ar';
    document.querySelectorAll('[data-ar]').forEach(function (el) {
      if (!el.hasAttribute('data-en')) el.setAttribute('data-en', el.innerHTML);
      el.innerHTML = ar ? el.getAttribute('data-ar') : el.getAttribute('data-en');
    });
    document.querySelectorAll('[data-ar-alt]').forEach(function (el) {
      if (!el.hasAttribute('data-en-alt')) el.setAttribute('data-en-alt', el.alt);
      el.alt = ar ? el.getAttribute('data-ar-alt') : el.getAttribute('data-en-alt');
    });
    document.querySelectorAll('[data-ar-aria-label]').forEach(function (el) {
      if (!el.hasAttribute('data-en-aria-label')) el.setAttribute('data-en-aria-label', el.getAttribute('aria-label'));
      el.setAttribute('aria-label', ar ? el.getAttribute('data-ar-aria-label') : el.getAttribute('data-en-aria-label'));
    });
    html.lang = ar ? 'ar' : 'en';
    html.dir = ar ? 'rtl' : 'ltr';
    document.title = ar ? AR_TITLE : EN_TITLE;
    langBtn.textContent = ar ? 'EN' : 'عربي';
    langBtn.lang = ar ? 'en' : 'ar';
    langBtn.setAttribute('aria-label', ar ? 'View the site in English' : 'عرض الموقع باللغة العربية');
    menuBtn.setAttribute('aria-label', TEXT[lang][nav.classList.contains('open') ? 'menuClose' : 'menuOpen']);
    store('lang', next);
  }
  langBtn.addEventListener('click', function () { setLang(lang === 'ar' ? 'en' : 'ar'); });
  var urlLang = new URLSearchParams(location.search).get('lang');
  var startLang = urlLang || store('lang');
  if (startLang === 'ar') setLang('ar');

  /* ---------- Header + mobile menu ---------- */
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function setMenu(open) {
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', TEXT[lang][open ? 'menuClose' : 'menuOpen']);
    if (open) header.classList.add('scrolled'); else onScroll();
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 1200 && nav.classList.contains('open')) setMenu(false); });

  /* ---------- Active section in nav ---------- */
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.setAttribute('aria-current', a.getAttribute('href') === '#' + en.target.id ? 'true' : 'false'); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el, i) {
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(sib, 5) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Transaction filter ---------- */
  var filters = document.querySelectorAll('.filter');
  var txs = document.querySelectorAll('.tx');
  var txCount = document.getElementById('txCount');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter'); var n = 0;
      filters.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      txs.forEach(function (t) {
        var show = f === 'all' || t.getAttribute('data-cat') === f;
        t.hidden = !show; if (show) { n++; t.classList.add('in'); }
      });
      txCount.textContent = n + TEXT[lang].shown;
    });
  });

  /* ---------- Meeting + email links ---------- */
  if (CONFIG.bookingUrl) {
    document.querySelectorAll('.js-meeting').forEach(function (a) {
      a.href = CONFIG.bookingUrl; a.target = '_blank'; a.rel = 'noopener';
    });
  }

  /* ---------- Save contact card (vCard) ---------- */
  var vcardBtn = document.getElementById('vcardBtn');
  if (vcardBtn) vcardBtn.addEventListener('click', function () {
    var v = [
      'BEGIN:VCARD', 'VERSION:3.0',
      'N:Armanious;Mina;Osama;;', 'FN:Mina Osama Armanious',
      'TITLE:Banking\\, Finance & Venture Capital Counsel',
      'ORG:Banque Misr', 'EMAIL;TYPE=INTERNET:' + CONFIG.email,
      'TEL;TYPE=CELL:' + CONFIG.phone, 'URL:' + CONFIG.linkedin,
      'ADR;TYPE=WORK:;;;Cairo;;;Egypt', 'END:VCARD'
    ].join('\r\n');
    var url = URL.createObjectURL(new Blob([v], { type: 'text/vcard' }));
    var a = document.createElement('a'); a.href = url; a.download = 'Mina_Armanious.vcf';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    showToast(TEXT[lang].vcard);
  });

  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
