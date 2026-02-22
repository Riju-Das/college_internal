import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { HiOutlineBookOpen, HiOutlineLogout, HiOutlineUser } from "react-icons/hi";

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) return null;

    const isLibrarian = user.role === "LIBRARIAN";

    const navLinks = isLibrarian
        ? [
            { to: "/dashboard", label: "Dashboard" },
            { to: "/books", label: "Books" },
            { to: "/issues", label: "Transactions" },
            { to: "/users", label: "Students" },
        ]
        : [
            { to: "/books", label: "Browse Books" },
            { to: "/my-books", label: "My Books" },
            { to: "/history", label: "History" },
        ];

    return (
        <nav className="bg-indigo-700 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                        <HiOutlineBookOpen className="text-2xl" />
                        LibraryMS
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === link.to
                                        ? "bg-indigo-800 text-white"
                                        : "text-indigo-100 hover:bg-indigo-600"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm">
                            <HiOutlineUser className="text-lg" />
                            <span className="hidden sm:inline">{user.name}</span>
                            <span className="text-xs bg-indigo-800 px-2 py-0.5 rounded-full">
                                {user.role}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 text-sm bg-indigo-800 hover:bg-indigo-900 px-3 py-1.5 rounded-md transition-colors"
                        >
                            <HiOutlineLogout />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Mobile nav */}
                <div className="md:hidden pb-3 flex gap-1 overflow-x-auto">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${location.pathname === link.to
                                    ? "bg-indigo-800 text-white"
                                    : "text-indigo-100 hover:bg-indigo-600"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
