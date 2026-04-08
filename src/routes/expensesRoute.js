import express from 'express';
const router = express.Router();
import pool from "../../db.js";

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT expense.id,expense.user_id,expense.expense,expense.expense_amount,expense.expense_date,category.category FROM expenses expense JOIN category category ON expense.category_id = category.id;');
        if (!rows) {
            return res.status(400).json({ message: "expenses not found" })
        }
        return res.status(200).json(rows);
        res.send(rows);
    } catch (error) {
        return res.status(500).send(error)
    }

})

router.post("/", async (req, res) => {
    try {
        console.log(req.body)
        const { user_id,expense,expense_amount, expense_date,category_id } = req.body;
        
        if (!user_id || !expense || !expense_amount || !expense_date || !category_id) {
            res.status(400).json({ message: "all fields required" })
        }
        const queryString = 'insert into expenses (user_id,expense,expense_amount, expense_date,category_id) values(?,?,?,?,?)';
        const queryValues = [user_id,expense,expense_amount, expense_date,category_id];
        const result = await pool.query(queryString, queryValues);
        return res.status(200).json({ message: "expense added successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" }, error)
    }
})

router.put("/:id", async (req, res) => {
    try {
        const expense_id = req.params.id;
        const { expense, expense_amount, expense_date, category_id } = req.body;
        
        const queryString = 'UPDATE expenses SET  expense=?, expense_amount=?, expense_date=?, category_id=? WHERE id=?'
        const queryValues = [expense,expense_amount,expense_date,category_id,expense_id]
        const result = await pool.query(queryString, queryValues);
        return res.status(200).json({ message: "expense updated successfully" }, result)

    } catch (error) {
        return res.status(500).send(error)
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const expense_id = req.params.id;
        console.log(expense_id)
        const queryString = 'delete  from expenses where id=?'
        const queryValues = [expense_id]
        const result = await pool.query(queryString, queryValues);
        return res.status(200).send({ message: "expense deleted successfully" })
    } catch (error) {
        return res.status(500).send(error)
    }
})

export default router;