// Saqlyn portfolio (Cloudflare Workers Static Assets).
// The contact form posts to /api/lead on this same site. This Worker
// forwards it to the n8n leads webhook running on the Oracle VM.
//
// Why a proxy: the site is HTTPS, the n8n webhook is plain HTTP on the
// VM's public IP. A browser may NOT fetch an HTTP URL from an HTTPS page
// (mixed content is blocked), so the form would always fail. The Worker
// runs server-side on the same HTTPS origin and forwards the POST to n8n,
// so the browser only ever talks to this site.
//
// n8n webhook: http://161.153.68.55:5678/webhook/saqlyn-lead
//   - expects a POST with the form fields (Full Name, Email Address,
//     Phone Number, Service Required, Message); responds 200 immediately.
//
// /api/diag (temporary): tests whether the Worker can reach the VM and
// the public internet, to diagnose a hanging /api/lead.
const N8N_WEBHOOK = 'http://161.153.68.55:5678/webhook/saqlyn-lead';
const N8N_HOME = 'http://161.153.68.55:5678/';

async function probe(url, ms) {
  const t0 = Date.now();
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(ms) });
    return { url, ok: r.ok, status: r.status, ms: Date.now() - t0 };
  } catch (e) {
    return { url, ok: false, error: String(e && e.name ? e.name : e), ms: Date.now() - t0 };
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/diag' && request.method === 'GET') {
      const [vm, net] = await Promise.all([
        probe(N8N_HOME, 8000),
        probe('https://example.com/', 8000),
      ]);
      return new Response(JSON.stringify({ vm, net }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname === '/api/lead' && request.method === 'POST') {
      try {
        const res = await fetch(N8N_WEBHOOK, {
          method: 'POST',
          headers: {
            'Content-Type':
              request.headers.get('Content-Type') ||
              'application/x-www-form-urlencoded',
          },
          body: await request.arrayBuffer(),
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) throw new Error('n8n webhook returned ' + res.status);
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        return new Response(
          JSON.stringify({ ok: false, error: String(err && err.name ? err.name : err) }),
          {
            status: 502,
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }
    }

    return env.ASSETS.fetch(request);
  },
};
