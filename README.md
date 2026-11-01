# Render WebSocket Gateway

A small HTTP + WebSocket reverse proxy. It forwards HTTP requests and WebSocket upgrades to the configured upstream.

## Deploy

1. In Render, choose New + → Blueprint and select this repository, or create a Web Service from the repository.
2. Use Node, build command `npm install`, and start command `npm start`.
3. Set health check path to `/healthz`.
4. The default upstream is `https://gateway.hostless.cloud`. Change it with the `UPSTREAM` environment variable if needed.
5. After deployment, add your custom domain in Render and follow its DNS instructions. Do not change the Arvan DNS record until Render has issued and verified the domain certificate.

## Important

- This service forwards WebSocket upgrades as well as HTTP requests.
- The upstream must accept the original incoming Host header and route it to the configured custom domain. If it requires a different Host header, the proxy configuration must be adjusted.
- Render Free may spin down after inactivity and has usage limits. This project does not generate synthetic keep-alive traffic or guarantee continuous availability. Check Render's current plan limits and acceptable-use terms before relying on it for persistent or high-volume traffic.
- `/healthz` only checks that this proxy process is running; it does not verify upstream reachability.