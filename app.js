/* HadeelBeauty storefront logic — Algérie
 * No frameworks — vanilla JS. Talks to the FastAPI backend for products
 * and orders, and mirrors key events to Meta pixel when configured.
 */

(function () {
  "use strict";

  var CONFIG = window.HADEELBEAUTY_CONFIG || {};
  var API_BASE = (CONFIG.API_BASE || "").replace(/\/$/, "");
  var TRACK = window.HadeelBeautyTracking || {};
  var CART_KEY = "hadeelbeauty_cart_v1";

  var FALLBACK_PRODUCTS = [
    {
      id: "scar-gel-tcm",
      name: "مرهم ازالة الندبات",
      description: "تركيبة TCM بسنتيلا آسياتيكا ونياسيناميد — لتلطيف مظهر الندبات وآثار حب الشباب وتوحيد لون البشرة. قوام شفاف سريع الامتصاص — 30 جرام.",
      price: 3500,
      image: "assets/products/scar-gel/hero-product.png?v=1",
    },
    {
      id: "arencia-nad-booster",
      name: "سيروم NAD+ لتجديد حيوية البشرة",
      description: "NAD+ 5% + ريسفيراترول وببتيدات — مرطب للوجه ومحيط العين يدعم مظهراً أكثر حيوية وثباتاً. 30 مل.",
      price: 3900,
      image: "assets/products/arencia-nad-booster/hero-product.png?v=1",
    },
    {
      id: "arencia-eraser-glycolic",
      name: "بوستر حمض الجليكوليك لتنعيم البشرة",
      description: "حمض الجليكوليك + BHA — تقشير لطيف لتنعيم الملمس وتخفيف مظهر الاحتقان. 30 مل.",
      price: 3900,
      image: "assets/products/arencia-eraser-glycolic/hero-product.png?v=1",
    },
    {
      id: "arencia-txa-booster",
      name: "سيروم TXA لتوحيد لون البشرة",
      description: "TXA 5% + ببتيدات — يساعد على تلطيف مظهر البقع الداكنة وتوحيد اللون تدريجياً. 30 مل.",
      price: 3900,
      image: "assets/products/arencia-txa-booster/hero-product.png?v=1",
    },
    {
      id: "arencia-pdrn-booster",
      name: "سيروم PDRN لتهدئة وتجديد البشرة",
      description: "Rosy-PDRN 5% + ببتيدات — تهدئة الاحمرار وترطيب لطيف، مناسب للبشرة الحساسة. 30 مل.",
      price: 3900,
      image: "assets/products/arencia-pdrn-booster/hero-product.png?v=1",
    },
    {
      id: "arencia-retinal-booster",
      name: "سيروم ريتينال ليلي لشد البشرة",
      description: "ريتينال (مركب فيتامين A 2%) + كافيين — روتين ليلي لمظهر أكثر ثباتاً ونعومة. 30 مل.",
      price: 3900,
      image: "assets/products/arencia-retinal-booster/hero-product.png?v=1",
    },
    {
      id: "arencia-vitamin-c-booster",
      name: "سيروم فيتامين سي + جلوتاثيون للإشراق",
      description: "فيتامين سي 5% + جلوتاثيون — لإشراق البشرة وتلطيف مظهر البهتان. 30 مل.",
      price: 3900,
      image: "assets/products/arencia-vitamin-c-booster/hero-product.png?v=1",
    },
    {
      id: "medicube-txa-niacinamide",
      name: "كريم كبسولات TXA + نياسيناميد",
      description: "TXA + نياسيناميد 5% — كريم كبسولات يلطّف مظهر البقع الداكنة وتفاوت اللون. 55 جم.",
      price: 3900,
      image: "assets/products/medicube-txa-niacinamide/hero-product.png?v=1",
    },
    {
      id: "medicube-vita-c",
      name: "كريم كبسولات فيتامين سي",
      description: "ماء فيتامين 50% + مشتقات فيتامين سي ونياسيناميد 5% — لإشراق البشرة. 55 جم.",
      price: 3900,
      image: "assets/products/medicube-vita-c/hero-product.png?v=1",
    },
    {
      id: "medicube-hyaluronic",
      name: "كريم كبسولات الهيالورونيك للترطيب",
      description: "هيالورونات الصوديوم + بانتينول — ترطيب لطيف. 55 جم.",
      price: 3900,
      image: "assets/products/medicube-hyaluronic/hero-product.png?v=1",
    },
    {
      id: "medicube-kojic-turmeric",
      name: "كريم كبسولات كوجيك وكركم",
      description: "حمض الكوجيك + كركم + نياسيناميد 5% — لتلطيف مظهر البهتان. 53 جم.",
      price: 3900,
      image: "assets/products/medicube-kojic-turmeric/hero-product.png?v=1",
    },
    {
      id: "medicube-pdrn-collagen",
      name: "كريم كبسولات PDRN والكولاجين الوردي",
      description: "PDRN + نياسيناميد 5% — يدعم مظهراً أكثر تماسكًا ونعومة. 55 جم.",
      price: 3900,
      image: "assets/products/medicube-pdrn-collagen/hero-product.png?v=1",
    },
    {
      id: "anua-pdrn-hyaluron",
      name: "كريم Anua PDRN والهيالورونيك",
      description: "PDRN + هيالورونيك — ترطيب يومي خفيف. 60 مل.",
      price: 3900,
      image: "assets/products/anua-pdrn-hyaluron/hero-product.png?v=1",
    },
    {
      id: "anua-niacinamide-txa",
      name: "سيروم Anua نياسيناميد 10% + TXA 4%",
      description: "نياسيناميد 10% + TXA 4% — يلطّف مظهر البقع. 30 مل.",
      price: 3900,
      image: "assets/products/anua-niacinamide-txa/hero-product.png?v=1",
    },
    {
      id: "althea-345-mist",
      name: "رذاذ Dr. Althea 345 الكريمي",
      description: "ماء نخالة الأرز + بانتينول — ترطيب خفيف. 60 مل.",
      price: 3900,
      image: "assets/products/althea-345-mist/hero-product.png?v=1",
    },
    {
      id: "althea-345-cream",
      name: "كريم Dr. Althea 345 للتهدئة",
      description: "نياسيناميد + بانتينول + سنتيلا — خالٍ من العطر. 50 مل.",
      price: 3900,
      image: "assets/products/althea-345-cream/hero-product.png?v=1",
    },
    {
      id: "joseon-relief-sun",
      name: "واقي شمس Joseon بالأرز والبروبيوتيك",
      description: "SPF50+ PA++++ — مرطّب للبشرة العادية والجافة. 50 مل.",
      price: 3900,
      image: "assets/products/joseon-relief-sun/hero-product.png?v=1",
    },
    {
      id: "joseon-aqua-fresh",
      name: "واقي شمس Joseon Aqua-fresh",
      description: "SPF50+ PA++++ — خفيف للبشرة المختلطة والدهنية. 50 مل.",
      price: 3900,
      image: "assets/products/joseon-aqua-fresh/hero-product.png?v=1",
    },
    {
      id: "joseon-revive-eye",
      name: "سيروم Joseon لمحيط العين",
      description: "جينسنغ + ريتينال — روتين ليلي. 30 مل.",
      price: 3900,
      image: "assets/products/joseon-revive-eye/hero-product.png?v=1",
    },
    {
      id: "niacinamide-txa-serum",
      name: "سيروم TXA + نياسيناميد 15% لتفتيح البقع",
      description: "سيروم مركز — TXA + نياسيناميد 15% — 30 مل.",
      price: 3790,
      image: "assets/products/niacinamide-serum/hero-product.png?v=1",
    },
    {
      id: "spf50-centella-sunscreen",
      name: "واقي شمس SPF 50+ بسنتيلا آسياتيكا",
      description: "حماية يومية SPF 50+ — 50 مل.",
      price: 3790,
      image: "assets/products/spf50-sunscreen/hero-product.png?v=1",
    },
    {
      id: "ceramide-barrier-cream",
      name: "كريم حاجز البشرة — سيراميد + هيالورون",
      description: "ترطيب وتقوية حاجز البشرة — 50 جم.",
      price: 3790,
      image: "assets/products/ceramide-cream/hero-product.png?v=1",
    },
    {
      id: "arbutin-txa-cream",
      name: "كريم يومي أربوتين 7% + TXA 4% — توحيد اللون",
      description: "ترطيب يومي + تفتيح البقع — 50 مل.",
      price: 3790,
      image: "assets/products/arbutin-cream/hero-product.png?v=1",
    },
    {
      id: "hair-regrowth-spray",
      name: "بخاخ دعم نمو الشعر — تركيبة عشبية",
      description: "رذاذ لفروة الرأس — تقوية وتقليل التساقط — 50 مل.",
      price: 3990,
      image: "assets/products/hair-spray/hero-product.png?v=1",
    },
  ];

  var FALLBACK_REGIONS = [
    { id: "alger", name: "الجزائر العاصمة", shippingCost: 0 },
    { id: "oran", name: "وهران", shippingCost: 0 },
    { id: "constantine", name: "قسنطينة", shippingCost: 0 },
    { id: "annaba", name: "عنابة", shippingCost: 0 },
    { id: "setif", name: "سطيف", shippingCost: 0 },
    { id: "bejaia", name: "بجاية", shippingCost: 0 },
    { id: "tlemcen", name: "تلمسان", shippingCost: 0 },
    { id: "batna", name: "باتنة", shippingCost: 0 },
    { id: "blida", name: "البليدة", shippingCost: 0 },
    { id: "tizi_ouzou", name: "تيزي وزو", shippingCost: 0 },
    { id: "biskra", name: "بسكرة", shippingCost: 0 },
    { id: "mostaganem", name: "مستغانم", shippingCost: 0 },
    { id: "skikda", name: "سكيكدة", shippingCost: 0 },
    { id: "tiaret", name: "تيارت", shippingCost: 0 },
    { id: "medea", name: "المدية", shippingCost: 0 },
    { id: "msila", name: "المسيلة", shippingCost: 0 },
    { id: "guelma", name: "قالمة", shippingCost: 0 },
    { id: "jijel", name: "جيجل", shippingCost: 0 },
    { id: "chlef", name: "الشلف", shippingCost: 0 },
    { id: "ouargla", name: "ورقلة", shippingCost: 0 },
    { id: "bou_arreridj", name: "برج بوعريريج", shippingCost: 0 },
    { id: "souk_ahras", name: "سوق أهراس", shippingCost: 0 },
    { id: "boumerdes", name: "بومرداس", shippingCost: 0 },
    { id: "tipaza", name: "تيبازة", shippingCost: 0 },
    { id: "ain_defla", name: "عين الدفلى", shippingCost: 0 },
    { id: "relizane", name: "غليزان", shippingCost: 0 },
    { id: "mascara", name: "معسكر", shippingCost: 0 },
    { id: "djelfa", name: "الجلفة", shippingCost: 0 },
    { id: "laghouat", name: "الأغواط", shippingCost: 0 },
    { id: "ghardaia", name: "غرداية", shippingCost: 0 },
  ];

  var state = {
    products: {},
    regions: {},
    cart: loadCart(),
    activeProductId: null,
  };

  function $(selector, root) { return (root || document).querySelector(selector); }
  function $all(selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); }

  function newEventId() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return "ev-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  }

  function loadCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(state.cart)); } catch (e) {}
  }

  function apiUrl(path) { return API_BASE + path; }

  function track(eventName, browserProps, capiPayload) {
    if (TRACK.track) return TRACK.track(eventName, browserProps, capiPayload);
    return TRACK.newEventId ? TRACK.newEventId() : newEventId();
  }

  function trackBrowserOnly(eventName, browserProps, eventId) {
    if (TRACK.trackBrowserOnly) TRACK.trackBrowserOnly(eventName, browserProps, eventId);
  }

  function fmtPrice(price) { return price.toLocaleString("ar-DZ") + " دج"; }

  function isValidDzPhone(raw) {
    var digits = String(raw || "").replace(/\D/g, "");
    if (digits.indexOf("213") === 0) {
      var rest = digits.slice(3);
      if (rest.charAt(0) === "0") rest = rest.slice(1);
      return rest.length === 9 && /^[567]\d{8}$/.test(rest);
    }
    return /^0[567]\d{8}$/.test(digits);
  }

  var PHONE_ERROR = "رقم الهاتف يجب أن يبدأ بـ 05 أو 06 أو 07 (10 أرقام) أو +213";

  function productMeta(productId) {
    var meta = (CONFIG.PRODUCT_META || {})[productId] || {};
    return {
      emoji: meta.emoji || "✨",
      category: meta.category || "تجميل",
      gradient: meta.gradient || "linear-gradient(135deg, #fce4ec, #e8a0ac)",
      image: meta.image || "",
    };
  }

  function renderProductThumb(p) {
    var meta = productMeta(p.id);
    var img = meta.image || p.image;
    if (img) {
      return '<img src="' + escapeAttr(img) + '" alt="' + escapeAttr(p.name) + '" loading="lazy" />';
    }
    return (
      '<div class="product-thumb-placeholder" style="background:' + meta.gradient + '">' +
        '<span aria-hidden="true">' + meta.emoji + '</span>' +
      '</div>'
    );
  }

  function renderProductCategory(p) {
    var cat = productMeta(p.id).category;
    return '<span class="product-category">' + escapeHtml(cat) + '</span>';
  }

  function loadProducts() {
    fetch(apiUrl("/api/products"))
      .then(function (res) { if (!res.ok) throw new Error("bad status"); return res.json(); })
      .then(function (products) {
        state.products = {};
        products.forEach(function (p) {
          var fb = FALLBACK_PRODUCTS.filter(function (x) { return x.id === p.id; })[0];
          if (fb && fb.name) p.name = fb.name;
          state.products[p.id] = p;
        });
        renderProductGrid(products);
      })
      .catch(function () {
        state.products = {};
        FALLBACK_PRODUCTS.forEach(function (p) { state.products[p.id] = p; });
        renderProductGrid(FALLBACK_PRODUCTS);
      });
  }

  function isLineProduct(id) {
    var s = String(id || "");
    return s.indexOf("arencia-") === 0 || s.indexOf("medicube-") === 0 ||
      s.indexOf("anua-") === 0 || s.indexOf("althea-") === 0 || s.indexOf("joseon-") === 0;
  }

  function brandLines() {
    return [CONFIG.ARENCIA_LINE, CONFIG.MEDICUBE_LINE, CONFIG.ANUA_LINE, CONFIG.ALTHEA_LINE, CONFIG.JOSEON_LINE].filter(function (line) {
      return line && line.groups;
    });
  }

  function brandLineCard(line) {
    var n = (line.mosaic || []).length;
    var mosaicClass = n <= 2 ? " brand-mosaic--2" : (n === 3 ? " brand-mosaic--3" : "");
    var mosaic = (line.mosaic || []).map(function (src) {
      return '<img src="' + escapeAttr(src) + '" alt="" />';
    }).join("");
    return (
      '<article class="product-card product-card--brand" data-action="open-brand" data-href="' + escapeAttr(line.href) + '">' +
        '<div class="product-thumb product-thumb--mosaic">' +
          '<span class="product-category">' + escapeHtml(line.badge || "علامة واحدة") + "</span>" +
          '<div class="brand-mosaic' + mosaicClass + '">' + mosaic + "</div>" +
        "</div>" +
        '<div class="product-info">' +
          "<h3>" + escapeHtml(line.name || "") + "</h3>" +
          '<p class="product-desc">' + escapeHtml(line.lead || "") + "</p>" +
          '<div class="product-footer">' +
            '<span class="product-price">من ' + fmtPrice(line.priceFrom || 3900) + "</span>" +
            '<span class="product-cod">اختاري النوع</span>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function renderProductGrid(products) {
    var grid = $("#productGrid");
    if (!products.length) {
      grid.innerHTML = '<p class="loading">لا توجد منتجات حالياً.</p>';
      return;
    }
    var others = products.filter(function (p) { return !isLineProduct(p.id); });
    var cards = others.map(function (p) {
      var meta = productMeta(p.id);
      return (
        '<article class="product-card" data-product-id="' + escapeAttr(p.id) + '" data-action="open-product">' +
          '<div class="product-thumb" style="background:' + meta.gradient + '">' +
            renderProductCategory(p) +
            renderProductThumb(p) +
          '</div>' +
          '<div class="product-info">' +
            "<h3>" + escapeHtml(p.name) + "</h3>" +
            '<p class="product-desc">' + escapeHtml(p.description || "") + "</p>" +
            '<div class="product-footer">' +
              '<span class="product-price">' + fmtPrice(p.price) + "</span>" +
              '<span class="product-cod">COD</span>' +
            '</div>' +
          "</div>" +
        "</article>"
      );
    });
    var lines = brandLines();
    if (lines.length) {
      var insertAt = cards.length ? 1 : 0;
      var brandCards = lines.map(brandLineCard);
      cards.splice.apply(cards, [Math.min(insertAt, cards.length), 0].concat(brandCards));
    }
    grid.innerHTML = cards.join("");
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function escapeAttr(str) { return escapeHtml(str); }

  function loadRegions() {
    fetch(apiUrl("/api/regions"))
      .then(function (res) { if (!res.ok) throw new Error("bad status"); return res.json(); })
      .then(function (regions) {
        state.regions = {};
        regions.forEach(function (r) { state.regions[r.id] = r; });
        var select = $("#regionSelect");
        if (!select) return;
        var placeholder = select.querySelector('option[value=""]');
        select.innerHTML = "";
        if (placeholder) select.appendChild(placeholder);
        regions.forEach(function (r) {
          var opt = document.createElement("option");
          opt.value = r.id;
          opt.textContent = r.name;
          select.appendChild(opt);
        });
      })
      .catch(function () {
        state.regions = {};
        FALLBACK_REGIONS.forEach(function (r) { state.regions[r.id] = r; });
        var select = $("#regionSelect");
        if (!select) return;
        var placeholder = select.querySelector('option[value=""]');
        select.innerHTML = "";
        if (placeholder) select.appendChild(placeholder);
        FALLBACK_REGIONS.forEach(function (r) {
          var opt = document.createElement("option");
          opt.value = r.id;
          opt.textContent = r.name;
          select.appendChild(opt);
        });
      });
  }

  function selectedRegion() {
    var select = $("#regionSelect");
    return select ? state.regions[select.value] : null;
  }

  function updateCheckoutSummary() {
    var subtotal = cartTotal();
    var region = selectedRegion();
    $("#summarySubtotal").textContent = fmtPrice(subtotal);
    $("#summaryShipping").textContent = region ? "مجاني" : "—";
    $("#summaryTotal").textContent = fmtPrice(subtotal);
  }

  function openProduct(productId) {
    var p = state.products[productId];
    if (!p) return;
    state.activeProductId = productId;

    var meta = productMeta(p.id);
    var thumb = renderProductThumb(p);

    $("#productModalBody").innerHTML = (
      '<div class="product-modal-thumb" style="background:' + meta.gradient + '">' + thumb + "</div>" +
      '<p class="muted" style="margin:0 0 8px;font-weight:800">' + escapeHtml(productMeta(p.id).category) + '</p>' +
      "<h2>" + escapeHtml(p.name) + "</h2>" +
      '<p class="muted">' + escapeHtml(p.description || "") + "</p>" +
      '<div class="product-price">' + fmtPrice(p.price) + "</div>" +
      '<div class="qty-row">' +
        '<button type="button" data-action="qty-dec">−</button>' +
        '<span id="modalQty">1</span>' +
        '<button type="button" data-action="qty-inc">+</button>' +
      "</div>" +
      '<button class="btn btn-primary btn-block" data-action="add-to-cart">أضيفيه للسلة</button>'
    );

    $("#productOverlay").hidden = false;

    track("ViewContent", {
      content_id: p.id,
      content_name: p.name,
      currency: "DZD",
      value: p.price,
    }, {
      productIds: [p.id],
      value: p.price,
      currency: "DZD",
    });
  }

  function closeProduct() {
    $("#productOverlay").hidden = true;
    state.activeProductId = null;
  }

  function currentModalQty() {
    return parseInt($("#modalQty").textContent, 10) || 1;
  }

  function addActiveProductToCart() {
    var productId = state.activeProductId;
    var qty = currentModalQty();
    if (!productId) return;

    var existing = state.cart.find(function (i) { return i.productId === productId; });
    if (existing) {
      existing.quantity = Math.min(10, existing.quantity + qty);
    } else {
      state.cart.push({ productId: productId, quantity: qty });
    }
    saveCart();
    updateCartCount();
    closeProduct();

    var p = state.products[productId];
    if (p) {
      track("AddToCart", {
        content_id: p.id,
        content_name: p.name,
        currency: "DZD",
        value: p.price * qty,
      }, {
        productIds: [p.id],
        value: p.price * qty,
        currency: "DZD",
      });
    }
    openCart();
  }

  function cartTotal() {
    return state.cart.reduce(function (sum, item) {
      var p = state.products[item.productId];
      return sum + (p ? p.price * item.quantity : 0);
    }, 0);
  }

  function cartCount() {
    return state.cart.reduce(function (sum, item) { return sum + item.quantity; }, 0);
  }

  function updateCartCount() {
    $("#cartCount").textContent = cartCount();
  }

  function renderCart() {
    var container = $("#cartItems");
    if (!state.cart.length) {
      container.innerHTML = '<p class="cart-empty">السلة فارغة</p>';
      $("#checkoutBtn").disabled = true;
    } else {
      container.innerHTML = state.cart.map(function (item) {
        var p = state.products[item.productId];
        if (!p) return "";
        return (
          '<div class="cart-item">' +
            "<div>" +
              '<div class="cart-item-name">' + escapeHtml(p.name) + "</div>" +
              '<div class="cart-item-meta">' + item.quantity + " × " + fmtPrice(p.price) + "</div>" +
            "</div>" +
            '<button class="cart-item-remove" data-action="remove-item" data-product-id="' + escapeAttr(item.productId) + '">حذف</button>' +
          "</div>"
        );
      }).join("");
      $("#checkoutBtn").disabled = false;
    }
    $("#cartTotal").textContent = fmtPrice(cartTotal());
    updateCartCount();
  }

  function removeFromCart(productId) {
    state.cart = state.cart.filter(function (i) { return i.productId !== productId; });
    saveCart();
    renderCart();
  }

  function openCart() {
    renderCart();
    $("#cartOverlay").hidden = false;
  }

  function closeCart() { $("#cartOverlay").hidden = true; }

  function openCheckout() {
    if (!state.cart.length) return;
    closeCart();
    $("#checkoutError").hidden = true;
    $("#checkoutOverlay").hidden = false;
    updateCheckoutSummary();

    var items = state.cart.map(function (i) { return i.productId; });
    track("InitiateCheckout", {
      currency: "DZD",
      value: cartTotal(),
      content_ids: items,
    }, {
      productIds: items,
      value: cartTotal(),
      currency: "DZD",
    });
  }

  function closeCheckout() { $("#checkoutOverlay").hidden = true; }

  function submitCheckout(evt) {
    evt.preventDefault();
    var form = evt.target;
    var submitBtn = $("#submitOrderBtn");
    var errorEl = $("#checkoutError");
    errorEl.hidden = true;

    if (!state.cart.length) return;

    var payload = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      regionId: form.regionId.value,
      city: form.city.value.trim(),
      address: form.address.value.trim(),
      items: state.cart.map(function (i) { return { productId: i.productId, quantity: i.quantity }; }),
    };

    if (!payload.regionId) {
      errorEl.textContent = "الرجاء اختيار الولاية";
      errorEl.hidden = false;
      return;
    }

    if (!isValidDzPhone(payload.phone)) {
      errorEl.textContent = PHONE_ERROR;
      errorEl.hidden = false;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "جاري إرسال الطلب...";

    fetch(apiUrl("/api/orders/prepare"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        if (!res.ok) return res.json().then(function (e) { throw new Error(e.detail || "ما تقدرناش نرسل الطلب"); });
        return res.json();
      })
      .then(function (prepared) {
        var completeEventId = newEventId();
        var meta = (TRACK.metaCookies && TRACK.metaCookies()) || { fbp: "", fbc: "" };
        return fetch(apiUrl("/api/orders/complete"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: prepared.orderId,
            eventId: completeEventId,
            fbp: meta.fbp,
            fbc: meta.fbc,
            eventSourceUrl: window.location.href,
          }),
        })
          .then(function (res) {
            if (!res.ok) throw new Error("ما تقدرناش نأكد الطلب");
            return res.json();
          })
          .then(function () {
            // Purchase fires on thank-you page (avoids lost events on redirect)
            return prepared;
          });
      })
      .then(function (prepared) {
        var items = state.cart.map(function (i) {
          var p = state.products[i.productId];
          return {
            id: i.productId,
            productId: i.productId,
            name: p ? p.name : i.productId,
            quantity: i.quantity,
            price: p ? p.price : 0,
          };
        });
        form.reset();
        state.cart = [];
        saveCart();
        updateCartCount();
        closeCheckout();
        goToThankYou(prepared, {
          name: payload.name,
          regionName: prepared.regionName,
          items: items,
        });
      })
      .catch(function (err) {
        errorEl.textContent = err.message || "راكم فيه مشكلة، جرب مرة أخرى.";
        errorEl.hidden = false;
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "تأكيد الطلب";
      });
  }

  function goToThankYou(prepared, details) {
    try {
      sessionStorage.setItem("hadeelbeauty:lastOrder", JSON.stringify({
        orderId: prepared.orderId,
        total: prepared.total,
        subtotal: prepared.subtotal,
        shipping: prepared.shipping || 0,
        regionName: prepared.regionName || details.regionName || "",
        name: details.name || "",
        items: details.items || [],
      }));
    } catch (e) {}
    window.location.href = "thank-you.html?order=" + encodeURIComponent(prepared.orderId);
  }

  document.addEventListener("click", function (evt) {
    var target = evt.target.closest("[data-action]");
    if (!target) return;
    var action = target.getAttribute("data-action");

    switch (action) {
      case "open-product":
        window.location.href = "product.html?id=" + encodeURIComponent(target.getAttribute("data-product-id"));
        break;
      case "open-brand":
        window.location.href = target.getAttribute("data-href") || "arencia.html";
        break;
      case "close-product":
        closeProduct();
        break;
      case "qty-inc": {
        var incEl = $("#modalQty");
        incEl.textContent = Math.min(10, currentModalQty() + 1);
        break;
      }
      case "qty-dec": {
        var decEl = $("#modalQty");
        decEl.textContent = Math.max(1, currentModalQty() - 1);
        break;
      }
      case "add-to-cart":
        addActiveProductToCart();
        break;
      case "open-cart":
        openCart();
        break;
      case "close-cart":
        closeCart();
        break;
      case "remove-item":
        removeFromCart(target.getAttribute("data-product-id"));
        break;
      case "go-checkout":
        openCheckout();
        break;
      case "close-checkout":
        closeCheckout();
        break;
      case "go-shop":
        evt.preventDefault();
        closeCart();
        closeProduct();
        closeCheckout();
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
    }
  });

  $("#checkoutForm").addEventListener("submit", submitCheckout);
  $("#regionSelect").addEventListener("change", updateCheckoutSummary);

  document.addEventListener("keydown", function (evt) {
    if (evt.key === "Escape") {
      closeProduct();
      closeCart();
      closeCheckout();
    }
  });

  loadProducts();
  loadRegions();
  updateCartCount();

  if (sessionStorage.getItem("hadeelbeauty:openCart")) {
    sessionStorage.removeItem("hadeelbeauty:openCart");
    setTimeout(openCart, 300);
  }

  if (!API_BASE) {
    console.warn("HADEELBEAUTY_CONFIG.API_BASE is empty — set it in config.js once the backend is deployed.");
  }
})();
