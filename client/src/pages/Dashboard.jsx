import { useEffect } from "react";
import useIssueStore from "../stores/issueStore";
import { HiOutlineBookOpen, HiOutlineUsers, HiOutlineClipboardList, HiOutlineCash } from "react-icons/hi";

export default function Dashboard() {
    const { stats, fetchStats } = useIssueStore();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const statCards = [
        { label: "Total Books", value: stats?.totalBooks || 0, icon: HiOutlineBookOpen, color: "bg-blue-500" },
        { label: "Registered Students", value: stats?.totalUsers || 0, icon: HiOutlineUsers, color: "bg-green-500" },
        { label: "Books Issued", value: stats?.totalIssued || 0, icon: HiOutlineClipboardList, color: "bg-orange-500" },
        { label: "Total Fines Collected", value: `$${stats?.totalFines || 0}`, icon: HiOutlineCash, color: "bg-red-500" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Library Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card) => (
                    <div key={card.label} className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
                        <div className={`${card.color} p-3 rounded-lg text-white`}>
                            <card.icon className="text-2xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{card.label}</p>
                            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Books Currently Issued</span>
                            <span className="font-semibold">{stats?.totalIssued || 0}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Books Returned</span>
                            <span className="font-semibold">{stats?.totalReturned || 0}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Total Fines</span>
                            <span className="font-semibold text-red-600">${stats?.totalFines || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">System Info</h2>
                    <div className="space-y-3 text-sm text-gray-600">
                        <p>Welcome to the Library Management System dashboard. From here you can:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Manage book inventory</li>
                            <li>Track issued and returned books</li>
                            <li>Manage student accounts</li>
                            <li>Monitor fines and overdue books</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
