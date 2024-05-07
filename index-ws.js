const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

app.get("/test", function (req, res) {
  res.sendFile("test.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, () => {
  console.log("server started");
});

/** Begin Websockets */
const webSocketServer = require("ws").Server;
const wss = new webSocketServer({ server });

wss.on("connection", function connection(ws) {
  const numCLients = wss.clients.size;
  console.log("clients connected:", numCLients);
  console.log("client connected");
  wss.broadcast(`Current visitors count: ${numCLients}`);
  if (ws.readyState === ws.OPEN) {
    ws.send("welcome");
  }

  ws.on("close", function close() {
    wss.broadcast(`Current visitors count: ${numCLients}`);
    console.log("client disconnected");
    console.log("clients connected:", numCLients);
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};
