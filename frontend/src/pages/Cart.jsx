import { Link } from "react-router-dom";
import { useApp } from "../context";

export default function Cart() {
  const { cart, updateCart, removeFromCart, subtotal, delivery, total } = useApp();

  if (!cart.length) return <section className="section"><div className="container empty-state"><div className="empty-icon">🛒</div><h1>Your cart is empty</h1><p>Add something delicious and come back here.</p><Link className="primary-btn" to="/shop">Start Shopping</Link></div></section>;

  return <section className="section"><div className="container"><div className="page-heading"><span className="eyebrow">YOUR PICKS</span><h1>Shopping cart</h1></div><div className="cart-layout"><div className="cart-list">{cart.map(item => { const price = item.price * (1-item.discount/100); return <div className="cart-item" key={item.id}><img src={item.image} alt={item.name}/><div className="cart-item-main"><span className="category-label">{item.category_name}</span><h3>{item.name}</h3><strong>₹{price.toFixed(0)}</strong></div><div className="quantity"><button onClick={() => updateCart(item.id,item.quantity-1)}>−</button><span>{item.quantity}</span><button onClick={() => updateCart(item.id,item.quantity+1)}>+</button></div><button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button></div>})}</div><aside className="summary"><h2>Order summary</h2><div><span>Subtotal</span><strong>₹{subtotal.toFixed(0)}</strong></div><div><span>Delivery</span><strong>{delivery ? `₹${delivery}` : "FREE"}</strong></div><hr/><div className="summary-total"><span>Total</span><strong>₹{total.toFixed(0)}</strong></div><Link className="primary-btn full" to="/checkout">Checkout →</Link><p className="summary-note">Free delivery on orders above ₹499.</p></aside></div></div></section>;
}
