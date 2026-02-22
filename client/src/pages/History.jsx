import { useEffect } from "react";
import useIssueStore from "../stores/issueStore";
import useAuthStore from "../stores/authStore";

export default function History() {
    const { issues, loading, fetchHistory } = useIssueStore();
    const { user } = useAuthStore();

    useEffect(() => {
        if (user) fetchHistory(user.id);
    }, [user, fetchHistory]);

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Borrowing History</h1>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading...</div>
            ) : issues.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No borrowing history found.</div>
            ) : (
                <div className="space-y-4">
                    {issues.map((issue) => (
                        <div key={issue.id} className="bg-white rounded-xl shadow-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">{issue.book.title}</h3>
                                <p className="text-sm text-gray-500">by {issue.book.author}</p>
                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                    <span>Issued: {formatDate(issue.issueDate)}</span>
                                    <span>Due: {formatDate(issue.dueDate)}</span>
                                    {issue.returnDate && <span>Returned: {formatDate(issue.returnDate)}</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${issue.status === "ISSUED"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-green-100 text-green-800"
                                        }`}
                                >
                                    {issue.status}
                                </span>
                                {issue.fine > 0 && (
                                    <span className="text-red-600 text-sm font-medium">Fine: ${issue.fine}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
