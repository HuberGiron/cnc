//
// printserver.js
//    WebSocket print server
//
// dependencies:
//    npm i printer ws
//    Windows
//       npm install --global windows-build-tools
//    Linux
//       sudo apt-get install node-gyp
//       sudo apt-get install libcups2-dev
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2017
// Modified by Francisco Sanchez Arroyo 11-Feb-2022
// 
// This work may be reproduced, modified, distributed, performed, and 
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is 
// provided as is no warranty is provided, and users accept all 
// liability.
//
// check command line
//
if (process.argv.length < 4) {
    console.log("command line: node printserver.js client_address server_port")
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
	var printer = require("@thiagoelg/node-printer")
} catch (err) {
	console.log("- Printer npm module not found. Did mods installation fail?")
	process.exit(-1)
}
try {
	var WebSocketServer = require('ws').Server
} catch (err) {
	process.exit(-1)
}
//
// start WebSocket server
//
wss = new WebSocketServer({
    port: server_port
})
console.log("- printserver listening on port " + server_port)
//
// handle connection
//
wss.on('connection', function(ws) {
    //
    // check address
    //
    if (!ws._socket.remoteAddress) {
	console.log("")
        console.log("===> printserver: connection rejected")
        ws.send('socket closed')
        ws.close()
    } else {
	console.log("")
        console.log("===> printserver: connection accepted")
        // get printer list
        function getPrinterList() {
            var printerList = []
            var printers = printer.getPrinters()
            if (printers && printers.length) {
                var i = printers.length
                for (i in printers) {
                    var pr = printers[i]
                    printerList.push(pr.name)
                }
            }
            var printerListObj = {}
            printerListObj['printerList'] = printerList
            printerListObj['default'] = printer.getDefaultPrinterName()
            return printerListObj
        }

        ws.send(JSON.stringify(getPrinterList()))
        ws.send('socket opened')
    }
    //
    // handle messages
    //
    var cancel
    var pagesPrinted
    ws.on("message", function(msg) {
        console.log(msg)
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
	    console.log("")
            console.log('*** printserver: writing ' + job.name + ' (length ' + job.contents.length + ') to printer ' + job.printer)
            cancel = false
            print()
            //
            // print all
            //
            function print() {
                console.log(job.contents)
                printer.printDirect({
                    data: job.contents,
                    type: 'RAW',
                    printer: job.printer,
                    success: function(jobID) {
			console.log("")
                        console.log("*** printserver: sent to printer with ID: " + jobID)
                        check_process()
                        //
                        // Check process
                        //
                        function check_process() {
                            var jobInfo
                            try {
                                jobInfo = printer.getJob(job.printer, jobID)
                            } catch (err) {
                                ws.send('done')
                                return
                            }
			    console.log("")
                            console.log("*** printserver: current job info:" +
                                JSON.stringify(jobInfo))
                            if (jobInfo.status.indexOf('PRINTED') !== -1) {

                                var ret = printer.setJob(job.printer,
                                    jobID, 'CANCEL')

                                ws.send('done')
                                return
                            }
                            //
                            // cancel
                            //
                            if (cancel) {
				console.log("")
                                console.log('*** printserver: cancelling...')
                                ws.send('cancel')
                                var ret = printer.setJob(job.printer,
                                    jobID, 'CANCEL')
				console.log("")
                                console.log("*** printserver: cancelled: " + ret)
                            }
                            //
                            // continue
                            //
                            else {
                                ws.send(jobInfo.status[0])
                                setTimeout(check_process, 1000)
                            }
                        }
                    },
                    error: function(err) {
			console.log("")
			console.log("*** printserver: An error ocurred. Read error message below.")
                        console.log(err)
                        ws.send('error ' + err)
                    }
                })
            }
        }
    })
    //
    // close
    //
    ws.on("close", function() {
	console.log("")
        console.log("===> printserver: connection closed")
    })
})
