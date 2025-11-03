import dbconfig from "../config/cofig.js";

import MemberModel from "../model/member.js";
import GroupModel from "../model/group.js";
import GroupmemberModel from "../model/group member.js";
import ExpenseModel from "../model/expense.js";
import ExpensesplitModel from "../model/expense split.js";

const model = dbconfig.Sequelize.Model;
const sequelize = dbconfig.sequelizeTZ;

const Member = async (req, res) => {
  try {
    let result = await MemberModel.findAll();
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const Group = async (req, res) => {
  try {
    let result = await GroupModel.findAll();
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const Groupmember = async (req, res) => {
  try {
    const { groupId } = req.params;

    let result = await GroupmemberModel.findAll({
      where: { group_id: groupId },
      include: [
        {
          model: MemberModel,
          as: "member",
          attributes: ["id", "name"],
        },
      ],
    });

    const groupData = {
      group_id: groupId,
      members: result.map((r) => ({
        id: r.member.id,
        name: r.member.name,
      })),
    };

    res.status(200).json(groupData);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const Expense = async (req, res) => {
  const { groupId } = req.params;

  let result = await ExpenseModel.findAll({
    where: { group_id: groupId },
    include: [
      {
        model: MemberModel,
        as: "payer",
        attributes: ["id", "name"],
      },
      {
        model: ExpensesplitModel,
        as: "expenseSplits",
        include: [
          {
            model: MemberModel,
            as: "member",
            attributes: ["id", "name"],
          },
        ],
      },
    ],
    attributes: ["id", "description", "amount", "split_type", "created_at"],
  });

  const expenseData = {
    group_id: groupId,
    expenses: result.map((e) => ({
      id: e.id,
      description: e.description,
      amount: e.amount,
      split_type: e.split_type,
      paid_by: e.payer ? e.payer.name : null,
      created_at: e.created_at,
      splits: e.expenseSplits.map((s) => ({
        member_name: s.member.name,
        amount: s.amount,
      })),
    })),
  };

  res.status(200).json(expenseData);
};

const ExpenseSplit = async (req, res) => {
  try {
    const { expenseId } = req.params;

    let result = await ExpensesplitModel.findAll({
      where: { expense_id: expenseId },
      include: [
        {
          model: MemberModel,
          as: "member",
          attributes: ["id", "name"],
        },
      ],
    });

    const splitData = {
      expense_id: expenseId,
      splits: result.map((s) => ({
        id: s.id,
        member_id: s.member_id,
        member_name: s.member ? s.member.name : null,
        amount: s.amount,
      })),
    };

    res.status(200).json(splitData);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const MemberGroups = async (req, res) => {
  try {
    const { memberId } = req.params;

    let result = await GroupmemberModel.findAll({
      where: { user_id: memberId },
      include: [
        {
          model: GroupModel,
          as: "group",
          attributes: ["id", "name", "created_at"],
        },
      ],
    });

    const memberGroupData = {
      member_id: memberId,
      total_groups: result.length,
      groups: result.map((r) => ({
        id: r.group.id,
        name: r.group.name,
        created_at: r.group.created_at,
      })),
    };

    res.status(200).json(memberGroupData);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const CreateGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name || !members || !Array.isArray(members)) {
      return res
        .status(400)
        .json({ error: "Group name and members array are required" });
    }

    const newGroup = await GroupModel.create({ name });

    for (const memberId of members) {
      await GroupmemberModel.create({
        group_id: newGroup.id,
        user_id: memberId,
      });
    }

    res
      .status(201)
      .json({ message: "Group created successfully", group: newGroup });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const CreateExpense = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { description, amount, paid_by, splits } = req.body;

    if (!description || !amount || !paid_by || !splits || !Array.isArray(splits)) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newExpense = await ExpenseModel.create({
      group_id: groupId,
      description,
      amount,
      paid_by,
      split_type: 'manual'
    });

    for (const split of splits) {
      await ExpensesplitModel.create({
        expense_id: newExpense.id,
        member_id: split.member_id,
        amount: split.amount
      });
    }

    res.status(201).json({ message: 'Expense created successfully', expense: newExpense });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export default {
  Member,
  Group,
  Groupmember,
  Expense,
  ExpenseSplit,
  MemberGroups,
  CreateGroup,
  CreateExpense,
};
