import React, { useState, useEffect } from "react";

function ExpenseSplit({ group, onBack, onGoToSettlements, expenses, onAddExpense }) {
  const { groupName, members } = group;
  const [totalAmount, setTotalAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splits, setSplits] = useState(() =>
    members.map((m) => ({ name: m, selected: true }))
  );
  const [splitMode, setSplitMode] = useState("equal");
  const [manualSplits, setManualSplits] = useState(() =>
    members.map((m) => ({ name: m, amount: "" }))
  );
  const [percentageSplits, setPercentageSplits] = useState(() =>
    members.map((m) => ({ name: m, percentage: "" }))
  );
  const [error, setError] = useState("");

  useEffect(() => {
    setManualSplits(members.map((m) => ({ name: m, amount: "" })));
    setPercentageSplits(members.map((m) => ({ name: m, percentage: "" })));
  }, [members]);

  const addExpenseToList = (amount, splitsToUse) => {
    setError("");
    const newExpense = {
      description: description.trim(),
      amount: amount,
      splits: splitsToUse,
      paidBy: paidBy,
    };
    onAddExpense(newExpense);
    setTotalAmount("");
    setDescription("");
    setPaidBy("");
    setSplits(members.map((m) => ({ name: m, selected: true })));
    setManualSplits(members.map((m) => ({ name: m, amount: "" })));
    setPercentageSplits(members.map((m) => ({ name: m, percentage: "" })));
  };

  const handleEqualSplit = (amount) => {
    const selectedSplits = splits.filter((s) => s.selected);
    const selectedCount = selectedSplits.length;
    if (selectedCount === 0) {
      setError("Please select at least one member to split with");
      return;
    }
    const splitValue = amount / selectedCount;
    const totalSplit = splitValue * selectedCount;
    if (Math.abs(amount - totalSplit) > 0) {
      setError("Total split amount does not match total amount");
      return;
    }
    const splitsToUse = selectedSplits.map((s) => ({
      name: s.name,
      value: splitValue,
    }));
    addExpenseToList(amount, splitsToUse);
  };

  const handleManualSplit = (amount) => {
    const manualAmounts = manualSplits.map((m) => parseFloat(m.amount) || 0);
    const totalManual = manualAmounts.reduce((sum, val) => sum + val, 0);
    if (Math.abs(amount - totalManual) > 0.01) {
      setError("Manual split amounts must sum to the total amount");
      return;
    }
    const splitsToUse = manualSplits
      .map((m) => ({ name: m.name, value: parseFloat(m.amount) || 0 }))
      .filter((s) => s.value > 0);
    addExpenseToList(amount, splitsToUse);
  };

  const handlePercentageSplit = (amount) => {
    const percentages = percentageSplits.map((p) => parseFloat(p.percentage) || 0);
    const totalPercentage = percentages.reduce((sum, val) => sum + val, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      setError("Percentage splits must sum to 100%");
      return;
    }
    const splitsToUse = percentageSplits
      .map((p) => ({ name: p.name, value: (parseFloat(p.percentage) || 0) / 100 * amount }))
      .filter((s) => s.value > 0);
    addExpenseToList(amount, splitsToUse);
  };

  const addExpense = () => {
    if (!totalAmount) {
      setError("Please enter amount and description");
      return;
    }
    const amount = parseFloat(totalAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid positive amount");
      return;
    }
    if (!paidBy) {
      setError("Please select who paid the expense");
      return;
    }
    if (splitMode === "equal") {
      handleEqualSplit(amount);
    } else if (splitMode === "manual") {
      handleManualSplit(amount);
    } else if (splitMode === "percentage") {
      handlePercentageSplit(amount);
    }
  };

  return (
    <div className="bg-gradient-to-br from-teal-50 to-green-100 p-6 my-6 rounded-xl shadow-lg border border-teal-200 max-w-2xl mx-auto">
  <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-teal-500">
    {groupName} - Add Expense
  </h3>

  <div className="space-y-5">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
      <input
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
        type="number"
        placeholder="₹0.00"
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <input
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
        type="text"
        placeholder="About expense"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Paid By</label>
      <select
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
        value={paidBy}
        onChange={(e) => setPaidBy(e.target.value)}
      >
        <option value="">Select Payer</option>
        {members.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Split Mode</label>
      <select
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
        value={splitMode}
        onChange={(e) => setSplitMode(e.target.value)}
      >
        <option value="equal">Equal Split</option>
        <option value="manual">Manual Split</option>
        <option value="percentage">Percentage Split</option>
      </select>
    </div>

    <div className="bg-white p-5 rounded-lg shadow-inner border border-gray-200">
      {splitMode === "equal" ? (
        <div className="space-y-3">
          {(() => {
            const selectedCount = splits.filter((s) => s.selected).length;
            const amount = parseFloat(totalAmount) || 0;
            const splitValue = selectedCount > 0 ? amount / selectedCount : 0;
            return splits.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={s.selected}
                    onChange={(e) => setSplits((prev) => prev.map((s, idx) => idx === i ? { ...s, selected: e.target.checked } : s))}
                    className="h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-gray-800 font-medium">{s.name}</span>
                </label>
                {s.selected && (
                  <span className="text-teal-600 font-semibold">₹{splitValue.toFixed(2)}</span>
                )}
              </div>
            ));
          })()}
        </div>
      ) : splitMode === "manual" ? (
        <div className="space-y-3">
          {manualSplits.map((s, i) => (
            <div key={s.name} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-all">
              <span className="w-24 text-gray-800 font-medium">{s.name}:</span>
              <input
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                type="number"
                placeholder="₹0.00"
                value={s.amount}
                onChange={(e) => setManualSplits((prev) => prev.map((m, idx) => idx === i ? { ...m, amount: e.target.value } : m))}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {percentageSplits.map((s, i) => (
            <div key={s.name} className=" flex items-center p-3 rounded-lg hover:bg-gray-50 transition-all">
              <span className=" m-3 text-gray-800 font-medium">{s.name}:</span>
              <input
                className="size-full flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                type="number"
                placeholder="0.00%"
                value={s.percentage}
                onChange={(e) => setPercentageSplits((prev) => prev.map((p, idx) => idx === i ? { ...p, percentage: e.target.value } : p))}
              />
            </div>
          ))}
        </div>
      )}
    </div>

    {error && (
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
        {error}
      </div>
    )}

    <button
      className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-blue-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
      onClick={addExpense}
    >
      Add Expense
    </button>
  </div>

  {expenses.length > 0 && (
    <div className="bg-white p-5 mt-5 rounded-lg shadow-sm border border-gray-200">
  <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-1.5 border-b border-gray-300">
    Recent Expenses
  </h4>
  <ul className="space-y-2">
    {expenses.map((exp, i) => (
      <li
        key={i}
        className="p-3.5 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="font-medium text-gray-800">{exp.description}</div>
        <div className="text-sm text-gray-600 mt-1">
          ₹{exp.amount.toFixed(2)} paid by <span className="font-medium text-blue-600">{exp.paidBy}</span>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Split among: {exp.splits.map((s) => `${s.name} (₹${s.value.toFixed(2)})`).join(", ")}
        </div>
      </li>
    ))}
  </ul>
  <button
    className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors mt-4"
    onClick={() => onGoToSettlements(expenses)}
  >
    Go to Settlements
  </button>
</div>

  )}

  <button
    className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all mt-6"
    onClick={onBack}
  >
    Back to Group
  </button>
</div>
  );
}

export default ExpenseSplit;
