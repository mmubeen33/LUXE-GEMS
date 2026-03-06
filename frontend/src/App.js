import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Menu, ArrowRight, X, Plus, Minus, MessageCircle, Phone, Mail, Info, MapPin, Search, Heart, SlidersHorizontal, Grid, List, ChevronDown, CheckCircle, Edit, Trash2, Save, LogOut, Star, Maximize, Eye, ShoppingCart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import TermsService from './pages/TermsService';
import Faqs from './pages/Faqs';
import AboutUs from './pages/AboutUs';
import SizeChart from './pages/SizeChart';
import BoxCare from './pages/BoxCare';

// --- ANIMATION VARIANTS (90Hz Smoothness) ---
const luxuryEase = [0.6, 0.01, 0.05, 0.95];

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: luxuryEase } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
};

// --- UTILITY: Category Name Helper ---
const getCatName = (cat) => typeof cat === 'string' ? cat : (cat && cat.category ? cat.category : '');

// --- CUSTOM STYLES ---
const globalStyles = `
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;700&display=swap');
  html { scroll-behavior: smooth; font-family: 'Inter', sans-serif; }
  body { margin: 0; padding: 0; }
  h1, h2, h3, .font-serif { font-family: 'Playfair Display', serif; }
`;

// --- UTILITY: Image Compression ---
const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

// --- UTILITY: Dynamic Item Generator (UPDATED TO MAX COUNT) ---
const generateInitialItems = (categoryName, count = 6) => {
  const luxuryImages = [
    "/placeholder.png",
    "/placeholder.png",
    "/placeholder.png",
    "/placeholder.png",
    "/placeholder.png",
    "/placeholder.png",
    "/placeholder.png",
    "/placeholder.png"
  ];

  return Array.from({ length: count }, (_, i) => {
    const isDiscounted = i % 3 === 0;
    const isSoldOut = i % 5 === 0; // Adjusted for 6 items logic
    const price = 2500 + (i * 250) + (categoryName.length * 15);

    const galleryImages = [
      luxuryImages[(i + categoryName.length) % luxuryImages.length],
      luxuryImages[(i + categoryName.length + 1) % luxuryImages.length],
      luxuryImages[(i + categoryName.length + 2) % luxuryImages.length],
    ];

    return {
      id: `${categoryName.replace(/\s+/g, '-').toLowerCase()}-${i}-${Date.now()}`,
      category: categoryName,
      name: `Premium ${categoryName} - Edition ${i + 1}`,
      brand: 'LUXE GEMS',
      price: price,
      oldPrice: isDiscounted ? price + 1500 : null,
      discount: isDiscounted ? `-${Math.floor(Math.random() * 20 + 10)}%` : null,
      soldOut: isSoldOut,
      img: galleryImages[0],
      images: galleryImages,
      colors: i % 2 === 0 ? ['#e0e0e0', '#ffd54f'] : null,
      sizes: ["3mm", "5mm", "7mm", "Adjustable"],
      metals: "Titanium Stainless Steel, 925 Silver",
      description: `Elevate your style with this meticulously crafted ${categoryName} piece from LUXE GEMS. Made with premium materials and designed to shine, this item is perfect for any special occasion or daily luxury wear.`,
      reviews: [
        { name: "Ayesha K.", rating: 5, date: "October 12, 2025", text: "Absolutely stunning piece! The craftsmanship is top-notch." },
        { name: "Fatima R.", rating: 4, date: "November 05, 2025", text: "Very elegant design. Packaging was beautiful too." }
      ]
    };
  });
};

const OWNER_WHATSAPP = "923251221401";

// ==========================================
// --- COMPONENTS ---

const ContactInfoBar = () => (
  <header className="bg-[#fcfbf9] text-gray-500 text-[10px] tracking-wider py-2 px-4 md:px-12 flex justify-between items-center border-b border-gray-200 z-[100] relative hidden lg:flex">
    <div className="flex gap-6 flex-1">
      <a href="tel:+923465003258" aria-label="Call Luxe Gems Help Center" className="flex items-center gap-2 hover:text-[#2d2926] transition-colors"><Phone size={12} aria-hidden="true" /> +92 346 5003258</a>
      <a href="mailto:info@luxegems.com" aria-label="Email Luxe Gems Customer Support" className="flex items-center gap-2 hover:text-[#2d2926] transition-colors"><Mail size={12} aria-hidden="true" /> info@luxegems.com</a>
    </div>
    <div className="tracking-[0.2em] uppercase text-[#2d2926] font-medium flex-1 text-center">Handcrafted Luxury Jewellery</div>
    <div className="flex-1 flex justify-end">
      <a href="#location" aria-label="Find Luxe Gems Store Location" className="flex items-center gap-2 hover:text-[#2d2926] transition-colors"><MapPin size={12} aria-hidden="true" /> Location</a>
    </div>
  </header>
);

