import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import VultrNode from '@vultr/vultr-node';
import api from 'etherscan-api';
import compression from "compression";
import { benchmark } from './endpoints/index.js';
import { keygen } from './endpoints/index.js';
import { wallet } from './endpoints/index.js';
import { premium } from './endpoints/index.js';
import { pricing } from './endpoints/index.js';
import { support } from './endpoints/index.js';
import 'dotenv/config';

// Express
const app = express();

// JSON API
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Catch JSON Parse Errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.status(400).send({ status: 404, message: err.message }); // Bad request
    }
    next();
});


// Load Endpoints
app.use('/benchmarks', benchmark);
app.use('/keygen', keygen);
app.use('/wallet', wallet);
app.use('/premium', premium);
app.use('/pricing', pricing);
app.use('/support', support);

// SDKs
api.init(process.env._API_ETHERSCAN);

const vultr = VultrNode.initialize
  apiKey: process.env._API_VULTR

/*
    @zdanl: https:/install.cryptfire.io/
    Provide a basic script asking for Email to register an API Key
*/

app.get('/', (req, res) => {
  fs.readFile('./install.sh', {encoding: 'utf-8'}, function(err,data){
    if (!err) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(data);
        res.end();
    } else {
        res.send("echo 'were down :('");
    }
  });
});

app.listen(process.env._APP_PORT, process.env._APP_HOST, () => {
  console.log(`API listening on port ${process.env._APP_PORT}`);
});
