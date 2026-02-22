const express = require("express");
const prisma = require("../prisma");
const { auth, librarian } = require("../middleware/auth");

const router = express.Router();

// Get all students (librarian)
router.get("/", auth, librarian, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { role: "STUDENT" },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
            orderBy: { createdAt: "desc" },
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch users", error: err.message });
    }
});

// Delete user (librarian)
router.delete("/:id", auth, librarian, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        // Check for active issues
        const activeIssues = await prisma.issue.count({ where: { userId, status: "ISSUED" } });
        if (activeIssues > 0) {
            return res.status(400).json({ message: "Cannot delete user with active issued books" });
        }
        await prisma.issue.deleteMany({ where: { userId } });
        await prisma.user.delete({ where: { id: userId } });
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete user", error: err.message });
    }
});

module.exports = router;
