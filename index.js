// Variable definitions//
const express = require('express');
const bodyParser = require('body-parser');
const supabaseClient = require('@supabase/supabase-js')
const dotenv = require('dotenv');
const cors = require("cors");
const app=express();
const port=3000;
dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

//supabase setup//
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =process.env.SUPABASE_KEY;
const supbabase = supabaseClient.createClient(supabaseUrl,supabaseKey);


app.get('/api/search', async (req,res) =>{
    const query = req.query.query;
    try{
        const response = await fetch(
            `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1`
        );
        const data = await response.json();
        res.json(data.products.slice(0,10));
    }catch (err){
        console.log(err);
        res.status(500).json({
            error:"Search failed, try again"
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
        console.log(err);
        res.status(500).json({
            error: "Product failed"
        });
    }
});
app.post("/api/save", async (req, res) => {
    const product = req.body;
    const { data, error } = await supabase
        .from("saved_products")
        .insert([product]);

    if (error) {

        console.log(error);

        return res.status(500).json(error);
    }
    res.json(data);
});

app.get('/', (req,res) =>{
    res.sendFile('public/home.html',{ root:__dirname });
})

app.get('/about', (req,res) =>{
    res.sendFile('public/about.html',{ root:__dirname });
})

app.get('/results', (req,res) =>{
    res.sendFile('public/results.html',{ root:__dirname });
})

app.get('/compare', (req,res) =>{
    res.sendFile('public/compare.html',{ root:__dirname });
})
app.use((req, res) => {
    res.status(404).sendFile(__dirname + "/public/404.html",{ root:__dirname });
});

app.listen(port, () => {
    console.log('Express app is listening on port: ${port}');
});

module.exports = app;