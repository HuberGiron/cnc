//
// Roland SRM-20 milling machine
//
// Neil Gershenfeld
// (c) Massachusetts Institute of Technology 2016
// Modified by Francisco Sanchez Arroyo 04-April-2022
//
// This work may be reproduced, modified, distributed, performed, and
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is
// provided as is; no warranty is provided, and users accept all
// liability.
//
// IMPORTANT: SET THE MACHINE TO ACCEPT RML CODE IN VPANEL
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
    var name = 'Roland SRM-20 RML'
    //
    // initialization
    //
    var init = function() {

        mod.units = 100.0
        mod.speed.value = 4 // mm/s
        mod.jz.value = 2  // mm
        // tool position in machine coordinates
        mod.px.value = 0.0
        mod.py.value = 0.0
        mod.pz.value = 0.0
        // tool position in user coordinates
        mod.rx.value = 0.0
        mod.ry.value = 0.0
        mod.rz.value = 0.0
        // initial origin of user reference in machine coordinates
        mod.ox.value = 0.0
        mod.oy.value = 0.0
        mod.oz.value = 0.0
        // home position in machine units
        mod.hx = 0.0
        mod.hy = 152.4
        mod.hz = 60.5
        mod.homed = false
        initMachine()
    }
    //
    // inputs
    //
    var inputs = {
        path: {
            type: '',
            event: function(evt) {
                mod.name = evt.detail.name
                mod.path = evt.detail.path
                mod.dpi = evt.detail.dpi
                mod.width = evt.detail.width
                mod.height = evt.detail.height
                make_path()
            }
        }
    }
    //
    // outputs
    //
    var outputs = {
        file: {
            type: '',
            event: function(obj) {
                mods.output(mod, 'file', obj)
            }
        }
    }
    //
    // interface
    //
    var interface = function(div) {
        mod.div = div

        var input = document.createElement('input')
        mod.ox = input
        var input = document.createElement('input')
        mod.oy = input
        var input = document.createElement('input')
        mod.oz = input

        //
        // speed
        //
        div.appendChild(document.createTextNode('job settings:'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('speed: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 4
        div.appendChild(input)
        mod.speed = input
        div.appendChild(document.createTextNode(' (mm/s)'))
        div.appendChild(document.createElement('br'))
        //
        // jog
        //
        div.appendChild(document.createTextNode('jog z: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 4
        div.appendChild(input)
        mod.jz = input
        div.appendChild(document.createTextNode(' (mm)\u00a0\u00a0'))
        div.appendChild(document.createElement('hr'))

        // unhomed text
        var span = document.createElement('span')
        span.classList.add('divoff')
        var text = document.createTextNode('Activate SRM-20')
        span.appendChild(text)
        div.appendChild(span)
        // homed text
        var span = document.createElement('span')
        span.classList.add('divon')
        var text = document.createTextNode('Move SRM-20 to:')
        span.appendChild(text)
        div.appendChild(span)
        div.appendChild(document.createElement('br'))
        
        //
        // Activate SRM-20
        //
        var btn = document.createElement('button')
        btn.classList.add('divoff')
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        var span = document.createElement('span')
        var text = document.createTextNode('Activate')
        span.appendChild(text)
        btn.appendChild(span)
        btn.addEventListener('click', function() {
            //
            // RML version
            //
            //
            var str = '^PA;\n'
            str += '!MC0;!ZZ0,0,6050;\n'
            str += '!MC0;!ZZ0,0,6050;\n'
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'originG53.rml'
            obj.contents = str
            outputs.file.event(obj)
            mod.homed = true
            initMachine()
              })
        div.appendChild(btn)

        //
        // go to origin
        //
        var btn = document.createElement('button')
        btn.classList.add('divon')
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        var span = document.createElement('span')
        span.classList.add('divon')
        var text = document.createTextNode('Origin')
        span.appendChild(text)
        btn.appendChild(span)
        btn.addEventListener('click', function() {
            //
            // RML version
            //
            //
            var str = "^PA;!MC0;!ZZ0,0,6050;\n"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'originG53.rml'
            obj.contents = str
            outputs.file.event(obj)
            // set position in G53
            mod.px.value = (0.0).toFixed(1)
            mod.py.value = (0.0).toFixed(1)  
            mod.pz.value = (60.5).toFixed(1)  
            // update user coordinates with last stored position
            mod.rx.value = (-parseFloat(mod.ox.value)).toFixed(1)
            mod.ry.value = (-parseFloat(mod.oy.value)).toFixed(1)
            mod.rz.value = (60.5 - parseFloat(mod.oz.value)).toFixed(1)
              })
        div.appendChild(btn)

        //
        // go to view
        //
        var btn = document.createElement('button')
        btn.classList.add('divon')
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        var span = document.createElement('span')
        var text = document.createTextNode('View')
        span.appendChild(text)
        btn.appendChild(span)
        btn.addEventListener('click', function() {
            //
            // RML version
            //
            //
            var str = "^PA;!MC0;!ZZ10160,15240,6050;\n"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'view.rml'
            obj.contents = str
            outputs.file.event(obj)
            // set position in G53
            mod.px.value = (101.6).toFixed(1)
            mod.py.value = (152.4).toFixed(1)  
            mod.pz.value = (60.5).toFixed(1)  
            // update user coordinates to last stored position
            mod.rx.value = (101.6 - parseFloat(mod.ox.value)).toFixed(1)
            mod.ry.value = (152.4 - parseFloat(mod.oy.value)).toFixed(1)
            mod.rz.value = (60.5 -parseFloat(mod.oz.value)).toFixed(1)
        })
        div.appendChild(btn)


        //
        // Go to home
        //
        var btn = document.createElement('button')
        btn.classList.add('divon')
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        var span = document.createElement('span')
        var text = document.createTextNode('home')
        span.appendChild(text)
        btn.appendChild(span)
        btn.addEventListener('click', function() {
            //
            // RML version
            //
            var str = "^PA;!MC0;!ZZ0,15240,6050;\n"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'home.rml'
            obj.contents = str
            outputs.file.event(obj)
            // set position in G53
            mod.px.value = (0.0).toFixed(1)
            mod.py.value = (152.4).toFixed(1)  
            mod.pz.value = (60.5).toFixed(1)  
            // update user coordinates to last stored position
            mod.rx.value = (-parseFloat(mod.ox.value)).toFixed(1)
            mod.ry.value = (152.4 - parseFloat(mod.oy.value)).toFixed(1)
            mod.rz.value = (60.5 - parseFloat(mod.oz.value)).toFixed(1)

        })
        div.appendChild(btn)


        
        //
        // tool position
        //
        var divon=document.createElement("div")
        divon.classList.add('divon')
        divon.appendChild(document.createElement('hr'))
        divon.appendChild(document.createTextNode('tool position:'))
        divon.appendChild(document.createElement('br'))
        divon.appendChild(document.createElement('br'))
        divon.appendChild(document.createTextNode('\u00a0\u00a0machine \u00a0user \u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'))
        divon.appendChild(document.createElement('br'))
        divon.appendChild(document.createTextNode('x: '))
        var input = document.createElement('input')
        input.disabled = true
        input.type = 'text'
        input.size = 8
        divon.appendChild(input)
        mod.px = input
        var input = document.createElement('input')
        input.disabled = true
        input.type = 'text'
        input.size = 8
        divon.appendChild(input)
        mod.rx = input
        divon.appendChild(document.createTextNode(' (mm)'))
        divon.appendChild(document.createElement('br'))
        divon.appendChild(document.createTextNode(' y: '))
        var input = document.createElement('input')
        input.disabled = true
        input.type = 'text'
        input.size = 8
        divon.appendChild(input)
        mod.py = input
        var input = document.createElement('input')
        input.disabled = true
        input.type = 'text'
        input.size = 8
        divon.appendChild(input)
        mod.ry = input
        divon.appendChild(document.createTextNode(' (mm)'))
        divon.appendChild(document.createElement('br'))
        divon.appendChild(document.createTextNode('z: '))
        var input = document.createElement('input')
        input.disabled = true
        input.type = 'text'
        input.size = 8
        divon.appendChild(input)
        mod.pz = input
        var input = document.createElement('input')
        input.disabled = true
        input.type = 'text'
        input.size = 8
        divon.appendChild(input)
        mod.rz = input
        divon.appendChild(document.createTextNode(' (mm)'))
        divon.appendChild(document.createElement('br'))
        
        
        
        //
        // manual move buttons
        //
        divon.appendChild(document.createElement('hr'))
        divon.appendChild(document.createTextNode('manual move:'))
        divon.appendChild(document.createElement('br'))

        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'range'
        input.id = mod.div.id + 'range_big'
        divon.appendChild(input)
        mod.range_big = input
        divon.appendChild(document.createTextNode('5mm'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'range'
        input.id = mod.div.id + 'range_medium'
        divon.appendChild(input)
        mod.range_medium = input
        mod.range_medium.checked = true
        divon.appendChild(document.createTextNode('1mm'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'range'
        input.id = mod.div.id + 'range_small'
        divon.appendChild(input)
        mod.range_small = input
        divon.appendChild(document.createTextNode('0.1mm'))
        divon.appendChild(document.createElement('br'))
        divon.appendChild(document.createElement('br'))



        divon.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'))

        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('+Y'))
        btn.addEventListener('click', function() {
            //
            // Check step
            //
            check_step()
            //
            // check outbounds
            //
            if ((parseFloat(mod.py.value) + parseFloat(mod.step/mod.units)) > 152.4) {
                beep(200,100,1,'sawtooth')
                return
            }
            //
            // Create message
            //
            var str = "^PR;!MC0;!ZZ0," + mod.step + ",0;\n"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'far.rml'
            obj.contents = str
            mods.output(mod, 'file', obj)
            mod.py.value = (parseFloat(mod.py.value) + parseFloat(mod.step/mod.units)).toFixed(1)
            mod.ry.value = (parseFloat(mod.ry.value) + parseFloat(mod.step/mod.units)).toFixed(1)
        })
        divon.appendChild(btn)

        divon.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'))

        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('+Z'))
        btn.addEventListener('click', function() {
            //
            // Check step
            //
            check_step()
            if ((parseFloat(mod.pz.value) + parseFloat(mod.step/mod.units)) > 60.5) {
                beep(200,100,1,'sawtooth')
                return
            }
            //
            // Create message
            //
            var str = "^PR;!MC0;!ZZ0,0," + mod.step + ";\n"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'up.rml'
            obj.contents = str
            mods.output(mod, 'file', obj)
            mod.pz.value = (parseFloat(mod.pz.value) + parseFloat(mod.step/mod.units)).toFixed(1)
            mod.rz.value = (parseFloat(mod.rz.value) + parseFloat(mod.step/mod.units)).toFixed(1)
        })
        divon.appendChild(btn)

        divon.appendChild(document.createElement('br'))

        divon.appendChild(document.createTextNode('\u00a0\u00a0'))


        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('-X'))
        btn.addEventListener('click', function() {
            //
            // Check step
            //
            check_step()
            // check outbounds
            //
            if ((parseFloat(mod.px.value) - parseFloat(mod.step/mod.units)) < 0) {
                beep(200,100,1,'sawtooth')
                return
            }
            //
            // Create message
            //
            var str = "^PR;!MC0;!ZZ-" + mod.step + ",0,0;\n"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'left.rml'
            obj.contents = str
            mods.output(mod, 'file', obj)
            mod.px.value = (parseFloat(mod.px.value) - parseFloat(mod.step/mod.units)).toFixed(1)
            mod.rx.value = (parseFloat(mod.rx.value) - parseFloat(mod.step/mod.units)).toFixed(1)
        })
        divon.appendChild(btn)

        var btn = document.createElement('button')
        btn.disabled = false
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('XY0'))
        btn.addEventListener('click', function() {
            var warn = confirm("Warning: This will reset the XY user origin coordinates. X=0, Y=0")
            beep(50,2000,1,'square')
            if (warn == true) {   
            // store the current G53 coordinates of the user reference
            mod.ox.value = mod.px.value
            mod.oy.value = mod.py.value
            // set user coordinates to zero
            mod.rx.value = (0.0).toFixed(1)
            mod.ry.value = (0.0).toFixed(1)
            beep(150,2000,1,'square')
            }
        })
        divon.appendChild(btn)

        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('+X'))
        btn.addEventListener('click', function() {
            //
            // Check step
            //
            check_step()
            if ((parseFloat(mod.px.value) + parseFloat(mod.step/mod.units)) > 203.2) {
                beep(200,100,1,'sawtooth')
                return
            }
            //
            // Create message
            //
            var str = "^PR;!MC0;!ZZ" + mod.step + ",0,0;\n"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'right.rml'
            obj.contents = str
            mods.output(mod, 'file', obj)
            mod.px.value = (parseFloat(mod.px.value) + parseFloat(mod.step/mod.units)).toFixed(1)
            mod.rx.value = (parseFloat(mod.rx.value) + parseFloat(mod.step/mod.units)).toFixed(1)
        })
        divon.appendChild(btn)

        divon.appendChild(document.createTextNode('\u00a0\u00a0\u00a0'))

        var btn = document.createElement('button')
        btn.disabled = false
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('Z0'))
        btn.addEventListener('click', function() {
            var warn = confirm("Warning: This will reset the Z user origin coordinate. Z=0")
            beep(50,2000,1,'square')
            if (warn == true) {   
            // store the current G53 coordinates of the user reference
            mod.oz.value = mod.pz.value
            // set user coordinates to zero
            mod.rz.value = (0.0).toFixed(1)
            beep(150,2000,1,'square')
            }
        })
        divon.appendChild(btn)

        divon.appendChild(document.createElement('br'))

        divon.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'))


        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('-Y'))
        btn.addEventListener('click', function() {
            //
            // Check step
            //
            check_step()
            if ((parseFloat(mod.py.value) - parseFloat(mod.step/mod.units)) < 0) {
                beep(200,100,1,'sawtooth')
                return
            }
            //
            // Create message
            //
            var str = "^PR;!MC0;!ZZ0,-" + mod.step + ",0;\n"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'near.rmll'
            obj.contents = str
            mods.output(mod, 'file', obj)
            mod.py.value = (parseFloat(mod.py.value) - parseFloat(mod.step/mod.units)).toFixed(1)
            mod.ry.value = (parseFloat(mod.ry.value) - parseFloat(mod.step/mod.units)).toFixed(1)
        })
        divon.appendChild(btn)

        divon.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'))

        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('-Z'))
        btn.addEventListener('click', function() {
            //
            // Check step
            //
            check_step()
            if ((parseFloat(mod.pz.value) - parseFloat(mod.step/mod.units)) < 0) {
                beep(200,100,1,'sawtooth')
                return
            }
            //
            // Create message
            //
            var str = "^PR;!MC0;!ZZ0,0,-" + mod.step + ";\n"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'down.rml'
            obj.contents = str
            mods.output(mod, 'file', obj)
            mod.pz.value = (parseFloat(mod.pz.value) - parseFloat(mod.step/mod.units)).toFixed(1)
            mod.rz.value = (parseFloat(mod.rz.value) - parseFloat(mod.step/mod.units)).toFixed(1)
        })
        divon.appendChild(btn)

        divon.appendChild(document.createElement('hr'))

        //
        // goto
        // 
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('Goto User XY0'))
        btn.addEventListener('click', function() {
            //
            // Create message
            //
            var str = '^PA;!MC0;!ZZ' + parseFloat(mod.ox.value*mod.units) + ',' + parseFloat(mod.oy.value*mod.units) + ',' + parseFloat(mod.pz.value*mod.units) + ';\n'
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'goxy0.rml'
            obj.contents = str
            mods.output(mod, 'file', obj)
            // update machine coordinates
            mod.px.value = parseFloat(mod.ox.value).toFixed(1) 
            mod.py.value = parseFloat(mod.oy.value).toFixed(1)
            // set position in user coordinates
            mod.rx.value = (0.0).toFixed(1)
            mod.ry.value = (0.0).toFixed(1)  
        })
        divon.appendChild(btn)

        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('Goto User Z0'))
        btn.addEventListener('click', function() {
            var warn = confirm("Warning: This could cause the tool to crash if you did not set the Z origin")
            if (warn == true) {   
            //
            // Create message
            //
            var str = '^PA;!MC0;!ZZ' + parseFloat(mod.px.value*mod.units) + ',' + parseFloat(mod.py.value*mod.units) + ',' + parseFloat(mod.oz.value*mod.units) + ';\n' 
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'goz0.rml'
            obj.contents = str
            mods.output(mod, 'file', obj)
            // update machine coordinates
            mod.pz.value = parseFloat(mod.oz.value).toFixed(1) 
            // set position in user coordinates
            mod.rz.value = (0.0).toFixed(1)
            }
        })
        divon.appendChild(btn)

        divon.appendChild(document.createElement('hr'))

        //
        // motor on
        // 
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('Spindle ON'))
        btn.addEventListener('click', function() {
            //
            // Create message
            //
            var str = '!MC1;\n' // data start
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'spon.rml'
            obj.contents = str
            mods.output(mod, 'file', obj)
        })
        divon.appendChild(btn)

        //
        // motor off
        // 
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('Spindle OFF'))
        btn.addEventListener('click', function() {
            //
            // Create message
            //
            var str = '!MC0;\n'
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'spoff.rml'
            obj.contents = str
            mods.output(mod, 'file', obj)
        })
        divon.appendChild(btn)

        
        divon.appendChild(document.createElement('hr'))
        //
        // reset SRM-20
        // 
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('Reset SRM-20'))
        btn.addEventListener('click', function() {
            mod.homed = false
            initMachine()
        })
        divon.appendChild(btn)
        div.appendChild(divon)
    }

    //
    // local functions
    //

   
    function initMachine() {
        const el = document.getElementsByClassName("divon")
        const el2 = document.getElementsByClassName("divoff")
        if (mod.homed === true) {
          for (var i = 0; i < el.length; i ++) {
              el[i].style.display = "inline";}
          for (var i = 0; i < el2.length; i ++) {
              el2[i].style.display = "none";}
        mods.fit(mod.div)
        // we should be in origin
        mod.px.value = (0.0).toFixed(1)
        mod.py.value = (0.0).toFixed(1)
        mod.pz.value = (60.5).toFixed(1)
        // last stored position of user origin
        mod.rx.value = (-parseFloat(mod.ox.value)).toFixed(1)
        mod.ry.value = (-parseFloat(mod.oy.value)).toFixed(1)
        mod.rz.value = (60.5 - parseFloat(mod.oz.value)).toFixed(1) // es asi?
}   
    else {
          for (var i = 0; i < el.length; i ++) {
                el[i].style.display = "none";}
          for (var i = 0; i < el2.length; i ++) {
                el2[i].style.display = "inline";}
          mods.fit(mod.div)
            }
      } 

    function check_step() {
        //
        // Checks how big is the manual move step
        //
        if (mod.range_big.checked) {
            mod.step = 5 * mod.units
        } else if (mod.range_medium.checked) {
            mod.step = mod.units
        } else if (mod.range_small.checked) {
            mod.step = mod.units / 10
        }
    }


        function make_path() {  // incremental
            var dx = 25.4 * mod.width / mod.dpi
            var nx = mod.width
            var speed = parseFloat(mod.speed.value)
            var jog = parseFloat(mod.jz.value)
            var ijog = Math.floor(mod.units * jog)
            var scale = mod.units * dx / (nx - 1)
            //var str = ";;^IN;\n"
            var str = "^PR;\n" // plot incremental
            str += "^VS" + speed + ";!VZ" + speed + ";\n" // set feed speed and plunge speed
            str += "!RC15;!MC1;\n" // turn motor on
            //
            // follow segments
            //
            var lx = 0 // init the last x coordinate
            var ly = 0 // init the last y coordinate
            var lz = 0 // init the last z coordinate
            var rx = 0 // init relative movement in x
            var ry = 0 // init relative movement in y
            var rz = 0 // init relative movement in z    
            for (var seg = 0; seg < mod.path.length; ++seg) {
                //str += "(segment " + seg + " of " + mod.path.length + ")\n"
                //
                // move up to starting point
                //
                //str += "(move up to starting point)\n"
                str += "!ZZ0,0," + (ijog-lz) + ";\n"
                // get xyz from the path
                x = scale * mod.path[seg][0][0]
                y = scale * mod.path[seg][0][1]
                z = scale * mod.path[seg][0][2]
                // calculate
                rx = x - lx // calculate the relative x movement
                ry = y - ly // calculate the relative y movement
                rz = z - lz // calculate the relative z movement
                lx = x // store last x coordinate
                ly = y // store last y coordinate
                lz = z // store last z coordinate
                str += '!ZZ' + rx.toFixed(0) + ',' + ry.toFixed(0) + ',0;\n'
                //
                // move down
                //
                //str += "(move down)\n"
                str += '!ZZ0,0,' + (rz-ijog).toFixed(0) + ';\n' // move down in relative coordinates
                //str += "(debug z=" + z.toFixed(0) + " rz=" + rz.toFixed(0) + " lz=" + lz.toFixed(0) + ")\n"
                for (var pt = 1; pt < mod.path[seg].length; ++pt) {
                    //
                    // move to next point
                    //
                    x = scale*mod.path[seg][pt][0]
                    y = scale*mod.path[seg][pt][1]
                    z = scale*mod.path[seg][pt][2]
                    rx = x - lx // calculate the relative x movement
                    ry = y - ly // calculate the relative y movement
                    rz = z - lz // calculate the relative z movement
                    lx = x // store last x coordinate
                    ly = y // store last y coordinate
                    lz = z // store last z coordinate
                    //str += "(debug2 z=" + z.toFixed(3) + " rz=" + rz.toFixed(3) + " lz=" + lz.toFixed(3) + ")\n"
                    str += '!ZZ' + rx.toFixed(0) + ',' + ry.toFixed(0) + ',' + rz.toFixed(0) + ';\n'
                }
                //
                // move up
                //
                //str += "(end of segment, move to surface)\n"
                str += '!ZZ0,0,' + (-lz).toFixed(0) + ';\n'
                lz = 0
            }
            //
            // move up
            //
            //str += "(end of path, move to jog level)\n"
            str += '!ZZ0,0,' + ijog + ';\n'
            //
            // turn off motor and move to view point
            //
            //str += "(stop motor)\n"
            str += "!MC0;"
            //str += "(move to view point)\n"
            str += "^VS10;!VZ10;\n" // set feed speed and plunge speed
            str += '^PA;!ZZ10160,15240,6050;\n'
        //
        // output string
        //
        var obj = {}
        obj.type = 'file'
        obj.name = mod.name + '.rml'
        obj.contents = str
        outputs.file.event(obj)
        // set position to undeterminate and deactivate SRM-20
        mod.homed = false
        initMachine()
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