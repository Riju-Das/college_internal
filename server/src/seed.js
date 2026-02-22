require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("./prisma");

async function seed() {
    console.log("Seeding database...");

    // Create librarian
    const libPass = await bcrypt.hash("admin123", 10);
    await prisma.user.upsert({
        where: { email: "librarian@library.com" },
        update: {},
        create: { name: "Admin Librarian", email: "librarian@library.com", password: libPass, role: "LIBRARIAN" },
    });

    // Create a student
    const stuPass = await bcrypt.hash("student123", 10);
    await prisma.user.upsert({
        where: { email: "student@library.com" },
        update: {},
        create: { name: "John Student", email: "student@library.com", password: stuPass, role: "STUDENT" },
    });

    // Create sample books
    const books = [
        { title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "978-0262033848", category: "Computer Science", totalCopies: 5, availableCopies: 5 },
        { title: "Clean Code", author: "Robert C. Martin", isbn: "978-0132350884", category: "Software Engineering", totalCopies: 3, availableCopies: 3 },
        { title: "Design Patterns", author: "Erich Gamma", isbn: "978-0201633610", category: "Software Engineering", totalCopies: 2, availableCopies: 2 },
        { title: "The Pragmatic Programmer", author: "David Thomas", isbn: "978-0135957059", category: "Software Engineering", totalCopies: 4, availableCopies: 4 },
        { title: "Database System Concepts", author: "Abraham Silberschatz", isbn: "978-0078022159", category: "Database", totalCopies: 3, availableCopies: 3 },
        { title: "Computer Networks", author: "Andrew S. Tanenbaum", isbn: "978-0132126953", category: "Networking", totalCopies: 2, availableCopies: 2 },
        { title: "Operating System Concepts", author: "Abraham Silberschatz", isbn: "978-1118063330", category: "Operating Systems", totalCopies: 3, availableCopies: 3 },
        { title: "Artificial Intelligence", author: "Stuart Russell", isbn: "978-0136042594", category: "AI", totalCopies: 2, availableCopies: 2 },
        { title: "Data Structures and Algorithms", author: "Michael T. Goodrich", isbn: "978-1118771334", category: "Computer Science", totalCopies: 4, availableCopies: 4 },
        { title: "Software Engineering", author: "Ian Sommerville", isbn: "978-0133943030", category: "Software Engineering", totalCopies: 3, availableCopies: 3 },
    ];

    for (const book of books) {
        await prisma.book.upsert({
            where: { isbn: book.isbn },
            update: {},
            create: book,
        });
    }

    console.log("Seeding complete!");
    console.log("Librarian: librarian@library.com / admin123");
    console.log("Student: student@library.com / student123");
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
