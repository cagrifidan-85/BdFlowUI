const http = require('http');

// Test GET /api/images
console.log('\n--- Testing GET /api/images ---');
http.get('http://localhost:5000/api/images', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('✅ Status:', res.statusCode);
      console.log('Total images:', json.total);
      console.log('First image:', {
        id: json.images[0]?.id,
        publicId: json.images[0]?.publicId,
        url: json.images[0]?.url?.substring(0, 50) + '...'
      });
    } catch (e) {
      console.log('❌ Error parsing response:', e.message);
    }
  });
}).on('error', (e) => console.error('❌ Connection error:', e.message));

// Test GET /api/images/:id
console.log('\n--- Testing GET /api/images/:id ---');
setTimeout(() => {
  const testId = 'bdflow-products/seubtmtxl972pmizchhf';
  http.get(`http://localhost:5000/api/images/${testId}`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log('✅ Status:', res.statusCode);
        console.log('Image ID:', json.id);
        console.log('URL:', json.url?.substring(0, 50) + '...');
      } catch (e) {
        console.log('❌ Error parsing response:', e.message);
      }
    });
  }).on('error', (e) => console.error('❌ Connection error:', e.message));
}, 1000);

// Test DELETE /api/images/:id (will fail with test ID, just check route)
console.log('\n--- Testing DELETE /api/images/:id ---');
setTimeout(() => {
  const testId = 'test-image-id';
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: `/api/images/${testId}`,
    method: 'DELETE',
    headers: {
      'Content-Length': 0
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('✅ Status:', res.statusCode);
      console.log('Response:', data);
    });
  });

  req.on('error', (e) => console.error('❌ Connection error:', e.message));
  req.end();
}, 2000);
