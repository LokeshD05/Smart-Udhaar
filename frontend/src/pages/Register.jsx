import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import PhoneInput from "../components/PhoneInput.jsx";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState("+91");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", shopName: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[0-9]{10}$/.test(form.phone)) return;
    try {
      await API.post("/auth/register", { ...form, phone: `${countryCode}${form.phone}` });
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
            <div className="register-brand-name">Smart Udhaar</div>
            <div className="register-brand-sub">Your digital udhaar ledger</div>
          </div>
        </div>

        <h1 className="register-left-title">
          Less paperwork.<br /><span>Clearer hisaab.</span>
        </h1>
        <p className="register-left-desc">
          Give your shop a simpler way to track udhaar. Keep customer accounts, payments, and pending balances together from day one.
        </p>

        <div className="register-features">
          <div className="register-feature">
            <div className="register-feature-dot" />
            <span className="register-feature-text">Know exactly what each customer owes</span>
          </div>
          <div className="register-feature">
            <div className="register-feature-dot" />
            <span className="register-feature-text">Record udhaar and repayments in a few clicks</span>
          </div>
          <div className="register-feature">
            <div className="register-feature-dot" />
            <span className="register-feature-text">See your shop's pending amount at a glance</span>
          </div>
        </div>

        <div className="register-stats">
          <div>
            <div className="register-stat-value">Customers</div>
            <div className="register-stat-label">Every account together</div>
          </div>
          <div>
            <div className="register-stat-value">Entries</div>
            <div className="register-stat-label">Every transaction recorded</div>
          </div>
          <div>
            <div className="register-stat-value">Balances</div>
            <div className="register-stat-label">Every rupee accounted for</div>
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
                <PhoneInput className="register-input" value={form.phone} onChange={(phone) => setForm((prev) => ({ ...prev, phone }))} countryCode={countryCode} onCountryCodeChange={setCountryCode} />
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
            Already have an account? <Link to="/login" viewTransition>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
