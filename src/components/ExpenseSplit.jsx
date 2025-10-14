import React, { useState, useEffect } from "react";

function ExpenseSplit({ group, onBack, onGoToSettlements }) {
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
  const [error, setError] = useState("");
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    setManualSplits(members.map((m) => ({ name: m, amount: "" })));
  }, [members]);

  const addExpenseToList = (splitsToUse) => {
    setError("");
    const newExpense = {
      description: description.trim(),
      amount: parseFloat(totalAmount),
      splits: splitsToUse,
      paidBy: paidBy,
    };
    setExpenses([...expenses, newExpense]);
    setTotalAmount("");
    setDescription("");
    setPaidBy("");
    setSplits(members.map((m) => ({ name: m, selected: true })));
    setManualSplits(members.map((m) => ({ name: m, amount: "" })));
  };

  const handleEqualSplit = () => {
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
    const splitsToUse = selectedSplits.map((s) => ({
      name: s.name,
      value: splitValue,
    }));
    addExpenseToList(splitsToUse);
  };

  const handleManualSplit = () => {
    const amount = parseFloat(totalAmount);
    const manualAmounts = manualSplits.map((m) => parseFloat(m.amount) || 0);
    const totalManual = manualAmounts.reduce((sum, val) => sum + val, 0);
    if (Math.abs(amount - totalManual) > 0.01) {
      setError("Manual split amounts must sum to the total amount");
      return;
    }
    const splitsToUse = manualSplits
      .map((m) => ({ name: m.name, value: parseFloat(m.amount) || 0 }))
      .filter((s) => s.value > 0);
    addExpenseToList(splitsToUse);
  };

  const addExpense = () => {
    if (!totalAmount || !description.trim()) {
      setError("Please enter amount and description");
      return;
    }
    if (!paidBy) {
      setError("Please select who paid the expense");
      return;
    }
    if (splitMode === "equal") {
      handleEqualSplit();
    } else {
      handleManualSplit();
    }
  };

  return (
    <div className="bg-gradient-to-br from-teal-50 to-green-100 p-6 my-6 rounded-xl shadow-lg border border-teal-200">
      <h3 className="text-gray-800 mb-5 border-b-2 border-teal-500 pb-2 font-semibold text-lg">
        {groupName} - Add Expense
      </h3>
      <input
        className="mb-3 p-3 border border-gray-300 rounded-lg text-base w-full box-border focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        type="number"
        placeholder="Total Amount"
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
      />
      <input
        className="mb-3 p-3 border border-gray-300 rounded-lg text-base w-full box-border focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">
          Paid By:
          <select
            className="mt-1 p-3 border border-gray-300 rounded-lg text-base w-full box-border focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
          >
            <option value="">Select Payer</option>
            {members.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">
          Split Mode:
          <select
            className="mt-1 p-2  border border-gray-300 rounded-lg text-base w-full box-border focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            value={splitMode}
            onChange={(e) => setSplitMode(e.target.value)}
          >
            <option value="equal">Equal Split</option>
            <option value="manual">Manual Split</option>
          </select>
        </label>
      </div>
      <div className="mb-4">
        {splitMode === "equal" ? (
          <div className="space-y-3">
            {(() => {
              const selectedCount = splits.filter((s) => s.selected).length;
              const amount = parseFloat(totalAmount) || 0;
              const splitValue = selectedCount > 0 ? amount / selectedCount : 0;
              return splits.map((s, i) => (
                <div key={s.name} className="flex items-center">
                  <label className="flex items-center cursor-pointer">
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
                      className="mr-3 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700 font-medium">{s.name}</span>
                  </label>
                  {s.selected && (
                    <span className="ml-4 text-teal-600 font-semibold">
                      ₹{splitValue.toFixed(2)}
                    </span>
                  )}
                </div>
              ));
            })()}
          </div>
        ) : (
          <div className="space-y-3">
            {manualSplits.map((s, i) => (
              <div key={s.name} className="flex items-center">
                <span className=" ml-2 text-gray-700 font-medium mr-3 w-20">
                  {s.name}:
                </span>
                <input
                  className="p-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  type="number"
                  placeholder="Amount"
                  value={s.amount}
                  onChange={(e) =>
                    setManualSplits((prev) =>
                      prev.map((m, idx) =>
                        idx === i ? { ...m, amount: e.target.value } : m
                      )
                    )
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-600 font-semibold mt-3 bg-red-50 p-3 rounded-lg border border-red-200">
          {error}
        </p>
      )}
      <button
        className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white border-none py-3 px-6 rounded-lg cursor-pointer text-base font-medium transition-all hover:from-indigo-600 hover:to-blue-700 hover:shadow-lg mt-4"
        onClick={addExpense}
      >
        Add Expense
      </button>
      {expenses.length > 0 && (
        <div className="bg-white p-6 mt-6 rounded-xl shadow-lg border border-gray-200">
          <h4 className="text-gray-800 mb-4 border-b-2 border-teal-500 pb-2 font-semibold text-lg">
            Expenses
          </h4>
          <ul className="list-none p-0 space-y-3">
            {expenses.map((exp, i) => (
              <li
                key={i}
                className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border-l-4 border-teal-500 shadow-sm"
              >
                <div className="font-medium text-gray-800">
                  {exp.description}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  ₹{exp.amount.toFixed(2)} paid by{" "}
                  <span className="font-semibold text-teal-600">
                    {exp.paidBy}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Split among:{" "}
                  {exp.splits
                    .map((s) => `${s.name} (₹${s.value.toFixed(2)})`)
                    .join(", ")}
                </div>
              </li>
            ))}
          </ul>
          <button
            className="bg-gradient-to-r from-green-500 to-teal-600 text-white border-none py-3 px-6 rounded-lg cursor-pointer text-base font-medium transition-all hover:from-green-600 hover:to-teal-700 hover:shadow-lg mt-4"
            onClick={() => onGoToSettlements(expenses)}
          >
            Go to Settlements
          </button>
        </div>
      )}
      <button
        className="m-4 bg-gradient-to-r from-green-600 to-green-500 text-white border-none py-3 px-6 rounded-lg cursor-pointer text-base font-medium transition-all hover:from-green-700 hover:to-green-600 hover:shadow-lg mt-6"
        onClick={onBack}
      >
        Back to Group
      </button>
    </div>
  );
}

export default ExpenseSplit;
