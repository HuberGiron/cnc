//
// deviceserver.js
//    WebSocket device server
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2019
// Modified by Francisco Sanchez Arroyo 11-Feb-2022
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
    console.log("command line: node deviceserver.js client_address server_port")
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
console.log("- deviceserver listening on port " + server_port)
//
// handle connection
//
wss.on('connection', function(ws) {
    //
    // check address
    //
    if (ws._socket.remoteAddress != client_address) {
	    console.log("")
	    console.log("===> deviceserver connection rejected")
	    ws.send('socket closed')
        ws.close()
    } else {
	console.log("")
        console.log("===> deviceserver connection accepted")
    }
    //
    // handle messages
    //
    var cancel
    ws.on("message", function(msg) {
        //
        // cancel job
        //
        if (msg == 'cancel') {
            cancel = true
        }
        //
        // start job
        //
        else {
            var job = JSON.parse(msg)
            if (job == undefined) {
		console.log("")
                console.log('*** deviceserver: no job to send')
                ws.send('no job to send')
            } else {
                var count = 0
                var file
		console.log("")
                console.log('*** deviceserver writing ' + job.name + ' (length ' + job.contents.length + ') to ' + job.device)
                cancel = false
                fs.open(job.device, 'w', function(err, fd) {
                    if (err) {
			console.log("")
                        console.log('*** deviceserver error: ' + err)
                        ws.send('error: ' + err)
                    } else {
                        file = fd
                        write_char()
                    }
                })
                //
                // character writer
                //
                function write_char() {
                    //
                    // cancel
                    //
                    if (cancel) {
			console.log("")
                        console.log('*** deviceserver: cancel')
                        ws.send('cancel')
                        fs.close(file)
                    }
                    //
                    // continue
                    //
                    else {
                        fs.write(file, job.contents, function(err, written, string) {
                            if (err) {
				console.log("")
                                console.log('*** deviceserver: error ' + err)
                                ws.send('error ' + err)
                            } else {
				console.log("")
                                console.log('*** deviceserver: done')
                                ws.send('done')
                                fs.close(file, function(err) {
                                    if (err) {
					console.log("")
                                        console.log('*** deviceserver: error: ' + err)
                                        ws.send('error: ' + err)
                                    }
                                })

                            }
                        })
                    }
                } // end of write_char
            } //end of else
        } // end of else
    })
    //
    // close
    //
    ws.on("close", function() {
	console.log("")
        console.log("===> deviceserver: connection closed")
    })
})
