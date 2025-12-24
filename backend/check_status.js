import http from 'http';

const req = http.request('http://localhost:5000/', { method: 'GET', timeout: 2000 }, (res) => {
    console.log(`✅ Backend is UP. Status: ${res.statusCode}`);
});

req.on('error', (e) => {
    console.log(`❌ Backend is DOWN (Connection Refused on port 5000)`);
    console.log(`   Error: ${e.message}`);
});

req.on('timeout', () => {
    req.destroy();
    console.log(`❌ Backend TIMED OUT (Firewall or hung process)`);
});

req.end();
