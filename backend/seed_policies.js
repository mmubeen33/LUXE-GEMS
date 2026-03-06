const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const policies = [
  {
    key: 'about_us',
    value: `
      <div style="text-align: center;">
        <h2 style="color: #8a7322;">Crafting Trust, One Karat at a Time</h2>
        <p>Welcome to [Your Brand Name], where the timeless elegance of gold meets modern-day reliability. Based in the heart of Pakistan, we are more than just an online jewelry store; we are your trusted partners in precious metal investments and artisanal craftsmanship.</p>
        <hr />
        <h3>Our Story</h3>
        <p>The journey of [Your Brand Name] began with a simple realization: buying gold should be as transparent as the shine of the metal itself. In an industry often clouded by hidden charges and uncertain purity, we set out to build a platform where every Pakistani can invest in gold with 100% confidence. From delicate bridal sets to 24K investment bars, we bring the bazaar's finest quality directly to your digital screen.</p>
        <hr />
        <h3>Our Mission</h3>
        <p>Our mission is to democratize gold ownership. We want to make gold accessible, affordable, and safe for everyone—whether you are a groom looking for the perfect wedding band, a mother saving for her daughter's future, or an investor looking to hedge against inflation.</p>
        <hr />
        <h3>Why Choose Us?</h3>
        <p>In the world of gold, reputation is everything. We have built ours on three unbreakable pillars:</p>
        <ul>
          <li><strong>Uncompromising Purity:</strong> Every piece we sell is hallmarked and accompanied by a Certificate of Authenticity. Whether it is 21K, 22K, or 24K, what you see on the certificate is exactly what you hold in your hand.</li>
          <li><strong>Transparent Pricing:</strong> We believe in fair trade. Our prices are synced with the Live International Gold Market, ensuring you get the most value for your money without any hidden markups.</li>
          <li><strong>Security Beyond Borders:</strong> We are pioneers in Insured Gold Shipping. We understand the anxiety of ordering high-value items online, which is why we take full responsibility for your package until it is safely signed for by you.</li>
        </ul>
        <hr />
        <h3>The [Your Brand Name] Promise</h3>
        <p>When you choose us, you aren’t just a customer; you become part of a legacy. We promise a shopping experience that is:</p>
        <ul>
            <li><strong>Human-Centric:</strong> Real people helping you make real decisions.</li>
            <li><strong>Secure:</strong> Encrypted transactions and verified deliveries.</li>
            <li><strong>Exceptional:</strong> Designs that turn heads and quality that lasts generations.</li>
        </ul>
      </div>
    `
  },
  {
    key: 'shipping_policy',
    value: `
      <h2>Shipping Policy</h2>
      <p><strong>Secure, Insured, and Discreet.</strong></p>
      <p>Delivering gold requires more than just a courier; it requires a fortress on wheels. We ensure your investment is protected from our vault to yours.</p>
      <ul>
        <li><strong>100% Insured Shipping:</strong> Every shipment from our store is fully insured. In the rare event of loss or theft during transit, we take full responsibility, ensuring you never lose your investment.</li>
        <li><strong>Discreet Packaging:</strong> To maintain maximum security, our packaging is neutral and gives no indication of the valuable contents inside. This prevents unwanted attention during the delivery process.</li>
        <li><strong>Mandatory Verification:</strong> For security reasons, the courier will only hand over the parcel to the person named on the invoice. A valid government-issued ID card and a signature are required upon delivery.</li>
        <li><strong>Estimated Delivery:</strong> We typically dispatch orders within 24 hours. Standard delivery takes 2-4 working days depending on your location.</li>
      </ul>
    `
  },
  {
    key: 'refund_policy',
    value: `
      <h2>Refund Policy</h2>
      <p><strong>Transparency in Every Transaction.</strong></p>
      <p>Due to the volatile nature of the gold market, our refund policy is designed to be fair to both the buyer and the seller.</p>
      <ul>
        <li><strong>Damaged or Incorrect Items:</strong> If you receive a product that is damaged or differs from your order, we offer a Full Refund or a free replacement. To claim this, a clear unboxing video recorded at the time of delivery is mandatory to verify the claim.</li>
        <li><strong>Change of Mind:</strong> If you wish to return a product for personal reasons, a Buy-Back Deduction (2% to 5%) will apply to cover administrative, insurance, and safe-keeping costs.</li>
        <li><strong>Refund Processing:</strong> Once the gold is received and its purity is verified by our lab, your refund will be processed back to your original payment method within 7-10 business days.</li>
        <li><strong>Exclusions:</strong> Custom-made or personalized jewelry pieces are not eligible for refunds unless there is a manufacturing defect.</li>
      </ul>
      <h2>Exchange Policy</h2>
      <p><strong>A Flexible Approach to Fine Jewelry.</strong></p>
      <p>Gold is timeless, but your style may evolve. We offer a transparent exchange process to help you find the perfect piece.</p>
      <ul>
        <li><strong>Eligibility Period:</strong> Exchange requests must be initiated within 48 hours of receiving your order.</li>
        <li><strong>Product Condition:</strong> To qualify for an exchange, the item must be in its original, unworn, and pristine condition. Items showing signs of wear, scratches, or alterations will not be accepted.</li>
        <li><strong>The Gold Rate Factor:</strong> Since gold prices fluctuate daily, the exchange value will be calculated based on the Current Market Rate at the time of the exchange.</li>
        <li><strong>Valuation:</strong> Please note that making charges (labor costs), taxes, and any stones/gems embedded in the jewelry are non-refundable and will be deducted during the exchange valuation.</li>
      </ul>
    `
  },
  {
    key: 'terms_service',
    value: `
      <h2>Terms of Service</h2>
      <p><strong>The Rules of Engagement.</strong></p>
      <p>By using our website, you agree to the following professional standards:</p>
      <ul>
        <li><strong>Market Price Volatility:</strong> Gold prices are tied to international markets and change in real-time. The price displayed at the moment of "Checkout" is the final price, regardless of market movements after the order is placed.</li>
        <li><strong>Order Verification:</strong> Given the high value of our products, we reserve the right to call and verify orders before processing. Any unverified or suspicious orders may be cancelled at our discretion.</li>
        <li><strong>Purity Guarantee:</strong> We stand behind the quality of our gold. Every piece is accompanied by a Certificate of Authenticity specifying its weight and karat (e.g., 21K, 22K, or 24K).</li>
        <li><strong>Legal Compliance:</strong> All transactions are subject to local laws. By purchasing, you confirm that the funds used are legitimate and that you are at least 18 years of age.</li>
      </ul>
    `
  },
  {
    key: 'privacy_policy',
    value: `
      <h2>Privacy Policy</h2>
      <p><strong>Your Trust is Our Greatest Asset.</strong></p>
      <p>At [Your Brand Name], we understand that buying gold is a significant investment based on trust. This Privacy Policy outlines how we handle your personal data with the highest level of integrity and security.</p>
      <ul>
        <li><strong>Information We Collect:</strong> To process your high-value orders, we collect essential details such as your full name, verified billing and shipping addresses, contact number, and email. For large transactions, we may request identity verification to comply with anti-money laundering regulations.</li>
        <li><strong>Data Protection & Encryption:</strong> We utilize industry-standard SSL (Secure Socket Layer) encryption. Your sensitive payment information is never stored on our local servers; instead, it is processed through world-class, secure payment gateways.</li>
        <li><strong>Zero-Third-Party Sharing:</strong> We respect your boundaries. Your personal data is never sold, traded, or shared with third-party marketing firms. It is only shared with our trusted logistics partners to ensure your gold reaches your doorstep.</li>
        <li><strong>Cookie Policy:</strong> We use cookies to enhance your browsing experience, remember your preferences, and analyze website traffic to improve our service for you.</li>
      </ul>
    `
  },
  {
    key: 'faqs',
    value: JSON.stringify([
      {
        section: 'Purity, Pricing & Verification',
        items: [
          { q: 'How can I be sure about the purity of the gold I buy from [Your Brand Name]?', a: 'We understand that purity is your biggest concern. Every single piece of jewelry or gold bar we sell comes with an official Certificate of Authenticity. We deal exclusively in hallmarked gold (21K, 22K, and 24K). Our products undergo rigorous lab testing to ensure they meet international fineness standards. When you buy from us, you aren’t just buying gold; you’re buying a lifetime guarantee of quality.' },
          { q: 'Does the price of gold change after I add it to my cart?', a: 'The gold market is dynamic and changes by the minute. To be fair to our customers, the price is locked the moment you click "Checkout." Even if the international market rate goes up or down while your order is being processed, the price you saw at the time of purchase is exactly what you will pay. No hidden surprises, just transparent pricing.' },
          { q: 'Can I verify the weight and purity at a local jeweler?', a: 'Absolutely! We encourage transparency. You are more than welcome to take our products to any certified laboratory or reputable jeweler for a weight and purity check. Our measurements are precise down to the milligram, ensuring you get exactly what you paid for.' }
        ]
      },
      {
        section: 'Shipping, Safety & Returns (The "Peace of Mind")',
        items: [
          { q: 'Is it safe to order gold online? What if the package gets lost?', a: 'We take the "risk" out of the equation. Every shipment is 100% Insured and packed in "tamper-evident," discreet packaging that gives no hint of the valuable contents inside. In the highly unlikely event that a parcel is lost or damaged during transit, [Your Brand Name] takes full responsibility. We will either ship a replacement or provide a full refund. Your investment is safe with us from our vault to your door.' },
          { q: 'What is your "Buy-Back" or Exchange policy for old gold?', a: 'We believe in building long-term relationships. If you wish to exchange a piece bought from us for a new design, we offer a competitive Exchange Value based on the current day\'s market rate. For cash refunds (Buy-Back), a small administrative deduction (usually 2-5%) is applied to the gold value. Please note that making charges and taxes are non-refundable as they represent the labor and government levies already paid.' },
          { q: 'Do I need to show my ID to receive the order?', a: 'Yes. Because we are dealing with high-value assets, our courier partners are instructed to deliver the package only to the person named on the invoice. You will be required to show a valid Government-issued ID (like a CNIC or Passport) and provide a signature. This ensures that your gold never falls into the wrong hands.' }
        ]
      }
    ])
  }
];

db.serialize(() => {
  const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  policies.forEach(policy => {
    stmt.run(policy.key, policy.value);
  });
  stmt.finalize(() => {
    console.log("Policies and FAQs seeded successfully!");
    db.close();
  });
});
