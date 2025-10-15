import React, { useState, useEffect } from "react";

function Settlement({ bills, members, onBack }) {
  const [settlements, setSettlements] = useState([]);

  useEffect(() => {
    calculateOverallSettlements();
  }, [bills, members]);

  const calculateOverallSettlements = () => {
    const balances = {};
    members.forEach((m) => (balances[m] = 0));
    bills.forEach((exp) => {
      exp.splits.forEach((s) => {
        balances[s.name] -= s.value;
      });
      balances[exp.paidBy] += exp.amount;
    });

    const positive = [];
    const negative = [];
    Object.entries(balances).forEach(([user, amount]) => {
      if (amount > 0) positive.push({ user, amount });
      else if (amount < 0) negative.push({ user, amount: -amount });
    });

    const newSettlements = [];
    while (positive.length && negative.length) {
      const p = positive[0];
      const n = negative[0];
      const settledAmount = Math.min(p.amount, n.amount);
      newSettlements.push({
        from: n.user,
        to: p.user,
        amount: settledAmount.toFixed(2),
      });
      p.amount -= settledAmount;
      n.amount -= settledAmount;
      if (p.amount === 0) positive.shift();
      if (n.amount === 0) negative.shift();
    }
    setSettlements(newSettlements);
  };

  return (
    <div className="bg-white p-5 my-5 rounded-lg shadow-md">
      <h2 className="text-gray-700 mb-4 border-b-2 border-blue-500 pb-1">
        Overall Settlements
      </h2>
      {settlements.length > 0 && (
        <ul className="list-none p-0">
          {settlements.map((s, i) => (
            <li
              key={i}
              className="bg-gray-100 m-1 p-2.5 rounded border-l-4 border-blue-500"
            >
              {s.from} pays ₹{s.amount} to {s.to}
            </li>
          ))}
        </ul>
      )}
      <button
        className="bg-blue-500 text-white border-none p-2.5 rounded cursor-pointer text-base m-1 transition-colors hover:bg-blue-700 mt-5"
        onClick={onBack}
      >
        Back
      </button>
    </div>
  );
}

export default Settlement;
