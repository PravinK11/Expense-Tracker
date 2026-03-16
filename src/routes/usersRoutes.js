import express from 'express';
const router = express.Router();
import pool from "../../db.js";

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('select * from users');
        if (!rows) {
            return res.status(400).json({ message: "users not found" })
        }
        return res.status(200).json(rows);
        // res.send(rows);
    } catch (error) {
        return res.status(500).send(error)
    }

})

router.get('/:id', async (req, res) => {
    try {
        const id= req.params.id
        const [rows] = await pool.query('select * from users where id=?',id);
        if (!rows) {
            return res.status(400).json({ message: "users not found" })
        }
        return res.status(200).json(rows);
        // res.send(rows);
    } catch (error) {
        return res.status(500).send(error)
    }

})


export default router;