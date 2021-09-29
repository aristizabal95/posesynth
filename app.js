const http = require("http");
const express = require("express");
const OSC = require("osc-js");
const port = 3000;
const config = { udpClient: { port: 9129 } };
const osc = new OSC({ plugin: new OSC.BridgePlugin(config) });

osc.on("open", () => console.log("OSC now running"));
osc.on("*", (message) => console.log(message.args));

osc.open(); // start a WebSocket server on port 8080

const app = express();

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile("./index.html", { root: __dirname });
});

app.listen(port, () => {
    console.log(`PoseSynth app listening at port ${port}`);
});