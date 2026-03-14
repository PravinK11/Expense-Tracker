const express= require('express');
const app=express();
const port=8080;
const path = require("path");


const pool = require("./db")






app.get('/expense',async (req, res)=>{
    // res.send(`all expenses to show by user`);

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

app.listen(port,() =>{
    console.log(`App is litening to the port ${port}`)
});