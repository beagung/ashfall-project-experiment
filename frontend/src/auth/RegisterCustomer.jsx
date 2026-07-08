import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const RegisterCustomer = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match!");
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      if (data.success) {
        alert("Registration Successful!");
        navigate('/login-customer');
      } else {
        alert(data.message || "Registration Failed");
      }
    } catch (err) { alert("Server Connection Error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-4">
      <div className="relative w-420px">
        <div className="absolute inset-0 translate-x-2 translate-y-2 border-2 border-white -z-10"></div>
        <form onSubmit={handleRegister} className="bg-black border-2 border-white p-10 text-center uppercase relative z-10">
          <h2 className="font-black text-2xl text-white mb-6 italic">ASHFALL™</h2>
          <div className="space-y-3">
            <input type="email" placeholder="EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-black border border-zinc-800 text-white text-xs outline-none focus:border-[#f97316]" required />
            <input type="password" placeholder="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-black border border-zinc-800 text-white text-xs outline-none focus:border-[#f97316]" required />
            <input type="password" placeholder="CONFIRM_PASSWORD" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 bg-black border border-zinc-800 text-white text-xs outline-none focus:border-[#f97316]" required />
            <button disabled={loading} className="w-full p-4 bg-white text-black font-black text-[10px] hover:bg-[#f97316] hover:text-white transition-all">
              {loading ? 'PROCESSING...' : 'REGISTER_ACCOUNT'}
            </button>
          </div>
          <p className="mt-6 text-[10px] text-zinc-500">
            Already have an account? <NavLink to="/login-customer" className="text-white underline underline-offset-4 font-black">Login</NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterCustomer;