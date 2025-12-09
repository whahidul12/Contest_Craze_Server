import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());
// =============================================

const uri = process.env.DB_URI;
let client;
let db;

async function getDB() {
    if (!client) {
        client = new MongoClient(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        await client.connect();
        db = client.db("contest_craze_db");
        console.log("MongoDB Connected");
    }
    return db;
}

// ==================================================
app.get("/", (req, res) => {
    res.send("Backend is running");
});

// GET /users
app.get("/users", async (req, res) => {
    try {
        const database = await getDB();
        const users = await database
            .collection("users_collections")
            .find()
            .toArray();

        res.status(200).json(users);
    } catch (err) {
        console.error("Error loading users:", err);
        res.status(500).json({ error: "Failed to load users" });
    }
});

// =======================================================
if (!process.env.VERCEL) {
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log("Local server running at http://localhost:3000/");
    });
}


export default app;
