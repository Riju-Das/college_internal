# Online Library Management System — Software Engineering Documentation

---

## 1. Use Case Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                 Online Library Management System                    │
│                                                                     │
│   ┌─────────────────────────┐    ┌─────────────────────────┐       │
│   │   UC1: Register         │    │   UC8: Add Book          │       │
│   └─────────────────────────┘    └─────────────────────────┘       │
│   ┌─────────────────────────┐    ┌─────────────────────────┐       │
│   │   UC2: Login / Logout   │    │   UC9: Update Book       │       │
│   └─────────────────────────┘    └─────────────────────────┘       │
│   ┌─────────────────────────┐    ┌─────────────────────────┐       │
│   │   UC3: Search Books     │    │   UC10: Delete Book      │       │
│   └─────────────────────────┘    └─────────────────────────┘       │
│   ┌─────────────────────────┐    ┌─────────────────────────┐       │
│   │   UC4: View Availability│    │   UC11: Manage Students  │       │
│   └─────────────────────────┘    └─────────────────────────┘       │
│   ┌─────────────────────────┐    ┌─────────────────────────┐       │
│   │   UC5: Issue Book       │    │   UC12: View Dashboard   │       │
│   └─────────────────────────┘    └─────────────────────────┘       │
│   ┌─────────────────────────┐    ┌─────────────────────────┐       │
│   │   UC6: Return Book      │───>│   UC13: Calculate Fine   │       │
│   └─────────────────────────┘    └──────────«include»───────┘       │
│   ┌─────────────────────────┐    ┌─────────────────────────┐       │
│   │   UC7: View History     │    │   UC14: Monitor Books    │       │
│   └─────────────────────────┘    └─────────────────────────┘       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

    Actor: Student                     Actor: Librarian
   ┌───┐                              ┌───┐
   │ O │                              │ O │
   │/│\│                              │/│\│
   │/ \│                              │/ \│
   └───┘                              └───┘
   Interacts with:                    Interacts with:
   UC1, UC2, UC3, UC4,               UC2, UC3, UC5, UC6,
   UC5, UC6, UC7                     UC8, UC9, UC10, UC11,
                                     UC12, UC14

    Actor: System
   ┌─────┐
   │ ⚙️  │
   └─────┘
   Interacts with:
   UC13 (Auto Fine Calculation)
