const fs = require('fs');
const Corrosion = require('corrosion');

const http = require('http');

const server = http.createServer();
const proxy = new Corrosion({
    codec: 'xor', 
    prefix: '/get/' 
});

proxy.bundleScripts();

server.on('request', (request, response) => {
    if (request.url.startsWith(proxy.prefix)) return proxy.request(request, response);
    
    if (request.url == "/welcome.html") {
        response.end(fs.readFileSync(__dirname + '/src/welcome.html', 'utf-8'));
    } else {
        response.end(fs.readFileSync(__dirname + '/src/index.html', 'utf-8'));    
    }
}).on('upgrade', (clientRequest, clientSocket, clientHead) => proxy.upgrade(clientRequest, clientSocket, clientHead)).listen(80);