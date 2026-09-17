import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/products")
      .then(setProducts)
      .catch(e => setError(e.message));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">AUTHENTIC • AROMATIC • INDIAN</span>
            <h1>Bring the <em>real taste</em> of India home.</h1>
            <p>Premium masalas and everyday food essentials crafted to make every meal memorable.</p>
            <div className="hero-actions">
              <Link className="primary-btn" to="/shop">Shop Now →</Link>
              <Link className="text-btn" to="/about">Our Story</Link>
            </div>
            <div className="trust-row"><span>✓ Quality ingredients</span><span>✓ Freshly packed</span><span>✓ Pan-India delivery</span></div>
          </div>
          <div className="hero-art">
            <div className="hero-circle" />
            <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=85" alt="Indian spices" />
            <div className="hero-card"><strong>20+</strong><span>flavour-packed<br/>products</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">CURATED FOR YOU</span><h2>Featured flavours</h2></div><Link to="/shop" className="text-btn">View all →</Link></div>
          {error ? <div className="error-box">{error}</div> : products.length ? <div className="product-grid">{products.filter(p => p.featured).slice(0,4).map(p => <ProductCard key={p.id} product={p} />)}</div> : <Loader />}
        </div>
      </section>

      <section className="section soft-section">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">CUSTOMER FAVOURITES</span><h2>Best sellers</h2></div></div>
          <div className="product-grid">{products.filter(p => p.best_seller).slice(0,4).map(p => <ProductCard key={p.id} product={p} />)}</div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading centered"><div><span className="eyebrow">WHY CRAFTO BITES</span><h2>Made for your kitchen</h2></div></div>
          <div className="feature-grid">
            {[
              ["🌿","Quality ingredients","Carefully selected ingredients for consistent flavour."],
              ["🔥","Bold Indian taste","Balanced blends inspired by everyday Indian cooking."],
              ["📦","Freshly packed","Packed with care so aroma and freshness stay intact."],
              ["🤝","Made with care","A food brand built around trust, taste and simplicity."]
            ].map(x => <div className="feature-card" key={x[1]}><span className="feature-icon">{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></div>)}
          </div>
        </div>
      </section>

      <section className="review-section">
        <div className="container">
          <span className="eyebrow">LOVED BY FOODIES</span><h2>What customers say</h2>
          <div className="review-grid">
            {[
              ["“The garam masala has such a fresh aroma. It instantly upgraded my curry.”","Priya S."],
              ["“Clean packaging, great flavour and the order arrived quickly.”","Rahul M."],
              ["“Chaat masala is now a permanent part of my snack drawer!”","Neha K."]
            ].map(r => <div className="review-card" key={r[1]}><div className="rating">★★★★★</div><p>{r[0]}</p><strong>{r[1]}</strong></div>)}
          </div>
        </div>
      </section>

      <section className="newsletter">
        <div className="container newsletter-inner">
          <div><span className="eyebrow">STAY IN THE LOOP</span><h2>Fresh flavours, straight to your inbox.</h2><p>Get recipes, new launches and occasional offers.</p></div>
          <form onSubmit={e => { e.preventDefault(); alert("Thanks for subscribing!"); }}><input required type="email" placeholder="Your email address" /><button className="primary-btn">Subscribe</button></form>
        </div>
      </section>
    </>
  );
}
