import { useEffect, useState } from "react";
import API from "../utils/api.js";
import "../styles/Transactions.css";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

//   useEffect(() => {
//     API.get("/transactions")
//       .then((res) => setTransactions(res.data))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);
useEffect(() => {
  API.get("/transactions")
    .then((res) => {
      console.log("status:", res.status);
      console.log("data:", res.data);
      console.log("length:", res.data.length);
      setTransactions(res.data);
    })
    .catch((err) => {
      console.log("error status:", err.response?.status);
      console.log("error data:", err.response?.data);
    })
    .finally(() => setLoading(false));
}, []);

  const filtered = transactions.filter(
    (t) =>
      t.note?.toLowerCase().includes(search.toLowerCase()) ||
      t.type.includes(search.toLowerCase()) ||
      t.customerId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="transactions-page">
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

      <div className="txn-table">
        <div className="txn-table-head">
          <span>Type</span>
          <span>Customer</span>
          <span>Note</span>
          <span>Date & Time</span>
          <span>Amount</span>
        </div>

        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="empty-text">No transactions found</p>
        ) : (
          filtered.map((t) => (
            <div key={t._id} className="txn-table-row">
              <span>
                <span className={`txn-badge ${t.type === "credit" ? "badge--credit" : "badge--payment"}`}>
                  {t.type}
                </span>
              </span>
              <span className="txn-table-cell">{t.customerId?.name || "—"}</span>
              <span className="txn-table-cell muted">{t.note || "—"}</span>
              <span className="txn-table-cell muted">
                {new Date(t.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                })}
                {" "}
                {new Date(t.createdAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit", minute: "2-digit",
                })}
              </span>
              <span className={`txn-table-cell ${t.type === "credit" ? "balance--positive" : "balance--negative"}`}>
                {t.type === "credit" ? "+" : "-"}₹{t.amount.toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}