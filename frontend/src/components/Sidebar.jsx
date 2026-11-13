import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import "../styles/sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const [shopName, setShopName] = useState("My Business");

  useEffect(() => {
    let active = true;
    API.get("/auth/me")
      .then(({ data }) => {
        if (active) setShopName(data.shopName?.trim() || "My Business");
      })
      .catch(() => {
        // Keep the default when the profile is unavailable.
      });
    return () => { active = false; };
  }, []);

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        {/* <div className="sidebar-logo-icon">📒</div> */}
        <div>
          <h1 className="sidebar-title">Smart Udhaar</h1>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link--active" : ""}`}>
         Dashboard
        </NavLink>
        <NavLink to="/customers" className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link--active" : ""}`}>
           Customers
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link--active" : ""}`}>
           Transactions
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">S</div>
          <p className="sidebar-user-name">{shopName}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
}
