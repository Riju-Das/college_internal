import { useEffect, useState } from "react";
import useIssueStore from "../stores/issueStore";
import useAuthStore from "../stores/authStore";
import toast from "react-hot-toast";

export default function Issues() {
    const { issues, loading, fetchIssues, returnBook } = useIssueStore();
    const { user } = useAuthStore();
    const [filter, setFilter] = useState("");

    const isLibrarian = user?.role === "LIBRARIAN";

    useEffect(() => {
        fetchIssues(filter);
    }, [fetchIssues, filter]);

    const handleReturn = async (issueId) => {
        const result = await returnBook(issueId);
        if (result.success) {
            const fine = result.data.fine;
            toast.success(fine > 0 ? `Book returned! Fine: $${fine}` : "Book returned successfully!");
            fetchIssues(filter);
        } else {
            toast.error(result.message);
        }
    };

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

    const isOverdue = (dueDate) => new Date(dueDate) < new Date();

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    {isLibrarian ? "All Transactions" : "My Issued Books"}
                </h1>
                <div className="flex gap-2">
                    {["", "ISSUED", "RETURNED"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === status
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {status || "All"}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading...</div>
            ) : issues.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No transactions found.</div>
            ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                                    {isLibrarian && (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                                    )}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fine</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {issues.map((issue) => (
                                    <tr key={issue.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-800">{issue.book.title}</div>
                                            <div className="text-sm text-gray-500">{issue.book.author}</div>
                                        </td>
                                        {isLibrarian && (
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-800">{issue.user.name}</div>
                                                <div className="text-xs text-gray-500">{issue.user.email}</div>
                                            </td>
                                        )}
                                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(issue.issueDate)}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={
                                                    issue.status === "ISSUED" && isOverdue(issue.dueDate)
                                                        ? "text-red-600 font-medium"
                                                        : "text-gray-600"
                                                }
                                            >
                                                {formatDate(issue.dueDate)}
                                                {issue.status === "ISSUED" && isOverdue(issue.dueDate) && (
                                                    <span className="block text-xs">OVERDUE</span>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-medium ${issue.status === "ISSUED"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-green-100 text-green-800"
                                                    }`}
                                            >
                                                {issue.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {issue.fine > 0 ? (
                                                <span className="text-red-600 font-medium">${issue.fine}</span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {issue.status === "ISSUED" && (
                                                <button
                                                    onClick={() => handleReturn(issue.id)}
                                                    className="bg-green-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-green-700 transition"
                                                >
                                                    Return
                                                </button>
                                            )}
                                            {issue.status === "RETURNED" && issue.returnDate && (
                                                <span className="text-xs text-gray-500">
                                                    Returned {formatDate(issue.returnDate)}
                                                </span>
                                            )}
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
