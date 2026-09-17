import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useApp } from "../context";

export default function Login() {
  const [form,setForm]=useState({email:"",password:""});
  const [error,setError]=useState("");
  const {login}=useApp();
  const navigate=useNavigate();

  async function submit(e){
    e.preventDefault(); setError("");
    try { const data=await api("/auth/login",{method:"POST",body:JSON.stringify(form)}); login(data); navigate(data.user.role==="admin"?"/admin":"/account"); }
    catch(e){setError(e.message);}
  }

  return <section className="auth-section"><form className="auth-card" onSubmit={submit}><span className="eyebrow">WELCOME BACK</span><h1>Login</h1><p>Access your Crafto Bites account.</p><label>Email<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Password<input required type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>{error&&<div className="error-box">{error}</div>}<button className="primary-btn full">Login →</button><p className="auth-switch">New here? <Link to="/register">Create an account</Link></p></form></section>;
}
