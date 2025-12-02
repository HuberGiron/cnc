//
// WebHID module
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2016
// Modified by Fran Sanchez 18 Jan 2023
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
    var name = 'WebHID'
    //
    // initialization
    //
    var init = function() {
    }
    //
    // inputs
    //
    var inputs = {

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
        div.appendChild(document.createTextNode('WebHID:'))
        div.appendChild(document.createElement('br'))
        
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('Get Device'))
        btn.addEventListener('click', function() {
            webhid_getdevices()
        })
        div.appendChild(btn)
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('Forget'))
        btn.addEventListener('click', function() {
            webhid_forget()
        })
        div.appendChild(btn)


    }
    //
    // local functions
    //

    // forget hid devices
    async function webhid_forget() {
        await device.close();
    }

    // get hid devices and read input reports
    async function webhid_getdevices() {
        devices = await navigator.hid.requestDevice({filters:[]})
        device = devices[0]
        await device.open(); 
        // read input report
        device.addEventListener("inputreport", event => {
            const { data, device, reportId } = event;
            let buffArray = new Uint8Array(data.buffer);
            console.log(buffArray);

        });
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
        await device.transferOut(2, result);

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
