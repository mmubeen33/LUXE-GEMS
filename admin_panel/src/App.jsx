import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Edit, ShoppingBag, Trash2, Plus, Star, CheckCircle, Save, Grid, SlidersHorizontal, LogOut, Phone, Truck, ChevronDown, ChevronUp } from 'lucide-react';

const getCatName = (c) => typeof c === 'string' ? c : c?.category;


// --- SECRET ADMIN SYSTEM COMPONENTS ---

const AdminNotification = ({ message, type = 'error', onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`mb-6 p-4 border ${type === 'error' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-teal-50 border-teal-200 text-teal-700'} text-[10px] md:text-xs rounded-xl font-bold tracking-widest flex items-center justify-between shadow-sm z-50`}>
          <span>{message}</span>
          <button type="button" onClick={onClose} className="hover:opacity-70 transition-opacity"><X size={14} /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AdminLogin = ({ onLogin, cancel }) => {
  const [pwd, setPwd] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: pwd })
      });
      const data = await res.json();
      if (data.success) {
        onLogin();
      } else {
        setErrorMsg(data.message || 'Incorrect Secret Password!');
        setTimeout(() => setErrorMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg('Server connection failed. Try again.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  }
  return (
    <div className="min-h-screen bg-[#2d2926] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-teal-500/10 blur-[100px] rounded-full top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full bottom-[-50px] right-[-50px]"></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl shadow-black/50 w-full max-w-md text-center relative z-10">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-sm border border-gray-100">
          <User size={32} className="text-[#2d2926]" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl md:text-3xl font-serif text-[#2d2926] mb-2 leading-tight">Admin Portal</h1>
        <p className="text-[9px] md:text-[10px] text-gray-400 tracking-[0.3em] uppercase mb-8 font-medium">Authorized Personnel Only</p>
        <AdminNotification message={errorMsg} onClose={() => setErrorMsg('')} />
        <form onSubmit={handleLogin} className="space-y-5">
          <input type="password" placeholder="Enter Master Password" value={pwd} onChange={e => setPwd(e.target.value)} className="w-full border-2 border-gray-100 bg-gray-50 rounded-2xl p-4 text-sm outline-none focus:bg-white focus:border-black transition-colors text-center tracking-widest placeholder:text-gray-300 placeholder:tracking-normal" />
          <div className="pt-2 flex flex-col gap-3">
            <button type="submit" className="w-full bg-[#2d2926] text-white py-4 rounded-2xl text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase hover:bg-black shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Secure Login</button>
            <button type="button" onClick={cancel} className="w-full py-4 rounded-2xl border-2 border-transparent text-[10px] md:text-xs text-gray-500 font-bold tracking-[0.2em] uppercase hover:text-black hover:bg-gray-50 transition-all">Return to Store</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const ProductModal = ({ isOpen, onClose, product, onSave, categories = [] }) => {
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price || '');
  const [oldPrice, setOldPrice] = useState(product?.oldPrice || '');
  const [discount, setDiscount] = useState(product?.discount || '');
  const [category, setCategory] = useState(product?.category || (categories.length > 0 ? (typeof categories[0] === 'string' ? categories[0] : categories[0].category) : ''));
  const [subCategory, setSubCategory] = useState(product?.subCategory || '');
  const [soldOut, setSoldOut] = useState(product?.soldOut || false);
  const [description, setDescription] = useState(product?.description || '');
  const [errorMsg, setErrorMsg] = useState('');

  const [images, setImages] = useState(product?.images || ['', '', '']);
  const [thumbnailIdx, setThumbnailIdx] = useState(() => {
    if (!product?.images || product.images.length === 0) return 0;
    const idx = product.images.indexOf(product.img);
    return idx >= 0 ? idx : 0;
  });

  const handleSave = () => {
    if (!name || !price || images[thumbnailIdx] === '' || !category.trim()) {
      setErrorMsg("Name, Price, valid Thumbnail Picture, and Category are required.");
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }
    const finalProduct = {
      id: product?.id || `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name, price: Number(price), oldPrice: oldPrice ? Number(oldPrice) : null, discount: discount || null, category: category.trim(), soldOut, brand: 'LUXE GEMS',
      subCategory: subCategory.trim() || null,
      images: images.filter(url => url !== ''),
      img: images[thumbnailIdx] || images.filter(url => url !== '')[0],
      sizes: product?.sizes || ["3mm", "Adjustable"],
      description: description.trim() || `Premium handcrafted ${category} from LUXE GEMS.`
    };
    onSave(finalProduct);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4 py-8">
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-600 z-10"></div>

            {/* Header */}
            <div className="flex justify-between items-center p-6 md:px-10 md:py-8 border-b border-gray-100 shrink-0 bg-white z-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif text-[#2d2926] leading-tight flex items-center gap-3">
                  <span className="bg-[#2d2926] text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg"><Edit size={18} /></span>
                  {product ? 'Edit Masterpiece' : 'Add New Masterpiece'}
                </h2>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Configure product details & imagery</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-100 p-3"><X size={24} /></button>
            </div>

            <AdminNotification message={errorMsg} onClose={() => setErrorMsg('')} />

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 md:px-10 md:py-8 flex-1 no-scrollbar bg-gray-50/30">

              {/* Image Upload Section */}
              <div className="mb-10 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag size={18} className="text-teal-600" />
                  <h3 className="text-xs font-bold text-[#2d2926] uppercase tracking-widest">Product Imagery</h3>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed mb-6">Upload up to 3 high-quality angles. The selected thumbnail will be the primary storefront image.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[0, 1, 2].map(idx => (
                    <div key={idx} className={`bg-gray-50 p-4 rounded-xl border-2 transition-all duration-300 ${thumbnailIdx === idx ? 'border-teal-500 shadow-md shadow-teal-500/10' : 'border-gray-100 hover:border-gray-300'}`}>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Angle {idx + 1}</label>
                        {thumbnailIdx === idx && <span className="bg-teal-100 text-teal-700 text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold">Thumbnail</span>}
                      </div>

                      <div className="aspect-[4/3] bg-white border border-dashed border-gray-300 flex justify-center items-center overflow-hidden mb-4 rounded-lg relative group cursor-pointer hover:bg-gray-50 transition-colors">
                        {images[idx] ? (
                          <>
                            <img src={images[idx]} alt={`Prod Angle ${idx + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                              <button onClick={() => {
                                if (images[idx]) {
                                  const filename = images[idx].split('/').pop();
                                  fetch(`/api/upload/${filename}`, { method: 'DELETE' }).catch(err => console.error('Failed to delete image:', err));
                                }
                                setImages(prev => { const next = [...prev]; next[idx] = ''; return next; });
                              }} className="bg-red-500 text-white p-2 text-xs rounded-full shadow-lg hover:bg-red-600 flex items-center gap-2 px-4 transition-transform hover:scale-105"><Trash2 size={14} /> Remove</button>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-4">
                            <Plus size={24} className="text-gray-300 mx-auto mb-2 group-hover:text-gray-400 transition-colors" />
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Click to Add</span>
                          </div>
                        )}
                        {!images[idx] && <input type="file" accept="image/*" onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            try {
                              const formData = new FormData();
                              formData.append('image', file);
                              const res = await fetch('/api/upload', {
                                method: 'POST',
                                body: formData
                              });
                              if (!res.ok) throw new Error('Failed to upload image');
                              const data = await res.json();
                              // Data returns { url: '/uploads/filename.jpg' }
                              // Prepend backend URL
                              const fullUrl = `${data.url}`;

                              setImages(prev => {
                                const next = [...prev];
                                next[idx] = fullUrl;
                                return next;
                              });
                            } catch (err) {
                              setErrorMsg("Error uploading image: " + err.message);
                              setTimeout(() => setErrorMsg(''), 4000);
                            }
                          }
                        }} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />}
                      </div>
                      <button onClick={() => setThumbnailIdx(idx)} className={`w-full text-[10px] py-2.5 rounded-lg tracking-widest uppercase font-bold transition-all ${thumbnailIdx === idx ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' : 'bg-white border border-gray-200 text-gray-500 hover:border-teal-500 hover:text-teal-600'}`}>Set as Thumbnail</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="col-span-1 md:col-span-2">
                  <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Product Name <span className="text-red-500">*</span></label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-300" placeholder="e.g. Elegance Diamond Ring" required />
                </div>

                <div>
                  <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Current Price (PKR) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">Rs.</span>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl p-4 pl-12 text-sm focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-300" placeholder="5000" required />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Old Price (Strike-through)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">Rs.</span>
                    <input type="number" value={oldPrice} onChange={e => {
                      const val = e.target.value;
                      setOldPrice(val);
                      if (val && discount) {
                        const match = String(discount).match(/(\d+)/);
                        if (match) {
                          const perc = parseInt(match[1], 10);
                          if (perc > 0 && perc < 100) setPrice(Math.round(Number(val) * (1 - perc / 100)));
                        }
                      }
                    }} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl p-4 pl-12 text-sm focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-300" placeholder="7500" />
                  </div>
                </div>

                <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-100">
                  <label className="text-[10px] md:text-xs font-bold text-orange-600 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Star size={14} /> Sale Badge</label>
                  <input type="text" value={discount} onChange={e => {
                    const val = e.target.value;
                    setDiscount(val);
                    if (oldPrice && val) {
                      const match = val.match(/(\d+)/);
                      if (match) {
                        const perc = parseInt(match[1], 10);
                        if (perc > 0 && perc < 100) setPrice(Math.round(Number(oldPrice) * (1 - perc / 100)));
                      }
                    }
                  }} className="w-full border-2 border-orange-200 bg-white rounded-xl p-3.5 text-sm focus:border-orange-500 outline-none transition-all placeholder:text-orange-200 text-orange-700 font-bold" placeholder="e.g. -20%" />
                </div>

                <div>
                  <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Category <span className="text-red-500">*</span></label>
                  <select value={category} onChange={e => {
                    setCategory(e.target.value);
                    setSubCategory(''); // Reset subcategory when category changes
                  }} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-black outline-none transition-all cursor-pointer appearance-none" required>
                    <option value="" disabled>Select Category</option>
                    {categories.map(c => {
                      const catName = typeof c === 'string' ? c : c.category;
                      return <option key={catName} value={catName}>{catName}</option>;
                    })}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Subcategory (Optional)</label>
                  <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-black outline-none transition-all cursor-pointer appearance-none">
                    <option value="">No Subcategory</option>
                    {category && categories.find(c => (typeof c === 'string' ? c : c.category) === category)?.subcategories?.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Product Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-300 resize-none" placeholder="Describe your product... materials, gemstones, dimensions, occasion etc." />
                </div>

                <div className="col-span-1 md:col-span-2 flex items-center justify-between mt-2 bg-gray-900 text-white p-5 rounded-xl shadow-lg">
                  <div>
                    <h4 className="text-[11px] md:text-sm font-bold uppercase tracking-widest flex items-center gap-2"><CheckCircle size={16} className={soldOut ? "text-red-400" : "text-green-400"} /> Inventory Status</h4>
                    <p className="text-[9px] md:text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Marking as Sold Out disables checkout for this item.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={soldOut} onChange={e => setSoldOut(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-6 md:px-10 md:py-8 border-t border-gray-100 shrink-0 flex gap-4 bg-gray-50 z-10 justify-end">
              <button onClick={onClose} className="px-8 border-2 border-gray-200 bg-white rounded-xl py-4 text-[10px] md:text-xs uppercase tracking-widest font-bold hover:bg-gray-100 hover:border-gray-300 text-gray-600 transition-all shadow-sm">Cancel</button>
              <button onClick={handleSave} className="px-10 bg-[#2d2926] text-white rounded-xl py-4 text-[10px] md:text-xs uppercase tracking-widest font-bold hover:bg-black shadow-xl shadow-black/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-1"><Save size={18} /> Save Masterpiece</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// --- CONFIRM MODAL ---
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[400] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-sm md:max-w-md p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-600"></div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                <Trash2 size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-serif text-[#2d2926]">{title}</h2>
            </div>
            <p className="text-xs md:text-sm text-gray-500 mb-8 font-sans leading-relaxed">{message}</p>
            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl text-[10px] md:text-xs uppercase tracking-widest font-bold hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={onConfirm} className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl text-[10px] md:text-xs uppercase tracking-widest font-bold hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2">Yes, Delete</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const CategoryModal = ({ isOpen, onClose, category, onSave, categories, setCategories, showError }) => {
  const [name, setName] = useState('');
  const [newSub, setNewSub] = useState('');
  const [image, setImage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  // Local subcategories for NEW category (before it's saved to DB)
  const [localSubs, setLocalSubs] = useState([]);

  const isEditing = category && category.oldName;

  const currentCatData = isEditing
    ? categories.find(c => (typeof c === 'string' ? c : c.category) === category.oldName)
    : null;

  const subcategories = isEditing
    ? (typeof currentCatData === 'object' ? (currentCatData.subcategories || []) : [])
    : localSubs;

  useEffect(() => {
    if (isOpen) {
      setName(isEditing ? category.oldName : '');
      setNewSub('');
      setImage(isEditing && currentCatData && currentCatData.image ? currentCatData.image : '');
      setErrorMsg('');
      setLocalSubs([]);
    }
  }, [isOpen, category, isEditing, currentCatData]);

  const handleSave = () => {
    if (!name.trim()) {
      setErrorMsg("Category name is required.");
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }
    onSave({ oldName: isEditing ? category.oldName : null, newName: name.trim(), image, subcategories: localSubs });
  };

  // --- Add subcategory (for EDITING - saves to API immediately) ---
  const handleAddSubEdit = async () => {
    if (!newSub.trim() || !name) return;
    if (subcategories.includes(newSub.trim())) {
      setErrorMsg("Subcategory already exists.");
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }
    try {
      const res = await fetch('/api/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSub.trim(), category: name })
      });
      if (!res.ok) throw new Error('Failed to add subcategory');

      setCategories(prev => prev.map(c => {
        const cName = typeof c === 'string' ? c : c.category;
        if (cName === name) {
          return { category: cName, subcategories: [...(c.subcategories || []), newSub.trim()] };
        }
        return c;
      }));
      setNewSub('');
    } catch (err) {
      setErrorMsg(err.message);
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  // --- Add subcategory (for NEW category - local only, saved with category) ---
  const handleAddSubLocal = () => {
    if (!newSub.trim()) return;
    if (localSubs.includes(newSub.trim())) {
      setErrorMsg("Subcategory already exists.");
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }
    setLocalSubs(prev => [...prev, newSub.trim()]);
    setNewSub('');
  };

  const handleDeleteSubEdit = async (subName) => {
    try {
      const res = await fetch(`/api/subcategories/${encodeURIComponent(name)}/${encodeURIComponent(subName)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete subcategory');

      setCategories(prev => prev.map(c => {
        const cName = typeof c === 'string' ? c : c.category;
        if (cName === name) {
          return { category: cName, subcategories: (c.subcategories || []).filter(s => s !== subName) };
        }
        return c;
      }));
    } catch (err) {
      setErrorMsg(err.message);
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const handleDeleteSubLocal = (subName) => {
    setLocalSubs(prev => prev.filter(s => s !== subName));
  };

  const handleAddSub = isEditing ? handleAddSubEdit : handleAddSubLocal;
  const handleDeleteSub = isEditing ? handleDeleteSubEdit : handleDeleteSubLocal;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-md p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black to-gray-600"></div>
            <div className="flex justify-between items-center mb-8 shrink-0">
              <h2 className="text-2xl font-serif text-[#2d2926] flex items-center gap-3">
                <span className="bg-[#2d2926] text-white w-8 h-8 flex items-center justify-center rounded-full shadow-md"><Grid size={14} /></span>
                {isEditing ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-[#2d2926] transition-colors rounded-full hover:bg-gray-100 p-2"><X size={20} /></button>
            </div>

            <div className="overflow-y-auto flex-1 no-scrollbar">
              <AdminNotification message={errorMsg} onClose={() => setErrorMsg('')} />
              <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Category Name</label>
              <div className="relative mb-6">
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border-2 border-gray-100 rounded-xl p-4 text-sm focus:border-black outline-none transition-colors bg-gray-50 focus:bg-white" placeholder="e.g. Diamond Necklaces" autoFocus disabled={isEditing} />
                {isEditing && <p className="text-[9px] text-gray-400 mt-2 px-1">Main category names cannot be changed once created. You can only manage its subcategories.</p>}
              </div>

              <div className="mb-6">
                <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Category Display Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden relative group">
                    {image ? (
                      <img src={image} alt="Category" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">No Image</div>
                    )}
                    <input type="file" accept="image/*" onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        try {
                          const formData = new FormData();
                          formData.append('image', file);
                          const res = await fetch('/api/upload', { method: 'POST', body: formData });
                          if (!res.ok) throw new Error('Failed to upload');
                          const data = await res.json();
                          setImage(data.url);
                        } catch (err) {
                          setErrorMsg(err.message);
                          setTimeout(() => setErrorMsg(''), 4000);
                        }
                      }
                    }} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 leading-relaxed mb-2">Upload a high-quality squared image to represent this collection on the homepage.</p>
                    {image && <button onClick={() => setImage('')} className="text-[10px] text-red-500 font-bold uppercase tracking-widest hover:text-red-700 transition-colors">Remove Image</button>}
                  </div>
                </div>
              </div>

              {/* Subcategories section - shows for BOTH new and edit modes */}
              {(isEditing || name.trim()) && (
                <div className="mb-8 border-t border-gray-100 pt-6">
                  <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Manage Subcategories</label>
                  <p className="text-[9px] text-gray-400 mb-4">Optional — not all categories need subcategories.</p>

                  <div className="flex gap-2 mb-4">
                    <input type="text" value={newSub} onChange={e => setNewSub(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddSub()} className="flex-1 border-2 border-gray-100 rounded-xl p-3 text-xs focus:border-black outline-none transition-colors bg-gray-50" placeholder="Add new (e.g. Gold Chains)" />
                    <button onClick={handleAddSub} className="bg-[#2d2926] text-white px-4 rounded-xl text-xs font-bold hover:bg-black transition-colors"><Plus size={16} /></button>
                  </div>

                  <div className="max-h-40 overflow-y-auto pr-2 flex flex-col gap-2">
                    {subcategories.length === 0 && <p className="text-[10px] text-gray-400 italic">No subcategories yet.</p>}
                    {subcategories.map(sub => (
                      <div key={sub} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <span className="text-xs font-medium text-gray-700">{sub}</span>
                        <button onClick={() => handleDeleteSub(sub)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-md transition-colors"><Trash2 size={12} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 cursor-pointer shrink-0 pt-4">
              <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-3 text-[10px] md:text-xs uppercase tracking-widest font-bold hover:bg-gray-50 text-gray-600 transition-colors">Close</button>
              <button onClick={handleSave} className="flex-1 bg-black text-white rounded-xl py-3 text-[10px] md:text-xs uppercase tracking-widest font-bold hover:bg-gray-800 shadow-xl shadow-black/20 transition-all flex justify-center items-center gap-2"><Save size={16} /> {isEditing ? 'Save Changes' : 'Create Category'}</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

const AdminDashboard = ({ products, setProducts, categories, setCategories, logOut }) => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState({});
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [adminCategory, setAdminCategory] = useState('All');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const showError = (msg) => { setErrorMsg(msg); setTimeout(() => setErrorMsg(''), 4000); };
  const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 4000); };

  // Helper for parsing FAQs from string JSON
  const getFaqs = () => {
    try {
      if (!settings.faqs) return [];
      const parsed = JSON.parse(settings.faqs);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("FAQ Parse Error:", e);
      return [];
    }
  };

  const updateFaqSection = (index, value) => {
    const FAQs = getFaqs();
    FAQs[index].section = value;
    setSettings({ ...settings, faqs: JSON.stringify(FAQs) });
  };

  // Fetch orders and settings
  useEffect(() => {
    fetch('/api/orders').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setOrders(data);
    }).catch(e => console.error("Failed to load orders", e));

    fetch('/api/settings').then(r => r.json()).then(data => {
      if (data) setSettings(data);
    }).catch(e => console.error("Failed to load settings", e));
  }, []);

  // Custom Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => { } });

  // Update Order Status
  const handleOrderStatusChange = async (id, status) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      showSuccess('Order status updated!');
    } catch (err) {
      showError(err.message);
    }
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('Failed to save settings');
      showSuccess('Store settings successfully updated!');
    } catch (err) {
      showError(err.message);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Helper functions for dynamic FAQ management
  const addFaqSection = () => {
    const FAQs = getFaqs();
    FAQs.push({ section: 'New Section', items: [] });
    setSettings({ ...settings, faqs: JSON.stringify(FAQs) });
  };
  const removeFaqSection = (idx) => {
    const FAQs = getFaqs();
    FAQs.splice(idx, 1);
    setSettings({ ...settings, faqs: JSON.stringify(FAQs) });
  };
  const addFaqItem = (secIdx) => {
    const FAQs = getFaqs();
    FAQs[secIdx].items.push({ q: 'New Question?', a: 'Answer here.' });
    setSettings({ ...settings, faqs: JSON.stringify(FAQs) });
  };
  const removeFaqItem = (secIdx, itemIdx) => {
    const FAQs = getFaqs();
    FAQs[secIdx].items.splice(itemIdx, 1);
    setSettings({ ...settings, faqs: JSON.stringify(FAQs) });
  };
  const updateFaqItem = (secIdx, itemIdx, field, val) => {
    const FAQs = getFaqs();
    FAQs[secIdx].items[itemIdx][field] = val;
    setSettings({ ...settings, faqs: JSON.stringify(FAQs) });
  };

  // Backup: download all DB data as JSON file
  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      const res = await fetch('/api/backup');
      if (!res.ok) throw new Error('Backup failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const disposition = res.headers.get('content-disposition');
      const filename = disposition?.match(/filename="(.+)"/)?.[1] || 'luxe-gems-backup.json';
      const a = document.createElement('a');
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
      showSuccess('✅ Backup downloaded successfully!');
    } catch (err) {
      showError('Backup failed: ' + err.message);
    } finally {
      setIsBackingUp(false);
    }
  };

  // Restore: read JSON file and send to backend
  const handleRestore = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        setIsRestoring(true);
        const data = JSON.parse(ev.target.result);
        const res = await fetch('/api/restore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Restore failed');
        showSuccess('✅ Database restored! Reloading...');
        setTimeout(() => window.location.reload(), 1800);
      } catch (err) {
        showError('Restore error: ' + err.message);
      } finally {
        setIsRestoring(false);
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  // WhatsApp Notification Logic
  const notifyCustomerViaWhatsApp = (order, type) => {
    // Basic phone number formatting for Pakistan (03... -> 923...)
    let phone = order.customerPhone.replace(/[^0-9]/g, '');
    if (phone.startsWith('03')) {
      phone = '92' + phone.substring(1);
    } else if (phone.startsWith('3')) {
      phone = '92' + phone;
    }

    let message = '';
    const itemsList = order.items.map(i => `• ${i.qty}x ${i.name}`).join('%0A');

    if (type === 'Confirmed') {
      message = `*LUXE GEMS - Order Confirmed!* 💎%0A%0AHello ${order.customerName},%0AGreat news! We have successfully confirmed your order (${order.id}).%0A%0A*Order Summary:*%0A${itemsList}%0A%0A*Total:* Rs. ${order.total.toLocaleString()}%0A*Delivery Address:* ${order.customerCity}%0A%0AThank you for shopping with us. We will notify you once it's shipped!`;
    } else if (type === 'Shipped') {
      message = `*LUXE GEMS - Order Shipped!* 🚚%0A%0AHello ${order.customerName},%0AYour order (${order.id}) is on its way to you!%0A%0AIt has been dispatched to:%0A${order.customerCity}%0A%0APlease arrange Rs. ${order.total.toLocaleString()} for payment upon delivery (if COD).%0A%0AWe hope you love your jewelry! Let us know if you have any questions.`;
    }

    if (message) {
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }
  };

  // Inventory logic
  const categoryFiltered = adminCategory === 'All' ? products : products.filter(p => p.category === adminCategory);
  const filtered = categoryFiltered.filter(p => (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (p.category || '').toLowerCase().includes(searchTerm.toLowerCase()));

  const handleProductSave = async (prod) => {
    try {
      const url = editingProduct ? `/api/products/${prod.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const fixedProd = { ...prod };
      if (fixedProd.size && !fixedProd.sizes) {
        fixedProd.sizes = fixedProd.size;
        delete fixedProd.size;
      }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fixedProd)
      });

      if (!res.ok) {
        let errorMsg = 'Failed to save product';
        try {
          const data = await res.json();
          errorMsg = data.error || errorMsg;
        } catch (e) {
          // ignore
        }
        throw new Error(errorMsg);
      }

      if (editingProduct) {
        setProducts(products.map(p => p.id === prod.id ? prod : p));
      } else {
        setProducts([...products, prod]);
      }
      setIsModalOpen(false);
    } catch (err) {
      showError(err.message);
    }
  }

  const handleProductDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Product",
      message: "Are you sure you want to delete this product? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Failed to delete product');
          setProducts(products.filter(p => p.id !== id));
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (err) {
          showError(err.message);
        }
      }
    });
  }

  // Category Logic
  const handleCategorySave = async ({ oldName, newName, image, subcategories: newSubs = [] }) => {
    try {
      if (oldName) {
        if (oldName === newName && (!image || image === (categories.find(c => getCatName(c) === oldName)?.image))) {
          // We ONLY return if EVERYTHING is exactly the same.
          // BUT in edit mode the name can't change, so we usually just update the image or subcategories.
          // However, subcategories update individually, so let's just proceed to update the image.
        }

        const res = await fetch(`/api/categories/${encodeURIComponent(oldName)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newName, image })
        });
        if (!res.ok) throw new Error('Failed to edit category');

        setCategories(categories.map(c => getCatName(c) === oldName ? { category: newName, image, subcategories: (c && c.subcategories) || [] } : c));
        setProducts(products.map(p => p.category === oldName ? { ...p, category: newName } : p));
        setIsCategoryModalOpen(false);
      } else {
        if (categories.some(c => getCatName(c) === newName)) { showError("Category already exists."); return; }

        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName, image })
        });
        if (!res.ok) throw new Error('Failed to add category');

        // Add subcategories to the API one by one
        for (const sub of newSubs) {
          try {
            await fetch('/api/subcategories', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: sub, category: newName })
            });
          } catch (e) { /* skip failed subcategory adds */ }
        }

        setCategories([...categories, { category: newName, image, subcategories: newSubs }]);
        setIsCategoryModalOpen(false);
      }
    } catch (err) {
      showError(err.message);
    }
  }

  const handleCategoryDelete = (catName) => {
    const inUse = products.some(p => p.category === catName);
    if (inUse) {
      showError(`Cannot delete '${catName}'. Please reassign or delete all products in this category first.`);
      return;
    }
    setConfirmModal({
      isOpen: true,
      title: "Delete Category",
      message: `Are you sure you want to delete '${catName}'? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/categories/${encodeURIComponent(catName)}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Failed to delete category');
          setCategories(categories.filter(c => getCatName(c) !== catName));
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (err) {
          showError(err.message);
        }
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-[#2d2926]">
      <div className="fixed top-4 right-4 md:top-8 md:right-8 z-[500] w-full max-w-sm pointer-events-none">
        <div className="pointer-events-auto">
          {successMsg && <div className="bg-green-600 text-white p-4 rounded-xl shadow-2xl mb-4 font-bold tracking-widest uppercase text-xs flex justify-between">{successMsg}</div>}
          <AdminNotification message={errorMsg} onClose={() => setErrorMsg('')} />
        </div>
      </div>
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-b md:border-r md:border-b-0 border-gray-200 flex flex-col h-auto md:h-screen sticky top-0">
        <div className="p-6 md:p-8 border-b border-gray-200 flex justify-between md:block items-center">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="bg-[#2d2926] text-white p-2 rounded-xl shadow-md"><SlidersHorizontal size={20} /></span>
              <h2 className="text-xl md:text-2xl font-serif font-bold tracking-wide">Admin</h2>
            </div>
            <p className="text-[9px] md:text-[10px] text-gray-500 tracking-[0.2em] uppercase ml-12">Store Management</p>
          </div>
          <button onClick={logOut} className="md:hidden flex items-center gap-2 text-[10px] text-white bg-red-600 hover:bg-red-700 uppercase tracking-widest font-bold p-3 rounded-lg shadow-md transition-colors"><LogOut size={14} /> Exit</button>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-row md:flex-col border-b border-gray-200 overflow-x-auto no-scrollbar whitespace-nowrap">
          <button onClick={() => setActiveTab('inventory')} className={`flex-1 md:w-full p-4 px-6 text-[10px] md:text-xs tracking-widest uppercase font-bold text-center md:text-left transition-colors shrink-0 ${activeTab === 'inventory' ? 'bg-gray-100 border-b-2 md:border-b-0 md:border-l-4 border-black text-black' : 'text-gray-500 hover:bg-gray-50'} `}>Inventory</button>
          <button onClick={() => setActiveTab('categories')} className={`flex-1 md:w-full p-4 px-6 text-[10px] md:text-xs tracking-widest uppercase font-bold text-center md:text-left transition-colors shrink-0 ${activeTab === 'categories' ? 'bg-gray-100 border-b-2 md:border-b-0 md:border-l-4 border-black text-black' : 'text-gray-500 hover:bg-gray-50'} `}>Categories</button>
          <button onClick={() => setActiveTab('orders')} className={`flex-1 md:w-full p-4 px-6 text-[10px] md:text-xs tracking-widest uppercase font-bold text-center md:text-left transition-colors shrink-0 ${activeTab === 'orders' ? 'bg-gray-100 border-b-2 md:border-b-0 md:border-l-4 border-black text-black' : 'text-gray-500 hover:bg-gray-50'} `}>Orders</button>
          <button onClick={() => setActiveTab('settings')} className={`flex-1 md:w-full p-4 px-6 text-[10px] md:text-xs tracking-widest uppercase font-bold text-center md:text-left transition-colors shrink-0 ${activeTab === 'settings' ? 'bg-gray-100 border-b-2 md:border-b-0 md:border-l-4 border-black text-black' : 'text-gray-500 hover:bg-gray-50'} `}>Settings</button>
        </div>

        {/* Inventory View Sidebar Only */}
        {activeTab === 'inventory' && (
          <>
            <div className="flex-1 overflow-y-auto w-full no-scrollbar hidden md:block">
              <div className="p-4 flex flex-col gap-1">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-3">Filter by Category</h3>
                <div onClick={() => setAdminCategory('All')} className={`px-4 py-3 rounded-xl text-xs cursor-pointer transition-all duration-300 font-bold tracking-widest uppercase mb-1 ${adminCategory === 'All' ? 'bg-[#2d2926] text-white shadow-lg shadow-black/10' : 'text-gray-500 hover:bg-gray-100'}`}>All Collections</div>
                {categories.map((cat, idx) => {
                  const catName = getCatName(cat);
                  return (
                    <div key={catName || idx} onClick={() => setAdminCategory(catName)} className={`px-4 py-3 rounded-xl text-xs cursor-pointer transition-all duration-300 flex justify-between items-center font-bold tracking-widest uppercase mb-1 ${adminCategory === catName ? 'bg-[#2d2926] text-white shadow-lg shadow-black/10' : 'text-gray-500 hover:bg-gray-100'}`}>
                      {catName}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${adminCategory === catName ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>{products.filter(p => p.category === catName).length}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Horizontal Category Scroll */}
            <div className="flex md:hidden overflow-x-auto no-scrollbar border-b border-gray-100 p-2 gap-2 snap-x bg-gray-50">
              <div onClick={() => setAdminCategory('All')} className={`shrink-0 snap-start px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold cursor-pointer transition-colors border ${adminCategory === 'All' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200'}`}>All</div>
              {categories.map((cat, idx) => {
                const catName = getCatName(cat);
                return (
                  <div key={catName || idx} onClick={() => setAdminCategory(catName)} className={`shrink-0 snap-start px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold cursor-pointer transition-colors border ${adminCategory === catName ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200'}`}>{catName}</div>
                );
              })}
            </div>
          </>
        )}

        <div className="p-4 border-t border-gray-200 hidden md:block mt-auto">
          <button onClick={logOut} className="flex items-center justify-center gap-2 text-sm text-red-600 font-bold hover:opacity-70 w-full"><LogOut size={16} /> Exit </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-10 h-screen overflow-y-auto w-full">
        {activeTab === 'inventory' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
              <h1 className="text-2xl md:text-3xl font-serif">Product Inventory <span className="text-lg text-gray-400">({products.length})</span></h1>
              <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="w-full md:w-auto bg-[#2d2926] text-white px-6 py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm shadow-lg hover:bg-black"><Plus size={16} /> Add New Product</button>
            </div>

            <input type="text" placeholder="Search by name or category..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-3 md:p-4 border border-gray-200 rounded-sm mb-6 outline-none focus:border-black text-xs md:text-sm shadow-sm" />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
              <table className="w-full text-left text-xs md:text-sm whitespace-nowrap">
                <thead><tr className="border-b border-gray-100 text-[9px] md:text-[10px] text-gray-400 uppercase tracking-[0.2em] bg-gray-50/50"><th className="p-4 md:p-5 font-bold">Image</th><th className="p-4 md:p-5 w-1/3 font-bold">Name</th><th className="p-4 md:p-5 font-bold">Category</th><th className="p-4 md:p-5 font-bold">Price</th><th className="p-4 md:p-5 text-right font-bold">Actions</th></tr></thead>
                <tbody>
                  {filtered.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-400 font-sans tracking-widest uppercase">No products found.</td></tr>}
                  {filtered.map(p => (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 md:p-5">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                          <img src={p.img} alt="prod" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                        </div>
                      </td>
                      <td className="p-4 md:p-5 font-bold text-gray-800"><div className="truncate max-w-[150px] md:max-w-xs">{p.name}</div></td>
                      <td className="p-4 md:p-5"><span className="bg-gray-50 text-gray-600 px-3 py-1.5 text-[9px] md:text-[10px] rounded-lg tracking-widest uppercase border border-gray-200 whitespace-nowrap font-bold shadow-sm">{p.category}</span></td>
                      <td className="p-4 md:p-5 font-serif text-[#2d2926] font-bold">Rs. {p.price.toLocaleString()}</td>
                      <td className="p-4 md:p-5 text-right">
                        <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="p-2.5 bg-gray-50 text-gray-600 hover:bg-[#2d2926] hover:text-white rounded-lg mr-2 transition-all shadow-sm"><Edit size={16} /></button>
                        <button onClick={() => handleProductDelete(p.id)} className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all shadow-sm"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : activeTab === 'categories' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-serif">Category Management <span className="text-lg text-gray-400">({categories.length})</span></h1>
              <button onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }} className="bg-[#2d2926] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm shadow-lg hover:bg-black"><Plus size={16} /> Add Category</button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-[0.2em] bg-gray-50/50">
                    <th className="p-5 font-bold w-16 text-center">Icon</th>
                    <th className="p-5 font-bold w-1/3">Category Name</th>
                    <th className="p-5 font-bold w-16 text-center">Sub</th>
                    <th className="p-5 font-bold text-center">Products</th>
                    <th className="p-5 text-right font-bold w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, idx) => {
                    const catName = getCatName(cat);
                    const subCats = []; // Placeholder for subcategory logic if added later
                    return (
                      <tr key={catName || idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="p-5 text-center"><div className="w-10 h-10 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold uppercase">{catName?.substring(0, 1)}</div></td>
                        <td className="p-5 font-bold text-gray-800">{catName}</td>
                        <td className="p-5 text-center"><span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-[10px] font-bold">{subCats.length}</span></td>
                        <td className="p-5 text-center"><span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{products.filter(p => p.category === catName).length}</span></td>
                        <td className="p-5 text-right">
                          <button onClick={() => { setEditingCategory({ oldName: catName }); setIsCategoryModalOpen(true); }} className="p-2 text-gray-400 hover:text-[#2d2926] transition-colors"><Edit size={16} /></button>
                          <button onClick={() => handleCategoryDelete(catName)} className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-2"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    );
                  })}
                  {categories.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-400 font-sans tracking-widest uppercase text-xs">No categories found.</td></tr>}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : activeTab === 'orders' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
              <h1 className="text-2xl md:text-3xl font-serif">Store Orders <span className="text-lg text-gray-400">({orders.length})</span></h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
              <table className="w-full text-left text-xs md:text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-gray-100 text-[9px] md:text-[10px] text-gray-400 uppercase tracking-[0.2em] bg-gray-50/50">
                    <th className="p-4 md:p-5 font-bold">Order ID</th>
                    <th className="p-4 md:p-5 font-bold">Customer Details</th>
                    <th className="p-4 md:p-5 font-bold">Items</th>
                    <th className="p-4 md:p-5 font-bold text-right">Total (PKR)</th>
                    <th className="p-4 md:p-5 font-bold text-right">Status</th>
                    <th className="p-4 md:p-5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-gray-400 font-sans tracking-widest uppercase">No orders found.</td></tr>}
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 md:p-5">
                        <div className="font-bold text-[#2d2926]">{order.id}</div>
                        <div className="text-[10px] text-gray-400 mt-1">{new Date(order.date).toLocaleDateString()}</div>
                      </td>
                      <td className="p-4 md:p-5">
                        <div className="font-bold text-[#2d2926]">{order.customerName}</div>
                        <div className="text-[10px] text-gray-500 mt-1">{order.customerPhone} &bull; {order.customerCity}</div>
                      </td>
                      <td className="p-4 md:p-5">
                        <div className="flex flex-col gap-1">
                          {order.items.map((item, i) => (
                            <div key={i} className="text-[10px] md:text-xs">
                              <span className="font-bold">{item.qty}x</span> {item.name} <span className="text-gray-400">({item.size})</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 md:p-5 font-bold text-right">Rs. {order.total.toLocaleString()}</td>
                      <td className="p-4 md:p-5 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest outline-none border cursor-pointer
                            ${order.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                              order.status === 'Confirmed' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                'bg-purple-50 text-purple-600 border-purple-200'
                            }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                        </select>
                      </td>
                      <td className="p-4 md:p-5 text-right w-32">
                        {order.status === 'Confirmed' && (
                          <button onClick={() => notifyCustomerViaWhatsApp(order, 'Confirmed')} className="flex items-center justify-center gap-1.5 bg-[#25D366] text-white px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-green-600 transition-colors shadow-sm ml-auto w-full">
                            <span className="shrink-0"><Phone size={10} /></span> Notify Confirmed
                          </button>
                        )}
                        {order.status === 'Shipped' && (
                          <button onClick={() => notifyCustomerViaWhatsApp(order, 'Shipped')} className="flex items-center justify-center gap-1.5 bg-purple-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-purple-700 transition-colors shadow-sm ml-auto w-full">
                            <span className="shrink-0"><Truck size={10} /></span> Notify Shipped
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : activeTab === 'settings' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl w-full">
            <h1 className="text-2xl md:text-3xl font-serif mb-6 md:mb-8">Store Settings</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#2d2926] mb-6 border-b border-gray-100 pb-4">General Configuration</h3>

              <div className="mb-6">
                <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Owner WhatsApp Number (Format: 923XXXXXXXXX)</label>
                <input type="text" value={settings.whatsapp_number || ''} onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-black outline-none transition-all" />
              </div>

              <div className="mb-6 mt-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#2d2926] mb-6 border-b border-gray-100 pb-4">Security</h3>
                <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Admin Panel Master Password</label>
                <p className="text-[10px] text-gray-400 mb-4">Leave this blank if you do not wish to change the current password.</p>
                <div className="flex gap-4">
                  <input type="text" placeholder="Enter new password..." value={settings.new_admin_password || ''} onChange={(e) => setSettings({ ...settings, new_admin_password: e.target.value })} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-black outline-none transition-all" />
                  <button type="button" onClick={async () => {
                    if (!settings.new_admin_password) return showError("Please enter a new password first.");
                    try {
                      setIsSavingSettings(true);
                      const res = await fetch('/api/settings/password', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ newPassword: settings.new_admin_password })
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error || 'Failed to update password');
                      showSuccess("Password changed successfully!");
                      setSettings({ ...settings, new_admin_password: '' });
                    } catch (err) {
                      showError(err.message);
                    } finally {
                      setIsSavingSettings(false);
                    }
                  }} className="shrink-0 bg-black text-white px-6 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="mb-6 mt-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#2d2926] mb-6 border-b border-gray-100 pb-4">Announcement Bar</h3>
                <div className="flex gap-4 items-center mb-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings.announcement_active === 'true'} onChange={e => setSettings({ ...settings, announcement_active: e.target.checked ? 'true' : 'false' })} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Enable Top Announcement Bar</span>
                </div>
                {settings.announcement_active === 'true' && (
                  <div>
                    <input type="text" value={settings.announcement_text || ''} onChange={(e) => setSettings({ ...settings, announcement_text: e.target.value })} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-black outline-none transition-all" placeholder="Free nationwide shipping on orders over 10,000 PKR!" />
                  </div>
                )}
              </div>

              <div className="mb-6 mt-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#2d2926] mb-6 border-b border-gray-100 pb-4">Store Policies & Pages</h3>
                <p className="text-[10px] md:text-xs text-gray-500 mb-6">Use the rich text editor to format your pages exactly how you want them to appear on the frontend store (Bolds, bullet points, headers).</p>

                <div className="space-y-6 overflow-visible">
                  <div className="overflow-visible">
                    <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Shipping Policy</label>
                    <textarea rows={6} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-black outline-none transition-all resize-y" value={settings.shipping_policy || ''} onChange={(e) => setSettings({ ...settings, shipping_policy: e.target.value })} />
                  </div>
                  <div className="overflow-visible">
                    <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Returns & Exchange Policy</label>
                    <textarea rows={6} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-black outline-none transition-all resize-y" value={settings.refund_policy || ''} onChange={(e) => setSettings({ ...settings, refund_policy: e.target.value })} />
                  </div>
                  <div className="overflow-visible">
                    <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Privacy Policy</label>
                    <textarea rows={6} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-black outline-none transition-all resize-y" value={settings.privacy_policy || ''} onChange={(e) => setSettings({ ...settings, privacy_policy: e.target.value })} />
                  </div>
                  <div className="overflow-visible">
                    <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Terms of Service</label>
                    <textarea rows={6} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-black outline-none transition-all resize-y" value={settings.terms_service || ''} onChange={(e) => setSettings({ ...settings, terms_service: e.target.value })} />
                  </div>
                  <div className="overflow-visible">
                    <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">About Us</label>
                    <textarea rows={6} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-black outline-none transition-all resize-y" value={settings.about_us || ''} onChange={(e) => setSettings({ ...settings, about_us: e.target.value })} />
                  </div>
                  <div className="overflow-visible">
                    <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Size Chart</label>
                    <textarea rows={6} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-black outline-none transition-all resize-y" value={settings.size_chart || ''} onChange={(e) => setSettings({ ...settings, size_chart: e.target.value })} />
                  </div>
                  <div className="overflow-visible">
                    <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Box Care</label>
                    <textarea rows={6} className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-black outline-none transition-all resize-y" value={settings.box_care || ''} onChange={(e) => setSettings({ ...settings, box_care: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="mb-6 mt-8">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#2d2926]">Frequently Asked Questions</h3>
                  <button onClick={addFaqSection} className="text-[10px] font-bold text-white uppercase tracking-widest bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg flex items-center gap-1"><Plus size={14} /> Add Section</button>
                </div>

                <div className="space-y-6 overflow-visible">
                  {getFaqs().map((section, secIdx) => (
                    <div key={secIdx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 relative">
                      <button onClick={() => removeFaqSection(secIdx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><X size={16} /></button>

                      <input type="text" value={section.section} onChange={(e) => updateFaqSection(secIdx, e.target.value)} className="w-full border border-gray-200 bg-white rounded-lg p-3 mb-4 text-sm font-bold focus:border-black outline-none" placeholder="Section Title (e.g., 'Shipping & Delivery')" />

                      <div className="space-y-3 mb-4">
                        {section.items?.map((item, itemIdx) => (
                          <div key={itemIdx} className="bg-white border border-gray-200 rounded-lg p-4 relative">
                            <input type="text" value={item.q} onChange={(e) => updateFaqItem(secIdx, itemIdx, { q: e.target.value, a: item.a })} className="w-full border border-gray-100 bg-gray-50 rounded-lg p-2 mb-2 text-sm font-bold focus:border-black outline-none" placeholder="Question" />
                            <textarea value={item.a} onChange={(e) => updateFaqItem(secIdx, itemIdx, { q: item.q, a: e.target.value })} className="w-full border border-gray-100 bg-gray-50 rounded-lg p-2 text-sm resize-none focus:border-black outline-none" rows="3" placeholder="Answer" />
                            <button onClick={() => removeFaqItem(secIdx, itemIdx)} className="text-gray-400 hover:text-red-500 absolute top-2 right-2 shrink-0"><X size={14} /></button>
                          </div>
                        ))}
                        <button onClick={() => addFaqItem(secIdx)} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-black flex items-center gap-1 pt-2"><Plus size={12} /> Add Question</button>
                      </div>
                    </div>
                  ))}
                  {getFaqs().length === 0 && <p className="text-xs text-center text-gray-400 font-medium py-4">No FAQ sections yet. Click 'Add Section' to start.</p>}
                </div>
              </div>

              <div className="mb-6 mt-12 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#2d2926]">Frequently Asked Questions (FAQs)</h3>
                    <p className="text-[10px] text-gray-500 mt-1">Manage standard questions categorized by section.</p>
                  </div>
                  <button onClick={addFaqSection} className="bg-[#2d2926] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1.5 hover:bg-black"><Plus size={14} /> Section</button>
                </div>

                <div className="space-y-6">
                  {getFaqs().map((sec, secIdx) => (
                    <div key={secIdx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex gap-4 items-center mb-4">
                        <input type="text" value={sec.section} onChange={(e) => updateFaqSection(secIdx, e.target.value)} className="w-full text-sm font-bold border-b-2 border-transparent focus:border-black outline-none bg-gray-50 focus:bg-white px-3 py-2 rounded-t-lg transition-colors" placeholder="Section Name (e.g., Shipping Info)" />
                        <button onClick={() => removeFaqSection(secIdx)} className="text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-colors shrink-0"><Trash2 size={16} /></button>
                      </div>

                      <div className="space-y-3 pl-4 border-l-2 border-gray-100 ml-2">
                        {(sec.items || []).map((item, itemIdx) => (
                          <div key={itemIdx} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex gap-3 relative group">
                            <div className="flex-1 space-y-2">
                              <input type="text" value={item.q} onChange={(e) => updateFaqItem(secIdx, itemIdx, 'q', e.target.value)} className="w-full text-xs font-bold border-b border-gray-200 focus:border-black outline-none bg-transparent py-1" placeholder="Question?" />
                              <textarea value={item.a} onChange={(e) => updateFaqItem(secIdx, itemIdx, 'a', e.target.value)} rows={2} className="w-full text-[10px] md:text-xs border border-transparent focus:border-gray-200 outline-none bg-transparent hover:bg-white focus:bg-white rounded p-1 resize-none" placeholder="Detailed answer..."></textarea>
                            </div>
                            <button onClick={() => removeFaqItem(secIdx, itemIdx)} className="text-gray-400 hover:text-red-500 absolute top-2 right-2 shrink-0"><X size={14} /></button>
                          </div>
                        ))}
                        <button onClick={() => addFaqItem(secIdx)} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-black flex items-center gap-1 pt-2"><Plus size={12} /> Add Question</button>
                      </div>
                    </div>
                  ))}
                  {getFaqs().length === 0 && <p className="text-xs text-center text-gray-400 font-medium py-4">No FAQ sections yet. Click 'Add Section' to start.</p>}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button onClick={handleSaveSettings} disabled={isSavingSettings} className="bg-[#2d2926] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 rounded-xl shadow-lg hover:bg-black disabled:opacity-50 transition-all">
                  {isSavingSettings ? 'Saving...' : <><Save size={16} /> Save Settings</>}
                </button>
              </div>
            </div>

            {/* Backup & Restore */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#2d2926] mb-2 border-b border-gray-100 pb-4">Data Backup & Restore</h3>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">Keep a backup of all your products, categories, orders, and settings. You can restore from the backup file in case of accidental data loss.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Backup */}
                <div className="bg-green-50 border border-green-100 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center"><CheckCircle size={18} className="text-green-600" /></div>
                    <div>
                      <p className="text-xs font-bold text-green-800 uppercase tracking-widest">Download Backup</p>
                      <p className="text-[10px] text-green-600 mt-0.5">All data in one JSON file</p>
                    </div>
                  </div>
                  <button onClick={handleBackup} disabled={isBackingUp} className="w-full bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    {isBackingUp ? 'Preparing...' : <><Save size={12} /> Download Backup</>}
                  </button>
                </div>

                {/* Restore */}
                <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center"><Trash2 size={18} className="text-red-600" /></div>
                    <div>
                      <p className="text-xs font-bold text-red-800 uppercase tracking-widest">Restore Backup</p>
                      <p className="text-[10px] text-red-500 mt-0.5">⚠ This will overwrite all current data</p>
                    </div>
                  </div>
                  <label className={`w-full bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${isRestoring ? 'opacity-50 pointer-events-none' : ''}`}>
                    {isRestoring ? 'Restoring...' : <><Plus size={12} /> Choose Backup File</>}
                    <input type="file" accept=".json" className="hidden" onChange={handleRestore} disabled={isRestoring} />
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>

      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={editingProduct} onSave={handleProductSave} categories={categories} />
      <CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} category={editingCategory} onSave={handleCategorySave} categories={categories} setCategories={setCategories} showError={showError} />
      <ConfirmModal isOpen={confirmModal.isOpen} title={confirmModal.title} message={confirmModal.message} onConfirm={confirmModal.onConfirm} onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} />
    </div>
  );
}

// ==========================================

export default function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [productDatabase, setProductDatabase] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProductDatabase(data))
      .catch(err => console.error("Error fetching products:", err));

    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  if (!isAdminAuthenticated) return <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} cancel={() => window.location.href = '/'} />

  return <AdminDashboard products={productDatabase} setProducts={setProductDatabase} categories={categories} setCategories={setCategories} logOut={() => { setIsAdminAuthenticated(false); window.location.href = '/'; }} />
}
