import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context";

export default function Navbar() {
  const { cartCount, user, logout } = useApp();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link className="brand" to="/">
          <span className="brand-mark">CB</span>
          <span>
            <strong>Crafto</strong>
            <small>Bites</small>
          </span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className="nav-actions">
          <Link className="cart-btn" to="/cart">🛒 <span>{cartCount}</span></Link>
          {user ? (
            <>
              <Link className="account-link" to={user.role === "admin" ? "/admin" : "/account"}>
                {user.role === "admin" ? "Admin" : "Account"}
              </Link>
              <button className="ghost-btn" onClick={() => { logout(); navigate("/"); }}>Logout</button>
            </>
          ) : (
            <Link className="primary-btn small" to="/login">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
