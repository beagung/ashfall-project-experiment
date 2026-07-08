import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Orders = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    province: "",
    city: "",
    district: "",
  });

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);

    axios.get("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json").then((res) => setProvinces(res.data));

    const savedUser = JSON.parse(localStorage.getItem("user"));
    const userId = savedUser?.id_profiles || savedUser?.id;

    if (userId) {
      setIsMember(true);
      axios
        .get(`http://localhost:5000/api/profiles/${userId}`)
        .then((res) => {
          const profile = res.data;
          setFormData({
            name: profile.full_name || profile.name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            address: profile.address || "",
            province: profile.province || "",
            city: profile.city || "",
            district: profile.district || "",
          });
        })
        .catch((err) => console.error("Gagal menarik data profil:", err));
    }
  }, []);

  const handleProvinceChange = (e) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setFormData((prev) => ({ ...prev, province: name, city: "", district: "" }));
    if (id) axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${id}.json`).then((res) => setCities(res.data));
  };

  const handleCityChange = (e) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setFormData((prev) => ({ ...prev, city: name, district: "" }));
    if (id) axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${id}.json`).then((res) => setDistricts(res.data));
  };

  const handleDistrictChange = (e) => {
    setFormData((prev) => ({ ...prev, district: e.target.options[e.target.selectedIndex].text }));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price - (item.price * (item.discount || 0)) / 100) * item.quantity, 0);
  const handleInputChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCheckout = async () => {
    if (isProcessing) return;
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.province || !formData.city || !formData.district) {
      alert("PLEASE FILL ALL REQUIRED FIELDS!");
      return;
    }

    setIsProcessing(true);
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      const payload = {
        ...formData,
        user_id: savedUser?.id_profiles || savedUser?.id || null,
        cartItems: cartItems.map((item) => ({
          id: String(item.id || item.id_product),
          name: item.name,
          price: Number(item.price - (item.price * (item.discount || 0)) / 100),
          quantity: Number(item.quantity),
          size: String(item.selectedSize || item.size || "N/A"),
        })),
      };

      const response = await axios.post("http://localhost:5000/api/orders/create-transaction", payload);
      if (window.snap) {
        window.snap.embed(response.data.token, {
          embedId: "snap-container",
          onSuccess: () => {
            localStorage.removeItem("cart");
            alert("TRANSACTION_SUCCESS");
            navigate("/orders/history");
          },
          onPending: () => setIsProcessing(false),
          onError: () => setIsProcessing(false),
          onClose: () => setIsProcessing(false),
        });
      }
    } catch (err) {
      setIsProcessing(false);
      alert("ERROR: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20 uppercase">
      <div className="bg-black text-white pt-32 pb-16 px-6 border-b-12 border-[#f97316]">
        <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter max-w-7xl mx-auto">
          ORDER_DETAILS<span className="text-[#f97316]">.</span>
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          {/* CTA: Opsi Login/Register bagi Tamu */}
          {!isMember && (
            <div className="mb-8 p-6 border-[6px] border-black bg-black text-white flex justify-between items-center shadow-[8px_8px_0px_#f97316]">
              <p className="font-black italic">INGIN DAFTAR MEMBER ATAU PUNYA AKUN?</p>
              <button onClick={() => navigate("/login-customer", { state: { from: "/orders" } })} className="bg-[#f97316] text-black px-6 py-2 font-black hover:bg-white transition-all">
                LOGIN / REGISTER
              </button>
            </div>
          )}

          <div className="border-[6px] border-black p-8 shadow-[12px_12px_0px_#000] bg-white">
            <h2 className="text-2xl font-black mb-10 italic border-b-[6px] border-black pb-4 flex justify-between">SHIPPING_MANIFEST {isMember && <span className="text-xs bg-black text-[#f97316] px-3 py-1 font-mono">MEMBER_MODE</span>}</h2>

            <div className="space-y-6">
              {["name", "email", "phone"].map((field) => (
                <div key={field}>
                  <label className="text-[10px] font-black italic mb-1">{field.toUpperCase()}</label>
                  <input name={field} value={formData[field]} onChange={handleInputChange} readOnly={isMember} className={`w-full p-4 border-[3px] border-black font-black ${isMember ? "bg-zinc-100 cursor-not-allowed" : "bg-white"}`} />
                </div>
              ))}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black italic mb-1">PROVINCE</label>
                  {isMember ? (
                    <input value={formData.province} readOnly className="w-full p-4 border-[3px] border-black font-black bg-zinc-100 cursor-not-allowed" />
                  ) : (
                    <select onChange={handleProvinceChange} className="w-full p-4 border-[3px] border-black font-black bg-white cursor-pointer">
                      <option value="">SELECT</option>
                      {provinces.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-black italic mb-1">CITY</label>
                  {isMember ? (
                    <input value={formData.city} readOnly className="w-full p-4 border-[3px] border-black font-black bg-zinc-100 cursor-not-allowed" />
                  ) : (
                    <select onChange={handleCityChange} className="w-full p-4 border-[3px] border-black font-black bg-white cursor-pointer">
                      <option value="">SELECT</option>
                      {cities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-black italic mb-1">DISTRICT</label>
                  {isMember ? (
                    <input value={formData.district} readOnly className="w-full p-4 border-[3px] border-black font-black bg-zinc-100 cursor-not-allowed" />
                  ) : (
                    <select onChange={handleDistrictChange} className="w-full p-4 border-[3px] border-black font-black bg-white cursor-pointer">
                      <option value="">SELECT</option>
                      {districts.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black italic mb-1">DETAILED ADDRESS</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  readOnly={isMember}
                  className={`w-full p-4 border-[3px] border-black font-black h-32 ${isMember ? "bg-zinc-100 cursor-not-allowed" : "bg-white"}`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="border-[6px] border-black p-8 bg-zinc-50 shadow-[16px_16px_0px_#f97316] sticky top-32">
            <h2 className="text-2xl font-black italic border-b-[6px] border-black pb-4 mb-8">SUMMARY_CHECK</h2>
            <div className="space-y-4 mb-10 max-h-80 overflow-y-auto">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-3 border-[3px] border-black bg-white">
                  <div className="flex-1">
                    <h3 className="text-xs font-black italic">{item.name}</h3>
                    <p className="text-[10px] text-[#f97316]">
                      SIZE: {item.selectedSize} | QTY: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t-[6px] border-black pt-6 mb-8">
              <span className="font-black">TOTAL</span>
              <span className="font-black text-4xl italic">IDR {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <button onClick={handleCheckout} disabled={isProcessing} className="w-full bg-[#f97316] py-6 font-black text-xl hover:bg-black hover:text-[#f97316] transition-all">
              {isProcessing ? "PROCESSING..." : "INITIATE_PAYMENT_GATEWAY"}
            </button>
            <div id="snap-container" className="mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
