import express from 'express';
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();
import pool from "../../db.js";

router.get("/", authMiddleware, async (req, res) => {
    try {
        const user_id = req.user.user_id;

        const [rows] = await pool.query(
            `SELECT expense.id, expense.user_id, expense.expense,
            expense.expense_amount, expense.expense_date, category.category
            FROM expenses expense
            JOIN category category ON expense.category_id = category.id
            WHERE expense.user_id = ?`,
            [user_id]
        );

        return res.status(200).json(rows);

    } catch (error) {
        return res.status(500).send(error);
    }
});

router.post("/", authMiddleware, async (req, res) => {
    try {
        const user_id = req.user.user_id;

        const { expense, expense_amount, expense_date, category_id } = req.body;

        console.log("BODY:", req.body);

        if (
            expense === undefined ||
            expense_amount === undefined ||
            expense_date === undefined ||
            category_id === undefined
        ) {
            return res.status(400).json({ message: "all fields required" });
        }

        const query = `
            INSERT INTO expenses (user_id, expense, expense_amount, expense_date, category_id)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result]=await pool.query(query, [
            user_id,
            expense,
            expense_amount,
            expense_date,
            category_id
        ]);

        return res.status(201).json({
            message: "expense added",
            expense: {
                id: result.insertId,
                user_id,
                expense,
                expense_amount,
                expense_date,
                category_id
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const expense_id = req.params.id;
        const { expense, expense_amount, expense_date, category_id } = req.body;

        const queryString = 'UPDATE expenses SET  expense=?, expense_amount=?, expense_date=?, category_id=? WHERE id=?'
        const queryValues = [expense, expense_amount, expense_date, category_id, expense_id]
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