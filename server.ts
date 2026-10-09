import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // =========================================================================
  // OPENWRT REST API ENDPOINTS (Simulation / Live Backend Controller)
  // =========================================================================

  // GET /api/status
  app.get('/api/status', (req, res) => {
    res.json({
      status: 'connected',
      router: 'OpenWrt 23.05.3 r23809-234f1982',
      ip: '192.168.1.1',
      uptime: '14 days, 6 hours, 22 mins',
      nftables_status: 'active',
      tc_sqm_status: 'active',
    });
  });

  // GET /api/devices
  app.get('/api/devices', (req, res) => {
    res.json({
      status: 'success',
      count: 12,
      leases: [
        { ip: '192.168.1.105', mac: 'AA:BB:CC:DD:EE:01', hostname: 'samsung-s24-ultra.lan' },
        { ip: '192.168.1.110', mac: 'AA:BB:CC:DD:EE:02', hostname: 'macbook-pro-m3.lan' },
        { ip: '192.168.1.120', mac: 'AA:BB:CC:DD:EE:03', hostname: 'lg-smart-tv-4k.lan' },
        { ip: '192.168.1.115', mac: 'AA:BB:CC:DD:EE:04', hostname: 'iphone-15-pro.lan' },
        { ip: '192.168.1.130', mac: 'AA:BB:CC:DD:EE:05', hostname: 'playstation-5.lan' },
        { ip: '192.168.1.140', mac: 'AA:BB:CC:DD:EE:06', hostname: 'xiaomi-security-cam.lan' },
      ],
    });
  });

  // POST /api/device/block
  app.post('/api/device/block', (req, res) => {
    const { ip, mac } = req.body;
    console.log(`[OpenWrt nftables] Adding drop rule for MAC: ${mac}, IP: ${ip}`);
    res.json({
      status: 'success',
      action: 'block',
      ip,
      mac,
      command: `nft add element inet netcontrol blocked_macs { ${mac} }`,
    });
  });

  // POST /api/device/unblock
  app.post('/api/device/unblock', (req, res) => {
    const { ip, mac } = req.body;
    console.log(`[OpenWrt nftables] Removing drop rule for MAC: ${mac}, IP: ${ip}`);
    res.json({
      status: 'success',
      action: 'unblock',
      ip,
      mac,
      command: `nft delete element inet netcontrol blocked_macs { ${mac} }`,
    });
  });

  // POST /api/device/limit
  app.post('/api/device/limit', (req, res) => {
    const { ip, mac, download_mbps, upload_mbps } = req.body;
    console.log(`[OpenWrt tc/SQM] Setting rate limit for IP: ${ip} -> DL: ${download_mbps}Mbps, UL: ${upload_mbps}Mbps`);
    res.json({
      status: 'success',
      action: 'limit',
      ip,
      mac,
      download_mbps,
      upload_mbps,
      command: `tc qdisc add dev br-lan parent 1:1 handle 10: htb rate ${download_mbps}mbit`,
    });
  });

  // DELETE /api/device/limit
  app.delete('/api/device/limit', (req, res) => {
    const { ip, mac } = req.body;
    console.log(`[OpenWrt tc/SQM] Removing rate limit for IP: ${ip}`);
    res.json({
      status: 'success',
      action: 'remove_limit',
      ip,
      mac,
      command: `tc filter del dev br-lan parent 1:0 protocol ip prio 1 u32 match ip dst ${ip}`,
    });
  });

  // GET /api/rules
  app.get('/api/rules', (req, res) => {
    res.json([
      { id: 'rule-1', deviceMac: 'AA:BB:CC:DD:EE:04', type: 'BLOCK', enabled: true },
      { id: 'rule-2', deviceMac: 'AA:BB:CC:DD:EE:02', type: 'LIMIT', downloadLimit: '5 Mbps', uploadLimit: '1 Mbps', enabled: true },
    ]);
  });

  // DELETE /api/rules/:id
  app.delete('/api/rules/:id', (req, res) => {
    const { id } = req.params;
    res.json({ status: 'deleted', ruleId: id });
  });

  // Serve Vite in development mode or dist in production mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NetControl Mobile server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
