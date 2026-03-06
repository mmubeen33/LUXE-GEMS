import fs from 'fs';

const code = fs.readFileSync('d:/WORK/PROJECT WEBSITES/Landing_pages/LUXE-GEMS/LUXE-GEMS/frontend/src/App.js', 'utf8');

const lines = code.split('\n');
const adminStartIndex = lines.findIndex(l => l.includes('// --- SECRET ADMIN SYSTEM COMPONENTS ---'));
const adminEndIndex = lines.findIndex(l => l.includes('// --- MAIN APP COMPONENT ---'));

const adminCode = lines.slice(adminStartIndex, adminEndIndex).join('\n');

const newAppJsx = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Edit, ShoppingBag, Trash2, Plus, Star, CheckCircle, Save, Grid, SlidersHorizontal, LogOut } from 'lucide-react';

const getCatName = (c) => typeof c === 'string' ? c : c?.category;

${adminCode}

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
`;

fs.writeFileSync('d:/WORK/PROJECT WEBSITES/Landing_pages/LUXE-GEMS/LUXE-GEMS/admin_panel/src/App.jsx', newAppJsx);
