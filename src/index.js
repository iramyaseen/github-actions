const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "okk", version: "2.6.0" }));
    return;
  }
  res.writeHead(404);
  res.end();
});

server.listen(3001, () => console.log("payment-service on :3001"));
