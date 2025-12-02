//
// echoserver.js
//    WebSocket echo server
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
    console.log("command line: node echoserver.js client_address server_port")
    process.exit(-1)
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
	var fs = require("fs")
	var WebSocketServer = require('ws').Server
} catch (err) {
	process.exit(-1)
}
//
// Start Websocket server
//
wss = new WebSocketServer({
    port: server_port
})
console.log("- echoserver listening on port " + server_port)
//
// handle connection
//
wss.on('connection', function(ws) {
    if (ws._socket.remoteAddress != client_address) {
	console.log("")
        console.log("===> echoserver: connection rejected")
        wss.close()
        process.exit(-1)
    } else {
	console.log("")
        console.log("===> echoserver: connection accepted")
    }
    ws.on("message", function(msg) {
        //console.log("   "+msg)
        ws.send(msg)
    })
    ws.on("close", function() {
	console.log("")
        console.log("===> echoserver: connection closed")
    })
})
