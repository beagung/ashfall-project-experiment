import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import backgroundShop from "../../assets/img/backgroundshop.png";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ subject: "", message: "" });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cek user yang login
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Notifikasi loading agar pelanggan tahu sistem sedang bekerja
    const loadingToast = toast.loading("SENDING_PAYLOAD...");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success("MESSAGE_DELIVERED_SUCCESSFULLY!");
        setFormData({ subject: "", message: "" });
      } else {
        toast.dismiss(loadingToast);
        toast.error("SYSTEM_REJECTED: " + data.message);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("CRITICAL_ERROR: SERVER_OFFLINE");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Konfigurasi tampilan Toast agar sesuai tema Industrial/Terminal */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#000",
            color: "#fff",
            border: "2px solid #fff",
            borderRadius: "0px",
            fontFamily: "monospace",
            fontWeight: "bold",
            textTransform: "uppercase",
          },
        }}
      />

      <section className="relative h-[40vh] border-b-8 border-black overflow-hidden">
        <img src={backgroundShop} className="w-full h-full object-cover brightness-50" alt="Contact" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">CONTACT US</h1>
          <p className="mt-4 tracking-[0.3em] font-bold text-sm uppercase text-zinc-900">Drop your heart, wear your soul</p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-10">
            <h2 className="text-5xl font-black tracking-tighter underline decoration-orange-500 decoration-8 underline-offset-8 uppercase italic">GET IN TOUCH</h2>
            <div className="space-y-6 border-l-8 border-white pl-8">
              <div>
                <p className="text-xs text-zinc-500 font-black uppercase tracking-widest">Location</p>
                <p className="text-2xl font-black">TEMANGGUNG, INDONESIA</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-black p-10 shadow-[16px_16px_0px_#f97316]">
            {!user ? (
              <div className="text-black text-center py-10">
                <h3 className="text-2xl font-black mb-4 uppercase italic">Restricted Access</h3>
                <p className="mb-6 font-bold">Please login to send a message.</p>
                <button onClick={() => navigate("/login-customer")} className="bg-black text-white px-8 py-4 font-black uppercase hover:bg-orange-500 transition-all">
                  Go to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-black">
                <div className="bg-zinc-100 p-4 border-2 border-black mb-4">
                  <p className="text-[10px] font-black uppercase italic">Sender: {user.full_name}</p>
                  <p className="text-[10px] font-black uppercase italic">Email: {user.email}</p>
                </div>

                <div>
                  <label className="block text-xs font-black mb-2 uppercase italic">Subject *</label>
                  <input name="subject" type="text" required value={formData.subject} onChange={handleChange} className="w-full border-4 border-black p-4 outline-none font-bold text-lg uppercase" placeholder="ENTER SUBJECT" />
                </div>

                <div>
                  <label className="block text-xs font-black mb-2 uppercase italic">Message Payload *</label>
                  <textarea
                    name="message"
                    required
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full border-4 border-black p-4 outline-none font-bold text-lg resize-none uppercase"
                    placeholder="TYPE YOUR MESSAGE..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-6 font-black text-xl tracking-[0.4em] border-4 border-black hover:bg-orange-500 hover:text-black transition-all shadow-[8px_8px_0px_#000] disabled:opacity-50"
                >
                  {loading ? "SENDING..." : "SEND_MESSAGE"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
