import { useEffect, useState } from "react";
import api from "../lib/api";
import toast from "react-hot-toast";
import { HiOutlineTrash } from "react-icons/hi";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get("/users");
            setUsers(res.data);
        } catch {
            toast.error("Failed to fetch users");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete student "${name}"? This will also remove their borrowing history.`)) return;
        try {
            await api.delete(`/users/${id}`);
            toast.success("User deleted");
            setUsers(users.filter((u) => u.id !== id));
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete user");
        }
    };

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Management</h1>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading...</div>
            ) : users.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No students registered.</div>
            ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-800">{u.id}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{u.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(u.createdAt)}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleDelete(u.id, u.name)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <HiOutlineTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
