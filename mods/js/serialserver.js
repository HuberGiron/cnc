//
// serialserver.js
//    WebSocket serial server
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2016
// Modified by: Francisco Sanchez 11-Feb-2022
//            : xytaz                Mar-2020
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
    console.log("that didn't work, try again: node serialserver.js client_address server_port")
    process.exit(-1)
}

//
// start server
//
var client_address = process.argv[2] // get the server IP address from the command line argument 2
var server_port = process.argv[3] // get the server port from the command line argument 3
//
// requires
//
var port = null // to store the status of the port
try {
	var { SerialPort } = require('serialport') // require the library
} catch (err) {
	console.log("- Serialport npm module not found. Did mods installation fail?")
	process.exit(-1)
}
try {
	var WebSocketServer = require('ws').Server
} catch (err) {
	process.ecit(-1)
}
//
// Start Websocket Server
//
wss = new WebSocketServer({
    port: server_port
})
console.log("- serialserver listening on port " + server_port)
//
// handle connection
//
wss.on('connection', function(ws) {
    //
    // check address
    //
    if (ws._socket.remoteAddress != client_address) {
	console.log("")
        console.log("===> serialserver: connection rejected")
        ws.send('connection rejected')
        ws.close()
    } else {
	console.log("")
        console.log("===> serialserver: connection accepted")
        ws.send('connection accepted')
        // list serial ports
        function getSerialPortList() {
            var portList = [] // init the list of serial devices
            SerialPort.list().then(ports => {
                ports.forEach(function(port) {
                    //if (port.pnpId !== undefined && port.manufacturer !== undefined) { // ignore ttySx // removed because some valid ports are not listed
                        portList.push(port.path) // add the path to the list
                    //}
                })
                // prepare the object
                var portListObj = {}
                portListObj['portList'] = portList
                ws.send(JSON.stringify(portListObj)) // send the object to mods
            })
        } // end of getSerialDevicesList()
        getSerialPortList()
    } // end of else statement
    //
    // handle messages
    //
    var cancel
    ws.on("message", function(message) {
        var msg = JSON.parse(message)
        var le_suffix = {
            none: '',
            nl: '\n',
            cr: '\r',
            nlcr: '\n\r'
        }
        //
        // open port
        //
        if (msg.type == 'open') {
            var device = msg.device
            var baud = parseInt(msg.baud)
            var flow = msg.flow
            if (port == null) {
                // create and open a serial port
                if (flow == 'none') {
                    port = new SerialPort({ path: device, 
                        baudRate: baud,
                    }) 
                }
                else if (flow == 'xonxoff') {
                    port = new SerialPort({ path: device, 
                        baudRate: baud,
                        xon: true,
			            xoff: true,
                        xany: true,
                    })
                        
                }
                else if (flow == 'rtscts') {
                    port = new SerialPort({ path: device, 
                        baudRate: baud,
                        rtscts: true,
                    }) 
                }
		        // TO CHECK WITH MDX20 (hidden in the interface)
                else if (flow == 'dsrdtr') {
                    port = new SerialPort({ path: device, 
                        baudRate: baud,
                        dsr: true,
                        dtr: true
                    }) 
                }
                // notify command line
                console.log("")
                console.log('*** serialserver: open ' + device + ' at ' + baud + ' flow ' + flow)
                // notify mods module
                ws.send('serial port opened') 
            }
            // when port is open, set the flow control
            port.on('error', function(err) {
                ws.send(err.message)
                port = null
            })
            port.on('data', function(data) {
                ws.send(data.toString('binary'))
            })
        }
        //
        // close port
        //
        else if (msg.type == 'close') {
            var device = msg.device
            if (port == null) {} else {
		        console.log("")
                console.log('*** serialserver: close ' + device)
                ws.send('serial port closed')
                port.close((err) => {
                    if (err) port = null //throw err;
                })
                port = null
            }
        }
        //
        // send string
        //
        else if (msg.type == 'string') {
	         if (port == null) {} 
             else {
                console.log(msg.string)
                port.write(msg.string + le_suffix[msg.line_ending], function() {
                    port.drain(function(err) {
                        if (err)
                            ws.send(err.message)
                    })
                })
            }
        }
        //
        // send command
        //
        else if (msg.type == 'command') {
           if (port == null) {} else {
                port.write(msg.contents, function() {
                    port.drain(function(err) {
                        if (err)
                            ws.send(err.message)
                        else
                            ws.send('done')
                    })
                })
	        }
        }
        //
        // cancel job
        //
        else if (msg.type == 'cancel') {
            cancel = true
        }
        //
        // send file
        //
        else if (msg.type == 'file') {
	        console.log("")
            console.log('*** serialserver: writing ' + msg.name + ' length ' + msg.contents.length)
            cancel = false
            write_char()
            //
            // character writer
            //
            function write_char() {
                //
                // cancel
                //
                if (cancel) {
		            console.log("")
                    console.log('*** serialserver: cancel')
                    ws.send('cancel')
                }
                //
                // continue
                //
                else {
                    port.flush(function(err) {
                        if (err)
                            ws.send(err.message)
                    })
                    port.write(Buffer.from(msg.contents), function() {
                        // port.drain(function(err) {
                        //     if (err)
                        //         ws.send('error ' + err.message)      
                        //     })
                    })
                    console.log("")
                    console.log('*** serialserver: done')
                    ws.send('done')  
                }
            }
        }
    })
    //
    // close socket
    //
    ws.on("close", function() {
	    console.log("")
        console.log("===> serialserver: connection closed")
        if (port != null)
            port.close((err) => {
                if (err) port = null //throw err;
            })
        port = null
    })
})
