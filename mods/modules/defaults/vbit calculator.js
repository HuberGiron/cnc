//
// V-bit calculator
//
// Neil Gershenfeld
// (c) Massachusetts Institute of Technology 2018
// Modified by Francisco Sanchez Arroyo 28-March-2022
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
    var name = 'V-bit calculator'
    //
    // initialization
    //
    var init = function() {
        // bit parameters
        mod.tip_dia_mm.value = 0.1
        mod.tip_dia_in.value = parseFloat(mod.tip_dia_mm.value)/25.4
        mod.angle.value = 15
        //'tool diameter (in)'
        mod.cut_width_mm.value = 0.4
        mod.cut_width_in.value = parseFloat(mod.cut_width_mm.value)/25.4
        // 'offset number'
        mod.offset_number.value = 4 
        // 'offset stepover'
        mod.offset_stepover.value = 0.2
        // 'speed (mm/s)'
        mod.speed.value = 4
        //'cut depth (in)' // 'max depth (in)'
        mod.cut_depth_mm.value = get_depth_mm()
        mod.cut_depth_in.value = parseFloat(mod.cut_depth_mm.value)/25.4

    }
    //
    // inputs
    //
    var inputs = {}
    //
    // outputs
    //
    var outputs = {
        settings: {
            type: '',
            event: function(vars) {
                mods.output(mod, 'settings', vars)
            }
        }
    }
    //
    // interface
    //
    var interface = function(div) {
        mod.div = div
        //
        // load d3.js
        //
        var script = document.createElement('script')
        script.type = 'text/javascript'
        script.onload = draw
        script.src = 'js/d3.js/d3.min.js'
        document.head.appendChild(script)
        //
        //
        // send settings
        //
        var btn = document.createElement('button')
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        var span = document.createElement('span')
        var text = document.createTextNode('send calculated settings')
        span.appendChild(text)
        btn.appendChild(span)
        btn.addEventListener('click', function() {
            var vars = {
                "tool diameter (in)": mod.cut_width_in.value,
                "cut depth (in)": mod.cut_depth_in.value,
                "max depth (in)": mod.cut_depth_in.value,
                "offset number": mod.offset_number.value,
                "offset stepover": mod.offset_stepover.value,
                "speed (mm/s)":mod.speed.value
            }
            outputs.settings.event(vars)
              })
        div.appendChild(btn)
        div.appendChild(document.createElement('hr'))
        div.appendChild(document.createTextNode('V-bit parameters:'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('tip diameter: '))
        var input = document.createElement('input')
        input.addEventListener('input',function(){
            mod.tip_dia_in.value = parseFloat(mod.tip_dia_mm.value)/25.4
            })
        input.type = 'text'
        input.size = 4
        div.appendChild(input)
        mod.tip_dia_mm = input
        div.appendChild(document.createTextNode('\u00a0mm '))
        var input = document.createElement('input')
        input.addEventListener('input',function(){
            mod.tip_dia_mm.value = parseFloat(mod.tip_dia_in.value)*25.4
            })
        input.type = 'text'
        input.size = 7
        div.appendChild(input)
        mod.tip_dia_in = input
        div.appendChild(document.createTextNode('\u00a0in'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('angle: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 4
        div.appendChild(input)
        mod.angle = input
        div.appendChild(document.createTextNode('\u00a0degrees '))
        div.appendChild(document.createElement('hr'))
        div.appendChild(document.createTextNode('Milling parameters:'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('Offset number: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 4
        div.appendChild(input)
        mod.offset_number = input
        div.appendChild(document.createTextNode(' (0 = fill)\u00a0\u00a0'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('Offset stepover: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 4
        div.appendChild(input)
        mod.offset_stepover = input
        div.appendChild(document.createTextNode(' (1 = diameter)'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('Feed speed: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 4
        div.appendChild(input)
        mod.speed = input
        div.appendChild(document.createTextNode(' mm/s\u00a0\u00a0\u00a0\u00a0\u00a0'))
        div.appendChild(document.createElement('hr'))
        div.appendChild(document.createTextNode('Calculator:'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('cut width: '))
        var input = document.createElement('input')
        input.addEventListener('input',function(){
            mod.cut_width_in.value = parseFloat(mod.cut_width_mm.value)/25.4
            mod.cut_depth_in.value = get_depth_in()
            mod.cut_depth_mm.value = get_depth_mm()
            })
        input.type = 'text'
        input.size = 4
        div.appendChild(input)
        mod.cut_width_mm = input
        div.appendChild(document.createTextNode('\u00a0mm '))
        var input = document.createElement('input')
        input.addEventListener('input',function(){
            mod.cut_width_mm.value = parseFloat(mod.cut_width_in.value)*25.4
            mod.cut_depth_mm.value = get_depth_mm()
            mod.cut_depth_in.value = get_depth_in()
            })
        input.type = 'text'
        input.size = 7
        div.appendChild(input)
        mod.cut_width_in = input
        div.appendChild(document.createTextNode('\u00a0in'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('cut depth: '))
        var input = document.createElement('input')
        input.addEventListener('input',function(){
            mod.cut_depth_in.value = parseFloat(mod.cut_depth_mm.value)/25.4
            mod.cut_width_in.value = get_width_in()
            mod.cut_width_mm.value = get_width_mm()
            })
        input.type = 'text'
        input.size = 4
        div.appendChild(input)
        mod.cut_depth_mm = input
        div.appendChild(document.createTextNode('\u00a0mm '))
        var input = document.createElement('input')
        input.addEventListener('input',function(){
            mod.cut_depth_mm.value = parseFloat(mod.cut_depth_in.value)*25.4
            mod.cut_width_mm.value = get_width_mm()
            mod.cut_width_in.value = get_width_in()
            })
        input.type = 'text'
        input.size = 7
        div.appendChild(input)
        mod.cut_depth_in = input
        div.appendChild(document.createTextNode('\u00a0in'))
        div.appendChild(document.createElement('br'))


        //
        //
        // draw
        //
        function draw() {
            //
            // data
            //
            var data = [{x: 35, y: 10}, {x: 35, y: 30}, {x: 70, y: 110}, {x: 80, y: 110}, {x: 115, y: 30}, {x: 115, y: 10}]
            var data2 = [{x: -5, y: 200}, {x: -5, y: 160}, {x: 59, y: 160}, {x: 70, y: 185}, {x: 80, y: 185}, {x: 91, y: 160}, {x: 175, y: 160}, {x: 175, y: 200}]
            var data3 =[{x: 39, y: 160}, {x: 50, y: 185}, {x: 60, y: 185}, {x: 71, y: 160}]
             
            console.log('good')
            var div2 = document.createElement('div')
            div2.id = 'd3svg'
            div.appendChild(div2)
            
            var svg = d3.select("#d3svg") 
            .append("svg") 
            .attr("width", 160) 
            .attr("height", 195)
    
            // prepare a helper function
            var lineFunc = d3.line()
            .x(function(d) { return d.x })
            .y(function(d) { return d.y })
    
            // Add the path using this helper function
            svg.append('path')
            .attr('d', lineFunc(data))
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('fill', 'lightgray');
    
            svg.append('path')
            .attr('d', lineFunc(data2))
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('fill', 'tan');
    
            svg.append('path')
            .attr('d', lineFunc(data3))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
    
            svg.append('text')
            .attr('x', 35)
            .attr('y', 125)
            .text("tip diameter ")
    
            svg.append('text')
            .attr('x', 57)
            .attr('y', 60)
            .text("angle")
    
            svg.append('text')
            .attr('x', 90)
            .attr('y', 180)
            .text("cut depth")
    
            svg.append('text')
            .attr('x', 5)
            .attr('y', 150)
            .attr('fill', 'red')
            .text("stepover")   
            
            svg.append('text')
            .attr('x', 72)
            .attr('y', 150)
            .text("cut width")   
    
            mods.fit(mod.div)
             }
        //


    }
    //
    // local functions
    //

    //
    // get width and depth
    //

    function get_depth_mm() {
        return (parseFloat(mod.cut_width_mm.value) - parseFloat(mod.tip_dia_mm.value))/(2 * Math.tan(parseFloat(mod.angle.value)*Math.PI/360))
    }
    function get_depth_in() {
        return (parseFloat(mod.cut_width_in.value) - parseFloat(mod.tip_dia_in.value))/(2 * Math.tan(parseFloat(mod.angle.value)*Math.PI/360))
    }
    function get_width_mm() {
        return parseFloat(mod.tip_dia_mm.value) + (2 * parseFloat(mod.cut_depth_mm.value) * Math.tan(parseFloat(mod.angle.value)*Math.PI/360))
    }
    function get_width_in() {
        return parseFloat(mod.tip_dia_in.value) + (2 * parseFloat(mod.cut_depth_in.value) * Math.tan(parseFloat(mod.angle.value)*Math.PI/360))
    }

    

    // function add_output(label) {
    //     if (mod.settings == undefined) {
    //         mod.settings = {}
    //     }
    //     var btn = document.createElement('button')
    //     btn.style.padding = mods.ui.padding
    //     btn.style.margin = 1
    //     var span = document.createElement('span')
    //     var text = document.createTextNode(label)
    //     span.appendChild(text)
    //     btn.appendChild(span)
    //     var f = function(label) {
    //         btn.addEventListener('click', function() {
    //             for (var s in mod.settings)
    //                 mod.settings[s].span.style.fontWeight = 'normal'
    //             mod.settings[label].span.style.fontWeight = 'bold'
    //             var vars = {}
    //             for (var v in mod.settings[label].variables)
    //                 vars[v] = mod.settings[label].variables[v].value
    //             outputs.settings.event(vars)
    //         })
    //     }(label)
    //     mod.settings[label] = {
    //         span: span,
    //         variables: {}
    //     }
    //     mod.div.appendChild(btn)
    //     mod.setting = label
    //     mod.div.appendChild(document.createElement('br'))
    // }




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
