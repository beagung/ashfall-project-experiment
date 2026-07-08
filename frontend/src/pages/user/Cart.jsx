import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  };

  useEffect(() => {
    loadCart();
    window.addEventListener('storage', loadCart);
    return () => window.removeEventListener('storage', loadCart);
  }, []);

  const saveAndSync = (newCart) => {
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCartItems(newCart);
    window.dispatchEvent(new Event('storage'));
  };

  // Menggunakan 'id' sebagai primary key murni dari tabel products baru Anda
  const handleSizeChange = (id, oldSize, newSize) => {
    if (oldSize === newSize) return;

    const item = cartItems.find(i => (i.id === id || i.id_product === id) && i.selectedSize === oldSize);
    if (!item) return;

    const newSizeStock = item.sizes ? (item.sizes[newSize] || 0) : 0;

    if (newSizeStock <= 0) {
      alert(`OUT_OF_STOCK: SIZE ${newSize} IS UNAVAILABLE`);
      return;
    }

    const duplicateItem = cartItems.find(i => (i.id === id || i.id_product === id) && i.selectedSize === newSize);
    
    if (duplicateItem) {
      const updatedCart = cartItems
        .map(i => {
          if ((i.id === id || i.id_product === id) && i.selectedSize === newSize) {
            return { ...i, quantity: Math.min(newSizeStock, i.quantity + item.quantity) };
          }
          return i;
        })
        .filter(i => !((i.id === id || i.id_product === id) && i.selectedSize === oldSize));
      
      saveAndSync(updatedCart);
    } else {
      const updatedCart = cartItems.map(i => {
        if ((i.id === id || i.id_product === id) && i.selectedSize === oldSize) {
          return { ...i, selectedSize: newSize, quantity: 1 };
        }
        return i;
      });
      saveAndSync(updatedCart);
    }
  };

  const updateQuantity = (id, currentSize, amount) => {
    const updatedCart = cartItems.map(item => {
      if ((item.id === id || item.id_product === id) && item.selectedSize === currentSize) {
        const maxStock = item.sizes ? (item.sizes[currentSize] || 0) : 99;
        const newQty = Math.max(1, Math.min(maxStock, item.quantity + amount));
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveAndSync(updatedCart);
  };

  const removeItem = (id, selectedSize) => {
    const updatedCart = cartItems.filter(item => !((item.id === id || item.id_product === id) && item.selectedSize === selectedSize));
    saveAndSync(updatedCart);
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const priceAfterDiscount = item.price - (item.price * (item.discount / 100 || 0));
    return acc + (priceAfterDiscount * item.quantity);
  }, 0);

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20 uppercase">
      {/* --- HEADER --- */}
      <div className="bg-black text-white pt-32 pb-16 px-6 border-b-12px border-[#f97316]">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <p className="text-[#f97316] font-black tracking-[0.4em] text-[10px] mb-2 italic">
              Terminal // Checkout_Sequence
            </p>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic leading-none">
              MY CART<span className="text-[#f97316]">.</span>
            </h1>
          </div>
          <button 
            onClick={() => navigate('/shop')}
            className="hidden md:flex items-center gap-2 font-black text-xs hover:text-[#f97316] transition-colors pb-2 border-b-4 border-white hover:border-[#f97316]"
          >
            <ArrowBackIcon fontSize="small" /> CONTINUE_SHOPPING
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        {cartItems.length === 0 ? (
          <div className="py-40 text-center border-4 border-black border-dashed">
            <ShoppingBagOutlinedIcon sx={{ fontSize: 80, mb: 4, opacity: 0.2 }} />
            <h2 className="text-4xl font-black italic text-zinc-300 tracking-tighter">YOUR_ARCHIVE_IS_EMPTY</h2>
            <button 
              onClick={() => navigate('/shop')}
              className="mt-8 bg-black text-white px-10 py-4 font-black hover:bg-[#f97316] hover:text-black transition-all shadow-[8px_8px_0px_#ccc]"
            >
              RETURN_TO_COLLECTION
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="hidden md:grid grid-cols-4 pb-4 border-b-4 border-black font-black text-[10px] tracking-widest text-zinc-400">
                <div className="col-span-2">PRODUCT_DETAILS</div>
                <div className="text-center">QUANTITY</div>
                <div className="text-right">SUBTOTAL</div>
              </div>

              {cartItems.map((item, index) => {
                const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];
                const targetID = item.id || item.id_product;
                const displayID = String(targetID);

                return (
                  <div key={`${displayID}-${item.selectedSize}-${index}`} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center border-b-2 border-zinc-100 pb-8 group">
                    <div className="md:col-span-2 flex gap-6">
                      <div className="w-24 h-32 bg-zinc-100 border-2 border-black overflow-hidden shrink-0 shadow-[4px_4px_0px_#000]">
                        <img 
                          src={item.image || (Array.isArray(item.images) ? item.images[0] : '/placeholder.png')} 
                          alt={item.name} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                        />
                      </div>
                      <div className="flex flex-col justify-center font-black">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[9px] text-zinc-400 italic">SWAP_SIZE:</span>
                          <div className="flex gap-1">
                            {availableSizes.map((size) => {
                              const isSelected = item.selectedSize === size;
                              const stock = item.sizes ? (item.sizes[size] || 0) : 0;
                              return (
                                <button
                                  key={size}
                                  onClick={() => handleSizeChange(targetID, item.selectedSize, size)}
                                  disabled={stock <= 0}
                                  className={`text-[10px] px-2 py-0.5 border-2 transition-all ${
                                    isSelected 
                                      ? 'bg-[#f97316] border-black text-black shadow-[2px_2px_0px_#000]' 
                                      : stock > 0 
                                        ? 'bg-white border-zinc-200 hover:border-black text-zinc-400 hover:text-black' 
                                        : 'bg-zinc-100 border-zinc-100 text-zinc-200 cursor-not-allowed line-through'
                                  }`}
                                >
                                  {size}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <h3 className="text-xl italic leading-tight mb-2 uppercase">{item.name}</h3>
                        <p className="text-[9px] text-zinc-400 font-bold mb-3 italic tracking-tighter">
                          REF_{displayID.slice(-6)} // STOCK: {item.sizes ? (item.sizes[item.selectedSize] || 0) : "N/A"}
                        </p>
                        
                        <button 
                          onClick={() => removeItem(targetID, item.selectedSize)}
                          className="flex items-center gap-1 text-[10px] text-red-600 hover:bg-red-600 hover:text-white border-2 border-red-600 w-fit px-2 py-1 transition-all"
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 14 }} /> REMOVE
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="flex items-center border-4 border-black bg-white shadow-[4px_4px_0px_#000]">
                        <button 
                          onClick={() => updateQuantity(targetID, item.selectedSize, -1)}
                          className="p-2 hover:bg-black hover:text-white transition-colors border-r-2 border-black"
                        >
                          <RemoveIcon fontSize="small" />
                        </button>
                        <span className="px-6 font-black text-lg">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(targetID, item.selectedSize, 1)}
                          className="p-2 hover:bg-black hover:text-white transition-colors border-l-2 border-black"
                        >
                          <AddIcon fontSize="small" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right font-black">
                      <p className="text-2xl italic tracking-tighter text-[#f97316]">
                        IDR {((item.price - (item.price * (item.discount / 100 || 0))) * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <div className="border-4 border-black p-8 bg-zinc-50 shadow-[12px_12px_0px_#000] sticky top-32">
                <h2 className="text-2xl font-black italic border-b-4 border-black pb-4 mb-6 uppercase">Order_Summary</h2>
                <div className="flex justify-between items-end border-t-4 border-black pt-6 mb-8 uppercase font-black">
                  <span className="text-sm tracking-widest">TOTAL_DUE</span>
                  <span className="text-4xl italic tracking-tighter">IDR {subtotal.toLocaleString('id-ID')}</span>
                </div>

                <button 
                  onClick={() => navigate('/orders')}
                  className="w-full bg-[#f97316] text-black border-4 border-black py-5 font-black text-sm tracking-[0.2em] hover:bg-black hover:text-white transition-all shadow-[6px_6px_0px_#000]"
                >
                  INITIATE_CHECKOUT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;