import { useState, useRef, useEffect } from "react";

export default function Scanner({ addItem, setPage }) {
  const [name, setName] = useState('');
  const [cat, setCat] = useState('food');
  const [expiry, setExpiry] = useState('');
  const [qty, setQty] = useState(1);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }
      });
      streamRef.current = stream;
      setCameraActive(true);
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera permission denied. Please allow camera access.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else {
        setCameraError('Could not open camera: ' + err.message);
      }
    }
  };

  // Attach stream to video element after cameraActive is true and videoRef is rendered
  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(err => {
        setCameraError('Could not play video: ' + err.message);
      });
    }
  }, [cameraActive]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const simulate = () => {
    stopCamera();
    const samples = ['Milk', 'Paracetamol', 'Rice', 'Vitamin C', 'Yogurt'];
    const cats = ['food', 'medicine', 'food', 'medicine', 'food'];
    const idx = Math.floor(Math.random() * samples.length);
    const d = new Date();
    d.setDate(d.getDate() + Math.floor(Math.random() * 30) + 5);
    setName(samples[idx]);
    setCat(cats[idx]);
    setExpiry(d.toISOString().split('T')[0]);
    setQty(1);
  };

  const submit = () => {
    if (!name || !expiry) { alert('Please fill name and expiry date'); return; }
    stopCamera();
    addItem({ name, cat, expiry, qty: parseInt(qty) });
    setName(''); setExpiry(''); setQty(1);
    setPage('inventory');
  };

  return (
    <div>
      {/* Camera Box */}
      <div style={{
        background: '#1a1a1a',
        borderRadius: '12px',
        height: '240px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '12px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Always render video, just hide it when not active */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          style={{
            display: cameraActive ? 'block' : 'none',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {!cameraActive && (
          <div style={{ color: 'white', fontSize: '13px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>📷</div>
            {cameraError
              ? <div style={{ color: '#ff8080', fontSize: '12px', padding: '0 16px' }}>{cameraError}</div>
              : <div>Tap below to open camera</div>
            }
          </div>
        )}
      </div>

      {/* Camera Controls */}
      {!cameraActive ? (
        <button className="submit-btn" onClick={startCamera} style={{ marginBottom: '8px' }}>
          📷 Open Camera
        </button>
      ) : (
        <button className="submit-btn" onClick={stopCamera} style={{ marginBottom: '8px', background: '#c0392b' }}>
          ✕ Close Camera
        </button>
      )}

      <button className="submit-btn" onClick={simulate} style={{ marginBottom: '12px', background: '#555' }}>
        Simulate Scan
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