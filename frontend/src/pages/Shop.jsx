import { useEffect, useState } from "react";
import { api } from "../api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/products/categories").then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);

    api(`/products?${params.toString()}`)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  return (
    <section className="section">
      <div className="container">
        <div className="page-heading"><span className="eyebrow">THE CRAFTO BITES COLLECTION</span><h1>Shop flavours</h1><p>Everyday spices and food products for delicious Indian cooking.</p></div>
        <div className="filters">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." aria-label="Search products" />
          <select value={category} onChange={e => setCategory(e.target.value)}><option value="">All categories</option>{categories.map(c => <option value={c.slug} key={c.id}>{c.name}</option>)}</select>
          <select value={sort} onChange={e => setSort(e.target.value)}><option value="">Sort by</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option></select>
        </div>
        {loading ? <Loader /> : products.length ? <div className="product-grid">{products.map(p => <ProductCard key={p.id} product={p} />)}</div> : <div className="empty-state"><h3>No products found</h3><p>Try another search or category.</p></div>}
      </div>
    </section>
  );
}
