(function () {
  "use strict";

  var CONFIG = window.HADEELBEAUTY_CONFIG || {};
  var API_BASE = (CONFIG.API_BASE || "").replace(/\/$/, "");
  var TRACK = window.HadeelBeautyTracking || {};
  var PRODUCT_ID = new URLSearchParams(window.location.search).get("id") || "scar-gel-tcm";

  var FALLBACK_PRODUCTS = {
    "scar-gel-tcm": {
      id: "scar-gel-tcm",
      name: "مرهم ازالة الندبات",
      description: "تركيبة TCM بسنتيلا آسياتيكا ونياسيناميد — لتلطيف مظهر الندبات وآثار حب الشباب وتوحيد لون البشرة. قوام شفاف سريع الامتصاص — 30 جرام.",
      price: 3500,
      image: "assets/products/scar-gel/hero-product.png?v=1",
    },
    "arencia-nad-booster": {
      id: "arencia-nad-booster",
      name: "سيروم NAD+ لتجديد حيوية البشرة",
      description: "NAD+ 5% + ريسفيراترول وببتيدات — مرطب للوجه ومحيط العين يدعم مظهراً أكثر حيوية وثباتاً. 30 مل.",
      price: 3900,
      image: "assets/products/arencia-nad-booster/hero-product.png?v=1",
    },
    "arencia-eraser-glycolic": {
      id: "arencia-eraser-glycolic",
      name: "بوستر حمض الجليكوليك لتنعيم البشرة",
      description: "حمض الجليكوليك + BHA — تقشير لطيف لتنعيم الملمس وتخفيف مظهر الاحتقان. 30 مل.",
      price: 3900,
      image: "assets/products/arencia-eraser-glycolic/hero-product.png?v=1",
    },
    "arencia-txa-booster": {
      id: "arencia-txa-booster",
      name: "سيروم TXA لتوحيد لون البشرة",
      description: "TXA 5% + ببتيدات — يساعد على تلطيف مظهر البقع الداكنة وتوحيد اللون تدريجياً. 30 مل.",
      price: 3900,
      image: "assets/products/arencia-txa-booster/hero-product.png?v=1",
    },
    "arencia-pdrn-booster": {
      id: "arencia-pdrn-booster",
      name: "سيروم PDRN لتهدئة وتجديد البشرة",
      description: "Rosy-PDRN 5% + ببتيدات — تهدئة الاحمرار وترطيب لطيف، مناسب للبشرة الحساسة. 30 مل.",
      price: 3900,
      image: "assets/products/arencia-pdrn-booster/hero-product.png?v=1",
    },
    "arencia-retinal-booster": {
      id: "arencia-retinal-booster",
      name: "سيروم ريتينال ليلي لشد البشرة",
      description: "ريتينال (مركب فيتامين A 2%) + كافيين — روتين ليلي لمظهر أكثر ثباتاً ونعومة. 30 مل.",
      price: 3900,
      image: "assets/products/arencia-retinal-booster/hero-product.png?v=1",
    },
    "arencia-vitamin-c-booster": {
      id: "arencia-vitamin-c-booster",
      name: "سيروم فيتامين سي + جلوتاثيون للإشراق",
      description: "فيتامين سي 5% + جلوتاثيون — لإشراق البشرة وتلطيف مظهر البهتان. 30 مل.",
      price: 3900,
      image: "assets/products/arencia-vitamin-c-booster/hero-product.png?v=1",
    },
    "niacinamide-txa-serum": {
      id: "niacinamide-txa-serum",
      name: "سيروم TXA + نياسيناميد 15% لتفتيح البقع",
      description: "سيروم مركز — TXA + نياسيناميد 15% + أربوتين — 30 مل.",
      price: 3790,
      image: "assets/products/niacinamide-serum/hero-product.png?v=1",
    },
    "spf50-centella-sunscreen": {
      id: "spf50-centella-sunscreen",
      name: "واقي شمس SPF 50+ بسنتيلا آسياتيكا",
      description: "حماية يومية SPF 50+ — 50 مل.",
      price: 3790,
      image: "assets/products/spf50-sunscreen/hero-product.png?v=1",
    },
    "ceramide-barrier-cream": {
      id: "ceramide-barrier-cream",
      name: "كريم حاجز البشرة — سيراميد + هيالورون",
      description: "ترطيب وتقوية حاجز البشرة — 50 جم.",
      price: 3790,
      image: "assets/products/ceramide-cream/hero-product.png?v=1",
    },
    "arbutin-txa-cream": {
      id: "arbutin-txa-cream",
      name: "كريم يومي أربوتين 7% + TXA 4%",
      description: "ترطيب + توحيد اللون — 50 مل.",
      price: 3790,
      image: "assets/products/arbutin-cream/hero-product.png?v=1",
    },
    "hair-regrowth-spray": {
      id: "hair-regrowth-spray",
      name: "بخاخ دعم نمو الشعر",
      description: "تركيبة عشبية لفروة الرأس — 50 مل.",
      price: 3990,
      image: "assets/products/hair-spray/hero-product.png?v=1",
    },
  };

  function getProfile(productId) {
    var profiles = CONFIG.PRODUCT_PROFILES || {};
    return profiles[productId] || profiles["scar-gel-tcm"] || {};
  }

  function getProductMeta(productId) {
    var meta = (CONFIG.PRODUCT_META || {})[productId] || {};
    return {
      gradient: meta.gradient || "linear-gradient(135deg, #fce4ec, #e8a0ac)",
    };
  }

  function getHeroImage(p) {
    var meta = (CONFIG.PRODUCT_META || {})[p.id];
    return (meta && meta.image) || p.image || "assets/products/placeholder.svg";
  }

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

  var INFOGRAPHICS = [
    { src: "assets/products/scar-gel/v01-hero.png", alt: "تعزيز تجديد البشرة وتحسين مظهر الندبات" },
    { src: "assets/products/scar-gel/v05-problems.png", alt: "هل تعانين من هذه المشاكل؟" },
    { src: "assets/products/scar-gel/v02-scar-types.png", alt: "أنواع الندبات التي يستهدفها المنتج" },
    { src: "assets/products/scar-gel/v03-benefits.png", alt: "يوازن لون البشرة وينعّم الملمس" },
    { src: "assets/products/scar-gel/v09-promo.png", alt: "حماية وترميم وإزالة تصبغات" },
    { src: "assets/products/scar-gel/v06-features.png", alt: "مزايا جل إزالة الندبات" },
    { src: "assets/products/scar-gel/v08-ingredients.png", alt: "تركيبة لطيفة — نياسيناميد وأربوتين وهيالورونات" },
    { src: "assets/products/scar-gel/v04-texture.png", alt: "قوام شفاف غير دهني — امتصاص سريع" },
    { src: "assets/products/scar-gel/v07-specs.png", alt: "مواصفات المنتج — 30 جرام" },
  ];

  var state = {
    product: null,
    regions: {},
    qty: 1,
  };

  function $(sel) { return document.querySelector(sel); }

  function fmtPrice(n) { return n.toLocaleString("ar-DZ") + " دج"; }

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

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function apiUrl(path) { return API_BASE + path; }

  function newEventId() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return "ev-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  }

  function selectedRegion() {
    var select = $("#pdRegionSelect");
    return select ? state.regions[select.value] : null;
  }

  function updateOrderSummary() {
    var p = state.product;
    if (!p) return;
    var subtotal = p.price * state.qty;
    var subtotalEl = $("#pdSummarySubtotal");
    var totalEl = $("#pdOrderTotal");
    if (subtotalEl) subtotalEl.textContent = fmtPrice(subtotal);
    if (totalEl) totalEl.textContent = fmtPrice(subtotal);
    var submitBtn = $("#pdOrderSubmit");
    if (submitBtn) {
      submitBtn.innerHTML = 'اطلبي الآن — <span>' + fmtPrice(subtotal) + "</span>";
    }
  }

  function fillRegions(regions) {
    state.regions = {};
    regions.forEach(function (r) { state.regions[r.id] = r; });
    var select = $("#pdRegionSelect");
    if (!select) return;
    select.innerHTML = '<option value="" disabled selected>اختاري ولايتك</option>';
    regions.forEach(function (r) {
      var opt = document.createElement("option");
      opt.value = r.id;
      opt.textContent = r.name;
      select.appendChild(opt);
    });
    updateOrderSummary();
  }

  function loadRegions() {
    fetch(apiUrl("/api/regions"))
      .then(function (res) { if (!res.ok) throw new Error("bad status"); return res.json(); })
      .then(fillRegions)
      .catch(function () { fillRegions(FALLBACK_REGIONS); });
  }

  function scrollToOrder() {
    var box = $("#pdOrder");
    if (box) box.scrollIntoView({ behavior: "smooth", block: "start" });
    var nameInput = $("#pdOrderForm input[name=name]");
    if (nameInput) setTimeout(function () { nameInput.focus(); }, 400);
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

  function trackViewContent(p) {
    if (!TRACK.track) return;
    TRACK.track("ViewContent", {
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

  function submitOrder(evt) {
    evt.preventDefault();
    var form = evt.target;
    var errorEl = $("#pdOrderError");
    var submitBtn = $("#pdOrderSubmit");
    var p = state.product;
    if (!p) return;

    errorEl.hidden = true;

    var regionId = form.regionId.value;
    var region = state.regions[regionId];
    if (!regionId || !region) {
      errorEl.textContent = "الرجاء اختيار الولاية";
      errorEl.hidden = false;
      return;
    }

    if (!isValidDzPhone(form.phone.value.trim())) {
      errorEl.textContent = PHONE_ERROR;
      errorEl.hidden = false;
      return;
    }

    var payload = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      regionId: regionId,
      city: region.name,
      address: form.address.value.trim(),
      items: [{ productId: p.id, quantity: state.qty }],
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "جاري إرسال الطلب...";

    if (TRACK.track) {
      TRACK.track("InitiateCheckout", {
        content_id: p.id,
        content_name: p.name,
        currency: "DZD",
        value: p.price * state.qty,
        content_ids: [p.id],
      }, {
        productIds: [p.id],
        value: p.price * state.qty,
        currency: "DZD",
      });
    }

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
            return prepared;
          });
      })
      .then(function (prepared) {
        var p = state.product;
        goToThankYou(prepared, {
          name: form.name.value.trim(),
          regionName: region.name,
          items: [{
            id: p ? p.id : "",
            productId: p ? p.id : "",
            name: p ? p.name : "منتج",
            quantity: state.qty,
            price: p ? p.price : 0,
          }],
        });
      })
      .catch(function (err) {
        errorEl.textContent = err.message || "راكم فيه مشكلة، جرب مرة أخرى.";
        errorEl.hidden = false;
      })
      .finally(function () {
        submitBtn.disabled = false;
        updateOrderSummary();
      });
  }

  function renderProduct(p) {
    state.product = p;
    var page = $("#productPage");
    var profile = getProfile(p.id);
    var heroImg = getHeroImage(p);
    var heroGradient = getProductMeta(p.id).gradient;

    var highlightsSection = profile.highlights && profile.highlights.length
      ? ('<section class="pd-highlights"><div class="container"><h2 class="section-title">لماذا هذا المنتج؟</h2><div class="pd-highlight-grid">' +
          profile.highlights.map(function (h) {
            return '<div class="pd-highlight"><span>' + h.icon + '</span><strong>' + escapeHtml(h.title) +
              '</strong><p>' + escapeHtml(h.text) + '</p></div>';
          }).join("") + '</div></div></section>')
      : "";

    var gallery = profile.gallery
      ? INFOGRAPHICS.map(function (img, i) {
          return (
            '<figure class="pd-info-card">' +
              '<img src="' + img.src + '" alt="' + escapeHtml(img.alt) + '" loading="' + (i < 2 ? "eager" : "lazy") + '" />' +
            '</figure>'
          );
        }).join("")
      : "";

    var gallerySection = profile.gallery && gallery
      ? ('<section class="pd-gallery">' +
          '<div class="container">' +
            '<div class="section-head">' +
              '<span class="section-badge">📋 تفاصيل المنتج</span>' +
              '<h2 class="section-title">كل ما تحتاجين معرفته</h2>' +
            '</div>' +
            '<div class="pd-info-grid">' + gallery + '</div>' +
          '</div>' +
        '</section>')
      : "";

    var specsList = (profile.specs || []).map(function (row) {
      return '<li><strong>' + escapeHtml(row[0]) + ':</strong> ' + escapeHtml(row[1]) + '</li>';
    }).join("");

    var specsSection = specsList
      ? ('<section class="pd-specs-text">' +
          '<div class="container">' +
            '<div class="pd-specs-card">' +
              '<h3>مواصفات سريعة</h3>' +
              '<ul>' + specsList + '</ul>' +
            '</div>' +
          '</div>' +
        '</section>')
      : "";

    var pills = (profile.pills || ["💵 الدفع عند الاستلام", "🚚 توصيل مجاني"]).map(function (pill) {
      return '<li>' + escapeHtml(pill) + '</li>';
    }).join("");

    page.innerHTML = (
      '<section class="pd-hero-section">' +
        '<div class="container pd-hero-grid">' +
          '<div class="pd-hero-media">' +
            '<div class="pd-hero-frame" style="background:' + heroGradient + '">' +
              '<img src="' + heroImg + '" alt="' + escapeHtml(p.name) + '" class="pd-hero-img pd-hero-img--photo' +
                (heroImg.indexOf(".svg") !== -1 ? " pd-hero-img--svg" : "") + '" />' +
            '</div>' +
          '</div>' +
          '<div class="pd-hero-copy">' +
            '<span class="section-badge">' + escapeHtml(profile.badge || "✨ HadeelBeauty") + '</span>' +
            '<h1>' + escapeHtml(p.name) + '</h1>' +
            '<p class="pd-lead">' + escapeHtml(p.description) + '</p>' +
            '<div class="pd-price-row">' +
              '<strong class="pd-price">' + fmtPrice(p.price) + '</strong>' +
              '<span class="pd-weight">' + escapeHtml(profile.weight || "COD") + '</span>' +
            '</div>' +
            '<ul class="pd-pills">' + pills + '</ul>' +
            '<div class="pd-order-box" id="pdOrder">' +
              '<div class="pd-order-head">' +
                '<div class="pd-order-head-icon" aria-hidden="true">✨</div>' +
                '<div>' +
                  '<h2 class="pd-order-title">اطلبي الآن</h2>' +
                  '<p class="pd-order-sub">املئي بياناتك وسنتصل بك لتأكيد التوصيل</p>' +
                '</div>' +
              '</div>' +
              '<ul class="pd-order-trust">' +
                '<li>💵 الدفع عند الاستلام</li>' +
                '<li>📦 افحصي قبل الدفع</li>' +
                '<li>🚚 توصيل 58 ولاية</li>' +
              '</ul>' +
              '<form id="pdOrderForm" class="pd-order-form">' +
                '<label class="pd-field">' +
                  '<span class="pd-field-label">الاسم الكامل</span>' +
                  '<input type="text" name="name" required minlength="2" maxlength="80" placeholder="مثال: فاطمة بن علي" autocomplete="name" />' +
                '</label>' +
                '<label class="pd-field">' +
                  '<span class="pd-field-label">رقم الهاتف</span>' +
                  '<input type="tel" name="phone" required placeholder="05xxxxxxxx أو +2135xxxxxxxx" inputmode="tel" autocomplete="tel" />' +
                '</label>' +
                '<label class="pd-field">' +
                  '<span class="pd-field-label">الولاية</span>' +
                  '<select name="regionId" id="pdRegionSelect" required>' +
                    '<option value="" disabled selected>اختاري ولايتك</option>' +
                  '</select>' +
                '</label>' +
                '<label class="pd-field">' +
                  '<span class="pd-field-label">العنوان</span>' +
                  '<textarea name="address" required minlength="5" maxlength="240" rows="3" placeholder="البلدية، الحي، الشارع، رقم المنزل"></textarea>' +
                '</label>' +
                '<div class="pd-qty-row pd-qty-row--form">' +
                  '<span class="pd-qty-label">الكمية</span>' +
                  '<button type="button" class="pd-qty-btn" data-action="dec" aria-label="تقليل">−</button>' +
                  '<span id="pdQty">1</span>' +
                  '<button type="button" class="pd-qty-btn" data-action="inc" aria-label="زيادة">+</button>' +
                '</div>' +
                '<div class="pd-order-summary">' +
                  '<div class="summary-row"><span>المنتج</span><span id="pdSummarySubtotal">' + fmtPrice(p.price) + '</span></div>' +
                  '<div class="summary-row summary-free-ship"><span>التوصيل</span><span>مجاني 🚚</span></div>' +
                  '<div class="summary-row summary-total"><span>الإجمالي</span><span id="pdOrderTotal">' + fmtPrice(p.price) + '</span></div>' +
                '</div>' +
                '<div class="cod-note">💵 الدفع عند الاستلام — لا حاجة لبطاقة بنكية</div>' +
                '<p class="form-error" id="pdOrderError" hidden></p>' +
                '<button type="submit" class="btn btn-primary btn-block pd-order-submit" id="pdOrderSubmit">اطلبي الآن — <span>' + fmtPrice(p.price) + '</span></button>' +
              '</form>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +
      highlightsSection +
      gallerySection +
      specsSection +
      '<section class="pd-bottom-cta">' +
        '<div class="container pd-bottom-cta-inner">' +
          '<h2>جاهزة للطلب؟</h2>' +
          '<p>اطلبي الآن وادفعي عند الاستلام بعد أن تتأكدي من المنتج.</p>' +
          '<button type="button" class="btn btn-light pd-scroll-order">اطلبي الآن</button>' +
        '</div>' +
      '</section>'
    );

    document.title = p.name + " | HadeelBeauty";
    var stickyPrice = $("#stickyPrice");
    if (stickyPrice) stickyPrice.textContent = fmtPrice(p.price);
    var stickyBar = $("#stickyBar");
    if (stickyBar) stickyBar.hidden = false;

    loadRegions();

    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action]");
      if (!btn) return;
      if (btn.getAttribute("data-action") === "inc") {
        state.qty = Math.min(10, state.qty + 1);
        $("#pdQty").textContent = state.qty;
        updateOrderSummary();
      }
      if (btn.getAttribute("data-action") === "dec") {
        state.qty = Math.max(1, state.qty - 1);
        $("#pdQty").textContent = state.qty;
        updateOrderSummary();
      }
    });

    $("#pdOrderForm").addEventListener("submit", submitOrder);
    $("#pdRegionSelect").addEventListener("change", updateOrderSummary);
    var stickyBtn = $("#stickyAddBtn");
    if (stickyBtn) stickyBtn.addEventListener("click", scrollToOrder);
    var scrollBtn = document.querySelector(".pd-scroll-order");
    if (scrollBtn) scrollBtn.addEventListener("click", scrollToOrder);

    trackViewContent(p);
  }

  fetch(apiUrl("/api/products/" + encodeURIComponent(PRODUCT_ID)))
    .then(function (res) {
      if (!res.ok) throw new Error("not found");
      return res.json();
    })
    .then(function (p) {
      var merged = Object.assign({ id: PRODUCT_ID }, p);
      var fallback = FALLBACK_PRODUCTS[PRODUCT_ID];
      if (fallback && fallback.name) merged.name = fallback.name;
      renderProduct(merged);
    })
    .catch(function () {
      renderProduct(FALLBACK_PRODUCTS[PRODUCT_ID] || FALLBACK_PRODUCTS["scar-gel-tcm"]);
    });
})();
