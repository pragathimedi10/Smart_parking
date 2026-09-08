require("dotenv").config();

const express = require("express");
const cors=require("cors");
const mysql=require("mysql2");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());


// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME  
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err);
        return;
    }

    console.log("MySQL connected successfully!");
});

app.get("/", (req, res) => {
    res.send("Smart Parking Backend is running!");
});

app.get("/api/slots", (req, res) => {
    db.query("SELECT * FROM slots", (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(results);
    });
});


app.post("/api/slots/:id/reserve", (req, res) => {

    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1 || id > 10) {
    return res.status(400).json({
        message: "Invalid parking slot"
    });
}

    const sql = `
        UPDATE slots
        SET status = 'Occupied'
        WHERE id = ? AND status = 'Available'
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({
                message: "Slot is already occupied or does not exist"
            });
        }

        // Save reservation in history
        db.query(
            "INSERT INTO parking_history (slot_id, action) VALUES (?, 'Reserved')",
            [id],
            (err) => {

                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "History database error"
                    });
                }

                res.json({
                    message: "Slot reserved successfully"
                });
            }
        );
    });
});

app.post("/api/slots/:id/release", (req, res) => {

    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1 || id > 10) {
    return res.status(400).json({
        message: "Invalid parking slot"
    });
}


    const sql = `
        UPDATE slots
        SET status = 'Available'
        WHERE id = ? AND status = 'Occupied'
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({
                message: "Slot is already available or does not exist"
            });
        }

        // Save release in history
        db.query(
            "INSERT INTO parking_history (slot_id, action) VALUES (?, 'Released')",
            [id],
            (err) => {

                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "History database error"
                    });
                }

                res.json({
                    message: "Slot released successfully"
                });
            }
        );
    });
});

app.get("/api/history", (req, res) => {

    const sql = `
        SELECT *
        FROM parking_history
        ORDER BY action_time DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(results);
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on https://smart-parking-hi4o.onrender.com/`);
});
