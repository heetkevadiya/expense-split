import React, { useState } from 'react';
import "tailwindcss";
import './App.css';
import GroupForm from './components/GroupForm';
import ExpenseSplit from './components/ExpenseSplit';
import Settlement from './components/Settlement';

function App() {
  const [group, setGroup] = useState(null);
  const [bills, setBills] = useState([]);
  const [currentView, setCurrentView] = useState('group');

  const handleGroupNext = (groupData) => {
    setGroup(groupData);
    setCurrentView('expense');
  };

  const handleBackToGroup = () => {
    setGroup(null);
    setBills([]);
    setCurrentView('group');
  };

  const handleGoToBills = (billData) => {
    setBills(billData);
    setCurrentView('bills');
  };

  const handleBackToExpense = () => {
    setCurrentView('expense');
  };

  return (
    <div className="App">
      <h1>Expense Splitter</h1>
      {currentView === 'group' && (
        <GroupForm onNext={handleGroupNext} />
      )}
      {currentView === 'expense' && group && (
        <ExpenseSplit group={group} onBack={handleBackToGroup} onGoToBills={handleGoToBills} />
      )}
      {currentView === 'bills' && group && (
        <Settlement bills={bills} members={group.members} onBack={handleBackToExpense} />
      )}
    </div>
  );
}

export default App;
