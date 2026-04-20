/* ============================================================
   Yalla Kids — shared JS (mobile nav hamburger)
   ============================================================ */
(function () {
  function initMobileNav() {
    document.querySelectorAll(".nav-wrap").forEach(function (wrap) {
      if (wrap.querySelector(".nav-toggle")) return; // already initialized
      var links = wrap.querySelector(".nav-links");
      var actions = wrap.querySelector(".nav-actions");
      if (!links) return;

      var btn = document.createElement("button");
      btn.className = "nav-toggle";
      btn.type = "button";
      btn.setAttribute("aria-label", "Open menu");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-controls", "site-nav-links");
      btn.innerHTML = "<span></span><span></span><span></span>";

      // insert after nav-actions so it's the last item on mobile
      if (actions) {
        if (actions.nextSibling) {
          wrap.insertBefore(btn, actions.nextSibling);
        } else {
          wrap.appendChild(btn);
        }
      } else {
        wrap.appendChild(btn);
      }

      // ensure links has an id for aria-controls
      if (!links.id) links.id = "site-nav-links";

      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = wrap.classList.toggle("mobile-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      });

      // close when clicking a link
      links.addEventListener("click", function (e) {
        var a = e.target.closest("a");
        if (a) {
          wrap.classList.remove("mobile-open");
          btn.setAttribute("aria-expanded", "false");
          btn.setAttribute("aria-label", "Open menu");
        }
      });

      // close on resize above breakpoint
      window.addEventListener("resize", function () {
        if (window.innerWidth > 980 && wrap.classList.contains("mobile-open")) {
          wrap.classList.remove("mobile-open");
          btn.setAttribute("aria-expanded", "false");
          btn.setAttribute("aria-label", "Open menu");
        }
      });

      // close on Escape
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && wrap.classList.contains("mobile-open")) {
          wrap.classList.remove("mobile-open");
          btn.setAttribute("aria-expanded", "false");
          btn.setAttribute("aria-label", "Open menu");
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileNav);
  } else {
    initMobileNav();
  }
})();

/* ============================================================
   Yalla Kids — mobile sticky bottom nav (auto-injected)
   ============================================================ */
(function () {
  // Items: [href, en label, ar label, svg icon, match patterns]
  var ITEMS = [
    {
      href: "yalla-kids-home-souq.html",
      en: "Home",
      ar: "الرئيسية",
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
      match: ["yalla-kids-home", "yalla-kids-landing", "yalla-kids-sitemap"]
    },
    {
      href: "yalla-kids-search.html",
      en: "Search",
      ar: "بحث",
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
      match: ["yalla-kids-search", "yalla-kids-classes", "yalla-kids-class-detail", "yalla-kids-places", "yalla-kids-place-detail", "yalla-kids-camps", "yalla-kids-map"]
    },
    {
      href: "yalla-kids-parent-dashboard.html#favs",
      en: "Favorites",
      ar: "المفضلة",
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.5-9.5-9.5C.7 8 3 4 6.5 4c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C21 4 23.3 8 21.5 11.5 19 16.5 12 21 12 21z"/></svg>',
      match: ["#favs"],
      key: "saved"
    },
    {
      href: "yalla-kids-parent-dashboard.html#bookings",
      en: "Bookings",
      ar: "حجوزاتي",
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="m9 14 2 2 4-4"/></svg>',
      match: ["#bookings", "yalla-kids-checkout-success", "yalla-kids-manage-booking", "yalla-kids-parent-dashboard", "yalla-kids-provider-dashboard", "yalla-kids-checkout", "yalla-kids-login", "yalla-kids-signup", "yalla-kids-account"],
      key: "bookings"
    }
  ];

  function pageName() {
    var path = (location.pathname || "").split("/").pop() || "";
    return path.toLowerCase();
  }

  function isActive(item) {
    var name = pageName();
    var hash = (location.hash || "").toLowerCase();
    if (item.key === "saved") {
      return hash === "#favs" && name.indexOf("yalla-kids-parent-dashboard") === 0;
    }
    // Account: only active on dashboard *without* #favs hash
    if (item.match.indexOf("yalla-kids-parent-dashboard") !== -1 && item.key !== "saved") {
      if (hash === "#favs") return false;
    }
    for (var i = 0; i < item.match.length; i++) {
      var m = item.match[i];
      if (m.charAt(0) === "#") {
        if (hash === m) return true;
      } else if (name.indexOf(m) === 0) {
        return true;
      }
    }
    return false;
  }

  function initBottomNav() {
    if (document.getElementById("yk-bottom-nav")) return;
    // Skip on the explicit landing splash if desired? — keep on all pages.
    var nav = document.createElement("nav");
    nav.id = "yk-bottom-nav";
    nav.className = "yk-bnav";
    nav.setAttribute("aria-label", "Primary mobile navigation");

    var html = "";
    ITEMS.forEach(function (it) {
      var active = isActive(it);
      html +=
        '<a class="yk-bnav-item' + (active ? " is-active" : "") + '" href="' + it.href + '"' +
          (active ? ' aria-current="page"' : "") + '>' +
          '<span class="yk-bnav-icon" aria-hidden="true">' + it.svg + '</span>' +
          '<span class="yk-bnav-label en-only">' + it.en + '</span>' +
          '<span class="yk-bnav-label ar-only">' + it.ar + '</span>' +
        '</a>';
    });
    nav.innerHTML = html;
    document.body.appendChild(nav);

    // Add bottom padding to body so content doesn't sit underneath the bar
    document.body.classList.add("has-bottom-nav");

    // If favorites change, ensure the saved item is highlighted (no-op unless on dashboard)
    window.addEventListener("hashchange", function () {
      // Re-evaluate active states without rebuilding
      var items = nav.querySelectorAll(".yk-bnav-item");
      ITEMS.forEach(function (it, i) {
        var el = items[i];
        if (!el) return;
        var active = isActive(it);
        el.classList.toggle("is-active", active);
        if (active) el.setAttribute("aria-current", "page");
        else el.removeAttribute("aria-current");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBottomNav);
  } else {
    initBottomNav();
  }
})();

/* ============================================================
   Yalla Kids — global search dropdown (auto-injected)
   Adds a search button to every header + an overlay with
   live results across places + classes. Keyboard-friendly.
   ============================================================ */
(function () {
  var ICON_SEARCH =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>' +
    '</svg>';

  var overlayEl = null;
  var inputEl = null;
  var resultsEl = null;
  var hintsEl = null;
  var activeIndex = -1;
  var lastResults = [];
  var debounceTimer = null;
  var dataLoading = false;
  var opened = false;

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function ensureDataLoaded(cb) {
    if (window.YALLA_DATA && window.YALLA_DATA.all) {
      cb();
      return;
    }
    if (dataLoading) {
      var iv = setInterval(function () {
        if (window.YALLA_DATA && window.YALLA_DATA.all) {
          clearInterval(iv);
          cb();
        }
      }, 50);
      return;
    }
    dataLoading = true;
    var existing = document.querySelector('script[src$="yalla-kids-data.js"]');
    if (existing) {
      existing.addEventListener("load", function () { cb(); });
      return;
    }
    var s = document.createElement("script");
    s.src = "yalla-kids-data.js";
    s.async = false;
    s.onload = function () { cb(); };
    document.head.appendChild(s);
  }

  function buildOverlay() {
    if (overlayEl) return;
    var o = document.createElement("div");
    o.className = "yk-search-overlay";
    o.setAttribute("role", "dialog");
    o.setAttribute("aria-label", "Search Yalla Kids");
    o.innerHTML =
      '<div class="yk-search-panel" role="document">' +
        '<div class="yk-search-input-wrap">' +
          ICON_SEARCH +
          '<input class="yk-search-input" type="search" autocomplete="off" ' +
            'placeholder="Search classes, places, camps…" ' +
            'aria-label="Search Yalla Kids" />' +
          '<button class="yk-search-close" type="button" aria-label="Close search">Esc</button>' +
        '</div>' +
        '<div class="yk-search-results" role="listbox" aria-label="Search results"></div>' +
        '<div class="yk-search-footer">' +
          '<div class="yk-search-hints">' +
            '<span class="yk-search-hint"><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>' +
            '<span class="yk-search-hint"><kbd>↵</kbd> to open</span>' +
            '<span class="yk-search-hint"><kbd>Esc</kbd> to close</span>' +
          '</div>' +
          '<a href="yalla-kids-search.html" class="yk-search-seeall">See all results →</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(o);
    overlayEl = o;
    inputEl = o.querySelector(".yk-search-input");
    resultsEl = o.querySelector(".yk-search-results");
    hintsEl = o.querySelector(".yk-search-hints");

    o.addEventListener("click", function (e) {
      if (e.target === o) closeOverlay();
    });
    o.querySelector(".yk-search-close").addEventListener("click", closeOverlay);

    inputEl.addEventListener("input", function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(runSearch, 80);
      // update see-all link with query
      var a = o.querySelector(".yk-search-seeall");
      var q = inputEl.value.trim();
      a.href = "yalla-kids-search.html" + (q ? "?q=" + encodeURIComponent(q) : "");
    });

    inputEl.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveActive(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        moveActive(-1);
      } else if (e.key === "Enter") {
        if (activeIndex >= 0 && lastResults[activeIndex]) {
          e.preventDefault();
          navigateTo(lastResults[activeIndex]);
        } else {
          // fall through — let Enter submit nothing, but go to see-all if there's a query
          var q = inputEl.value.trim();
          if (q) {
            e.preventDefault();
            location.href = "yalla-kids-search.html?q=" + encodeURIComponent(q);
          }
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeOverlay();
      }
    });

    // Delegate clicks on result rows
    resultsEl.addEventListener("click", function (e) {
      var row = e.target.closest(".yk-search-result");
      if (!row) return;
      e.preventDefault();
      var idx = parseInt(row.getAttribute("data-idx"), 10);
      if (!isNaN(idx) && lastResults[idx]) navigateTo(lastResults[idx]);
    });
  }

  function openOverlay() {
    buildOverlay();
    opened = true;
    overlayEl.classList.add("is-open");
    document.body.style.overflow = "hidden";
    // Render initial "suggestions" state — show recents if any
    ensureDataLoaded(function () {
      if (!opened) return;
      if (inputEl.value.trim()) {
        runSearch();
      } else {
        renderEmptyState();
      }
    });
    setTimeout(function () { if (inputEl) inputEl.focus(); }, 30);
  }

  function closeOverlay() {
    if (!overlayEl) return;
    opened = false;
    overlayEl.classList.remove("is-open");
    document.body.style.overflow = "";
    activeIndex = -1;
  }

  function navigateTo(item) {
    var href = "yalla-kids-" + (item.kind === "class" ? "class" : "place") +
               "-detail.html?slug=" + encodeURIComponent(item.slug);
    location.href = href;
  }

  function moveActive(delta) {
    if (!lastResults.length) return;
    activeIndex = (activeIndex + delta + lastResults.length) % lastResults.length;
    var rows = resultsEl.querySelectorAll(".yk-search-result");
    rows.forEach(function (r, i) {
      r.classList.toggle("is-active", i === activeIndex);
      if (i === activeIndex) {
        r.scrollIntoView({ block: "nearest" });
      }
    });
  }

  function renderEmptyState() {
    var D = window.YALLA_DATA;
    lastResults = [];
    activeIndex = -1;
    // Try to show "recently viewed" if available
    if (D && D.recents && typeof D.recents.items === "function") {
      var recs = D.recents.items();
      if (recs && recs.length) {
        lastResults = recs.slice(0, 6);
        resultsEl.innerHTML =
          '<div class="yk-search-section"><span class="en-only">Recently viewed</span>' +
          '<span class="ar-only">شاهدتها مؤخراً</span></div>' +
          renderRows(lastResults);
        return;
      }
    }
    resultsEl.innerHTML =
      '<div class="yk-search-empty">' +
        '<strong><span class="en-only">Start typing to search</span>' +
        '<span class="ar-only">اكتب للبحث</span></strong>' +
        '<span class="en-only">Classes, places, camps — across all of Qatar.</span>' +
        '<span class="ar-only">صفوف وأماكن ومعسكرات — في كل قطر.</span>' +
      '</div>';
  }

  function renderRows(items) {
    var D = window.YALLA_DATA;
    var isRTL = document.documentElement.getAttribute("dir") === "rtl";
    return items.map(function (it, i) {
      var emoji = (D && D.emojiFor && D.emojiFor(it)) || (it.kind === "class" ? "🎯" : "🎈");
      var accent = (D && D.accentFor && D.accentFor(it)) || "#FFF1C2";
      var nameEn = escapeHtml(it.name_en || "");
      var nameAr = escapeHtml(it.name_ar || it.name_en || "");
      var area = escapeHtml(it.area || "");
      var cat = escapeHtml(it.category_label || "");
      var age = escapeHtml(it.age_label || "");
      var kindBadge = it.kind === "class"
        ? '<span class="yk-search-badge is-class"><span class="en-only">Class</span><span class="ar-only">صف</span></span>'
        : '<span class="yk-search-badge is-place"><span class="en-only">Place</span><span class="ar-only">مكان</span></span>';
      var meta = [];
      if (cat) meta.push(cat);
      if (age) meta.push(age);
      if (area) meta.push(area);
      var metaStr = meta.join(" · ");
      return (
        '<a class="yk-search-result" data-idx="' + i + '" role="option" ' +
          'href="yalla-kids-' + (it.kind === "class" ? "class" : "place") +
          '-detail.html?slug=' + encodeURIComponent(it.slug) + '">' +
          '<div class="yk-search-result-icon" style="background:' + accent + '">' + emoji + '</div>' +
          '<div class="yk-search-result-body">' +
            '<div class="yk-search-result-name">' +
              '<span class="en-only">' + nameEn + '</span>' +
              '<span class="ar-only">' + nameAr + '</span>' +
            '</div>' +
            '<div class="yk-search-result-meta">' +
              kindBadge +
              (metaStr ? '<span>' + metaStr + '</span>' : '') +
            '</div>' +
          '</div>' +
          '<span class="yk-search-result-arrow" aria-hidden="true">' + (isRTL ? "←" : "→") + '</span>' +
        '</a>'
      );
    }).join("");
  }

  function runSearch() {
    var D = window.YALLA_DATA;
    var q = (inputEl.value || "").trim();
    if (!q) {
      renderEmptyState();
      return;
    }
    if (!D || !D.all) {
      resultsEl.innerHTML = '<div class="yk-search-empty"><span class="en-only">Loading…</span><span class="ar-only">جار التحميل…</span></div>';
      return;
    }
    var ql = q.toLowerCase();
    // Score: name starts-with > name contains > tag/area/category contains
    var scored = [];
    for (var i = 0; i < D.all.length; i++) {
      var it = D.all[i];
      var name = (it.name_en || "").toLowerCase();
      var nameAr = (it.name_ar || "").toLowerCase();
      var tags = ((it.tags || []).join(" ")).toLowerCase();
      var extra = ((it.category_label || "") + " " + (it.area || "") + " " + (it.highlights || "")).toLowerCase();
      var score = 0;
      if (name.indexOf(ql) === 0 || nameAr.indexOf(ql) === 0) score = 100;
      else if (name.indexOf(ql) !== -1 || nameAr.indexOf(ql) !== -1) score = 70;
      else if (tags.indexOf(ql) !== -1) score = 40;
      else if (extra.indexOf(ql) !== -1) score = 20;
      if (score > 0) scored.push({ it: it, s: score });
    }
    scored.sort(function (a, b) { return b.s - a.s; });
    lastResults = scored.slice(0, 8).map(function (x) { return x.it; });
    activeIndex = lastResults.length > 0 ? 0 : -1;

    if (!lastResults.length) {
      resultsEl.innerHTML =
        '<div class="yk-search-empty">' +
          '<strong><span class="en-only">No matches for "' + escapeHtml(q) + '"</span>' +
          '<span class="ar-only">لا توجد نتائج لـ "' + escapeHtml(q) + '"</span></strong>' +
          '<span class="en-only">Try a broader term like "art" or "swim".</span>' +
          '<span class="ar-only">جرّب كلمة أعم مثل "فن" أو "سباحة".</span>' +
        '</div>';
      return;
    }

    // Split into classes + places sections
    var classes = lastResults.filter(function (r) { return r.kind === "class"; });
    var places  = lastResults.filter(function (r) { return r.kind === "place"; });
    var html = "";
    // Keep original order but group: rebuild lastResults in section order so keyboard nav matches DOM
    var ordered = classes.concat(places);
    lastResults = ordered;
    activeIndex = ordered.length > 0 ? 0 : -1;
    var idx = 0;
    if (classes.length) {
      html += '<div class="yk-search-section"><span class="en-only">Classes</span><span class="ar-only">الصفوف</span></div>';
      html += renderRowsRange(ordered, idx, idx + classes.length);
      idx += classes.length;
    }
    if (places.length) {
      html += '<div class="yk-search-section"><span class="en-only">Places</span><span class="ar-only">الأماكن</span></div>';
      html += renderRowsRange(ordered, idx, idx + places.length);
    }
    resultsEl.innerHTML = html;
    // highlight first
    var rows = resultsEl.querySelectorAll(".yk-search-result");
    if (rows[0]) rows[0].classList.add("is-active");
  }

  // like renderRows but assigns correct data-idx matching the full lastResults ordering
  function renderRowsRange(arr, start, end) {
    var D = window.YALLA_DATA;
    var isRTL = document.documentElement.getAttribute("dir") === "rtl";
    var out = "";
    for (var i = start; i < end; i++) {
      var it = arr[i];
      var emoji = (D && D.emojiFor && D.emojiFor(it)) || (it.kind === "class" ? "🎯" : "🎈");
      var accent = (D && D.accentFor && D.accentFor(it)) || "#FFF1C2";
      var nameEn = escapeHtml(it.name_en || "");
      var nameAr = escapeHtml(it.name_ar || it.name_en || "");
      var area = escapeHtml(it.area || "");
      var cat = escapeHtml(it.category_label || "");
      var age = escapeHtml(it.age_label || "");
      var kindBadge = it.kind === "class"
        ? '<span class="yk-search-badge is-class"><span class="en-only">Class</span><span class="ar-only">صف</span></span>'
        : '<span class="yk-search-badge is-place"><span class="en-only">Place</span><span class="ar-only">مكان</span></span>';
      var meta = [];
      if (cat) meta.push(cat);
      if (age) meta.push(age);
      if (area) meta.push(area);
      var metaStr = meta.join(" · ");
      out +=
        '<a class="yk-search-result" data-idx="' + i + '" role="option" ' +
          'href="yalla-kids-' + (it.kind === "class" ? "class" : "place") +
          '-detail.html?slug=' + encodeURIComponent(it.slug) + '">' +
          '<div class="yk-search-result-icon" style="background:' + accent + '">' + emoji + '</div>' +
          '<div class="yk-search-result-body">' +
            '<div class="yk-search-result-name">' +
              '<span class="en-only">' + nameEn + '</span>' +
              '<span class="ar-only">' + nameAr + '</span>' +
            '</div>' +
            '<div class="yk-search-result-meta">' +
              kindBadge +
              (metaStr ? '<span>' + metaStr + '</span>' : '') +
            '</div>' +
          '</div>' +
          '<span class="yk-search-result-arrow" aria-hidden="true">' + (isRTL ? "←" : "→") + '</span>' +
        '</a>';
    }
    return out;
  }

  function mountSearchButton() {
    document.querySelectorAll(".nav-wrap").forEach(function (wrap) {
      if (wrap.querySelector(".yk-search-btn")) return;
      var actions = wrap.querySelector(".nav-actions");
      if (!actions) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "yk-search-btn";
      btn.setAttribute("aria-label", "Open search");
      btn.innerHTML =
        ICON_SEARCH +
        '<span class="yk-search-label en-only">Search</span>' +
        '<span class="yk-search-label ar-only">بحث</span>' +
        '<span class="yk-search-kbd">/</span>';
      // insert as the first child of nav-actions
      if (actions.firstChild) {
        actions.insertBefore(btn, actions.firstChild);
      } else {
        actions.appendChild(btn);
      }
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openOverlay();
      });
    });
  }

  function initSearch() {
    mountSearchButton();
    // global hotkey: "/" opens, unless user is typing in a form element
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && !isTypingTarget(e.target) && !opened) {
        e.preventDefault();
        openOverlay();
      } else if (e.key === "Escape" && opened) {
        closeOverlay();
      }
    });
  }

  function isTypingTarget(el) {
    if (!el) return false;
    var tag = (el.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    if (el.isContentEditable) return true;
    return false;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSearch);
  } else {
    initSearch();
  }
})();

