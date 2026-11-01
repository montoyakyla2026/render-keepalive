# Site Gateway Reverse Proxy

A fixed-upstream reverse proxy for ordinary website HTTP traffic and WebSocket upgrades.

## Render deployment

1. In Render, select **New + → Blueprint** and choose this repository.
2. Review the service settings from `render.yaml` and create the service.
3. Wait for the first deployment to become Live.
4. Test the Render `onrender.com` URL at `/healthz`; it should return `ok`.
5. Add the intended custom domain in Render and follow the exact DNS records Render displays.
6. Only after Render verifies the domain and provisions TLS, update the DNS record at your DNS provider.

## Configuration

- `UPSTREAM` is the fixed upstream origin. Default: `https://gateway.hostless.cloud`.
- The proxy preserves the incoming `Host` header (`changeOrigin: false`) so the upstream can route the custom domain.
- HTTP paths and query strings are forwarded unchanged.
- WebSocket upgrade requests are forwarded.
- `/healthz` checks the proxy process only; it does not prove that the upstream is reachable.

## Notes

- This is a fixed-upstream proxy, not an open proxy.
- Render Free may spin down when idle and has monthly usage limits; it does not guarantee always-on service.
- Check the upstream's routing and custom-domain configuration before switching production DNS.