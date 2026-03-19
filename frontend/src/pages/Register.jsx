import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", shopName: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-slash" />

      {/* Left — light branding */}
      <div className="register-left">
        <div className="register-brand">
          <div className="register-brand-icon">⚡</div>
          <div>
            <div className="register-brand-name">LedgerPro</div>
            <div className="register-brand-sub">Business Suite</div>
          </div>
        </div>

        <h1 className="register-left-title">
          Start managing<br /><span>smarter today</span>
        </h1>
        <p className="register-left-desc">
          Everything you need to run your business finances in one place.
        </p>

        <div className="register-features">
          <div className="register-feature">
            <div className="register-feature-dot" />
            <span className="register-feature-text">Track all customer balances</span>
          </div>
          <div className="register-feature">
            <div className="register-feature-dot" />
            <span className="register-feature-text">Manage transactions easily</span>
          </div>
          <div className="register-feature">
            <div className="register-feature-dot" />
            <span className="register-feature-text">Real-time dashboard insights</span>
          </div>
        </div>

        <div className="register-stats">
          <div>
            <div className="register-stat-value">2.4k</div>
            <div className="register-stat-label">Customers</div>
          </div>
          <div>
            <div className="register-stat-value">₹18M</div>
            <div className="register-stat-label">Tracked</div>
          </div>
          <div>
            <div className="register-stat-value">99%</div>
            <div className="register-stat-label">Uptime</div>
          </div>
        </div>
      </div>

      {/* Right — dark form */}
      <div className="register-right">
        <div className="register-form-wrap">
          <h2 className="register-form-title">Create account</h2>
          <p className="register-form-sub">Fill in your details below</p>

          <form onSubmit={handleSubmit}>
            <div className="register-row">
              <div className="register-field-group">
                <label className="register-label">Full Name</label>
                <input className="register-input" name="name" placeholder="John Doe" required onChange={handleChange} />
              </div>
              <div className="register-field-group">
                <label className="register-label">Phone Number</label>
                <input className="register-input" name="phone" placeholder="+91 98765 43210" required onChange={handleChange} />
              </div>
            </div>

            <div className="register-field-group">
              <label className="register-label">Shop Name</label>
              <input className="register-input" name="shopName" placeholder="My Business" required onChange={handleChange} />
            </div>

            <div className="register-field-group">
              <label className="register-label">Email Address</label>
              <input className="register-input" type="email" name="email" placeholder="you@example.com" required onChange={handleChange} />
            </div>

            <div className="register-field-group">
              <label className="register-label">Password</label>
              <input className="register-input" type="password" name="password" placeholder="••••••••" required onChange={handleChange} />
            </div>

            <button className="register-btn" type="submit">Create account</button>
          </form>

          <div className="register-divider">or</div>
          <p className="register-footer-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;