/* ============================================================
   Yalla Kids — PDPL consent banner + window.YK_CONSENT API
   Qatar Personal Data Privacy Protection Law (Law No. 13 / 2016)
   ============================================================ */
(function () {
  var KEY = "yalla-kids:consent";

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }
  function write(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  function setStatus(accepted) {
    var state = { accepted: !!accepted, t: Date.now() };
    write(state);
    window.YK_CONSENT = state;
    try {
      window.dispatchEvent(new CustomEvent("yalla:consent-changed", { detail: state }));
    } catch (e) {}
  }

  // Public API
  window.YK_CONSENT = read() || { accepted: null, t: 0 };
  window.YK_CONSENT_API = {
    get: function () { return read(); },
    accept: function () { setStatus(true); hideBanner(); },
    reject: function () { setStatus(false); hideBanner(); },
    revoke: function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      window.YK_CONSENT = { accepted: null, t: 0 };
      showBanner();
    }
  };

  var bannerEl = null;

  function buildBanner() {
    if (bannerEl) return bannerEl;
    var el = document.createElement("div");
    el.id = "yk-consent";
    el.className = "yk-consent";
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", "Cookie and data consent");
    el.innerHTML =
      '<div class="yk-consent-head">' +
        '<span class="yk-consent-emoji" aria-hidden="true">🍪</span>' +
        '<h2 class="yk-consent-title">' +
          '<span class="en-only">Just so you know</span>' +
          '<span class="ar-only">قبل ما تكمّل</span>' +
        '</h2>' +
      '</div>' +
      '<p class="yk-consent-body">' +
        '<span class="en-only">We use cookies to remember your favorites and to count anonymous page views — that\'s it. No ad-tracking, no resale. ' +
          'See our <a href="yalla-kids-privacy.html">privacy notice</a> (compliant with Qatar PDPL Law 13/2016).</span>' +
        '<span class="ar-only">نستخدم ملفات تعريف الارتباط لحفظ مفضلاتك وعدّ زيارات الصفحات بشكل مجهول — هذا كل شيء. لا تتبع إعلاني ولا بيع للبيانات. ' +
          'راجع <a href="yalla-kids-privacy.html">إشعار الخصوصية</a> (متوافق مع قانون قطر للخصوصية رقم 13/2016).</span>' +
      '</p>' +
      '<div class="yk-consent-actions">' +
        '<button type="button" class="yk-consent-btn is-primary" data-action="accept">' +
          '<span class="en-only">Accept all</span><span class="ar-only">قبول الكل</span>' +
        '</button>' +
        '<button type="button" class="yk-consent-btn" data-action="reject">' +
          '<span class="en-only">Essential only</span><span class="ar-only">الضروري فقط</span>' +
        '</button>' +
        '<a class="yk-consent-link" href="yalla-kids-privacy.html">' +
          '<span class="en-only">Learn more</span><span class="ar-only">تفاصيل</span>' +
        '</a>' +
      '</div>';
    document.body.appendChild(el);
    bannerEl = el;

    el.querySelector('[data-action="accept"]').addEventListener("click", function () {
      window.YK_CONSENT_API.accept();
    });
    el.querySelector('[data-action="reject"]').addEventListener("click", function () {
      window.YK_CONSENT_API.reject();
    });
    return el;
  }

  function showBanner() {
    var el = buildBanner();
    el.classList.add("is-visible");
  }
  function hideBanner() {
    if (bannerEl) bannerEl.classList.remove("is-visible");
  }

  function initConsent() {
    var state = read();
    // Don't show banner on the privacy page itself, or in checkout flows
    var path = (location.pathname || "").toLowerCase();
    if (path.indexOf("yalla-kids-privacy") !== -1) return;
    if (!state || state.accepted == null) {
      // Defer briefly so it doesn't compete with hero animations
      setTimeout(showBanner, 400);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initConsent);
  } else {
    initConsent();
  }
})();

