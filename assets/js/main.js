/* billiardshirts.com concept – interactions (no dependencies) */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- mobile menu ---------- */
  var menu = $('#mnav'), burger = $('.burger');
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    burger && burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('lock', open);
    if (open) { var f = $('.mnav-close', menu); f && f.focus(); } else { burger && burger.focus(); }
  }
  burger && burger.addEventListener('click', function () { setMenu(true); });
  $$('[data-close-menu]').forEach(function (el) { el.addEventListener('click', function () { setMenu(false); }); });
  $$('#mnav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  /* ---------- shop filter drawer ---------- */
  var filters = $('#filters'), scrim = $('#scrim'), fOpen = $('.filter-open');
  function setFilters(open) {
    if (!filters) return;
    filters.classList.toggle('open', open);
    scrim && scrim.classList.toggle('open', open);
    fOpen && fOpen.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('lock', open);
    if (open) { var c = $('.filters-close', filters); c && c.focus(); } else { fOpen && fOpen.focus(); }
  }
  fOpen && fOpen.addEventListener('click', function () { setFilters(true); });
  $$('[data-close-filters]').forEach(function (el) { el.addEventListener('click', function () { setFilters(false); }); });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (menu && menu.classList.contains('open')) setMenu(false);
    if (filters && filters.classList.contains('open')) setFilters(false);
  });

  /* toggle buttons (sizes / swatches in filters) */
  $$('[data-toggle]').forEach(function (b) {
    b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); });
  });

  /* ---------- category chips + filter on shop ---------- */
  var grid = $('#shop-grid');
  if (grid) {
    var cards = $$('.pc', grid), count = $('#shop-count');
    var applyCat = function (cat) {
      var n = 0;
      cards.forEach(function (c) { var show = cat === 'all' || c.dataset.cat === cat; c.hidden = !show; if (show) n++; });
      if (count) count.textContent = n + (n === 1 ? ' product' : ' products');
      $$('.chip[data-cat]').forEach(function (ch) { var on = ch.dataset.cat === cat; ch.classList.toggle('on', on); ch.setAttribute('aria-pressed', String(on)); });
      $$('#filters input[data-cat]').forEach(function (i) { i.checked = i.dataset.cat === cat; });
    };
    $$('.chip[data-cat]').forEach(function (ch) { ch.addEventListener('click', function () { applyCat(ch.dataset.cat); }); });
    $$('#filters input[data-cat]').forEach(function (i) {
      i.addEventListener('change', function () { applyCat(i.checked ? i.dataset.cat : 'all'); });
    });
    var q = new URLSearchParams(location.search).get('cat');
    applyCat(q && $('.chip[data-cat="' + q + '"]') ? q : 'all');
  }

  /* ---------- cart badge + quick add ---------- */
  var cartCount = 2;
  function bumpCart(n) { cartCount += n; $$('.badge').forEach(function (b) { b.textContent = cartCount; }); $$('.cart-label').forEach(function (a) { a.setAttribute('aria-label', 'Cart, ' + cartCount + ' items'); }); }
  $$('.quick-add').forEach(function (b) {
    b.addEventListener('click', function () {
      bumpCart(1); var t = b.textContent; b.textContent = 'ADDED'; b.disabled = true;
      setTimeout(function () { b.textContent = t; b.disabled = false; }, 1600);
    });
  });

  /* ---------- concept-only forms ---------- */
  $$('form[data-concept]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('.form-msg', f);
      if (msg) msg.textContent = f.dataset.concept;
      f.reset();
    });
  });

  /* ---------- product page ---------- */
  var pdp = $('#pdp');
  if (pdp) {
    var colors = {
      black: { name: 'Black', front: 'assets/img/hoodie-black-model.jpg', pos: '50% 30%' },
      offwhite: { name: 'Off-White', front: 'assets/img/hoodie-white.jpg', pos: '50% 50%' },
      sand: { name: 'Sand', front: 'assets/img/hoodie-sand-model.jpg', pos: '50% 30%' },
      stone: { name: 'Stone', front: 'assets/img/hoodie-stone-model.jpg', pos: '50% 25%' }
    };
    var views = [
      { label: 'FRONT', src: null, pos: null, alt: 'Hoodie, front' },
      { label: 'DETAIL', src: 'assets/img/hoodie-detail.jpg', pos: '50% 50%', alt: 'Fleece and drawcord detail' },
      { label: 'COLOURWAYS', src: 'assets/img/hoodie-rack.jpg', pos: '50% 50%', alt: 'Hoodie colourways on a rail' },
      { label: 'IN THE HALL', src: 'assets/img/hall.jpg', pos: '50% 60%', alt: 'Pool hall with blue tables' }
    ];
    var state = { color: 'black', view: 0, size: 'L', qty: 1 };
    var mainImg = $('#main-img'), viewTag = $('#view-tag'), thumbBtns = $$('.thumbs button'), mobImgs = $$('.mob-gallery img');

    function render() {
      var c = colors[state.color], v = views[state.view];
      var src = v.src || c.front, pos = v.pos || c.pos;
      mainImg.src = src; mainImg.style.objectPosition = pos; mainImg.alt = state.view === 0 ? c.name + ' hoodie, front' : v.alt;
      viewTag.textContent = v.label;
      thumbBtns.forEach(function (b, i) { b.setAttribute('aria-pressed', String(i === state.view)); });
      var t0 = $('img', thumbBtns[0]); if (t0) t0.src = c.front;
      if (mobImgs[0]) { mobImgs[0].src = c.front; mobImgs[0].style.objectPosition = c.pos; }
      $$('.color-name').forEach(function (el) { el.textContent = c.name; });
      $$('.size-name').forEach(function (el) { el.textContent = state.size; });
      $('#qty').textContent = state.qty;
      $$('.colors .sw').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.color === state.color)); });
      $$('.sizes button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.size === state.size)); });
    }
    thumbBtns.forEach(function (b, i) { b.addEventListener('click', function () { state.view = i; render(); }); });
    $$('.colors .sw').forEach(function (b) { b.addEventListener('click', function () { state.color = b.dataset.color; state.view = 0; render(); }); });
    $$('.sizes button').forEach(function (b) { b.addEventListener('click', function () { state.size = b.dataset.size; render(); }); });
    $('#qty-dec').addEventListener('click', function () { state.qty = Math.max(1, state.qty - 1); render(); });
    $('#qty-inc').addEventListener('click', function () { state.qty += 1; render(); });
    $$('.atc').forEach(function (b) {
      b.addEventListener('click', function () {
        bumpCart(state.qty);
        $$('.atc').forEach(function (x) { x.textContent = 'ADDED TO CART'; x.classList.add('done'); });
        setTimeout(function () { $$('.atc').forEach(function (x) { x.textContent = 'ADD TO CART'; x.classList.remove('done'); }); }, 1800);
      });
    });
    render();

    /* mobile gallery dots */
    var mg = $('.mob-gallery'), dots = $$('.mob-dots span');
    if (mg && dots.length) {
      mg.addEventListener('scroll', function () {
        var i = Math.round(mg.scrollLeft / (mg.scrollWidth / mobImgs.length));
        dots.forEach(function (d, j) { d.classList.toggle('on', j === i); });
      }, { passive: true });
    }

    /* sticky add to cart on mobile: show once the main button scrolls away */
    var bar = $('.sticky-atc'), mainAtc = $('#atc-main');
    if (bar && mainAtc) {
      var ticking = false;
      var check = function () {
        ticking = false;
        var r = mainAtc.getBoundingClientRect();
        var visible = r.bottom > 0 && r.top < window.innerHeight;
        bar.classList.toggle('show', !visible);
      };
      var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(check); } };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      check();
    }
  }
})();
