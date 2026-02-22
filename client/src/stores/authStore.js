import { create } from "zustand";
import api from "../lib/api";

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    token: localStorage.getItem("token") || null,
    loading: false,

    login: async (email, password) => {
        set({ loading: true });
        try {
            const res = await api.post("/auth/login", { email, password });
            const { token, user } = res.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            set({ user, token, loading: false });
            return { success: true };
        } catch (err) {
            set({ loading: false });
            return { success: false, message: err.response?.data?.message || "Login failed" };
        }
    },

    register: async (name, email, password, role) => {
        set({ loading: true });
        try {
            await api.post("/auth/register", { name, email, password, role });
            set({ loading: false });
            return { success: true };
        } catch (err) {
            set({ loading: false });
            return { success: false, message: err.response?.data?.message || "Registration failed" };
        }
    },

    logout: () => {
        api.post("/auth/logout").catch(() => { });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ user: null, token: null });
    },

    fetchMe: async () => {
        try {
            const res = await api.get("/auth/me");
            set({ user: res.data });
            localStorage.setItem("user", JSON.stringify(res.data));
        } catch {
            set({ user: null, token: null });
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    },
}));

export default useAuthStore;
