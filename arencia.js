(function () {
  "use strict";

  var CONFIG = window.HADEELBEAUTY_CONFIG || {};
  var LINE = CONFIG.ARENCIA_LINE || {};
  var API_BASE = (CONFIG.API_BASE || "").replace(/\/$/, "");
  var GROUPS = LINE.groups || [];
  var LINE_IDS = [];
  GROUPS.forEach(function (g) {
    (g.productIds || []).forEach(function (id) { LINE_IDS.push(id); });
  });

  function $(sel) { return document.querySelector(sel); }

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function fmtPrice(n) { return Number(n || 0).toLocaleString("ar-DZ") + " دج"; }

  function productMeta(id) {
    return (CONFIG.PRODUCT_META || {})[id] || {};
  }

  function apiUrl(path) { return API_BASE + path; }

  var catalog = {};

  function shortLabel(p) {
    var name = p.name || "";
    if (p.id.indexOf("vitamin-c") !== -1) return "فيتامين سي";
    if (p.id.indexOf("txa") !== -1) return "TXA";
    if (p.id.indexOf("nad") !== -1) return "NAD+";
    if (p.id.indexOf("pdrn") !== -1) return "PDRN";
    if (p.id.indexOf("retinal") !== -1) return "ريتينال";
    if (p.id.indexOf("eraser") !== -1) return "تقشير";
    return name;
  }

  function renderCard(p) {
    var meta = productMeta(p.id);
    var img = meta.image || p.image || "";
    var cat = meta.category || "";
    return (
      '<article class="product-card" data-product-id="' + escapeHtml(p.id) + '">' +
        '<div class="product-thumb" style="background:' + (meta.gradient || "linear-gradient(135deg,#fbf3ee,#fff)") + '">' +
          (cat ? '<span class="product-category">' + escapeHtml(cat) + "</span>" : "") +
          (img ? '<img src="' + escapeHtml(img) + '" alt="' + escapeHtml(p.name) + '" loading="lazy" />' : "") +
        "</div>" +
        '<div class="product-info">' +
          '<p class="arencia-card-kicker">' + escapeHtml(shortLabel(p)) + "</p>" +
          "<h3>" + escapeHtml(p.name) + "</h3>" +
          '<p class="product-desc">' + escapeHtml(p.description || "") + "</p>" +
          '<div class="product-footer">' +
            '<span class="product-price">' + fmtPrice(p.price) + "</span>" +
            '<span class="product-cod">اطلبي هذا النوع</span>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function activeFilter() {
    var hash = (window.location.hash || "").replace("#", "");
    if (!hash || hash === "all") return "all";
    var exists = GROUPS.some(function (g) { return g.id === hash; });
    return exists ? hash : "all";
  }

  function renderFilters() {
    var wrap = $("#arenciaFilters");
    if (!wrap) return;
    var current = activeFilter();
    var html = '<button type="button" class="arencia-chip' + (current === "all" ? " is-active" : "") + '" data-filter="all">كل الأنواع</button>';
    GROUPS.forEach(function (g) {
      html += '<button type="button" class="arencia-chip' + (current === g.id ? " is-active" : "") + '" data-filter="' + escapeHtml(g.id) + '">' +
        escapeHtml(g.title) + "</button>";
    });
    wrap.innerHTML = html;
  }

  function renderGroups() {
    var root = $("#arenciaGroups");
    if (!root) return;
    var current = activeFilter();
    var html = "";
    GROUPS.forEach(function (g) {
      if (current !== "all" && g.id !== current) return;
      var cards = (g.productIds || []).map(function (id) {
        return catalog[id] ? renderCard(catalog[id]) : "";
      }).join("");
      if (!cards) return;
      html +=
        '<section class="arencia-group" id="group-' + escapeHtml(g.id) + '">' +
          '<header class="arencia-group-head">' +
            "<h2>" + escapeHtml(g.title) + "</h2>" +
            "<p>" + escapeHtml(g.blurb || "") + "</p>" +
          "</header>" +
          '<div class="product-grid arencia-group-grid">' + cards + "</div>" +
        "</section>";
    });
    root.innerHTML = html || '<p class="loading">لا توجد تركيبات في هذا النوع.</p>';
  }

  function setFilter(id) {
    if (id === "all") {
      history.replaceState(null, "", "arencia.html");
    } else {
      history.replaceState(null, "", "arencia.html#" + id);
    }
    renderFilters();
    renderGroups();
  }

  function hydrate(products) {
    catalog = {};
    products.forEach(function (p) {
      if (LINE_IDS.indexOf(p.id) !== -1) catalog[p.id] = p;
    });
    var fallbacks = window.HADEELBEAUTY_ARENCIA_FALLBACK || [];
    fallbacks.forEach(function (p) {
      if (!catalog[p.id]) catalog[p.id] = p;
    });
    renderFilters();
    renderGroups();
  }

  document.addEventListener("click", function (evt) {
    var chip = evt.target.closest("[data-filter]");
    if (chip) {
      evt.preventDefault();
      setFilter(chip.getAttribute("data-filter"));
      var section = $("#line-products");
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    var card = evt.target.closest("[data-product-id]");
    if (card) {
      window.location.href = "product.html?id=" + encodeURIComponent(card.getAttribute("data-product-id"));
    }
  });

  var FALLBACK = [
    { id: "arencia-nad-booster", name: "سيروم NAD+ لتجديد حيوية البشرة", description: "NAD+ 5% + ريسفيراترول وببتيدات — مرطب للوجه ومحيط العين. 30 مل.", price: 3900, image: "assets/products/arencia-nad-booster/hero-product.png?v=1" },
    { id: "arencia-eraser-glycolic", name: "بوستر حمض الجليكوليك لتنعيم البشرة", description: "حمض الجليكوليك + BHA — تقشير لطيف. 30 مل.", price: 3900, image: "assets/products/arencia-eraser-glycolic/hero-product.png?v=1" },
    { id: "arencia-txa-booster", name: "سيروم TXA لتوحيد لون البشرة", description: "TXA 5% + ببتيدات — يلطّف مظهر البقع الداكنة. 30 مل.", price: 3900, image: "assets/products/arencia-txa-booster/hero-product.png?v=1" },
    { id: "arencia-pdrn-booster", name: "سيروم PDRN لتهدئة وتجديد البشرة", description: "Rosy-PDRN 5% + ببتيدات — للبشرة الحساسة. 30 مل.", price: 3900, image: "assets/products/arencia-pdrn-booster/hero-product.png?v=1" },
    { id: "arencia-retinal-booster", name: "سيروم ريتينال ليلي لشد البشرة", description: "ريتينال 2% + كافيين — روتين ليلي. 30 مل.", price: 3900, image: "assets/products/arencia-retinal-booster/hero-product.png?v=1" },
    { id: "arencia-vitamin-c-booster", name: "سيروم فيتامين سي + جلوتاثيون للإشراق", description: "فيتامين سي 5% + جلوتاثيون — إشراق. 30 مل.", price: 3900, image: "assets/products/arencia-vitamin-c-booster/hero-product.png?v=1" },
  ];
  window.HADEELBEAUTY_ARENCIA_FALLBACK = FALLBACK;

  fetch(apiUrl("/api/products"))
    .then(function (res) { if (!res.ok) throw new Error("bad"); return res.json(); })
    .then(hydrate)
    .catch(function () { hydrate(FALLBACK); });
})();
