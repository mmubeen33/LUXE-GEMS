const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');

    // Enable foreign keys
    db.run(`PRAGMA foreign_keys = ON;`);

    // Create Categories Table
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        name TEXT PRIMARY KEY,
        image TEXT
      )
    `, (err) => {
      if (!err) {
        // Safely add image column to existing databases if it doesn't exist yet
        db.run(`ALTER TABLE categories ADD COLUMN image TEXT`, (alterErr) => {
          // Ignore error if column already exists
        });
      }
    });

    // Create Subcategories Table
    db.run(`
      CREATE TABLE IF NOT EXISTS subcategories (
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        PRIMARY KEY (name, category),
        FOREIGN KEY (category) REFERENCES categories(name) ON UPDATE CASCADE ON DELETE CASCADE
      )
    `);

    // Create Products Table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        oldPrice INTEGER,
        discount TEXT,
        category TEXT NOT NULL,
        soldOut BOOLEAN DEFAULT 0,
        brand TEXT DEFAULT 'LUXE GEMS',
        img TEXT NOT NULL,
        images TEXT NOT NULL, -- Stored as JSON string
        sizes TEXT, -- Stored as JSON string
        description TEXT,
        subCategory TEXT,
        FOREIGN KEY (category) REFERENCES categories(name) ON UPDATE CASCADE
      )
    `, (err) => {
      if (!err) {
        // Safely add subCategory column to existing databases if it doesn't exist yet
        db.run(`ALTER TABLE products ADD COLUMN subCategory TEXT`, (alterErr) => {
          // Ignore error if column already exists
        });
      }
    });

    // Create Orders Table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customerName TEXT NOT NULL,
        customerPhone TEXT NOT NULL,
        customerCity TEXT,
        items TEXT NOT NULL, -- Stored as JSON string
        total INTEGER NOT NULL,
        status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled')),
        date TEXT NOT NULL
      )
    `);

    // Create Settings Table
    db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `, (err) => {
      if (!err) {
        // Initialize default settings if empty
        db.get("SELECT count(*) AS count FROM settings", (err, row) => {
          if (row && row.count === 0) {
            const defaultSettings = [
              ['whatsapp_number', '923251221401'],
              ['shipping_policy', '<h3 style="color: #2d2926; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.5rem;">Secure, Insured, and Discreet</h3><p>Delivering gold requires more than just a courier; it requires a fortress on wheels. We ensure your investment is protected from our vault to yours.</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1rem;">100% Insured Shipping</h4><p>Every shipment from our store is fully insured. In the rare event of loss or theft during transit, we take full responsibility, ensuring you never lose your investment.</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1rem;">Discreet Packaging</h4><p>To maintain maximum security, our packaging is neutral and gives no indication of the valuable contents inside. This prevents unwanted attention during the delivery process.</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1rem;">Mandatory Verification</h4><p>For security reasons, the courier will only hand over the parcel to the person named on the invoice. A valid government-issued ID card and a signature are required upon delivery.</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1rem;">Estimated Delivery</h4><p>We typically dispatch orders within 24 hours. Standard delivery takes 2-4 working days depending on your location.</p>'],
              ['refund_policy', '<h3 style="color: #2d2926; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.5rem;">Transparency in Every Transaction</h3><p>Due to the volatile nature of the gold market, our refund policy is designed to be fair to both the buyer and the seller.</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1rem;">Damaged or Incorrect Items</h4><p>If you receive a product that is damaged or differs from your order, we offer a Full Refund or a free replacement. To claim this, a clear unboxing video recorded at the time of delivery is mandatory to verify the claim.</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1rem;">Change of Mind</h4><p>If you wish to return a product for personal reasons, a Buy-Back Deduction (2% to 5%) will apply to cover administrative, insurance, and safe-keeping costs.</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1rem;">Refund Processing</h4><p>Once the gold is received and its purity is verified by our lab, your refund will be processed back to your original payment method within 7-10 business days.</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1rem;">Exclusions</h4><p>Custom-made or personalized jewelry pieces are not eligible for refunds unless there is a manufacturing defect.</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1rem;">Exchange Policy - A Flexible Approach</h4><p>Gold is timeless, but your style may evolve. We offer a transparent exchange process to help you find the perfect piece.</p><ul style="margin: 1rem 0; padding-left: 1.5rem;"><li><strong>Eligibility Period:</strong> Exchange requests must be initiated within 48 hours of receiving your order.</li><li><strong>Product Condition:</strong> To qualify for an exchange, the item must be in its original, unworn, and pristine condition. Items showing signs of wear, scratches, or alterations will not be accepted.</li><li><strong>The Gold Rate Factor:</strong> Since gold prices fluctuate daily, the exchange value will be calculated based on the Current Market Rate at the time of the exchange.</li><li><strong>Valuation:</strong> Please note that making charges (labor costs), taxes, and any stones/gems embedded in the jewelry are non-refundable and will be deducted during the exchange valuation.</li></ul>'],
              ['privacy_policy', '<h3 style="color: #2d2926; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.5rem;">Your Trust is Our Greatest Asset</h3><p>We understand that buying gold is a significant investment based on trust. This Privacy Policy outlines how we handle your personal data with the highest level of integrity and security.</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1rem;">Information We Collect</h4><p>To process your high-value orders, we collect essential details such as your full name, verified billing and shipping addresses, contact number, and email. For large transactions, we may request identity verification to comply with anti-money laundering regulations.</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1rem;">Data Protection & Encryption</h4><p>We utilize industry-standard SSL (Secure Socket Layer) encryption. Your sensitive payment information is never stored on our local servers; instead, it is processed through world-class, secure payment gateways.</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1rem;">Zero-Third-Party Sharing</h4><p>We respect your boundaries. Your personal data is never sold, traded, or shared with third-party marketing firms. It is only shared with our trusted logistics partners to ensure your gold reaches your doorstep.</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1rem;">Cookie Policy</h4><p>We use cookies to enhance your browsing experience, remember your preferences, and analyze website traffic to improve our service for you.</p>'],
              ['terms_service', '<h3 style="color: #2d2926; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.5rem;">The Rules of Engagement</h3><p>By using our website, you agree to the following professional standards:</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1rem;">Market Price Volatility</h4><p>Gold prices are tied to international markets and change in real-time. The price displayed at the moment of "Checkout" is the final price, regardless of market movements after the order is placed.</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1rem;">Order Verification</h4><p>Given the high value of our products, we reserve the right to call and verify orders before processing. Any unverified or suspicious orders may be cancelled at our discretion.</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1rem;">Purity Guarantee</h4><p>We stand behind the quality of our gold. Every piece is accompanied by a Certificate of Authenticity specifying its weight and karat (e.g., 21K, 22K, or 24K).</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1rem;">Legal Compliance</h4><p>All transactions are subject to local laws. By purchasing, you confirm that the funds used are legitimate and that you are at least 18 years of age.</p>'],
              ['announcement_text', 'Free nationwide shipping on orders over 10,000 PKR!'],
              ['announcement_active', 'false'],
              ['about_us', '<h3 style="color: #2d2926; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.5rem;">Crafting Trust, One Karat at a Time</h3><p>Welcome to <strong>LUXE GEMS</strong>, where the timeless elegance of gold meets modern-day reliability. Based in the heart of Pakistan, we are more than just an online jewelry store; we are your trusted partners in precious metal investments and artisanal craftsmanship.</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1.5rem;">Our Story</h4><p>The journey of LUXE GEMS began with a simple realization: buying gold should be as transparent as the shine of the metal itself. In an industry often clouded by hidden charges and uncertain purity, we set out to build a platform where every Pakistani can invest in gold with 100% confidence. From delicate bridal sets to 24K investment bars, we bring the bazaar\'s finest quality directly to your digital screen.</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1.5rem;">Our Mission</h4><p>Our mission is to democratize gold ownership. We want to make gold accessible, affordable, and safe for everyone—whether you are a groom looking for the perfect wedding band, a mother saving for her daughter\'s future, or an investor looking to hedge against inflation.</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1.5rem;">Why Choose Us?</h4><p>In the world of gold, reputation is everything. We have built ours on three unbreakable pillars:</p><ul style="margin: 1rem 0; padding-left: 1.5rem;"><li><strong>Uncompromising Purity:</strong> Every piece we sell is hallmarked and accompanied by a Certificate of Authenticity. Whether it is 21K, 22K, or 24K, what you see on the certificate is exactly what you hold in your hand.</li><li><strong>Transparent Pricing:</strong> We believe in fair trade. Our prices are synced with the Live International Gold Market, ensuring you get the most value for your money without any hidden markups.</li><li><strong>Security Beyond Borders:</strong> We are pioneers in Insured Gold Shipping. We understand the anxiety of ordering high-value items online, which is why we take full responsibility for your package until it is safely signed for by you.</li></ul><h4 style="color: #2d2926; font-weight: bold; margin-top: 1.5rem;">The LUXE GEMS Promise</h4><p>When you choose us, you aren\'t just a customer; you become part of a legacy. We promise a shopping experience that is: <strong>Human-Centric</strong>, <strong>Secure</strong>, and <strong>Exceptional</strong>. Real people helping you make real decisions, encrypted transactions with verified deliveries, and designs that turn heads with quality that lasts generations.</p>'],
              ['size_chart', '<p style="margin-bottom: 1rem;">Please refer to our standard ring and necklace sizing guides. For custom sizing or specific measurements, please contact us at info@luxegems.com or call +92 346 5003258</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1rem;">Ring Sizing Guide</h4><p>Measure your existing ring or visit a local jeweler for accurate sizing. Sizes typically range from 5 to 12.</p><h4 style="color: #2d2926; font-weight: bold; margin-top: 1rem;">Necklace Length Guide</h4><p>Standard necklace lengths: Choker (16"), Princess (18"), Matinee (20-24"), Opera (28-34"). Contact us for custom lengths.</p>'],
              ['box_care', '<h4 style="color: #2d2926; font-weight: bold; margin-top: 1rem;">Care Instructions for Your LUXE GEMS</h4><p>Your jewelry is crafted to last a lifetime. Here\'s how to keep it looking pristine:</p><ul style="margin: 1rem 0; padding-left: 1.5rem;"><li><strong>Storage:</strong> Keep your jewelry in the provided LUXE GEMS box away from moisture, sunlight, and extreme temperatures.</li><li><strong>Cleaning:</strong> Gently clean with a soft, dry cloth. For deep cleaning, use warm water with mild soap and a soft brush.</li><li><strong>Avoid Contact:</strong> Remove jewelry before swimming, bathing, or exercising to prevent damage and discoloration.</li><li><strong>Professional Care:</strong> For intricate pieces or gemstone jewelry, professional cleaning every 6-12 months is recommended.</li><li><strong>Insurance:</strong> We recommend insuring your valuable pieces. Keep your Certificate of Authenticity in a safe place.</li></ul>'],
              ['faqs', JSON.stringify([
                {
                  section: 'Gold Quality & Authenticity',
                  items: [
                    {
                      q: 'How can I be sure about the purity of the gold I buy from LUXE GEMS?',
                      a: 'We understand that purity is your biggest concern. Every single piece of jewelry or gold bar we sell comes with an official Certificate of Authenticity. We deal exclusively in hallmarked gold (21K, 22K, and 24K). Our products undergo rigorous lab testing to ensure they meet international fineness standards. When you buy from us, you aren\'t just buying gold; you\'re buying a lifetime guarantee of quality.'
                    },
                    {
                      q: 'Does the price of gold change after I add it to my cart?',
                      a: 'The gold market is dynamic and changes by the minute. To be fair to our customers, the price is locked the moment you click "Checkout." Even if the international market rate goes up or down while your order is being processed, the price you saw at the time of purchase is exactly what you will pay. No hidden surprises, just transparent pricing.'
                    },
                    {
                      q: 'Can I verify the weight and purity at a local jeweler?',
                      a: 'Absolutely! We encourage transparency. You are more than welcome to take our products to any certified laboratory or reputable jeweler for a weight and purity check. Our measurements are precise down to the milligram, ensuring you get exactly what you paid for.'
                    }
                  ]
                },
                {
                  section: 'Shipping, Safety & Returns',
                  items: [
                    {
                      q: 'Is it safe to order gold online? What if the package gets lost?',
                      a: 'We take the "risk" out of the equation. Every shipment is 100% Insured and packed in "tamper-evident," discreet packaging that gives no hint of the valuable contents inside. In the highly unlikely event that a parcel is lost or damaged during transit, LUXE GEMS takes full responsibility. We will either ship a replacement or provide a full refund. Your investment is safe with us from our vault to your door.'
                    },
                    {
                      q: 'What is your Exchange or Buy-Back policy for old gold?',
                      a: 'We believe in building long-term relationships. If you wish to exchange a piece bought from us for a new design, we offer a competitive Exchange Value based on the current day\'s market rate. For cash refunds (Buy-Back), a small administrative deduction (usually 2-5%) is applied to the gold value. Please note that making charges and taxes are non-refundable as they represent the labor and government levies already paid.'
                    },
                    {
                      q: 'Do I need to show my ID to receive the order?',
                      a: 'Yes. Because we are dealing with high-value assets, our courier partners are instructed to deliver the package only to the person named on the invoice. You will be required to show a valid Government-issued ID (like a CNIC or Passport) and provide a signature. This ensures that your gold never falls into the wrong hands.'
                    }
                  ]
                }
              ])]
            ];

            // Add Master Password for Admin Panel
            defaultSettings.push(['admin_password', '123']);

            const insertStmt = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
            defaultSettings.forEach(setting => insertStmt.run(setting[0], setting[1]));
            insertStmt.finalize();
          }
        });
      }
    });

    // Check if initial categories exist, if not insert some defaults
    db.get("SELECT count(*) AS count FROM categories", (err, row) => {
      if (row && row.count === 0) {
        const defaultCats = ["Women's Collections", "Men's Collections", "Luxury Earrings", "Luxury Necklaces", "Rings"];
        const insertStmt = db.prepare("INSERT INTO categories (name) VALUES (?)");
        defaultCats.forEach(cat => insertStmt.run(cat));
        insertStmt.finalize();
        console.log("Initialized default categories.");
      }
    });
  }
});

module.exports = db;
