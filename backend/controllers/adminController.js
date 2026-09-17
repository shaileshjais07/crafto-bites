import { query } from "../db/database.js";

export function getStats(req, res) {
  const products = Number(query("SELECT COUNT(*) AS count FROM products")[0].count);
  const users = Number(query("SELECT COUNT(*) AS count FROM users WHERE role='user'")[0].count);
  const orders = Number(query("SELECT COUNT(*) AS count FROM orders")[0].count);
  const revenue = Number(query("SELECT COALESCE(SUM(total),0) AS total FROM orders WHERE status != 'Cancelled'")[0].total);

  res.json({ products, users, orders, revenue });
}

export function getCustomers(req, res) {
  res.json(query(`
    SELECT id,name,email,phone,created_at
    FROM users
    WHERE role='user'
    ORDER BY id DESC
  `));
}
