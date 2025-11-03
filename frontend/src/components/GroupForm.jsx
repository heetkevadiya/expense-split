import React, { useState } from "react";

function GroupForm({ onNext, group, members }) {
  const [groupName, setGroupName] = useState(group ? group.groupName : "");
  const [selectedMembers, setSelectedMembers] = useState(group ? group.members : []);

  const toggleMember = (member) => {
    if (selectedMembers.some(m => m.id === member.id)) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== member.id));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleNext = () => {
    if (groupName.trim() && selectedMembers.length > 0) {
      onNext({ groupName: groupName.trim(), members: selectedMembers });
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
      <label className="block text-sm font-medium text-gray-700 mb-1">Select Members</label>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {members.map((member) => (
          <div key={member.id} className="flex items-center">
            <input
              type="checkbox"
              id={`member-${member.id}`}
              checked={selectedMembers.some(m => m.id === member.id)}
              onChange={() => toggleMember(member)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor={`member-${member.id}`} className="ml-2 text-gray-800 font-medium">
              {member.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  )}

  <div className="mb-6">
    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Members</h4>
    <ul className="space-y-2">
      {selectedMembers.map((member) => (
        <li
          key={member.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="flex items-center">
            <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-medium">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-800 font-medium">{member.name}</span>
          </div>
          {!group && (
            <button
              className="text-red-500 hover:text-red-700 focus:outline-none"
              onClick={() => toggleMember(member)}
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
    disabled={!groupName.trim() || selectedMembers.length === 0}
  >
    {group ? 'Go to Expenses' : 'Create Group'}
  </button>
</div>

  );
}

export default GroupForm;