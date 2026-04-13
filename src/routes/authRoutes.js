import express from "express";
import jwt from "jsonwebtoken";
import pool from "../../db.js";

const router = express.Router();


// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name & Email required" });
    }

    // check if exists
    const [existing] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // insert
    const [result] = await pool.query(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );

    const user = {
      id: result.insertId,
      name,
      email
    };

    const token = jwt.sign(
      { user_id: user.id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.status(201).json({ user, token });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    const token = jwt.sign(
      { user_id: user.id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.json({ user, token });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;