import { create } from "zustand";
import api from "../lib/api";

const useIssueStore = create((set) => ({
    issues: [],
    stats: null,
    loading: false,

    fetchIssues: async (status = "") => {
        set({ loading: true });
        try {
            const params = {};
            if (status) params.status = status;
            const res = await api.get("/issues", { params });
            set({ issues: res.data, loading: false });
        } catch {
            set({ loading: false });
        }
    },

    issueBook: async (bookId, userId) => {
        try {
            const data = { bookId };
            if (userId) data.userId = userId;
            const res = await api.post("/issues/issue", data);
            set((state) => ({ issues: [res.data, ...state.issues] }));
            return { success: true, data: res.data };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Failed to issue book" };
        }
    },

    returnBook: async (issueId) => {
        try {
            const res = await api.post(`/issues/return/${issueId}`);
            set((state) => ({
                issues: state.issues.map((i) => (i.id === issueId ? res.data : i)),
            }));
            return { success: true, data: res.data };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Failed to return book" };
        }
    },

    fetchStats: async () => {
        try {
            const res = await api.get("/issues/stats/dashboard");
            set({ stats: res.data });
        } catch {
            // ignore
        }
    },

    fetchHistory: async (userId) => {
        set({ loading: true });
        try {
            const res = await api.get(`/issues/history/${userId}`);
            set({ issues: res.data, loading: false });
        } catch {
            set({ loading: false });
        }
    },
}));

export default useIssueStore;
