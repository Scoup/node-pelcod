var express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)

app.use(express.static('public'))
app.use(express.static('bower_components'))

app.get('/', function(req, res){
    res.sendfile('./index.html')
})

server.listen(8000)

var PelcoD = require('../pelcod')

var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("/dev/ttyUSB0", {
  baudrate: 2400,
  parity: false,
  dataBits: 8,
  stopBits: 1,
});

var stream = serialPort.on("open", function(){

    var pelcod = new PelcoD(stream)

    io.sockets.on('connection', function(socket){

        socket.on('goto', function(data){
        })

        socket.on('change', function(data){
            // console.log('change')
            var up = data.tilt > 0
            var left = data.pan > 0
            pelcod.up(up)
                .left(left)
                .down(!up)
                .right(!left)
                .setPanSpeed(getSpeed(data.pan))
                .setTiltSpeed(getSpeed(data.tilt))
                .send()
        })

        socket.on('stop', function(){
            pelcod.stop().send()
        })
    })
})

function getSpeed(value) {
    value = Math.abs(value) * 2
    return value;
}