```

### Use Case Descriptions

| Use Case ID | Use Case Name              | Actor(s)           | Description                                                                 |
|-------------|----------------------------|--------------------|-----------------------------------------------------------------------------|
| UC1         | Register                   | Student            | New users register with name, email, password, and role                     |
| UC2         | Login / Logout             | Student, Librarian | Users authenticate via email/password; JWT token manages sessions           |
| UC3         | Search Books               | Student, Librarian | Search books by title, author, or ISBN                                      |
| UC4         | View Book Availability     | Student            | View how many copies of a book are currently available                      |
| UC5         | Issue Book                 | Student, Librarian | Borrow an available book with a 14-day lending period                       |
| UC6         | Return Book                | Student, Librarian | Return an issued book; triggers fine calculation if overdue                 |
| UC7         | View Borrowing History     | Student            | View all past and current borrow records                                    |
| UC8         | Add Book                   | Librarian          | Add a new book with title, author, ISBN, category, and copies               |
| UC9         | Update Book                | Librarian          | Modify existing book details                                                |
| UC10        | Delete Book                | Librarian          | Remove a book from the system                                               |
| UC11        | Manage Student Accounts    | Librarian          | View all students; delete accounts (if no active issues)                    |
| UC12        | View Dashboard / Reports   | Librarian          | View statistics: total books, students, issued books, fines                 |
| UC13        | Calculate Fine             | System             | Automatically compute fine at $2/day when a book is returned late           |
| UC14        | Monitor Issued/Returned    | Librarian          | View all issue/return transactions across all students                      |

### Relationships
- **UC6 (Return Book) «include» → UC13 (Calculate Fine):** Every time a book is returned, the system automatically checks if it is overdue and calculates the fine.

---

## 2. Functional and Non-Functional Requirements

### 2.1 Functional Requirements

| FR ID  | Requirement                        | Description                                                                                                    | Actor(s)           |
|--------|------------------------------------|----------------------------------------------------------------------------------------------------------------|--------------------|
| FR-01  | User Registration                  | The system shall allow new users to register by providing name, email, password, and selecting a role (Student/Librarian). Passwords are hashed using bcrypt before storage. | Student, Librarian |
| FR-02  | User Authentication (Login/Logout) | The system shall authenticate users via email and password. On successful login, a JSON Web Token (JWT) with 7-day expiry is issued and stored in an HTTP-only cookie and localStorage. Logout clears the token. | Student, Librarian |
| FR-03  | Search Books                       | The system shall allow users to search for books by title, author, or ISBN. The search is case-insensitive and returns matching results in real time. | Student, Librarian |
| FR-04  | View Book Availability             | The system shall display the number of available copies out of total copies for each book.                     | Student, Librarian |
| FR-05  | Issue Book                         | The system shall allow a user to borrow an available book. The lending period is set to 14 days. The system decrements the available copies count atomically. A user cannot issue the same book twice simultaneously. | Student, Librarian |
| FR-06  | Return Book                        | The system shall allow a user to return an issued book. The available copies count is incremented atomically. The return date is recorded. | Student, Librarian |
| FR-07  | Automatic Fine Calculation         | The system shall automatically calculate a fine of $2 per day for books returned after the due date. The fine is calculated as: `days_late × $2`. | System             |
| FR-08  | View Borrowing History             | The system shall allow students to view their complete borrowing history including issue date, due date, return date, status, and any fines incurred. | Student            |
| FR-09  | Add Book                           | The system shall allow librarians to add new books with title, author, ISBN (unique), category, and number of copies. | Librarian          |
| FR-10  | Update Book                        | The system shall allow librarians to update book details. When total copies are changed, the available copies are adjusted to account for currently issued copies. | Librarian          |
| FR-11  | Delete Book                        | The system shall allow librarians to delete a book record from the system.                                     | Librarian          |
| FR-12  | Manage Student Accounts            | The system shall allow librarians to view all registered students and delete student accounts. A student with active issued books cannot be deleted. | Librarian          |
| FR-13  | Dashboard and Reports              | The system shall provide librarians with a dashboard showing: total books, total registered students, currently issued books count, total returned books count, and total fines collected. | Librarian          |
| FR-14  | Monitor Transactions               | The system shall allow librarians to view all issue/return transactions with filtering by status (All, Issued, Returned). | Librarian          |

### 2.2 Non-Functional Requirements

| NFR ID | Requirement                | Description                                                                                                    |
|--------|----------------------------|----------------------------------------------------------------------------------------------------------------|
| NFR-01 | Security                   | The system shall implement role-based access control (RBAC). JWT tokens authenticate all API requests. Passwords are hashed with bcrypt (10 salt rounds). Librarian-only routes are protected by middleware that checks the user's role. |
| NFR-02 | Data Persistence           | The system shall use a relational database (SQLite) managed through Prisma ORM. All data persists across server restarts. Database schema is version-controlled through migrations. |
| NFR-03 | Data Consistency           | The system shall use database transactions (Prisma `$transaction`) for issue and return operations to ensure that the Issue record and Book availability count are always updated atomically. |
| NFR-04 | Responsive User Interface  | The system shall provide a responsive web interface that works on desktop, tablet, and mobile devices. The UI uses Tailwind CSS with mobile-first responsive design patterns. |
| NFR-05 | Performance                | The system shall respond to API requests within acceptable time limits. Unique indexes on email and ISBN fields ensure fast lookups. Lightweight SQLite database minimizes overhead. |
| NFR-06 | Usability                  | The system shall provide clear user feedback through toast notifications for success/error states, loading indicators during data fetching, and intuitive navigation with role-based menu items. |
| NFR-07 | Maintainability            | The system shall follow a modular architecture with separation of concerns: separate route handlers, middleware, database layer (Prisma), React components, pages, and Zustand state stores. |
| NFR-08 | Scalability                | The system architecture shall support future migration to a more robust database (e.g., PostgreSQL) by changing only the Prisma datasource configuration. |

---

## 3. Class Diagram

```
┌─────────────────────────────┐       ┌─────────────────────────────┐
│           User              │       │           Book              │
├─────────────────────────────┤       ├─────────────────────────────┤
│ - id: int (PK)              │       │ - id: int (PK)              │
│ - name: String              │       │ - title: String             │
│ - email: String (unique)    │       │ - author: String            │
│ - password: String          │       │ - isbn: String (unique)     │
│ - role: String              │       │ - category: String          │
│ - createdAt: DateTime       │       │ - totalCopies: int          │
├─────────────────────────────┤       │ - availableCopies: int      │
│ + register(): void          │       │ - createdAt: DateTime       │
│ + login(): JWT              │       ├─────────────────────────────┤
│ + logout(): void            │       │ + search(query): Book[]     │
└──────────────┬──────────────┘       │ + checkAvailability(): bool │
               │ 1                    └──────────────┬──────────────┘
               │                                     │ 1
               │ has many                            │ has many
               │                                     │
               │ *                                   │ *
        ┌──────┴─────────────────────────────────────┴───────┐
        │                      Issue                          │
        ├─────────────────────────────────────────────────────┤
        │ - id: int (PK)                                      │
        │ - userId: int (FK → User)                           │
        │ - bookId: int (FK → Book)                           │
        │ - issueDate: DateTime                               │
        │ - dueDate: DateTime                                 │
        │ - returnDate: DateTime (nullable)                   │
        │ - fine: float                                       │
        │ - status: String ["ISSUED" | "RETURNED"]            │
        ├─────────────────────────────────────────────────────┤
        │ + issueBook(): Issue                                │
        │ + returnBook(): Issue                               │
        │ + calculateFine(): float                            │
        └─────────────────────────────────────────────────────┘

        ┌─────────────────────────────┐
        │      AuthController         │
        ├─────────────────────────────┤
        │ + register(req, res): void  │
        │ + login(req, res): void     │
        │ + logout(req, res): void    │
        │ + getMe(req, res): void     │
        └──────────────┬──────────────┘
                       │ manages
                       ▼
                     User

        ┌─────────────────────────────┐
        │      BookController         │
        ├─────────────────────────────┤
        │ + getAll(req, res): void    │
        │ + getById(req, res): void   │
        │ + create(req, res): void    │
        │ + update(req, res): void    │
        │ + delete(req, res): void    │
        └──────────────┬──────────────┘
                       │ manages
                       ▼
                     Book

        ┌──────────────────────────────────┐
        │        IssueController            │
        ├──────────────────────────────────┤
        │ + issueBook(req, res): void      │
        │ + returnBook(req, res): void     │
        │ + getIssues(req, res): void      │
        │ + getHistory(req, res): void     │
        │ + getDashboardStats(req, res)    │
        └──────────────┬───────────────────┘
                       │ manages
                       ▼
                 Issue, Book

        ┌─────────────────────────────┐
        │      AuthMiddleware         │
        ├─────────────────────────────┤
        │ + auth(req, res, next)      │
        │ + librarian(req, res, next) │
        └─────────────────────────────┘
