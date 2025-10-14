import React, { useState } from 'react';
import GroupForm from './components/GroupForm';
import ExpenseSplit from './components/ExpenseSplit';
import Settlement from './components/Settlement';

function App() {
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [currentView, setCurrentView] = useState('group');

  const handleGroupNext = (groupData) => {
    setGroup(groupData);
    setCurrentView('expense');
  };

  const handleBackToGroup = () => {
    setGroup(null);
    setExpenses([]);
    setCurrentView('group');
  };

  const handleGoToBills = (billData) => {
    setExpenses(billData);
    setCurrentView('bills');
  };

  const handleBackToExpense = () => {
    setCurrentView('expense');
  };

  return (
    <div className="max-w-4xl mx-auto p-5 font-sans bg-gradient-to-br from-gray-100 to-blue-100 min-h-screen rounded-lg shadow-xl">
      <h1 className="text-center text-gray-800 mb-8 text-4xl font-bold drop-shadow-sm">Expense Splitter</h1>
      {currentView === 'group' && (
        <GroupForm onNext={handleGroupNext} />
      )}
      {currentView === 'expense' && group && (
        <ExpenseSplit group={group} onBack={handleBackToGroup} onGoToSettlements={handleGoToBills} />
      )}
      {currentView === 'bills' && group && (
        <Settlement bills={expenses} members={group.members} onBack={handleBackToExpense} />
      )}
    </div>
  );
}

export default App;
