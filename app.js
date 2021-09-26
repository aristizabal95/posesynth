const http = require("http");
const express = require("express");
const port = 3000;

const app = express();

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile("./index.html", { root: __dirname });
});

app.listen(port, () => {
  console.log(`PoseSynth app listening at port ${port}`);
});