import { useEffect, useState } from "react";
import API from "../utils/api.js";
import "../styles/Transactions.css";

const FILTERS = ["All", "Today", "This Week", "This Month", "Custom"];

function getStartOf(filter) {
  const now = new Date();
  if (filter === "Today") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (filter === "This Week") {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(now.getFullYear(), now.getMonth(), diff);
  }
  if (filter === "This Month") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  return null;
}

function formatGroupDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  useEffect(() => {
    API.get("/transactions")
      .then((res) => setTransactions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const applyFilter = (t) => {
    const date = new Date(t.createdAt);
    if (filter === "All") return true;
    if (filter === "Custom") {
      const from = customFrom ? new Date(customFrom) : null;
      const to = customTo ? new Date(customTo + "T23:59:59") : null;
      if (from && date < from) return false;
      if (to && date > to) return false;
      return true;
    }
    const start = getStartOf(filter);
    return date >= start;
  };

  const filtered = transactions
    .filter(applyFilter)
    .filter((t) =>
      t.note?.toLowerCase().includes(search.toLowerCase()) ||
      t.type.includes(search.toLowerCase()) ||
      t.customerId?.name?.toLowerCase().includes(search.toLowerCase())
    );

  // Group by date
  const grouped = filtered.reduce((acc, t) => {
    const dateKey = new Date(t.createdAt).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(t);
    return acc;
  }, {});

  // Sort groups newest first
  const sortedGroups = Object.entries(grouped).sort(
    (a, b) => new Date(b[0]) - new Date(a[0])
  );

  // Summary
  const totalCredit = filtered
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalPayment = filtered
    .filter((t) => t.type !== "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="transactions-page">

      {/* Header */}
      <div className="transactions-header">
        <div>
          <h2 className="transactions-title">All Transactions</h2>
          <p className="transactions-sub">Complete history across all customers</p>
        </div>
        <input
          type="text"
          placeholder="Search by name, type, note..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Filter bar */}
      <div className="txn-filter-bar">
        <div className="txn-filter-pills">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`txn-filter-pill ${filter === f ? "txn-filter-pill--active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {filter === "Custom" && (
          <div className="txn-custom-range">
            <input
              type="date"
              className="txn-date-input"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
            />
            <span className="txn-range-sep">to</span>
            <input
              type="date"
              className="txn-date-input"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
            />
          </div>
        )}

        {/* Summary pills */}
        <div className="txn-summary">
          <span className="txn-summary-pill txn-summary--credit">
            ↑ ₹{totalCredit.toLocaleString()}
          </span>
          <span className="txn-summary-pill txn-summary--payment">
            ↓ ₹{totalPayment.toLocaleString()}
          </span>
          <span className="txn-summary-pill txn-summary--count">
            {filtered.length} txns
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="txn-table">
        <div className="txn-table-head">
          <span>Type</span>
          <span>Customer</span>
          <span>Note</span>
          <span>Time</span>
          <span>Amount</span>
        </div>

        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="empty-text">No transactions found</p>
        ) : (
          sortedGroups.map(([dateKey, txns]) => (
            <div key={dateKey}>
              {/* Date group header */}
              <div className="txn-date-group">
                <span className="txn-date-label">{formatGroupDate(dateKey)}</span>
                <span className="txn-date-count">{txns.length} transactions</span>
              </div>

              {txns
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((t) => (
                  <div key={t._id} className="txn-table-row">
                    <span>
                      <span className={`txn-badge ${t.type === "credit" ? "badge--credit" : "badge--payment"}`}>
                        {t.type}
                      </span>
                    </span>
                    <span className="txn-table-cell">{t.customerId?.name || "—"}</span>
                    <span className="txn-table-cell muted">{t.note || "—"}</span>
                    <span className="txn-table-cell muted">
                      {new Date(t.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                    <span className={`txn-table-cell ${t.type === "credit" ? "balance--positive" : "balance--negative"}`}>
                      {t.type === "credit" ? "+" : "-"}₹{t.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}