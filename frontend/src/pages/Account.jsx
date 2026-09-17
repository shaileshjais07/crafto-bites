import { useEffect, useState } from "react";
import { api } from "../api";
import { useApp } from "../context";

export default function Account() {
  const { user } = useApp();
  const [orders,setOrders]=useState([]);
  const [error,setError]=useState("");

  useEffect(()=>{api("/orders/mine").then(setOrders).catch(e=>setError(e.message));},[]);

  return <section className="section"><div className="container"><div className="page-heading"><span className="eyebrow">MY CRAFTO BITES</span><h1>Hello, {user.name}</h1><p>Manage your profile and track your orders.</p></div><div className="account-grid"><div className="profile-card"><h2>Profile</h2><p><strong>Name</strong>{user.name}</p><p><strong>Email</strong>{user.email}</p><p><strong>Phone</strong>{user.phone || "Not added"}</p></div><div className="orders-card"><h2>My Orders</h2>{error&&<div className="error-box">{error}</div>}{orders.length?orders.map(o=><div className="order-row" key={o.id}><div><strong>Order #{o.id}</strong><span>{new Date(o.created_at).toLocaleString()}</span></div><div><strong>₹{Number(o.total).toFixed(0)}</strong><span className={`status status-${o.status.toLowerCase()}`}>{o.status}</span></div></div>):<div className="empty-state small"><p>No orders yet.</p></div>}</div></div></div></section>;
}
