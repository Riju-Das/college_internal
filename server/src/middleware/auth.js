const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};

const librarian = (req, res, next) => {
    if (req.user.role !== "LIBRARIAN") {
        return res.status(403).json({ message: "Librarian access required" });
    }
    next();
};

module.exports = { auth, librarian };
