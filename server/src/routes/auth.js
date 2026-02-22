const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ message: "Email already registered" });

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashed, role: role || "STUDENT" },
        });

        res.status(201).json({ message: "User registered successfully", user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
});

// Logout
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});

// Get current user
router.get("/me", auth, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to get user", error: err.message });
    }
});

module.exports = router;
