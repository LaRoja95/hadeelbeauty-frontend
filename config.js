// HadeelBeauty storefront config — Algérie
window.HADEELBEAUTY_CONFIG = {
  API_BASE: "", // same-origin via nginx /api/ proxy on hadeelbeauty.store
  STORE_URL: "https://hadeelbeauty.store",

  META_PIXEL_ID: "1027331430352258",
  TIKTOK_PIXEL_ID: "",
  SNAPCHAT_PIXEL_ID: "",

  PRODUCT_META: {
    "scar-gel-tcm": {
      emoji: "✨",
      category: "ندبات · حب الشباب",
      gradient: "linear-gradient(135deg, #fff8e1, #d4a574)",
      image: "assets/products/scar-gel/hero-product.png?v=1",
    },
    "brush-cleanse": { emoji: "🧴", category: "عناية بالبشرة", gradient: "linear-gradient(135deg, #e8f5d0, #84D318)" },
    "serum-vitc": { emoji: "✨", category: "سيروم", gradient: "linear-gradient(135deg, #fff9c4, #FFCC00)" },
    "cream-hydra": { emoji: "💧", category: "ترطيب", gradient: "linear-gradient(135deg, #e0f7fa, #00ADEF)" },
    "brow-tweezer": { emoji: "✂️", category: "أدوات", gradient: "linear-gradient(135deg, #fce4ec, #E5008F)" },
    "brush-set": { emoji: "💄", category: "مكياج", gradient: "linear-gradient(135deg, #f8bbd0, #E5008F)" },
    "sunscreen-spf50": { emoji: "☀️", category: "حماية", gradient: "linear-gradient(135deg, #fff3e0, #FFCC00)" },
    "lip-tint": { emoji: "💋", category: "مكياج", gradient: "linear-gradient(135deg, #ffcdd2, #E5008F)" },
    "face-mask": { emoji: "🧖", category: "عناية", gradient: "linear-gradient(135deg, #e8f5d0, #b8e86a)" },
    "micellar-water": { emoji: "💦", category: "تنظيف", gradient: "linear-gradient(135deg, #e1f5fe, #00ADEF)" },
  },

  PRODUCT_PROFILES: {
    "scar-gel-tcm": {
      badge: "✨ الأكثر طلباً",
      weight: "30 جرام · COD",
      pills: ["💵 الدفع عند الاستلام", "📦 افحصي المنتج قبل الدفع", "🚚 توصيل 58 ولاية", "🌿 تركيبة TCM لطيفة"],
      highlights: [
        { icon: "🛡️", title: "حماية", text: "يساعد على تقليل ظهور الندبات بعد الجروح والعمليات" },
        { icon: "✨", title: "توحيد اللون", text: "نياسيناميد وأربوتين لدعم مظهر أكثر توازناً" },
        { icon: "💧", title: "ترطيب", text: "هيالورونات الصوديوم لترطيب دون دهون" },
        { icon: "🌿", title: "لطيف", text: "قوام شفاف سريع الامتصاص — لجميع أنواع البشرة" },
      ],
      specs: [
        ["الوزن الصافي", "30 جرام"],
        ["النوع", "gel / مرهم شفاف"],
        ["الاستخدام", "مساءً — يومي"],
        ["أنواع البشرة", "جميع الأنواع"],
        ["المكونات البارزة", "سنتيلا آسياتيكا، نياسيناميد، أربوتين"],
        ["التوصيل", "58 ولاية — الدفع عند الاستلام"],
      ],
      gallery: true,
    },
  },
};
