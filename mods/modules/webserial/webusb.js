//
// WebUSB module
//
// Neil Gershenfeld
// (c) Massachusetts Institute of Technology 2016
// Modified by Fran Sanchez 12 Jan 2023
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
    var name = 'WebUSB'
    //
    // initialization
    //
    var init = function() {
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
        div.appendChild(document.createTextNode('WebUSB:'))
        div.appendChild(document.createElement('br'))
       
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('Get Device'))
        btn.addEventListener('click', function() {
            webusb_getdevices()
        })
        div.appendChild(btn)
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('Forget'))
        btn.addEventListener('click', function() {
            webusb_forget()
        })
        div.appendChild(btn)
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

    // forget usb devices
    async function webusb_forget() {
        await device.close();
    }

    let endpointNumber = 0;
    // get usb devices
    async function webusb_getdevices() {
        device = await navigator.usb.requestDevice({filters:[{}]})
        await device.open();

        let configuration = device.configuration;
        if (!configuration) {
            console.log("Device not configured. Selecting configuration...");
            await device.selectConfiguration(1);  // Assuming the device has at least one configuration
            configuration = device.configuration;
        console.log(configuration);
        }


        for (let interface of configuration.interfaces) {
            for (let endpoint of interface.alternate.endpoints) {
                if (endpoint.direction === "out") {
                    console.log("Found OUT endpoint:", endpoint.endpointNumber);
        endpointNumber = endpoint.endpointNumber;
                    // This is your OUT endpoint number you can use with transferOut
                }
            }
        }

        await device.selectConfiguration(1);
        await device.claimInterface(0);
        }
   

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
        // write the result to webusb
        await device.transferOut(endpointNumber, result);

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
