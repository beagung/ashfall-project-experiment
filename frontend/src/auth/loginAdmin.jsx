import React, { useState } from 'react';

const LoginAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "LOGIN_FAILED");
      }

      // Simpan kredensial
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('userRole', data.role);
      
      window.location.href = '/admin/dashboard';

    } catch (err) {
      alert("ERROR: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-4">
      <div className="relative w-420px">
        <div className="absolute inset-0 translate-x-2 translate-y-2 border-2 border-white -z-10"></div>
        <div className="bg-black border-2 border-white p-14 text-center uppercase relative z-10">
          <h2 className="font-black text-[2.5rem] leading-none text-white mb-1 italic">ASHFALL™</h2>
          <span className="text-[0.75rem] text-zinc-500 block mb-10">
            {loading ? 'AUTHENTICATING...' : 'ADMIN_CORE_ACCESS'}
          </span>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              required
              type="email"
              placeholder="EMAIL_ADDRESS"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-black border border-zinc-800 text-white outline-none focus:border-[#f97316] text-xs"
            />
            <input
              required
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-black border border-zinc-800 text-white outline-none focus:border-[#f97316] text-xs"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 p-5 bg-white text-black font-black text-sm hover:bg-[#f97316] hover:text-white transition-all uppercase"
            >
              {loading ? 'WAIT...' : 'LOGIN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;