/* ============================================================
   Yalla Kids — Plausible analytics (consent-gated, privacy-first)
   Plausible is cookieless by default, but we still gate on the
   user's PDPL choice and on production hostname.
   ============================================================ */
(function () {
  // Identify production hosts. Add subdomains as needed.
  var PROD_HOSTS = ["yallakids.qa", "www.yallakids.qa"];
  var DOMAIN = "yallakids.qa";
  var SCRIPT_SRC = "https://plausible.io/js/script.outbound-links.js";

  var loaded = false;

  function isProd() {
    var h = (location.hostname || "").toLowerCase();
    return PROD_HOSTS.indexOf(h) !== -1;
  }

  function load() {
    if (loaded) return;
    if (!isProd()) {
      // Expose a stub so tracking calls on dev/preview never throw.
      window.plausible = window.plausible || function () {
        (window.plausible.q = window.plausible.q || []).push(arguments);
      };
      return;
    }
    var s = document.createElement("script");
    s.defer = true;
    s.src = SCRIPT_SRC;
    s.setAttribute("data-domain", DOMAIN);
    document.head.appendChild(s);
    // Buffered call queue for events fired before the script loads
    window.plausible = window.plausible || function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
    loaded = true;
  }

  function maybeLoad() {
    var c = window.YK_CONSENT && window.YK_CONSENT.accepted;
    if (c === true) load();
  }

  // Respond to consent changes
  window.addEventListener("yalla:consent-changed", maybeLoad);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", maybeLoad);
  } else {
    maybeLoad();
  }

  // Tiny helper — fire a custom event (queues if not yet loaded or not consented)
  window.ykTrack = function (name, props) {
    try {
      if (typeof window.plausible === "function") {
        window.plausible(name, props ? { props: props } : undefined);
      }
    } catch (e) {}
  };
})();

