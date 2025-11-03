import React, { useState, useEffect } from "react";

function CreateGroup({ onBack, onGroupCreated, members }) {
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState("");

  const handleMemberToggle = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError("Please enter a group name");
      return;
    }
    if (selectedMembers.length === 0) {
      setError("Please select at least one member");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: groupName.trim(),
          members: selectedMembers,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Group created successfully!");
        onGroupCreated();
        onBack();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create group");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      setError("An error occurred while creating the group");
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-green-100 p-6 my-6 rounded-xl shadow-lg border border-indigo-200 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-black-800 mb-6 pb-2 border-b-2 border-indigo-500">
        Create New Group
      </h3>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-black-700 mb-1">Group Name</label>
          <input
            className="w-full px-4 py-3 border border-black-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black-700 mb-1">Select Members</label>
          <div className="bg-white p-5 rounded-lg shadow-inner border border-black-200 max-h-60 overflow-y-auto">
            {members.map((member) => (
              <div key={member.id} className="flex items-center p-3 rounded-lg hover:bg-black-50 transition-all">
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(member.id)}
                  onChange={() => handleMemberToggle(member.id)}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-black-300 rounded bg-indigo-600"
                />
                <span className="ml-3 text-black-800 font-medium">{member.name}</span>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <button
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-3 rounded-lg font-medium hover:from-indigo-800 hover:to-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
          onClick={handleCreateGroup}
        >
          Create Group
        </button>
      </div>

      <button
        className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all mt-6"
        onClick={onBack}
      >
        Back
      </button>
    </div>
  );
}

export default CreateGroup;
