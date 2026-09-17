import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useApp } from "../context";

export default function Checkout() {
  const { cart, subtotal, delivery, total, user, setUser } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customer_name: user?.name || "", mobile: user?.phone || "", email: user?.email || "", address: "", city: "", state: "", pincode: "", payment_method: "Cash on Delivery" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!cart.length) return <section className="section"><div className="container empty-state"><h1>Nothing to checkout</h1><Link className="primary-btn" to="/shop">Go to Shop</Link></div></section>;

  function change(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const data = await api("/orders", {
        method: "POST",
        body: JSON.stringify({ ...form, items: cart.map(i => ({ product_id: i.id, quantity: i.quantity })) })
      });
      localStorage.setItem("craftoCart", "[]");
      window.location.href = `/account?order=${data.order.id}`;
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  }

  return <section className="section"><div className="container"><div className="page-heading"><span className="eyebrow">SAFE & SIMPLE</span><h1>Checkout</h1></div><div className="checkout-grid"><form className="form-card" onSubmit={submit}><h2>Delivery details</h2>{["customer_name","mobile","email","address","city","state","pincode"].map(name => <label key={name}>{name.replace("_"," ").replace(/\b\w/g,c=>c.toUpperCase())}<input name={name} required value={form[name]} onChange={change} type={name==="email"?"email":"text"} /></label>)}<label>Payment method<select name="payment_method" value={form.payment_method} onChange={change}><option>Cash on Delivery</option><option>UPI (demo)</option><option>Card (demo)</option></select></label>{message && <div className="error-box">{message}</div>}<button className="primary-btn full" disabled={loading}>{loading ? "Placing order..." : "Place Order →"}</button><p className="form-note">Demo checkout: payment gateway is not connected yet.</p></form><aside className="summary"><h2>Order summary</h2>{cart.map(i => <div className="mini-item" key={i.id}><span>{i.name} × {i.quantity}</span><strong>₹{(i.price*(1-i.discount/100)*i.quantity).toFixed(0)}</strong></div>)}<hr/><div><span>Subtotal</span><strong>₹{subtotal.toFixed(0)}</strong></div><div><span>Delivery</span><strong>{delivery ? `₹${delivery}` : "FREE"}</strong></div><div className="summary-total"><span>Total</span><strong>₹{total.toFixed(0)}</strong></div></aside></div></div></section>;
}
