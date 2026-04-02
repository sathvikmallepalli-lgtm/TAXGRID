/**
 * Local GST lookup proxy — keeps provider API keys on the server (not in the Vite bundle).
 * Run: node server/gst-proxy.mjs
 * With Node 20+: node --env-file=.env server/gst-proxy.mjs
 *
 * Defaults to a commercial Search GSTIN HTTP API (Masters India–compatible URL).
 * For GST **System** APIs (GSTN Sandbox), follow GSTN’s guide: obtain credentials via an
 * empanelled GSP, call Authentication API first (Auth Token), then taxpayer/public APIs —
 * see docs/GST-System-API-How-To-Start.md and https://developer.gst.gov.in/apiportal/
 *
 * Upstream URL: GST_SEARCH_URL or default below.
 */

import http from 'http';

const PORT = Number(process.env.GST_PROXY_PORT) || 8787;
const UPSTREAM =
  process.env.GST_SEARCH_URL ||
  'https://commonapi.mastersindia.co/commonapis/searchgstin';

async function handleSearch(req, res, gstin) {
  const key = process.env.GST_API_KEY?.trim();
  const clientId = process.env.GST_CLIENT_ID?.trim();

  if (!key || !clientId) {
    res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(
      JSON.stringify({
        error: true,
        message:
          'Set GST_API_KEY and GST_CLIENT_ID in the environment (e.g. .env loaded with node --env-file=.env).'
      })
    );
    return;
  }

  const url = `${UPSTREAM}?gstin=${encodeURIComponent(gstin)}`;
  const upstream = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${key}`,
      client_id: clientId
    }
  });

  const text = await upstream.text();
  res.writeHead(upstream.status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(text);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);

    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      res.end();
      return;
    }

    if (req.method !== 'GET') {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }

    if (url.pathname === '/api/gst/health') {
      const ok = Boolean(process.env.GST_API_KEY?.trim() && process.env.GST_CLIENT_ID?.trim());
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok, upstream: UPSTREAM }));
      return;
    }

    if (url.pathname !== '/api/gst/search') {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
      return;
    }

    const gstin = url.searchParams.get('gstin')?.trim().toUpperCase();
    if (!gstin || gstin.length !== 15) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: true, message: 'Query ?gstin= must be a 15-character GSTIN' }));
      return;
    }

    await handleSearch(req, res, gstin);
  } catch (e) {
    console.error('gst-proxy error:', e);
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: true, message: e.message || 'Proxy error' }));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`GST proxy listening on http://127.0.0.1:${PORT} (Masters India upstream: ${UPSTREAM})`);
});
