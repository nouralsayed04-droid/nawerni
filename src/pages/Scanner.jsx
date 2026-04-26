import { useState, useEffect } from "react";

export default function Scanner({ addItem, setPage }) {
  const [name, setName] = useState('');
  const [cat, setCat] = useState('food');
  const [expiry, setExpiry] = useState('');
  const [qty, setQty] = useState(1);
  const [scanPreview, setScanPreview] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleCapture = async (e) => {
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
        const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3001";
        const res = await fetch(`${apiBase}/api/scan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64Data, mediaType })
        });
        const data = await res.json();
        setScanResult(data);
        if (data.productName) setName(data.productName);
        if (data.expiryDate) setExpiry(data.expiryDate);
      } catch {
        setScanResult({ productName: "", expiryDate: "", barcode: "" });
      }
      setScanLoading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const submit = () => {
    if (!name || !expiry) { alert('Please fill name and expiry date'); return; }
    addItem({ name, cat, expiry, qty: parseInt(qty) });
    setName(''); setExpiry(''); setQty(1);
    setScanPreview(null); setScanResult(null);
    setPage('inventory');
  };

  return (
    <div>
      {/* Camera Preview Box */}
      <div style={{ background: '#1a1a1a', borderRadius: '12px', height: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', overflow: 'hidden', position: 'relative' }}>
        {scanPreview ? (
          <img src={scanPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ color: 'white', fontSize: '13px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>📷</div>
            <div>Tap below to open camera</div>
          </div>
        )}
      </div>

      {/* Scanning status */}
      {scanLoading && (
        <div style={{ background: '#e8f5e9', borderRadius: '10px', padding: '12px 16px', marginBottom: '12px', textAlign: 'center', fontSize: '14px', color: '#2d6a2d', fontWeight: '600' }}>
          🤖 Reading product info...
        </div>
      )}

      {/* Scan result */}
      {scanResult && !scanLoading && (
        <div style={{ background: '#e8f5e9', borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#2d6a2d', marginBottom: '6px' }}>✅ Product detected!</div>
          {scanResult.productName && <div style={{ fontSize: '13px', color: '#444' }}>📦 <strong>Name:</strong> {scanResult.productName}</div>}
          {scanResult.expiryDate && <div style={{ fontSize: '13px', color: '#444', marginTop: '4px' }}>📅 <strong>Expiry:</strong> {scanResult.expiryDate}</div>}
          {scanResult.barcode && <div style={{ fontSize: '13px', color: '#444', marginTop: '4px' }}>🔢 <strong>Barcode:</strong> {scanResult.barcode}</div>}
        </div>
      )}

      {/* Camera input */}
      <input id="cameraInput" type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleCapture} />
      <button className="submit-btn" onClick={() => { setScanPreview(null); setScanResult(null); document.getElementById('cameraInput').click(); }} style={{ marginBottom: '8px' }}>
        📷 Open Camera
      </button>

      <div style={{ textAlign: 'center', fontSize: '13px', color: '#888', marginBottom: '16px' }}>— or add manually —</div>

      <div className="form-group">
        <label>Product Name</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Milk, Paracetamol" />
      </div>
      <div className="form-group">
        <label>Category</label>
        <select value={cat} onChange={e => setCat(e.target.value)}>
          <option value="food">Food</option>
          <option value="medicine">Medicine</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="form-group">
        <label>Expiry Date</label>
        <input type="date" value={expiry} onChange={e => setExpiry(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Quantity</label>
        <input type="number" value={qty} onChange={e => setQty(e.target.value)} min="1" />
      </div>
      <button className="submit-btn" onClick={submit}>Add Item</button>
    </div>
  );
}