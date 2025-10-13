import React, { useState } from 'react';
import "tailwindcss";
import './App.css';
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

  const handleGoToSettlements = (expenseData) => {
    setExpenses(expenseData);
    setCurrentView('settlements');
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
        <ExpenseSplit group={group} onBack={handleBackToGroup} onGoToSettlements={handleGoToSettlements} />
      )}
      {currentView === 'settlements' && group && (
        <Settlement expenses={expenses} members={group.members} onBack={handleBackToExpense} />
      )}      
    </div>
  );
}

export default App;
