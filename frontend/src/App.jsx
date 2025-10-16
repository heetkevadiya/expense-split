import React, { useState, useEffect } from "react";
import GroupForm from "./components/GroupForm";
import ExpenseSplit from "./components/ExpenseSplit";
import Settlement from "./components/Settlement";

function App() {
  const [group, setGroup] = useState(() => {
    const saved = localStorage.getItem("group");
    return saved ? JSON.parse(saved) : null;
  });
  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem("bills");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentView, setCurrentView] = useState(() => {
    const saved = localStorage.getItem("currentView");
    return saved || "group";
  });

  useEffect(() => {
    localStorage.setItem("group", JSON.stringify(group));
  }, [group]);

  useEffect(() => {
    localStorage.setItem("bills", JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem("currentView", currentView);
  }, [currentView]);

  const handleGroupNext = (groupData) => {
    setGroup(groupData);
    setCurrentView("expense");
  };

  const handleBackToGroup = () => {
    setCurrentView("group");
  };

  const handleGoToBills = (billData) => {
    setBills(billData);
    setCurrentView("bills");
  };

  const handleBackToExpense = () => {
    setCurrentView("expense");
  };

  const handleAddExpense = (newExpense) => {
    setBills([...bills, newExpense]);
  };

  const handleReset = () => {
    localStorage.clear();
    setGroup(null);
    setBills([]);
    setCurrentView("group");
  };

  return (
    <div className="max-w-4xl mx-auto p-5 font-sans bg-gradient-to-br from-gray-100 to-blue-100 min-h-screen rounded-lg shadow-xl">
      <h1 className="text-center text-gray-800 mb-8 text-4xl font-bold drop-shadow-sm">
        Expense Splitter
      </h1>
      <div className="text-center mb-6">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
          onClick={handleReset}
        >
          Reset All Data
        </button>
      </div>
      {currentView === "group" && (
        <GroupForm onNext={handleGroupNext} group={group} />
      )}
      {currentView === "expense" && group && (
        <ExpenseSplit
          group={group}
          onBack={handleBackToGroup}
          onGoToSettlements={handleGoToBills}
          expenses={bills}
          onAddExpense={handleAddExpense}
        />
      )}
      {currentView === "bills" && group && (
        <Settlement
          bills={bills}
          members={group.members}
          onBack={handleBackToExpense}
        />
      )}
    </div>
  );
}

export default App;