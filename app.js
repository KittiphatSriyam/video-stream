
const os = require('os')
const express = require('express')
const app = express()

const nets = os.networkInterfaces();

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



// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3000/')
//     res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS')
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Option, Authorization')
//     return next()
// })



app.use(express.static(__dirname + "/public"))

app.get('/', function (req, res) {
    res.redirect('index.html')
});

const server = app.listen(port, function () {
    console.log(`server is : http://${results.Ethernet[0]}:${port}`);
});

const io = require('socket.io')(server)

io.on('connection', socket => {
    console.log('connection');
    socket.on('stream', (stream) => {
        socket.broadcast.emit('stream', stream);
    });
    socket.on('disconnect', (stream) => {
        console.log('disconnect');
    });
});