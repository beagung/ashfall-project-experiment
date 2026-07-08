import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundShop from '../../assets/img/backgroundshop.png';

const EditeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', address: '', 
    city: '', province: '', district: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/profiles/${id}`)
      .then(res => {
        setFormData(res.data);
        setPreviewUrl(res.data.avatar_url);
      })
      .catch(err => console.error("Error fetching data:", err));

    axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json`)
      .then(res => setProvinces(res.data))
      .catch(err => console.error("Error fetching provinces", err));
  }, [id]);

  const handleProvinceChange = (e) => {
    const id = e.target.value;
    const selected = provinces.find(p => String(p.id) === String(id));
    setFormData({ ...formData, province: selected ? selected.name : '', city: '', district: '' });
    setCities([]); setDistricts([]);
    if (id) axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${id}.json`).then(res => setCities(res.data));
  };

  const handleCityChange = (e) => {
    const id = e.target.value;
    const selected = cities.find(c => String(c.id) === String(id));
    setFormData({ ...formData, city: selected ? selected.name : '', district: '' });
    setDistricts([]);
    if (id) axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${id}.json`).then(res => setDistricts(res.data));
  };

  const handleDistrictChange = (e) => {
    const id = e.target.value;
    const selected = districts.find(d => String(d.id) === String(id));
    setFormData({ ...formData, district: selected ? selected.name : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();
    Object.keys(formData).forEach(key => dataToSend.append(key, formData[key] || ''));
    if (avatarFile) dataToSend.append('avatar', avatarFile);

    try {
        await axios.put(`http://localhost:5000/api/profiles/${id}`, dataToSend, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("PROFILE_UPDATED");
        navigate(`/profile/${id}`);
    } catch (err) {
        alert("UPDATE_FAILED: " + (err.response?.data?.error || "Unknown Error"));
    }
  };

  return (
    <div className="min-h-screen bg-fixed bg-cover bg-center text-black font-sans pb-20 uppercase font-bold"
         style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url(${backgroundShop})` }}>
      
      {/* HEADER */}
      <div className="bg-black text-white pt-32 pb-24 px-6 border-b-8 border-orange-500">
        <div className="max-w-7xl mx-auto">
          <p className="text-orange-500 font-black tracking-widest text-xs uppercase mb-4 italic animate-pulse">System_Settings // Edit_Identity</p>
          <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter">EDIT PROFILE<span className="text-orange-500">.</span></h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-12">
        <form onSubmit={handleSubmit} className="bg-white border-4 border-black p-8 md:p-12 shadow-2xl">
          
          {/* AVATAR UPLOAD */}
          <div className="flex flex-col items-center mb-12">
            <div className="w-32 h-32 md:w-40 md:h-40 border-4 border-black rounded-full overflow-hidden relative group cursor-pointer shadow-lg">
              <img src={previewUrl || '/default-avatar.png'} className="w-full h-full object-cover" alt="Preview" />
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20" accept="image/*" 
                onChange={(e) => {
                  setAvatarFile(e.target.files[0]);
                  setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                }} 
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">CHANGE</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {['full_name', 'email', 'phone', 'address'].map(field => (
              <div key={field} className={field === 'address' ? 'md:col-span-2' : ''}>
                <label className="block text-[10px] font-black text-orange-500 tracking-[0.2em] mb-2">{field.toUpperCase()}</label>
                <input 
                  value={formData[field] || ''} 
                  onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                  className="w-full border-2 border-black p-4 font-black uppercase focus:bg-zinc-50 outline-none" 
                />
              </div>
            ))}

            {/* DROPDOWN WILAYAH */}
            {[
              { label: 'PROVINCE', value: formData.province, onChange: handleProvinceChange, options: provinces },
              { label: 'CITY', value: formData.city, onChange: handleCityChange, options: cities },
              { label: 'DISTRICT', value: formData.district, onChange: handleDistrictChange, options: districts }
            ].map((item, i) => (
              <div key={i}>
                <label className="block text-[10px] font-black text-orange-500 tracking-[0.2em] mb-2">{item.label}</label>
                <select onChange={item.onChange} className="w-full border-2 border-black p-4 font-black uppercase bg-white cursor-pointer focus:bg-zinc-50">
                  <option value="">{item.value || `SELECT ${item.label}`}</option>
                  {item.options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col md:flex-row gap-4">
            <button type="submit" className="flex-1 bg-black text-white py-4 font-black hover:bg-orange-500 transition-all border-2 border-black">SAVE_CHANGES</button>
            <button type="button" onClick={() => navigate(`/profile/${id}`)} className="px-12 py-4 border-2 border-black font-black hover:bg-zinc-100 transition-all">CANCEL</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditeProfile;