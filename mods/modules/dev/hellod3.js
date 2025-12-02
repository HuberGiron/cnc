//
// D3.js
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2020
// Modified by Francisco Sanchez Arroyo 27-March-2022
// 
// This work may be reproduced, modified, distributed, performed, and 
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is 
// provided as is; no warranty is provided, and users accept all 
// liability.
//
// todo: force update module
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
    var name = 'D3.js'
    //
    // initialization
    //
    var init = function() {}
    //
    // inputs
    //
    var inputs = {
        input: {
            type: 'object',
            event: function(evt) {}
        }
    }
    //
    // outputs
    //
    var outputs = {
        output: {
            type: 'object',
            event: function() {}
        }
    }
    //
    // interface
    //
    var interface = function(div) {
        mod.div = div
        div.appendChild(document.createTextNode('V-bit Diagram'))
        //
        // load d3.js
        //
        var script = document.createElement('script')
        script.type = 'text/javascript'
        script.onload = draw
        script.src = 'js/d3.js/d3.min.js'
        document.head.appendChild(script)
        //
        // data
        //
        var data = [{x: 35, y: 10}, {x: 35, y: 90}, {x: 70, y: 170}, {x: 80, y: 170}, {x: 115, y: 90}, {x: 115, y: 10}]
        var data2 = [{x: 10, y: 275}, {x: 10, y: 220}, {x: 59, y: 220}, {x: 70, y: 245}, {x: 80, y: 245}, {x: 91, y: 220}, {x: 140, y: 220}, {x: 140, y: 275}]
        //
        // draw
        //
        function draw() {
        console.log('good')
        var div2 = document.createElement('div')
        div2.id = 'd3svg'
        div.appendChild(div2)
        
        var svg = d3.select("#d3svg") 
        .append("svg") 
        .attr("width", 150) 
        .attr("height", 275)

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

        svg.append('text')
        .attr('x', 45)
        .attr('y', 185)
        .style("font-size", '8px')
        //.style("font-family", 'sans')
        .text("TIP DIAMETER")

        svg.append('text')
        .attr('x', 63)
        .attr('y', 120)
        .style("font-size", '8px')
        .text("ANGLE")

        svg.append('text')
        .attr('x', 90)
        .attr('y', 235)
        .style("font-size", '8px')
        .text("CUT DEPTH")
        
        svg.append('text')
        .attr('x', 54)
        .attr('y', 211)
        .style("font-size", '8px')
        .text("CUT WIDTH")   

        mods.fit(mod.div)
         }

        
    }
    //
    // local functions
    //

    //
    // update module
    //
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
