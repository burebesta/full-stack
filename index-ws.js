const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

server.on("reqest", app);
server.listen(3000, () => {
  console.log("server started");
});
