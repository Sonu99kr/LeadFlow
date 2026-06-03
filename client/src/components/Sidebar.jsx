export default function Sidebar({ activePage, onNavigate }) {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>LeadFlow</h1>
        <span>CRM Platform</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div
          style={{
            padding: "10px 12px",
            borderRadius: "var(--radius)",
            background: "var(--surface-2)",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-3)",
              marginBottom: 4,
            }}
          >
            Version
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--text-2)",
              fontWeight: 500,
            }}
          >
            LeadFlow v1.0
          </div>
        </div>
      </div>
    </aside>
  );
}
