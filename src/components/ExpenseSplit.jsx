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
    <div className="bg-white p-5 my-5 rounded-lg shadow-md">
      <h3 className="text-gray-700 mb-4 border-b-2 border-blue-500 pb-1">{groupName} - Add Expense</h3>
      <input
        className="m-1 p-2.5 border border-gray-300 rounded text-base w-full box-border"
        type="number"
        placeholder="Total Amount"
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
      />
      <input
        className="m-1 p-2.5 border border-gray-300 rounded text-base w-full box-border"
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div>
        <label className="inline-block m-2.5 mr-0 font-normal">
          Paid By:
          <select className="m-1 p-2.5 border border-gray-300 rounded text-base w-full box-border" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
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
            <div key={s.name} className="mb-2">
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
                <span className="ml-2.5">
                  ₹{splitValue.toFixed(2)}
                </span>
              )}
            </div>
          ));
        })()}
      </div>
      {error && <p className="text-red-500 font-bold mt-2.5">{error}</p>}
      <button className="bg-blue-500 text-white border-none p-2.5 rounded cursor-pointer text-base m-1 transition-colors hover:bg-blue-700" onClick={addExpense}>Add Expense</button>
      {expenses.length > 0 && (
        <div className="bg-white p-5 mt-5 rounded-lg shadow-md">
          <h4 className="text-gray-700 mb-4 border-b-2 border-blue-500 pb-1">Expenses</h4>
          <ul className="list-none p-0">
            {expenses.map((exp, i) => (
              <li key={i} className="bg-gray-100 m-1 p-2.5 rounded border-l-4 border-blue-500">
                {exp.description}: ₹{exp.amount.toFixed(2)} paid by {exp.paidBy}
                , split among{" "}
                {exp.splits
                  .map((s) => `${s.name} (₹${s.value.toFixed(2)})`)
                  .join(", ")}
              </li>
            ))}
          </ul>
          <button className="bg-blue-500 text-white border-none p-2.5 rounded cursor-pointer text-base m-1 transition-colors hover:bg-blue-700" onClick={() => onGoToSettlements(expenses)}>
            Go to Settlements
          </button>
        </div>
      )}
      <button className="bg-blue-500 text-white border-none p-2.5 rounded cursor-pointer text-base m-1 transition-colors hover:bg-blue-700 mt-5" onClick={onBack}>
        Back to Group
      </button>
    </div>
  );
}

export default ExpenseSplit;
