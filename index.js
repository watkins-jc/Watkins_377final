const express = require("express");
const http = require('http');
const hostName = '127.0.0.1';
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.use(express.static(__dirname +'/public'));

app.listen(port,()=>{
    console.log('Express app listening on port: ${port}');
})

const server =http.createServer((req,res) =>{});
server.listen(PORT, hostName, () => {
    console.log(`Server running on http://${hostName}:${port}`);
});
