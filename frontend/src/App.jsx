import React, { useState, useEffect } from "react";
import CreateGroup from "./components/CreateGroup";
import ExpenseSplit from "./components/ExpenseSplit";
import Settlement from "./components/Settlement";
import { supabase } from "./supabaseClient";

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

  useEffect(() => { localStorage.setItem("group", JSON.stringify(group)); }, [group]);
  useEffect(() => { localStorage.setItem("bills", JSON.stringify(bills)); }, [bills]);
  useEffect(() => { localStorage.setItem("currentView", currentView); }, [currentView]);
  useEffect(() => { localStorage.setItem("currentMember", JSON.stringify(currentMember)); }, [currentMember]);

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase.from("member").select("*");
    if (!error) setMembers(data);
  };

  const handleLogin = async (selectedMember) => {
    setCurrentMember(selectedMember);
    await fetchMemberGroups(selectedMember.id);
    setCurrentView("selectGroup");
  };

  const fetchMemberGroups = async (memberId) => {
    const { data, error } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", memberId);

    if (error) return console.error(error);
    const groupIds = data.map((g) => g.group_id);

    const { data: groups } = await supabase
      .from("groups")
      .select("*")
      .in("id", groupIds);
    setMemberGroups(groups || []);
  };

  const fetchExpenses = async (groupId) => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*, expense_splits(*, member(name))")
      .eq("group_id", groupId);

    if (error) return console.error(error);

    const formattedExpenses = data.map((exp) => ({
      ...exp,
      splits: exp.expense_splits.map((s) => ({
        member_name: s.member.name,
        amount: s.amount,
      })),
    }));
    setExpenses(formattedExpenses);
  };

  const handleAddExpense = async (newExpense) => {
    try {
      const { description, amount, paid_by, splits, split_type } = newExpense;
      if (!description || !amount || !paid_by || !splits?.length) {
        alert("Please fill all fields");
        return;
      }

      const { data: expenseData, error: expenseError } = await supabase
        .from("expenses")
        .insert([
          {
            group_id: group.groupId,
            description,
            amount,
            paid_by,
            split_type,
          },
        ])
        .select("id")
        .single();

      if (expenseError) throw expenseError;

      const expenseId = expenseData.id;
      const splitRows = splits.map((split) => ({
        expense_id: expenseId,
        member_id: split.member_id,
        amount: split.amount,
      }));

      const { error: splitError } = await supabase
        .from("expense_splits")
        .insert(splitRows);
      if (splitError) throw splitError;

      await fetchExpenses(group.groupId);
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

const handleReset = () => {
  localStorage.clear();
  setGroup(null);
  setBills([]);
  setCurrentMember(null);
  setCurrentView("login");
};

const handleBackToGroup = () => setCurrentView("selectGroup");

const handleGoToBills = () => {
  setBills(expenses);
  setCurrentView("bills");
};

const handleBackToExpense = () => setCurrentView("expense");


  return (
    <div className="max-w-4xl mx-auto p-5 font-sans bg-gradient-to-br from-gray-100 to-blue-100 min-h-screen rounded-lg shadow-xl">
      <h1 className="text-center text-gray-800 mb-8 text-4xl font-bold drop-shadow-sm">Expense Splitter</h1>
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
          <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Login</h3>
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
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {currentView === "selectGroup" && (
        <div className="bg-white p-6 my-6 rounded-xl shadow-lg max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Select Group</h3>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Group</label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              onChange={async (e) => {
                const selectedId = e.target.value;
                if (selectedId) {
                  const selectedGroup = memberGroups.find(g => g.id == selectedId);
                  if (selectedGroup) {
                    // Fetch group members
                    const { data: groupMembers, error } = await supabase
                      .from('group_members')
                      .select('member(*)') // fixed table name
                      .eq('group_id', selectedId);
                    if (error) throw error;

                    setGroup({
                      groupId: selectedId,
                      groupName: selectedGroup.name,
                      members: groupMembers.map(item => item.member)
                    });

                    await fetchExpenses(selectedId);
                    setCurrentView("expense");
                  }
                }
              }}
            >
              <option value="">Select a group</option>
              {memberGroups.map((group) => (
                <option key={group.id} value={group.id}>{group.name}</option>
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
          groupId={group.groupId}
        />
      )}
    </div>
  );
}

export default App;
