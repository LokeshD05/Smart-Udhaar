import { useEffect, useState } from "react";
import API from "../utils/api.js";
import TransactionTable from "../components/TransactionTable.jsx";
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

export default function Transactions({ customerTransactions, customerLoading, customerName }) {
  const embedded = customerTransactions !== undefined;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  useEffect(() => {
    if (embedded) return;
    API.get("/transactions")
      .then((res) => setTransactions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [embedded]);

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

  const filtered = (embedded ? customerTransactions : transactions)
    .filter(applyFilter)
    .filter((t) =>
      t.note?.toLowerCase().includes(search.toLowerCase()) ||
      t.type.includes(search.toLowerCase()) ||
      t.customerId?.name?.toLowerCase().includes(search.toLowerCase())
    );

  // Summary
  const totalCredit = filtered
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalPayment = filtered
    .filter((t) => t.type !== "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className={embedded ? "customer-transactions-content" : "transactions-page"}>

      {/* Header */}
      <div className="transactions-header">
        {!embedded && <div>
          <h2 className="transactions-title">{embedded ? "Transactions" : "All Transactions"}</h2>
          <p className="transactions-sub">{embedded ? `Complete history for ${customerName}` : "Complete history across all customers"}</p>
        </div>}
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
      <TransactionTable transactions={filtered} loading={embedded ? customerLoading : loading} customerName={customerName} hideCustomer={embedded} />
    </div>
  );
}
