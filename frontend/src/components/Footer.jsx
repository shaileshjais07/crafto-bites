import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand"><span className="brand-mark">CB</span><span><strong>Crafto</strong><small>Bites</small></span></div>
          <p>Authentic Indian flavours, thoughtfully packed for your everyday kitchen.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <Link to="/shop">Shop</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <h4>Customer Care</h4>
          <Link to="/account">My Account</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/checkout">Checkout</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <p>📞 +91 98765 43210</p>
          <p>✉️ hello@craftobites.com</p>
          <p>📍 India</p>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} Crafto Bites. All rights reserved.</div>
    </footer>
  );
}
