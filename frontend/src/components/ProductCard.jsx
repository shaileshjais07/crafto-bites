import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context";

export default function ProductCard({ product }) {
  const { addToCart } = useApp();
  const navigate = useNavigate();
  const salePrice = product.price * (1 - product.discount / 100);

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.discount > 0 && <span className="discount-badge">{product.discount}% OFF</span>}
      </Link>

      <div className="product-body">
        <span className="category-label">{product.category_name}</span>
        <Link to={`/product/${product.id}`}><h3>{product.name}</h3></Link>
        <div className="rating">★ {Number(product.rating).toFixed(1)}</div>
        <div className="price-row">
          <strong>₹{salePrice.toFixed(0)}</strong>
          {product.discount > 0 && <del>₹{Number(product.price).toFixed(0)}</del>}
        </div>
        <div className="card-actions">
          <button className="secondary-btn" onClick={() => addToCart(product)}>Add to Cart</button>
          <button className="primary-btn" onClick={() => { addToCart(product); navigate("/checkout"); }}>Buy Now</button>
        </div>
      </div>
    </article>
  );
}
