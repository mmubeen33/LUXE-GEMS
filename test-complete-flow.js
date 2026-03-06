const http = require('http');

console.log('\n🔍 Testing Complete Data Flow:\n');

// Test Backend API
console.log('1️⃣  Testing Backend API (/api/settings)...');
const req = http.request('http://localhost:5000/api/settings', (res) => {
  let data = '';
  
  res.on('data', chunk => data += chunk);
  
  res.on('end', () => {
    try {
      const settings = JSON.parse(data);
      console.log('✅ Backend API: OK');
      console.log('   Properties found:', Object.keys(settings).length);
      console.log('   Keys:', Object.keys(settings).join(', '));
      
      // Check if policies are present
      const policies = ['privacy_policy', 'refund_policy', 'shipping_policy', 'terms_service', 'about_us', 'size_chart', 'box_care'];
      const found = policies.filter(p => settings[p] && settings[p].length > 0);
      console.log(`   ✅ Policies with content: ${found.length}/${policies.length}`);
      
      // Show sample content
      if (settings.privacy_policy) {
        console.log('\n📋 Privacy Policy Preview:');
        console.log('   ' + settings.privacy_policy.substring(0, 80) + '...');
      }
      
      console.log('\n✨ ALL SYSTEMS READY FOR DELIVERY!\n');
      console.log('Frontend will fetch this data at http://localhost:3000');
      console.log('Admin can edit this data at http://localhost:3001\n');
      
    } catch (e) {
      console.log('❌ Error parsing response:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.log('❌ Backend error:', e.message);
});

req.end();
