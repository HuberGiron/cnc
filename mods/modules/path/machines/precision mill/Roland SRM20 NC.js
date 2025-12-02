//
// Roland SRM-20 milling machine
//
// Neil Gershenfeld
// (c) Massachusetts Institute of Technology 2016
// Modified by Francisco Sanchez Arroyo 26-March-2022
//
// This work may be reproduced, modified, distributed, performed, and
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is
// provided as is; no warranty is provided, and users accept all
// liability.
//
// IMPORTANT: SET THE MACHINE TO ACCEPT NC CODE IN VPANEL
// All coordinates in G53 machine coordinates
//
// closure
//
/*
G-codes:
G00X10.0
G90 (absolute positioning)
G21 (mm units)
#.0 numbers
G00 (positioning rapid move)
G01 (linear motion)
M03 (start spindle)
M05 (stop spindle)
F (feed rate mm/min, 6-1800)
203.2 (X) x 152.4 (Y) x 60.5 (Z) mm
*/
(function() {
    //
    // module globals
    //
    var mod = {}
    //
    // name
    //
    var name = 'Roland SRM-20 NC'
    //
    // initialization
    //
    var init = function() {

        mod.units = 100.0
        mod.speed.value = 4
        mod.jz.value = 2
        // tool position in machine coordinates G53
        mod.px.value = 0.0
        mod.py.value = 0.0
        mod.pz.value = 0.0
        // tool position in user coordinates
        mod.rx.value = 0.0
        mod.ry.value = 0.0
        mod.rz.value = 0.0
        // initial origin of user reference in G53 coordinates
        mod.ox.value = 0.0
        mod.oy.value = 0.0
        mod.oz.value = 0.0
        // home position in G53 (machine units)
        mod.hx = 0.0
        mod.hy = 152.4
        mod.hz = 0.0
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
            // G-code version
            //
            //
            var str = '%\n' // data start
            str += 'G90\n' // absolute units
            str += 'G21\n' // mm units
            str += 'G53X0.0Y0.0Z0.0\n' // move to origin G53
            str += 'M02\n' // end of program
            str += '%\n' // data end
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'originG53.nc'
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
            // G-code version
            //
            //
            var str = '%\n' // data start
            str += 'G90\n' // absolute units
            str += 'G21\n' // mm units
            str += 'G53X0.0Y0.0Z0.0\n' // move to origin G53
            str += 'M02\n' // end of program
            str += '%\n' // data end
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'originG53.nc'
            obj.contents = str
            outputs.file.event(obj)
            // set position in G53
            mod.px.value = (0.0).toFixed(1)
            mod.py.value = (0.0).toFixed(1)  
            mod.pz.value = (0.0).toFixed(1)  
            // update user coordinates with last stored position
            mod.rx.value = (-parseFloat(mod.ox.value)).toFixed(1)
            mod.ry.value = (-parseFloat(mod.oy.value)).toFixed(1)
            mod.rz.value = (-parseFloat(mod.oz.value)).toFixed(1)
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
            // G-code version
            //
            //
            var str = '%\n' // data start
            str += 'G90\n' // absolute units
            str += 'G21\n' // mm units
            str += 'G53X101.6Y152.4Z0.0\n' // move to view position
            str += 'M02\n' // end of program
            str += '%\n' // data end
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'view.nc'
            obj.contents = str
            outputs.file.event(obj)
            // set position in G53
            mod.px.value = (101.6).toFixed(1)
            mod.py.value = (152.4).toFixed(1)  
            mod.pz.value = (0.0).toFixed(1)  
            // update user coordinates to last stored position
            mod.rx.value = (101.6 - parseFloat(mod.ox.value)).toFixed(1)
            mod.ry.value = (152.4 - parseFloat(mod.oy.value)).toFixed(1)
            mod.rz.value = (-parseFloat(mod.oz.value)).toFixed(1)
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
            // G-code version
            //
            var str = '%\n' // data start
            str += 'G90\n' // absolute units
            str += 'G21\n' // mm units
            str += 'G53X0.0Y152.4Z0.0\n' // move to home position
            str += 'M02\n' // end of program
            str += '%\n' // data end
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'home.nc'
            obj.contents = str
            outputs.file.event(obj)
            // set position in G53
            mod.px.value = (0.0).toFixed(1)
            mod.py.value = (152.4).toFixed(1)  
            mod.pz.value = (0.0).toFixed(1)  
            // update user coordinates to last stored position
            mod.rx.value = (-parseFloat(mod.ox.value)).toFixed(1)
            mod.ry.value = (152.4 - parseFloat(mod.oy.value)).toFixed(1)
            mod.rz.value = (-parseFloat(mod.oz.value)).toFixed(1)

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
            if ((parseFloat(mod.py.value) + parseFloat(mod.step)) > 152.4) {
                beep(200,100,1,'sawtooth')
                return
            }
            //
            // Create message
            //
            var str = '%\n' // data start
            str += 'G91\n' // incremental coords
            str += 'G21\n' // mm units
            //str += 'G00Z' + parseFloat(mod.jz.value).toFixed(1) + '\n'
            str += 'G00Y' + mod.step + '\n' // move
            //str += 'G00Z-' + parseFloat(mod.jz.value).toFixed(1) + '\n'
            str += 'M02\n' // end of program
            str += '%\n' // data end
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'far.nc'
            obj.contents = str
            mods.output(mod, 'file', obj)
            mod.py.value = (parseFloat(mod.py.value) + parseFloat(mod.step)).toFixed(1)
            mod.ry.value = (parseFloat(mod.ry.value) + parseFloat(mod.step)).toFixed(1)
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
            if ((parseFloat(mod.pz.value) + parseFloat(mod.step)) > 0) {
                beep(200,100,1,'sawtooth')
                return
            }
            //
            // Create message
            //
            var str = '%\n' // data start
            str += 'G91\n' // incremental coords
            str += 'G21\n' // mm units
            str += 'G00Z' + mod.step + '\n' // move
            str += 'M02\n' // end of program
            str += '%\n' // data end
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'up.nc'
            obj.contents = str
            mods.output(mod, 'file', obj)
            mod.pz.value = (parseFloat(mod.pz.value) + parseFloat(mod.step)).toFixed(1)
            mod.rz.value = (parseFloat(mod.rz.value) + parseFloat(mod.step)).toFixed(1)
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
            if ((parseFloat(mod.px.value) - parseFloat(mod.step)) < 0) {
                beep(200,100,1,'sawtooth')
                return
            }
            //
            // Create message
            //
            var str = '%\n' // data start
            str += 'G91\n' // incremental coords
            str += 'G21\n' // mm units
            //str += 'G00Z' + parseFloat(mod.jz.value).toFixed(1) + '\n'
            str += 'G00X-' + mod.step + '\n' // move
            //str += 'G00Z-' + parseFloat(mod.jz.value).toFixed(1) + '\n'
            str += 'M02\n' // end of program
            str += '%\n' // data end
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'left.nc'
            obj.contents = str
            mods.output(mod, 'file', obj)
            mod.px.value = (parseFloat(mod.px.value) - parseFloat(mod.step)).toFixed(1)
            mod.rx.value = (parseFloat(mod.rx.value) - parseFloat(mod.step)).toFixed(1)
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
            if ((parseFloat(mod.px.value) + parseFloat(mod.step)) > 203.2) {
                beep(200,100,1,'sawtooth')
                return
            }
            //
            // Create message
            //
            var str = '%\n' // data start
            str += 'G91\n' // incremental coords
            str += 'G21\n' // mm units
            //str += 'G00Z' + parseFloat(mod.jz.value).toFixed(1) + '\n'
            str += 'G00X' + mod.step + '\n' // move
            //str += 'G00Z-' + parseFloat(mod.jz.value).toFixed(1) + '\n'
            str += 'M02\n' // end of program
            str += '%\n' // data end
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'right.nc'
            obj.contents = str
            mods.output(mod, 'file', obj)
            mod.px.value = (parseFloat(mod.px.value) + parseFloat(mod.step)).toFixed(1)
            mod.rx.value = (parseFloat(mod.rx.value) + parseFloat(mod.step)).toFixed(1)
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
            if ((parseFloat(mod.py.value) - parseFloat(mod.step)) < 0) {
                beep(200,100,1,'sawtooth')
                return
            }
            //
            // Create message
            //
            var str = '%\n' // data start
            str += 'G91\n' // incremental coords
            str += 'G21\n' // mm units
            //str += 'G00Z' + parseFloat(mod.jz.value).toFixed(1) + '\n'
            str += 'G00Y-' + mod.step + '\n' // move
            //str += 'G00Z-' + parseFloat(mod.jz.value).toFixed(1) + '\n'
            str += 'M02\n' // end of program
            str += '%\n' // data end
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'near.nc'
            obj.contents = str
            mods.output(mod, 'file', obj)
            mod.py.value = (parseFloat(mod.py.value) - parseFloat(mod.step)).toFixed(1)
            mod.ry.value = (parseFloat(mod.ry.value) - parseFloat(mod.step)).toFixed(1)
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
            if ((parseFloat(mod.py.value) - parseFloat(mod.step)) < -60.5) {
                beep(200,100,1,'sawtooth')
                return
            }
            //
            // Create message
            //
            var str = '%\n' // data start
            str += 'G91\n' // incremental coords
            str += 'G21\n' // mm units
            str += 'G00Z-' + mod.step + '\n' // move
            str += 'M02\n' // end of program
            str += '%\n' // data end
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'down.nc'
            obj.contents = str
            mods.output(mod, 'file', obj)
            mod.pz.value = (parseFloat(mod.pz.value) - parseFloat(mod.step)).toFixed(1)
            mod.rz.value = (parseFloat(mod.rz.value) - parseFloat(mod.step)).toFixed(1)
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
            var str = '%\n' // data start
            str += 'G21\n'
            str += 'G91\n' //relative coordinates
            str += 'G00Z' + parseFloat(mod.jz.value).toFixed(1) + '\n'
            str += 'G90G53X' + parseFloat(mod.ox.value).toFixed(1) + 'Y' + parseFloat(mod.oy.value).toFixed(1) + '\n'
            str += 'G91G00Z-' + parseFloat(mod.jz.value).toFixed(1) + '\n'
            str += 'M02\n'// end of program
            str += '%\n'  // data end
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'goxy0.nc'
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
            var str = '%\n' // data start
            str += 'G90\n'
            str += 'G21\n'
            str += 'F300.0\n'
            str += 'G01Z' + parseFloat(mod.oz.value).toFixed(1) + '\n' 
            str += 'M02\n'// end of program
            str += '%\n'  // data end
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'goz0.nc'
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
            var str = '%\n' // data start
            str += 'G90\n'
            str += 'G21\n'
            str += 'S8000M03\n' 
            str += 'M02\n'// end of program
            str += '%\n'  // data end
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'spon.nc'
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
            var str = '%\n' // data start
            str += 'G90\n'
            str += 'G21\n'
            str += 'M05\n' 
            str += 'M02\n'// end of program
            str += '%\n'  // data end
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'spoff.nc'
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
        mod.pz.value = (0.0).toFixed(1)
        // last stored position of user origin
        mod.rx.value = (-parseFloat(mod.ox.value)).toFixed(1)
        mod.ry.value = (-parseFloat(mod.oy.value)).toFixed(1)
        mod.rz.value = (-parseFloat(mod.oz.value)).toFixed(1)
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
            mod.step = (5).toFixed(1)
        } else if (mod.range_medium.checked) {
            mod.step = (1).toFixed(1)
        } else if (mod.range_small.checked) {
            mod.step = (0.1).toFixed(1)
        }
    }


        function make_path() {  // incremental
        var dx = 25.4*mod.width/mod.dpi
        var nx = mod.width
        var scale = dx/(nx-1)
        var speed = (parseFloat(mod.speed.value)*60.0).toFixed(1)
        var jog = parseFloat(mod.jz.value).toFixed(1)
        // init
        var str = "%\n" // start
        str += "(program init: mm, incremental)\n"
        str += "G91\n" // plot relative
        str += "G21\n" // mm
        str += "(zero coords of workpiece)\n"
        str += "G92X0Y0Z0\n"
        str += "(spindle 8k, motor on)\n"
        str += "S8000M03\n" // turn motor on
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
            str += "(segment " + seg + " of " + mod.path.length + ")\n"
            //
            // move up to starting point
            //
            str += "(move up to starting point)\n"
            str += "G00Z" + (jog-lz).toFixed(3) + "\n"
            // get xyz from the path
            x = scale*mod.path[seg][0][0]
            y = scale*mod.path[seg][0][1]
            z = scale*mod.path[seg][0][2]
            // calculate
            rx = x - lx // calculate the relative x movement
            ry = y - ly // calculate the relative y movement
            rz = z - lz // calculate the relative z movement
            lx = x // store last x coordinate
            ly = y // store last y coordinate
            lz = z // store last z coordinate
            str += "X" + rx.toFixed(3) + "Y" + ry.toFixed(3) + "\n"
            //
            // move down
            //
            str += "(move down)\n"
            str += "F" + speed + "\n" // set feed speed and plunge speed
            str += "G01Z" + (rz-jog).toFixed(3) + "\n" // move down in relative coordinates
            str += "(debug z=" + z.toFixed(3) + " rz=" + rz.toFixed(3) + " lz=" + lz.toFixed(3) + ")\n"
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
                str += "X" + rx.toFixed(3) + "Y" + ry.toFixed(3) + "Z" + rz.toFixed(3) + "\n"
            }
            //
            // move up
            //
            str += "(end of segment, move to surface)\n"
            str += "G00Z" + (-lz).toFixed(3) + "\n"
            lz = 0.0
        }
        //
        // move up
        //
        str += "(end of path, move to jog level)\n"
        str += "G00Z" + jog + "\n"

        //
        //
        // turn off motor and move to view point
        //
        str += "(stop motor)\n"
        str += "M05\n"
        str += "(move to view point)\n"
        str += "G90\n"
        str += "G53X101.6Y152.4Z0.0\n"
        str += "(end)\n"
        str += "M02\n"
        str += "%\n"
        //
        // output string
        //
        var obj = {}
        obj.type = 'file'
        obj.name = mod.name + '.nc'
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