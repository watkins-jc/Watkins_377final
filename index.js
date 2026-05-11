const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.use(express.static("public"));

app.get("/api/search", async (req, res) => {

    const query = req.query.query;

    try {

        const response = await fetch(
            `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1`
        );

        const data = await response.json();

        res.json(data.products.slice(0, 10));

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: "Search failed"
        });
    }
});


app.get("/api/product/:code", async (req, res) => {

    const code = req.params.code;

    try {

        const response = await fetch(
            `https://world.openfoodfacts.org/api/v0/product/${code}.json`
        );

        const data = await response.json();

        res.json(data.product);

    } catch (err) {

        res.status(500).json({
            error: "Product failed"
        });
    }
});

const http = require('http');
const hostName = '127.0.0.1';
const server =http.createServer((req,res) =>{});
server.listen(PORT, hostName, () => {
    console.log(`Server running on http://${hostName}:${port}`);
});

module.exports = app;