```

### Class Relationships

| Relationship          | Type          | Cardinality | Description                                              |
|-----------------------|---------------|-------------|----------------------------------------------------------|
| User → Issue          | Association   | 1 to Many   | One user can have many issue records                     |
| Book → Issue          | Association   | 1 to Many   | One book can appear in many issue records                |
| AuthController → User | Dependency    | —           | AuthController manages User CRUD operations              |
| BookController → Book | Dependency    | —           | BookController manages Book CRUD operations              |
| IssueController → Issue, Book | Dependency | —     | IssueController manages Issue records and updates Book availability |
| AuthMiddleware → User | Dependency    | —           | Validates JWT tokens and checks user roles               |

---

## 4. Sequence Diagram — Book Issuing Process

```
 Student           React            Axios           Express          Auth             Issue            Prisma/
(Browser)         Frontend         (HTTP)           Server         Middleware        Controller        Database
   │                 │                │                │                │                │                │
   │  Click "Issue   │                │                │                │                │                │
   │  Book" button   │                │                │                │                │                │
   │────────────────>│                │                │                │                │                │
   │                 │                │                │                │                │                │
   │                 │ issueBook()    │                │                │                │                │
   │                 │───────────────>│                │                │                │                │
   │                 │                │                │                │                │                │
   │                 │                │ POST /api/     │                │                │                │
   │                 │                │ issues/issue   │                │                │                │
   │                 │                │ {bookId}       │                │                │                │
   │                 │                │ + JWT Token    │                │                │                │
   │                 │                │───────────────>│                │                │                │
   │                 │                │                │                │                │                │
   │                 │                │                │  auth(req)     │                │                │
   │                 │                │                │───────────────>│                │                │
   │                 │                │                │                │                │                │
   │                 │                │                │                │ Verify JWT     │                │
   │                 │                │                │                │ token          │                │
   │                 │                │                │                │                │                │
   │                 │                │                │  [Token Valid] │                │                │
   │                 │                │                │  req.user set  │                │                │
   │                 │                │                │<───────────────│                │                │
   │                 │                │                │                │                │                │
   │                 │                │                │  issueBook()   │                │                │
   │                 │                │                │────────────────────────────────>│                │
   │                 │                │                │                │                │                │
   │                 │                │                │                │                │ findUnique     │
   │                 │                │                │                │                │ (Book by id)   │
   │                 │                │                │                │                │───────────────>│
   │                 │                │                │                │                │                │
   │                 │                │                │                │                │  Book record   │
   │                 │                │                │                │                │<───────────────│
   │                 │                │                │                │                │                │
   │                 │                │                │                │                │ [Check: Book   │
   │                 │                │                │                │                │  exists?       │
   │                 │                │                │                │                │  copies > 0?]  │
   │                 │                │                │                │                │                │
   │                 │                │                │                │                │ findFirst      │
   │                 │                │                │                │                │ (existing      │
   │                 │                │                │                │                │  active issue) │
   │                 │                │                │                │                │───────────────>│
   │                 │                │                │                │                │                │
   │                 │                │                │                │                │ null (no dup)  │
   │                 │                │                │                │                │<───────────────│
   │                 │                │                │                │                │                │
   │                 │                │                │                │                │ Calculate      │
   │                 │                │                │                │                │ dueDate =      │
   │                 │                │                │                │                │ now + 14 days  │
   │                 │                │                │                │                │                │
   │                 │                │                │                │                │ $transaction:  │
   │                 │                │                │                │                │ 1. Create Issue│
   │                 │                │                │                │                │ 2. Decrement   │
   │                 │                │                │                │                │    available   │
   │                 │                │                │                │                │    copies      │
   │                 │                │                │                │                │───────────────>│
   │                 │                │                │                │                │                │
   │                 │                │                │                │                │ Issue created  │
   │                 │                │                │                │                │ + Book updated │
   │                 │                │                │                │                │<───────────────│
   │                 │                │                │                │                │                │
   │                 │                │                │ 201 Created    │                │                │
   │                 │                │                │ {issue record  │                │                │
   │                 │                │                │  with book &   │                │                │
   │                 │                │                │  user details} │                │                │
   │                 │                │<───────────────│<───────────────────────────────│                │
   │                 │                │                │                │                │                │
   │                 │  Success       │                │                │                │                │
   │                 │  response      │                │                │                │                │
   │                 │<───────────────│                │                │                │                │
   │                 │                │                │                │                │                │
   │                 │ Update Zustand │                │                │                │                │
   │                 │ store (add     │                │                │                │                │
   │                 │ new issue)     │                │                │                │                │
   │                 │                │                │                │                │                │
   │                 │ Refresh book   │                │                │                │                │
   │                 │ list (updated  │                │                │                │                │
   │                 │ availability)  │                │                │                │                │
   │                 │                │                │                │                │                │
   │  Show toast:    │                │                │                │                │                │
   │  "Book issued   │                │                │                │                │                │
   │  successfully!" │                │                │                │                │                │
   │<────────────────│                │                │                │                │                │
   │                 │                │                │                │                │                │
