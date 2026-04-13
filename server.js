import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";

import budgetRoutes from "./src/routes/budgetRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import expenseRoutes from "./src/routes/expensesRoute.js"
import usersRoutes from "./src/routes/usersRoutes.js"

const app = express();
dotenv.config();

const port = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log("Incoming Request:", req.method, req.url);
  next();
});

app.use("/budget", budgetRoutes);
app.use("/auth", authRoutes);
app.use('/expenses', expenseRoutes);
app.use('/users', usersRoutes );

app.listen(port, () => {
    console.log(`App is litening to the port ${port}`)
});