import Group from './model/group.js';
import Member from './model/member.js';
import GroupMember from './model/group member.js';
import Expense  from './model/expense.js';
import ExpenseSplit from './model/expense split.js';
import Settlement from './model/settlment.js';

Group.hasMany(GroupMember, { foreignKey: 'group_id', as: 'memberships' });
GroupMember.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });

Member.hasMany(GroupMember, { foreignKey: 'user_id', as: 'memberships' });
GroupMember.belongsTo(Member, { foreignKey: 'user_id', as: 'member' });

Expense.belongsTo(Member, { foreignKey: 'paid_by' });
Member.hasMany(Expense, { foreignKey: 'paid_by' });

Expense.hasMany(ExpenseSplit, { foreignKey: 'expense_id' });
ExpenseSplit.belongsTo(Expense, { foreignKey: 'expense_id' });

Member.hasMany(ExpenseSplit, { foreignKey: 'member_id' });
ExpenseSplit.belongsTo(Member, { foreignKey: 'member_id' });

Settlement.belongsTo(Group, { foreignKey: 'group_id' });
Group.hasMany(Settlement, { foreignKey: 'group_id' });

Settlement.belongsTo(Member, { foreignKey: 'from_member_id', as: 'fromMember' });
Settlement.belongsTo(Member, { foreignKey: 'to_member_id', as: 'toMember' });

Member.hasMany(Settlement, { foreignKey: 'from_member_id' });
Member.hasMany(Settlement, { foreignKey: 'to_member_id' });
