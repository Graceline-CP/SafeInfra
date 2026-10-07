import { NavLink, useNavigate } from "react-router-dom";

const navigationItems = [
  { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
  { label: "Upload Image", path: "/upload", icon: "upload" },
  { label: "My Uploads", path: "/my-uploads", icon: "uploads" },
  { label: "Reports", path: "/reports", icon: "reports" },
];

const iconPaths = {
  dashboard: "M3 3h8v8H3z M13 3h8v5h-8z M13 10h8v11h-8z M3 13h8v8H3z",
  upload: "M12 16V4m0 0L7 9m5-5 5 5M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5",
  uploads: "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z M4 5.5v15 M8 7h8 M8 10h8",
  reports: "M6 3h9l4 4v14H6z M14 3v5h5 M9 12h7 M9 16h7",
  logout: "M10 17l5-5-5-5m5 5H3m9-9h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6",
};

function SidebarIcon({ name }) {
  return (
    <span className="sidebar-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path d={iconPaths[name]} />
      </svg>
    </span>
  );
}

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <aside className="sidebar" aria-label="Application navigation">
      <div className="sidebar-logo">
        <div className="logo-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" />
            <path d="m8.5 12 2.2 2.2 4.8-5" />
          </svg>
        </div>
        <div className="logo-name">Safe<span>Infra</span></div>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            title={item.label}
            className={({ isActive }) => `sidebar-item${isActive ? " active" : ""}`}
          >
            <SidebarIcon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button
          type="button"
          className="sidebar-item logout"
          aria-label="Log out"
          title="Log out"
          onClick={handleLogout}
        >
          <SidebarIcon name="logout" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;