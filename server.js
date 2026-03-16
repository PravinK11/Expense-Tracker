import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const port = process.env.PORT || 8080;

import expenseRoutes from "./src/routes/expensesRoute.js"
import usersRoutes from "./src/routes/usersRoutes.js"

app.use(express.json());

app.use('/expenses', expenseRoutes);
app.use('/users', usersRoutes );






app.listen(port, () => {
    console.log(`App is litening to the port ${port}`)
});