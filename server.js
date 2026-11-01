const http = require("node:http");
const httpProxy = require("http-proxy");

const PORT = Number(process.env.PORT || 10000);
const UPSTREAM = process.env.UPSTREAM || "https://gateway.hostless.cloud";

let upstreamUrl;
try {
  upstreamUrl = new URL(UPSTREAM);
  if (!["http:", "https:"].includes(upstreamUrl.protocol)) throw new Error("UPSTREAM must use HTTP or HTTPS");
} catch (error) {
  console.error("Invalid UPSTREAM:", error.message);
  process.exit(1);
}

const proxy = httpProxy.createProxyServer({
  target: upstreamUrl.origin,
  changeOrigin: false,
  ws: true,
  xfwd: true,
  secure: true,
  proxyTimeout: 120000,
  timeout: 120000
});

proxy.on("error", (error, req, res) => {
  console.error("Upstream error:", error.message);
  if (res && typeof res.writeHead === "function" && !res.headersSent) {
    res.writeHead(502, { "content-type": "text/plain; charset=utf-8" });
    res.end("Bad Gateway");
  } else if (res && typeof res.destroy === "function") {
    res.destroy();
  }
});

const server = http.createServer((req, res) => {
  if (req.url === "/healthz") {
    res.writeHead(200, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
    res.end("ok");
    return;
  }
  proxy.web(req, res, {
    target: upstreamUrl.origin,
    prependPath: false
  });
});

server.on("upgrade", (req, socket, head) => {
  proxy.ws(req, socket, head, {
    target: upstreamUrl.origin,
    prependPath: false
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("Reverse proxy listening on port " + PORT);
  console.log("Upstream origin: " + upstreamUrl.origin);
});