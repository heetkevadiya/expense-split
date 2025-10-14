import React, { useState } from "react";

function ExpenseSplit({ group, onBack, onGoToSettlements }) {
  const { groupName, members } = group;
  const [totalAmount, setTotalAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splits, setSplits] = useState(() =>
    members.map((m) => ({ name: m, selected: true }))
  );
  const [error, setError] = useState("");
  const [expenses, setExpenses] = useState([]);

  const addExpense = () => {
    if (!totalAmount || !description.trim()) {
      setError("Please enter amount and description");
      return;
    }
    if (!paidBy) {
      setError("Please select who paid the expense");
      return;
    }
    const selectedSplits = splits.filter((s) => s.selected);
    const selectedCount = selectedSplits.length;
    if (selectedCount === 0) {
      setError("Please select at least one member to split with");
      return;
    }
    const amount = parseFloat(totalAmount);
    const splitValue = amount / selectedCount;
    const totalSplit = splitValue * selectedCount;
    if (Math.abs(amount - totalSplit) > 0) {
      setError("Total split amount does not match total amount");
      return;
    }
    setError("");
    const newExpense = {
      description: description.trim(),
      amount: amount,
      splits: selectedSplits.map((s) => ({ name: s.name, value: splitValue })),
      paidBy: paidBy,
    };
    setExpenses([...expenses, newExpense]);
    setTotalAmount("");
    setDescription("");
    setPaidBy("");
    setSplits(members.map((m) => ({ name: m, selected: true })));
  };

  return (
    <div className="form-section">
      <h3>{groupName} - Add Expense</h3>
      <input
        type="number"
        placeholder="Totazl Amount"
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div>
        <label>
          Paid By:
          <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
            <option value="">Select Payer</option>
            {members.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        {(() => {
          const selectedCount = splits.filter((s) => s.selected).length;
          const amount = parseFloat(totalAmount) || 0;
          const splitValue = selectedCount > 0 ? amount / selectedCount : 0;
          return splits.map((s, i) => (
            <div key={s.name} style={{ marginBottom: "8px" }}>
              <label>
                <input
                  type="checkbox"
                  checked={s.selected}
                  onChange={(e) =>
                    setSplits((prev) =>
                      prev.map((s, idx) =>
                        idx === i ? { ...s, selected: e.target.checked } : s
                      )
                    )
                  }
                />
                {s.name}
              </label>
              {s.selected && (
                <span style={{ marginLeft: "10px" }}>
                  ₹{splitValue.toFixed(2)}
                </span>
              )}
            </div>
          ));
        })()}
      </div>
      {error && <p className="error">{error}</p>}
      <button onClick={addExpense}>Add Expense</button>
      {expenses.length > 0 && (
        <div className="display-section" style={{ marginTop: "20px" }}>
          <h4>Expenses</h4>
          <ul>
            {expenses.map((exp, i) => (
              <li key={i}>
                {exp.description}: ₹{exp.amount.toFixed(2)} paid by {exp.paidBy}
                , split among{" "}
                {exp.splits
                  .map((s) => `${s.name} (₹${s.value.toFixed(2)})`)
                  .join(", ")}
              </li>
            ))}
          </ul>
          <button onClick={() => onGoToSettlements(expenses)}>
            Go to Settlements
          </button>
        </div>
      )}
      <button onClick={onBack} style={{ marginTop: "20px" }}>
        Back to Group
      </button>
    </div>
  );
}

export default ExpenseSplit;
