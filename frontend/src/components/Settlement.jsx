import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function Settlement({ bills, members, onBack, groupId }) {
  const [settlements, setSettlements] = useState([]);
  const [existingSettlements, setExistingSettlements] = useState([]);
  const [history, setHistory] = useState([]);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchSettlements();
  }, [groupId]);

  useEffect(() => {
    if (members.length && bills.length) {
      calculateOverallSettlements();
    }
  }, [bills, members, existingSettlements.length]);

  // Fetch settlements from Supabase
  const fetchSettlements = async () => {
    try {
      const { data, error } = await supabase
        .from("settlements")
        .select("*")
        .eq("group_id", groupId);
      if (error) throw error;

      // Map member names
      const formattedSettlements = data.map((s) => ({
        ...s,
        payer_name: members.find((m) => m.id === s.from_member_id)?.name || "Unknown",
        receiver_name: members.find((m) => m.id === s.to_member_id)?.name || "Unknown",
      }));

      setExistingSettlements(formattedSettlements);

      // Paid settlements for history
      const paidSettlements = formattedSettlements
        .filter((s) => s.status === "paid")
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      setHistory(paidSettlements);
    } catch (error) {
      console.error("Error fetching settlements:", error);
    }
  };

  // Calculate settlements based on bills and existing payments
  const calculateOverallSettlements = () => {
    const balances = {};
    members.forEach((m) => (balances[m.name] = 0));

    bills.forEach((exp) => {
      exp.splits.forEach((s) => {
        balances[s.member_name] -= parseFloat(s.amount);
      });
      const payerName = members.find((m) => m.id === exp.paid_by)?.name;
      if (payerName) balances[payerName] += parseFloat(exp.amount);
    });

    // Adjust balances based on existing paid settlements
    existingSettlements
      .filter((s) => s.status === "paid")
      .forEach((s) => {
        balances[s.payer_name] += parseFloat(s.amount);
        balances[s.receiver_name] -= parseFloat(s.amount);
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

  // Record a payment in Supabase
  const paySettlement = async (from, to, amount) => {
    const fromMember = members.find((m) => m.name === from);
    const toMember = members.find((m) => m.name === to);

    if (!fromMember || !toMember) {
      throw new Error("Member not found");
    }

    const { error } = await supabase.from("settlements").insert([
      {
        group_id: groupId,
        from_member_id: fromMember.id,
        to_member_id: toMember.id,
        amount: parseFloat(amount),
        status: "paid",
      },
    ]);

    if (error) throw error;
  };

  const handlePay = async (from, to, amount) => {
    if (paying) return;
    setPaying(true);
    try {
      await paySettlement(from, to, amount);
      alert(`Payment of ₹${amount} from ${from} to ${to} recorded successfully!`);
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
      {settlements.length > 0 ? (
        <ul className="list-none p-0">
          {settlements.map((s, i) => (
            <li
              key={i}
              className="bg-gray-100 m-1 p-2.5 rounded border-l-4 border-indigo-500 flex justify-between items-center"
            >
              <span>
                {s.from} pays ₹{s.amount} to {s.to}
              </span>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                onClick={() => handlePay(s.from, s.to, s.amount)}
                disabled={paying}
              >
                {paying ? "Processing..." : "Pay"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No settlements needed.</p>
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
                {new Date(h.updated_at).toLocaleDateString()}{" "}
                {new Date(h.updated_at).toLocaleTimeString()}
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
