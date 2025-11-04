import dbconfig from "../config/cofig.js";

import MemberModel from "../model/member.js";
import GroupModel from "../model/group.js";
import GroupmemberModel from "../model/group member.js";
import ExpenseModel from "../model/expense.js";
import ExpensesplitModel from "../model/expense split.js";
import SettlementModel from "../model/settlment.js";

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
        attributes: ["id", "name"],
      },
      {
        model: ExpensesplitModel,
        include: [
          {
            model: MemberModel,
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
      paid_by: e.Member ? e.Member.name : null,
      created_at: e.created_at,
      splits: e.ExpenseSplits.map((s) => ({
        member_name: s.Member.name,
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
          attributes: ["id", "name"],
        },
      ],
    });

    const splitData = {
      expense_id: expenseId,
      splits: result.map((s) => ({
        id: s.id,
        member_id: s.member_id,
        member_name: s.Member ? s.Member.name : null,
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

    if (
      !description ||
      !amount ||
      !paid_by ||
      !splits ||
      !Array.isArray(splits)
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newExpense = await ExpenseModel.create({
      group_id: groupId,
      description,
      amount,
      paid_by,
      split_type: "manual",
    });

    for (const split of splits) {
      await ExpensesplitModel.create({
        expense_id: newExpense.id,
        member_id: split.member_id,
        amount: split.amount,
      });
    }

    res
      .status(201)
      .json({ message: "Expense created successfully", expense: newExpense });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const GetSettlements = async (req, res) => {
  try {
    const { groupId } = req.params;

    let result = await SettlementModel.findAll({
      where: { group_id: groupId },
      include: [
        {
          model: MemberModel,
          as: "fromMember",
          attributes: ["id", "name"],
        },
        {
          model: MemberModel,
          as: "toMember",
          attributes: ["id", "name"],
        },
      ],
    });

    const settlementData = {
      group_id: groupId,
      settlements: result.map((s) => ({
        id: s.id,
        from_member_id: s.from_member_id,
        payer_name: s.fromMember ? s.fromMember.name : null,
        to_member_id: s.to_member_id,
        receiver_name: s.toMember ? s.toMember.name : null,
        amount: s.amount,
        status: s.status,
        created_at: s.created_at,
        updated_at: s.updated_at,
      })),
    };

    res.status(200).json(settlementData);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Create or update a settlement (mark as paid)
const CreateSettlement = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { from_member_id, to_member_id, amount } = req.body;

    if (!from_member_id || !to_member_id || !amount) {
      return res
        .status(400)
        .json({ error: "from_member_id, to_member_id, and amount are required" });
    }

    // Check if already paid settlement exists
    const existingPaid = await SettlementModel.findOne({
      where: {
        group_id: groupId,
        from_member_id,
        to_member_id,
        amount,
        status: "paid",
      },
    });

    if (existingPaid) {
      return res.status(400).json({ error: "Settlement already paid" });
    }

    // Check if there is a pending settlement
    const pendingSettlement = await SettlementModel.findOne({
      where: {
        group_id: groupId,
        from_member_id,
        to_member_id,
        amount,
        status: "pending",
      },
    });

    if (pendingSettlement) {
      pendingSettlement.status = "paid";
      pendingSettlement.updated_at = new Date();
      await pendingSettlement.save();

      return res.status(200).json({
        message: "Settlement updated successfully",
        settlement: pendingSettlement,
      });
    }

    // Create new settlement record (paid directly)
    const newSettlement = await SettlementModel.create({
      group_id: groupId,
      from_member_id,
      to_member_id,
      amount,
      status: "paid",
    });

    res.status(201).json({
      message: "Settlement recorded successfully",
      settlement: newSettlement,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const GroupBalance = async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await ExpenseModel.findAll({
      where: { group_id: groupId },
      include: [
        {
          model: ExpensesplitModel,
        },
      ],
    });
    const settlements = await SettlementModel.findAll({
      where: { group_id: groupId },
    });

    const balances = {};
    expenses.forEach((exp) => {
      //credit to payer
      if (!balances[exp.paid_by]) balances[exp.paid_by] = 0;
      balances[exp.paid_by] += parseFloat(exp.amount);
      //debit to each member
      exp.expenseSplits.forEach((s) => {
        if (!balances[s.member_id]) balances[s.member_id] = 0;
        balances[s.member_id] -= parseFloat(s.amount);
      });
    });
    //settlement - only consider paid settlements
    settlements.forEach((s) => {
      if (s.status === "paid") {
        if (!balances[s.from_member_id]) balances[s.from_member_id] = 0;
        if (!balances[s.to_member_id]) balances[s.to_member_id] = 0;
        balances[s.from_member_id] -= parseFloat(s.amount);
        balances[s.to_member_id] += parseFloat(s.amount);
      }
    });

    const memberIds = Object.keys(balances);
    const members = await MemberModel.findAll({
      where: { id: memberIds },
      attributes: ["id", "name"],
    });

    const balanceData = {
      
      group_id: groupId,
      members: members.map((m) => ({
        id: m.id,
        name: m.name,
        balance: parseFloat(balances[m.id] || 0).toFixed(2),
        status:
          balances[m.id] > 0 ? "gets" : balances[m.id] < 0 ? "owes" : "settled",
      })),
    };

    res.status(200).json(balanceData);
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
  GetSettlements,
  CreateSettlement,
  GroupBalance
};
