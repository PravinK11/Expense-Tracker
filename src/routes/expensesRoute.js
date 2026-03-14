import express from 'express';
const router= express.Router();
import pool from "../../db.js";

router.get('/',async (req, res)=>{
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

export default router;