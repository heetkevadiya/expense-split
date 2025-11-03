import Group from './model/group.js';
import Member from './model/member.js';
import GroupMember from './model/group member.js';
import Expense  from './model/expense.js';
import ExpenseSplit from './model/expense split.js'

Group.hasMany(GroupMember, { foreignKey: 'group_id', as: 'memberships' });
GroupMember.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });

Member.hasMany(GroupMember, { foreignKey: 'user_id', as: 'memberships' });
GroupMember.belongsTo(Member, { foreignKey: 'user_id', as: 'member' });

Expense.belongsTo(Member, { foreignKey: 'paid_by', as: 'payer' });
Member.hasMany(Expense, { foreignKey: 'paid_by', as: 'expenses' });

Expense.hasMany(ExpenseSplit, { foreignKey: 'expense_id', as: 'expenseSplits' });
ExpenseSplit.belongsTo(Expense, { foreignKey: 'expense_id', as: 'expense' });

Member.hasMany(ExpenseSplit, { foreignKey: 'member_id', as: 'splits' });
ExpenseSplit.belongsTo(Member, { foreignKey: 'member_id', as: 'member' });
