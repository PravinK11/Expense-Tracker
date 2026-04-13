import express from "express";
import pool from "../../db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();


// ✅ ADD BUDGET
router.post("/", authMiddleware, async (req, res) => {
    try {
        const user_id = req.user.user_id;

        const { budget_amount, month } = req.body;

        // ✅ validation
        if (budget_amount == null || month == null) {
            return res.status(400).json({ message: "all fields required" });
        }

        // 🔍 check if budget already exists for same month
        const [existing] = await pool.query(
            "SELECT * FROM budget WHERE user_id = ? AND month = ?",
            [user_id, month]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: "Budget already exists for this month"
            });
        }

        // 🆕 insert
        const [result] = await pool.query(
            "INSERT INTO budget (user_id, budget_amount, month) VALUES (?, ?, ?)",
            [user_id, budget_amount, month]
        );

        return res.status(201).json({
            message: "Budget added successfully",
            budget: {
                id: result.insertId,
                user_id,
                budget_amount,
                month
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error" });
    }
});

// ✅ GET LATEST BUDGET
router.get("/latest", authMiddleware, async (req, res) => {
    try {
        const user_id = req.user.user_id;

        const [rows] = await pool.query(
            `SELECT * FROM budget 
             WHERE user_id = ? 
             ORDER BY month DESC 
             LIMIT 1`,
            [user_id]
        );

        if (rows.length === 0) {
            return res.status(200).json(null); // no budget yet
        }

        return res.status(200).json(rows[0]);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error" });
    }
});

// ✅ GET USER BUDGETS
router.get("/", authMiddleware, async (req, res) => {
    try {
        const user_id = req.user.user_id;

        const [rows] = await pool.query(
            "SELECT * FROM budget WHERE user_id = ? ORDER BY month DESC",
            [user_id]
        );

        return res.status(200).json(rows);

    } catch (error) {
        return res.status(500).json({ message: "error" });
    }
});

export default router;