// --- NAVBAR ---
const MegaNavbar = ({ categories, cartCount, wishlistCount, setIsCartOpen, setIsWishlistOpen, navigateTo, searchQuery, setSearchQuery }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef(null);

  const menuItems = [
    { name: "Home", dropdownType: null, subcategories: [] },
    ...categories.map(cat => ({
      name: typeof cat === 'string' ? cat : cat.category,
      subcategories: typeof cat === 'string' ? [] : (cat.subcategories || []),
      dropdownType: "list"
    }))
  ];

  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) searchInputRef.current.focus();
  }, [isSearchVisible]);

  return (
    <>
      <nav className="bg-white w-full border-b border-gray-100 z-50 sticky top-0 shadow-sm relative pt-4 md:pt-6 pb-4">
        <div className="px-4 md:px-12 flex flex-col items-center relative w-full">

          {/* TOP TIER: Hamburger, Logo, Icons */}
          <div className="w-full flex justify-between items-center mb-4 md:mb-6">

            {/* LEFT: MENU & TEXT LOGO */}
            <div className="flex items-center flex-1 justify-start">
              <Menu size={24} onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden cursor-pointer text-[#2d2926]" />
              <div onClick={() => window.location.href = '/'} className="hidden lg:flex items-center cursor-pointer hover:opacity-80 transition-opacity">
                <h1 className="text-xl xl:text-3xl font-serif font-bold tracking-[0.2em] uppercase w-max">
                  <span className="text-[#111111]">LUXE</span> <span className="text-[#d4af37]">GEMS</span>
                </h1>
              </div>
            </div>

            {/* CENTER: LARGE LOGO */}
            <div onClick={() => window.location.href = '/'} className="flex items-center justify-center flex-1 shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
              <img src="/images/Logo.png" alt="LUXE GEMS Logo" className="h-20 md:h-28 lg:h-32 object-contain" />
            </div>

            {/* RIGHT: ICONS */}
            <div className="flex gap-4 md:gap-6 items-center text-[#2d2926] justify-end flex-1">
              <div className="hidden md:flex relative items-center">
                <AnimatePresence>
                  {isSearchVisible && (
                    <motion.input ref={searchInputRef} type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." initial={{ width: 0, opacity: 0 }} animate={{ width: '180px', opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="font-sans text-xs px-4 py-2 border border-gray-200 rounded-full outline-none focus:border-[#2d2926] placeholder:tracking-widest absolute right-8" aria-label="Search Luxe Gems" />
                  )}
                </AnimatePresence>
                <button aria-label="Search" onClick={() => setIsSearchVisible(!isSearchVisible)} className="flex items-center justify-center p-1"><Search size={22} className="cursor-pointer hover:text-gray-400 transition-colors ml-2" aria-hidden="true" /></button>
              </div>


              <button aria-label={`View Wishlist, ${wishlistCount} items`} onClick={() => setIsWishlistOpen(true)} className="relative cursor-pointer hover:text-gray-400 transition-colors hidden sm:block p-1">
                <Heart size={22} aria-hidden="true" />
                <span className="absolute -top-1 -right-1 bg-[#111111] text-white text-[9px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center pointer-events-none shadow-sm">{wishlistCount}</span>
              </button>
              <button aria-label={`View Cart, ${cartCount} items`} onClick={() => setIsCartOpen(true)} className="relative cursor-pointer hover:text-gray-400 transition-colors p-1">
                <ShoppingBag size={22} aria-hidden="true" />
                <span className="absolute -top-1 -right-1 bg-[#111111] text-white text-[9px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center pointer-events-none shadow-sm">{cartCount}</span>
              </button>
            </div>
          </div>

          {/* BOTTOM TIER: CATEGORIES (DESKTOP) */}
          <div className="hidden lg:flex w-full justify-center items-center">
            <div className="flex items-center justify-center flex-wrap gap-x-6 xl:gap-x-10 gap-y-4 text-[10px] xl:text-[11px] uppercase tracking-[0.2em] font-medium text-[#2d2926] max-w-7xl">
              {menuItems.map((item, idx) => (
                <div
                  key={idx}
                  className="relative flex items-center cursor-pointer hover:text-gray-400 transition-colors py-2 group"
                  onMouseEnter={() => item.dropdownType && setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                  onClick={() => {
                    item.name.toUpperCase() === 'HOME' ? window.location.href = '/' : navigateTo('category', item.name);
                  }}
                >
                  <span className="flex items-center gap-1">
                    {item.name} {item.dropdownType && <ChevronDown size={10} className="group-hover:translate-y-[2px] transition-transform" />}
                  </span>

                  <AnimatePresence>
                    {item.dropdownType === "list" && activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }}
                        className="absolute left-1/2 -translate-x-1/2 top-[100%] bg-white shadow-2xl border border-gray-100 flex p-6 z-[200] text-black cursor-default min-w-[250px]"
                        onMouseEnter={() => setActiveDropdown(item.name)}
                      >
                        <div className="w-full flex flex-col justify-start text-left items-start gap-3">
                          <button onClick={(e) => { e.stopPropagation(); setActiveDropdown(null); navigateTo('category', item.name); }} className="text-[11px] font-sans font-bold hover:text-gray-500 cursor-pointer border-b border-gray-200 pb-2 w-full text-left transition-colors uppercase tracking-widest text-[#d4af37]">
                            View All {item.name}
                          </button>
                          {item.subcategories && item.subcategories.map((sub, i) => (
                            <button key={i} onClick={(e) => { e.stopPropagation(); setActiveDropdown(null); navigateTo('category', item.name, null, sub); }} className="text-[11px] font-sans text-gray-600 hover:text-black hover:translate-x-1 transition-all w-full text-left uppercase tracking-wider">
                              {sub}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween' }} className="fixed inset-0 bg-white z-[300] flex flex-col pt-20 px-8 lg:hidden h-screen overflow-y-auto transform-gpu">
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 text-black"><X size={32} /></button>
            <div className="flex flex-col gap-6 text-lg font-serif tracking-widest text-[#2d2926]">
              {menuItems.map((item, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-4">
                  <div onClick={() => {
                    setIsMobileMenuOpen(false);
                    item.name.toUpperCase() === 'HOME' ? window.location.href = '/' : navigateTo('category', item.name);
                  }} className="cursor-pointer">{item.name}</div>

                  {item.subcategories && item.subcategories.length > 0 && (
                    <div className="flex flex-col gap-3 mt-4 pl-4 border-l-2 border-[#d4af37]">
                      {item.subcategories.map((sub, sidx) => (
                        <div key={sidx} onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigateTo('category', item.name, null, sub);
                        }} className="text-sm cursor-pointer hover:text-gray-500 font-sans tracking-wider uppercase text-gray-600">{sub}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-12 flex gap-6">
              <Search size={24} /> <User size={24} />
              <div className="relative cursor-pointer" onClick={() => { setIsMobileMenuOpen(false); setIsWishlistOpen(true); }}>
                <Heart size={24} />
                {wishlistCount > 0 && <span className="absolute -top-2 -right-2 bg-[#2d2926] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{wishlistCount}</span>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Toast = ({ message, isVisible, onClose }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[400] bg-[#2d2926] text-white px-6 py-3.5 rounded-full flex items-center gap-3 shadow-2xl shadow-black/40 border border-white/10 w-[90%] md:w-auto text-center justify-center backdrop-blur-md">
        <CheckCircle size={14} className="text-emerald-400 shrink-0" />
        <span className="text-[10px] md:text-xs tracking-widest uppercase font-bold mt-0.5">{message}</span>
        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors outline-none ml-2 shrink-0"><X size={14} strokeWidth={2.5} /></button>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- WISHLIST DRAWER ---
const WishlistDrawer = ({ isOpen, onClose, wishlistItems, removeFromWishlist, addToCart }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110]" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.4 }} className="fixed top-0 right-0 w-full md:w-[450px] h-full bg-[#fcfbf9] shadow-2xl z-[120] flex flex-col transform-gpu">
            <div className="flex justify-between items-center p-6 md:p-8 border-b border-[#e8e4db] bg-white">
              <h2 className="font-serif text-2xl md:text-3xl text-[#2d2926]">Your Wishlist</h2>
              <button aria-label="Close Wishlist" onClick={onClose} className="text-[#2d2926] hover:rotate-90 transition-transform duration-500 bg-gray-100 p-2 rounded-full"><X size={20} strokeWidth={1.5} aria-hidden="true" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 no-scrollbar bg-gray-50/30">
              {wishlistItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-70 p-8">
                  <div className="w-20 h-20 bg-[#f9f9f9] rounded-full flex items-center justify-center mb-6 shadow-inner border border-gray-100">
                    <Heart size={32} strokeWidth={1} className="text-gray-300" aria-hidden="true" />
                  </div>
                  <h3 className="font-serif text-xl text-[#2d2926] mb-2">No Favorites Yet</h3>
                  <p className="font-sans text-xs text-gray-400 tracking-widest uppercase leading-loose max-w-[250px] mx-auto">Explore our collections and tap the heart icon to save items here.</p>
                  <button onClick={onClose} aria-label="Continue Shopping" className="mt-8 bg-[#2d2926] text-white px-8 py-3 text-[10px] tracking-widest uppercase font-bold hover:bg-black transition-colors rounded-sm shadow-md">Discover Luxury</button>
                </div>
              ) : (
                wishlistItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center bg-white p-3 md:p-4 shadow-sm border border-gray-50 rounded-sm">
                    <img src={item.img} alt={item.name} className="w-20 h-20 md:w-24 md:h-24 object-cover bg-[#f4f1ed]" />
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-[11px] md:text-[13px] font-medium text-[#2d2926] leading-tight mb-1 pr-2">{item.name}</h3>
                        <button aria-label={`Remove ${item.name} from Wishlist`} onClick={() => removeFromWishlist(item.id)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={14} aria-hidden="true" /></button>
                      </div>
                      <p className="font-serif text-xs md:text-sm font-bold text-[#d32f2f] mb-3">Rs. {item.price.toLocaleString()}</p>
                      <button
                        aria-label={`Move ${item.name} to Cart`}
                        onClick={() => { addToCart(item, 1); removeFromWishlist(item.id); }}
                        className="w-full bg-[#2d2926] text-white py-2 rounded-sm text-[10px] tracking-widest uppercase hover:bg-black transition-colors"
                        disabled={item.soldOut}
                      >
                        {item.soldOut ? 'Sold Out' : 'Move to Cart'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- WHATSAPP CHECKOUT FORM ---
const CheckoutForm = ({ cartItems, subtotal, onComplete }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleWhatsAppConfirm = async () => {
    if (!name || !phone || !address) {
      setErrorMsg('Please fill in all your details to proceed.');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    const itemsString = cartItems.map(item => `   - ${item.name} (${item.quantity}x) - Rs. ${(item.price * item.quantity).toLocaleString()}`).join('\n');
    const messageText = `*NEW ORDER FROM LUXE GEMS!*\n____________________________\n*Customer Details:*\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\n____________________________\n*Items Ordered:*\n${itemsString}\n____________________________\n*Subtotal:* Rs. ${subtotal.toLocaleString()}\n*Delivery:* Standard (Owner to confirm)\n____________________________\nKindly provide me the payment link or transfer details to finalize my order.`;

    const payload = {
      customerName: name,
      customerPhone: phone,
      customerCity: address,
      items: cartItems.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity, img: item.img })),
      total: subtotal,
      date: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to save order');

      // Order saved in DB successfully, now open WhatsApp
      window.open(`https://wa.me/923251221401?text=${encodeURIComponent(messageText)}`, '_blank');
      onComplete();
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-8 bg-[#fcfbf9] border border-[#e8e4db] rounded-lg shadow-sm space-y-5 mx-0 md:mx-4 mt-2 mb-6 relative overflow-hidden">
      {/* Decorative Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#d4af37]"></div>

      <div className="text-center mb-6">
        <h3 className="font-serif text-2xl text-[#2d2926] mb-1">Shipping Details</h3>
        <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-4">Secure Checkout</p>
        <div className="w-12 h-[1px] bg-[#d4af37]/30 mx-auto"></div>
      </div>

      <AnimatePresence>
        {errorMsg && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-red-50 text-red-600 text-[11px] p-3 rounded border border-red-100 flex items-center gap-2 mb-4">
            <Info size={14} />
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-[#2d2926] mb-1.5 ml-1 font-bold">Full Name</label>
          <input type="text" placeholder="e.g. Ayesha Khan" value={name} onChange={e => setName(e.target.value)} disabled={isSubmitting} className="w-full text-xs font-sans px-4 py-3.5 bg-white border border-[#e8e4db] rounded-sm outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 transition-all disabled:opacity-50 placeholder:text-gray-300" />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-[#2d2926] mb-1.5 ml-1 font-bold">Phone Number</label>
          <input type="tel" placeholder="e.g. 03xx-xxxxxxx" value={phone} onChange={e => setPhone(e.target.value)} disabled={isSubmitting} className="w-full text-xs font-sans px-4 py-3.5 bg-white border border-[#e8e4db] rounded-sm outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 transition-all disabled:opacity-50 placeholder:text-gray-300" />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-[#2d2926] mb-1.5 ml-1 font-bold">Delivery Address</label>
          <textarea placeholder="Complete house, street, and city (Pakistan only)" value={address} onChange={e => setAddress(e.target.value)} disabled={isSubmitting} rows={3} className="w-full text-xs font-sans px-4 py-3.5 bg-white border border-[#e8e4db] rounded-sm outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20 transition-all resize-none disabled:opacity-50 placeholder:text-gray-300" />
        </div>
      </div>

      <div className="pt-4 border-t border-[#e8e4db]/50 mt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-gray-500 font-serif">Subtotal</span>
          <span className="font-serif text-lg font-bold text-[#2d2926]">Rs. {subtotal.toLocaleString()}</span>
        </div>

        <button onClick={handleWhatsAppConfirm} disabled={isSubmitting} className="relative overflow-hidden group w-full bg-[#2d2926] text-white py-4 rounded-sm text-[11px] font-bold tracking-[0.2em] uppercase transition-all shadow-md disabled:bg-gray-400">
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isSubmitting ? (
              'Processing...'
            ) : (
              <>Complete Order <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </span>
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer transition-none"></div>
        </button>
        <p className="text-center text-[9px] text-gray-400 mt-4 tracking-wider leading-relaxed flex items-center justify-center gap-1.5">
          <Phone size={10} /> Owner will contact via WhatsApp to confirm.
        </p>
      </div>
    </motion.div>
  );
};

// --- CART DRAWER ---
const CartDrawer = ({ isOpen, onClose, cartItems, updateQuantity, removeFromCart, resetCart }) => {
  const [checkoutStage, setCheckoutStage] = useState('cart');
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckoutComplete = () => {
    setCheckoutStage('confirm');
    setTimeout(() => { resetCart(); onClose(); setCheckoutStage('cart'); }, 4000);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110]" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.4 }} className="fixed top-0 right-0 w-full md:w-[450px] h-full bg-[#fcfbf9] shadow-2xl z-[120] flex flex-col transform-gpu">
            <div className="flex justify-between items-center p-6 md:p-8 border-b border-[#e8e4db] bg-white">
              <h2 className="font-serif text-2xl md:text-3xl text-[#2d2926]">Your Bag</h2>
              <button aria-label="Close Cart" onClick={onClose} className="text-[#2d2926] hover:rotate-90 transition-transform duration-500 bg-gray-100 p-2 rounded-full"><X size={20} strokeWidth={1.5} aria-hidden="true" /></button>
            </div>

            {checkoutStage === 'cart' && (
              <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 no-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-70 p-8">
                    <div className="w-20 h-20 bg-[#f9f9f9] rounded-full flex items-center justify-center mb-6 shadow-inner border border-gray-100">
                      <ShoppingBag size={32} strokeWidth={1} className="text-gray-300" aria-hidden="true" />
                    </div>
                    <h3 className="font-serif text-xl text-[#2d2926] mb-2">Your Bag is Empty</h3>
                    <p className="font-sans text-xs text-gray-400 tracking-widest uppercase leading-loose max-w-[250px] mx-auto">Looks like you haven't added anything to your cart yet.</p>
                    <button onClick={onClose} aria-label="Start Shopping" className="mt-8 bg-[#2d2926] text-white px-8 py-3 text-[10px] tracking-widest uppercase font-bold hover:bg-black transition-colors rounded-sm shadow-md">Start Shopping</button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center bg-white p-3 md:p-4 shadow-sm border border-gray-50 rounded-sm">
                      <img src={item.img} alt={item.name} className="w-20 h-20 md:w-24 md:h-24 object-cover bg-[#f4f1ed]" />
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif text-[11px] md:text-[13px] font-medium text-[#2d2926] leading-tight mb-1 pr-2">{item.name}</h3>
                          <button aria-label={`Remove ${item.name} from Cart`} onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={14} aria-hidden="true" /></button>
                        </div>
                        <div className="flex justify-between items-center w-full mt-2">
                          <div className="flex items-center gap-3 border border-[#e8e4db] px-2 py-1 rounded-sm">
                            <button aria-label="Decrease Quantity" onClick={() => updateQuantity(item.id, -1)} className="hover:text-red-500 transition-colors"><Minus size={12} aria-hidden="true" /></button>
                            <span className="text-xs font-sans font-medium">{item.quantity}</span>
                            <button aria-label="Increase Quantity" onClick={() => updateQuantity(item.id, 1)} className="hover:text-green-600 transition-colors"><Plus size={12} aria-hidden="true" /></button>
                          </div>
                          <p className="font-serif text-xs md:text-sm font-bold text-[#d32f2f]">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {checkoutStage === 'form' && (
              <div className="flex-1 overflow-y-auto p-6 flex flex-col no-scrollbar bg-white">
                <CheckoutForm cartItems={cartItems} subtotal={subtotal} onComplete={handleCheckoutComplete} />
                <button onClick={() => setCheckoutStage('cart')} className="mt-6 text-center text-xs text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors outline-none cursor-pointer">Back to Bag</button>
              </div>
            )}

            {checkoutStage === 'confirm' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-[#fcfbf9]">
                <CheckCircle size={80} color="#25D366" strokeWidth={0.5} className="mb-6" />
                <h3 className="font-serif text-2xl mb-2 text-[#2d2926]">Order Shared!</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed font-sans tracking-widest uppercase">Details sent to owner.</p>
              </div>
            )}

            {checkoutStage === 'cart' && cartItems.length > 0 && (
              <div className="p-6 md:p-8 border-t border-[#e8e4db] bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-sans text-xs tracking-widest uppercase text-gray-500">Subtotal</span>
                  <span className="font-serif text-2xl text-[#2d2926]">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <button onClick={() => setCheckoutStage('form')} className="w-full bg-[#2d2926] text-white py-4 rounded-sm text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors shadow-xl outline-none">Proceed to Checkout</button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- HERO SECTION (LUXE GEMS PUSHED HIGHER UP) ---
const Hero = ({ navigateTo, categories = [] }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, 250]);
  const opacityText = useTransform(scrollY, [0, 400], [0.9, 0]);

  return (
    <section id="hero" className="relative w-full h-[80vh] md:h-[100vh] bg-[white] overflow-hidden flex flex-col z-0 justify-center items-center">
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <img src="/images/bg.jpg" alt="Background" className="w-full h-full object-cover opacity-90" />
      </div>

      <div className="absolute top-4 left-4 md:top-12 md:left-12 z-30 cursor-pointer pointer-events-auto hidden md:block" onClick={() => window.location.href = '/'}>
        <img src="/images/Logo.png" alt="LUXE GEMS Small Logo" className="h-16 md:h-24 object-contain hover:opacity-80 transition-opacity drop-shadow-sm" />
      </div>

      <div className="absolute inset-0 flex justify-center items-center w-full h-full pointer-events-none">

        <div className="absolute bottom-[-10%] md:bottom-[-15%] left-0 w-full flex justify-center items-end z-20 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 200, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1.1 }}
            transition={{ duration: 2, ease: luxuryEase, delay: 0.2 }}
            className="w-[130%] sm:w-[120%] md:w-full max-w-[850px] h-[70vh] md:h-[95vh]"
          >
            <img src="/images/hero-hands.png" alt="Luxury gold and diamond rings" className="w-full h-full object-contain object-bottom drop-shadow-[0_35px_35px_rgba(0,0,0,0.35)]" loading="eager" />
          </motion.div>
        </div>

        {/* TEXT SHIFTED HIGHER */}
        <div className="absolute inset-0 flex justify-center items-center z-10 pointer-events-none pb-40 md:pb-60">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: 1.5, ease: luxuryEase }}
            className="flex flex-col items-center justify-center text-center w-full px-4"
          >
            <h1 className="text-5xl md:text-8xl lg:text-[11rem] font-serif tracking-[0.2em] md:tracking-[0.3em] uppercase opacity-90" style={{
              textShadow: '0px 15px 40px rgba(0,0,0,0.1)',
              fontWeight: 300
            }}>
              <span className="text-[#111111]">LUXE</span> <span className="text-[#e6c57a]">GEMS</span>
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 flex justify-between items-end w-full px-4 md:px-12 pb-8 md:pb-16 z-30 hidden md:flex">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="w-1/3 text-[#111111] flex flex-col justify-end h-full transform translate-y-12">
          <motion.h2 variants={fadeInUp} className="text-4xl lg:text-6xl font-serif mb-4 lg:mb-6 tracking-[0.1em] drop-shadow-md leading-tight group">
            COLLECTION<br /><span className="font-light italic text-[#d4af37]">2026</span>
          </motion.h2>
          <motion.div variants={fadeInUp} className="h-[2px] w-24 bg-gradient-to-r from-[#d4af37] to-[#fcf2bd] mb-8 shadow-sm"></motion.div>
          <motion.p variants={fadeInUp} className="text-xs lg:text-sm font-sans font-medium leading-relaxed mb-10 max-w-xs tracking-[0.1em] drop-shadow-sm text-[#333333]">Discover exquisite jewelry inspired by the beauty of the heavens. Each piece is crafted to bring elegance to your most cherished occasions.</motion.p>
          <motion.button onClick={() => navigateTo('category', 'Collection 2026')} variants={fadeInUp} whileHover={{ scale: 1.05, backgroundColor: "#d4af37", color: "#111" }} whileTap={{ scale: 0.95 }} className="group bg-[#111111] text-white font-bold px-10 py-4 rounded-full text-xs tracking-[0.2em] uppercase flex items-center gap-4 transition-all duration-300 w-fit shadow-2xl border border-transparent hover:border-[#d4af37]">
            Discover <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
          </motion.button>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="w-1/3 text-[#111111] flex flex-col items-end justify-end h-full pb-4">
          <motion.h3 variants={fadeInUp} className="text-sm lg:text-base font-serif font-bold text-right mb-12 max-w-[220px] leading-relaxed tracking-[0.15em] drop-shadow-sm uppercase text-[#111111]">
            A CELESTIAL TOUCH <br /><span className="italic text-[#d4af37] font-light">FOR TIMELESS MOMENTS</span>
          </motion.h3>
          <nav className="w-full max-w-[250px] flex flex-col gap-1">
            {(categories.length > 0 ? categories.slice(0, 4).map(c => getCatName(c)) : ['Rings', 'Earrings', 'Necklaces', 'Bracelets']).map((item, index) => (
              <motion.div key={index} variants={fadeInUp} onClick={() => navigateTo('category', item)} className="flex justify-between items-center border-b border-gray-300 py-4 cursor-pointer group hover:border-[#111111] transition-colors duration-500">
                <span className="text-[10px] lg:text-xs tracking-[0.25em] uppercase font-sans font-bold text-gray-600 group-hover:text-[#111111] transition-colors">{item}</span>
                <ArrowRight size={14} className="opacity-0 -translate-x-4 text-[#d4af37] group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500" />
              </motion.div>
            ))}
          </nav>
        </motion.div>
      </div>

      {/* Scroll Indicator Feature */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 hidden md:flex flex-col items-center gap-2 text-[#111111] cursor-pointer group">
        <span className="text-[8px] tracking-[0.4em] uppercase font-bold text-[#d4af37] group-hover:text-[#111111] transition-colors">Scroll Down</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
          <ChevronDown size={14} strokeWidth={1.5} className="text-[#111111]" />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 md:hidden z-30">
        <button onClick={() => navigateTo('category', 'Collection 2026')} className="bg-[#111111] text-white px-10 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase shadow-2xl border border-transparent hover:border-[#d4af37]" aria-label="Shop the new collection">Shop Now</button>
      </div>
    </section>
  );
};

// --- SHOP BY COLLECTION (DYNAMIC CIRCLES) ---
const CollectionCircle = ({ catName, imageSrc, onClick }) => {
  const [imgError, setImgError] = React.useState(false);
  const initial = catName ? catName.charAt(0).toUpperCase() : '?';

  return (
    <article
      onClick={onClick}
      className="flex flex-col items-center gap-3 cursor-pointer group w-[100px] md:w-[140px] shrink-0"
      aria-label={`Shop the ${catName} collection`}
    >
      <div className="w-[80px] h-[80px] md:w-[110px] md:h-[110px] rounded-full overflow-hidden border border-gray-200 group-hover:border-[#2d2926] transition-colors relative bg-gray-50 shadow-sm flex items-center justify-center p-1">
        {imageSrc && !imgError ? (
          <img
            src={imageSrc}
            alt={`${catName} Collection`}
            className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#f5f0e8] to-[#e8e0d4] flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
            <span className="text-2xl md:text-3xl font-serif text-[#d4af37] font-bold select-none">{initial}</span>
          </div>
        )}
      </div>
      <span className="text-[10px] md:text-xs font-serif text-[#2d2926] text-center tracking-wide group-hover:font-medium transition-all px-2">
        {catName}
      </span>
    </article>
  );
};

const ShopByCollection = ({ categories, products, navigateTo }) => {
  // Try to find a representative image for each category (first product's image)
  const getCategoryImage = (catObj) => {
    const catName = getCatName(catObj);

    // 0. Use Admin-uploaded image if available
    if (typeof catObj === 'object' && catObj.image) {
      return catObj.image;
    }

    // 1. Try to find actual product images for this category
    const product = products.find(p => p.category === catName && p.img);
    if (product && product.img) return product.img;
    const productWithImages = products.find(p => p.category === catName && p.images && p.images.length > 0);
    if (productWithImages) return productWithImages.images[0];

    // 2. Curated Unsplash fallback images for standard categories
    const curatedImages = {
      "Women's Collections": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop",
      "Men's Collections": "https://images.unsplash.com/photo-1588665792198-6cebbd3b435f?q=80&w=600&auto=format&fit=crop",
      "Luxury Earrings": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop",
      "Luxury Necklaces": "https://images.unsplash.com/photo-1599643478524-fb524450bf08?q=80&w=600&auto=format&fit=crop",
      "Rings": "https://images.unsplash.com/photo-1605100804763-247f67b254a6?q=80&w=600&auto=format&fit=crop"
    };

    return curatedImages[catName] || null;
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section className="bg-white w-full py-16 px-4 md:px-12 flex flex-col items-center border-y border-gray-50">
      <div className="text-center mb-10 px-4 w-full">
        <h2 className="text-2xl md:text-3xl font-serif text-[#2d2926] relative inline-block">
          <span className="hidden md:block absolute top-1/2 -left-12 w-8 h-[1px] bg-gray-300"></span>
          Shop By Collection
          <span className="hidden md:block absolute top-1/2 -right-12 w-8 h-[1px] bg-gray-300"></span>
        </h2>
      </div>

      {/* Horizontal Scrollable Container */}
      <div className="w-full overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-4 md:gap-8 justify-start md:justify-center min-w-max mx-auto">
          {categories.map((cat, idx) => {
            const name = getCatName(cat);
            return (
              <CollectionCircle
                key={idx}
                catName={name}
                imageSrc={getCategoryImage(cat)}
                onClick={() => navigateTo('category', name)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

// --- ADVANCED PRODUCT GRID ---
const AdvancedProductGrid = ({ title, subtitle, products, addToCart, navigateTo, toggleWishlist, wishlistItems, hideHeader, showToolbar = false }) => {
  const [sortType, setSortType] = useState('date-new');
  const [isSortVisible, setIsSortVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  let finalProducts = products;
  if (showInStockOnly) finalProducts = finalProducts.filter(p => !p.soldOut);
  if (showSaleOnly) finalProducts = finalProducts.filter(p => p.discount);
  if (minPrice && !isNaN(minPrice)) finalProducts = finalProducts.filter(p => p.price >= Number(minPrice));
  if (maxPrice && !isNaN(maxPrice)) finalProducts = finalProducts.filter(p => p.price <= Number(maxPrice));

  const sortedProducts = [...finalProducts].sort((a, b) => {
    if (sortType === 'price-low') return a.price - b.price;
    if (sortType === 'price-high') return b.price - a.price;
    if (sortType === 'alpha') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <section className={`bg-white w-full px-4 md:px-12 ${hideHeader ? 'pt-6 pb-16' : 'py-16'}`}>
      {!hideHeader && (
        <div className="text-center mb-10 px-4">
          <h2 className="text-2xl md:text-3xl font-serif text-[#2d2926] relative inline-block">
            <span className="hidden md:block absolute top-1/2 -left-12 w-8 h-[1px] bg-gray-300"></span>{title}
            <span className="hidden md:block absolute top-1/2 -right-12 w-8 h-[1px] bg-gray-300"></span>
          </h2>
          <p className="text-[10px] md:text-xs text-gray-400 font-serif italic mt-2">{subtitle}</p>
        </div>
      )}

      {showToolbar && (
        <div className="flex flex-col md:flex-row justify-between items-center border-y border-gray-100 py-3 mb-10 text-xs md:text-sm text-gray-500 gap-4 md:gap-0">
          <div className="relative group z-30 w-full md:w-auto flex justify-between md:block">
            <div onClick={() => setIsFilterVisible(!isFilterVisible)} className="flex items-center gap-2 cursor-pointer hover:text-[#2d2926]">
              <SlidersHorizontal size={14} /> <span className="tracking-widest uppercase text-[9px] md:text-[10px] font-medium">Filter</span>
            </div>

            <div className="flex md:hidden gap-2">
              <Grid size={16} onClick={() => setViewMode('grid')} className={`cursor-pointer transition-colors ${viewMode === 'grid' ? 'text-[#2d2926]' : 'text-gray-400 hover:text-[#2d2926]'}`} />
              <List size={16} onClick={() => setViewMode('list')} className={`cursor-pointer transition-colors ${viewMode === 'list' ? 'text-[#2d2926]' : 'text-gray-400 hover:text-[#2d2926]'}`} />
            </div>

            <AnimatePresence>
              {isFilterVisible && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-[110%] left-0 w-full md:w-64 bg-white shadow-xl p-5 border border-gray-100 space-y-4 text-xs font-sans text-gray-600 z-50">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-black">
                      <input type="checkbox" checked={showInStockOnly} onChange={() => setShowInStockOnly(!showInStockOnly)} className="accent-[#2d2926]" />
                      In Stock Only
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-black">
                      <input type="checkbox" checked={showSaleOnly} onChange={() => setShowSaleOnly(!showSaleOnly)} className="accent-[#2d2926]" />
                      On Sale Only
                    </label>
                  </div>
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#2d2926]">Price Range (PKR)</span>
                    <div className="flex items-center gap-2">
                      <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-1/2 px-3 py-2 border border-gray-200 outline-none focus:border-[#2d2926] transition-colors rounded-sm" />
                      <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-1/2 px-3 py-2 border border-gray-200 outline-none focus:border-[#2d2926] transition-colors rounded-sm" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden md:flex gap-2">
            <Grid size={18} onClick={() => setViewMode('grid')} className={`cursor-pointer transition-colors ${viewMode === 'grid' ? 'text-[#2d2926]' : 'text-gray-400 hover:text-[#2d2926]'}`} />
            <List size={18} onClick={() => setViewMode('list')} className={`cursor-pointer transition-colors ${viewMode === 'list' ? 'text-[#2d2926]' : 'text-gray-400 hover:text-[#2d2926]'}`} />
          </div>

          <div className="relative group z-20 w-full md:w-auto">
            <div onClick={() => setIsSortVisible(!isSortVisible)} className="flex justify-between md:justify-start items-center gap-2 border border-gray-200 px-3 py-2 md:py-1.5 rounded-sm cursor-pointer hover:border-gray-400 transition-colors focus:border-black">
              <span className="text-[10px] md:text-[11px]">{sortType === 'date-new' ? 'Date, new to old' : sortType === 'price-low' ? 'Price, low to high' : sortType === 'price-high' ? 'Price, high to low' : 'Alphabetical'}</span> <ChevronDown size={10} />
            </div>
            <AnimatePresence>
              {isSortVisible && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-[110%] right-0 w-full md:w-48 bg-white shadow-xl p-3 border border-gray-100 space-y-2 text-xs font-sans text-gray-600 z-50">
                  {[{ type: 'date-new', label: 'Date, new to old' }, { type: 'price-low', label: 'Price, low to high' }, { type: 'price-high', label: 'Price, high to low' }, { type: 'alpha', label: 'Alphabetical' }].map(option => (
                    <div key={option.type} onClick={() => { setSortType(option.type); setIsSortVisible(false); }} className={`cursor-pointer px-2 py-2 rounded hover:bg-gray-100 ${sortType === option.type ? 'font-medium text-[#2d2926]' : ''}`}>{option.label}</div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div className={`no-scrollbar ${viewMode === 'list' ? 'flex flex-col gap-6' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12'}`}>
        {sortedProducts.map((product, idx) => {
          const isWishlisted = wishlistItems && wishlistItems.some(item => item.id === product.id);
          return (
            <motion.article
              key={idx}
              initial="hidden" animate="visible" variants={fadeInUp} viewport={{ once: true }}
              className={`group relative ${viewMode === 'list' ? 'flex flex-row gap-6 items-start bg-white border border-gray-100 p-4 rounded-sm' : ''}`}
            >
              <div className={`relative bg-[#f9f9f9] overflow-hidden border border-transparent hover:border-gray-200 transition-colors duration-300 ${viewMode === 'list' ? 'w-40 h-40 md:w-52 md:h-52 shrink-0' : 'aspect-[4/5] mb-4'}`}>
                {product.discount && (
                  <div className="absolute top-2 left-2 bg-[#d4af37] text-white text-[10px] font-medium px-2 py-1 z-10 shadow-sm rounded-sm">
                    {product.discount.toUpperCase().includes('SAVE') ? product.discount : `Save ${product.discount.replace('-', '')}`}
                  </div>
                )}
                {product.soldOut && (
                  <div className="absolute top-2 left-2 bg-gray-500 text-white text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm z-10 shadow-sm">Sold Out</div>
                )}
                <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-multiply cursor-pointer" onClick={() => navigateTo('product_details', '', product)} />

                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                    className="absolute top-3 left-3 bg-white p-2 rounded-full shadow-lg hover:text-red-500 transition-colors"
                  >
                    <Heart size={16} fill={isWishlisted ? "red" : "none"} color={isWishlisted ? "red" : "currentColor"} />
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); navigateTo('product_details', null, product); }}
                    className="bg-white text-[#2d2926] px-5 py-2.5 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase shadow-xl hover:bg-gray-100 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center gap-2"
                  >
                    <Eye size={12} /> Quick View
                  </button>

                  {!product.soldOut ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }}
                      className="bg-[#2d2926] text-white px-5 py-2.5 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase shadow-xl hover:bg-black transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center gap-2"
                    >
                      <ShoppingCart size={12} /> Quick Shop
                    </button>
                  ) : (
                    <button className="bg-gray-400 text-white px-5 py-2.5 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase shadow-xl transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center gap-2 cursor-not-allowed">
                      Sold Out
                    </button>
                  )}
                </div>
              </div>

              <div className={`cursor-pointer ${viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : 'text-left'}`} onClick={() => navigateTo('product_details', null, product)}>
                <h3 className={`font-sans text-[#2d2926] leading-snug mb-1 hover:text-gray-500 transition-colors ${viewMode === 'list' ? 'text-sm md:text-base font-medium' : 'text-[11px] md:text-[13px] line-clamp-2 min-h-[36px]'}`}>{product.name}</h3>
                {viewMode === 'list' && <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">{product.category}</p>}
                <div className="flex gap-2 items-center mb-3">
                  {product.oldPrice && <span className="text-[10px] md:text-[11px] text-gray-500 line-through">Rs.{product.oldPrice.toLocaleString()}</span>}
                  <span className={`text-[#ff3333] tracking-wide ${viewMode === 'list' ? 'text-base md:text-lg font-semibold' : 'text-[13px] md:text-[15px]'}`}>Rs.{product.price.toLocaleString()}</span>
                </div>
                {viewMode === 'list' && !product.soldOut && (
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }}
                    className="mt-2 bg-[#2d2926] text-white px-6 py-2.5 rounded-sm text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-black transition-colors w-fit"
                  >
                    Add to Cart
                  </button>
                )}
                {viewMode === 'list' && product.soldOut && (
                  <span className="mt-2 text-[10px] text-gray-400 uppercase tracking-widest font-bold">Sold Out</span>
                )}
                {viewMode !== 'list' && product.colors && (
                  <div className="flex gap-1.5 mt-2">
                    {product.colors.map((color, i) => (
                      <div key={i} className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border border-gray-300 hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: color }}></div>
                    ))}
                  </div>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>

      {
        !hideHeader && products.length <= 4 && sortedProducts.length > 0 && (
          <div className="w-full flex justify-center mt-12">
            <button className="border border-[#2d2926] text-[#2d2926] px-10 py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-[#2d2926] hover:text-white transition-colors outline-none">Load More</button>
          </div>
        )
      }

      {
        sortedProducts.length === 0 && (
          <div className="h-40 flex items-center justify-center text-center p-10 font-sans text-xs text-gray-400 tracking-widest uppercase border border-dashed border-gray-200 mt-4 rounded-lg">No products matching your filters found.</div>
        )
      }
    </section >
  );
};

const DualBanners = ({ categories, navigateTo, products = [] }) => {
  const firstCat = categories && categories.length > 0 ? getCatName(categories[0]) : 'Luxury Earrings';
  const secondCat = categories && categories.length > 1 ? getCatName(categories[1]) : (categories && categories.length === 1 ? getCatName(categories[0]) : 'Luxury Pendants');

  const getImage = (catName) => {
    const p = products.find(pr => pr.category === catName && pr.img);
    return p ? p.img : '/placeholder.png';
  };

  return (
    <section className="bg-white w-full px-4 md:px-12 py-10 flex flex-col md:flex-row gap-6">
      <div onClick={() => navigateTo('category', firstCat)} className="w-full md:w-1/2 relative h-[200px] md:h-[300px] bg-[#f0ece6] overflow-hidden group cursor-pointer flex items-center justify-center">
        <img src={getImage(firstCat)} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt={firstCat} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
        <div className="absolute left-6 md:left-10 text-white space-y-1 md:space-y-2 z-10">
          <h3 className="text-lg md:text-xl font-serif italic mb-1">{firstCat}</h3>
          <h2 className="text-2xl md:text-4xl font-serif font-bold uppercase leading-none">For Your<br />Loved Ones</h2>
        </div>
      </div>
      <div onClick={() => navigateTo('category', secondCat)} className="w-full md:w-1/2 relative h-[200px] md:h-[300px] bg-[#e8e4db] overflow-hidden group cursor-pointer flex items-center justify-center">
        <img src={getImage(secondCat)} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt={secondCat} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
        <div className="absolute left-6 md:left-10 text-white space-y-1 md:space-y-2 z-10">
          <h3 className="text-lg md:text-xl font-serif italic mb-1">{secondCat}</h3>
          <h2 className="text-2xl md:text-4xl font-serif font-bold uppercase leading-none">Timeless<br />Elegance</h2>
        </div>
      </div>
    </section>
  );
};

const BlogsSection = () => (
  <section className="bg-white w-full px-4 md:px-12 py-16 border-t border-gray-100 mt-10">
    <div className="text-center mb-12">
      <h2 className="text-xl md:text-2xl font-serif text-[#2d2926] uppercase tracking-widest relative inline-block">
        <span className="hidden md:block absolute top-1/2 -left-12 w-8 h-[1px] bg-gray-300"></span>Lates From Blog
        <span className="hidden md:block absolute top-1/2 -right-12 w-8 h-[1px] bg-gray-300"></span>
      </h2>
      <p className="text-[10px] md:text-xs text-gray-400 font-serif italic mt-2">The freshest and most exciting news</p>
    </div>
    <div className="flex flex-col md:flex-row gap-8">
      <article className="w-full md:w-1/2 flex flex-col md:flex-row gap-6 group cursor-pointer">
        <div className="w-full md:w-1/2 overflow-hidden aspect-[4/3]"><img src="/placeholder.png" alt="Blog 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest mb-2">On January 27, 2026</p>
          <h3 className="text-xs md:text-sm font-serif font-bold text-[#2d2926] mb-2 md:mb-3 uppercase group-hover:text-gray-500 transition-colors">Ultimate Guide To Women's Wedding Bands</h3>
          <p className="text-[10px] md:text-xs text-gray-500 leading-relaxed line-clamp-3">ULTIMATE GUIDE TO WOMEN'S WEDDING BANDS We're all for non-conventional, however, most women choose to...</p>
        </div>
      </article>
      <article className="w-full md:w-1/2 flex flex-col md:flex-row gap-6 group cursor-pointer mt-8 md:mt-0">
        <div className="w-full md:w-1/2 overflow-hidden aspect-[4/3]"><img src="/placeholder.png" alt="Blog 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest mb-2">On February 8, 2026</p>
          <h3 className="text-xs md:text-sm font-serif font-bold text-[#2d2926] mb-2 md:mb-3 uppercase group-hover:text-gray-500 transition-colors">4 Gifts For Your Loved One</h3>
          <p className="text-[10px] md:text-xs text-gray-500 leading-relaxed line-clamp-3">1. SILVER LEAF RING This dazzling Red Spade Ring from LUXE GEMS can be a forever cherished gift. It features a cry...</p>
        </div>
      </article>
    </div>
  </section>
);

const InstagramSection = () => (
  <section className="bg-white w-full py-16">
    <div className="text-center mb-10 px-4">
      <h2 className="text-lg md:text-xl font-sans font-bold text-[#2d2926] uppercase tracking-widest relative inline-block">
        <span className="hidden md:block absolute top-1/2 -left-20 w-16 h-[1px] bg-gray-300"></span>@ FOLLOW US ON INSTAGRAM
        <span className="hidden md:block absolute top-1/2 -right-20 w-16 h-[1px] bg-gray-300"></span>
      </h2>
      <p className="text-[10px] md:text-[11px] text-gray-400 font-serif italic mt-2">@luxegemsofficial</p>
    </div>
    <div className="flex w-full overflow-x-auto no-scrollbar snap-x">
      {[
        "/placeholder.png",
        "/placeholder.png",
        "/placeholder.png",
        "/placeholder.png",
        "/placeholder.png"
      ].map((img, i) => (
        <div key={i} className="min-w-[50%] md:min-w-[20%] w-[50%] md:w-1/5 relative group cursor-pointer aspect-square snap-start shrink-0">
          <img src={img} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" alt="Instagram" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
            <Heart size={24} className="text-white md:w-8 md:h-8" fill="white" />
          </div>
        </div>
      ))}
    </div>
  </section>
);

const FeatureStrip = () => (
  <section className="bg-[#fcfbf9] border-y border-gray-200 w-full py-12 px-4 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-[#2d2926]">
    {[{ Icon: ShoppingBag, title: 'Free Shipping', desc: 'On orders over 3000 PKR' }, { Icon: MessageCircle, title: 'Support 24/7', desc: 'Contact us 24h a day' }, { Icon: Menu, title: 'Easy Return', desc: 'Within 30 days for exchange' }, { Icon: User, title: 'Secure Payment', desc: 'Owner confirms securely' }].map((feat, i) => (
      <div key={i} className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-3 md:gap-4">
        <feat.Icon size={24} strokeWidth={1} className="shrink-0" />
        <div><h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest mb-1">{feat.title}</h4><p className="text-[9px] md:text-[10px] text-gray-500 font-sans">{feat.desc}</p></div>
      </div>
    ))}
  </section>
);

// --- INFO MODAL (FOR POLICIES) ---
const InfoModal = ({ isOpen, title, content, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 py-10" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-2xl rounded-sm shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-6 md:p-8 border-b border-gray-100 shrink-0 bg-white z-10">
              <h2 id="modal-title" className="text-xl md:text-2xl font-serif text-[#2d2926]">{title}</h2>
              <button onClick={onClose} aria-label="Close Policy Modal" className="text-gray-400 hover:text-black hover:bg-gray-100 p-2 rounded-full transition-colors"><X size={20} aria-hidden="true" /></button>
            </div>
            <div className="overflow-y-auto p-6 md:p-8 flex-1 no-scrollbar text-xs md:text-sm text-gray-600 font-sans leading-relaxed space-y-4">
              {content.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
            <div className="p-6 md:p-8 border-t border-gray-100 shrink-0 bg-gray-50 flex justify-end">
              <button onClick={onClose} className="px-6 md:px-8 py-3 bg-[#2d2926] text-white rounded-sm text-[10px] md:text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors shadow-lg shadow-black/10">Acknowledge</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// --- MEGA FOOTER ---
// --- MEGA FOOTER ---
const MegaFooter = ({ navigateTo, resetPage }) => {
  return (
    <>
      <footer className="bg-[#111111] w-full pt-20 pb-10 px-6 md:px-16 text-white font-sans relative overflow-hidden">
        {/* Subtle Decorative Background Element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start border-b border-white/10 pb-16 mb-10 gap-16 lg:gap-8">

            {/* Brand Intro Column */}
            <div className="w-full lg:w-[30%]">
              <h2 className="text-3xl font-serif font-bold tracking-[0.2em] uppercase mb-6 text-white">
                LUXE <span className="text-[#d4af37]">GEMS</span>
              </h2>
              <p className="text-sm text-white/60 leading-relaxed font-sans pr-4 mb-8">
                Pakistan's premier destination for handcrafted luxury jewelry. We blend timeless elegance with modern craftsmanship, delivering unparalleled quality right to your doorstep.
              </p>
              <div className="flex gap-4 text-white/80">
                {[{ Icon: 'FB', label: 'Facebook' }, { Icon: 'IG', label: 'Instagram' }].map(soc => (
                  <span key={soc.label} aria-label={soc.label} className="cursor-pointer hover:text-[#d4af37] transition-all group flex items-center justify-center w-10 h-10 rounded-full border border-white/20 hover:border-[#d4af37] bg-white/5 hover:bg-[#d4af37]/10">
                    <span className="text-xs font-bold">{soc.Icon}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Links Columns Container */}
            <div className="w-full lg:w-[40%] grid grid-cols-2 sm:grid-cols-3 gap-10">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6 text-white font-serif">Policies</h4>
                <ul className="flex flex-col gap-4 text-xs text-white/50 font-medium">
                  <li><span onClick={() => navigateTo('privacy_policy')} className="hover:text-[#d4af37] transition-colors cursor-pointer flex items-center gap-2"><ArrowRight size={10} className="text-[#d4af37]/50" /> Privacy Policy</span></li>
                  <li><span onClick={() => navigateTo('refund_policy')} className="hover:text-[#d4af37] transition-colors cursor-pointer flex items-center gap-2"><ArrowRight size={10} className="text-[#d4af37]/50" /> Refund Policy</span></li>
                  <li><span onClick={() => navigateTo('shipping_policy')} className="hover:text-[#d4af37] transition-colors cursor-pointer flex items-center gap-2"><ArrowRight size={10} className="text-[#d4af37]/50" /> Shipping Policy</span></li>
                  <li><span onClick={() => navigateTo('terms_service')} className="hover:text-[#d4af37] transition-colors cursor-pointer flex items-center gap-2"><ArrowRight size={10} className="text-[#d4af37]/50" /> Terms of Service</span></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6 text-white font-serif">Care</h4>
                <ul className="flex flex-col gap-4 text-xs text-white/50 font-medium">
                  <li><span onClick={() => navigateTo('faqs')} className="hover:text-[#d4af37] transition-colors cursor-pointer flex items-center gap-2"><ArrowRight size={10} className="text-[#d4af37]/50" /> FAQS</span></li>
                  <li><span onClick={() => navigateTo('about_us')} className="hover:text-[#d4af37] transition-colors cursor-pointer flex items-center gap-2"><ArrowRight size={10} className="text-[#d4af37]/50" /> About Us</span></li>
                  <li><span onClick={() => navigateTo('size_chart')} className="hover:text-[#d4af37] transition-colors cursor-pointer flex items-center gap-2"><ArrowRight size={10} className="text-[#d4af37]/50" /> Size Chart</span></li>
                  <li><span className="hover:text-[#d4af37] transition-colors cursor-pointer flex items-center gap-2"><ArrowRight size={10} className="text-[#d4af37]/50" /> Box Care</span></li>
                </ul>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6 text-white font-serif">Perks</h4>
                <ul className="flex flex-col gap-4 text-xs text-white/50 font-medium">
                  <li><span className="hover:text-[#d4af37] transition-colors cursor-pointer flex items-center gap-2"><ArrowRight size={10} className="text-[#d4af37]/50" /> Easy Returns</span></li>
                  <li><span className="hover:text-[#d4af37] transition-colors cursor-pointer flex items-center gap-2"><ArrowRight size={10} className="text-[#d4af37]/50" /> Fast Shipping</span></li>
                  <li><span className="hover:text-[#d4af37] transition-colors cursor-pointer flex items-center gap-2"><ArrowRight size={10} className="text-[#d4af37]/50" /> Secure Pay</span></li>
                </ul>
              </div>
            </div>

            {/* Newsletter Column */}
            <div className="w-full lg:w-[30%]">
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6 text-white font-serif">Newsletter</h4>
              <p className="text-xs text-white/60 mb-6 leading-relaxed font-sans">
                Join our private mailing list for exclusive access to new collections and receive 10% off your first luxury piece.
              </p>
              <div className="flex flex-col gap-3">
                <input type="email" placeholder="Enter your email address" aria-label="Newsletter email input" className="w-full text-sm font-sans px-4 py-4 outline-none bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-sm focus:border-[#d4af37] transition-colors" />
                <button className="w-full bg-[#d4af37] text-[#111111] px-6 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white transition-colors rounded-sm shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2">
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center text-[10px] text-white/40 uppercase tracking-widest gap-6 md:gap-0 text-center md:text-left font-medium">
            <p className="flex items-center gap-1">
              © 2026 LUXE GEMS.
              <span onDoubleClick={(e) => { e.stopPropagation(); navigateTo('admin_login'); }} className="hover:text-white transition-colors cursor-pointer select-none ml-1 relative">
                All rights reserved.
                <span className="absolute bottom-[-4px] left-0 w-full h-[1px] bg-white/10"></span>
              </span>
            </p>
            <div className="flex gap-6 items-center flex-wrap justify-center">
              <span onClick={() => navigateTo('privacy_policy')} className="hover:text-[#d4af37] transition-colors cursor-pointer">Privacy</span>
              <span onClick={() => navigateTo('terms_service')} className="hover:text-[#d4af37] transition-colors cursor-pointer">Terms</span>
              <span onClick={() => navigateTo('refund_policy')} className="hover:text-[#d4af37] transition-colors cursor-pointer">Returns</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

// --- CATEGORY PAGE VIEW ---
const CategoryPage = ({ categoryName, subCategoryName, addToCart, navigateTo, products, toggleWishlist, wishlistItems, categories, productDatabase }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white min-h-screen">
      <div className="bg-[#fcfbf9] py-8 px-4 md:px-12 text-center border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto text-left flex items-center gap-2 text-[9px] md:text-[10px] text-gray-500 font-sans tracking-widest uppercase mb-6 cursor-pointer hover:text-black" onClick={() => navigateTo('home')}>
          <ChevronLeft size={12} /> Back to Home
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-[#2d2926] uppercase tracking-widest">
          {subCategoryName && subCategoryName !== categoryName ? subCategoryName : categoryName}
        </h1>
        <p className="text-[9px] md:text-[10px] text-gray-500 mt-2 font-sans tracking-widest uppercase leading-loose">
          Home / Collections / {categoryName} {subCategoryName && subCategoryName !== categoryName ? `/ ${subCategoryName}` : ''}
        </p>
      </div>

      <div className="max-w-[1600px] mx-auto mt-4">
        <AdvancedProductGrid title={subCategoryName || categoryName} subtitle={`Explore exclusive items`} products={products} addToCart={addToCart} navigateTo={navigateTo} toggleWishlist={toggleWishlist} wishlistItems={wishlistItems} hideHeader={true} />
      </div>
    </motion.div>
  );
};

// --- IMAGE ZOOM COMPONENT ---
const ZoomableImage = ({ src, alt }) => {
  const [bgPosition, setBgPosition] = useState('50% 50%');
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setBgPosition(`${x}% ${y}%`);
  };

  return (
    <div
      className="w-full h-full relative cursor-crosshair overflow-hidden"
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isZoomed ? 'opacity-0' : 'opacity-100 mix-blend-multiply'}`}
      />
      {isZoomed && (
        <div
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: bgPosition,
            backgroundSize: '200%',
          }}
        />
      )}
    </div>
  );
};

// --- PRODUCT DETAILS VIEW ---
const ProductDetailsPage = ({ product, addToCart, toggleWishlist, wishlistItems, navigateTo }) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : null);
  const [activeTab, setActiveTab] = useState('description');

  const isWishlisted = wishlistItems.some(item => item.id === product.id);

  const handleNextImage = () => {
    setActiveImageIdx(prev => (prev + 1) % product.images.length);
  }
  const handlePrevImage = () => {
    setActiveImageIdx(prev => (prev - 1 + product.images.length) % product.images.length);
  }

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [product]);

  return (
    <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white min-h-screen font-sans pb-20">
      <nav aria-label="Breadcrumb" className="bg-[#fcfbf9] py-4 px-4 md:px-12 text-[9px] md:text-[10px] text-gray-500 font-sans tracking-widest uppercase border-b border-gray-100 flex items-center gap-2">
        <span onClick={() => navigateTo('home')} className="cursor-pointer hover:text-black flex items-center gap-1"><ChevronLeft size={10} /> Home</span> /
        <span onClick={() => navigateTo('category', product.category)} className="cursor-pointer hover:text-black">{product.category}</span> /
        <span className="text-black" aria-current="page">{product.name}</span>
      </nav>

      <section className="max-w-[1400px] mx-auto px-4 md:px-12 pt-8 md:pt-16 flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="w-full lg:w-[55%] flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-2 overflow-x-auto md:w-20 snap-x">
            {product.images && product.images.map((img, idx) => (
              <div key={idx} onClick={() => setActiveImageIdx(idx)} className={`w-16 h-16 md:w-20 md:h-24 border-2 cursor-pointer transition-all shrink-0 snap-start ${activeImageIdx === idx ? 'border-[#2d2926]' : 'border-transparent hover:border-gray-200'}`}>
                <img src={img} alt={`Angle ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="flex-1 relative bg-[#f9f9f9] border border-gray-100 flex items-center justify-center min-h-[300px] md:min-h-[500px] lg:min-h-[600px] w-full group">
            {product.discount && <div className="absolute top-4 right-4 bg-[#ff5722] text-white text-xs font-bold w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-10 shadow-lg">{product.discount}</div>}

            <ZoomableImage src={product.images ? product.images[activeImageIdx] : product.img} alt={product.name} />

            <div className="md:hidden absolute bottom-4 right-4 bg-white/80 p-2 rounded-full pointer-events-none text-gray-500">
              <Maximize size={16} />
            </div>

            {product.images && product.images.length > 1 && (
              <>
                <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 p-3 rounded-full shadow-md text-[#2d2926] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"><ChevronLeft size={20} /></button>
                <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 p-3 rounded-full shadow-md text-[#2d2926] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"><ChevronRight size={20} /></button>
              </>
            )}
          </div>
        </div>

        <div className="w-full lg:w-[45%] flex flex-col pt-2 md:pt-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">{product.brand}</p>
          <h1 className="text-2xl md:text-3xl font-serif text-[#2d2926] leading-snug mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 md:gap-4 mb-6 flex-wrap">
            {product.oldPrice && <span className="text-sm md:text-base text-gray-400 line-through">Rs. {product.oldPrice.toLocaleString()} PKR</span>}
            <span className="text-xl md:text-2xl text-[#d32f2f] font-semibold tracking-wide">Rs. {product.price.toLocaleString()} PKR</span>
            {product.discount && <span className="bg-[#ff5722] text-white px-2 py-1 text-[9px] md:text-[10px] font-bold uppercase rounded-sm">Save {product.discount.replace('-', '')}</span>}
          </div>

          <div className="text-xs text-gray-600 mb-6 space-y-1 bg-gray-50 p-4 border border-gray-100 rounded-sm">
            <p><span className="font-bold uppercase tracking-widest text-[9px]">Metals Type:</span> {product.metals || 'Premium Alloy'}</p>
            <p><span className="font-bold uppercase tracking-widest text-[9px]">Chain Type:</span> Luxury Link / Cuban</p>
            <p><span className="font-bold uppercase tracking-widest text-[9px]">Width/Size:</span> {product.sizes ? product.sizes.join(' / ') : 'Standard'}</p>
          </div>

          {product.sizes && (
            <div className="mb-6 md:mb-8">
              <span className="text-[10px] font-bold text-[#2d2926] uppercase tracking-widest block mb-3">Size: <span className="font-normal text-gray-500 ml-1">{selectedSize}</span></span>
              <div className="flex gap-2 md:gap-3 flex-wrap">
                {product.sizes.map((sz, i) => (
                  <button key={i} onClick={() => setSelectedSize(sz)} className={`px-4 md:px-6 py-2 border rounded-sm text-[10px] md:text-xs transition-colors ${selectedSize === sz ? 'bg-[#2d2926] text-white border-[#2d2926]' : 'border-gray-300 text-gray-600 hover:border-[#2d2926]'}`}>
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-4 items-center mb-8">
            <div className="flex items-center border border-gray-300 rounded-sm px-4 py-3 w-full md:w-32 justify-between bg-white">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-gray-500 hover:text-black p-1"><Minus size={14} /></button>
              <span className="text-sm font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="text-gray-500 hover:text-black p-1"><Plus size={14} /></button>
            </div>

            {product.soldOut ? (
              <button disabled className="flex-1 w-full bg-gray-200 text-gray-500 py-4 rounded-sm text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase cursor-not-allowed">Sold Out</button>
            ) : (
              <button onClick={() => addToCart(product, qty)} className="flex-1 w-full bg-[#2d2926] text-white py-4 rounded-sm text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase hover:bg-black transition-colors shadow-lg">Add to Cart</button>
            )}

            <button onClick={() => toggleWishlist(product)} className={`p-3 md:p-4 rounded-sm border transition-colors ${isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-300 text-[#2d2926] hover:border-[#2d2926]'}`} title="Add to Wishlist">
              <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="flex justify-between items-center text-[9px] md:text-[11px] font-medium text-gray-500 tracking-widest uppercase mb-8 border-y border-gray-100 py-4">
            <span className="flex items-center gap-2 cursor-pointer hover:text-black"><MessageCircle size={14} /> Ask a Question</span>
            <span className="flex items-center gap-2 cursor-pointer hover:text-black"><Share2 size={14} /> Share</span>
          </div>

          <div className="text-[10px] md:text-xs text-gray-500 space-y-2">
            <p><span className="font-bold text-[#2d2926] uppercase tracking-widest">Availability:</span> {product.soldOut ? <span className="text-red-500">Out of Stock</span> : <span className="text-green-600">In Stock</span>}</p>
            <p><span className="font-bold text-[#2d2926] uppercase tracking-widest">Categories:</span> {product.category}, New Arrival, Luxury</p>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 md:px-12 mt-12 md:mt-20">
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 border-b border-gray-200 pb-2 md:pb-4 text-center">
          {['description', 'information', 'reviews'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`text-[10px] md:text-xs uppercase tracking-[0.1em] md:tracking-[0.2em] font-bold pb-4 -mb-[17px] md:-mb-[17px] transition-colors ${activeTab === tab ? 'text-[#2d2926] border-b-2 border-[#2d2926]' : 'text-gray-400 border-b-2 border-transparent hover:text-black'}`}>
              {tab} {tab === 'reviews' && `(${product.reviews ? product.reviews.length : 0})`}
            </button>
          ))}
        </div>

        <div className="py-8 md:py-12 max-w-4xl mx-auto text-center text-gray-600 leading-relaxed text-xs md:text-sm px-4">
          <AnimatePresence mode="wait">
            {activeTab === 'description' && (
              <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {product.description}
                <br /><br />
                Discover the epitome of elegance. This piece captures the true essence of LUXE GEMS's commitment to fine craftsmanship and timeless beauty. Perfect for gifting or elevating your personal collection.
              </motion.div>
            )}
            {activeTab === 'information' && (
              <motion.div key="info" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <ul className="space-y-3 inline-block text-left bg-gray-50 p-6 rounded-sm w-full md:w-auto">
                  <li className="border-b border-gray-200 pb-2"><span className="font-bold text-black uppercase text-[10px] md:text-xs mr-4">Metals Type:</span> {product.metals || 'Premium Alloy'}</li>
                  <li className="border-b border-gray-200 pb-2"><span className="font-bold text-black uppercase text-[10px] md:text-xs mr-4">Sizes Available:</span> {product.sizes ? product.sizes.join(', ') : 'Standard'}</li>
                  <li className="border-b border-gray-200 pb-2"><span className="font-bold text-black uppercase text-[10px] md:text-xs mr-4">Packaging:</span> Signature LUXE GEMS Luxury Box</li>
                  <li><span className="font-bold text-black uppercase text-[10px] md:text-xs mr-4">Warranty:</span> 1 Year Craftsmanship Warranty</li>
                </ul>
              </motion.div>
            )}
            {activeTab === 'reviews' && (
              <motion.div key="rev" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-left space-y-4 md:space-y-6">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev, i) => (
                    <div key={i} className="bg-gray-50 p-4 md:p-6 rounded-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-[#2d2926] text-sm">{rev.name}</h4>
                          <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest mt-1">{rev.date}</p>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, idx) => (
                            <Star key={idx} size={12} fill={idx < rev.rating ? "#D4AF37" : "none"} color={idx < rev.rating ? "#D4AF37" : "#ccc"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs md:text-sm italic text-gray-600">"{rev.text}"</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-[10px] md:text-xs uppercase tracking-widest text-gray-400 p-8 border border-dashed border-gray-200">No reviews yet. Be the first to review this product!</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-2xl font-serif mb-2">You may also like</h3>
        <div className="w-16 h-[1px] bg-[#2d2926] mx-auto mb-8"></div>
      </div>
    </motion.article>
  );
}

// ==========================================
// ==========================================

// ==========================================
// --- MAIN APP COMPONENT ---
export default function App() {
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [activeCategory, setActiveCategory] = useState('');
  const [activeSubCategory, setActiveSubCategory] = useState('');
  const [activeProduct, setActiveProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load Databases from API
  const [productDatabase, setProductDatabase] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    // Fetch Products
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProductDatabase(data))
      .catch(err => console.error("Error fetching products:", err));

    // Fetch Categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Error fetching categories:", err));

    // Fetch Settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        // Backend returns object directly: { key1: value1, key2: value2 }
        setSettings(data || {});
      })
      .catch(err => console.error("Error fetching settings:", err));
  }, []);

  const navigateTo = (page, category = '', product = null, subCategory = '') => {
    setCurrentPage(page);
    if (category) setActiveCategory(category);
    if (subCategory) setActiveSubCategory(subCategory); else setActiveSubCategory('');
    if (product) setActiveProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetPage = () => navigateTo('home');

  const showToast = (message) => {
    setToastMessage(message);
    setIsToastVisible(true);
  };

  const addToCart = (product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + qty } : item);
      }
      return [...prev, { ...product, quantity: qty }];
    });
    showToast(`${qty}x ${product.name} added to cart.`);
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    showToast("Item removed from cart.");
  };

  const resetCart = () => setCartItems([]);

  const toggleWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        showToast("Removed from Wishlist");
        return prev.filter(item => item.id !== product.id);
      } else {
        showToast("Saved to Wishlist!");
        return [...prev, product];
      }
    });
  }

  const removeFromWishlist = (id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
    showToast("Removed from Wishlist");
  }

  useEffect(() => {
    if (isToastVisible) {
      const timer = setTimeout(() => setIsToastVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isToastVisible]);

  const getFilteredProducts = (rawProducts) => {
    if (!searchQuery) return rawProducts;
    const lowerQuery = searchQuery.toLowerCase();
    return rawProducts.filter(p => p.name.toLowerCase().includes(lowerQuery) || p.brand.toLowerCase().includes(lowerQuery) || p.category.toLowerCase().includes(lowerQuery));
  }

  const premiumCollectionRaw = productDatabase.slice(0, 8);
  const exquisiteCollectionRaw = productDatabase.length > 8 ? productDatabase.slice(8, 16) : productDatabase.slice(0, 8);
  const bestSellingRaw = productDatabase.filter(p => !p.soldOut).slice(0, 8);

  const premiumCollection = getFilteredProducts(premiumCollectionRaw);
  const exquisiteCollection = getFilteredProducts(exquisiteCollectionRaw);
  const bestSelling = getFilteredProducts(bestSellingRaw);

  const categoryProductsRaw = productDatabase.filter(p => {
    if (p.category !== activeCategory) return false;
    if (activeSubCategory && p.subCategory !== activeSubCategory && activeSubCategory !== activeCategory) return false;
    return true;
  });
  const categoryProducts = getFilteredProducts(categoryProductsRaw);

  const getMetaDescription = () => {
    if (currentPage === 'product_details' && activeProduct) {
      return `${activeProduct.name} - ${activeProduct.description.substring(0, 150)}... Buy premium handcrafted luxury jewellery with secure delivery across Pakistan and international shipping.`;
    }
    if (currentPage === 'category' && activeCategory) {
      return `Shop the latest ${activeCategory} at LUXE GEMS. Premium handcrafted luxury jewellery, wedding collections, and bespoke designs with secure delivery in Pakistan.`;
    }
    return "LUXE GEMS - Pakistan's Premier Destination for Handcrafted Sterling Silver, Gold plated, and Luxury Jewellery. Explore exclusive Rings, Necklaces, Bracelets, and Bridal Sets.";
  }


  return (
    <HelmetProvider>
      <style>{globalStyles}</style>
      <div className="w-full bg-[#fcfbf9] overflow-x-hidden font-sans">
        {/* SEO OPTIMIZATION: HELMET TAGS */}
        <Helmet>
          <title>{currentPage === 'product_details' ? `${activeProduct?.name} | Handcrafted Luxury Jewellery Pakistan | LUXE GEMS` : currentPage === 'category' ? `${activeCategory} Collection | LUXE GEMS` : `LUXE GEMS | Premium Handmade Luxury Jewellery Brand in Pakistan`}</title>
          <meta name="description" content={getMetaDescription()} />
          <meta name="keywords" content="luxury jewelry pakistan, handmade rings, bridal jewelry sets, luxury sterling silver necklaces, gold plated earrings online, bespoke jewelry, luxe gems, artisan crafted bangles, wedding bands, jewelry store lahore" />

          {/* OpenGraph & Facebook Meta Tags */}
          <meta property="og:type" content={currentPage === 'product_details' ? 'product' : 'website'} />
          <meta property="og:title" content={currentPage === 'product_details' ? `${activeProduct?.name} | LUXE GEMS` : `LUXE GEMS | Premium Handmade Luxury Jewellery`} />
          <meta property="og:description" content={getMetaDescription()} />
          <meta property="og:image" content={currentPage === 'product_details' && activeProduct ? activeProduct.img : '/placeholder.png'} />
          <meta property="og:url" content="https://luxegems.pk" />
          <meta property="og:site_name" content="LUXE GEMS" />

          {/* Twitter Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={currentPage === 'product_details' ? `${activeProduct?.name} | LUXE GEMS` : `LUXE GEMS | Premium Handmade Luxury Jewellery`} />
          <meta name="twitter:description" content={getMetaDescription()} />
          <meta name="twitter:image" content={currentPage === 'product_details' && activeProduct ? activeProduct.img : '/placeholder.png'} />

          {/* JSON-LD Structured Data for Google Rich Results */}
          <script type="application/ld+json">
            {`
            {
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://luxegems.pk/#organization",
                  "name": "LUXE GEMS",
                  "url": "https://luxegems.pk",
                  "logo": "/placeholder.png"
                },
                {
                  "@type": "WebSite",
                  "@id": "https://luxegems.pk/#website",
                  "url": "https://luxegems.pk",
                  "name": "LUXE GEMS Official Store",
                  "publisher": {
                    "@id": "https://luxegems.pk/#organization"
                  }
                }
              ]
            }
            `}
          </script>

          {currentPage === 'product_details' && activeProduct && (
            <script type="application/ld+json">
              {`
              {
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": "${activeProduct.name}",
                "image": "${activeProduct.img}",
                "description": "${activeProduct.description}",
                "brand": {
                  "@type": "Brand",
                  "name": "LUXE GEMS"
                },
                "offers": {
                  "@type": "Offer",
                  "url": "https://luxegems.pk",
                  "priceCurrency": "PKR",
                  "price": "${activeProduct.price}",
                  "availability": "${activeProduct.soldOut ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock'}"
                }
              }
              `}
            </script>
          )}

          {/* Dynamic Breadcrumb Schema */}
          <script type="application/ld+json">
            {`
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://luxegems.pk"
                }
                ${currentPage !== 'home' ? `,
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "${currentPage === 'product_details' ? activeProduct?.category : activeCategory}",
                  "item": "https://luxegems.pk/category/${currentPage === 'product_details' ? (activeProduct?.category || '').replace(' ', '-') : (activeCategory || '').replace(' ', '-')}"
                }` : ''}
                ${currentPage === 'product_details' && activeProduct ? `,
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "${activeProduct.name}",
                  "item": "https://luxegems.pk/product/${activeProduct.id}"
                }` : ''}
              ]
            }
            `}
          </script>
        </Helmet>

        {/* TopAnnouncementBar Removed Entirely */}

        <MegaNavbar categories={categories} cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} wishlistCount={wishlistItems.length} setIsCartOpen={setIsCartOpen} setIsWishlistOpen={setIsWishlistOpen} navigateTo={navigateTo} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} updateQuantity={updateQuantity} removeFromCart={removeFromCart} resetCart={resetCart} />

        <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} wishlistItems={wishlistItems} removeFromWishlist={removeFromWishlist} addToCart={addToCart} />

        <Toast message={toastMessage} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />

        {currentPage === 'home' && (
          <main>
            <Hero navigateTo={navigateTo} categories={categories} />
            <ShopByCollection categories={categories} products={productDatabase} navigateTo={navigateTo} />
            <div className="max-w-[1600px] mx-auto py-12 px-4 md:px-12">
              <div className="text-center mb-10 w-full">
                <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-2xl md:text-4xl font-serif text-[#2d2926] relative inline-block uppercase tracking-widest">
                  <span className="hidden md:block absolute top-1/2 -left-16 w-12 h-[1px] bg-gray-300"></span>
                  Discover All Pieces
                  <span className="hidden md:block absolute top-1/2 -right-16 w-12 h-[1px] bg-gray-300"></span>
                </motion.h2>
                <p className="text-[10px] md:text-xs text-gray-400 font-sans tracking-[0.2em] mt-3 uppercase">Exquisite Craftsmanship</p>
              </div>
              <AdvancedProductGrid title="" subtitle="" products={productDatabase} addToCart={addToCart} navigateTo={navigateTo} toggleWishlist={toggleWishlist} wishlistItems={wishlistItems} hideHeader={true} showToolbar={true} />
            </div>
            {productDatabase.length > 0 && <DualBanners categories={categories} navigateTo={navigateTo} products={productDatabase} />}
            <FeatureStrip />
          </main>
        )}

        {currentPage === 'category' && (
          <main>
            <CategoryPage categoryName={activeCategory} subCategoryName={activeSubCategory} addToCart={addToCart} navigateTo={navigateTo} products={categoryProducts} toggleWishlist={toggleWishlist} wishlistItems={wishlistItems} categories={categories} productDatabase={productDatabase} />
            {categoryProducts.length > 0 && <FeatureStrip />}
          </main>
        )}

        {currentPage === 'product_details' && activeProduct && (
          <main>
            <ProductDetailsPage product={activeProduct} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlistItems={wishlistItems} navigateTo={navigateTo} />
            <div className="bg-[#fcfbf9] pt-12">
              <AdvancedProductGrid title="Recommended For You" subtitle="Customers who viewed this also liked" products={productDatabase.filter(p => p.category === activeProduct.category && p.id !== activeProduct.id).slice(0, 4)} addToCart={addToCart} navigateTo={navigateTo} toggleWishlist={toggleWishlist} wishlistItems={wishlistItems} hideHeader={false} />
            </div>
          </main>
        )}

        {currentPage === 'privacy_policy' && <PrivacyPolicy content={settings.privacy_policy || ''} />}
        {currentPage === 'refund_policy' && <RefundPolicy content={settings.refund_policy || ''} />}
        {currentPage === 'shipping_policy' && <ShippingPolicy content={settings.shipping_policy || ''} />}
        {currentPage === 'terms_service' && <TermsService content={settings.terms_service || ''} />}
        {currentPage === 'faqs' && <Faqs content={settings.faqs || ''} />}
        {currentPage === 'about_us' && <AboutUs content={settings.about_us || ''} />}
        {currentPage === 'size_chart' && <SizeChart content={settings.size_chart || ''} />}
        {currentPage === 'box_care' && <BoxCare content={settings.box_care || ''} />}

        <MegaFooter navigateTo={navigateTo} resetPage={resetPage} />
      </div>
    </HelmetProvider>
  );
}