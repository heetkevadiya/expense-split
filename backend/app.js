import express from "express"
import cors from "cors";
import Usercontroller from "./usercontroller/usercontroller.js"
import "./Association.js"

const app=express()

app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(express.json());

app.get("/member",Usercontroller.Member)
app.get("/group",Usercontroller.Group)
app.get('/groupmember/:groupId', Usercontroller.Groupmember);
app.get("/expense/:groupId", Usercontroller.Expense);
app.get("/expensesplit/:expenseId", Usercontroller.ExpenseSplit);
app.get("/member/:memberId/groups", Usercontroller.MemberGroups);
app.get("/settlement/:groupId", Usercontroller.GetSettlements);

app.post("/group", Usercontroller.CreateGroup);
app.post("/expense/:groupId", Usercontroller.CreateExpense);
app.post("/settlement/:groupId", Usercontroller.CreateSettlement);

app.listen(5000,()=>{
    console.log("server is running at http://localhost:5000")
})
