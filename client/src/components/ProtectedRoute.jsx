import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

export default function ProtectedRoute({ children, role }) {
    const { user } = useAuthStore();

    if (!user) return <Navigate to="/login" replace />;
    if (role && user.role !== role) return <Navigate to="/" replace />;

    return children;
}
