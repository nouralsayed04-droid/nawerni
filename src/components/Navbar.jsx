export default function Navbar({ page, setPage }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'scanner', label: 'Scan', icon: '📷' },
    { id: 'donations', label: 'Donate', icon: '📍' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
  ]
  return (
    <nav className="nav">
      {items.map(item => (
        <button
          key={item.id}
          className={`nav-item ${page === item.id ? 'active' : ''}`}
          onClick={() => setPage(item.id)}
        >
          <span style={{fontSize:'20px'}}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}