```

### Sequence Diagram — Step-by-Step Explanation

| Step | Component              | Action                                                                                       |
|------|------------------------|----------------------------------------------------------------------------------------------|
| 1    | Student (Browser)      | Clicks the "Issue Book" button on a book card in the Books page                              |
| 2    | React Frontend         | Calls `issueBook(bookId)` from the Zustand issue store                                       |
| 3    | Axios (HTTP Client)    | Sends `POST /api/issues/issue` with `{bookId}` in the body and JWT token in the Authorization header |
| 4    | Express Server         | Routes the request through the `auth` middleware                                             |
| 5    | Auth Middleware         | Extracts and verifies the JWT token. If valid, attaches user info to `req.user` and calls `next()`. If invalid, returns `401 Unauthorized`. |
| 6    | Issue Controller        | Receives the request and performs three validation checks:                                    |
| 6a   | → Prisma/Database      | **Check 1:** `findUnique` — Does the book exist? If not → `404 Book not found`               |
| 6b   | → Validation           | **Check 2:** Is `availableCopies > 0`? If not → `400 No copies available`                    |
| 6c   | → Prisma/Database      | **Check 3:** `findFirst` — Does the user already have this book issued? If yes → `400 Book already issued` |
| 7    | Issue Controller        | Calculates `dueDate = current date + 14 days`                                                |
| 8    | → Prisma/Database      | Executes a `$transaction` containing two operations: (1) Create a new Issue record with userId, bookId, and dueDate; (2) Decrement the book's `availableCopies` by 1. Both succeed or both fail. |
| 9    | Express Server         | Returns `201 Created` with the full Issue record (including book and user details)            |
| 10   | Axios → React          | Success response is received by the frontend                                                 |
| 11   | React Frontend         | Updates the Zustand store to add the new issue, refreshes the book list to show updated availability |
| 12   | Student (Browser)      | Sees a toast notification: "Book issued successfully!"                                        |

### Error Handling Paths

| Condition              | HTTP Status | Error Message                    | Handling                           |
|------------------------|-------------|----------------------------------|------------------------------------|
| Invalid/Missing JWT    | 401         | "Not authenticated"              | Axios interceptor redirects to login page |
| Book not found         | 404         | "Book not found"                 | Error toast displayed              |
| No copies available    | 400         | "No copies available"            | Error toast displayed              |
| Already issued to user | 400         | "Book already issued to this user" | Error toast displayed            |
| Server error           | 500         | "Failed to issue book"           | Error toast displayed              |
