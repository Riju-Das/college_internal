import { useEffect, useState } from "react";
import useBookStore from "../stores/bookStore";
import useIssueStore from "../stores/issueStore";
import useAuthStore from "../stores/authStore";
import toast from "react-hot-toast";
import { HiOutlineSearch, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

export default function Books() {
    const { books, loading, fetchBooks, addBook, updateBook, deleteBook } = useBookStore();
    const { issueBook } = useIssueStore();
    const { user } = useAuthStore();
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [form, setForm] = useState({ title: "", author: "", isbn: "", category: "", totalCopies: 1 });

    const isLibrarian = user?.role === "LIBRARIAN";

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBooks(search);
    };

    const openAddModal = () => {
        setEditingBook(null);
        setForm({ title: "", author: "", isbn: "", category: "", totalCopies: 1 });
        setShowModal(true);
    };

    const openEditModal = (book) => {
        setEditingBook(book);
        setForm({
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            category: book.category,
            totalCopies: book.totalCopies,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { ...form, totalCopies: parseInt(form.totalCopies) };

        let result;
        if (editingBook) {
            result = await updateBook(editingBook.id, data);
        } else {
            result = await addBook(data);
        }

        if (result.success) {
            toast.success(editingBook ? "Book updated!" : "Book added!");
            setShowModal(false);
            fetchBooks(search);
        } else {
            toast.error(result.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        const result = await deleteBook(id);
        if (result.success) {
            toast.success("Book deleted!");
        } else {
            toast.error(result.message);
        }
    };

    const handleIssue = async (bookId) => {
        const result = await issueBook(bookId);
        if (result.success) {
            toast.success("Book issued successfully!");
            fetchBooks(search);
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    {isLibrarian ? "Book Management" : "Browse Books"}
                </h1>
                {isLibrarian && (
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        <HiOutlinePlus /> Add Book
                    </button>
                )}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title, author, or ISBN..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* Book Grid */}
            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading books...</div>
            ) : books.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No books found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book) => (
                        <div key={book.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-semibold text-gray-800 leading-tight">{book.title}</h3>
                                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                                    {book.category}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-1">by {book.author}</p>
                            <p className="text-gray-400 text-xs mb-4">ISBN: {book.isbn}</p>

                            <div className="flex items-center justify-between">
                                <div>
                                    <span
                                        className={`text-sm font-medium ${book.availableCopies > 0 ? "text-green-600" : "text-red-600"
                                            }`}
                                    >
                                        {book.availableCopies > 0
                                            ? `${book.availableCopies} of ${book.totalCopies} available`
                                            : "Not available"}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    {isLibrarian ? (
                                        <>
                                            <button
                                                onClick={() => openEditModal(book)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Edit"
                                            >
                                                <HiOutlinePencil />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(book.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <HiOutlineTrash />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleIssue(book.id)}
                                            disabled={book.availableCopies <= 0}
                                            className="bg-indigo-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Issue Book
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {editingBook ? "Edit Book" : "Add New Book"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                                <input
                                    type="text"
                                    value={form.author}
                                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                                <input
                                    type="text"
                                    value={form.isbn}
                                    onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <input
                                    type="text"
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Copies</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={form.totalCopies}
                                    onChange={(e) => setForm({ ...form, totalCopies: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                                >
                                    {editingBook ? "Update" : "Add Book"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
