import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./stores/authStore";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Issues from "./pages/Issues";
import History from "./pages/History";
import Users from "./pages/Users";

function Home() {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "LIBRARIAN") return <Navigate to="/dashboard" replace />;
  return <Navigate to="/books" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Librarian routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="LIBRARIAN">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute role="LIBRARIAN">
              <Users />
            </ProtectedRoute>
          }
        />

        {/* Shared routes */}
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <Books />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues"
          element={
            <ProtectedRoute>
              <Issues />
            </ProtectedRoute>
          }
        />

        {/* Student routes */}
        <Route
          path="/my-books"
          element={
            <ProtectedRoute role="STUDENT">
              <Issues />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute role="STUDENT">
              <History />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
