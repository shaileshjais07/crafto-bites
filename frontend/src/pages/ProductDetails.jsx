import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../api";
import { useApp } from "../context";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    api(`/products/${id}`).then(p => {
      setProduct(p);
      api(`/products?category=${p.category_slug}`).then(list => setRelated(list.filter(x => x.id !== p.id).slice(0,4)));
    });
  }, [id]);

  if (!product) return <Loader />;

  const price = product.price * (1 - product.discount / 100);

  return (
    <section className="section">
      <div className="container">
        <div className="breadcrumb"><Link to="/shop">Shop</Link> / {product.name}</div>
        <div className="detail-grid">
          <div className="detail-image"><img src={product.image} alt={product.name} /></div>
          <div className="detail-copy">
            <span className="category-label">{product.category_name}</span>
            <h1>{product.name}</h1>
            <div className="rating">★ {Number(product.rating).toFixed(1)} / 5</div>
            <div className="detail-price"><strong>₹{price.toFixed(0)}</strong>{product.discount > 0 && <><del>₹{Number(product.price).toFixed(0)}</del><span>{product.discount}% OFF</span></>}</div>
            <p>{product.description}</p>
            <div className="detail-info"><strong>Ingredients</strong><span>{product.ingredients}</span></div>
            <div className="detail-info"><strong>Weight options</strong><div className="weight-row">{String(product.weights).split(",").map(w => <button key={w}>{w}</button>)}</div></div>
            <div className="quantity"><strong>Quantity</strong><div><button onClick={() => setQuantity(q => Math.max(1,q-1))}>−</button><span>{quantity}</span><button onClick={() => setQuantity(q => q+1)}>+</button></div></div>
            <div className="detail-actions"><button className="secondary-btn large" onClick={() => addToCart(product, quantity)}>Add to Cart</button><button className="primary-btn large" onClick={() => { addToCart(product, quantity); navigate("/checkout"); }}>Buy Now</button></div>
          </div>
        </div>
        {related.length > 0 && <div className="related"><div className="section-heading"><h2>You may also like</h2></div><div className="product-grid">{related.map(p => <ProductCard key={p.id} product={p} />)}</div></div>}
      </div>
    </section>
  );
}
