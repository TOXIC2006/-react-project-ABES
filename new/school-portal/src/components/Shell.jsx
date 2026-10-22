import { GraduationCap, LogOut } from 'lucide-react'

export default function Shell({
  navItems,
  active,
  onNavigate,
  title,
  subtitle,
  userName,
  roleLabel,
  onLogout,
  actions,
  children,
}) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="brand-name">School Portal</div>
            <div className="brand-sub">Management System</div>
          </div>
        </div>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`nav-item${active === item.key ? ' active' : ''}`}
              onClick={() => onNavigate(item.key)}
              aria-current={active === item.key ? 'page' : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="side-foot">
          <div className="user-chip">
            <div className="user-name">{userName}</div>
            <div className="user-role">{roleLabel}</div>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onLogout}
            aria-label="Log out"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar-title">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="topbar-actions">{actions}</div>
        </header>

        <nav className="mobile-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`nav-item${active === item.key ? ' active' : ''}`}
              onClick={() => onNavigate(item.key)}
              aria-current={active === item.key ? 'page' : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <main className="content">{children}</main>
      </div>
    </div>
  )
}
