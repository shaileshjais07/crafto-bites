import { useState } from "react";
import { api } from "../api";

export default function Contact() {
  const [form, setForm] = useState({name:"",email:"",phone:"",message:""});
  const [message,setMessage] = useState("");
  const [error,setError] = useState("");

  async function submit(e) {
    e.preventDefault(); setMessage(""); setError("");
    try { const d = await api("/contact",{method:"POST",body:JSON.stringify(form)}); setMessage(d.message); setForm({name:"",email:"",phone:"",message:""}); }
    catch(e){setError(e.message);}
  }

  return <section className="section"><div className="container"><div className="page-heading"><span className="eyebrow">WE'D LOVE TO HEAR FROM YOU</span><h1>Contact us</h1><p>Questions, feedback or business enquiries? Send us a message.</p></div><div className="contact-grid"><form className="form-card" onSubmit={submit}><h2>Send a message</h2>{["name","email","phone"].map(n=><label key={n}>{n[0].toUpperCase()+n.slice(1)}<input required={n!=="phone"} type={n==="email"?"email":"text"} value={form[n]} onChange={e=>setForm({...form,[n]:e.target.value})}/></label>)}<label>Message<textarea required rows="6" value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/></label>{message&&<div className="success-box">{message}</div>}{error&&<div className="error-box">{error}</div>}<button className="primary-btn">Submit message</button></form><div className="contact-info"><div className="info-card"><span>📞</span><h3>Call us</h3><p>+91 98765 43210</p></div><div className="info-card"><span>✉️</span><h3>Email</h3><p>hello@craftobites.com</p></div><div className="info-card"><span>📍</span><h3>Location</h3><p>India</p></div></div></div></div></section>;
}
