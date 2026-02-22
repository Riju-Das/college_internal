import { create } from "zustand";
import api from "../lib/api";

const useBookStore = create((set) => ({
    books: [],
    loading: false,

    fetchBooks: async (search = "", category = "") => {
        set({ loading: true });
        try {
            const params = {};
            if (search) params.search = search;
            if (category) params.category = category;
            const res = await api.get("/books", { params });
            set({ books: res.data, loading: false });
        } catch {
            set({ loading: false });
        }
    },

    addBook: async (bookData) => {
        try {
            const res = await api.post("/books", bookData);
            set((state) => ({ books: [res.data, ...state.books] }));
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Failed to add book" };
        }
    },

    updateBook: async (id, bookData) => {
        try {
            const res = await api.put(`/books/${id}`, bookData);
            set((state) => ({
                books: state.books.map((b) => (b.id === id ? res.data : b)),
            }));
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Failed to update book" };
        }
    },

    deleteBook: async (id) => {
        try {
            await api.delete(`/books/${id}`);
            set((state) => ({ books: state.books.filter((b) => b.id !== id) }));
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Failed to delete book" };
        }
    },
}));

export default useBookStore;
