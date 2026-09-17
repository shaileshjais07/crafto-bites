import { execute } from "../db/database.js";

export function submitContact(req, res) {
  const { name, email, phone = "", message } = req.body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ message: "Name, email and message are required." });
  }

  execute(
    "INSERT INTO contacts (name,email,phone,message) VALUES (?,?,?,?)",
    [name.trim(), email.trim(), phone.trim(), message.trim()]
  );

  res.status(201).json({ message: "Thanks! Your message has been received." });
}
