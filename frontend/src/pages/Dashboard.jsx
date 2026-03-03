import { useEffect, useState } from "react";
import API from "../utils/api.js";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/dashboard")
      .then((res) => setSummary(res.data))
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="dashboard"><p className="loading-text">Loading...</p></div>;
  if (error) return <div className="dashboard"><p className="error-text">{error}</p></div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Dashboard</h2>
        <p className="dashboard-sub">Here's your business summary</p>
      </div>

      {/* ── Row 1: Total Credit and Total Payment ── */}
      <div className="cards-row">
        <div className="dashboard-card card--green">
          <p className="card-label">Total Credit Given</p>
          <p className="card-value">₹{summary.totalCredit.toLocaleString()}</p>
          <p className="card-hint">Money you gave to customers</p>
        </div>
        <div className="dashboard-card card--blue">
          <p className="card-label">Total Payment Received</p>
          <p className="card-value">₹{summary.totalPayment.toLocaleString()}</p>
          <p className="card-hint">Money customers paid back</p>
        </div>
      </div>

      {/* ── Row 2: Pending Amount (big, full width) ── */}
      <div className="card-full dashboard-card card--orange">
        <div className="card-full-left">
          <p className="card-label">Pending Amount</p>
          <p className="card-hint">Total credit minus total payments</p>
        </div>
        <p className="card-value-large">₹{summary.pendingAmount.toLocaleString()}</p>
      </div>

      {/* ── Row 3: Transactions and Customers ── */}
      <div className="cards-row">
        <div className="dashboard-card card--indigo">
          <p className="card-label">Total Transactions</p>
          <p className="card-value">{summary.totalTransactions.toLocaleString()}</p>
          <p className="card-hint">All entries recorded</p>
        </div>
        <div className="dashboard-card card--purple">
          <p className="card-label">Active Customers</p>
          <p className="card-value">{summary.totalCustomers}</p>
          <p className="card-hint">Customers with transactions</p>
        </div>
      </div>
    </div>
  );
}