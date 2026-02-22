const express = require("express");
const prisma = require("../prisma");
const { auth, librarian } = require("../middleware/auth");

const router = express.Router();

// Get all books (with search)
router.get("/", auth, async (req, res) => {
    try {
        const { search, category } = req.query;
        const where = {};

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { author: { contains: search } },
                { isbn: { contains: search } },
            ];
        }
        if (category) {
            where.category = category;
        }

        const books = await prisma.book.findMany({ where, orderBy: { createdAt: "desc" } });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch books", error: err.message });
    }
});

// Get single book
router.get("/:id", auth, async (req, res) => {
    try {
        const book = await prisma.book.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!book) return res.status(404).json({ message: "Book not found" });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch book", error: err.message });
    }
});

// Add book (librarian)
router.post("/", auth, librarian, async (req, res) => {
    try {
        const { title, author, isbn, category, totalCopies } = req.body;
        const book = await prisma.book.create({
            data: { title, author, isbn, category, totalCopies: totalCopies || 1, availableCopies: totalCopies || 1 },
        });
        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({ message: "Failed to add book", error: err.message });
    }
});

// Update book (librarian)
router.put("/:id", auth, librarian, async (req, res) => {
    try {
        const { title, author, isbn, category, totalCopies } = req.body;
        const existing = await prisma.book.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!existing) return res.status(404).json({ message: "Book not found" });

        const issuedCopies = existing.totalCopies - existing.availableCopies;
        const newTotal = totalCopies || existing.totalCopies;
        const newAvailable = newTotal - issuedCopies;

        const book = await prisma.book.update({
            where: { id: parseInt(req.params.id) },
            data: { title, author, isbn, category, totalCopies: newTotal, availableCopies: Math.max(0, newAvailable) },
        });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: "Failed to update book", error: err.message });
    }
});

// Delete book (librarian)
router.delete("/:id", auth, librarian, async (req, res) => {
    try {
        await prisma.book.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: "Book deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete book", error: err.message });
    }
});

// Get all categories
router.get("/meta/categories", auth, async (req, res) => {
    try {
        const books = await prisma.book.findMany({ select: { category: true }, distinct: ["category"] });
        res.json(books.map((b) => b.category));
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch categories", error: err.message });
    }
});

module.exports = router;
