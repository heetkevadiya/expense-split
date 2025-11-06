import React, { useState, useEffect } from "react";

function Settlement({ bills, members, onBack, groupId }) {
  const [settlements, setSettlements] = useState([]);
  const [existingSettlements, setExistingSettlements] = useState([]);
  const [history, setHistory] = useState([]);
  const [paying, setPaying] = useState(null);

  useEffect(() => {
    fetchSettlements();
  }, [groupId]);

  useEffect(() => {
    if (members.length && bills.length) {
      calculateOverallSettlements();
    }
  }, [bills, members, existingSettlements.length]);

  const fetchSettlements = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/settlement/${groupId}`
      );
      if (response.ok) {
        const data = await response.json();
        setExistingSettlements(data.settlements);
        // Filter and sort paid settlements for history
        const paidSettlements = data.settlements
          .filter((s) => s.status === "paid")
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        setHistory(paidSettlements);
      } else {
        console.error("Failed to fetch settlements");
      }
    } catch (error) {
      console.error("Error fetching settlements:", error);
    }
  };

  const calculateOverallSettlements = () => {
    const balances = {};
    members.forEach((m) => (balances[m.name] = 0));
    bills.forEach((exp) => {
      exp.splits.forEach((s) => {
        balances[s.member_name] -= parseFloat(s.amount);
      });
      balances[exp.paid_by] += parseFloat(exp.amount);
    });

    // Adjust balances based on existing paid settlements
    existingSettlements
      .filter((s) => s.status === "paid")
      .forEach((settlement) => {
        balances[settlement.payer_name] += parseFloat(settlement.amount);
        balances[settlement.receiver_name] -= parseFloat(settlement.amount);
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

  const paySettlement = async (from, to, amount) => {
    const fromMember = members.find((m) => m.name === from);
    const toMember = members.find((m) => m.name === to);
    if (!fromMember || !toMember) {
      throw new Error("Member not found");
    }

    const response = await fetch(
      `http://localhost:5000/settlement/${groupId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from_member_id: fromMember.id,
          to_member_id: toMember.id,
          amount: parseFloat(amount),
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Unknown error");
    }
    return response;
  };

  const handlePay = async (from, to, amount) => {
    if (paying) return;
    setPaying(true);
    try {
      await paySettlement(from, to, amount);
      alert(
        `Payment of ₹${amount} from ${from} to ${to} recorded successfully!`
      );
      fetchSettlements(); // Refresh settlements after payment
    } catch (error) {
      console.error("Error recording payment:", error);
      alert(`Failed to record payment: ${error.message}`);
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="bg-white p-5 my-5 rounded-lg shadow-md">
      <h2 className="text-gray-700 mb-4 border-b-2 border-indigo-500 pb-1">
        Overall Settlements
      </h2>
      {settlements.length > 0 && (
        <ul className="list-none p-0">
          {settlements.map((s, i) => (
            <li
              key={i}
              className="bg-gray-100 m-1 p-2.5 rounded border-l-4 border-indigo-500 flex justify-between items-center"
            >
              <span>
                {s.from} pays ₹{s.amount} to {s.to}
              </span>
              {(() => {
                const isPaid = existingSettlements.some(
                  (es) =>
                    es.payer_name === s.from &&
                    es.receiver_name === s.to &&
                    es.status === "paid"
                );
                return isPaid ? (
                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded cursor-not-allowed"
                    disabled
                  >
                    Paid
                  </button>
                ) : (
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                    onClick={() => handlePay(s.from, s.to, s.amount)}
                    disabled={paying}
                  >
                    {paying ? "Processing..." : "Pay"}
                  </button>
                );
              })()}
            </li>
          ))}
        </ul>
      )}
      <h2 className="text-gray-700 mb-4 border-b-2 border-indigo-500 pb-1 mt-8">
        Settlement History
      </h2>
      {history.length > 0 ? (
        <ul className="list-none p-0">
          {history.map((h) => (
            <li
              key={h.id}
              className="bg-gray-50 m-1 p-2.5 rounded border-l-4 border-green-500 flex justify-between items-center"
            >
              <span>
                {h.payer_name} paid ₹{h.amount} to {h.receiver_name}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(h.updated_at).toLocaleDateString()} {new Date(h.updated_at).toLocaleTimeString()}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No settlement history available.</p>
      )}
      <button
        className="bg-indigo-500 text-white border-none p-2.5 rounded cursor-pointer text-base m-1 transition-colors hover:bg-indigo-700 mt-5"
        onClick={onBack}
      >
        Back
      </button>
    </div>
  );
}

export default Settlement;