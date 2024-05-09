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

process.on("SIGINT", () => {
  wss.clients.forEach((client) => {
    client.close();
  });
  server.close(() => {
    shutdownDB();
  });
});

/** Begin Websockets */
const webSocketServer = require("ws").Server;
const wss = new webSocketServer({ server });

wss.on("connection", function connection(ws) {
  const numCLients = wss.clients.size;
  console.log("clients connected:", numCLients);
  console.log("client connected");

  db.run(`INSERT INTO visitors (count, time)
    VALUES(${numCLients}, datetime('now'))
  `);

  wss.broadcast(`Current visitors count: ${numCLients}`);
  if (ws.readyState === ws.OPEN) {
    ws.send("welcome");
  }

  ws.on("close", function close() {
    wss.broadcast(`Current visitors count: ${numCLients}`);
    console.log("ws inside");
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};

/** end websockets */

/** DB */
const sqlite = require("sqlite3");
const db = new sqlite.Database(":memory:");

db.serialize(() => {
  db.run(`
    CREATE TABLE visitors (
      count INTEGER,
      time TEXT
    )
  `);
});

function getCounts() {
  db.each("SELECT * FROM visitors", (err, row) => {
    console.log(row);
  });
}

function shutdownDB() {
  getCounts();
  console.log("shutting down");
  db.close();
}

/** end DB */
