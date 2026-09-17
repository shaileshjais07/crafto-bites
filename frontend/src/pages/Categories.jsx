import { Link } from "react-router-dom";

const categories = [
  ["🌶️","Masala","Everyday blends for curries, snacks and more.","masala"],
  ["🧂","Spices","Whole and ground spices for authentic flavour.","spices"],
  ["🍳","Kitchen Products","Useful kitchen essentials.","kitchen-products"],
  ["🥭","Food Products","Tasty Indian favourites for your pantry.","food-products"],
  ["✨","Other Products","More goodness from Crafto Bites.","other-products"]
];

export default function Categories() {
  return <section className="section"><div className="container"><div className="page-heading"><span className="eyebrow">EXPLORE</span><h1>Shop by category</h1><p>Find your next kitchen favourite.</p></div><div className="category-grid">{categories.map(c => <Link className="category-card" to={`/shop?category=${c[3]}`} key={c[3]}><span>{c[0]}</span><h2>{c[1]}</h2><p>{c[2]}</p><strong>Explore →</strong></Link>)}</div></div></section>;
}
