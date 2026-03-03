import { useEffect, useState } from "react";
import API from "../utils/api.js";
import "../styles/customers.css";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingTxn, setLoadingTxn] = useState(false);
  const [search, setSearch] = useState("");

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", balance: "" });
  const [adding, setAdding] = useState(false);

  const [showTxnModal, setShowTxnModal] = useState(false);
  const [txnForm, setTxnForm] = useState({ amount: "", type: "credit", note: "" });
  const [addingTxn, setAddingTxn] = useState(false);

  useEffect(() => {
    // API.get("/customers")
    //     .then((res) => setCustomers(res.data))
    //     .catch(console.error)
    //     .finally(() => setLoadingCustomers(false));
    API.get("/customers")
      .then((res) => {
        console.log("customers data:", res.data);
        setCustomers(res.data);
      })
      .catch((err) => {
        console.log("error:", err.response?.status, err.response?.data);
      })
      .finally(() => setLoadingCustomers(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoadingTxn(true);
    API.get(`/transactions/${selected._id}`)
      .then((res) => setTransactions(res.data))
      .catch(console.error)
      .finally(() => setLoadingTxn(false));
  }, [selected]);

  const handleAddCustomer = async () => {
    if (!form.name.trim()) return;
    setAdding(true);
    try {
      const res = await API.post("/customers", form);
      setCustomers((prev) => [res.data, ...prev]);
      setForm({ name: "", phone: "", address: "", balance: "" });
      setShowCustomerModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleAddTransaction = async () => {
    if (!txnForm.amount || !selected) return;
    setAddingTxn(true);
    try {
      const res = await API.post("/transactions", {
        customerId: selected._id,
        ...txnForm,
        amount: Number(txnForm.amount),
      });
      setTransactions((prev) => [res.data, ...prev]);
      const delta = txnForm.type === "credit" ? Number(txnForm.amount) : -Number(txnForm.amount);
      setCustomers((prev) =>
        prev.map((c) => c._id === selected._id ? { ...c, balance: c.balance + delta } : c)
      );
      setSelected((prev) => ({ ...prev, balance: prev.balance + delta }));
      setTxnForm({ amount: "", type: "credit", note: "" });
      setShowTxnModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setAddingTxn(false);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  return (
    <div className="customers-layout">

      {/* ── Customer List Panel ── */}
      <div className="customers-panel">
        <div className="customers-panel-header">
          <div className="customers-panel-title-row">
            <h1 className="customers-panel-title">Customers</h1>
            <button className="btn-primary" onClick={() => setShowCustomerModal(true)}>+ Add</button>
          </div>
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="customers-list">
          {loadingCustomers ? (
            <p className="loading-text">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="empty-text">No customers found</p>
          ) : (
            filtered.map((c) => (
              <button
                key={c._id}
                className={`customer-item ${selected?._id === c._id ? "customer-item--active" : ""}`}
                onClick={() => setSelected(c)}
              >
                <div className="customer-item-left">
                  <div className="customer-avatar">{c.name[0].toUpperCase()}</div>
                  <div>
                    <p className="customer-name">{c.name}</p>
                    {c.phone && <p className="customer-phone">{c.phone}</p>}                                {/* isn't phone number required in backend why checking && */}
                  </div>
                </div>
                <div className="customer-balance-wrap">
                  <p className={`customer-balance ${c.balance >= 0 ? "balance--positive" : "balance--negative"}`}>  {/* why do we even checking negative*/ }
                    ₹{Math.abs(c.balance).toLocaleString()}
                  </p>
                  <p className="balance-label">{c.balance >= 0 ? "to receive" : "to pay"}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Transactions Panel ── */}
      <div className="txn-panel">
        {!selected ? (
          <div className="empty-state">
            <p className="empty-title">Select a customer</p>
            <p className="empty-sub">to view their transactions</p>
          </div>
        ) : (
          <>
            <div className="txn-header">
              <div className="txn-header-left">
                <div className="txn-avatar">{selected.name[0].toUpperCase()}</div>
                <div>
                  <h3 className="txn-customer-name">{selected.name}</h3>
                  <div className="txn-customer-meta">
                    {selected.phone && <span>{selected.phone}</span>}
                    {selected.address && <span>{selected.address}</span>}
                  </div>
                </div>
              </div>
              <div className="txn-header-right">
                <div>
                  <p className="txn-balance-label">Net Balance</p>
                  <p className={`txn-balance-value ${selected.balance >= 0 ? "balance--positive" : "balance--negative"}`}>
                    ₹{Math.abs(selected.balance).toLocaleString()}
                  </p>
                  <p className="txn-balance-sublabel">{selected.balance >= 0 ? "you will receive" : "you will pay"}</p>
                </div>
                <button className="btn-primary" onClick={() => setShowTxnModal(true)}>+ Add Entry</button>
              </div>
            </div>

            <div className="txn-list">
              {loadingTxn ? (
                <p className="loading-text">Loading transactions...</p>
              ) : transactions.length === 0 ? (
                <p className="empty-text">No transactions yet</p>
              ) : (
                transactions.map((t) => (
                  <div key={t._id} className="txn-item">
                    <div className="txn-item-left">
                      <div className={`txn-badge ${t.type === "credit" ? "badge--credit" : "badge--payment"}`}>
                        {t.type === "credit" ? "Credit" : "Payment"}
                      </div>
                      {t.note && <p className="txn-note">{t.note}</p>}
                    </div>
                    <div className="txn-item-right">
                      <p className={`txn-amount ${t.type === "credit" ? "balance--positive" : "balance--negative"}`}>
                        {t.type === "credit" ? "+" : "-"}₹{t.amount.toLocaleString()}
                      </p>
                      <p className="txn-date">
                        {new Date(t.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Add Customer Modal ── */}
      {showCustomerModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Add Customer</h3>
              <button className="modal-close" onClick={() => setShowCustomerModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <input type="text" placeholder="Customer name *" value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="modal-input" />
              <input type="tel" placeholder="Phone number" value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="modal-input" />
              <input type="text" placeholder="Address" value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} className="modal-input" />
              <input type="number" placeholder="Opening balance (₹)" value={form.balance}
                onChange={(e) => setForm((p) => ({ ...p, balance: e.target.value }))} className="modal-input" />
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowCustomerModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddCustomer} disabled={adding || !form.name.trim()}>
                {adding ? "Adding..." : "Add Customer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Transaction Modal ── */}
      {showTxnModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">New Entry — {selected?.name}</h3>
              <button className="modal-close" onClick={() => setShowTxnModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="txn-type-toggle">
                <button
                  onClick={() => setTxnForm((p) => ({ ...p, type: "credit" }))}
                  className={`toggle-btn ${txnForm.type === "credit" ? "toggle--credit" : "toggle--inactive"}`}
                >
                  Credit (Give)
                </button>
                <button
                  onClick={() => setTxnForm((p) => ({ ...p, type: "payment" }))}
                  className={`toggle-btn ${txnForm.type === "payment" ? "toggle--payment" : "toggle--inactive"}`}
                >
                  Payment (Got)
                </button>
              </div>
              <input type="number" placeholder="Amount (₹) *" value={txnForm.amount}
                onChange={(e) => setTxnForm((p) => ({ ...p, amount: e.target.value }))} className="modal-input" />
              <input type="text" placeholder="Note (optional)" value={txnForm.note}
                onChange={(e) => setTxnForm((p) => ({ ...p, note: e.target.value }))} className="modal-input" />
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowTxnModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddTransaction} disabled={addingTxn || !txnForm.amount}>
                {addingTxn ? "Saving..." : "Save Entry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}