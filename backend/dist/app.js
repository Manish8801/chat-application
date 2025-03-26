import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/messages.routes.js";
import "dotenv/config";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import { app, server } from "./lib/socket.js";
import path from "path";
// server initialized
const PORT = process.env.PORT || 5001;
// path setup
const _dirname = path.resolve();
// middlewares
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "5     0mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*", (_, res) => {
    res.sendFile(path.join(_dirname, "frontend", "dist", "index.html"));
});
server.listen(PORT, () => {
    connectDB();
    console.log("Server listening on port : " + PORT);
});
