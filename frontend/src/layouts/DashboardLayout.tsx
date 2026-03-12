import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './layouts.css'

type DashboardRole = 'admin' | 'company' | 'freelancer'

interface DashboardLayoutProps {
  role: DashboardRole
}

export function DashboardLayout({ role }: DashboardLayoutProps) {
  const { logout } = useAuth()
  const navItems =
    role === 'admin'
      ? [
          { to: '/admin/overview', label: 'Overview' },
          { to: '/admin/users', label: 'Users' },
        ]
      : role === 'company'
        ? [
            { to: '/company/tasks', label: 'My Tasks' },
            { to: '/company/tasks/new', label: 'Create Task' },
          ]
        : [
            { to: '/freelancer/tasks', label: 'Browse Tasks' },
            { to: '/freelancer/my-bids', label: 'My Bids' },
            { to: '/freelancer/my-work', label: 'My Work' },
          ]

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar glass" style={{ borderRadius: 0, borderTop: 0, borderBottom: 0, borderLeft: 0 }}>
        <div style={{ padding: '2rem' }}>
          <h2 className="dashboard-brand">
            {role.toUpperCase()}
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginTop: '0.25rem' }}>DASHBOARD</p>
        </div>
        
        <nav className="dashboard-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item-active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to logout?')) {
                logout()
              }
            }} 
            className="nav-item logout-button"
            style={{ 
              marginTop: 'auto', 
              background: 'none', 
              border: 'none', 
              textAlign: 'left', 
              cursor: 'pointer',
              color: '#f87171'
            }}
          >
            Logout
          </button>
        </nav>
      </aside>
      
      <main className="dashboard-content">
        <div className="content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

