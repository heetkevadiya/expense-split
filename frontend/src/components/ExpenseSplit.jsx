import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function ExpenseSplit({
  group,
  onBack,
  onGoToSettlements,
  expenses,
  onAddExpense,
}) {
  const { groupName, members } = group;
  const [totalAmount, setTotalAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splits, setSplits] = useState(() =>
    members.map((m) => ({ name: m.name, selected: true }))
  );
  const [splitMode, setSplitMode] = useState("equal");
  const [manualSplits, setManualSplits] = useState(() =>
    members.map((m) => ({ name: m.name, amount: "" }))
  );
  const [percentageSplits, setPercentageSplits] = useState(() =>
    members.map((m) => ({ name: m.name, percentage: "" }))
  );
  const [sharesSplits, setSharesSplits] = useState(() =>
    members.map((m) => ({ name: m.name, shares: 0 }))
  );
  const [error, setError] = useState("");

  useEffect(() => {
    setManualSplits(members.map((m) => ({ name: m.name, amount: "" })));
    setPercentageSplits(members.map((m) => ({ name: m.name, percentage: "" })));
    setSharesSplits(members.map((m) => ({ name: m.name, shares: 0 })));
  }, [members]);





  const handleEqualSplit = (amount) => {
    const selectedSplits = splits.filter((s) => s.selected);
    const selectedCount = selectedSplits.length;
    if (selectedCount === 0) {
      setError("Please select at least one member to split with");
      return [];
    }
    const splitValue = amount / selectedCount;
    return selectedSplits.map((s) => ({
      member_id: members.find((m) => m.name === s.name).id,
      amount: splitValue,
    }));
  };

  const handleManualSplit = (amount) => {
    const manualAmounts = manualSplits.map((m) => parseFloat(m.amount) || 0);
    const totalManual = manualAmounts.reduce((sum, val) => sum + val, 0);
    if (Math.abs(amount - totalManual) > 0.01) {
      setError("Manual split amounts must sum to the total amount");
      return [];
    }
    return manualSplits
      .map((m, i) => ({
        member_id: members[i].id,
        amount: parseFloat(m.amount) || 0,
      }))
      .filter((s) => s.amount > 0);
  };

  const handlePercentageSplit = (amount) => {
    const percentages = percentageSplits.map(
      (p) => parseFloat(p.percentage) || 0
    );
    const totalPercentage = percentages.reduce((sum, val) => sum + val, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      setError("Percentage splits must sum to 100%");
      return [];
    }
    return percentageSplits
      .map((p, i) => ({
        member_id: members[i].id,
        amount: ((parseFloat(p.percentage) || 0) / 100) * amount,
      }))
      .filter((s) => s.amount > 0);
  };

  const handleSharesSplit = (amount) => {
    const shares = sharesSplits.map((sh) => parseFloat(sh.shares) || 0);
    const totalShares = shares.reduce((sum, val) => sum + val, 0);
    if (totalShares === 0) {
      setError("Total shares must be greater than 0");
      return [];
    }
    return sharesSplits
      .map((sh, i) => ({
        member_id: members[i].id,
        amount: ((parseFloat(sh.shares) || 0) / totalShares) * amount,
      }))
      .filter((s) => s.amount > 0);
  };

const addExpense = () => {
    setError("");

    if (!totalAmount || !description || !paidBy) {
      setError("Please fill all fields");
      return;
    }

    const amount = parseFloat(totalAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Invalid amount");
      return;
    }

    let splitsToUse = [];
    if (splitMode === "equal") splitsToUse = handleEqualSplit(amount);
    else if (splitMode === "manual") splitsToUse = handleManualSplit(amount);
    else if (splitMode === "percentage") splitsToUse = handlePercentageSplit(amount);
    else if (splitMode === "shares") splitsToUse = handleSharesSplit(amount);

    if (!splitsToUse.length) {
      setError("No valid splits found");
      return;
    }

    onAddExpense({
      description: description.trim(),
      amount,
      paid_by: paidBy,
      split_type: splitMode,
      splits: splitsToUse,
    });

    // Reset form
    setTotalAmount("");
    setDescription("");
    setPaidBy("");
    setSplits(members.map((m) => ({ name: m.name, selected: true })));
    setManualSplits(members.map((m) => ({ name: m.name, amount: "" })));
    setPercentageSplits(members.map((m) => ({ name: m.name, percentage: "" })));
    setSharesSplits(members.map((m) => ({ name: m.name, shares: 0 })));
  };
  
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-green-100 p-6 my-6 rounded-xl shadow-lg border border-indigo-200 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-black-800 mb-6 pb-2 border-b-2 border-indigo-500">
        {groupName} - Add Expense
      </h3>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-black-700 mb-1">
            Total Amount
          </label>
          <input
            className="w-full px-4 py-3 border border-black-300 rounded-lg focus:ring-2 focus:ring-black-500 focus:border-transparent outline-none transition-all"
            type="number"
            placeholder="₹0.00"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
          />
        </div>
    
        <div>
          <label className="block text-sm font-medium text-black-700 mb-1">
            Description
          </label>
          <input
            className="w-full px-4 py-3 border border-black-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            type="text"
            placeholder="About expense"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black-700 mb-1">
            Paid By
          </label>
          <select
  className="w-full px-4 py-3 border border-black-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
  value={paidBy}
  onChange={(e) => setPaidBy(e.target.value)}
>
  <option value="">Select Payer</option>
  {members.map((m) => (
    <option key={m.id} value={m.id}>
      {m.name}
    </option>
  ))}
</select>

        </div>

        <div>
          <label className="block text-sm font-medium text-black-700 mb-1">
            Split Mode
          </label>
          <select
            className="w-full px-4 py-3 border border-black-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            value={splitMode}
            onChange={(e) => setSplitMode(e.target.value)}
          >
            <option value="equal">Equal Split</option>
            <option value="manual">Manual Split</option>
            <option value="percentage">Percentage Split</option>
            <option value="shares">Shares Split</option>
          </select>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-inner border border-black-200">
          {splitMode === "equal" ? (
            <div className="space-y-3">
              {(() => {
                const selectedCount = splits.filter((s) => s.selected).length;
                const amount = parseFloat(totalAmount) || 0;
                const splitValue =
                  selectedCount > 0 ? amount / selectedCount : 0;
                return splits.map((s, i) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-black-50 transition-all"
                  >
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={s.selected}
                        onChange={(e) =>
                          setSplits((prev) =>
                            prev.map((s, idx) =>
                              idx === i
                                ? { ...s, selected: e.target.checked }
                                : s
                            )
                          )
                        }
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-black-300 rounded bg-indigo-600"
                      />
                      <span className="ml-3 text-black-800 font-medium">
                        {s.name}
                      </span>
                    </label>
                    {s.selected && (
                      <span className="text-black-800 font-semibold">
                        ₹{splitValue.toFixed(2)}
                      </span>
                    )}
                  </div>
                ));
              })()}
            </div>
          ) : splitMode === "manual" ? (
            <div className="space-y-3">
              {manualSplits.map((s, i) => (
                <div
                  key={s.name}
                  className="flex items-center p-3 rounded-lg hover:bg-black-50 transition-all"
                >
                  <span className="w-24 text-black-800 font-medium">
                    {s.name}:
                  </span>
                  <input
                    className="flex-1 px-3 py-2 border border-black-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    type="number"
                    placeholder="₹0.00"
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
          ) : splitMode === "percentage" ? (
            <div className="space-y-3">
              {percentageSplits.map((s, i) => (
                <div
                  key={s.name}
                  className=" flex items-center p-3 rounded-lg hover:bg-black-50 transition-all"
                >
                  <span className=" m-3 text-black-800 font-medium">
                    {s.name}:
                  </span>
                  <input
                    className="size-full flex-1 px-3 py-2 border border-black-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    type="number"
                    placeholder="0.00%"
                    value={s.percentage}
                    onChange={(e) =>
                      setPercentageSplits((prev) =>
                        prev.map((p, idx) =>
                          idx === i ? { ...p, percentage: e.target.value } : p
                        )
                      )
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {sharesSplits.map((s, i) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-black-50 transition-all"
                >
                  <span className="text-black-800 font-medium">{s.name}:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-all"
                      onClick={() =>
                        setSharesSplits((prev) =>
                          prev.map((sh, idx) =>
                            idx === i
                              ? {
                                  ...sh,
                                  shares: Math.max(0, parseInt(sh.shares) - 1),
                                }
                              : sh
                          )
                        )
                      }
                    >
                      -
                    </button>
                    <input
                      className="w-16 px-2 py-1 border border-black-300 rounded text-center focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      type="number"
                      min="0"
                      max="20"
                      value={s.shares}
                      onChange={(e) => {
                        const value = Math.min(
                          20,
                          Math.max(0, parseInt(e.target.value) || 0)
                        );
                        setSharesSplits((prev) =>
                          prev.map((sh, idx) =>
                            idx === i ? { ...sh, shares: value } : sh
                          )
                        );
                      }}
                    />
                    <button
                      className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-all"
                      onClick={() =>
                        setSharesSplits((prev) =>
                          prev.map((sh, idx) =>
                            idx === i
                              ? {
                                  ...sh,
                                  shares: Math.min(20, parseInt(sh.shares) + 1),
                                }
                              : sh
                          )
                        )
                      }
                    >
                      +
                    </button>
                  </div>
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
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-3 rounded-lg font-medium hover:from-indigo-800 hover:to-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
          onClick={addExpense}
        >
          Add Expense
        </button>
      </div>

      {expenses && expenses.length > 0 && (
        <div className="bg-white p-5 mt-5 rounded-lg shadow-sm border border-black-200">
          <h4 className="text-lg font-semibold text-black-800 mb-4 pb-1.5 border-b border-black-300">
            Recent Expenses
          </h4>
          <ul className="space-y-2">
            {expenses.map((exp, i) => (
              <li
                key={i}
                className="p-3.5 rounded-md border border-black-200 bg-black-50 hover:bg-black-100 transition-colors"
              >
                <div className="font-medium text-black-800">
                  {exp.description}
                </div>
                <div className="text-sm text-black-600 mt-1">
  ₹{parseFloat(exp.amount).toFixed(2)} paid by{" "}
  <span className="font-semibold text-black-600">
    {members.find((m) => m.id === exp.paid_by)?.name || exp.paid_by}
  </span>
</div>

                <div className="text-sm text-black-600 mt-1">
                  Split among:{" "}
                  {exp.splits &&
                    exp.splits
                      .map(
                        (s) =>
                          `${s.member_name} (₹${parseFloat(s.amount).toFixed(
                            2
                          )})`
                      )
                      .join(", ")}
                </div>
              </li>
            ))}
          </ul>
          <button
            className="w-full bg-indigo-600 text-white py-2.5 rounded-md font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors mt-4"
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
