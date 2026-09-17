import { useEffect, useState } from "react";
import { api } from "../api";

const empty = {name:"",category_id:"1",price:"",discount:"0",rating:"4.5",image:"",description:"",ingredients:"",weights:"100g,250g,500g",stock:"50",featured:0,best_seller:0};

export default function Admin() {
  const [stats,setStats]=useState(null), [products,setProducts]=useState([]), [categories,setCategories]=useState([]), [orders,setOrders]=useState([]), [customers,setCustomers]=useState([]);
  const [form,setForm]=useState(empty), [editing,setEditing]=useState(null), [error,setError]=useState("");

  async function load(){
    try {
      const [s,p,c,o,u]=await Promise.all([api("/admin/stats"),api("/products"),api("/products/categories"),api("/orders"),api("/admin/customers")]);
      setStats(s);setProducts(p);setCategories(c);setOrders(o);setCustomers(u);
    } catch(e){setError(e.message);}
  }
  useEffect(()=>{load();},[]);

  function change(e){setForm({...form,[e.target.name]:e.target.value});}

  async function save(e){
    e.preventDefault();setError("");
    try{
      if(editing) await api(`/products/${editing}`,{method:"PUT",body:JSON.stringify(form)});
      else await api("/products",{method:"POST",body:JSON.stringify(form)});
      setForm(empty);setEditing(null);load();
    }catch(e){setError(e.message);}
  }

  async function remove(id){if(!confirm("Delete this product?"))return;try{await api(`/products/${id}`,{method:"DELETE"});load();}catch(e){setError(e.message);}}

  function edit(p){setEditing(p.id);setForm({...p,category_id:p.category_id});window.scrollTo({top:0,behavior:"smooth"});}

  async function status(id,status){
    try{await api(`/orders/${id}/status`,{method:"PATCH",body:JSON.stringify({status})});load();}
    catch(e){setError(e.message);}
  }

  return <section className="section admin-page"><div className="container"><div className="page-heading"><span className="eyebrow">ADMIN CONTROL CENTRE</span><h1>Dashboard</h1><p>Manage products, orders and customers.</p></div>{error&&<div className="error-box">{error}</div>}{stats&&<div className="stats-grid">{[["Products",stats.products],["Customers",stats.users],["Orders",stats.orders],["Revenue",`₹${stats.revenue.toFixed(0)}`]].map(s=><div className="stat-card" key={s[0]}><span>{s[0]}</span><strong>{s[1]}</strong></div>)}</div>}<div className="admin-grid"><form className="form-card" onSubmit={save}><h2>{editing?"Edit product":"Add product"}</h2><label>Name<input name="name" required value={form.name} onChange={change}/></label><label>Category<select name="category_id" value={form.category_id} onChange={change}>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><div className="two-col"><label>Price<input name="price" type="number" min="1" required value={form.price} onChange={change}/></label><label>Discount %<input name="discount" type="number" min="0" max="100" value={form.discount} onChange={change}/></label></div><div className="two-col"><label>Rating<input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={change}/></label><label>Stock<input name="stock" type="number" min="0" value={form.stock} onChange={change}/></label></div><label>Image URL<input name="image" required value={form.image} onChange={change}/></label><label>Description<textarea name="description" rows="3" value={form.description} onChange={change}/></label><label>Ingredients<input name="ingredients" value={form.ingredients} onChange={change}/></label><label>Weights<input name="weights" value={form.weights} onChange={change}/></label><label className="check"><input type="checkbox" checked={Boolean(Number(form.featured))} onChange={e=>setForm({...form,featured:e.target.checked?1:0})}/> Featured product</label><label className="check"><input type="checkbox" checked={Boolean(Number(form.best_seller))} onChange={e=>setForm({...form,best_seller:e.target.checked?1:0})}/> Best seller</label><div className="detail-actions"><button className="primary-btn">{editing?"Update":"Add product"}</button>{editing&&<button type="button" className="secondary-btn" onClick={()=>{setEditing(null);setForm(empty)}}>Cancel</button>}</div></form><div className="admin-table-card"><h2>Products</h2><div className="table-wrap"><table><thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Action</th></tr></thead><tbody>{products.map(p=><tr key={p.id}><td>{p.name}</td><td>₹{p.price}</td><td>{p.stock}</td><td><button className="table-btn" onClick={()=>edit(p)}>Edit</button><button className="table-btn danger" onClick={()=>remove(p.id)}>Delete</button></td></tr>)}</tbody></table></div></div></div><div className="admin-table-card wide"><h2>Orders</h2><div className="table-wrap"><table><thead><tr><th>#</th><th>Customer</th><th>Total</th><th>Status</th><th>Update</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td>#{o.id}</td><td>{o.customer_name}<small>{o.mobile}</small></td><td>₹{o.total}</td><td>{o.status}</td><td><select value={o.status} onChange={e=>status(o.id,e.target.value)}><option>Placed</option><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select></td></tr>)}</tbody></table></div></div><div className="admin-table-card wide"><h2>Customers</h2><div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th></tr></thead><tbody>{customers.map(c=><tr key={c.id}><td>{c.name}</td><td>{c.email}</td><td>{c.phone}</td><td>{new Date(c.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div></div></div></section>;
}
