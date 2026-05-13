// Variable definitions//
const express = require('express');
const bodyParser = require('body-parser');
const supabaseClient = require('@supabase/supabase-js')
const app=express();
const port=3000;

app,use(bodyParser.json())

const supabaseUrl = 'https://paodsufsmvtzneuqxqdt.supabase.co';
const supabaseKey ='sb_publishable_NyCUaUtScUcWGhAv6tJfiQ_2fS7x5AT';
const supbabase = supabaseClient.createClient(supabaseUrl,supabaseKey);

app.use(express.static(__dirname + '/public'));

app.get('/hello',(req,res) =>{
    const output = {
        phrase: 'Hello world',
    };

    res.json(output);
})

app.get('/about', (req,res) =>{
    res.sendFile('public/about.html',{ root:__dirname });
})

app.get('/', (req,res) =>{
    res.sendFile('public/home.html',{ root:__dirname });
})

app.get('/results', (req,res) =>{
    res.sendFile('public/results.html',{ root:__dirname });
})

app.get('/compare', (req,res) =>{
    res.sendFile('public/compare.html',{ root:__dirname });
})

app.listen(port, () => {
    console.log("Express app is listening on port: ${port}");
});