//
// CBA's modular potentiometer thing
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2016
// Modified by Fran Sanchez & Leo McElroy 12 Jan 2023
// 
// This work may be reproduced, modified, distributed, performed, and 
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is 
// provided as is; no warranty is provided, and users accept all 
// liability.
// 
// This module interacts with CBA Things
//
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
    var name = 'potentiometer thing'
    //
    // initialization
    //
    var init = function() {
        mod.baud.value = '9600'
        mod.flow_rtscts.checked = true
    }
    //
    // inputs
    //
    var inputs = {
        trigger: {
            type: '',
            event: function(evt) {
                data_send("?");
            }
        },
    }
    //
    // outputs
    //
    let local_pot = 0;

    var outputs = {
        pot: {
            type: "number"
        }
    }
    //
    // interface
    //
    var interface = function(div) {
        mod.div = div
        div.appendChild(document.createTextNode('WebSerial:'))
        div.appendChild(document.createElement('br'))
        
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('Get Device'))
        btn.addEventListener('click', function() {
             webserial_getdevices()
        })
        div.appendChild(btn)

        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('Forget'))
        btn.addEventListener('click', function() {
          webserial_forget()
        })
        div.appendChild(btn)

        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('Read'))
        btn.addEventListener('click', function() {
          data_send("?");
        })
        div.appendChild(btn)

        let intervalId = null;
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('interval'))
        btn.addEventListener('click', function() {
          intervalId = setInterval(() => {
            data_send("?");
          }, 50)
        })
        div.appendChild(btn)

        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('cancel interval'))
        btn.addEventListener('click', function() {
          clearInterval(intervalId);
        })
        div.appendChild(btn)



        div.appendChild(document.createElement('hr'))

        //
        // baud rate
        //
        div.appendChild(document.createTextNode('baud rate: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 7
        div.appendChild(input)
        mod.baud = input
        div.appendChild(document.createTextNode(' (bps)'))
        div.appendChild(document.createElement('br'))

        //
        // flow control
        //
        div.appendChild(document.createTextNode('flow control:'))
        div.appendChild(document.createElement('br'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'flow'
        input.id = mod.div.id + 'flow_none'
        div.appendChild(input)
        mod.flow_none = input
        div.appendChild(document.createTextNode('none\u00a0\u00a0\u00a0'))
        div.appendChild(document.createElement('br'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'flow'
        input.id = mod.div.id + 'flow_rtscts'
        div.appendChild(input)
        mod.flow_rtscts = input
        mod.flow_rtscts.checked = true
        div.appendChild(document.createTextNode('RTSCTS\u00a0'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createElement('br'))


    }
    //
    // local functions
    //

    function onReceive(msg) {
        const val = Number(msg);
        local_pot = val;
        let scale = Math.floor(local_pot/1020*255);
        mods.output(mod, 'pot', scale);

        // set value
    }

    async function readPort(port) {

        console.log("trying to read port");
        try  {
            console.log("port is readable", port.readable);

            while (port.readable) {
                console.log("reading port", port.readable);
                const reader = port.readable.getReader();

                let msg = "";
                while (true) {
                    const { value, done } = await reader.read();
                    if (value) {
                        const data = new Uint8Array(value.length);
                        for (let i = 0; i < value.length; i++) {
                            data[i] = value[i];
                        }
                    
                        const str = new TextDecoder().decode(data); 

                        for (let i = 0; i < str.length; i++) {
                            const ch = str[i];
                            if (ch === "\n") {
                                onReceive(msg);
                                msg = "";
                            } else {
                                msg += ch;
                            }
                        }
                        // do something with data here
                    }

                    if (done) {
                        reader.releaseLock();
                        break;
                    }
                }
            }

            console.log("port not readable");

        } catch (err) {
            console.error(err);
        } finally {
            await port.close();
            console.log("port closed");
        }
    }



    // disconnect webserial device
    async function webserial_forget() {
        await port.close();
        console.log("Port closed");
    }

    // connect webserial device
    let port;
    async function webserial_getdevices() {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: parseInt(mod.baud.value) });
        console.log("Port opened");

        readPort(port);

        }

    

    async function data_send(msg) {
        const encoder = new TextEncoder();
        const encoded = new Uint8Array(1);
        encoder.encodeInto(msg, encoded);
        const writer = port.writable.getWriter();
        await writer.write(encoded);
        writer.releaseLock();
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
