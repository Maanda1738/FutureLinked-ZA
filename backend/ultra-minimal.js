console.log('Starting ultra minimal test...');

const http = require('http');

const server = http.createServer((req, res) => {
  console.log('Request received:', req.url);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Ultra minimal server works' }));
});

const PORT = 3003;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Ultra minimal server running on http://0.0.0.0:${PORT}`);
  console.log(`Also accessible at http://127.0.0.1:${PORT}`);
  console.log(`Also accessible at http://localhost:${PORT}`);
  
  // Test if server is actually listening
  setTimeout(() => {
    console.log('Testing server status after 2 seconds...');
    const testReq = require('http').request({
      hostname: 'localhost',
      port: PORT,
      path: '/',
      method: 'GET'
    }, (res) => {
      console.log('Self-test successful! Status:', res.statusCode);
    });
    
    testReq.on('error', (err) => {
      console.log('Self-test failed:', err.message);
    });
    
    testReq.end();
  }, 2000);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

console.log('Ultra minimal server script loaded');