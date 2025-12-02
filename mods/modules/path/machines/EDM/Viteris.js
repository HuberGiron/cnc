//
// Viteris micro-EDM G-code
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2023
//
// This work may be reproduced, modified, distributed, performed, and 
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is 
// provided as is; no warranty is provided, and users accept all 
// liability.
//
// closure
//
(function(){
//
// module globals
//
var mod = {}
//
// name
//
var name = 'Viteris uEDM'
//
// initialization
//
var init = function() {
   mod.powerhigh.checked = true
   mod.polarityreg.checked = true
   mod.wirespeed.value = '3000'
   mod.tension.value = '2'
   mod.torque.value = '95'
   mod.roughon.checked = true
   mod.servorough.value = '8.5'
   mod.currentrough.value = '5.0'
   mod.ontimerough.value = '5'
   mod.offtimerough.value = '70'
   mod.finishon.checked = true
   mod.servofinish.value = '9.7'
   mod.currentfinish.value = '1.0'
   mod.ontimefinish.value = '1'
   mod.offtimefinish.value = '50'
   mod.movex.checked = true
   mod.originse.checked = true
   }
//
// inputs
//
var inputs = {
   path:{type:'',
      event:function(evt){
         mod.name = evt.detail.name
         mod.path = evt.detail.path
         mod.dpi = evt.detail.dpi
         mod.width = evt.detail.width
         mod.height = evt.detail.height
         make_path()
         }}}
//
// outputs
//
var outputs = {
   file:{type:'',
      event:function(str){
         obj = {}
         obj.name = mod.name+".gcf"
         obj.contents = str
         mods.output(mod,'file',obj)
         }}}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // power
   //
   div.appendChild(document.createTextNode('high power:'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'power'
      input.id = mod.div.id+'powerhigh'
      div.appendChild(input)
      mod.powerhigh = input
   div.appendChild(document.createTextNode('on'))
   div.appendChild(document.createElement('br'))
   //
   // polarity
   //
   div.appendChild(document.createTextNode('polarity:'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'polarity'
      input.id = mod.div.id+'polarityreg'
      div.appendChild(input)
      mod.polarityreg = input
   div.appendChild(document.createTextNode('regular'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'polarity'
      input.id = mod.div.id+'polarityrev'
      div.appendChild(input)
      mod.polarityrev = input
   div.appendChild(document.createTextNode('reverse'))
   div.appendChild(document.createElement('br'))
   //
   // wire speed
   //
   div.appendChild(document.createTextNode('wire speed: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.wirespeed = input
   div.appendChild(document.createTextNode(' (mm/s)'))
   div.appendChild(document.createElement('br'))
   //
   // tension
   //
   div.appendChild(document.createTextNode('wire tension: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.tension = input
   div.appendChild(document.createTextNode(' (N)'))
   div.appendChild(document.createElement('br'))
   //
   // torque
   //
   div.appendChild(document.createTextNode('wire torque: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.torque = input
   div.appendChild(document.createTextNode(' (%)'))
   div.appendChild(document.createElement('br'))
   //
   // rough cut
   //
   div.appendChild(document.createTextNode('rough cut:'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'rough'
      input.id = mod.div.id+'roughon'
      div.appendChild(input)
      mod.roughon = input
   div.appendChild(document.createTextNode('on'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'rough'
      input.id = mod.div.id+'roughoff'
      div.appendChild(input)
      mod.roughoff = input
   div.appendChild(document.createTextNode('off'))
   div.appendChild(document.createElement('br'))
   //
   // servo
   //
   div.appendChild(document.createTextNode('servo: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.servorough = input
   div.appendChild(document.createTextNode(' (V)'))
   div.appendChild(document.createElement('br'))
   //
   // current
   //
   div.appendChild(document.createTextNode('current: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.currentrough = input
   div.appendChild(document.createTextNode(' (A)'))
   div.appendChild(document.createElement('br'))
   //
   // on-time
   //
   div.appendChild(document.createTextNode('on-time: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.ontimerough = input
   div.appendChild(document.createTextNode(' (us)'))
   div.appendChild(document.createElement('br'))
   //
   // off-time
   //
   div.appendChild(document.createTextNode('off-time: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.offtimerough = input
   div.appendChild(document.createTextNode(' (us)'))
   div.appendChild(document.createElement('br'))
   //
   // finish cut
   //
   div.appendChild(document.createTextNode('finish cut:'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'finish'
      input.id = mod.div.id+'finishon'
      div.appendChild(input)
      mod.finishon = input
   div.appendChild(document.createTextNode('on'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'finish'
      input.id = mod.div.id+'finishoff'
      div.appendChild(input)
      mod.finishoff = input
   div.appendChild(document.createTextNode('off'))
   div.appendChild(document.createElement('br'))
   //
   // servo
   //
   div.appendChild(document.createTextNode('servo: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.servofinish = input
   div.appendChild(document.createTextNode(' (V)'))
   div.appendChild(document.createElement('br'))
   //
   // current
   //
   div.appendChild(document.createTextNode('current: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.currentfinish = input
   div.appendChild(document.createTextNode(' (A)'))
   div.appendChild(document.createElement('br'))
   //
   // on-time
   //
   div.appendChild(document.createTextNode('on-time: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.ontimefinish = input
   div.appendChild(document.createTextNode(' (us)'))
   div.appendChild(document.createElement('br'))
   //
   // off-time
   //
   div.appendChild(document.createTextNode('off-time: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.offtimefinish = input
   div.appendChild(document.createTextNode(' (us)'))
   div.appendChild(document.createElement('br'))
   //
   // initial move
   //
   div.appendChild(document.createTextNode('initial move:'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'move'
      input.id = mod.div.id+'movex'
      div.appendChild(input)
      mod.movex = input
   div.appendChild(document.createTextNode('x'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'move'
      input.id = mod.div.id+'movey'
      div.appendChild(input)
      mod.movey = input
   div.appendChild(document.createTextNode('y'))
   div.appendChild(document.createElement('br'))
   //
   // origin
   //
   div.appendChild(document.createTextNode('origin:'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'origin'
      input.id = mod.div.id+'originse'
      div.appendChild(input)
      mod.originse = input
   div.appendChild(document.createTextNode('SE'))
   div.appendChild(document.createElement('br'))
   }
//
// local functions
//
function make_path() {
   //
   // variables
   //
   var dx = 25.4*mod.width/mod.dpi // mm units
   var nx = mod.width
   var scale = dx/(nx-1)
   speed = parseFloat(mod.wirespeed.value)
   tension = parseFloat(mod.tension.value)
   torque = parseFloat(mod.torque.value)
   servo_rough = parseFloat(mod.servorough.value)
   current_rough = parseFloat(mod.currentrough.value)
   on_rough = parseFloat(mod.ontimerough.value)
   off_rough = parseFloat(mod.offtimerough.value)
   servo_finish = parseFloat(mod.servofinish.value)
   current_finish = parseFloat(mod.currentfinish.value)
   on_finish = parseFloat(mod.ontimefinish.value)
   off_finish = parseFloat(mod.offtimefinish.value)
   xoffset = 0
   yoffset = 0
   if (mod.originse.checked)
      xoffset = dx
   //
   // start
   //
   str = "G59 G90 G21 G15\n" // work piece offset, absolute positioning, metric units, XY rotation
   if (mod.polarityreg.checked)
      str += "M101 P1 Q0\n" // EDM generator, high power, polarity
   else
      str += "M101 P1 Q1\n"
   str += "M60 P"+speed+" Q"+tension+" R"+torque+"\n"
   str += "M07 P1\n" // fill the tank
   str += "M08\n" // wire guide flushing
   //
   // rough cut
   //
   if (mod.roughon.checked) {
      str += "M50 P1\n" //  adaptive feed rate,  rough cut
      str += "M52 P"+servo_rough+"\n"
      str += "M115 P"+current_rough+" Q"+on_rough+" R"+off_rough+"\n"
      str += "M110\n" // turn on EDM output
      //
      // follow segments
      //
      for (var seg = 0; seg < mod.path.length; ++seg) {
         //
         // move to starting point
         //
         x = scale*mod.path[seg][0][0]-xoffset
         y = scale*mod.path[seg][0][1]-yoffset
         if (mod.movex.checked) {
            str += "G00 X"+x.toFixed(4)+"\n"
            }
         else {
            str += "G00 Y"+y.toFixed(4)+"\n"
            }
         str += "G01 X"+x.toFixed(4)+" Y"+y.toFixed(4)+" F0.2\n"
         //
         // follow points
         //
         for (var pt = 1; pt < mod.path[seg].length; ++pt) {
            //
            // move to next point
            //
            x = scale*mod.path[seg][pt][0]-xoffset
            y = scale*mod.path[seg][pt][1]-yoffset
            str += "G01 X"+x.toFixed(4)+" Y"+y.toFixed(4)+"\n"
            }
         }
      }
   //
   // finish cut
   //
   if (mod.finishon.checked) {
      str += "M50 P3\n" // adaptive feed rate, finish cut)
      str += "M52 P"+servo_finish+"\n"
      str += "M115 P"+current_finish+" Q"+on_finish+" R"+off_finish+"\n"
      //
      // follow segments
      //
      for (var seg = 0; seg < mod.path.length; ++seg) {
         var npts = mod.path[seg].length
         //
         // move to ending point
         //
         x = scale*mod.path[seg][npts-1][0]-xoffset
         y = scale*mod.path[seg][npts-1][1]-yoffset
         str += "G00 X"+x.toFixed(4)+" Y"+y.toFixed(4)+"\n"
         //
         // follow points
         //
         for (var pt = npts-1; pt >= 0; --pt) {
            //
            // move to next point
            //
            x = scale*mod.path[seg][pt][0]-xoffset
            y = scale*mod.path[seg][pt][1]-yoffset
            str += "G01 X"+x.toFixed(4)+" Y"+y.toFixed(4)+"\n"
            }
         }
      }
   //
   // end
   //
   str += "M30\n" // program end
   //
   // output file
   //
   outputs.file.event(str)
   }
//
// return values
//
return ({
   mod:mod,
   name:name,
   init:init,
   inputs:inputs,
   outputs:outputs,
   interface:interface
   })
}())

