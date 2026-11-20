import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/MainLayout.css";

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);

  function closeMenu() {
    setMenuOpen(false);
    menuButton.current?.focus();
  }

  useEffect(() => {
    if (!menuOpen) return;

    const desktop = window.matchMedia("(min-width: 769px)");
    const handleResize = (event) => {
      if (event.matches) setMenuOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
    };
    desktop.addEventListener("change", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      desktop.removeEventListener("change", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <div className="main-layout">
      <header className="mobile-header">
        <button
          ref={menuButton}
          type="button"
          className="mobile-menu-button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="main-sidebar"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <span>Smart Udhaar</span>
      </header>
      {menuOpen && <div className="mobile-menu-backdrop" onClick={closeMenu} aria-hidden="true" />}
      <Sidebar open={menuOpen} onNavigate={menuOpen ? closeMenu : undefined} />
      <main className="main-content" inert={menuOpen}>
        <Outlet />
      </main>
    </div>
  );
}