/* ============================================================
   Yalla Kids — bilingual attribute swapper
   Any element with data-en-placeholder / data-ar-placeholder
   (or data-en-title, data-en-aria-label, data-en-alt, etc.)
   will have its placeholder/title/aria-label/alt attribute set
   to the AR variant when <html dir="rtl"> is active, and EN
   otherwise. Runs on DOMContentLoaded and on attribute change.
   ============================================================ */
(function () {
  var ATTRS = ["placeholder", "title", "aria-label", "alt"];

  function currentLang() {
    return document.documentElement.getAttribute("dir") === "rtl" ? "ar" : "en";
  }

  function applyOne(el) {
    var lang = currentLang();
    for (var i = 0; i < ATTRS.length; i++) {
      var attr = ATTRS[i];
      var key = attr === "aria-label" ? "ariaLabel" : attr; // dataset camelCase
      var enKey = "en" + key.charAt(0).toUpperCase() + key.slice(1);
      var arKey = "ar" + key.charAt(0).toUpperCase() + key.slice(1);
      var en = el.dataset[enKey];
      var ar = el.dataset[arKey];
      if (en == null && ar == null) continue;
      var pick = lang === "ar" ? (ar || en) : (en || ar);
      if (pick != null) el.setAttribute(attr, pick);
    }
  }

  function applyAll() {
    var sel =
      "[data-en-placeholder],[data-ar-placeholder]," +
      "[data-en-title],[data-ar-title]," +
      "[data-en-aria-label],[data-ar-aria-label]," +
      "[data-en-alt],[data-ar-alt]";
    document.querySelectorAll(sel).forEach(applyOne);
  }

  // Expose so toggleLang() or other code can call it explicitly
  window.ykApplyBilingualAttrs = applyAll;

  // Observe <html dir> and <html lang> changes
  var html = document.documentElement;
  var mo = new MutationObserver(function (muts) {
    for (var i = 0; i < muts.length; i++) {
      if (
        muts[i].type === "attributes" &&
        (muts[i].attributeName === "dir" || muts[i].attributeName === "lang")
      ) {
        applyAll();
        return;
      }
    }
  });
  mo.observe(html, { attributes: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyAll);
  } else {
    applyAll();
  }
})();
