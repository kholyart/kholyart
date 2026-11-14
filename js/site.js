/* KHOLY ART — new-method trial. Vanilla JS, no libraries. Data comes from js/data.js (window.KHOLY). */
(function () {
  "use strict";
  var D = window.KHOLY, WA = "https://wa.me/201096622627?text=";
  var home = document.getElementById("view-home"), work = document.getElementById("view-work");
  var pill = document.getElementById("pill"), pillName = document.getElementById("pill-name");
  var pillMenu = document.getElementById("pill-menu"), pillBtn = document.getElementById("pill-explore"), pillAct = document.getElementById("pill-act");
  var EN = document.documentElement.lang === "en";
  var HOME_TITLE = "KHOLY ART | موزاييك يدوي من القاهرة";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var MO = document.documentElement.classList.contains("mo") && !reduce; /* motion layer on (set by js/mo.js) */
  var WAI = D.waIcon;
  var CH = function (d) { return '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (d < 0 ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5") + '"/></svg>'; };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function wa(text) { return WA + encodeURIComponent(text); }
  function waBtn(label, text, cls) {
    return '<a class="btn ' + (cls || "") + '" href="' + wa(text) + '" target="_blank" rel="noopener">' + WAI + "<span>" + esc(label) + '</span><span class="vh"> (يفتح واتساب في نافذة جديدة)</span></a>';
  }
  function photoBtn() { return '<button type="button" class="btn btn--photo" data-photo>' + D.camIcon + "<span>أرسل صورة المكان</span></button>"; }
  function card(w) {
    return '<a class="wk" href="#work-' + w.id + '"><img src="' + w.images[0].src + '" width="1024" height="1024" alt="" loading="lazy" decoding="async"><span><span class="wk__t">' + esc(w.title) + '</span><br><span class="wk__s">' + esc(w.type) + "</span></span></a>";
  }
  function railNav() {
    return '<div class="railnav wrap"><button type="button" data-rail="-1" aria-label="السابق">' + CH(1) + '</button><button type="button" data-rail="1" aria-label="التالي">' + CH(-1) + "</button></div>";
  }
  var ICO_PLAY = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M5 3l8 5-8 5z"/></svg>', ICO_PAUSE = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 3h3v10H4zM9 3h3v10H9z"/></svg>';
  function vidHTML(v, capHTML) {
    return '<figure class="vid"><div class="vid__frame"><video muted playsinline loop preload="none" poster="' + v.poster + '" width="' + v.w + '" height="' + v.h + '" aria-label="' + esc(v.cap) + '">' +
      '<source src="' + v.src + '" type="video/mp4"></video><button type="button" class="vid__btn" data-vplay aria-label="شغّل الفيديو">' + ICO_PLAY + "</button></div><figcaption>" + capHTML + "</figcaption></figure>";
  }
  function byRole(w, roles) { return w.images.filter(function (i) { return roles.indexOf(i.role) > -1; }); }

  /* ---------- work page ---------- */
  function renderWork(w) {
    var scenes = byRole(w, ["hero", "scene"]), close = byRole(w, ["alone", "detail"]), making = byRole(w, ["making"]), more = byRole(w, ["more"]);
    var cat = D.cats.filter(function (c) { return c.id === w.cat; })[0];
    var sibs = D.works.filter(function (x) { return x.cat === w.cat && x.id !== w.id; });
    var ask = "مرحبًا، أودّ الاستفسار عن " + w.title;
    var h = "";
    h += '<section class="hero wrap" data-sec="top" data-label="' + esc(w.title) + '">' +
      '<div class="hero__text"><a class="more back" href="#home">كل الأعمال</a><p class="hero__name">' + esc(w.type) + '</p><h1 class="claim">' + esc(w.title) + '</h1><p class="lead">' + esc(w.desc) + "</p></div>" +
      '<figure class="hero__media"><div class="hero__frame"><picture>' + (w.tall ? '<source media="(max-width:40rem)" srcset="' + w.tall + '">' : "") +
      '<img' + (w.images[0].role === "alone" ? ' class="is-whole"' : "") + ' src="' + w.images[0].src + '" width="1024" height="1024" alt="' + esc(w.title) + "، " + esc(w.images[0].cap) + '" decoding="async"></picture></div>' +
      '<div class="ask">' + photoBtn() + waBtn("واتساب", ask, "btn--wa") + "</div></figure></section>";

    if (w.video) {
      h += '<section class="sec band" data-sec="film" data-label="بالفيديو"><div class="wrap"><div class="sec__head"><h2 class="claim">بالفيديو</h2></div>' +
        vidHTML(w.video, '<span class="small">' + esc(w.video.cap) + (w.video.note ? "<sup>1</sup>" : "") + ".</span>") + "</div></section>";
    }
    if (w.images.length > 2) {
      h += '<section class="sec band" data-sec="look" data-label="صور العمل"><div class="wrap rowhead"><h2 class="title">صور العمل</h2></div>' +
        '<div class="rail" data-auto>' + w.images.map(function (i) {
          return '<figure class="hl"><figcaption class="hl__t">' + esc(i.cap) + '</figcaption><img src="' + i.src + '" width="1024" height="1024" alt="" loading="lazy" decoding="async"></figure>';
        }).join("") + "</div>" + hlCtl(w.images.length) + "</section>";
    }
    if (w.choice) {
      var ch = w.choice, c0 = ch.items[0];
      h += '<section class="sec band" data-sec="choose" data-label="اختر التصميم"><div class="wrap"><div class="sec__head"><h2 class="claim">' + esc(ch.title) + '</h2><p class="lead">' + esc(ch.lead) + '<sup>1</sup></p></div>' +
        '<div class="choose" data-choose><div class="choose__stage"><img class="choose__img" src="' + c0.src + '" width="1536" height="1024" alt="' + esc(w.title + "، " + c0.name) + '" decoding="async" loading="lazy"><img class="choose__img choose__next" src="' + c0.src + '" width="1536" height="1024" alt="" aria-hidden="true" decoding="async" loading="lazy"></div>' +
        '<div class="choose__list" role="group" aria-label="التصميمات">' + ch.items.map(function (it, n) {
          return '<button type="button" class="choose__pick" aria-pressed="' + (n === 0) + '" data-pick="' + it.src + '" data-name="' + esc(it.name) + '"><img src="' + it.thumb + '" width="200" height="520" alt="" loading="lazy" decoding="async"><span>' + esc(it.name) + "</span></button>";
        }).join("") + "</div></div></div></section>";
    }
    if (scenes.length > 1) {
      h += '<section class="sec" data-sec="place" data-label="في المكان"><div class="wrap"><div class="sec__head"><h2 class="claim">في المكان</h2>' +
        '<p class="lead">مشاهد توضّح <strong>حجم العمل وألوانه</strong><sup>1</sup>.</p></div>' +
        '<div class="scene" data-viewer data-once><div class="vframe"><img class="viewer__img" src="' + scenes[0].src + '" width="1024" height="1024" alt="' + esc(scenes[0].cap) + '" loading="lazy" decoding="async"></div>' +
        '<div class="scene__tabs">' + scenes.map(function (s, n) { return tab(s, n, "المشهد " + (["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس"][n] || (n + 1))); }).join("") + '</div><p class="small viewer__cap">' + esc(scenes[0].cap) + "</p></div></div></section>";
    }
    if (close.length) {
      h += '<section class="sec' + (scenes.length > 1 ? " band" : "") + '" data-sec="close" data-label="عن قرب"><div class="wrap"><div class="sec__head"><h2 class="claim">عن قرب</h2></div>' +
        '<div class="viewer" data-viewer><div><div class="viewer__tabs">' + close.map(function (s, n) { return tab(s, n, s.role === "alone" ? "العمل كاملًا" : (close.filter(function (x) { return x.role === "detail"; }).length > 1 ? "تفصيلة " + (close.slice(0, n + 1).filter(function (x) { return x.role === "detail"; }).length) : "التفاصيل")); }).join("") + "</div>" +
        (w.palette && w.palette.length ? '<div class="pal"><span class="small">ألوان العمل</span><span class="pal__chips" aria-hidden="true">' + w.palette.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join("") + "</span></div>" : "") +
        '</div><div class="viewer__stage"><div class="vframe"><img class="viewer__img" src="' + close[0].src + '" width="1024" height="1024" alt="' + esc(close[0].cap) + '" loading="lazy" decoding="async"></div><p class="small viewer__cap">' + esc(close[0].cap) + "</p></div></div></div></section>";
    }
    if (making.length) {
      var aloneImg = byRole(w, ["alone"])[0], stages = making.slice(0, 3);
      if (aloneImg) stages.push(aloneImg);
      stages.push(w.images[0]);
      h += '<section class="sec" data-sec="making" data-label="من الورشة"><div class="wrap"><div class="sec__head"><h2 class="claim">من الورشة</h2>' +
        '<p class="lead">من الرسمة على الورق إلى العمل في مكانه.</p></div>';
      if (stages.length >= 3) {
        h += '<div class="story" data-story data-work="' + w.id + '"><div class="grid">' + stages.map(function (s) {
          return '<figure class="shot" data-role="' + s.role + '"><img src="' + s.src + '" width="1024" height="1024" alt="" loading="lazy" decoding="async"><figcaption>' + (s.role === "hero" || s.role === "scene" ? "في مكانه<sup>1</sup>" : (s.role === "alone" ? "العمل كاملًا" : esc(s.cap))) + "</figcaption></figure>";
        }).join("") + "</div></div></div></section>";
      } else {
        h += '<div class="grid">' + making.map(function (s) { return '<figure class="shot"><img src="' + s.src + '" width="1024" height="1024" alt="" loading="lazy" decoding="async"><figcaption>' + esc(s.cap) + "</figcaption></figure>"; }).join("") + "</div></div></section>";
      }
    }
    if (more.length) {
      h += '<section class="sec" data-sec="more" data-label="صور أخرى"><div class="wrap"><div class="rowhead"><h2 class="title">صور أخرى</h2></div><div class="grid">' +
        more.map(function (s) { return '<figure class="shot"><img src="' + s.src + '" width="1024" height="1024" alt="' + esc(w.title) + '" loading="lazy" decoding="async"></figure>'; }).join("") + "</div></div></section>";
    }
    h += '<section class="sec band" data-sec="facts" data-label="بيانات العمل"><div class="wrap"><div class="rowhead"><h2 class="title">بيانات العمل</h2></div><div class="stats stats--words">' +
      stat("النوع", w.type) + stat("الخامة", w.material) + stat("المقاس", w.size) + "</div></div></section>";
    h += '<section class="sec" data-sec="ask" data-label="راسلني"><div class="wrap call"><h2 class="claim">لعمل مثله في مكانك</h2><p class="lead">أرسل صورة المكان ومقاسًا تقريبيًا على واتساب.</p>' + waBtn("راسلني على واتساب", ask) + "</div></section>";
    if (sibs.length) {
      h += '<section class="sec band" data-sec="sibs" data-label="أعمال أخرى"><div class="wrap rowhead"><h2 class="title">' + esc("من " + cat.name) + '</h2><a class="more" href="#home">كل الأعمال</a></div><div class="rail">' + sibs.map(card).join("") + "</div>" + railNav() + "</section>";
    }
    work.innerHTML = h;
  }
  function stat(k, v) { return '<div class="stat"><span class="stat__k">' + esc(k) + '</span><span class="stat__v">' + esc(v) + "</span></div>"; }
  function tab(s, n, label) { return '<button type="button" class="tab" aria-pressed="' + (n === 0) + '" data-src="' + s.src + '" data-cap="' + esc(s.cap) + '">' + esc(label) + "</button>"; }
  function hlCtl(n) {
    var d = ""; for (var i = 0; i < n; i++) d += '<button type="button" aria-label="الشريحة ' + (i + 1) + '"' + (i === 0 ? ' aria-current="true"' : "") + "></button>";
    return '<div class="hl__ctl"><div class="dots">' + d + '</div><button type="button" data-play aria-label="أوقف الحركة"><svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 3h3v10H4zM9 3h3v10H9z"/></svg></button></div>';
  }

  /* ---------- choose: same room, the panel crossfades to the picked design ---------- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-pick]"); if (!b) return;
    var box = b.closest("[data-choose]"), base = box.querySelector(".choose__img"), top = box.querySelector(".choose__next"), src = b.getAttribute("data-pick");
    box.querySelectorAll("[data-pick]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    if (base.getAttribute("src") === src) return;
    var im = new Image(); im.onload = function () {
      top.src = src; top.classList.remove("is-on"); void top.offsetWidth; top.classList.add("is-on");
      setTimeout(function () { base.src = src; base.alt = base.alt.split("،")[0] + "، " + b.getAttribute("data-name"); top.classList.remove("is-on"); }, reduce ? 0 : 520);
    }; im.src = src;
  });
  /* ---------- behaviours (delegated, so they work for both views) ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-rail],[data-src],[data-go],[data-play],[data-vplay],.dots button,#pill-explore,#pill-name");
    if (!t) { closeMenu(); return; }
    if (t.hasAttribute("data-rail")) {
      var rail = t.closest("section").querySelector(".rail");
      var dir = getComputedStyle(rail).direction === "rtl" ? -1 : 1;
      rail.scrollBy({ left: dir * Number(t.getAttribute("data-rail")) * rail.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
    } else if (t.hasAttribute("data-src")) {
      swapView(t.closest("[data-viewer]"), t);
    } else if (t.hasAttribute("data-go")) {
      e.preventDefault(); closeMenu(); go(t.getAttribute("data-go"));
    } else if (t.hasAttribute("data-vplay")) {
      var vd = t.parentNode.querySelector("video"); vd._user = !vd.paused; if (vd.paused) vd.play().catch(function () {}); else vd.pause();
    } else if (t.hasAttribute("data-play")) {
      var r = t.closest("section").querySelector(".rail"); r._paused = !r._paused; if (r._sync) r._sync();
    } else if (t.parentNode.classList && t.parentNode.classList.contains("dots")) {
      var rr = t.closest("section").querySelector(".rail"), idx = Array.prototype.indexOf.call(t.parentNode.children, t);
      rr._paused = true; if (rr._sync) rr._sync(); showSlide(rr, idx);
    } else if (t.id === "pill-explore") {
      var open = pillMenu.hidden; pillMenu.hidden = !open; pillBtn.setAttribute("aria-expanded", open);
    } else if (t.id === "pill-name") { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); }
  });
  function closeMenu() { pillMenu.hidden = true; pillBtn.setAttribute("aria-expanded", "false"); }
  function current() { return work.hidden ? home : work; }
  function go(sec) {
    if (sec && sec.indexOf("home:") === 0) { sec = sec.slice(5); if (!work.hidden) { location.hash = "home"; setTimeout(function () { go(sec); }, 60); return; } }
    var el = current().querySelector('[data-sec="' + sec + '"]');
    if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
  function showSlide(rail, i) {
    var c = rail.children[i]; if (!c) return;
    var dir = getComputedStyle(rail).direction === "rtl" ? -1 : 1;
    var pad = parseFloat(getComputedStyle(rail).scrollPaddingInlineStart) || 0;
    var off = dir < 0 ? (rail.getBoundingClientRect().right - c.getBoundingClientRect().right - pad) : (c.getBoundingClientRect().left - rail.getBoundingClientRect().left - pad);
    rail.scrollBy({ left: dir * off, behavior: reduce ? "auto" : "smooth" });
  }
  function curIndex(rail) {
    var rr = rail.getBoundingClientRect(), rtl = getComputedStyle(rail).direction === "rtl", pad = parseFloat(getComputedStyle(rail).scrollPaddingInlineStart) || 0, best = 0, bd = 1e9;
    Array.prototype.forEach.call(rail.children, function (c, i) { var cr = c.getBoundingClientRect(), d = Math.abs(rtl ? rr.right - pad - cr.right : cr.left - rr.left - pad); if (d < bd) { bd = d; best = i; } });
    return best;
  }
  function setupAuto(root) {
    root.querySelectorAll(".rail[data-auto]").forEach(function (rail) {
      if (rail._sync) return;
      var ctl = rail.parentNode.querySelector(".dots"), dots = ctl.querySelectorAll("button"), btn = rail.parentNode.querySelector("[data-play]");
      var cur = 0, vis = false, tick = false;
      function mark() {
        dots.forEach(function (d, n) { if (n === cur) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current"); });
        Array.prototype.forEach.call(rail.children, function (c, n) { c.classList.toggle("is-cur", n === cur); });
      }
      function sync() {
        var auto = MO && !rail._paused;
        ctl.classList.toggle("timed", auto);
        ctl.classList.toggle("run", auto && vis && !document.hidden);
        if (btn) {
          if (!MO) { btn.hidden = true; return; }
          btn.setAttribute("aria-label", rail._paused ? "شغّل الحركة" : "أوقف الحركة");
          btn.innerHTML = rail._paused ? '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M5 3l8 5-8 5z"/></svg>' : '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 3h3v10H4zM9 3h3v10H9z"/></svg>';
        }
      }
      rail._sync = sync;
      rail.addEventListener("scroll", function () {
        if (tick) return; tick = true;
        requestAnimationFrame(function () { tick = false; var n = curIndex(rail); if (n !== cur) { cur = n; mark(); } });
      }, { passive: true });
      new IntersectionObserver(function (es) { vis = es[0].isIntersecting; sync(); }, { threshold: 0.5 }).observe(rail);
      rail.addEventListener("pointerdown", function () { if (!rail._paused) { rail._paused = true; sync(); } });
      ctl.addEventListener("animationend", function (e) {
        if (e.animationName === "dotfill" && !rail._paused) showSlide(rail, (cur + 1) % rail.children.length);
      });
      document.addEventListener("visibilitychange", function () { if (document.contains(rail)) sync(); });
      mark(); sync();
    });
  }

  /* ---------- tiles: one picture is laid over another, tile by tile (the site's one transition) ---------- */
  var RTL = getComputedStyle(document.documentElement).direction === "rtl";
  function coverRect(im, W, H) {
    var iw = im.naturalWidth, ih = im.naturalHeight, ir = iw / ih, fr = W / H, sw, sh;
    if (ir > fr) { sh = ih; sw = ih * fr; return [(iw - sw) / 2, 0, sw, sh]; }
    sw = iw; sh = iw / fr; return [0, (ih - sh) / 2, sw, sh];
  }
  /* tiles flip over in 3D: each square turns on its axis, lifts toward the viewer, and shows the next picture on its back.
     every swap picks a different order (diagonal, ripple from a point, wave from the top) and axis */
  function makeGrid(W, H, seed) {
    var small = W < 640, size = small ? Math.max(16, W / 20) : Math.max(22, W / 44), cols = Math.ceil(W / size), rows = Math.ceil(H / size), t = [], s = seed || 7;
    function rnd() { s = (s * 16807) % 2147483647; return s / 2147483647; }
    var mode = (seed || 0) % 3, ox = rnd() * cols, oy = rnd() * rows, maxD = Math.sqrt(cols * cols + rows * rows);
    for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
      var o;
      if (mode === 0) o = ((RTL ? cols - 1 - x : x) + y) / (cols + rows);
      else if (mode === 1) o = Math.sqrt((x - ox) * (x - ox) + (y - oy) * (y - oy)) / maxD * 1.3;
      else o = y / rows * 0.85 + Math.sin(x / cols * Math.PI * 2.5) * 0.07 + 0.07;
      t.push({ x: x * size, y: y * size, o: Math.min(1, o) * 0.85 + rnd() * 0.15 });
    }
    return { tiles: t, size: size, axis: mode === 2 ? "x" : "y" };
  }
  function fitCanvas(cv, W, H) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2), w = Math.round(W * dpr), h = Math.round(H * dpr);
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    var cx = cv.getContext("2d"); cx.setTransform(dpr, 0, 0, dpr, 0, 0); return cx;
  }
  function drawCover(cx, im, W, H) { var r = coverRect(im, W, H); cx.drawImage(im, r[0], r[1], r[2], r[3], 0, 0, W, H); }
  /* p from 0 to 1. old: the picture already showing (or null); im: the next one */
  function layTiles(cx, im, W, H, grid, p, old) {
    if (p <= 0) { if (old) drawCover(cx, old, W, H); return; }
    if (p >= 1) { drawCover(cx, im, W, H); return; }
    var r = coverRect(im, W, H), kx = r[2] / W, ky = r[3] / H, ro = old ? coverRect(old, W, H) : null, kox = ro ? ro[2] / W : 0, koy = ro ? ro[3] / H : 0;
    var sz = grid.size, F = 0.42, P = p * (1 + F), t = grid.tiles, ax = grid.axis === "x", act = [];
    if (old) drawCover(cx, old, W, H);
    for (var i = 0; i < t.length; i++) {
      var q = (P - t[i].o) / F;
      if (q >= 1) cx.drawImage(im, r[0] + t[i].x * kx, r[1] + t[i].y * ky, sz * kx, sz * ky, t[i].x - 0.3, t[i].y - 0.3, sz + 0.6, sz + 0.6);
      else if (q > 0) { act.push(i, q); cx.fillStyle = "#3b332a"; cx.fillRect(t[i].x, t[i].y, sz, sz); }
    }
    for (var k = 0; k < act.length; k += 2) {
      var j = act[k], q2 = act[k + 1], e = q2 < 0.5 ? 2 * q2 * q2 : 1 - Math.pow(-2 * q2 + 2, 2) / 2, th = e * Math.PI;
      var c = Math.cos(th), sn = Math.sin(th), lift = 1 + 0.22 * sn, cxp = t[j].x + sz / 2, cyp = t[j].y + sz / 2;
      var w = sz * lift * (ax ? 1 : Math.max(0.02, Math.abs(c))), h = sz * lift * (ax ? Math.max(0.02, Math.abs(c)) : 1);
      cx.globalAlpha = 0.35 * sn; cx.fillStyle = "#000";
      cx.fillRect(cxp - w / 2 + sz * 0.12 * sn, cyp - h / 2 + sz * 0.18 * sn, w, h);
      cx.globalAlpha = 1;
      if (c > 0) { if (old) cx.drawImage(old, ro[0] + t[j].x * kox, ro[1] + t[j].y * koy, sz * kox, sz * koy, cxp - w / 2, cyp - h / 2, w, h); }
      else cx.drawImage(im, r[0] + t[j].x * kx, r[1] + t[j].y * ky, sz * kx, sz * ky, cxp - w / 2, cyp - h / 2, w, h);
      cx.globalAlpha = 0.3 * (1 - Math.abs(c)); cx.fillStyle = "#000"; cx.fillRect(cxp - w / 2, cyp - h / 2, w, h);
      cx.globalAlpha = 0.28 * sn * (c > 0 ? 1 : 0.6); cx.fillStyle = "#fff";
      if (ax) cx.fillRect(cxp - w / 2, cyp - h / 2, w, h * 0.35); else cx.fillRect(cxp - w / 2, cyp - h / 2, w * 0.35, h);
      cx.globalAlpha = 1;
    }
  }
  function tileCanvas(frame) {
    var cv = frame.querySelector("canvas.tl");
    if (!cv) { cv = document.createElement("canvas"); cv.className = "tl"; cv.setAttribute("aria-hidden", "true"); frame.appendChild(cv); }
    return cv;
  }
  /* replace the picture in a frame: the new one is laid over the old, then becomes the picture */
  function tileSwap(frame, img, src, dur, seed, done) {
    var im = new Image(), tok = (frame._tok = (frame._tok || 0) + 1); im.decoding = "async";
    im.onload = function () {
      if (frame._tok !== tok || !document.contains(frame)) return;
      var b = frame.getBoundingClientRect(), W = b.width, H = b.height, cv = tileCanvas(frame), cx = fitCanvas(cv, W, H), grid = makeGrid(W, H, seed), t0 = null;
      var prev = img.complete && img.naturalWidth ? img : null;
      function step(now) {
        if (frame._tok !== tok || !document.contains(frame)) return;
        if (t0 === null) t0 = now;
        var p = Math.min(1, (now - t0) / dur); cx.clearRect(0, 0, W, H); layTiles(cx, im, W, H, grid, p, prev);
        if (p < 1) { requestAnimationFrame(step); return; }
        img.src = src;
        var fin = function () { if (frame._tok === tok) cx.clearRect(0, 0, W, H); if (done) done(); };
        if (img.decode) img.decode().then(fin, fin); else fin();
      }
      requestAnimationFrame(step);
    };
    im.onerror = function () { img.src = src; if (done) done(); };
    im.src = src;
  }

  /* ---------- home hero: the main picture changes from work to work, laid tile by tile ---------- */
  function heroShow(frame) {
    if (!MO || !frame || frame._show) return; frame._show = 1;
    var img = frame.querySelector("img"), small = window.matchMedia("(max-width:40rem)").matches;
    var slides = ["peacock", "greatwave", "pool", "bluepeacock", "calligraphy"].map(function (id) { return D.works.filter(function (x) { return x.id === id; })[0]; })
      .filter(Boolean).map(function (w) { return { id: w.id, title: w.title, alt: w.title + "، " + w.images[0].cap, src: small && w.tall ? w.tall : w.images[0].src }; });
    if (slides.length < 2) return;
    var so = frame.querySelector("source"); if (so) so.parentNode.removeChild(so);
    img.src = slides[0].src;
    function warm(i) { var p = new Image(); p.decoding = "async"; p.src = slides[i % slides.length].src; }
    warm(1);
    var chip = document.createElement("a"); chip.className = "hero__chip more"; chip.href = "#work-" + slides[0].id; chip.textContent = slides[0].title;
    var btn = document.createElement("button"); btn.type = "button"; btn.className = "hero__pause"; btn.setAttribute("aria-label", "أوقف تبديل الصور"); btn.innerHTML = ICO_PAUSE;
    frame.appendChild(chip); frame.appendChild(btn);
    var cur = 0, paused = false, vis = true, busy = false, timer = null;
    function schedule() { clearTimeout(timer); timer = setTimeout(next, 3000); }
    function next(force) {
      if (busy || held) return;
      if (!force && (paused || !vis || document.hidden || home.hidden)) { schedule(); return; }
      var n = (cur + 1) % slides.length; busy = true; chip.classList.add("is-out");
      var sw = window.KM3D && window.KM3D.ok ? window.KM3D.swap : tileSwap;
      sw(frame, img, slides[n].src, window.KM3D && window.KM3D.ok ? 1150 : 1000, n + 3 * ((Math.random() * 1000) | 0), function () {
        cur = n; busy = false; img.alt = slides[n].alt; chip.textContent = slides[n].title; chip.href = "#work-" + slides[n].id; chip.classList.remove("is-out"); schedule(); warm(n + 1);
      });
    }
    new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }, { threshold: 0.35 }).observe(frame);
    /* tap the picture: next one now. press and hold: it stays until you let go */
    var holdT = null, held = false, downAt = 0;
    frame.addEventListener("pointerdown", function (e) {
      if (e.target.closest("a,button")) return;
      downAt = Date.now(); held = false; clearTimeout(holdT);
      holdT = setTimeout(function () { held = true; clearTimeout(timer); frame.classList.add("is-held"); }, 380);
    });
    function release(e) {
      if (!downAt) return; clearTimeout(holdT);
      var wasHeld = held; held = false; downAt = 0; frame.classList.remove("is-held");
      if (wasHeld) { schedule(); return; }
      if (e && e.type === "pointerup" && !e.target.closest("a,button") && !busy) { clearTimeout(timer); next(true); }
    }
    frame.addEventListener("pointerup", release); frame.addEventListener("pointercancel", release); frame.addEventListener("pointerleave", release);
    frame.addEventListener("contextmenu", function (e) { if (held) e.preventDefault(); });
    btn.addEventListener("click", function () {
      paused = !paused; btn.innerHTML = paused ? ICO_PLAY : ICO_PAUSE; btn.setAttribute("aria-label", paused ? "شغّل تبديل الصور" : "أوقف تبديل الصور");
    });
    schedule();
  }

  /* ---------- making film: the stages play by themselves, on a loop, when the section is on screen; a tap pauses it.
     workshop prints drop one on another, the whole work comes in close and pulls back, then the same panel lands in its place ---------- */
  function setupStory(root) {
    if (!MO) return;
    root.querySelectorAll("[data-story]").forEach(function (box) {
      if (box._story) return; box._story = 1;
      var figs = box.querySelectorAll("figure"); if (figs.length < 3) return;
      var w = D.works.filter(function (x) { return x.id === box.getAttribute("data-work"); })[0], fx = w && w.film;
      var st = Array.prototype.map.call(figs, function (f) { return { src: f.querySelector("img").getAttribute("src"), cap: f.querySelector("figcaption").innerHTML, role: f.getAttribute("data-role") || "making" }; });
      var n = st.length, iA = -1, iP = n - 1;
      for (var q = 0; q < n; q++) if (st[q].role === "alone") iA = q;
      if (st[iP].role !== "hero" && st[iP].role !== "scene") iP = -1;
      if (fx && iA >= 0) { if (fx.alone.src) st[iA].src = fx.alone.src; if (fx.alone.cap) st[iA].cap = fx.alone.cap; st[iA].box = fx.alone.box; st[iA].foc = fx.alone.foc; }
      if (fx && iP >= 0) { if (fx.place.src) st[iP].src = fx.place.src; st[iP].box = fx.place.box; st[iP].left = fx.place.left; }
      /* each stage: how it arrives and how long it stays */
      var T = 0; st.forEach(function (s, i) { s.kind = i === iA ? "zoom" : i === iP ? "land" : "card"; s.a = T; T += s.kind === "card" ? 2.6 : s.kind === "zoom" ? 3.4 : 3.6; s.b = T; });
      var END = T + 0.7;
      var film = document.createElement("div"); film.className = "film";
      film.innerHTML = '<div class="film__frame" role="button" tabindex="0" aria-label="مراحل التنفيذ، اضغط للإيقاف أو التشغيل"></div><div class="film__side"><p class="film__cap"></p><ol class="film__steps">' +
        st.map(function (s, i) { return '<li><button type="button" data-i="' + i + '"><span class="film__n">' + (i + 1) + '</span><span class="film__t">' + s.cap + '</span><span class="film__bar"><i></i></span></button></li>'; }).join("") + "</ol></div>";
      film.style.setProperty("--n", n); box.classList.add("is-film"); box.appendChild(film);
      var frame = film.querySelector(".film__frame"), cap = film.querySelector(".film__cap"), lis = film.querySelectorAll("li"), bars = film.querySelectorAll(".film__bar i");
      st.forEach(function (s) {
        var el = document.createElement("div"); el.className = s.kind === "card" ? "film__card" : "film__layer";
        var im = new Image(); im.alt = ""; im.decoding = "async"; im.loading = "lazy"; im.src = s.src; el.appendChild(im);
        s.el = el; s.im = im; im.onload = function () { render(t); };
      });
      /* later stages sit on top: cards are stacked above the first ones, the place shot sits under the alone shot so it can be revealed */
      st.forEach(function (s) { if (s.kind === "land") frame.appendChild(s.el); });
      st.forEach(function (s) { if (s.kind === "zoom") frame.appendChild(s.el); });
      st.forEach(function (s) { if (s.kind === "card") frame.appendChild(s.el); });
      function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
      function seg(x, a, b) { return cl((x - a) / (b - a)); }
      function io(p) { return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
      function out(p) { return 1 - Math.pow(1 - p, 3); }
      function back(p) { var c = 1.4; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); }
      function lerp(a, b, p) { return a + (b - a) * p; }
      /* lay a picture as 'cover' in the square frame; returns its size and resting offset */
      function base(s, F) {
        var iw = s.im.naturalWidth || 1024, ih = s.im.naturalHeight || 1024, c = Math.max(F / iw, F / ih), dw = iw * c, dh = ih * c;
        var ox = s.left != null ? -Math.min(dw - F, s.left * dw) : (F - dw) / 2, oy = (F - dh) / 2;
        if (s.im._w !== Math.round(dw)) { s.im.style.width = dw + "px"; s.im.style.height = dh + "px"; s.im._w = Math.round(dw); }
        return { dw: dw, dh: dh, ox: ox, oy: oy };
      }
      function put(s, B, tx, ty, k) { s.im.style.transform = "translate(" + (tx + k * B.ox).toFixed(2) + "px," + (ty + k * B.oy).toFixed(2) + "px) scale(" + k.toFixed(4) + ")"; }
      function render(t) {
        var F = frame.clientWidth; if (!F) return;
        var on = 0; for (var i = 0; i < n; i++) if (t >= st[i].a) on = i;
        var fade = 1 - io(seg(t, END - 0.7, END)), Z = null;
        st.forEach(function (s, i) {
          if (s.kind === "card") {
            var p = seg(t, s.a, s.a + (i === 0 ? .7 : .7)), bk = i === 0 ? out(p) : back(p), gone = 0;
            for (var j = i + 1; j < n; j++) if (st[j].kind !== "card") { gone = io(seg(t, st[j].a, st[j].a + .7)); break; }
            var tilt = (i % 2 ? 2.5 : -3), from = i === 0 ? 0 : (i % 2 ? 9 : -9), drop = i === 0 ? 10 : -28;
            s.el.style.opacity = Math.min(i === 0 ? out(p) : cl(p * 3), 1 - gone, fade);
            s.el.style.transform = "translateY(" + lerp(drop, 0, bk) + "%) rotate(" + lerp(i === 0 ? -6 : from, tilt, bk) + "deg) scale(" + lerp(i === 0 ? 1 : 1.08, 1, bk) + ")";
            var nx = st[i + 1]; s.el.style.filter = nx && nx.kind === "card" ? "brightness(" + lerp(1, .82, out(seg(t, nx.a, nx.a + .7))) + ")" : "";
          }
        });
        st.forEach(function (s) {
          if (s.kind !== "zoom") return;
          var B = base(s, F), f3 = io(seg(t, s.a, s.a + .7)), z = io(seg(t, s.a + .9, s.a + 2.9));
          var fx = s.foc ? s.foc[0] * B.dw + B.ox : F / 2, fy = s.foc ? s.foc[1] * B.dh + B.oy : F / 2, k = lerp(s.foc ? s.foc[2] : 1.8, 1, z);
          var tx = F / 2 - k * fx, ty = F / 2 - k * fy;
          tx = Math.min(-k * B.ox, Math.max(F - k * (B.ox + B.dw), tx)); ty = Math.min(-k * B.oy, Math.max(F - k * (B.oy + B.dh), ty));
          tx = lerp(tx, 0, z >= 1 ? 1 : 0); ty = lerp(ty, 0, z >= 1 ? 1 : 0);
          Z = { s: s, B: B, f3: f3, tx: tx + k * B.ox - k * B.ox, ty: ty, k: k };
          s._k = k; s._tx = tx; s._ty = ty; s.el.style.opacity = t < s.a ? 0 : Math.min(f3, fade);
          put(s, B, tx, ty, k);
        });
        st.forEach(function (s) {
          if (s.kind !== "land") return;
          var B = base(s, F), z = io(seg(t, s.a, s.a + 2.2)), A = Z && Z.s;
          s.el.style.opacity = t < s.a ? 0 : fade;
          if (A && A.box && s.box) {
            /* the place shot starts lined up on the panel of the alone shot, then pulls back; the alone shot rides along and fades */
            var BA = base(A, F), c3x = (A.box[0] + A.box[2]) / 2 * BA.dw + BA.ox, c3y = (A.box[1] + A.box[3]) / 2 * BA.dh + BA.oy, h3 = (A.box[3] - A.box[1]) * BA.dh;
            var c4x = (s.box[0] + s.box[2]) / 2 * B.dw + B.ox, c4y = (s.box[1] + s.box[3]) / 2 * B.dh + B.oy, h4 = (s.box[3] - s.box[1]) * B.dh, K = h3 / h4;
            var k4 = lerp(K, 1, z), tx4 = lerp(c3x - K * c4x, 0, z), ty4 = lerp(c3y - K * c4y, 0, z);
            put(s, B, tx4, ty4, k4);
            if (t >= s.a) { put(A, BA, tx4 + k4 * (c4x - c3x / K), ty4 + k4 * (c4y - c3y / K), k4 / K); A.el.style.opacity = Math.min(1 - out(seg(t, s.a, s.a + .9)), fade); }
          } else {
            var k = lerp(1.15, 1, out(seg(t, s.a, s.a + 3.2))); put(s, B, (1 - k) * F / 2, (1 - k) * F / 2, k);
            s.el.style.opacity = Math.min(t < s.a ? 0 : io(seg(t, s.a, s.a + .8)), fade);
          }
        });
        for (var j = 0; j < n; j++) { lis[j].classList.toggle("is-on", j === on); bars[j].style.transform = "scaleX(" + (j < on ? 1 : j > on ? 0 : seg(t, st[j].a, st[j].b)) + ")"; }
        if (cap._on !== on) { cap._on = on; cap.innerHTML = st[on].cap; }
      }
      var t = 0, playing = false, last = 0, started = false, vis = false;
      function loop(now) {
        if (!playing) return; var dt = Math.min(.05, (now - last) / 1000); last = now;
        if (!document.contains(frame)) { playing = false; return; }
        if (vis && !document.hidden) { t += dt; if (t >= END) t = 0; render(t); }
        requestAnimationFrame(loop);
      }
      function play() { if (playing) return; playing = true; frame.classList.remove("is-paused"); last = performance.now(); requestAnimationFrame(loop); }
      function pause() { playing = false; frame.classList.add("is-paused"); }
      frame.addEventListener("click", function () { if (frame._skip) { frame._skip = 0; return; } playing ? pause() : play(); });
      frame.addEventListener("keydown", function (e) { if (e.key === " " || e.key === "Enter") { e.preventDefault(); playing ? pause() : play(); } });
      film.querySelector(".film__steps").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; t = st[+b.getAttribute("data-i")].a + .001; render(t); play(); });
      var sx = null; frame.addEventListener("pointerdown", function (e) { sx = e.clientX; });
      frame.addEventListener("pointerup", function (e) {
        if (sx === null) return; var dx = e.clientX - sx; sx = null; if (Math.abs(dx) < 40) return;
        var on = 0; for (var i = 0; i < n; i++) if (t >= st[i].a) on = i;
        on = Math.max(0, Math.min(n - 1, on + ((dx < 0) === RTL ? -1 : 1))); t = st[on].a + .001; render(t); play(); frame._skip = 1;
      });
      window.addEventListener("resize", function () { render(t); });
      new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis && !started) { started = true; play(); } }, { threshold: .45 }).observe(frame);
      render(0);
    });
  }

  /* ---------- viewers: the new picture is laid over the old one ---------- */
  function swapView(v, t) {
    var img = v.querySelector(".viewer__img"), fr = img.parentNode, src = t.getAttribute("data-src"), cap = t.getAttribute("data-cap");
    v.querySelectorAll(".tab").forEach(function (b) { b.setAttribute("aria-pressed", b === t); });
    v.querySelector(".viewer__cap").textContent = cap; img.alt = cap;
    if (!MO || !fr.classList.contains("vframe")) { img.src = src; return; }
    tileSwap(fr, img, src, 850, src.length, null);
  }
  /* a scene switcher shows each of its scenes once when it first comes into view, then returns to the first */
  function playOnce(root) {
    if (!MO) return;
    root.querySelectorAll("[data-viewer][data-once]").forEach(function (v) {
      var tabs = v.querySelectorAll(".tab"), timers = [], stop = false;
      if (tabs.length < 2 || v._once) return; v._once = 1;
      ["pointerdown", "keydown", "click"].forEach(function (ev) { v.addEventListener(ev, function () { stop = true; timers.forEach(clearTimeout); }); });
      var io = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return; io.disconnect();
        var seq = []; for (var i = 1; i < tabs.length; i++) seq.push(i); seq.push(0);
        seq.forEach(function (n, k) { timers.push(setTimeout(function () { if (!stop && document.contains(v)) swapView(v, tabs[n]); }, 1600 + k * 2600)); });
      }, { threshold: 0.6 });
      io.observe(v);
    });
  }

  /* ---------- videos: muted, play while on screen, each with its own play/pause button ---------- */
  function setupVideos(root) {
    root.querySelectorAll(".vid video").forEach(function (v) {
      if (v._set) return; v._set = 1;
      var btn = v.parentNode.querySelector("[data-vplay]");
      function paint() { btn.innerHTML = v.paused ? ICO_PLAY : ICO_PAUSE; btn.setAttribute("aria-label", v.paused ? "شغّل الفيديو" : "أوقف الفيديو"); }
      v.addEventListener("play", paint); v.addEventListener("pause", paint);
      new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { if (MO && !v._user && !document.hidden) v.play().catch(function () {}); }
        else if (!v.paused) v.pause();
      }, { threshold: 0.5 }).observe(v);
      paint();
    });
  }

  /* ---------- reveal: blocks rise once when they come into view, their parts a beat apart ---------- */
  var rvIO = MO ? new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return;
      var items = en.target._rv || []; rvIO.unobserve(en.target); en.target._rv = null;
      items.forEach(function (n) { n.classList.add("is-in"); });
      setTimeout(function () { items.forEach(function (n) { n.classList.remove("rv", "is-in"); n.style.removeProperty("--i"); }); }, 1900);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -16% 0px" }) : null;
  function markReveals(root) {
    if (!MO) return;
    function grp(box, items) {
      items = Array.prototype.filter.call(items, function (n) { return !n._seen; });
      if (!items.length) return;
      items.forEach(function (n, i) { n._seen = 1; n.classList.add("rv"); n.style.setProperty("--i", Math.min(i, 6)); });
      box._rv = (box._rv || []).concat(items); rvIO.observe(box);
    }
    root.querySelectorAll(".sec__head, .call").forEach(function (h) { grp(h, h.children); });
    root.querySelectorAll(".rowhead, .feat, .vid, .statblock, .viewer, .scene, .faq, .rail[data-auto], .hl__ctl").forEach(function (n) { grp(n, [n]); });
    root.querySelectorAll(".rail:not([data-auto]), .grid, .stats--words").forEach(function (c) { if (!c.closest("[data-story]")) grp(c, c.children); });
  }

  /* ---------- hero: the picture is laid tile by tile, once ---------- */
  function assemble(frame) {
    if (!MO || !frame || frame._done) return; frame._done = 1;
    var img = frame.querySelector("img"), box = frame.getBoundingClientRect();
    var W = Math.max(1, Math.round(box.width)), H = Math.max(1, Math.round(box.height)), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cv = document.createElement("canvas"); cv.setAttribute("aria-hidden", "true"); cv.width = W * dpr; cv.height = H * dpr;
    var cx = cv.getContext("2d"); if (!cx) { frame.classList.add("is-live"); return; }
    cx.scale(dpr, dpr);
    var cols = Math.max(14, Math.round(W / 24)), size = W / cols, rows = Math.ceil(H / size), rtl = getComputedStyle(frame).direction === "rtl";
    var bg = (getComputedStyle(document.documentElement).getPropertyValue("--band") || "").trim() || "#f1f3f2";
    var tiles = [], SWEEP = 620, JIT = 260, FADE = 300, start = null;
    for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) tiles.push({ x: x * size, y: y * size, t: ((rtl ? cols - 1 - x : x) + y) / (cols + rows) * SWEEP + Math.random() * JIT });
    cx.fillStyle = bg; cx.fillRect(0, 0, W, H);
    frame.appendChild(cv); frame.classList.add("is-live");
    function draw(now) {
      if (!document.contains(cv)) return;
      if (start === null) start = now;
      var e = now - start; cx.clearRect(0, 0, W, H); cx.fillStyle = bg;
      for (var i = 0; i < tiles.length; i++) {
        var p = (e - tiles[i].t) / FADE; if (p >= 1) continue;
        var q = p <= 0 ? 0 : p, g = q * size * 0.22; cx.globalAlpha = (1 - q) * (1 - q);
        if (q === 0) cx.globalAlpha = 1;
        cx.fillRect(tiles[i].x + g - 0.5, tiles[i].y + g - 0.5, size - 2 * g + 1, size - 2 * g + 1);
      }
      cx.globalAlpha = 1;
      if (e < SWEEP + JIT + FADE) requestAnimationFrame(draw); else frame.removeChild(cv);
    }
    function begin() { if (start === null && document.contains(cv)) requestAnimationFrame(draw); }
    if (img.complete && img.naturalWidth) begin();
    else { img.addEventListener("load", begin, { once: true }); img.addEventListener("error", function () { if (frame.contains(cv)) frame.removeChild(cv); }, { once: true }); setTimeout(begin, 2500); }
  }

  /* ---------- floating pill ---------- */
  function buildMenu() {
    var v = current(), w = work.hidden ? null : D.works.filter(function (x) { return "#work-" + x.id === location.hash; })[0];
    pillName.textContent = w ? w.title : "KHOLY ART"; pillName.className = "pill__name" + (w ? "" : " lat");
    pillMenu.innerHTML = Array.prototype.map.call(v.querySelectorAll("[data-sec][data-label]"), function (s) {
      return s.getAttribute("data-sec") === "top" ? "" : '<button type="button" data-go="' + s.getAttribute("data-sec") + '">' + esc(s.getAttribute("data-label")) + "</button>";
    }).join("");
    pillAct.href = wa(w ? "مرحبًا، أودّ الاستفسار عن " + w.title : "مرحبًا، أودّ الاستفسار عن عمل موزاييك لمكاني");
    pillAct.querySelector("span").textContent = w ? "أريد مثله" : "راسلني";
  }
  var pillOn = false;
  function onScroll() { var show = window.scrollY > 420; if (show !== pillOn) { pillOn = show; pill.classList.toggle("is-on", show); if (!show) closeMenu(); } }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- router: #home or #work-id ---------- */
  var lastImg = null, firstRoute = true, homeY = 0;
  document.addEventListener("click", function (e) { var a = e.target.closest('a[href^="#work-"]'); lastImg = a ? (a.querySelector("img") || (a.classList.contains("hero__chip") ? a.parentNode.querySelector("img") : null)) : null; }, true);
  function route() {
    var m = /^#work-([a-z0-9]+)$/.exec(location.hash), w = m && D.works.filter(function (x) { return x.id === m[1]; })[0];
    var wasHome = work.hidden, img = lastImg && document.contains(lastImg) ? lastImg : null; lastImg = null;
    if (wasHome && w && !firstRoute) homeY = window.scrollY;
    function render(morph) {
      if (w) { renderWork(w); home.hidden = true; work.hidden = false; document.title = w.title + " | KHOLY ART"; }
      else { work.hidden = true; work.innerHTML = ""; home.hidden = false; document.title = HOME_TITLE; }
      buildMenu(); closeMenu(); window.scrollTo({ top: w || wasHome ? 0 : homeY, left: 0, behavior: "instant" }); onScroll();
      if (w) { markReveals(work); setupAuto(work); setupVideos(work); setupStory(work); playOnce(work); if (!morph) assemble(work.querySelector(".hero__frame")); }
    }
    if (firstRoute || !MO || !document.startViewTransition) { firstRoute = false; render(false); return; }
    var morph = !!(w && img);
    try {
      if (morph) { var old = work.querySelector(".hero__frame"); if (old) old.style.viewTransitionName = "none"; img.style.viewTransitionName = "piece"; }
      var vt = document.startViewTransition(function () { if (img) img.style.viewTransitionName = ""; render(morph); });
      if (vt.ready) vt.ready.catch(function () {});
      if (vt.finished) vt.finished.catch(function () {});
    } catch (err) { if (img) img.style.viewTransitionName = ""; render(false); }
  }
  window.addEventListener("hashchange", route);
  document.querySelectorAll("[data-wa]").forEach(function (a) { a.href = wa(a.getAttribute("data-wa")); });

  /* ---------- send a photo of the place: the phone offers its camera or gallery, then the photos go to WhatsApp ---------- */
  (function () {
    var pick = document.createElement("input"); pick.type = "file"; pick.accept = "image/*"; pick.multiple = true; pick.hidden = true; document.body.appendChild(pick);
    var dlg = document.createElement("dialog"); dlg.className = "send"; dlg.setAttribute("aria-label", "أرسل صورة المكان");
    dlg.innerHTML = '<form method="dialog" class="send__in"><div class="send__head"><h2>صورة المكان</h2><button class="send__x" value="x" aria-label="إغلاق">×</button></div>' +
      '<div class="send__pics"></div><button type="button" class="send__more">' + D.camIcon + '<span>أضف صورة</span></button>' +
      '<label class="send__f"><span>المقاس التقريبي <small>(اختياري)</small></span><input type="text" inputmode="text" placeholder="مثلًا 3 × 2 متر" dir="auto"></label>' +
      '<button type="button" class="btn send__go">' + WAI + '<span>أرسلها على واتساب</span></button><p class="send__note small"></p></form>';
    document.body.appendChild(dlg);
    var files = [], pics = dlg.querySelector(".send__pics"), size = dlg.querySelector("input"), note = dlg.querySelector(".send__note"), go = dlg.querySelector(".send__go");
    function msg() { var z = size.value.trim(); return EN ? "Hello, this is a photo of my space" + (z ? ", rough size " + z : "") + "." : "مرحبًا، هذه صورة المكان" + (z ? "، والمقاس تقريبًا " + z : "") + "."; }
    function draw() {
      pics.innerHTML = ""; files.forEach(function (f, i) {
        var u = URL.createObjectURL(f), d = document.createElement("div"); d.className = "send__pic";
        d.innerHTML = '<img alt="" src="' + u + '"><button type="button" aria-label="احذف الصورة">×</button>';
        d.querySelector("button").onclick = function () { files.splice(i, 1); URL.revokeObjectURL(u); files.length ? draw() : dlg.close(); };
        pics.appendChild(d);
      });
      note.textContent = "";
    }
    function open() { pick.value = ""; pick.click(); }
    document.addEventListener("click", function (e) { if (e.target.closest("[data-photo]")) { e.preventDefault(); files = []; open(); } });
    dlg.querySelector(".send__more").onclick = open;
    pick.addEventListener("change", function () {
      Array.prototype.forEach.call(pick.files, function (f) { if (files.length < 6) files.push(f); });
      if (!files.length) return; draw(); if (!dlg.open) { dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", ""); }
    });
    /* with the Drive drop configured: photos are saved to Abdelrahman's Drive and my chat opens with their links, nothing to choose */
    function shrink(f) {
      return new Promise(function (ok) {
        var im = new Image(), u = URL.createObjectURL(f);
        im.onload = function () {
          var k = Math.min(1, 2000 / Math.max(im.naturalWidth, im.naturalHeight)), c = document.createElement("canvas");
          c.width = Math.round(im.naturalWidth * k); c.height = Math.round(im.naturalHeight * k); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
          URL.revokeObjectURL(u); ok({ type: "image/jpeg", data: c.toDataURL("image/jpeg", .85).split(",")[1] });
        };
        im.onerror = function () { URL.revokeObjectURL(u); ok(null); }; im.src = u;
      });
    }
    function drop() {
      go.disabled = true; note.textContent = "جارٍ رفع الصور…";
      var win = window.open("about:blank", "_blank");
      Promise.all(files.map(shrink)).then(function (list) {
        return fetch(D.dropUrl, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ files: list.filter(Boolean), note: size.value.trim() }) });
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (!res.ok || !res.links.length) throw 0;
        var url = wa(msg() + "\n" + res.links.join("\n"));
        if (win) win.location = url; else window.location = url;
        go.disabled = false; dlg.close();
      }).catch(function () { if (win) win.close(); go.disabled = false; note.textContent = ""; share(); });
    }
    go.onclick = function () { if (D.dropUrl) drop(); else share(); };
    /* iPhone + WhatsApp drop the photo when text rides along, so the photos go alone; the message then opens straight in my chat */
    function share() {
      if (navigator.canShare && navigator.canShare({ files: files })) {
        navigator.share({ files: files }).then(function () { dlg.close(); window.open(wa(msg()), "_blank", "noopener"); },
          function (err) { if (err && err.name !== "AbortError") fallback(); });
      } else fallback();
    }
    /* no file sharing here (most computers): open the chat with the message, and say the photo needs attaching there */
    function fallback() {
      window.open(wa(msg()), "_blank", "noopener");
      note.textContent = "فُتحت محادثة واتساب. أرفق الصورة فيها من زر المرفقات.";
    }
  })();
  pill.hidden = false;
  setupAuto(home); setupVideos(home); setupStory(home); markReveals(home); route();
  heroShow(home.querySelector(".hero__frame"));
  if (work.hidden) assemble(home.querySelector(".hero__frame")); else { var hf = home.querySelector(".hero__frame"); if (hf) hf.classList.add("is-live"); }
})();
