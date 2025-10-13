import React, { useState } from 'react';

function GroupForm({ onNext }) {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState('');

  const addMember = () => {
    if (newMember.trim() && !members.includes(newMember.trim())) {
      setMembers([...members, newMember.trim()]);
      setNewMember('');
    }
  };

  const removeMember = (name) => {
    setMembers(members.filter(m => m !== name));
  };

  const handleNext = () => {
    if (groupName.trim() && members.length > 0) {
      onNext({ groupName: groupName.trim(), members });
    }
  };

  return (
    <div className="form-section">
      <h3>Create Group</h3>
      <input
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <div>
        <input
          placeholder="Add Member"
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
        />
        <button onClick={addMember}>Add</button>
      </div>
      <ul>
        {members.map((member) => (
          <li key={member}>
            {member} <button onClick={() => removeMember(member)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={handleNext} disabled={!groupName.trim() || members.length === 0}>
        Next
      </button>
    </div>
  );
}

export default GroupForm;
