import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/login", form);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">

      {/* Left branding */}
      <div className="auth-left">
        <h1 className="auth-brand-name">Smart Udhaar</h1>
        <p className="auth-brand-sub">Your shop’s udhaar, all in one ledger.</p>
        <ul className="auth-brand-points" role="list">
          <li>Customer balances</li>
          <li>Repayments</li>
          <li>Transaction history</li>
        </ul>
      </div>

      {/* Diagonal gradient background */}
      <div className="auth-right-wrap" />

      {/* Right form */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <h2 className="auth-form-title">Welcome back</h2>
          <p className="auth-form-sub">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit}>
            <div className="auth-field-group">
              <label className="auth-label">Email address</label>
              <input
                className="auth-input"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                onChange={handleChange}
              />
            </div>

            <div className="auth-field-group">
              <label className="auth-label">Password</label>
              <input
                className="auth-input"
                type="password"
                name="password"
                placeholder="••••••••"
                required
                onChange={handleChange}
              />
            </div>

            <button className="auth-btn" type="submit">
              Sign in
            </button>
          </form>

          <div className="auth-divider">or</div>

          <p className="auth-footer-text">
            Don't have an account? <Link to="/register" viewTransition>Register</Link>
          </p>
        </div>
      </div>

    </div>
  );
}

export default Login;
