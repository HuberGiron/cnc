//
// WebSocket module
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2016
// 
// This work may be reproduced, modified, distributed, performed, and 
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is 
// provided as is; no warranty is provided, and users accept all 
// liability.
//
// closure
//
(function() {
    //
    // module globals
    //
    var mod = {}
    //
    // name
    //
    var name = 'WebSocket'
    //
    // initialization
    //
    var init = function() {
        mod.address.value = '127.0.0.1'
        mod.port.value = 12345
        mod.socket = 0
        socket_open()
        }
    //
    // inputs
    //
    var inputs = {
        send: {
            type: 'object',
            event: function(evt) {
                socket_send(evt.detail)
                }
            }
        }
    //
    // outputs
    //
    var outputs = {
        receive: {
            type: 'object',
            event: function(data) {
                mods.output(mod, 'receive', data)
                }
            }
        }
    //
    // interface
    //
    var interface = function(div) {
        mod.div = div
        div.appendChild(document.createTextNode('server:'))
        div.appendChild(document.createElement('br'))
        //
        // address
        //
        div.appendChild(document.createTextNode('address: '))
        input = document.createElement('input')
        input.type = 'text'
        input.size = 10
        div.appendChild(input)
        mod.address = input
        div.appendChild(document.createElement('br'))
        //
        // port
        //
        div.appendChild(document.createTextNode('port: '))
        input = document.createElement('input')
        input.type = 'text'
        input.size = 10
        div.appendChild(input)
        mod.port = input
        div.appendChild(document.createElement('br'))
        //
        // ws/wss
        //
        div.appendChild(document.createTextNode('ws'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'type'
        input.id = mod.div.id + 'ws'
        input.checked = true
        div.appendChild(input)
        mod.ws = input
        div.appendChild(document.createTextNode(' wss'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'type'
        input.id = mod.div.id + 'wss'
        div.appendChild(input)
        mod.wss = input
        div.appendChild(document.createElement('br'))
        //
        // status
        //
        div.appendChild(document.createTextNode('status: '))
        input = document.createElement('input')
        input.type = 'text'
        input.size = 10
        div.appendChild(input)
        mod.status = input
        div.appendChild(document.createElement('br'))
        //
        // open/close
        //
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('open'))
        btn.addEventListener('click', function() {
            socket_open()
            })
        div.appendChild(btn)
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('close'))
        btn.addEventListener('click', function() {
            socket_close()
            })
        div.appendChild(btn)
        }
    //
    // local functions
    //
    function socket_open() {
        if (mod.ws.checked)
           var url = "ws://" + mod.address.value + ':' + mod.port.value
        else
           var url = "wss://" + mod.address.value + ':' + mod.port.value
        mod.socket = new WebSocket(url)
        mod.socket.onopen = function(event) {
            mod.status.value = "opened"
            }
        mod.socket.onerror = function(event) {
            mod.status.value = "can not open"
            }
        mod.socket.onmessage = function(event) {
            mod.status.value = "receive"
            outputs.receive.event(event.data)
            }
        }
    function socket_close() {
        mod.socket.close()
        mod.status.value = "closed"
        mod.socket = 0
        }
    function socket_send(msg) {
        if (mod.socket != 0) {
            mod.status.value = "send"
            mod.socket.send(msg)
            }
        else {
            mod.status.value = "can't send, not open"
            }
        }
    //
    // return values
    //
    return ({
        mod: mod,
        name: name,
        init: init,
        inputs: inputs,
        outputs: outputs,
        interface: interface
        })
    }())
