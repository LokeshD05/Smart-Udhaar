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

      {/* ── Header ── */}
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Dashboard</h2>
          <p className="dashboard-sub">Here's your business summary</p>
        </div>
      </div>

      {/* ── Row 1: Pending Amount (full width hero) ── */}
      <div className="card-full dashboard-card">
        <div className="card-full-left">
          <p className="card-label">Pending Amount</p>
          <p className="card-value-large">
            ₹{summary.pendingAmount.toLocaleString()}
          </p>
          <p className="card-hint">Total credit minus total payments received</p>
        </div>
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
          <p className="card-value">₹{summary.totalCredit.toLocaleString()}</p>
          <p className="card-hint">Money you gave to customers</p>
        </div>
        <div className="dashboard-card">
          <p className="card-label">Total Payment Received</p>
          <p className="card-value">₹{summary.totalPayment.toLocaleString()}</p>
          <p className="card-hint">Money customers paid back</p>
        </div>
        <div className="dashboard-card">
          <p className="card-label">Total Transactions</p>
          <p className="card-value">{summary.totalTransactions.toLocaleString()}</p>
          <p className="card-hint">All entries recorded</p>
        </div>
        <div className="dashboard-card">
          <p className="card-label">Active Customers</p>
          <p className="card-value">{summary.totalCustomers}</p>
          <p className="card-hint">Customers with transactions</p>
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
                <div key={d.customerId} className="debtor-item">
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
                </div>
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
                <div key={t._id} className="recent-item">
                  <div className="recent-left">
                    <span className={`txn-badge ${t.type === "credit" ? "badge--credit" : "badge--payment"}`}>
                      {t.type}
                    </span>
                    <span className="recent-note">{t.note || "—"}</span>
                  </div>
                  <div className="recent-right">
                    <span className={`recent-amount ${t.type === "credit" ? "balance--positive" : "balance--negative"}`}>
                      {t.type === "credit" ? "+" : "-"}₹{t.amount.toLocaleString()}
                    </span>
                    <span className="recent-date">
                      {new Date(t.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}