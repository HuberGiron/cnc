//
// save file
//
// Quentin Bolsee
// (c) Massachusetts Institute of Technology 2024
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
    var name = 'append to file'
    //
    // initialization
    //
    var init = function() {
        mod.name = ''
        mod.contents = ''
    }
    //
    // inputs
    //
    var inputs = {
        file: {
            type: 'object',
            event: function(evt) {
                mod.name = evt.detail.name
                mod.contents = evt.detail.contents
                update_output()
            }
        }
    }
    //
    // outputs
    //
    var outputs = {
        file: {
            type:'',
            event: function(obj) {
                mods.output(mod,'file',obj)
            }
        }
    }
    //
    // interface
    //
    var interface = function(div) {
        mod.div = div
        //
        // info
        //
        var text = document.createTextNode('name:')
        div.appendChild(text)
        mod.nametext = text
        div.appendChild(document.createElement('br'))
        var text = document.createTextNode('size:')
        div.appendChild(text)
        mod.sizetext = text
        div.appendChild(document.createElement('br'))
        //
        // text area
        //
        var text = document.createElement('textarea')
        text.setAttribute('rows', mods.ui.rows)
        text.setAttribute('cols', mods.ui.cols)
        //
        // watch textarea for resize
        //
        new MutationObserver(update_module).observe(text, {
            attributes: true,
            attributeFilter: ["style"]
        })
        div.appendChild(text)
        mod.text = text
        div.appendChild(document.createElement('br'))
    }
    //
    // local functions
    //
    function update_output(event) {
        //
        // send file
        //
        var obj = {}
        obj.type = ''
        obj.name = mod.name
        obj.contents = mod.contents.concat(mod.text.value)
        outputs.file.event(obj) // output as fiie
        mod.nametext.nodeValue = 'name: '+mod.name
        mods.fit(mod.div)
        mod.sizetext.nodeValue = 'size: '+mod.contents.length
        mods.fit(mod.div)
    }
    function update_module() {
        mods.fit(mod.div)
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
