import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useApp } from "../context";

export default function Register() {
  const [form,setForm]=useState({name:"",email:"",phone:"",password:"",confirm:""});
  const [error,setError]=useState("");
  const {login}=useApp();
  const navigate=useNavigate();

  async function submit(e){
    e.preventDefault(); setError("");
    if(form.password!==form.confirm) return setError("Passwords do not match.");
    if(form.password.length<8) return setError("Password must be at least 8 characters.");
    try { const data=await api("/auth/register",{method:"POST",body:JSON.stringify({name:form.name,email:form.email,phone:form.phone,password:form.password})}); login(data); navigate("/account"); }
    catch(e){setError(e.message);}
  }

  return <section className="auth-section"><form className="auth-card" onSubmit={submit}><span className="eyebrow">JOIN CRAFTO BITES</span><h1>Create account</h1><label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Email<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Mobile<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label><label>Password<input required minLength="8" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label><label>Confirm password<input required minLength="8" type="password" value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})}/></label>{error&&<div className="error-box">{error}</div>}<button className="primary-btn full">Register →</button><p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p></form></section>;
}
