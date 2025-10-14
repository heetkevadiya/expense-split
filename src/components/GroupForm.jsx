import React, { useState } from "react";

function GroupForm({ onNext }) {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
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
    <div className="bg-white p-5 my-5 rounded-lg shadow-md">
      <h3 className="text-gray-700 mb-4 border-b-2 border-blue-500 pb-1">
        Create Group
      </h3>
      <input
        className="m-1 p-2.5 border border-gray-300 rounded text-base w-full box-border"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <div>
        <input
          className="m-1 p-2.5 border border-gray-300 rounded text-base w-full box-border"
          placeholder="Add Member Name"
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addMember();
            }
          }}
        />
        <button
          className="bg-blue-500 text-white border-none p-2.5 rounded cursor-pointer text-base m-1 transition-colors hover:bg-blue-700"
          onClick={addMember}
        >
          Add a person
        </button>
      </div>
      <ul className="list-none p-0">
        {members.map((member) => (
          <li
            key={member}
            className="bg-gray-100 m-1 p-2.5 rounded border-l-4 border-blue-500 flex items-center"
          >
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-2 text-sm font-semibold">
              {member.charAt(0).toUpperCase()}
            </div>
            <span className="flex-1">{member}</span>
            <button
              className="bg-red-500 text-white border-none p-1 rounded cursor-pointer text-sm hover:bg-red-700"
              onClick={() => removeMember(member)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button
        className="bg-green-500 text-white border-none p-2.5 rounded cursor-pointer text-base m-1 transition-colors hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        onClick={handleNext}
        disabled={!groupName.trim() || members.length === 0}
      >
        Next
      </button>
    </div>
  );
}

export default GroupForm;
