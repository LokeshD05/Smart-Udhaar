import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

      {/* ── Header ── */}

      {/* ── Row 1: Pending Amount (full width hero) ── */}
      <div className="card-full dashboard-card">
        <div className="card-full-left">
          <p className="card-label">Pending Amount</p>
        </div>
          <p className="card-value-large">
            ₹{summary.pendingAmount.toLocaleString()}
          </p>
        <div className="card-full-right">
          <div className="card-mini-stat">
            <span className="card-mini-label">Given</span>
            <span className="card-mini-value credit">
              ↑ ₹{summary.totalCredit.toLocaleString()}
            </span>
          </div>
          <div className="card-mini-stat">
            <span className="card-mini-label">Received</span>
            <span className="card-mini-value payment">
              ↓ ₹{summary.totalPayment.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ── Row 2: Stats grid ── */}
      <div className="cards-row">
        <div className="dashboard-card">
          <p className="card-label">Total Credit Given</p>
          <p className="card-value card-value--credit">₹{summary.totalCredit.toLocaleString()}</p>
        </div>
        <div className="dashboard-card">
          <p className="card-label">Total Payment Received</p>
          <p className="card-value card-value--payment">₹{summary.totalPayment.toLocaleString()}</p>
        </div>
        <div className="dashboard-card">
          <p className="card-label">Total Transactions</p>
          <p className="card-value">{summary.totalTransactions.toLocaleString()}</p>
        </div>
        <div className="dashboard-card">
          <p className="card-label">Active Customers</p>
          <p className="card-value">{summary.totalCustomers}</p>
        </div>
      </div>

      {/* ── Row 3: Top Debtors + Recent Transactions ── */}
      <div className="dashboard-bottom-row">

        {/* Top Debtors */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">Top Debtors</h3>
            <span className="panel-sub">Highest pending balances</span>
          </div>
          {summary.topDebtors.length === 0 ? (
            <p className="empty-text">No debtors found</p>
          ) : (
            <div className="debtor-list">
              {summary.topDebtors.map((d, i) => (
                <Link key={d.customerId} className="debtor-item" to={`/customers?customerId=${encodeURIComponent(d.customerId)}`}>
                  <div className="debtor-left">
                    <div className="debtor-rank">#{i + 1}</div>
                    <div className="debtor-avatar">
                      {d.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="debtor-name">{d.name}</span>
                  </div>
                  <span className={`debtor-amount ${d.debt > 0 ? "debt--positive" : "debt--clear"}`}>
                    {d.debt > 0 ? `₹${d.debt.toLocaleString()}` : "Cleared"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">Recent Transactions</h3>
            <span className="panel-sub">Last 5 entries</span>
          </div>
          {summary.recentTransactions.length === 0 ? (
            <p className="empty-text">No transactions yet</p>
          ) : (
            <div className="recent-list">
              {summary.recentTransactions.map((t) => (
                <Link key={t._id} className="recent-item" to={`/customers?customerId=${encodeURIComponent(t.customerId?._id || t.customerId)}`}>
                  <div className="recent-type">
                    <span className={`txn-badge ${t.type === "credit" ? "badge--credit" : "badge--payment"}`}>
                      {t.type}
                    </span>
                  </div>
                  <span className="recent-customer" title={t.customerName}>{t.customerName || "—"}</span>
                  <span className="recent-note" title={t.note}>{t.note || "—"}</span>
                  <span className="recent-time">
                    {new Date(t.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                    <span className={`recent-amount ${t.type === "credit" ? "balance--negative" : "balance--positive"}`}>
                      {t.type === "credit" ? "-" : "+"}₹{t.amount.toLocaleString()}
                    </span>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
