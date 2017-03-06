"use strict";
var express = require("express"),
    app = express(),
    config = require("./config");
    
app.listen(config.port);
