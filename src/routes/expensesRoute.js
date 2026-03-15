import express from 'express';
const router = express.Router();
import pool from "../../db.js";

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('select * from expenses where user_id=5');
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


export default router;