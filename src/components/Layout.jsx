import React from "react";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="app-layout">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Sidebar />

      <main className="main-content" id="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;