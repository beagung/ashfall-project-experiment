import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const LoginCustomer = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate(`/profile/${data.user.id}`);
      } else {
        alert(data.message || "LOGIN FAILED");
      }
    } catch (err) {
      console.error(err);
      alert("SERVER CONNECTION ERROR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="bg-black border-2 border-white p-14 text-center w-full max-w-md relative z-10">
        <h2 className="text-white font-black text-3xl mb-10 italic">ASHFALL™</h2>

        <input required type="email" placeholder="EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-4 bg-black border border-zinc-700 text-white text-xs outline-none focus:border-[#f97316]" />

        <input
          required
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 bg-black border border-zinc-700 text-white text-xs outline-none focus:border-[#f97316]"
        />

        <button type="submit" disabled={loading} className="w-full p-4 bg-white text-black font-black uppercase hover:bg-[#f97316] transition-all">
          {loading ? "AUTHENTICATING..." : "LOGIN"}
        </button>

        {/* Tambahan Teks Register */}
        <p className="mt-6 text-[10px] text-zinc-500 uppercase tracking-widest">
          Don't have an account?{" "}
          <NavLink to="/register-customer" className="text-white underline underline-offset-4 font-black hover:text-[#f97316] transition-colors">
            Register
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default LoginCustomer;
