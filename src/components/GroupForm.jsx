import React, { useState } from "react";

function GroupForm({ onNext, group }) {
  const [groupName, setGroupName] = useState(group ? group.groupName : "");
  const [members, setMembers] = useState(group ? group.members : []);
  const [newMember, setNewMember] = useState("");

  const addMember = () => {
    if (newMember.trim() && !members.includes(newMember.trim())) {
      setMembers([...members, newMember.trim()]);
      setNewMember("");
    }
  };

  const removeMember = (name) => {
    setMembers(members.filter((m) => m !== name));
  };

  const handleNext = () => {
    if (groupName.trim() && members.length > 0) {
      onNext({ groupName: groupName.trim(), members });
    }
  };

  return (
   <div className="bg-white p-6 my-6 rounded-xl shadow-lg max-w-md mx-auto">
  <h3 className="text-xl font-semibold text-black-800 mb-6 pb-2 border-b border-black-200">
    {group ? 'View Group' : 'Create New Group'}
  </h3>

  <div className="mb-5">
    <label className="block text-sm font-medium text-black-700 mb-1">Group Name</label>
    <input
      className="w-full px-4 py-2.5 border border-black-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
      placeholder="Enter group name"
      value={groupName}
      onChange={(e) => setGroupName(e.target.value)}
      disabled={!!group}
    />
  </div>

  {!group && (
    <div className="mb-5">
      <label className="block text-sm font-medium text-black-700 mb-1">Add Members</label>
      <div className="flex gap-2">
        <input
          className="flex-1 px-4 py-2.5 border border-black-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          placeholder="Enter member name"
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addMember();
            }
          }}
        />
        <button
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
          onClick={addMember}
        >
          Add
        </button>
      </div>
    </div>
  )}

  <div className="mb-6">
    <h4 className="text-sm font-medium text-black-700 mb-2">Group Members</h4>
    <ul className="space-y-2">
      {members.map((member) => (
        <li
          key={member}
          className="flex items-center justify-between p-3 bg-black-50 rounded-lg border border-black-200"
        >
          <div className="flex items-center">
            <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-medium">
              {member.charAt(0).toUpperCase()}
            </div>
            <span className="text-black-800 font-medium">{member}</span>
          </div>
          {!group && (
            <button
              className="text-red-500 hover:text-red-700 focus:outline-none"
              onClick={() => removeMember(member)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </li>
      ))}
    </ul>
  </div>

  <button
    className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    onClick={handleNext}
    disabled={!groupName.trim() || members.length === 0}
  >
    {group ? 'Go to Expenses' : 'Create Group'}
  </button>
</div>

  );
}

export default GroupForm;
