import { useState, useEffect, useRef } from "react";

const TABS = ["Dashboard", "Inventory", "Scan", "Donate", "Allergy", "Analytics"];

const TRANSLATIONS = {
  en: {
    appSubtitle: "Track, donate, never waste",
    totalItems: "Total Items",
    expiringSoon: "Expiring Soon",
    within14: "Within 14 days",
    medicine: "Medicine",
    food: "Food",
    fluids: "Fluids",
    other: "Other",
    quickActions: "Quick Actions",
    scanItem: "Scan Item",
    scanDesc: "Add with camera",
    findDonation: "Find Donation",
    donateDesc: "Nearby centers",
    recentItems: "Recent Items",
    noItems: "No items yet. Add your first item!",
    dashboard: "Dashboard",
    inventory: "Inventory",
    scan: "Scan",
    donate: "Donate",
    analytics: "Analytics",
    allergy: "Allergy",
    addItem: "Add Item",
    itemName: "Item Name",
    category: "Category",
    expiryDate: "Expiry Date",
    add: "Add",
    cancel: "Cancel",
    notifications: "Notifications",
    noNotifications: "No notifications",
    expiresIn: "expires in",
    days: "days",
    donationCenters: "Donation Centers",
    openMaps: "Open in Maps",
    analyticsTitle: "Analytics Overview",
    expired: "Expired",
    expiredItems: "Expired Items",
    active: "Active",
    delete: "Delete",
    logout: "Logout",
    scanNotice: "Point your camera at a barcode or product label",
    scanBtn: "Open Camera",
    scanManual: "Or add manually",
    welcome: "Welcome",
    aiSuggest: "AI Suggestion",
    getSuggestion: "Get AI Tip",
    loadingSuggestion: "Thinking...",
    nearestCenter: "Nearest to you",
    detectLocation: "Detect My Location",
    searchCity: "Search by city...",
    km: "km away",
    locationError: "Could not detect location. Try searching manually.",
    detectingLocation: "Detecting location...",
    allergyTitle: "Allergy Notes",
    allergySubtitle: "AI suggestions will never include these ingredients",
    addAllergy: "Add",
    allergyPlaceholder: "e.g. Peanuts, Shellfish, Gluten...",
    noAllergies: "No allergies added yet.",
    allergyNote: "These are saved to your profile and used by the AI when generating food suggestions.",
    commonAllergies: "Common allergies — tap to toggle",
  },
  ar: {
    appSubtitle: "تتبع، تبرع، لا تهدر",
    totalItems: "إجمالي العناصر",
    expiringSoon: "تنتهي قريباً",
    within14: "خلال 14 يوم",
    medicine: "دواء",
    food: "طعام",
    fluids: "سوائل",
    other: "أخرى",
    quickActions: "إجراءات سريعة",
    scanItem: "مسح العنصر",
    scanDesc: "أضف بالكاميرا",
    findDonation: "جهات التبرع",
    donateDesc: "مراكز قريبة",
    recentItems: "العناصر الأخيرة",
    noItems: "لا توجد عناصر بعد. أضف عنصرك الأول!",
    dashboard: "الرئيسية",
    inventory: "المخزون",
    scan: "مسح",
    donate: "تبرع",
    analytics: "تحليلات",
    allergy: "الحساسية",
    addItem: "إضافة عنصر",
    itemName: "اسم العنصر",
    category: "الفئة",
    expiryDate: "تاريخ الانتهاء",
    add: "إضافة",
    cancel: "إلغاء",
    notifications: "الإشعارات",
    noNotifications: "لا توجد إشعارات",
    expiresIn: "تنتهي خلال",
    days: "أيام",
    donationCenters: "مراكز التبرع",
    openMaps: "فتح في الخرائط",
    analyticsTitle: "نظرة عامة على التحليلات",
    expired: "منتهي",
    expiredItems: "العناصر المنتهية",
    active: "نشط",
    delete: "حذف",
    logout: "تسجيل الخروج",
    scanNotice: "وجّه الكاميرا نحو الباركود أو ملصق المنتج",
    scanBtn: "فتح الكاميرا",
    scanManual: "أو أضف يدوياً",
    welcome: "مرحباً",
    aiSuggest: "اقتراح الذكاء الاصطناعي",
    getSuggestion: "احصل على نصيحة",
    loadingSuggestion: "جارٍ التفكير...",
    nearestCenter: "الأقرب إليك",
    detectLocation: "تحديد موقعي",
    searchCity: "ابحث بالمدينة...",
    km: "كم",
    locationError: "تعذر تحديد الموقع. جرب البحث اليدوي.",
    detectingLocation: "جارٍ تحديد الموقع...",
    allergyTitle: "ملاحظات الحساسية",
    allergySubtitle: "لن تتضمن اقتراحات الذكاء الاصطناعي هذه المكونات أبداً",
    addAllergy: "إضافة",
    allergyPlaceholder: "مثال: فول سوداني، مأكولات بحرية، جلوتين...",
    noAllergies: "لم تتم إضافة أي حساسية بعد.",
    allergyNote: "يتم حفظها في ملفك الشخصي ويستخدمها الذكاء الاصطناعي عند توليد اقتراحات الطعام.",
    commonAllergies: "حساسيات شائعة — اضغط للتبديل",
  },
};

