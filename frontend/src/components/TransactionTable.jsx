import "../styles/Transactions.css";

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

export default function TransactionTable({ transactions, loading, customerName, hideCustomer = false }) {
  // Group by date
  const grouped = transactions.reduce((acc, t) => {
    const dateKey = new Date(t.createdAt).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(t);
    return acc;
  }, {});

  // Sort groups newest first
  const sortedGroups = Object.entries(grouped).sort(
    (a, b) => new Date(b[0]) - new Date(a[0])
  );

  return (
      <div className={`txn-table${hideCustomer ? " txn-table--customer-history" : ""}`}>
        <div className="txn-table-head">
          <span>Type</span>
          {!hideCustomer && <span>Customer</span>}
          <span>Note</span>
          <span>Time</span>
          <span>Amount</span>
        </div>

        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : transactions.length === 0 ? (
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
                    {!hideCustomer && <span className="txn-table-cell">{customerName || t.customerId?.name || "—"}</span>}
                    <span className="txn-table-cell muted">{t.note || "—"}</span>
                    <span className="txn-table-cell muted">
                      {new Date(t.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                    <span className={`txn-table-cell ${t.type === "credit" ? "balance--negative" : "balance--positive"}`}>
                      {t.type === "credit" ? "+" : "-"}₹{t.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          ))
        )}
      </div>
  );
}
