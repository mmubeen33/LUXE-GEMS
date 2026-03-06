const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static React files implicitly by CRA proxy but we must static serve uploads
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}
app.use('/uploads', express.static(uploadPath));

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `prod-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// --- Image Upload API ---
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Remove public prefix as React CRA handles public files from root /
    res.json({ url: `/uploads/${req.file.filename}` });
});

// --- Categories API ---

// Get all categories
// Get all categories and their subcategories
app.get('/api/categories', (req, res) => {
    db.all("SELECT name, image FROM categories", [], (err, categories) => {
        if (err) return res.status(500).json({ error: err.message });

        db.all("SELECT name, category FROM subcategories", [], (err, subcategories) => {
            if (err) return res.status(500).json({ error: err.message });

            const result = categories.map(cat => ({
                category: cat.name,
                image: cat.image,
                subcategories: subcategories.filter(sub => sub.category === cat.name).map(sub => sub.name)
            }));
            res.json(result);
        });
    });
});

// Add a category
app.post('/api/categories', (req, res) => {
    const { name, image } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    db.run("INSERT INTO categories (name, image) VALUES (?, ?)", [name, image || null], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ success: true, name, image });
    });
});

// Update a category name
app.put('/api/categories/:oldName', (req, res) => {
    const oldName = decodeURIComponent(req.params.oldName);
    const { newName, image } = req.body;
    if (!newName) return res.status(400).json({ error: 'New name is required' });

    db.run("UPDATE categories SET name = ?, image = ? WHERE name = ?", [newName, image || null, oldName], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Delete a category
app.delete('/api/categories/:name', (req, res) => {
    const name = decodeURIComponent(req.params.name);
    db.run("DELETE FROM categories WHERE name = ?", [name], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// --- Subcategories API ---

// Add a subcategory
app.post('/api/subcategories', (req, res) => {
    const { name, category } = req.body;
    if (!name || !category) return res.status(400).json({ error: 'Name and parent category are required' });
    db.run("INSERT INTO subcategories (name, category) VALUES (?, ?)", [name, category], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ success: true, name, category });
    });
});

// Delete a subcategory
app.delete('/api/subcategories/:category/:name', (req, res) => {
    const category = decodeURIComponent(req.params.category);
    const name = decodeURIComponent(req.params.name);
    db.run("DELETE FROM subcategories WHERE name = ? AND category = ?", [name, category], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// --- Products API ---

// Get all products
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        try {
            // Parse JSON strings back to arrays safely
            const products = rows.map(row => {
                let parsedImages = [];
                let parsedSizes = null;

                try { parsedImages = typeof row.images === 'string' ? JSON.parse(row.images) : row.images; } catch (e) { }
                try { parsedSizes = row.sizes && typeof row.sizes === 'string' ? JSON.parse(row.sizes) : row.sizes; } catch (e) { }

                return {
                    ...row,
                    images: parsedImages || [],
                    sizes: parsedSizes,
                    soldOut: row.soldOut === 1
                };
            });
            res.json(products);
        } catch (parseError) {
            console.error("Data parse error:", parseError);
            res.status(500).json({ error: "Failed to parse product data" });
        }
    });
});

// Add a product
app.post('/api/products', (req, res) => {
    const product = req.body;
    const values = [
        product.id,
        product.name,
        product.price,
        product.oldPrice || null,
        product.discount || null,
        product.category,
        product.soldOut ? 1 : 0,
        product.brand || 'LUXE GEMS',
        product.img,
        JSON.stringify(product.images || []),
        product.sizes ? JSON.stringify(product.sizes) : null,
        product.description || '',
        product.subCategory || null
    ];

    const stmt = `
    INSERT INTO products (
      id, name, price, oldPrice, discount, category, soldOut, brand, img, images, size, description, subCategory
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    db.run(stmt, values, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ success: true, id: product.id });
    });
});

// Update a product
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const product = req.body;

    const values = [
        product.name,
        product.price,
        product.oldPrice || null,
        product.discount || null,
        product.category,
        product.soldOut ? 1 : 0,
        product.brand || 'LUXE GEMS',
        product.img,
        JSON.stringify(product.images || []),
        product.sizes ? JSON.stringify(product.sizes) : null,
        product.description || '',
        product.subCategory || null,
        id
    ];

    const stmt = `
    UPDATE products SET
      name = ?, price = ?, oldPrice = ?, discount = ?, category = ?, soldOut = ?, 
      brand = ?, img = ?, images = ?, size = ?, description = ?, subCategory = ?
    WHERE id = ?
  `;

    db.run(stmt, values, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// --- Orders API ---

// Get all orders
app.get('/api/orders', (req, res) => {
    db.all("SELECT * FROM orders ORDER BY date DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        try {
            const orders = rows.map(row => ({
                ...row,
                items: JSON.parse(row.items)
            }));
            res.json(orders);
        } catch (e) {
            res.status(500).json({ error: "Failed to parse orders" });
        }
    });
});

// Create a new order
app.post('/api/orders', (req, res) => {
    const { customerName, customerPhone, customerCity, items, total, date } = req.body;

    // Fetch the total count to generate the next sequential ID
    db.get("SELECT COUNT(*) as count FROM orders", [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });

        // Start counting from 0 (e.g ORD-000) or 1 (e.g ORD-001) depending on row count
        const nextNumber = row.count;
        const formattedNumber = nextNumber.toString().padStart(3, '0'); // '000', '001', '010'
        const sequentialId = `ORD-${formattedNumber}`;

        const stmt = `
            INSERT INTO orders (id, customerName, customerPhone, customerCity, items, total, status, date)
            VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?)
        `;
        const values = [sequentialId, customerName, customerPhone, customerCity, JSON.stringify(items), total, date];

        db.run(stmt, values, function (insertErr) {
            if (insertErr) return res.status(500).json({ error: insertErr.message });
            res.status(201).json({ success: true, id: sequentialId });
        });
    });
});