const COMMON_ALLERGIES = ["Peanuts", "Tree nuts", "Milk", "Eggs", "Wheat", "Soy", "Fish", "Shellfish", "Sesame", "Gluten"];

const DONATION_CENTERS = [
  { name: "Saudi Food Bank", nameAr: "بنك الطعام السعودي", city: "Riyadh", lat: 24.7136, lng: 46.6753, phone: "966920008110" },
  { name: "King Salman Humanitarian Aid", nameAr: "مركز الملك سلمان للإغاثة", city: "Riyadh", lat: 24.6877, lng: 46.7219, phone: "966920000052" },
  { name: "Ehsan Charity Platform", nameAr: "منصة إحسان الخيرية", city: "Riyadh", lat: 24.7241, lng: 46.6916, phone: "9668001247000" },
  { name: "Al-Birr Society", nameAr: "جمعية البر", city: "Jeddah", lat: 21.4858, lng: 39.1925, phone: "966164210122" },
  { name: "Manahil Charity", nameAr: "جمعية منابع الخيرية", city: "Dammam", lat: 26.4207, lng: 50.0888, phone: "966920008110" },
  { name: "Riyadh Food Bank", nameAr: "بنك طعام الرياض", city: "Riyadh", lat: 24.6541, lng: 46.7198, phone: "966920008110" },
  { name: "Jeddah Charity Center", nameAr: "مركز جدة الخيري", city: "Jeddah", lat: 21.5433, lng: 39.1728, phone: "966164210122" },
];

function getDaysUntilExpiry(expiryDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
}

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getCategoryEmoji(category) {
  if (category === "Food") return "🍎";
  if (category === "Medicine") return "💊";
  if (category === "Fluids") return "💧";
  return "📦";
}

