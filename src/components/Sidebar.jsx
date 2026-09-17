import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      icon: "⌂",
      path: "/dashboard",
    },
    {
      label: "Upload Image",
      icon: "⇧",
      path: "/upload",
    },
    {
      label: "My Uploads",
      icon: "▣",
      path: "/my-uploads",
    },
    {
      label: "Reports",
      icon: "▤",
      path: "/reports",
    },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">⬡</div>

        <div>
          <div className="logo-name">
            Safe<span>Infra</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <button
              key={item.label}
              type="button"
              className={`sidebar-item ${active ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="sidebar-bottom">
        <button
          type="button"
          className="sidebar-item logout"
          onClick={handleLogout}
        >
          <span className="sidebar-icon">↪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;