import { query, execute } from "../db/database.js";

const clean = (value) => String(value ?? "").trim();

export function getCategories(req, res) {
  res.json(query("SELECT * FROM categories ORDER BY name"));
}

export function getProducts(req, res) {
  const { search = "", category = "", sort = "" } = req.query;

  let sql = `
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    sql += " AND (LOWER(p.name) LIKE LOWER(?) OR LOWER(p.description) LIKE LOWER(?))";
    params.push(`%${search}%`, `%${search}%`);
  }

  if (category) {
    sql += " AND c.slug = ?";
    params.push(category);
  }

  if (sort === "low") sql += " ORDER BY p.price ASC";
  else if (sort === "high") sql += " ORDER BY p.price DESC";
  else sql += " ORDER BY p.featured DESC, p.best_seller DESC, p.id DESC";

  res.json(query(sql, params));
}

export function getProduct(req, res) {
  const product = query(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.id = ?
  `, [req.params.id])[0];

  if (!product) return res.status(404).json({ message: "Product not found." });
  res.json(product);
}

export function addProduct(req, res) {
  const {
    name, category_id, price, discount = 0, rating = 4.5, image,
    description = "", ingredients = "", weights = "100g,250g,500g",
    stock = 50, featured = 0, best_seller = 0
  } = req.body;

  if (!name || !category_id || !price || !image) {
    return res.status(400).json({ message: "Name, category, price and image are required." });
  }

  const slug = clean(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now();

  const id = execute(`
    INSERT INTO products
    (name,slug,category_id,price,discount,rating,image,description,ingredients,weights,stock,featured,best_seller)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
  `, [
    clean(name), slug, Number(category_id), Number(price), Number(discount), Number(rating),
    clean(image), clean(description), clean(ingredients), clean(weights),
    Number(stock), Number(featured), Number(best_seller)
  ]);

  res.status(201).json(query("SELECT * FROM products WHERE id = ?", [id])[0]);
}

export function updateProduct(req, res) {
  const {
    name, category_id, price, discount = 0, rating = 4.5, image,
    description = "", ingredients = "", weights = "100g,250g,500g",
    stock = 50, featured = 0, best_seller = 0
  } = req.body;

  const exists = query("SELECT id FROM products WHERE id = ?", [req.params.id]).length;
  if (!exists) return res.status(404).json({ message: "Product not found." });

  execute(`
    UPDATE products SET name=?, category_id=?, price=?, discount=?, rating=?, image=?,
    description=?, ingredients=?, weights=?, stock=?, featured=?, best_seller=?
    WHERE id=?
  `, [
    clean(name), Number(category_id), Number(price), Number(discount), Number(rating),
    clean(image), clean(description), clean(ingredients), clean(weights), Number(stock),
    Number(featured), Number(best_seller), Number(req.params.id)
  ]);

  res.json(query("SELECT * FROM products WHERE id = ?", [req.params.id])[0]);
}

export function deleteProduct(req, res) {
  const exists = query("SELECT id FROM products WHERE id = ?", [req.params.id]).length;
  if (!exists) return res.status(404).json({ message: "Product not found." });

  execute("DELETE FROM products WHERE id = ?", [req.params.id]);
  res.json({ message: "Product deleted." });
}
