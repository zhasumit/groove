import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import { connectDB } from "./lib/db.js";
import fileupload from "express-fileupload";
import path from "path";

import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statsRoutes from "./routes/stats.route.js";

dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // parse req.body
app.use(clerkMiddleware()); // add clerk auth to req object

app.use(
    fileupload({
        useTempFiles: true,
        tempFileDir: path.join(__dirname, "tmp"),
        createParentPath: true,
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB max size
        },
    })
);

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statsRoutes);

app.use((err, req, res, next) => {
    res.status(500).json({
        message:
            process.env.NODE_ENV === "production"
                ? "Internal Server Error"
                : err.message,
        error: err.stack || "",
    });
});

app.listen(PORT, () => {
    console.log(`Server up at http://localhost:${PORT}/`);
    connectDB();
});
