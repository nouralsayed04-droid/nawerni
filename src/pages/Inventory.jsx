import { useState, useEffect } from "react";

function getDaysLeft(expiry) {
  return Math.ceil((new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24));
}
function getStatus(days) {
  if (days < 0) return { label: 'Expired', cls: 'expired' };
  if (days <= 7) return { label: days + 'd left', cls: 'urgent' };
  if (days <= 14) return { label: days + 'd left', cls: 'soon' };
  return { label: days + 'd left', cls: 'ok' };
}

// Fetches AI suggestion for a single item
async function fetchSuggestion(item) {
  const res = await fetch("http://localhost:3001/api/ai-suggestion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item })
  });
  const data = await res.json();
  return data.suggestion;
}

function AISuggestion({ item }) {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestion(item)
      .then(s => setSuggestion(s))
      .catch(() => setSuggestion("Could not load suggestion."))
      .finally(() => setLoading(false));
  }, [item.name]);

  return (
    <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
      {loading ? "Loading AI suggestion..." : suggestion ?? "No suggestion available."}
    </div>
  );
}

export default function Inventory({ items, removeItem }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? items : items.filter(i => i.cat === filter);

  return (
    <div>
      <div className="tabs">
        {['all','food','medicine','fluids','other'].map(f => (
          <button key={f} className={`tab ${filter===f?'active':''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      {filtered.length === 0
        ? <p style={{ fontSize: '13px', color: '#888' }}>No items here. Tap + to add!</p>
        : filtered.map((item, i) => {
            const d = getDaysLeft(item.expiry);
            const s = getStatus(d);
            return (
              <div key={i} className="item-card">
                <div className="item-info">
                  <div className="name">{item.name}</div>
                  <div className="meta">{item.cat} · qty {item.qty} · exp {item.expiry}</div>
                  {/* ✅ AI Suggestion added here */}
                  <AISuggestion item={item} />
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'6px' }}>
                  <span className={`badge ${s.cls}`}>{s.label}</span>
                  <button onClick={() => removeItem(i)} style={{ fontSize:'11px', background:'none', border:'none', color:'#A32D2D', cursor:'pointer' }}>Remove</button>
                </div>
              </div>
            );
          })
      }
    </div>
  );
}