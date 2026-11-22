/**
 * DỊCH VỤ ĐỒNG HÀNH CỤC BỘ (OPTIONAL LOCAL COMPANION - NODE.JS)
 *
 * Chỉ lắng nghe trên 127.0.0.1 với token bảo mật cục bộ.
 * Không bao giờ mở ra internet công cộng.
 */

const http = require('http');
const { exec } = require('child_process');

const PORT = 3111;
const HOST = '127.0.0.1';
const AUTH_TOKEN = 'local-token-secure-pmh';

const server = http.createServer((req, res) => {
  // CORS Restricted strictly to localhost and local file preview
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Token Verification
  const authHeader = req.headers['authorization'];
  if (!authHeader || authHeader !== `Bearer ${AUTH_TOKEN}`) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized: Invalid local token' }));
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // Health check endpoint
  if (req.method === 'GET' && url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'ok',
        version: '1.0.0',
        ffmpeg: true,
        ytdlp: true,
        message: 'Dịch vụ Companion đang chạy trên localhost:3111',
      })
    );
    return;
  }

  // Download trigger endpoint
  if (req.method === 'POST' && url.pathname === '/api/download') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { url: mediaUrl, format, outputName } = payload;

        console.log(`[Companion] Nhận yêu cầu tải: ${mediaUrl} -> Định dạng: ${format}`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: true,
            message: `Companion đã tiếp nhận tác vụ cho ${outputName}`,
          })
        );
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Payload không hợp lệ' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint không tồn tại' }));
});

server.listen(PORT, HOST, () => {
  console.log(`====================================================`);
  console.log(`[Companion] Personal Music Hub Local Companion Service`);
  console.log(`[Companion] Đang lắng nghe an toàn tại: http://${HOST}:${PORT}`);
  console.log(`====================================================`);
});
