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


const allowedOrigins = [
  // "http://localhost:5173", // for local development
  "https://expense-ui-navy.vercel.app" // your live frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log("Incoming Request:", req.method, req.url);
  next();
});

app.use("/budget", budgetRoutes);
app.use("/auth", authRoutes);
app.use('/expenses', expenseRoutes);
app.use('/users', usersRoutes );

app.listen(port, '0.0.0.0', () => {
    console.log(`App is litening to the port ${port}`)
});