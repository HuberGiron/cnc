//
// mill dual-tool 2D
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
    var name = 'mill triple-tool 2D'
    //
    // initialization
    //
    var init = function() {
        // tool 1 settings
        mod.tool1.value = 1
        mod.dia1_mm.value = 0.27
        mod.cut1_mm.value = 0.12
        mod.max1_mm.value = 0.12
        mod.stepover1.value = 0.5
        mod.number1.value = 2
        mod.imageInfo1 = {};

        // tool 2 settings
        mod.tool2.value = 2
        mod.dia2_mm.value = 0.6
        mod.cut2_mm.value = 0.12
        mod.max2_mm.value = 0.12
        mod.stepover2.value = 0.5
        mod.number2.value = 1
        mod.imageInfo2 = {};

        // tool 3 settings
        mod.tool2.value = 3
        mod.dia2_mm.value = 0.8
        mod.cut2_mm.value = 0.6
        mod.max2_mm.value = 1.75
        mod.stepover2.value = 0.5
        mod.number2.value = 1
        mod.imageInfo2 = {};

        // output info
        mod.paths = [];
        mod.tools = [];
        mod.name = "";
        mod.dpi = 1000;
        mod.width = 0;
        mod.height = 0;
        mod.depth = 0;
    }
    //
    // inputs
    //
    var inputs = {
        image1: {
            type: 'RGBA',
            event: function(evt) {
                var input = evt.detail
                var ctx = mod.image1.getContext("2d")
                ctx.canvas.width = input.width
                ctx.canvas.height = input.height
                ctx.putImageData(input,0,0)
            }
        },
        imageInfo1: {
            type: 'object',
            event: function(evt) {
                mod.imageInfo1 = evt.detail
            }
        },
        image2: {
            type: 'RGBA',
            event: function(evt) {
                var input = evt.detail
                var ctx = mod.image2.getContext("2d")
                ctx.canvas.width = input.width
                ctx.canvas.height = input.height
                ctx.putImageData(input,0,0)
            }
        },
        imageInfo2: {
            type: 'object',
            event: function(evt) {
                mod.imageInfo2 = evt.detail
            }
        },
        image3: {
            type: 'RGBA',
            event: function(evt) {
                var input = evt.detail
                var ctx = mod.image3.getContext("2d")
                ctx.canvas.width = input.width
                ctx.canvas.height = input.height
                ctx.putImageData(input,0,0)
            }
        },
        imageInfo3: {
            type: 'object',
            event: function(evt) {
                mod.imageInfo3 = evt.detail
            }
        },
        toolpath: {
            type: 'object',
            event: function(evt) {
                if (mod.label.nodeValue == 'calculating') {
                    var toolpath = structuredClone(evt.detail);
                    mod.toolCount += 1
                    if (mod.toolCount == 1) {
                        // add to stack
                        mod.toolpath_array.push(toolpath)

                        // output second
                        outputs.imageInfo.event()
                        outputs.image.event()
                    } else if (mod.toolCount == 2) {
                        // add to stack
                        mod.toolpath_array.push(toolpath)

                        // output third
                        outputs.imageInfo.event()
                        outputs.image.event()
                    } else {
                        // add to stack
                        mod.toolpath_array.push(toolpath)

                        // all done
                        mod.label.nodeValue = 'calculate'
                        mod.labelspan.style.fontWeight = 'normal'
                        merge_toolpaths();
                        outputs.toolpaths.event()
                    }
                }
            }
        },
        distance: {
            type: 'RGBA',
            event: function(evt) {
                // ready, send the settings over after 1s
                setTimeout(outputs.settings.event, 1000);
            }
        },
    }
    //
    // outputs
    //
    var outputs = {
        image: {
            type: 'RGBA',
            event: function() {
                var ctx;
                var img;
                if (mod.toolCount == 0) {
                    ctx = mod.image1.getContext("2d");
                    img = ctx.getImageData(0,0,mod.image1.width,mod.image1.height)
                } else if (mod.toolCount == 1) {
                    ctx = mod.image2.getContext("2d");
                    img = ctx.getImageData(0,0,mod.image2.width,mod.image2.height)
                } else {
                    ctx = mod.image2.getContext("2d");
                    img = ctx.getImageData(0,0,mod.image3.width,mod.image3.height)
                }
                mods.output(mod,'image',img)
            }
        },
        imageInfo: {
            type: 'object',
            event: function() {
                cmd = {}
                if (mod.toolCount == 0) {
                    cmd = mod.imageInfo1;
                } else if (mod.toolCount == 1) {
                    cmd = mod.imageInfo2;
                } else {
                    cmd = mod.imageInfo3;
                }
                mods.output(mod, 'imageInfo', cmd)
            }
        },
        settings: {
            type: 'object',
            event: function() {
                var cmd;
                if (mod.toolCount == 0) {
                    cmd = {
                        'tool diameter (mm)': mod.dia1_mm.value,
                        'cut depth (mm)': mod.cut1_mm.value,
                        'max depth (mm)': mod.max1_mm.value,
                        'offset stepover': mod.stepover1.value,
                        'offset number': mod.number1.value,
                        'calculate': true
                    }
                } else if (mod.toolCount == 1) {
                    cmd = {
                        'tool diameter (mm)': mod.dia2_mm.value,
                        'cut depth (mm)': mod.cut2_mm.value,
                        'max depth (mm)': mod.max2_mm.value,
                        'offset stepover': mod.stepover2.value,
                        'offset number': mod.number2.value,
                        'calculate': true

                    }
                } else {
                    cmd = {
                        'tool diameter (mm)': mod.dia3_mm.value,
                        'cut depth (mm)': mod.cut3_mm.value,
                        'max depth (mm)': mod.max3_mm.value,
                        'offset stepover': mod.stepover3.value,
                        'offset number': mod.number3.value,
                        'calculate': true

                    }
                }
                mods.output(mod, 'settings', cmd)
            }
        },
        toolpaths: {
            type: 'object',
            event: function() {
                cmd = {}
                cmd.paths = mod.paths
                cmd.tools = mod.tools
                cmd.name = mod.name
                cmd.dpi = mod.dpi
                cmd.width = mod.width
                cmd.height = mod.height
                cmd.depth = mod.depth
                mods.output(mod, 'toolpaths', cmd)
            }
        }
    }
    var merge_toolpaths = function() {
        var t1 = mod.toolpath_array[0]
        var t2 = mod.toolpath_array[1]
        var t3 = mod.toolpath_array[2]

        mod.name = `job`
        mod.paths = [t1.path, t2.path, t3.path]
        mod.tools = [mod.tool1.value, mod.tool2.value, mod.tool3.value]
        mod.dpi = t1.dpi
        mod.width = t1.width
        mod.height = t1.height
        mod.depth = Math.max(t1.depth, t2.depth, t3.depth)
    }
    var click_calculate = function() {
        mod.label.nodeValue = 'calculating'
        mod.labelspan.style.fontWeight = 'bold'
        mod.toolCount = 0
        mod.toolpath_array = []

        // output first
        outputs.imageInfo.event()
        outputs.image.event()
    }
    //
    // interface
    //
    var interface = function(div) {
        mod.div = div

        // image canvas off-screen
        var canvas = document.createElement('canvas')
        mod.image1 = canvas

        var canvas = document.createElement('canvas')
        mod.image2 = canvas

        var canvas = document.createElement('canvas')
        mod.image3 = canvas

        //
        // tool 1
        //
        div.appendChild(document.createTextNode('tool 1:'))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.tool1 = input
        div.appendChild(document.createElement('br'))
        //
        // tool 1 diameter
        //
        div.appendChild(document.createTextNode('tool 1 diameter (mm): '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.dia1_mm = input
        div.appendChild(document.createElement('br'))
        //
        // cut depth 1
        //
        div.appendChild(document.createTextNode('cut depth 1 (mm): '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.cut1_mm = input
        div.appendChild(document.createElement('br'))
        //
        // max depth 1
        //
        div.appendChild(document.createTextNode('max depth 1 (mm): '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.max1_mm = input
        div.appendChild(document.createElement('br'))
        //
        // offset number 1
        //
        div.appendChild(document.createTextNode('offset number 1:'))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.number1 = input
        div.appendChild(document.createTextNode(' (0 = fill)'))
        div.appendChild(document.createElement('br'))
        //
        // offset stepover 1
        //
        div.appendChild(document.createTextNode('offset stepover 1: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.stepover1 = input
        div.appendChild(document.createTextNode(' (1 = diameter)'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createElement('br'))

        //
        // tool 2
        //
        div.appendChild(document.createTextNode('tool 2:'))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.tool2 = input
        div.appendChild(document.createElement('br'))
        //
        // tool 2 diameter
        //
        div.appendChild(document.createTextNode('tool 2 diameter (mm): '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.dia2_mm = input
        div.appendChild(document.createElement('br'))
        //
        // cut depth 2
        //
        div.appendChild(document.createTextNode('cut depth 2 (mm): '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.cut2_mm = input
        div.appendChild(document.createElement('br'))
        //
        // max depth 2
        //
        div.appendChild(document.createTextNode('max depth 2 (mm): '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.max2_mm = input
        div.appendChild(document.createElement('br'))
        //
        // offset number
        //
        div.appendChild(document.createTextNode('offset number 2:'))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.number2 = input
        div.appendChild(document.createTextNode(' (0 = fill)'))
        div.appendChild(document.createElement('br'))
        //
        // offset stepover
        //
        div.appendChild(document.createTextNode('offset stepover 2: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.stepover2 = input
        div.appendChild(document.createTextNode(' (1 = diameter)'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createElement('br'))

        //
        // tool 3
        //
        div.appendChild(document.createTextNode('tool 3:'))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.tool3 = input
        div.appendChild(document.createElement('br'))
        //
        // tool 2 diameter
        //
        div.appendChild(document.createTextNode('tool 3 diameter (mm): '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.dia3_mm = input
        div.appendChild(document.createElement('br'))
        //
        // cut depth 3
        //
        div.appendChild(document.createTextNode('cut depth 3 (mm): '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.cut3_mm = input
        div.appendChild(document.createElement('br'))
        //
        // max depth 3
        //
        div.appendChild(document.createTextNode('max depth 3 (mm): '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.max3_mm = input
        div.appendChild(document.createElement('br'))
        //
        // offset number
        //
        div.appendChild(document.createTextNode('offset number 3:'))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.number3 = input
        div.appendChild(document.createTextNode(' (0 = fill)'))
        div.appendChild(document.createElement('br'))
        //
        // offset stepover
        //
        div.appendChild(document.createTextNode('offset stepover 3: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.stepover3 = input
        div.appendChild(document.createTextNode(' (1 = diameter)'))
        div.appendChild(document.createElement('br'))

        //
        // calculate
        //
        var btn = document.createElement('button')
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        var span = document.createElement('span')
        var text = document.createTextNode('calculate')
        mod.label = text
        span.appendChild(text)
        mod.labelspan = span
        btn.appendChild(span)
        btn.addEventListener('click', click_calculate)
        div.appendChild(btn)
        div.appendChild(document.createTextNode(' '))
    }
    //
    // return values
    //
    return ({
        name: name,
        init: init,
        inputs: inputs,
        outputs: outputs,
        interface: interface
    })
}())
