/* KHOLY ART: page behaviour. No dependencies beyond Lenis (optional). */
(function () {
  "use strict";

  var WA_NUMBER = "201096622627";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---- projects ---------------------------------------------------------------------------- */

  var SIZE = "على مقاس المكان";
  var GLASS = "فسيفساء زجاجية";
  var MURAL = "جدارية من الفسيفساء الزجاجية";
  var projects = {
    deer: { title: "لوحة الغزال", desc: "غزال بالأسود على خلفية فاتحة، من قطع صغيرة قُصَّت باليد، داخل إطار داكن.", type: "لوحة فسيفساء", material: GLASS, size: SIZE, hero: "img/deer-flat.jpg", details: ["img/deer-detail.jpg", "img/deer-base.jpg"] },
    greatwave: { title: "جدارية الموجة", desc: "موجة كبيرة بالأزرق والأبيض على جدار خارجي تحت عريشة خشبية.", type: MURAL, material: GLASS, size: SIZE, hero: "img/greatwave.jpg", details: ["img/wave-making.jpg", "img/greatwave-flat.jpg"] },
    santorini: { title: "جدارية سانتوريني", desc: "زقاق بقبة زرقاء وبيوت بيضاء ينتهي بالبحر، داخل قوس.", type: MURAL, material: GLASS, size: SIZE, hero: "img/santorini.jpg", details: ["img/santorini-detail.jpg", "img/santorini-path.jpg"] },
    peacock: { title: "جدارية الطاووسين", desc: "طاووسان على غصن شجرة داخل إطار في الجدار، والإضاءة موزعة عليهما من الأعلى ومن الجانب.", type: MURAL, material: GLASS, size: SIZE, hero: "img/peacocks-flat.jpg", details: ["img/peacocks-detail.jpg", "img/peacocks-install.jpg"] },
    villa: { title: "لافتة فيلا", desc: "لافتة مدخل بالأسود على خلفية فاتحة، يحيط بها إطار من مربعات داكنة.", type: "لافتة مدخل من الفسيفساء", material: GLASS, size: SIZE, hero: "img/villa-flat.jpg", details: ["img/villa-detail.jpg", "img/num53-flat.jpg"] },
    sunset: { title: "لوحة الغروب", desc: "لوحة من الزجاج اليدوي مقاسها 120 × 170 سم، بإطار خشبي وألوان غروب فوق الماء.", type: "لوحة من الفسيفساء الزجاجية", material: "زجاج يدوي الصنع", size: "120 × 170 سم", hero: "img/sunset.jpg", details: ["img/sunset-detail.jpg", "img/sunset-sun.jpg"] },
    bluepeacock: { title: "جدارية الطاووس الأزرق", desc: "طاووس بالأزرق والأخضر والأحمر على جدار أبيض كامل، والخلفية نفسها من الفسيفساء البيضاء.", type: MURAL, material: GLASS, size: SIZE, hero: "img/bluepeacock.jpg", details: ["img/bluepeacock-detail.jpg"] },
    restaurant: { title: "جدارية قاع البحر", desc: "أسماك وشعاب مرجانية على جدار طويل في صالة مطعم.", type: MURAL, material: GLASS, size: SIZE, hero: "img/restaurant.jpg", details: ["img/restaurant-detail.jpg", "img/restaurant-coral.jpg"] },
    birds: { title: "جدارية العصافير", desc: "عصفوران على غصن بالأحمر والأبيض. الصورة من المرسم أثناء تركيب الجدارية قطعةً قطعة.", type: MURAL, material: GLASS, size: SIZE, hero: "img/birds.jpg", details: ["img/birds-detail.jpg", "img/birds-tail.jpg"] },
    pool: { title: "مسبح بزخرفة", desc: "زخرفة بالذهبي والأزرق الفاتح في قاع مسبح أزرق داكن.", type: "مسبح من الفسيفساء", material: GLASS, size: SIZE, hero: "img/poolorn.jpg", details: ["img/pool.jpg", "img/poolorn-detail.jpg"] },
    obour: { title: "جدارية العبور", desc: "جدارية خارجية بإطار زخرفي كُتبت عليها كلمة «العبور».", type: MURAL, material: GLASS, size: SIZE, hero: "img/obour.jpg", details: ["img/obour-detail.jpg"] }
  };
  var aliases = { wave: "bluepeacock" }; // old links from the previous site
  var gridOrder = [].map.call(document.querySelectorAll(".work"), function (a) { return a.getAttribute("href").replace("#project/", ""); });

  /* ---- smooth scrolling (not under reduced motion) ----------------------------------------- */

  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
  }

  /* ---- theme: follows the system until the toggle is used ---------------------------------- */

  (function () {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    var root = document.documentElement;
    var sys = matchMedia("(prefers-color-scheme: dark)");
    var metas = [].slice.call(document.querySelectorAll('meta[name="theme-color"]'));
    var BAR = { light: "#f8f9fb", dark: "#12151b" };
    function current() { return root.dataset.theme || (sys.matches ? "dark" : "light"); }
    function sync() {
      var t = current();
      // The label names what the button switches to.
      btn.setAttribute("aria-label", t === "dark" ? "الوضع الفاتح" : "الوضع الداكن");
      btn.title = btn.getAttribute("aria-label");
      metas.forEach(function (m) { m.content = root.dataset.theme ? BAR[t] : BAR[m.media.indexOf("dark") > -1 ? "dark" : "light"]; });
    }
    btn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      // Picking the system's own theme goes back to following the system.
      var follow = next === (sys.matches ? "dark" : "light");
      try { follow ? localStorage.removeItem("theme") : localStorage.setItem("theme", next); } catch (e) {}
      if (follow) delete root.dataset.theme; else root.dataset.theme = next;
      sync();
    });
    sys.addEventListener("change", sync);
    sync();
  })();

  /* ---- carousel: a cylinder that turns with scroll, drag and the arrow keys ----------------- */

  (function () {
    var box = document.getElementById("carousel");
    var track = document.getElementById("carousel-track");
    if (!box || !track) return;
    var originals = [].slice.call(track.children);
    // Two copies fill the cylinder to eight. Copying the 3rd and 4th puts each
    // copy opposite its original, so the same work never shows twice side by
    // side. The copies are hidden from screen readers.
    originals.slice(2, 4).forEach(function (c) { var k = c.cloneNode(true); k.setAttribute("aria-hidden", "true"); track.appendChild(k); });
    var cards = [].slice.call(track.children);
    var N = cards.length, step = 360 / N, R = 0;

    function layout() {
      // Cards fill most of the carousel's height, within its width.
      var cw = Math.max(180, Math.min(box.clientHeight * 0.86 / 1.38, box.clientWidth * 0.62)), ch = cw * 1.38;
      box.style.setProperty("--cw", cw + "px");
      box.style.setProperty("--ch", ch + "px");
      R = Math.round((cw + 90) / 2 / Math.tan(Math.PI / N));
      cards.forEach(function (c, i) { c.style.transform = "rotateY(" + i * step + "deg) translateZ(" + R + "px)"; });
    }
    layout();
    addEventListener("resize", layout);

    // The cylinder turns on its own at SPEED (degrees per 60 Hz frame): one card
    // about every five seconds. It eases to a stop while the pointer is over it,
    // while it has keyboard focus (WCAG 2.2.2: a way to pause), while it's off
    // screen or the tab is hidden, and never turns on its own under reduced motion.
    var SPEED = reduce ? 0 : -step / 300;
    var hovered = false, focused = false, visible = true;
    function idle() { return hovered || focused || !visible || document.hidden ? 0 : SPEED; }
    var angle = 0, vel = 0, dragging = false, lastX = 0, moved = 0, lastY = scrollY, running = false, lastT = 0;
    function render() { track.style.transform = "translateZ(" + -R + "px) rotateX(-4deg) rotateY(" + angle + "deg)"; }
    function frame(t) {
      // Scale by elapsed time, so 120 Hz screens don't turn twice as fast.
      var k = lastT ? Math.min(3, (t - lastT) / 16.667) : 1; lastT = t;
      var target = idle();
      if (!dragging) { vel += (target - vel) * (1 - Math.pow(0.96, k)); angle += vel * k; }
      render();
      if (dragging || Math.abs(vel - target) > 0.002 || target) requestAnimationFrame(frame); else { running = false; lastT = 0; }
    }
    function kick() { if (!running) { running = true; requestAnimationFrame(frame); } }
    render();
    if (SPEED) {
      box.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") hovered = true; });
      box.addEventListener("pointerleave", function () { hovered = false; kick(); });
      box.addEventListener("focusin", function () { focused = true; });
      box.addEventListener("focusout", function () { focused = false; kick(); });
      document.addEventListener("visibilitychange", kick);
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (es) { visible = es[0].isIntersecting; kick(); }).observe(box);
      }
      kick();
    }

    box.addEventListener("pointerdown", function (e) { dragging = true; moved = 0; lastX = e.clientX; box.setPointerCapture(e.pointerId); kick(); });
    box.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var d = (e.clientX - lastX) * 0.15; lastX = e.clientX; moved += Math.abs(d);
      angle += d; vel = d;
    });
    function end(e) {
      if (!dragging) return;
      dragging = false;
      // A tap without a drag opens the work under the pointer.
      if (moved < 1 && e.type === "pointerup") {
        box.releasePointerCapture(e.pointerId);
        var hit = document.elementFromPoint(e.clientX, e.clientY);
        var card = hit && hit.closest(".carousel__card");
        if (card) location.hash = "project/" + card.dataset.project;
      }
    }
    box.addEventListener("pointerup", end);
    box.addEventListener("pointercancel", end);
    box.addEventListener("keydown", function (e) {
      // Left and right turn the cylinder by about one card.
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      var target = angle + (e.key === "ArrowLeft" ? step : -step);
      if (reduce) { angle = target; render(); return; }
      vel = (target - angle) * 0.04 / 0.96; // velocity decays by 0.96 a frame, so this sums to one step
      kick();
    });
    if (!reduce) addEventListener("scroll", function () {
      var dy = scrollY - lastY; lastY = scrollY;
      vel += Math.max(-0.8, Math.min(0.8, dy * -0.006));
      kick();
    }, { passive: true });
  })();

  /* ---- works grid: rows, filter, reveal ---------------------------------------------------- */

  var works = [].slice.call(document.querySelectorAll(".work"));
  var filterStatus = document.getElementById("filter-status");
  // Justified rows: each work's share of a row follows its image's shape, so
  // every image in a row is the same height and nothing is cropped.
  works.forEach(function (el) {
    var img = el.querySelector("img");
    el.style.setProperty("--ar", (img.getAttribute("width") / img.getAttribute("height")).toFixed(4));
  });
  function place() { return works.filter(function (el) { return !el.hidden; }).length; }
  [].forEach.call(document.querySelectorAll("[data-filter]"), function (b, _, all) {
    b.addEventListener("click", function () {
      [].forEach.call(all, function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      var f = b.dataset.filter;
      works.forEach(function (el) { el.hidden = f !== "all" && el.dataset.cat !== f; });
      var n = place();
      if (filterStatus) filterStatus.textContent = "الأعمال المعروضة: " + n + " من " + works.length;
      if (lenis && lenis.resize) lenis.resize();
    });
  });

  function reveal(els, threshold) {
    if (reduce || !("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { threshold: threshold });
    els.forEach(function (el) { io.observe(el); });
  }
  reveal(works, 0.12);
  reveal([].slice.call(document.querySelectorAll(".reveal-line")), 0.6);

  /* ---- pointer extras: "view" disc over works, image preview over services ------------------ */

  if (finePointer) {
    var cur = document.getElementById("view-cursor");
    addEventListener("pointermove", function (e) { cur.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)"; }, { passive: true });
    works.forEach(function (el) {
      el.addEventListener("pointerenter", function () { cur.classList.add("is-on"); });
      el.addEventListener("pointerleave", function () { cur.classList.remove("is-on"); });
      el.addEventListener("focus", function () { cur.classList.remove("is-on"); });
    });

    var prev = document.getElementById("service-preview"), prevImg = document.getElementById("service-preview-img");
    [].forEach.call(document.querySelectorAll(".service"), function (row) {
      row.addEventListener("pointerenter", function () {
        var src = row.dataset.img;
        if (!src) { prev.classList.remove("is-on"); return; }
        prevImg.src = src; prev.classList.add("is-on");
      });
      row.addEventListener("pointermove", function (e) {
        // Sit above the pointer with a gap, never on it; flip below when there is no room above.
        var w = prev.offsetWidth, h = prev.offsetHeight, gap = 28, edge = 16;
        var above = e.clientY - gap - h >= edge + 64; /* clear of the fixed header */
        var x = Math.min(Math.max(e.clientX - w / 2, edge), innerWidth - w - edge);
        prev.classList.toggle("is-below", !above);
        prev.style.left = x + "px";
        prev.style.top = (above ? e.clientY - gap - h : e.clientY + gap) + "px";
      });
      row.addEventListener("pointerleave", function () { prev.classList.remove("is-on"); });
    });
  }

  /* ---- scroll progress and the floating WhatsApp button ------------------------------------- */

  var bar = document.getElementById("scroll-progress"), wa = document.getElementById("wa-float");
  function onScroll() {
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    bar.style.inlineSize = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    wa.classList.toggle("is-on", scrollY > innerHeight * 0.6);
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { wa.classList.toggle("is-footer", es[0].isIntersecting); })
      .observe(document.querySelector(".site-footer"));
  }

  /* ---- project view: #project/<id> opens a full-screen dialog ------------------------------- */

  var view = document.getElementById("project-view");
  var opener = null, openedHere = false;
  function $(id) { return document.getElementById(id); }

  function fill(id) {
    var p = projects[id];
    $("pv-title").textContent = p.title;
    $("pv-desc").textContent = p.desc;
    $("pv-type").textContent = p.type;
    $("pv-material").textContent = p.material;
    $("pv-size").textContent = p.size;
    $("pv-hero").src = p.hero;
    $("pv-hero").alt = p.title;
    var box = $("pv-details");
    box.textContent = "";
    p.details.filter(function (src) { return src !== p.hero; }).forEach(function (src, i) {
      var img = document.createElement("img");
      img.src = src; img.loading = "lazy"; img.decoding = "async";
      img.alt = p.title + (i === 0 ? "، تفاصيل القطع" : "، لقطة أخرى");
      box.appendChild(img);
    });
    var at = gridOrder.indexOf(id), next = gridOrder[(at + 1) % gridOrder.length] || gridOrder[0];
    var nextLink = $("pv-next");
    nextLink.href = "#project/" + next;
    nextLink.firstChild.textContent = "العمل التالي: " + projects[next].title + " ";
  }

  function route() {
    var m = location.hash.match(/^#project\/([\w-]+)/);
    var id = m && (aliases[m[1]] || m[1]);
    if (id && projects[id]) {
      fill(id);
      if (!view.open) {
        opener = document.activeElement;
        view.showModal();
        if (lenis) lenis.stop();
      }
      view.scrollTop = 0;
      $("pv-title").setAttribute("tabindex", "-1");
      $("pv-title").focus({ preventScroll: true });
    } else if (view.open) {
      view.close();
    }
  }

  function leave() {
    // Go back if we pushed the entry; otherwise just clear the hash.
    if (openedHere) history.back();
    else { history.replaceState(null, "", location.pathname + location.search); route(); }
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#project/"]');
    if (a) openedHere = true;
  });
  view.addEventListener("cancel", function (e) { e.preventDefault(); leave(); });
  view.querySelector("[data-close]").addEventListener("click", leave);
  view.addEventListener("close", function () {
    if (lenis) lenis.start();
    if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    openedHere = false;
  });
  addEventListener("hashchange", route);
  route();

  /* ---- WhatsApp: a ready message naming the service or work, and where the visit came from -- */

  var params = new URLSearchParams(location.search), src = [];
  try {
    ["utm_source", "utm_campaign", "utm_content"].forEach(function (k) { var v = params.get(k); if (v) sessionStorage.setItem(k, v); });
    ["utm_source", "utm_campaign", "utm_content"].forEach(function (k) { var v = sessionStorage.getItem(k); if (v) src.push(v); });
  } catch (err) { /* storage blocked: fall back to the referrer */ }
  var ref = document.referrer;
  var origin = src.length ? src.join(" / ") : ref.indexOf("facebook") > -1 ? "facebook" : ref.indexOf("instagram") > -1 ? "instagram" : "الموقع";

  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href*="wa.me/' + WA_NUMBER + '"]');
    if (!a) return;
    var subject = a.dataset.wa || (view.open ? $("pv-title").textContent : "");
    var msg = "مرحبًا" + (subject ? "، أودّ الاستفسار عن " + subject.trim() : "") + "\n(المصدر: " + origin + ")";
    a.href = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
    if (window.fbq) window.fbq("track", "Contact", { content_name: subject || "عام", content_category: origin });
  }, true);
})();
