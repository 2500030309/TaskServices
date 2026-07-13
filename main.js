import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";
import commentRouter from "./controllers/commentControllers.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 8002;
const HOST = process.env.HOST || "0.0.0.0";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: 200,
        message: "Ticket comments service running"
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: 200,
        service: "ticket-comments-service",
        mongo: "connected"
    });
});

app.get("/error", (req, res) => {
    res.status(500).json({
        code: 500,
        message: "Application error"
    });
});

app.use("/comments", commentRouter);

app.use((req, res) => {
    res.status(404).json({
        code: 404,
        message: `Route ${req.method} ${req.originalUrl} not found`
    });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        code: err.status || 500,
        message: err.message || "Internal server error"
    });
});

async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, HOST, () => {
            console.log(`Node Server Running on port ${PORT} on host ${HOST}`);
        });
    } catch (err) {
        console.error("Server startup failed:", err.message);
        process.exit(1);
    }
}

startServer();
