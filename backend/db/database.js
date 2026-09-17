import fs from "fs";
import path from "path";
import initSqlJs from "sql.js";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = __dirname;
const dbFile = path.join(dbDir, "database.db");

let db;

const schema = `
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT DEFAULT '',
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id INTEGER,
  price REAL NOT NULL,
  discount INTEGER DEFAULT 0,
  rating REAL DEFAULT 4.5,
  image TEXT NOT NULL,
  description TEXT DEFAULT '',
  ingredients TEXT DEFAULT '',
  weights TEXT DEFAULT '100g,250g,500g',
  stock INTEGER DEFAULT 50,
  featured INTEGER DEFAULT 0,
  best_seller INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  customer_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  subtotal REAL NOT NULL,
  delivery_charge REAL NOT NULL,
  total REAL NOT NULL,
  status TEXT DEFAULT 'Placed',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  price REAL NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY(order_id) REFERENCES orders(id),
  FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  message TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`;

function persist() {
  const data = db.export();
  fs.writeFileSync(dbFile, Buffer.from(data));
}

function rows(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const result = [];
  while (stmt.step()) result.push(stmt.getAsObject());
  stmt.free();
  return result;
}

function run(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.run(params);
  stmt.free();
  const id = rows("SELECT last_insert_rowid() AS id")[0]?.id;
  persist();
  return id;
}

export async function initDatabase() {
  const SQL = await initSqlJs();

  if (fs.existsSync(dbFile)) {
    db = new SQL.Database(fs.readFileSync(dbFile));
  } else {
    db = new SQL.Database();
  }

  db.run(schema);

  const categoryCount = rows("SELECT COUNT(*) AS count FROM categories")[0].count;
  if (Number(categoryCount) === 0) {
    const categories = [
      ["Masala", "masala"],
      ["Spices", "spices"],
      ["Kitchen Products", "kitchen-products"],
      ["Food Products", "food-products"],
      ["Other Products", "other-products"]
    ];
    for (const [name, slug] of categories) {
      run("INSERT INTO categories (name, slug) VALUES (?, ?)", [name, slug]);
    }
  }

  const productCount = rows("SELECT COUNT(*) AS count FROM products")[0].count;
  if (Number(productCount) === 0) {
    const cat = (slug) => rows("SELECT id FROM categories WHERE slug = ?", [slug])[0].id;
    const products = [
      {
        name: "Royal Garam Masala",
        slug: "royal-garam-masala",
        category: cat("masala"),
        price: 149,
        discount: 10,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=80",
        description: "A fragrant everyday garam masala blend for rich Indian curries, gravies and pulao.",
        ingredients: "Coriander, cumin, black pepper, cardamom, cinnamon, cloves",
        weights: "100g,250g,500g",
        stock: 80,
        featured: 1,
        best: 1
      },
      {
        name: "Premium Red Chilli Powder",
        slug: "premium-red-chilli-powder",
        category: cat("spices"),
        price: 119,
        discount: 8,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1599909533608-4e3f6c0b5f16?auto=format&fit=crop&w=900&q=80",
        description: "Bold colour and balanced heat for everyday Indian cooking.",
        ingredients: "Premium dried red chillies",
        weights: "100g,250g,500g",
        stock: 100,
        featured: 1,
        best: 1
      },
      {
        name: "Turmeric Powder",
        slug: "turmeric-powder",
        category: cat("spices"),
        price: 99,
        discount: 5,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=900&q=80",
        description: "Bright, aromatic turmeric powder selected for daily Indian recipes.",
        ingredients: "Ground turmeric",
        weights: "100g,250g,500g",
        stock: 120,
        featured: 1,
        best: 0
      },
      {
        name: "Chaat Masala",
        slug: "chaat-masala",
        category: cat("masala"),
        price: 129,
        discount: 12,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
        description: "Tangy and savoury masala for chaats, fruits, snacks and salads.",
        ingredients: "Dry mango, cumin, black salt, coriander, pepper",
        weights: "100g,250g",
        stock: 65,
        featured: 1,
        best: 1
      },
      {
        name: "Classic Jeera",
        slug: "classic-jeera",
        category: cat("spices"),
        price: 139,
        discount: 0,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1596040033329-6f7e3c6d5a6d?auto=format&fit=crop&w=900&q=80",
        description: "Aromatic cumin seeds for tadka, rice and homemade spice blends.",
        ingredients: "Whole cumin seeds",
        weights: "100g,250g,500g",
        stock: 90,
        featured: 0,
        best: 1
      },
      {
        name: "Homestyle Pickle",
        slug: "homestyle-pickle",
        category: cat("food-products"),
        price: 179,
        discount: 15,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=900&q=80",
        description: "A homestyle Indian pickle with a balanced spicy and tangy flavour.",
        ingredients: "Seasonal fruit, spices, salt, oil",
        weights: "250g,500g",
        stock: 45,
        featured: 0,
        best: 1
      }
    ];

    for (const p of products) {
      run(
        `INSERT INTO products
        (name,slug,category_id,price,discount,rating,image,description,ingredients,weights,stock,featured,best_seller)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [p.name,p.slug,p.category,p.price,p.discount,p.rating,p.image,p.description,p.ingredients,p.weights,p.stock,p.featured,p.best]
      );
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@craftobites.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
  const adminExists = rows("SELECT id FROM users WHERE email = ?", [adminEmail]).length;

  if (!adminExists) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    run(
      "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
      ["Crafto Bites Admin", adminEmail, hashed, "admin"]
    );
  }

  persist();
  console.log(`SQLite database ready: ${dbFile}`);
}

export function query(sql, params = []) {
  return rows(sql, params);
}

export function execute(sql, params = []) {
  return run(sql, params);
}
