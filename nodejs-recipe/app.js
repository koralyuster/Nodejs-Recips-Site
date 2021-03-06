const express = require('express');
const path = require('path');
const http = require('http');

const mongodb = require('./db/mongoConnect');
const {routerInit, originAllow} = require("./routes/config_routes");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

//solve and secrutiy problem of send payload from another domain
originAllow(app);
routerInit(app);

//because react work on port 3000 we change the port of the nodejs server to 3400
const server = http.createServer(app);
let port = process.env.PORT || 5000;
server.listen(port);