// Update order status
app.put('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    db.run("UPDATE orders SET status = ? WHERE id = ?", [status, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Delete order
app.delete('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM orders WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// --- Settings API ---

// Get all settings as key-value pairs
app.get('/api/settings', (req, res) => {
    db.all("SELECT key, value FROM settings", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const settings = {};
        rows.forEach(row => { settings[row.key] = row.value; });
        res.json(settings);
    });
});

// Update multiple settings at once
app.put('/api/settings', (req, res) => {
    const settings = req.body; // Expects object: { key1: 'val1', key2: 'val2' }

    // Begin transaction for safe multi-update
    db.run("BEGIN TRANSACTION");
    const stmt = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?");

    let hasError = false;
    for (const [key, value] of Object.entries(settings)) {
        stmt.run(key, value, value, (err) => {
            if (err) hasError = true;
        });
    }

    stmt.finalize((err) => {
        if (err || hasError) {
            db.run("ROLLBACK");
            return res.status(500).json({ error: 'Failed to update settings' });
        }
        db.run("COMMIT");
        res.json({ success: true });
    });
});

// --- Backup & Restore API ---

// GET /api/backup — download entire DB as a JSON file
app.get('/api/backup', (req, res) => {
    const queries = {
        categories: "SELECT * FROM categories",
        subcategories: "SELECT * FROM subcategories",
        products: "SELECT * FROM products",
        orders: "SELECT * FROM orders",
        settings: "SELECT * FROM settings"
    };

    const backup = {};
    let completed = 0;
    const total = Object.keys(queries).length;

    for (const [table, query] of Object.entries(queries)) {
        db.all(query, [], (err, rows) => {
            if (err) {
                backup[table] = [];
            } else {
                // Parse JSON fields in products and orders
                backup[table] = rows.map(row => {
                    if (table === 'products') {
                        return { ...row, images: tryParse(row.images), sizes: tryParse(row.sizes) };
                    }
                    if (table === 'orders') {
                        return { ...row, items: tryParse(row.items) };
                    }
                    return row;
                });
            }
            completed++;
            if (completed === total) {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
                const filename = `luxe-gems-backup-${timestamp}.json`;
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                res.setHeader('Content-Type', 'application/json');
                res.json({ backupVersion: 1, createdAt: new Date().toISOString(), ...backup });
            }
        });
    }
});

function tryParse(val) {
    try { return JSON.parse(val); } catch { return val; }
}

// POST /api/restore — restore DB from uploaded backup JSON (sent in request body)
app.post('/api/restore', (req, res) => {
    const { categories, subcategories, products, orders, settings } = req.body;

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        // Clear all tables
        db.run("DELETE FROM orders");
        db.run("DELETE FROM products");
        db.run("DELETE FROM subcategories");
        db.run("DELETE FROM categories");
        db.run("DELETE FROM settings");

        // Restore categories
        if (categories && Array.isArray(categories)) {
            const stmt = db.prepare("INSERT OR IGNORE INTO categories (name, image) VALUES (?, ?)");
            categories.forEach(c => stmt.run(c.name, c.image || null));
            stmt.finalize();
        }

        // Restore subcategories
        if (subcategories && Array.isArray(subcategories)) {
            const stmt = db.prepare("INSERT OR IGNORE INTO subcategories (name, category) VALUES (?, ?)");
            subcategories.forEach(s => stmt.run(s.name, s.category));
            stmt.finalize();
        }

        // Restore products
        if (products && Array.isArray(products)) {
            const stmt = db.prepare(`INSERT OR IGNORE INTO products (id, name, price, oldPrice, discount, category, soldOut, brand, img, images, size, description, subCategory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
            products.forEach(p => stmt.run(
                p.id, p.name, p.price, p.oldPrice, p.discount, p.category,
                p.soldOut ? 1 : 0, p.brand, p.img,
                JSON.stringify(p.images || []),
                JSON.stringify(p.sizes || p.size || []),
                p.description, p.subCategory
            ));
            stmt.finalize();
        }

        // Restore orders
        if (orders && Array.isArray(orders)) {
            const stmt = db.prepare(`INSERT OR IGNORE INTO orders (id, customerName, customerPhone, customerCity, items, total, status, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
            orders.forEach(o => stmt.run(
                o.id, o.customerName, o.customerPhone, o.customerCity,
                JSON.stringify(o.items || []), o.total, o.status || 'Pending', o.date
            ));
            stmt.finalize();
        }

        // Restore settings
        if (settings && Array.isArray(settings)) {
            const stmt = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?");
            settings.forEach(s => stmt.run(s.key, s.value, s.value));
            stmt.finalize();
        }

        db.run("COMMIT", (err) => {
            if (err) return res.status(500).json({ error: 'Restore failed: ' + err.message });
            res.json({ success: true, message: 'Database restored successfully!' });
        });
    });
});

// Serve Admin Panel
const adminPath = path.join(__dirname, '../admin_panel/dist');
app.use('/admin', express.static(adminPath));
app.get('/admin/{*path}', (req, res) => {
    res.sendFile(path.join(adminPath, 'index.html'));
});

// Serve Frontend Store
const storePath = path.join(__dirname, '../frontend/build');
app.use(express.static(storePath));
app.get('{*path}', (req, res) => {
    res.sendFile(path.join(storePath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Backend Server is running on http://localhost:${PORT}`);
});
