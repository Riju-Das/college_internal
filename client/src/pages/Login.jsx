import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import toast from "react-hot-toast";
import { HiOutlineBookOpen } from "react-icons/hi";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, loading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            toast.success("Logged in successfully!");
            navigate("/");
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                        <HiOutlineBookOpen className="text-3xl text-indigo-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
                    <p className="text-gray-500 mt-1">Sign in to Library Management System</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-indigo-600 font-medium hover:underline">
                        Register here
                    </Link>
                </p>

                <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
                    <p className="font-medium mb-1">Demo Credentials:</p>
                    <p>Librarian: librarian@library.com / admin123</p>
                    <p>Student: student@library.com / student123</p>
                </div>
            </div>
        </div>
    );
}
