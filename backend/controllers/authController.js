import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query, execute } from "../db/database.js";

function tokenFor(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET || "development-secret",
    { expiresIn: "7d" }
  );
}

export async function register(req, res) {
  try {
    const { name, email, phone = "", password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const existing = query("SELECT id FROM users WHERE email = ?", [email.toLowerCase()]);
    if (existing.length) return res.status(409).json({ message: "Email is already registered." });

    const hashed = await bcrypt.hash(password, 10);
    const id = execute(
      "INSERT INTO users (name,email,phone,password,role) VALUES (?,?,?,?,?)",
      [name.trim(), email.toLowerCase().trim(), phone.trim(), hashed, "user"]
    );

    const user = query("SELECT id,name,email,phone,role FROM users WHERE id = ?", [id])[0];
    res.status(201).json({ user, token: tokenFor(user) });
  } catch {
    res.status(500).json({ message: "Registration failed." });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = query("SELECT * FROM users WHERE email = ?", [email?.toLowerCase().trim()])[0];

    if (!user || !(await bcrypt.compare(password || "", user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    res.json({ user: safeUser, token: tokenFor(safeUser) });
  } catch {
    res.status(500).json({ message: "Login failed." });
  }
}
