import React, { useState, useEffect } from "react";
import CreateGroup from "./components/CreateGroup";
import ExpenseSplit from "./components/ExpenseSplit";
import Settlement from "./components/Settlement";

function App() {
  const [members, setMembers] = useState([]);
  const [currentMember, setCurrentMember] = useState(() => {
    const saved = localStorage.getItem("currentMember");
    return saved ? JSON.parse(saved) : null;
  });
  const [group, setGroup] = useState(() => {
    const saved = localStorage.getItem("group");
    return saved ? JSON.parse(saved) : null;
  });
  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem("bills");
    return saved ? JSON.parse(saved) : [];
  });
  const [expenses, setExpenses] = useState([]);
  const [memberGroups, setMemberGroups] = useState([]);
  const [currentView, setCurrentView] = useState(() => {
    const saved = localStorage.getItem("currentView");
    return saved || (currentMember ? "selectGroup" : "login");
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

  useEffect(() => {
    localStorage.setItem("currentMember", JSON.stringify(currentMember));
  }, [currentMember]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch("http://localhost:5000/member");
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleLogin = async (selectedMember) => {
    setCurrentMember(selectedMember);
    await fetchMemberGroups(selectedMember.id);
    setCurrentView("selectGroup");
  };

  const fetchMemberGroups = async (memberId) => {
    try {
      const response = await fetch(`http://localhost:5000/member/${memberId}/groups`);
      const data = await response.json();
      setMemberGroups(data.groups);
    } catch (error) {
      console.error("Error fetching member groups:", error);
    }
  };

  const fetchExpenses = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:5000/expense/${groupId}`);
      const data = await response.json();
      setExpenses(data.expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleBackToGroup = () => {
    setCurrentView("selectGroup");
  };

  const handleGoToBills = (billData) => {
    setBills(billData);
    setCurrentView("bills");
  };

  const handleBackToExpense = () => {
    setCurrentView("expense");
  };

  const handleAddExpense = async (newExpense) => {
    try {
      const response = await fetch(`http://localhost:5000/expense/${group.groupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
      });
      if (response.ok) {
        await fetchExpenses(group.groupId);
        setBills([...bills, newExpense]);
      } else {
        console.error('Failed to add expense');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleReset = () => {
    localStorage.clear();
    setGroup(null);
    setBills([]);
    setCurrentMember(null);
    setCurrentView("login");
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
      {currentView === "login" && (
        <div className="bg-white p-6 my-6 rounded-xl shadow-lg max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            Login
          </h3>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Member</label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              onChange={(e) => {
                const selectedId = e.target.value;
                const selectedMember = members.find(m => m.id == selectedId);
                if (selectedMember) handleLogin(selectedMember);
              }}
            >
              <option value="">Select a member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      {currentView === "selectGroup" && (
        <div className="bg-white p-6 my-6 rounded-xl shadow-lg max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            Select Group
          </h3>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Group</label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              onChange={async (e) => {
                const selectedId = e.target.value;
                if (selectedId) {
                  const selectedGroup = memberGroups.find(g => g.id == selectedId);
                  if (selectedGroup) {
                    const response = await fetch(`http://localhost:5000/groupmember/${selectedId}`);
                    const groupData = await response.json();
                    setGroup({
                      groupId: selectedId,
                      groupName: selectedGroup.name,
                      members: groupData.members
                    });
                    await fetchExpenses(selectedId);
                    setCurrentView("expense");
                  }
                }
              }}
            >
              <option value="">Select a group</option>
              {memberGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
            onClick={() => setCurrentView("createGroup")}
          >
            Create New Group
          </button>
        </div>
      )}
      {currentView === "createGroup" && (
        <CreateGroup
          onBack={() => setCurrentView("selectGroup")}
          onGroupCreated={() => fetchMemberGroups(currentMember.id)}
          members={members}
        />
      )}
      {currentView === "expense" && group && (
        <ExpenseSplit
          group={group}
          onBack={handleBackToGroup}
          onGoToSettlements={handleGoToBills}
          expenses={expenses}
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