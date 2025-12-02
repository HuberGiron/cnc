//
// udpserver.js
//    WebSocket UDP server
//
// Neil Gershenfeld
// (c) Massachusetts Institute of Technology 2016
// modified by Francisco Sanchez Arroyo 11-Feb-2022
//
// This work may be reproduced, modified, distributed, performed, and
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is
// provided as is; no warranty is provided, and users accept all
// liability.
//
// check command line
//
if (process.argv.length < 4) {
    console.log("command line: node udpserver.js client_address server_port")
    process.exit(-1)
}
//
// get address(es)
//
var os = require('os')
var interfaces = os.networkInterfaces()
var addresses = []
for (var i in interfaces) {
    for (var j in interfaces[i]) {
        var address = interfaces[i][j]
        if (address.family === 'IPv4')
            addresses.push(address.address)
    }
}
//
// start server
//
var client_address = process.argv[2]
var server_port = process.argv[3]
//
// requires
//
try {
	var dgram = require("dgram")
	var WebSocketServer = require('ws').Server
} catch (err) {
	process.exit(-1)
}
//
// Start Websocket Server
//
wss = new WebSocketServer({
    port: server_port
})
console.log("- udpserver listening on port " + server_port)
//
// handle connection
//
wss.on('connection', function(ws) {
    //
    // check address
    //
    if (ws._socket.remoteAddress != client_address) {
	console.log("")
        console.log("===> udpserver: connection rejected")
        ws.send('socket closed')
        ws.close()
    } else {
	console.log("")
        console.log("===> udpserver: connection accepted")
    }
    //
    // handle messages
    //
    var server = null
    ws.on("message", function(message) {
        var msg = JSON.parse(message)
        //
        // open local server
        //
        if (msg.type == 'open local') {
            var port = parseInt(msg.port)
            server = dgram.createSocket("udp4")
            server.bind(port)
            server.on('listening', function() {
		console.log("")
                console.log("*** udpserver: server listening on port " + port)
                msg = {}
                msg.type = 'listening'
                msg.addresses = addresses
                msg.status = 'listening on ' + port
                ws.send(JSON.stringify(msg))
            })
            server.on("message", function(message, info) {
                var msg = {}
                msg.type = 'message'
                msg.message = message.toString('utf8')
                msg.info = info
                ws.send(JSON.stringify(msg))
            })
            server.on("error", function(err) {
                msg = {}
                msg.type = 'status'
                msg.status = 'error: ' + JSON.stringify(err)
                ws.send(JSON.stringify(msg))
            })
        }
        //
        // send string
        //
        else if (msg.type = 'send string') {
            var client = dgram.createSocket("udp4")
            client.send(msg.string.toString(), 0, msg.string.length, msg.port, msg.host,
                function(err) {
                    client.close()
                    msg = {}
                    msg.type = 'status'
                    msg.status = 'transmit (' + JSON.stringify(err) + ')'
                    ws.send(JSON.stringify(msg))
                }
            )
        }
    })
    //
    // close
    //
    ws.on("close", function() {
	console.log("")
        console.log("===> udpserver: connection closed")
        if (server != null)
            server.close()
        server = null
    })
})