async function fetchAISuggestion(item, daysLeft, lang, allergies) {
  const safeAllergies = Array.isArray(allergies) ? allergies : [];
  const allergyNote = safeAllergies.length > 0
    ? (lang === "ar"
        ? ` مهم: المستخدم لديه حساسية من: ${safeAllergies.join("، ")}. لا تذكر أي وصفة تحتوي على هذه المكونات.`
        : ` Important: the user is allergic to: ${safeAllergies.join(", ")}. Do NOT suggest any recipe or tip that includes these ingredients.`)
    : "";

  const prompt = lang === "ar"
    ? `لدي منتج "${item.name}" من فئة "${item.category}" وسينتهي خلال ${daysLeft} يوم. أعطني نصيحة قصيرة ومفيدة جداً (جملتين فقط) حول كيفية استخدامه أو التبرع به قبل انتهاء صلاحيته.${allergyNote}`
    : `I have a "${item.name}" (${item.category}) expiring in ${daysLeft} days. Give me a very short, practical tip (2 sentences max) on how to use it or donate it before it expires.${allergyNote}`;

 const response = await fetch(`/api/ai-suggestion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await response.json();
  return data.suggestion || "No suggestion available.";
}

export default function Dashboard({ username, onLogout }) {
  const [lang, setLang] = useState("en");
  const [activeTab, setActiveTab] = useState("Dashboard");

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("nawerni_items");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  });

  const [allergies, setAllergies] = useState(() => {
    try {
      const saved = localStorage.getItem("nawerni_allergies");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  });

  const [allergyInput, setAllergyInput] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", category: "Food", expiry: "" });
  const [vw, setVw] = useState(window.innerWidth);

  // ✅ Scan state variables
  const [scanResult, setScanResult] = useState(null);
  const [scanPreview, setScanPreview] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);

  const [aiSuggestions, setAiSuggestions] = useState({});
  const [aiLoading, setAiLoading] = useState({});
  const [showAiModal, setShowAiModal] = useState(false);
  const [selectedAiItem, setSelectedAiItem] = useState(null);

  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [sortedCenters, setSortedCenters] = useState(DONATION_CENTERS);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const t = TRANSLATIONS[lang];
  const isRTL = lang === "ar";
  const isSmall = vw < 400;

  useEffect(() => {
    localStorage.setItem("nawerni_items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("nawerni_allergies", JSON.stringify(allergies));
  }, [allergies]);

  useEffect(() => {
    if (activeTab !== "Dashboard") return;
    const expiring = items.filter((i) => {
      const d = getDaysUntilExpiry(i.expiry);
      return d >= 0 && d <= 7;
    });
    expiring.forEach((item) => {
      if (!aiSuggestions[item.id] && !aiLoading[item.id]) {
        loadAiSuggestion(item);
      }
    });
  }, [activeTab, items]);

  const loadAiSuggestion = async (item) => {
    const d = getDaysUntilExpiry(item.expiry);
    setAiLoading((prev) => ({ ...prev, [item.id]: true }));
    try {
      const suggestion = await fetchAISuggestion(item, d, lang, allergies);
      setAiSuggestions((prev) => ({ ...prev, [item.id]: suggestion }));
    } catch {
      setAiSuggestions((prev) => ({ ...prev, [item.id]: "Could not load suggestion." }));
    }
    setAiLoading((prev) => ({ ...prev, [item.id]: false }));
  };

  const openAiModal = async (item) => {
    setSelectedAiItem(item);
    setShowAiModal(true);
    if (!aiSuggestions[item.id]) {
      await loadAiSuggestion(item);
    }
  };

  const detectLocation = () => {
    setDetectingLocation(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        const sorted = [...DONATION_CENTERS].sort((a, b) =>
          getDistanceKm(latitude, longitude, a.lat, a.lng) -
          getDistanceKm(latitude, longitude, b.lat, b.lng)
        );
        setSortedCenters(sorted);
        setDetectingLocation(false);
      },
      () => {
        setLocationError(t.locationError);
        setDetectingLocation(false);
      }
    );
  };

  const filteredCenters = citySearch.trim()
    ? sortedCenters.filter((c) =>
        c.city.toLowerCase().includes(citySearch.toLowerCase()) ||
        c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
        c.nameAr.includes(citySearch)
      )
    : sortedCenters;

  const addAllergy = () => {
    const trimmed = allergyInput.trim();
    if (!trimmed || allergies.includes(trimmed)) return;
    setAllergies([...allergies, trimmed]);
    setAllergyInput("");
  };

  const removeAllergy = (a) => setAllergies(allergies.filter((x) => x !== a));

  const toggleCommonAllergy = (a) => {
    if (allergies.includes(a)) removeAllergy(a);
    else setAllergies([...allergies, a]);
  };

  const expiringSoon = items.filter((i) => { const d = getDaysUntilExpiry(i.expiry); return d >= 0 && d <= 14; });
  const notifications = items.filter((i) => { const d = getDaysUntilExpiry(i.expiry); return d >= 0 && d <= 7; });
  const expired = items.filter((i) => getDaysUntilExpiry(i.expiry) < 0);
  const active = items.filter((i) => getDaysUntilExpiry(i.expiry) >= 0);
  const foodItems = items.filter((i) => i.category === "Food");
  const medItems = items.filter((i) => i.category === "Medicine");
  const fluidItems = items.filter((i) => i.category === "Fluids");
  const otherItems = items.filter((i) => i.category === "Other");

  const handleAddItem = () => {
    if (!newItem.name || !newItem.expiry) return;
    setItems([...items, { ...newItem, id: Date.now() }]);
    setNewItem({ name: "", category: "Food", expiry: "" });
    setShowAddModal(false);
  };

  const handleDelete = (id) => setItems(items.filter((i) => i.id !== id));

  const openMaps = (lat, lng, name) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`, "_blank");
  };

  const tabIcons = {
    Dashboard: "⊞",
    Inventory: "📦",
    Scan: "📷",
    Donate: "📍",
    Allergy: "🛡️",
    Analytics: "📊",
  };

  const statCard = (label, value, color) => (
    <div style={{ background: "#fff", borderRadius: "14px", padding: isSmall ? "12px" : "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ fontSize: "12px", color: "#888", marginBottom: "6px" }}>{label}</div>
      <div style={{ fontSize: isSmall ? "22px" : "28px", fontWeight: "700", color: color || "#1e2d1a" }}>{value}</div>
    </div>
  );

  return (
    <div style={{
      width: "100vw", minHeight: "100vh", backgroundColor: "#f0f0ee",
      display: "flex", flexDirection: "column",
      direction: isRTL ? "rtl" : "ltr",
      fontFamily: isRTL ? "'Cairo', sans-serif" : "'DM Sans', sans-serif",
      boxSizing: "border-box", overflowX: "hidden",
    }}>

      {/* HEADER */}
      <div style={{ backgroundColor: "#3a5535", padding: isSmall ? "14px 14px 20px" : "18px 20px 24px", borderRadius: "0 0 20px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <div style={{ fontSize: isSmall ? "18px" : "22px", fontWeight: "700", color: "#e8b820", fontStyle: "italic" }}>Nawerni 💡</div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>{t.appSubtitle}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: "8px", padding: "5px 10px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }} onClick={() => setLang(lang === "en" ? "ar" : "en")}>
              {lang === "en" ? "عربي" : "EN"}
            </button>
            <div style={{ position: "relative" }}>
              <button style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", padding: "0", position: "relative" }} onClick={() => setShowNotifications(!showNotifications)}>
                🔔
                {notifications.length > 0 && (
                  <span style={{ position: "absolute", top: "-4px", right: "-4px", background: "#e07b00", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" }}>
                    {notifications.length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div style={{ position: "absolute", top: "36px", right: "0", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", width: "260px", zIndex: 100, padding: "12px" }}>
                  <div style={{ fontWeight: "700", fontSize: "14px", color: "#3a5535", marginBottom: "10px" }}>{t.notifications}</div>
                  {notifications.length === 0 ? (
                    <div style={{ fontSize: "13px", color: "#aaa", textAlign: "center", padding: "10px 0" }}>{t.noNotifications}</div>
                  ) : notifications.map((item) => (
                    <div key={item.id} style={{ display: "flex", gap: "8px", padding: "8px 0", borderBottom: "0.5px solid #eee", fontSize: "13px", color: "#444" }}>
                      <span>⚠️</span>
                      <span><strong>{item.name}</strong> {t.expiresIn} <strong style={{ color: "#e07b00" }}>{getDaysUntilExpiry(item.expiry)}</strong> {t.days}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: "8px", padding: "5px 10px", cursor: "pointer", fontSize: "12px" }} onClick={onLogout}>
              {t.logout}
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: isSmall ? "12px 12px 90px" : "16px 16px 90px", boxSizing: "border-box", width: "100%", overflowY: "auto" }}>

        {/* ── DASHBOARD TAB ── */}
        {activeTab === "Dashboard" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isSmall ? "8px" : "10px", marginBottom: isSmall ? "8px" : "10px" }}>
              {statCard(t.totalItems, items.length)}
              <div style={{ background: "#fff", borderRadius: "14px", padding: isSmall ? "12px" : "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: "12px", color: "#888", marginBottom: "6px" }}>{t.expiringSoon}</div>
                <div style={{ fontSize: isSmall ? "22px" : "28px", fontWeight: "700", color: "#e07b00" }}>{expiringSoon.length}</div>
                <div style={{ fontSize: "11px", color: "#aaa", marginTop: "2px" }}>{t.within14}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isSmall ? "8px" : "10px", marginBottom: isSmall ? "8px" : "10px" }}>
              {statCard(t.medicine, medItems.length)}
              {statCard(t.food, foodItems.length)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isSmall ? "8px" : "10px", marginBottom: isSmall ? "8px" : "10px" }}>
              {statCard(t.fluids, fluidItems.length)}
              {statCard(t.other, otherItems.length)}
            </div>

            {allergies.length > 0 && (
              <div style={{ background: "#fbeaf0", border: "1px solid #f4c0d1", borderRadius: "12px", padding: "10px 14px", marginBottom: "14px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span style={{ fontSize: "16px", marginTop: "1px" }}>🛡️</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: "#72243e", marginBottom: "5px" }}>AI suggestions avoid your allergens</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {allergies.map((a) => (
                      <span key={a} style={{ background: "#fff", border: "0.5px solid #f4c0d1", borderRadius: "999px", padding: "2px 9px", fontSize: "11px", color: "#993556" }}>{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {notifications.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "15px", fontWeight: "600", color: "#333", margin: "18px 0 10px", display: "flex", alignItems: "center", gap: "6px" }}>
                  🤖 {t.aiSuggest}
                </div>
                {notifications.map((item) => {
                  const d = getDaysUntilExpiry(item.expiry);
                  return (
                    <div key={item.id} style={{ background: "#fff", borderRadius: "14px", padding: "14px", marginBottom: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", borderLeft: "4px solid #e07b00" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <div style={{ fontWeight: "600", fontSize: "14px", color: "#1e2d1a" }}>
                          {getCategoryEmoji(item.category)} {item.name}
                        </div>
                        <span style={{ fontSize: "11px", color: "#e07b00", fontWeight: "600" }}>
                          {d === 0 ? "Today!" : `${d} ${t.days}`}
                        </span>
                      </div>
                      {aiLoading[item.id] ? (
                        <div style={{ fontSize: "13px", color: "#aaa", fontStyle: "italic" }}>🤖 {t.loadingSuggestion}</div>
                      ) : aiSuggestions[item.id] ? (
                        <div style={{ fontSize: "13px", color: "#444", lineHeight: "1.6", background: "#f9f9f7", borderRadius: "8px", padding: "10px" }}>
                          🤖 {aiSuggestions[item.id]}
                        </div>
                      ) : (
                        <button style={{ background: "#3a5535", color: "#fff", border: "none", borderRadius: "8px", padding: "6px 14px", fontSize: "12px", cursor: "pointer", fontWeight: "600" }} onClick={() => loadAiSuggestion(item)}>
                          {t.getSuggestion}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ fontSize: "15px", fontWeight: "600", color: "#333", margin: "18px 0 10px" }}>{t.quickActions}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isSmall ? "8px" : "10px", marginBottom: "8px" }}>
              <button style={{ background: "#3a5535", border: "none", borderRadius: "14px", padding: isSmall ? "14px 10px" : "18px 12px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px", width: "100%" }} onClick={() => setActiveTab("Scan")}>
                <span style={{ fontSize: isSmall ? "18px" : "22px" }}>📷</span>
                <span style={{ color: "#fff", fontWeight: "700", fontSize: isSmall ? "13px" : "15px" }}>{t.scanItem}</span>
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "12px" }}>{t.scanDesc}</span>
              </button>
              <button style={{ background: "#3a5535", border: "none", borderRadius: "14px", padding: isSmall ? "14px 10px" : "18px 12px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px", width: "100%" }} onClick={() => setActiveTab("Donate")}>
                <span style={{ fontSize: isSmall ? "18px" : "22px" }}>📍</span>
                <span style={{ color: "#fff", fontWeight: "700", fontSize: isSmall ? "13px" : "15px" }}>{t.findDonation}</span>
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "12px" }}>{t.donateDesc}</span>
              </button>
            </div>

            <div style={{ fontSize: "15px", fontWeight: "600", color: "#333", margin: "18px 0 10px" }}>{t.recentItems}</div>
            {items.length === 0 ? (
              <div style={{ textAlign: "center", color: "#aaa", fontSize: "14px", padding: "30px 0" }}>{t.noItems}</div>
            ) : items.slice(-5).reverse().map((item) => {
              const d = getDaysUntilExpiry(item.expiry);
              return (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "12px", background: "#fff", borderRadius: "12px", padding: "12px 14px", marginBottom: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <span>{getCategoryEmoji(item.category)}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e2d1a" }}>{item.name}</div>
                    <div style={{ fontSize: "12px", color: d < 0 ? "#c0392b" : d <= 7 ? "#e07b00" : "#888" }}>
                      {d < 0 ? t.expired : `${t.expiresIn} ${d} ${t.days}`}
                    </div>
                  </div>
                  <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "20px", fontWeight: "600", background: "#f0f0ee", color: "#555" }}>
                    {t[item.category.toLowerCase()] || item.category}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── INVENTORY TAB ── */}
        {activeTab === "Inventory" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
              <h2 style={{ fontSize: isSmall ? "17px" : "20px", fontWeight: "700", color: "#3a5535" }}>{t.inventory}</h2>
              <button style={{ background: "#3a5535", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 16px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }} onClick={() => setShowAddModal(true)}>
                + {t.addItem}
              </button>
            </div>
            {items.length === 0 ? (
              <div style={{ textAlign: "center", color: "#aaa", fontSize: "14px", padding: "30px 0" }}>{t.noItems}</div>
            ) : items.map((item) => {
              const d = getDaysUntilExpiry(item.expiry);
              return (
                <div key={item.id} style={{ background: "#fff", borderRadius: "12px", padding: "14px", marginBottom: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: aiSuggestions[item.id] ? "10px" : "0" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <span style={{ fontSize: "24px" }}>{getCategoryEmoji(item.category)}</span>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e2d1a" }}>{item.name}</div>
                        <div style={{ fontSize: "12px", color: d < 0 ? "#c0392b" : d <= 7 ? "#e07b00" : "#888" }}>
                          {d < 0 ? t.expired : `${t.expiresIn} ${d} ${t.days}`}
                        </div>
                        <div style={{ fontSize: "11px", color: "#aaa" }}>{item.expiry}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
                      <button style={{ background: "#fdecea", color: "#c0392b", border: "none", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }} onClick={() => handleDelete(item.id)}>
                        {t.delete}
                      </button>
                      <button style={{ background: "#e8f5e9", color: "#2d6a2d", border: "none", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }} onClick={() => openAiModal(item)}>
                        🤖 {t.getSuggestion}
                      </button>
                    </div>
                  </div>
                  {aiSuggestions[item.id] && (
                    <div style={{ fontSize: "12px", color: "#444", lineHeight: "1.6", background: "#f9f9f7", borderRadius: "8px", padding: "10px", marginTop: "8px" }}>
                      🤖 {aiSuggestions[item.id]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── SCAN TAB ── */}
        {activeTab === "Scan" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "10px" }}>
            <h2 style={{ fontSize: isSmall ? "17px" : "20px", fontWeight: "700", color: "#3a5535", marginBottom: "16px", alignSelf: "flex-start" }}>{t.scanItem}</h2>

            {/* Preview */}
            <div style={{ width: "100%", background: "#222", borderRadius: "16px", height: isSmall ? "160px" : "220px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", position: "relative", overflow: "hidden" }}>
              {scanPreview ? (
                <img src={scanPreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "16px" }} />
              ) : (
                <>
                  <div style={{ position: "absolute", top: "16px", left: "16px", width: "40px", height: "40px", borderTop: "3px solid #e8b820", borderLeft: "3px solid #e8b820", borderRadius: "4px 0 0 0" }} />
                  <div style={{ position: "absolute", top: "16px", right: "16px", width: "40px", height: "40px", borderTop: "3px solid #e8b820", borderRight: "3px solid #e8b820", borderRadius: "0 4px 0 0" }} />
                  <div style={{ position: "absolute", bottom: "16px", left: "16px", width: "40px", height: "40px", borderBottom: "3px solid #e8b820", borderLeft: "3px solid #e8b820", borderRadius: "0 0 0 4px" }} />
                  <div style={{ position: "absolute", bottom: "16px", right: "16px", width: "40px", height: "40px", borderBottom: "3px solid #e8b820", borderRight: "3px solid #e8b820", borderRadius: "0 0 4px 0" }} />
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ fontSize: "48px" }}>📷</span>
                    <p style={{ color: "#fff", fontSize: "13px", marginTop: "12px", textAlign: "center", padding: "0 20px" }}>{t.scanNotice}</p>
                  </div>
                </>
              )}
            </div>

            {/* Scanning status */}
            {scanLoading && (
              <div style={{ background: "#e8f5e9", borderRadius: "10px", padding: "12px 16px", marginBottom: "12px", width: "100%", textAlign: "center", fontSize: "14px", color: "#2d6a2d", fontWeight: "600" }}>
                🤖 Reading product info...
              </div>
            )}

            {/* Scanned result */}
            {scanResult && !scanLoading && (
              <div style={{ background: "#e8f5e9", borderRadius: "12px", padding: "14px", marginBottom: "12px", width: "100%", boxSizing: "border-box" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#2d6a2d", marginBottom: "8px" }}>✅ Product detected!</div>
                {scanResult.productName && <div style={{ fontSize: "13px", color: "#444" }}>📦 <strong>Name:</strong> {scanResult.productName}</div>}
                {scanResult.expiryDate && <div style={{ fontSize: "13px", color: "#444", marginTop: "4px" }}>📅 <strong>Expiry:</strong> {scanResult.expiryDate}</div>}
                {scanResult.barcode && <div style={{ fontSize: "13px", color: "#444", marginTop: "4px" }}>🔢 <strong>Barcode:</strong> {scanResult.barcode}</div>}
                <button
                  style={{ marginTop: "12px", width: "100%", background: "#3a5535", color: "#fff", border: "none", borderRadius: "10px", padding: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "700" }}
                  onClick={() => {
                    setNewItem({ name: scanResult.productName || "", category: "Food", expiry: scanResult.expiryDate || "" });
                    setScanResult(null);
                    setScanPreview(null);
                    setShowAddModal(true);
                  }}
                >
                  ➕ Add to Inventory
                </button>
              </div>
            )}

            <input
              id="cameraInput"
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: "none" }}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async (ev) => {
                  const base64Full = ev.target.result;
                  setScanPreview(base64Full);
                  const base64Data = base64Full.split(",")[1];
                  const mediaType = file.type || "image/jpeg";
                  setScanLoading(true);
                  setScanResult(null);
                  try {
                    const res = await fetch(`/api/scan`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ imageBase64: base64Data, mediaType })
                    });
                    const data = await res.json();
                    setScanResult(data);
                  } catch {
                    setScanResult({ productName: "", expiryDate: "", barcode: "" });
                  }
                  setScanLoading(false);
                };
                reader.readAsDataURL(file);
                e.target.value = "";
              }}
            />

            <button
              style={{ background: "#3a5535", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 28px", cursor: "pointer", fontSize: "15px", fontWeight: "700", marginBottom: "12px", width: "100%" }}
              onClick={() => { setScanResult(null); setScanPreview(null); document.getElementById("cameraInput").click(); }}
            >
              {t.scanBtn}
            </button>
            <div style={{ color: "#aaa", fontSize: "13px", margin: "8px 0 12px" }}>— {t.scanManual} —</div>
            <button
              style={{ background: "#3a5535", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 16px", cursor: "pointer", fontSize: "14px", fontWeight: "600", width: "100%" }}
              onClick={() => setShowAddModal(true)}
            >
              + {t.addItem}
            </button>
          </div>
        )}

        {/* ── DONATE TAB ── */}
        {activeTab === "Donate" && (
          <div>
            <h2 style={{ fontSize: isSmall ? "17px" : "20px", fontWeight: "700", color: "#3a5535", marginBottom: "14px" }}>{t.donationCenters}</h2>
            <div style={{ background: "#fff", borderRadius: "14px", padding: "14px", marginBottom: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <button style={{ width: "100%", background: "#3a5535", color: "#fff", border: "none", borderRadius: "10px", padding: "11px", cursor: "pointer", fontSize: "14px", fontWeight: "600", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }} onClick={detectLocation} disabled={detectingLocation}>
                {detectingLocation ? `⏳ ${t.detectingLocation}` : `📍 ${t.detectLocation}`}
              </button>
              {locationError && <div style={{ fontSize: "12px", color: "#c0392b", marginBottom: "8px", textAlign: "center" }}>{locationError}</div>}
              {userLocation && <div style={{ fontSize: "12px", color: "#2d6a2d", marginBottom: "8px", textAlign: "center" }}>✅ {t.nearestCenter}</div>}
              <input type="text" value={citySearch} onChange={(e) => setCitySearch(e.target.value)} placeholder={t.searchCity} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #d0d0cc", borderRadius: "10px", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
            {filteredCenters.map((center, i) => {
              const dist = userLocation ? getDistanceKm(userLocation.lat, userLocation.lng, center.lat, center.lng).toFixed(1) : null;
              return (
                <div key={i} style={{ background: "#fff", borderRadius: "14px", padding: "16px", marginBottom: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", borderLeft: i === 0 && userLocation ? "4px solid #3a5535" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      {i === 0 && userLocation && (
                        <div style={{ fontSize: "11px", background: "#e8f5e9", color: "#2d6a2d", borderRadius: "6px", padding: "2px 8px", marginBottom: "6px", display: "inline-block", fontWeight: "600" }}>⭐ {t.nearestCenter}</div>
                      )}
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#1e2d1a", marginBottom: "4px" }}>{lang === "ar" ? center.nameAr : center.name}</div>
                      <div style={{ fontSize: "12px", color: "#888", display: "flex", alignItems: "center", gap: "6px" }}>
                        📍 {center.city}
                        {dist && <span style={{ color: "#3a5535", fontWeight: "600" }}>· {dist} {t.km}</span>}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
                      <button style={{ background: "#e8f5e9", color: "#2d6a2d", border: "none", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" }} onClick={() => openMaps(center.lat, center.lng, center.name)}>
                        🗺 {t.openMaps}
                      </button>
                      <button style={{ background: "#25D366", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" }}
                        onClick={() => { const msg = encodeURIComponent(`Hello, I would like to donate some items to ${center.name}. Could you please let me know what you currently accept and how many items I can bring?`); window.open(`https://wa.me/${center.phone}?text=${msg}`, "_blank"); }}>
                        💬 WhatsApp
                      </button>
                      <button style={{ background: "#4a6741", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" }}
                        onClick={() => { window.location.href = `tel:+${center.phone}`; }}>
                        📞 Call
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── ALLERGY TAB ── */}
        {activeTab === "Allergy" && (
          <div>
            <h2 style={{ fontSize: isSmall ? "17px" : "20px", fontWeight: "700", color: "#3a5535", marginBottom: "4px" }}>{t.allergyTitle}</h2>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "18px", lineHeight: "1.6" }}>{t.allergySubtitle}</p>
            <div style={{ background: "#fff", borderRadius: "14px", padding: "16px", marginBottom: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <input type="text" value={allergyInput} onChange={(e) => setAllergyInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addAllergy()} placeholder={t.allergyPlaceholder} style={{ flex: 1, padding: "10px 14px", border: "1.5px solid #d0d0cc", borderRadius: "10px", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                <button onClick={addAllergy} style={{ background: "#3a5535", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 16px", cursor: "pointer", fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap", fontFamily: "inherit" }}>+ {t.addAllergy}</button>
              </div>
              <div style={{ marginTop: "14px" }}>
                <div style={{ fontSize: "12px", color: "#aaa", marginBottom: "8px" }}>{t.commonAllergies}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {COMMON_ALLERGIES.map((a) => (
                    <button key={a} onClick={() => toggleCommonAllergy(a)} style={{ background: allergies.includes(a) ? "#3a5535" : "#f0f0ee", color: allergies.includes(a) ? "#fff" : "#555", border: "none", borderRadius: "999px", padding: "5px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
                      {allergies.includes(a) ? "✓ " : "+ "}{a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: "14px", padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#3a5535", marginBottom: "12px" }}>🛡️ {t.allergyTitle} ({allergies.length})</div>
              {allergies.length === 0 ? (
                <div style={{ fontSize: "13px", color: "#aaa", textAlign: "center", padding: "16px 0" }}>{t.noAllergies}</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {allergies.map((a) => (
                    <div key={a} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fbeaf0", borderRadius: "10px", padding: "10px 14px", border: "0.5px solid #f4c0d1" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "14px" }}>🚫</span>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#72243e" }}>{a}</span>
                      </div>
                      <button onClick={() => removeAllergy(a)} style={{ background: "none", border: "none", color: "#993556", cursor: "pointer", fontSize: "20px", lineHeight: "1", padding: "0 4px" }}>×</button>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: "14px", fontSize: "12px", color: "#aaa", lineHeight: "1.6", borderTop: "0.5px solid #f0f0ee", paddingTop: "12px" }}>ℹ️ {t.allergyNote}</div>
            </div>
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {activeTab === "Analytics" && (
          <div>
            <h2 style={{ fontSize: isSmall ? "17px" : "20px", fontWeight: "700", color: "#3a5535", marginBottom: "14px" }}>{t.analyticsTitle}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isSmall ? "8px" : "10px", marginBottom: isSmall ? "8px" : "10px" }}>
              {statCard(t.totalItems, items.length)}
              {statCard(t.active, active.length, "#2d6a2d")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isSmall ? "8px" : "10px", marginBottom: isSmall ? "8px" : "10px" }}>
              {statCard(t.expiringSoon, expiringSoon.length, "#e07b00")}
              {statCard(t.expiredItems, expired.length, "#c0392b")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isSmall ? "8px" : "10px", marginBottom: isSmall ? "8px" : "10px" }}>
              {statCard(t.food, foodItems.length)}
              {statCard(t.medicine, medItems.length)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isSmall ? "8px" : "10px", marginBottom: isSmall ? "8px" : "10px" }}>
              {statCard(t.fluids, fluidItems.length)}
              {statCard(t.other, otherItems.length)}
            </div>
            {items.length > 0 && (
              <div style={{ background: "#fff", borderRadius: "14px", padding: "18px", marginTop: "14px" }}>
                {[
                  { label: t.active, count: active.length, color: "#4a6741" },
                  { label: t.expiringSoon, count: expiringSoon.length, color: "#e07b00" },
                  { label: t.expiredItems, count: expired.length, color: "#c0392b" },
                ].map((bar) => (
                  <div key={bar.label} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                    <div style={{ fontSize: "12px", color: "#555", width: "90px", flexShrink: 0 }}>{bar.label}</div>
                    <div style={{ flex: 1, background: "#f0f0ee", borderRadius: "10px", height: "10px", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: "10px", transition: "width 0.5s ease", width: items.length ? `${(bar.count / items.length) * 100}%` : "0%", background: bar.color }} />
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#333", width: "20px", textAlign: "right" }}>{bar.count}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, width: "100%", background: "#fff", borderTop: "0.5px solid #e0e0e0", display: "flex", padding: isSmall ? "6px 0 10px" : "8px 0 12px", zIndex: 50, boxSizing: "border-box" }}>
        {TABS.map((tab) => (
          <button key={tab} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", padding: "4px 0", color: activeTab === tab ? "#3a5535" : "#888" }} onClick={() => setActiveTab(tab)}>
            <span style={{ fontSize: isSmall ? "15px" : "17px" }}>{tabIcons[tab]}</span>
            <span style={{ fontSize: isSmall ? "8px" : "9px", fontWeight: activeTab === tab ? "700" : "500" }}>{t[tab.toLowerCase()]}</span>
          </button>
        ))}
      </div>

      {/* AI SUGGESTION MODAL */}
      {showAiModal && selectedAiItem && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "20px", boxSizing: "border-box" }} onClick={() => setShowAiModal(false)}>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "28px 24px", width: "100%", maxWidth: "380px", boxSizing: "border-box" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#3a5535", marginBottom: "6px" }}>🤖 {t.aiSuggest}</div>
            <div style={{ fontSize: "13px", color: "#888", marginBottom: "8px" }}>
              {getCategoryEmoji(selectedAiItem.category)} {selectedAiItem.name} · {t.expiresIn} {getDaysUntilExpiry(selectedAiItem.expiry)} {t.days}
            </div>
            {allergies.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "14px" }}>
                {allergies.map((a) => (
                  <span key={a} style={{ background: "#fbeaf0", border: "0.5px solid #f4c0d1", borderRadius: "999px", padding: "2px 8px", fontSize: "11px", color: "#993556" }}>🚫 {a}</span>
                ))}
              </div>
            )}
            {aiLoading[selectedAiItem.id] ? (
              <div style={{ fontSize: "14px", color: "#aaa", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>🤖 {t.loadingSuggestion}</div>
            ) : (
              <div style={{ fontSize: "14px", color: "#444", lineHeight: "1.75", background: "#f9f9f7", borderRadius: "10px", padding: "16px" }}>
                {aiSuggestions[selectedAiItem.id] || ""}
              </div>
            )}
            <button style={{ width: "100%", marginTop: "18px", background: "#3a5535", color: "#fff", border: "none", borderRadius: "10px", padding: "12px", cursor: "pointer", fontWeight: "700", fontSize: "14px" }} onClick={() => setShowAiModal(false)}>
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {/* ADD ITEM MODAL */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "20px", boxSizing: "border-box" }} onClick={() => setShowAddModal(false)}>
          <div style={{ background: "#fff", borderRadius: "16px", padding: isSmall ? "20px 16px" : "28px 24px", width: "100%", maxWidth: "380px", boxSizing: "border-box" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#3a5535", marginBottom: "18px" }}>{t.addItem}</h3>
            <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "6px" }}>{t.itemName}</label>
            <input style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #d0d0cc", borderRadius: "10px", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder={t.itemName} />
            <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "6px", marginTop: "12px" }}>{t.category}</label>
            <select style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #d0d0cc", borderRadius: "10px", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}>
              <option value="Food">{t.food}</option>
              <option value="Medicine">{t.medicine}</option>
              <option value="Fluids">{t.fluids}</option>
              <option value="Other">{t.other}</option>
            </select>
            <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "6px", marginTop: "12px" }}>{t.expiryDate}</label>
            <input style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #d0d0cc", borderRadius: "10px", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} type="date" value={newItem.expiry} onChange={(e) => setNewItem({ ...newItem, expiry: e.target.value })} />
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button style={{ flex: 1, background: "#f5f5f3", color: "#555", border: "none", borderRadius: "10px", padding: "12px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }} onClick={() => setShowAddModal(false)}>{t.cancel}</button>
              <button style={{ flex: 1, background: "#3a5535", color: "#fff", border: "none", borderRadius: "10px", padding: "12px", cursor: "pointer", fontWeight: "700", fontSize: "14px" }} onClick={handleAddItem}>{t.add}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}