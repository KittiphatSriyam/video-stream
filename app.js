import { networkInterfaces } from 'os'
import express from 'express'

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const nets = networkInterfaces();

const results = {};
const port = process.env.PORT || 3000

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }

            results[name].push(net.address);
        }
    }
}

io.on('connection', socket => {
    socket.on('stream', (stream) => {
        socket.broadcast.emit('broadcast', stream);
    });
});

app.use(express.static(__dirname + "/public"))

app.get('/', function (req, res) {
    res.redirect('index.html')
});

app.listen(port, function () {
    console.log(`server is : http://${results.Ethernet[0]}:${port}`);
});