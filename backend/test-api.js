const http = require('http');

// Start server
const server = require('./server.js');

// Wait 2 seconds then test
setTimeout(() => {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/settings',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log('API Response OK!');
        console.log('Properties:', Object.keys(json).length);
        console.log('Privacy Policy length:', json.privacy_policy ? json.privacy_policy.substring(0, 50) : 'EMPTY');
        console.log('Refund Policy length:', json.refund_policy ? json.refund_policy.substring(0, 50) : 'EMPTY');
        console.log('Shipping Policy length:', json.shipping_policy ? json.shipping_policy.substring(0, 50) : 'EMPTY');
        process.exit(0);
      } catch (e) {
        console.error('Parse error:', e.message);
        process.exit(1);
      }
    });
  });

  req.on('error', (e) => {
    console.error('Request error:', e.message);
    process.exit(1);
  });

  req.end();
}, 2000);
