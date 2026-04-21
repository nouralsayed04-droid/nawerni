

export default function Donations() {
  const centers = [
    { name: '🏪 Saudi Food Bank', dist: '1.2 km away', addr: 'King Fahd Road, Riyadh', accepts: 'Food items only', lat: 24.7136, lng: 46.6753 },
    { name: '🏥 Red Crescent Society', dist: '2.8 km away', addr: 'Olaya District, Riyadh', accepts: 'Medicine & Food', lat: 24.6877, lng: 46.6860 },
    { name: '🤝 Ehsan Platform', dist: '4.1 km away', addr: 'Prince Mohammed Bin Abdulaziz Rd', accepts: 'All items', lat: 24.6941, lng: 46.6816 },
    { name: '🕌 Al Barr Charity', dist: '5.3 km away', addr: 'Al Malaz District, Riyadh', accepts: 'Food items only', lat: 24.6820, lng: 46.7240 },
  ];

  const navigate = (center) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div>
      <div style={{ background: '#e8f0e8', borderRadius: '12px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
        <div style={{ textAlign: 'center', color: '#2D5A3D' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🗺️</div>
          <div style={{ fontWeight: '500' }}>Nearby Donation Centers</div>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>Riyadh, Saudi Arabia</div>
        </div>
      </div>

      <div className="section-title">Donation Centers Near You</div>

      {centers.map((c, i) => (
        <div key={i} className="donation-card">
          <div style={{ fontWeight: '500' }}>{c.name}</div>
          <div style={{ fontSize: '12px', color: '#2D5A3D', marginTop: '2px' }}>{c.dist}</div>
          <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{c.addr}</div>
          <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>Accepts: {c.accepts}</div>
          <button className="donate-btn" onClick={() => navigate(c)}>📍 Navigate</button>
        </div>
      ))}
    </div>
  );
}