const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/settings',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Response length:', data.length);
    if (data.length < 500) {
      console.log('Response:', data);
    } else {
      console.log('Response preview:', data.substring(0, 200) + '...');
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.end();