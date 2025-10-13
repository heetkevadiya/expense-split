import React, { useState, useEffect } from 'react';

function Settlement({ expenses, members, onBack }) {
  const [settlements, setSettlements] = useState([]);

  useEffect(() => {
    calculateOverallSettlements();
  }, [expenses, members]);

  const calculateOverallSettlements = () => {
    const balances = {};
    members.forEach((m) => (balances[m] = 0));
    expenses.forEach((exp) => {
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
    <div className="form-section">
      <h2>Overall Settlements</h2>
      {settlements.length > 0 && (
        <div className="display-section" style={{ marginTop: '20px' }}>
          <h4>Overall Settlements</h4>
          <ul>
            {settlements.map((s, i) => (
              <li key={i}>
                {s.from} pays ₹{s.amount} to {s.to}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={onBack} style={{ marginTop: '20px' }}>Back</button>
    </div>
  );
}

export default Settlement;
