"use strict";
var express = require("express"),
    app = express(),
    path = require("path"),
    config = require("./config");

app.use("/models", express.static(path.join(__dirname, "/models")));
app.use("/views", express.static(path.join(__dirname, "/views")));
app.use("/collections", express.static(path.join(__dirname, "/collections")));
app.use("/js", express.static(path.join(__dirname, "/js")));
app.use("/css", express.static(path.join(__dirname, "/css")));
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.listen(config.port);
