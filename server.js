const http = require("node:http");
const httpProxy = require("http-proxy");

const PORT = Number(process.env.PORT || 10000);
const UPSTREAM = process.env.UPSTREAM || "https://gateway.hostless.cloud";

const proxy = httpProxy.createProxyServer({
  target: UPSTREAM,
  changeOrigin: false,
  ws: true,
  xfwd: true,
  secure: true,
  proxyTimeout: 120000,
  timeout: 120000,
});

proxy.on("error", (err, req, res) => {
  console.error("Upstream proxy error:", err.message);
  if (res && !res.headersSent) {
    res.writeHead(502, { "content-type": "text/plain; charset=utf-8" });
  }
  if (res && !res.writableEnded) res.end("Bad gateway");
});

const server = http.createServer((req, res) => {
  if (req.url === "/healthz") {
    res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    return res.end("ok");
  }
  proxy.web(req, res);
});

server.on("upgrade", (req, socket, head) => {
  proxy.ws(req, socket, head);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("Gateway proxy listening on 0.0.0.0:" + PORT);
  console.log("Upstream: " + UPSTREAM);
});