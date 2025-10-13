import React, { useState } from 'react';
import './App.css';
import GroupForm from './components/GroupForm';
import ExpenseSplit from './components/ExpenseSplit';


function App() {
  const [group, setGroup] = useState(null);

  const handleGroupNext = (groupData) => {
    setGroup(groupData);
  };

  const handleBackToGroup = () => {
    setGroup(null);
  };

  return (
    <div className="App">
      <h1>Expense Splitter</h1>
      {!group ? (
        <GroupForm onNext={handleGroupNext} />
      ) : (
        <ExpenseSplit group={group} onBack={handleBackToGroup} />
      )}
    </div>
  );
}

export default App;
