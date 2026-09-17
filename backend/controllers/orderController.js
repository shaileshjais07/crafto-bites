import { query, execute } from "../db/database.js";

export function createOrder(req, res) {
  try {
    const {
      customer_name, mobile, email, address, city, state, pincode,
      payment_method, items
    } = req.body;

    if (!customer_name || !mobile || !email || !address || !city || !state || !pincode || !payment_method) {
      return res.status(400).json({ message: "Please fill all checkout fields." });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
    }

    let subtotal = 0;
    const cleanItems = [];

    for (const item of items) {
      const product = query("SELECT id,name,price,stock FROM products WHERE id = ?", [item.product_id])[0];
      const quantity = Number(item.quantity);

      if (!product) return res.status(400).json({ message: "One product no longer exists." });
      if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ message: "Invalid quantity." });
      if (quantity > product.stock) return res.status(400).json({ message: `${product.name} has only ${product.stock} left.` });

      subtotal += Number(product.price) * quantity;
      cleanItems.push({ ...product, quantity });
    }

    const delivery_charge = subtotal >= 499 ? 0 : 49;
    const total = subtotal + delivery_charge;

    const orderId = execute(`
      INSERT INTO orders
      (user_id,customer_name,mobile,email,address,city,state,pincode,payment_method,subtotal,delivery_charge,total,status)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
    `, [
      req.user?.id || null, customer_name.trim(), mobile.trim(), email.trim(),
      address.trim(), city.trim(), state.trim(), pincode.trim(),
      payment_method, subtotal, delivery_charge, total, "Placed"
    ]);

    for (const item of cleanItems) {
      execute(`
        INSERT INTO order_items
        (order_id,product_id,product_name,price,quantity)
        VALUES (?,?,?,?,?)
      `, [orderId, item.id, item.name, item.price, item.quantity]);

      execute("UPDATE products SET stock = stock - ? WHERE id = ?", [item.quantity, item.id]);
    }

    const order = query("SELECT * FROM orders WHERE id = ?", [orderId])[0];
    res.status(201).json({ message: "Order placed successfully.", order });
  } catch {
    res.status(500).json({ message: "Could not create order." });
  }
}

export function getMyOrders(req, res) {
  const orders = query("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC", [req.user.id]);

  const result = orders.map(order => ({
    ...order,
    items: query("SELECT * FROM order_items WHERE order_id = ?", [order.id])
  }));

  res.json(result);
}

export function getAllOrders(req, res) {
  const orders = query(`
    SELECT o.*, u.name AS account_name
    FROM orders o
    LEFT JOIN users u ON u.id = o.user_id
    ORDER BY o.id DESC
  `);

  res.json(orders.map(order => ({
    ...order,
    items: query("SELECT * FROM order_items WHERE order_id = ?", [order.id])
  })));
}

export function updateOrderStatus(req, res) {
  const allowed = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];
  if (!allowed.includes(req.body.status)) {
    return res.status(400).json({ message: "Invalid order status." });
  }

  execute("UPDATE orders SET status = ? WHERE id = ?", [req.body.status, req.params.id]);
  res.json(query("SELECT * FROM orders WHERE id = ?", [req.params.id])[0]);
}
