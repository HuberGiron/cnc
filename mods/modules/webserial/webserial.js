//
// WebSerial module
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
    var name = 'WebSerial'
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
        object: {
            type: 'object',
            event: function(evt) {
                if (evt.detail.type == 'command') {
                    mod.command = evt.detail.contents
                    data_send(mod.command)
                } else if (evt.detail.type == 'file') {
                    mod.job = evt.detail.contents
                    mod.job.type = 'file'
                    mod.label.nodeValue = 'send file'
                    mod.labelspan.style.fontWeight = 'bold'
                }
            }
        }

    }
    //
    // outputs
    //
    var outputs = {
        Monitor: {
            type: 'text',
            event: function() {
                mods.output(mod, 'text', result)
            }
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
        div.appendChild(document.createElement('hr'))

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
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'flow'
        input.id = mod.div.id + 'flow_rtscts'
        div.appendChild(input)
        mod.flow_rtscts = input
        mod.flow_rtscts.checked = true
        div.appendChild(document.createTextNode('RTSCTS\u00a0'))
        //
        // send button
        //
        div.appendChild(document.createElement('hr'))
        var btn = document.createElement('button')
        btn.style.margin = 1
        //btn.disabled = true
        var span = document.createElement('span')
        var text = document.createTextNode('waiting for file')        
        mod.label = text
        span.appendChild(text)
        mod.labelspan = span
        btn.appendChild(span)
        btn.addEventListener('click', function() {
          data_send(mod.job)
          mod.label.nodeValue = 'waiting for file'
          mod.labelspan.style.fontWeight = 'normal'
})
        div.appendChild(btn)



    }
    //
    // local functions
    //

    function check_flow() {
        //
        // Checks the flow control settings
        //
        if (mod.flow_rtscts.checked) {
            mod.flowControl = "hardware"
            console.log('hardware RTSCTS flow control')
        } else {
            mod.flowControl = "none"
            console.log('no flow control')
        } 
    }

    async function readPort(port) {

        console.log("trying to read port");
        try  {
            console.log("port is readable", port.readable);

            while (port.readable) {
                console.log("reading port", port.readable);
                reader = port.readable.getReader();

                while (true) {
                    const { value, done } = await reader.read();
                    if (value) {
                        const data = new Uint8Array(value.length);
                        for (let i = 0; i < value.length; i++) {
                            data[i] = value[i];
                        }
                    
                        const str = new TextDecoder().decode(data); 

                        // do something with data here
                        console.log(str);
                    }

                    if (done) {
                        reader.releaseLock();
                        break;
                    }
                }
            }

            console.log("port not readable");

        } catch (err) {
            console.log("caught", err);
        } 
        // finally {
        //     await port.close();
        //     console.log("port closed");
        // }
    }

    let port;
    let reader;

    // disconnect webserial device
    async function webserial_forget() {
        if (!port) return;
        if (port.readable.locked) {
            reader.releaseLock();
            reader = null;
        }
        await port.close();
        console.log("Port closed");
    }

    // connect webserial device
    async function webserial_getdevices() {
        check_flow()
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: parseInt(mod.baud.value), flowControl: mod.flowControl });
        console.log("Port opened");

        readPort(port);

        }

    
    // send data to webserial device
    async function data_send(msg) {
        result = []
        console.log("sending message", msg);
        // split msg into a characters array
        for(let i = 0; i < msg.length; i++){
            let code = msg.charCodeAt(i);
            result.push(code);
        } 
        console.log(result);
        // convert the array into Uinst8Array
        result = Uint8Array.from(result)
        console.log(result);
        // write the result to webserial
        try {const writer = port.writable.getWriter();
        await writer.write(result);
        writer.releaseLock();} catch (error) {console.log("port not opened")}
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
