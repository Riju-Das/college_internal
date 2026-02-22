const express = require("express");
const prisma = require("../prisma");
const { auth, librarian } = require("../middleware/auth");

const router = express.Router();

const FINE_PER_DAY = 2; // $2 per day late

// Issue a book
router.post("/issue", auth, async (req, res) => {
    try {
        const { bookId, userId } = req.body;
        const targetUserId = userId || req.user.id;

        // Only librarian can issue on behalf of others
        if (userId && userId !== req.user.id && req.user.role !== "LIBRARIAN") {
            return res.status(403).json({ message: "Only librarians can issue books for others" });
        }

        const book = await prisma.book.findUnique({ where: { id: bookId } });
        if (!book) return res.status(404).json({ message: "Book not found" });
        if (book.availableCopies <= 0) return res.status(400).json({ message: "No copies available" });

        // Check if user already has this book issued
        const existing = await prisma.issue.findFirst({
            where: { userId: targetUserId, bookId, status: "ISSUED" },
        });
        if (existing) return res.status(400).json({ message: "Book already issued to this user" });

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14); // 14-day lending period

        const [issue] = await prisma.$transaction([
            prisma.issue.create({
                data: { userId: targetUserId, bookId, dueDate },
                include: { book: true, user: { select: { id: true, name: true, email: true } } },
            }),
            prisma.book.update({
                where: { id: bookId },
                data: { availableCopies: { decrement: 1 } },
            }),
        ]);

        res.status(201).json(issue);
    } catch (err) {
        res.status(500).json({ message: "Failed to issue book", error: err.message });
    }
});

// Return a book
router.post("/return/:issueId", auth, async (req, res) => {
    try {
        const issueId = parseInt(req.params.issueId);
        const issue = await prisma.issue.findUnique({ where: { id: issueId }, include: { book: true } });
        if (!issue) return res.status(404).json({ message: "Issue record not found" });
        if (issue.status === "RETURNED") return res.status(400).json({ message: "Book already returned" });

        // Only the user or a librarian can return
        if (issue.userId !== req.user.id && req.user.role !== "LIBRARIAN") {
            return res.status(403).json({ message: "Not authorized" });
        }

        const now = new Date();
        let fine = 0;
        if (now > new Date(issue.dueDate)) {
            const daysLate = Math.ceil((now - new Date(issue.dueDate)) / (1000 * 60 * 60 * 24));
            fine = daysLate * FINE_PER_DAY;
        }

        const [updated] = await prisma.$transaction([
            prisma.issue.update({
                where: { id: issueId },
                data: { status: "RETURNED", returnDate: now, fine },
                include: { book: true, user: { select: { id: true, name: true, email: true } } },
            }),
            prisma.book.update({
                where: { id: issue.bookId },
                data: { availableCopies: { increment: 1 } },
            }),
        ]);

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Failed to return book", error: err.message });
    }
});

// Get all issues (librarian) or user's issues
router.get("/", auth, async (req, res) => {
    try {
        const where = req.user.role === "LIBRARIAN" ? {} : { userId: req.user.id };
        const { status } = req.query;
        if (status) where.status = status;

        const issues = await prisma.issue.findMany({
            where,
            include: {
                book: true,
                user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { issueDate: "desc" },
        });
        res.json(issues);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch issues", error: err.message });
    }
});

// Get borrowing history for a user
router.get("/history/:userId", auth, async (req, res) => {
    try {
        const targetUserId = parseInt(req.params.userId);
        if (targetUserId !== req.user.id && req.user.role !== "LIBRARIAN") {
            return res.status(403).json({ message: "Not authorized" });
        }

        const issues = await prisma.issue.findMany({
            where: { userId: targetUserId },
            include: { book: true },
            orderBy: { issueDate: "desc" },
        });
        res.json(issues);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch history", error: err.message });
    }
});

// Dashboard stats (librarian)
router.get("/stats/dashboard", auth, librarian, async (req, res) => {
    try {
        const [totalBooks, totalUsers, totalIssued, totalReturned, totalFines] = await Promise.all([
            prisma.book.count(),
            prisma.user.count({ where: { role: "STUDENT" } }),
            prisma.issue.count({ where: { status: "ISSUED" } }),
            prisma.issue.count({ where: { status: "RETURNED" } }),
            prisma.issue.aggregate({ _sum: { fine: true }, where: { status: "RETURNED" } }),
        ]);

        res.json({
            totalBooks,
            totalUsers,
            totalIssued,
            totalReturned,
            totalFines: totalFines._sum.fine || 0,
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch stats", error: err.message });
    }
});

module.exports = router;
