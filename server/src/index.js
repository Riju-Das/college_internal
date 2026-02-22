require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const issueRoutes = require("./routes/issues");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"], credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Library Management System API" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
