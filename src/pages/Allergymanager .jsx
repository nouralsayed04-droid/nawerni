import { useState, useEffect, useRef } from "react";

// Stores allergies in localStorage under key "nawerni_allergies"
// Export getAllergies() to use in your AI suggestion calls

export function getAllergies() {
  try {
    return JSON.parse(localStorage.getItem("nawerni_allergies") || "[]");
  } catch {
    return [];
  }
}

export default function AllergyManager({ isOpen, onClose }) {
  const [allergies, setAllergies] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  // Load saved allergies when panel opens
  useEffect(() => {
    if (isOpen) {
      setAllergies(getAllergies());
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const addAllergy = () => {
    const val = input.trim().toLowerCase();
    if (!val || allergies.includes(val)) return;
    setAllergies((prev) => [...prev, val]);
    setInput("");
  };

  const removeAllergy = (item) => {
    setAllergies((prev) => prev.filter((a) => a !== item));
  };

  const handleSave = () => {
    localStorage.setItem("nawerni_allergies", JSON.stringify(allergies));
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addAllergy();
    if (e.key === "Escape") onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 40,
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* Bottom sheet */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "white",
          borderRadius: "16px 16px 0 0",
          zIndex: 50,
          animation: "slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        {/* Handle bar */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 0" }}>
          <div style={{ width: 36, height: 4, background: "#e0e0e0", borderRadius: 2 }} />
        </div>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 16px",
            borderBottom: "0.5px solid #eee",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#FCEBEB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AlertIcon />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 15, margin: 0, color: "#1a1a1a" }}>
              My Allergies
            </p>
            <p style={{ fontSize: 12, color: "#888", margin: 0 }}>
              AI suggestions will avoid these ingredients
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              fontSize: 22,
              color: "#aaa",
              cursor: "pointer",
              lineHeight: 1,
              padding: 0,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 16 }}>
          {/* Chips */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              minHeight: 40,
              marginBottom: 14,
            }}
          >
            {allergies.length === 0 && (
              <p style={{ fontSize: 13, color: "#bbb", alignSelf: "center" }}>
                No allergies added yet
              </p>
            )}
            {allergies.map((item) => (
              <span
                key={item}
                style={{
                  background: "#FCEBEB",
                  border: "0.5px solid #F7C1C1",
                  color: "#791F1F",
                  borderRadius: 20,
                  padding: "4px 10px 4px 12px",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  textTransform: "capitalize",
                }}
              >
                {item}
                <button
                  onClick={() => removeAllergy(item)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#A32D2D",
                    cursor: "pointer",
                    fontSize: 15,
                    lineHeight: 1,
                    padding: 0,
                  }}
                  aria-label={`Remove ${item}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Input row */}
          <div style={{ display: "flex", gap: 8 }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. shellfish, soy, eggs..."
              style={{
                flex: 1,
                background: "#f5f5f5",
                border: "0.5px solid #ddd",
                borderRadius: 8,
                padding: "9px 12px",
                fontSize: 14,
                color: "#1a1a1a",
                outline: "none",
              }}
            />
            <button
              onClick={addAllergy}
              style={{
                background: "#A32D2D",
                border: "none",
                color: "white",
                padding: "9px 16px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Add
            </button>
          </div>

          {/* Info note */}
          <div
            style={{
              marginTop: 12,
              padding: "10px 12px",
              background: "#fdf4f4",
              borderRadius: 8,
              borderLeft: "2px solid #E24B4A",
              fontSize: 12,
              color: "#666",
              lineHeight: 1.5,
            }}
          >
            The AI will not suggest items containing your listed allergens when
            recommending donations or consumption options.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 16px 24px",
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "0.5px solid #ddd",
              color: "#666",
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              background: "#2d4a1e",
              border: "none",
              color: "white",
              padding: "8px 20px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save preferences
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>
    </>
  );
}

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="#E24B4A" strokeWidth="1.4" />
      <path d="M8 5v4M8 11v.5" stroke="#E24B4A" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}