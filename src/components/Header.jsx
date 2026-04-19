import { useState } from "react";

export default function Header({ items = [], lang, setLang }) {
  const [showPanel, setShowPanel] = useState(false);
  const [permission, setPermission] = useState(Notification.permission);

  const isAr = lang === 'ar';

  const text = {
    en: {
      title: 'Nawerni', slogan: 'Track, donate, never waste',
      notifications: 'Notifications',
      enable: 'Enable browser notifications to get expiry alerts',
      enableBtn: 'Enable Notifications',
      blocked: '❌ Notifications blocked. Allow them in browser settings.',
      noExpiring: '✅ No items expiring soon!',
      daysLeft: 'days left',
    },
    ar: {
      title: 'نوِّرني', slogan: 'تتبع، تبرع، لا تهدر',
      notifications: 'الإشعارات',
      enable: 'فعّل الإشعارات لتلقي تنبيهات انتهاء الصلاحية',
      enableBtn: 'تفعيل الإشعارات',
      blocked: '❌ الإشعارات محظورة. يرجى السماح بها في إعدادات المتصفح.',
      noExpiring: '✅ لا توجد منتجات تنتهي قريباً!',
      daysLeft: 'أيام متبقية',
    }
  };

  const t = text[lang] || text.en;

  const getDaysLeft = (expiry) =>
    Math.ceil((new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24));

  const expiringSoon = items.filter(i => {
    const d = getDaysLeft(i.expiry);
    return d >= 0 && d <= 7;
  });

  const getSuggestion = (cat, name) => {
    if (isAr) {
      if (cat === 'food') return `💡 استخدم ${name} اليوم أو تبرع به لبنك الطعام السعودي!`;
      if (cat === 'medicine') return `💡 استخدم ${name} إذا احتجته أو تبرع به للهلال الأحمر.`;
      return `💡 استخدم ${name} قريباً أو تبرع به لمركز خيري قريب.`;
    }
    if (cat === 'food') return `💡 Cook ${name} today, freeze it, or donate to Saudi Food Bank!`;
    if (cat === 'medicine') return `💡 Use ${name} if needed or donate to Red Crescent Society.`;
    return `💡 Use ${name} soon or donate to a nearby charity.`;
  };

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      expiringSoon.forEach(item => {
        const d = getDaysLeft(item.expiry);
        new Notification(`⚠️ ${item.name}`, {
          body: getSuggestion(item.cat, item.name),
          icon: '/favicon.ico',
        });
      });
    }
  };

  return (
    <div className="header" style={{ position: 'relative', direction: isAr ? 'rtl' : 'ltr' }}>
      <div>
        <h1>{t.title}</h1>
        <p>{t.slogan}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Language Toggle Button */}
        <button
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          style={{
            background: 'rgba(255,255,255,0.2)', color: 'white',
            border: '1px solid rgba(255,255,255,0.5)', borderRadius: '20px',
            padding: '5px 14px', fontSize: '13px', cursor: 'pointer', fontWeight: '500'
          }}>
          {lang === 'en' ? 'العربية' : 'English'}
        </button>

        {/* Bell */}
        <div style={{ position: 'relative', cursor: 'pointer' }}
          onClick={() => setShowPanel(!showPanel)}>
          <span style={{ fontSize: '24px' }}>🔔</span>
          {expiringSoon.length > 0 && (
            <span style={{
              position: 'absolute', top: '-4px', right: '-4px',
              background: '#E24B4A', color: 'white', borderRadius: '50%',
              width: '16px', height: '16px', fontSize: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '600'
            }}>
              {expiringSoon.length}
            </span>
          )}
        </div>
      </div>

      {/* Overlay */}
      {showPanel && (
        <div
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }}
          onClick={() => setShowPanel(false)}
        />
      )}

      {/* Notification Panel */}
      {showPanel && (
        <div style={{
          position: 'absolute', top: '60px',
          right: isAr ? 'auto' : '0', left: isAr ? '0' : 'auto',
          background: 'white', borderRadius: '12px', width: '280px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 100,
          padding: '12px', color: '#333', direction: isAr ? 'rtl' : 'ltr'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontWeight: '500', fontSize: '14px', color: '#2D5A3D' }}>
              🔔 {t.notifications}
            </div>
            <button onClick={() => setShowPanel(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#888', padding: '0 4px' }}>
              ✕
            </button>
          </div>

          {permission !== 'granted' && (
            <div style={{ background: '#fff8e1', borderRadius: '8px', padding: '10px', marginBottom: '10px', fontSize: '12px' }}>
              <div style={{ marginBottom: '6px', color: '#854F0B' }}>{t.enable}</div>
              {permission === 'denied'
                ? <div style={{ fontSize: '12px', color: '#A32D2D' }}>{t.blocked}</div>
                : <button onClick={requestPermission} style={{
                    background: '#2D5A3D', color: 'white', border: 'none',
                    borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer'
                  }}>{t.enableBtn}</button>
              }
            </div>
          )}

          {expiringSoon.length === 0 ? (
            <div style={{ fontSize: '13px', color: '#888', textAlign: 'center', padding: '10px 0' }}>
              {t.noExpiring}
            </div>
          ) : (
            expiringSoon.map((item, i) => {
              const d = getDaysLeft(item.expiry);
              return (
                <div key={i} style={{ background: '#FCEBEB', borderRadius: '8px', padding: '10px', marginBottom: '8px', fontSize: '12px' }}>
                  <div style={{ fontWeight: '500', color: '#A32D2D' }}>
                    ⚠️ {item.name} — {d} {t.daysLeft}
                  </div>
                  <div style={{ color: '#666', marginTop: '4px' }}>
                    {getSuggestion(item.cat, item.name)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}