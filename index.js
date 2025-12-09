import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.DB_URI;

let client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

// Connect and assign DB & collections **once at startup**
await client.connect();
const db = client.db("contest_craze_db");
const usersCollection = db.collection("users_collections");
const anotherCollection = db.collection("another_collection");

console.log("MongoDB connected ...");

// =================================================
// ROUTES
// =================================================

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.get("/users", async (req, res) => {
    try {
        const users = await usersCollection.find().toArray();
        res.status(200).json(users);
    } catch (err) {
        console.error("Error loading users:", err);
        res.status(500).json({ error: "Failed to load users" });
    }
});

app.post("/exam", async (req, res) => {
    try {
        const newUser = req.body;
        console.log(newUser);
        const result = await anotherCollection.insertOne(newUser);
        res.status(201).json(result);
    } catch (err) {
        console.error("Insert error:", err);
        res.status(500).json({ error: "Failed to insert user" });
    }
});

// =======================================================
// LOCAL DEVELOPMENT
// =======================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Local server running at http://localhost:3000/");
});


export default app;
