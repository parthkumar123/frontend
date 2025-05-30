"use strict";
const path = require('path');
const next = require("next");

require('dotenv').config({
    path: path.resolve(__dirname + "/env", process.env.APP_ENV + '.env')
});

// Log environment information for verification
console.log(`Environment: ${process.env.APP_ENV || 'unknown'}`);
console.log(`API Base URL: ${process.env.API_BASE_URL || 'not set'}`);

const port = parseInt(process.env.PORT, 10) || 1148;
const dev = process.env.NODE_MODE === "development";

const app = next({ dev });

app.prepare().then(() => {
    const { createServer } = require('http');
    createServer((req, res) => {
        // Pass request and response to Next.js request handler
        app.getRequestHandler()(req, res);
    }).listen(port, async (err) => {
        if (err) throw err;
        console.log(`> Ready on Port ${port}`);
    });
});