import { useState } from "react";

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display:'inline-block',verticalAlign:'middle',marginRight:'6px'}}>
    <path d="M10 1.5L2 5.5V10C2 14.1 5.4 17.9 10 19C14.6 17.9 18 14.1 18 10V5.5L10 1.5Z" fill="#E8302A" fillOpacity="0.15"/>
    <path d="M10 1.5L2 5.5V10C2 14.1 5.4 17.9 10 19C14.6 17.9 18 14.1 18 10V5.5L10 1.5Z" stroke="#E8302A" strokeWidth="1.4"/>
    <text x="10" y="14.5" textAnchor="middle" fontSize="10" fontWeight="700" fill="#E8302A" fontFamily="sans-serif">!</text>
  </svg>
);

export default function Profile({ allergies, setAllergies }) {
  const [name, setName] = useState('');
  const [size, setSize] = useState('3-4 people');
  const allergyList = [
    {val:'nuts',label:'🥜 Nuts'},
    {val:'dairy',label:'🥛 Dairy'},
    {val:'gluten',label:'🌾 Gluten'},
    {val:'eggs',label:'🥚 Eggs'},
    {val:'shellfish',label:'🦐 Shellfish'},
    {val:'soy',label:'🫘 Soy'},
    {val:'fish',label:'🐟 Fish'},
    {val:'sesame',label:'🌱 Sesame'},
  ];

  const toggleAllergy = (val) => {
    setAllergies(prev =>
      prev.includes(val) ? prev.filter(a => a !== val) : [...prev, val]
    );
  };

  return (
    <div>
      <div className="profile-section">
        <h3>👤 My Profile</h3>
        <div className="form-group">
          <label>Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/>
        </div>
        <div className="form-group">
          <label>Household Size</label>
          <select value={size} onChange={e=>setSize(e.target.value)}>
            <option>1 person</option>
            <option>2 people</option>
            <option>3-4 people</option>
            <option>5+ people</option>
          </select>
        </div>
      </div>

      <div className="profile-section">
        <h3 style={{display:'flex',alignItems:'center'}}>
          <ShieldIcon /> My Allergies
        </h3>
        <p style={{fontSize:'12px',color:'#888',marginBottom:'8px'}}>We won't suggest products containing these</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
          {allergyList.map(a => (
            <button
              key={a.val}
              className={`allergy-tag ${allergies.includes(a.val)?'selected':''}`}
              onClick={() => toggleAllergy(a.val)}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="profile-section">
        <h3>🔔 Notifications</h3>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
          <span style={{fontSize:'13px'}}>Expiry alerts (7 days before)</span>
          <input type="checkbox" defaultChecked style={{width:'auto'}}/>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontSize:'13px'}}>Donation reminders</span>
          <input type="checkbox" defaultChecked style={{width:'auto'}}/>
        </div>
      </div>

      <button className="submit-btn" onClick={() => alert(name ? 'Profile saved! Welcome, '+name+'!' : 'Profile saved!')}>
        Save Profile
      </button>
    </div>
  )
}