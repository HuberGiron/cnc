//
// path to Gerber
//
// Neil Gershenfeld 11/11/21
// 
// This work may be reproduced, modified, distributed, performed, and 
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is 
// provided as is; no warranty is provided, and users accept all 
// liability.
//
// Updated: Neil Gershenfeld
// Date: Oct 5 2024
// Comments: add filled Gerber holes
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
var name = 'path to Gerber'
//
// initialization
//
var init = function() {
   mod.fill.checked = true
   }
//
// inputs
//
var inputs = {
   imageInfo:{type:'',
      event:function(evt){
         mod.imageInfo = evt.detail
         }},
   path:{type:'',
      event:function(evt){
         mod.path = evt.detail
         }}}
//
// outputs
//
var outputs = {
   Gerber:{type:'',
      event:function(evt){
         mods.output(mod,'Gerber',evt)
         }}}
//
// interface
//
var interface = function(div){
   mod.div = div
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('plot'))
      btn.addEventListener('click',function(){
         plot()
         })
      div.appendChild(btn)
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('format:'))
   div.appendChild(document.createElement('br'))
   var formats = document.createElement('div');
   formats.style.textAlign = 'left'
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'format'
      input.id = mod.div.id+'fill'
      input.checked = true
      formats.appendChild(input)
   mod.fill = input
   formats.appendChild(document.createTextNode('fill'))
   formats.appendChild(document.createElement('br'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'format'
      input.id = mod.div.id+'outline'
      formats.appendChild(input)
   mod.outline = input
   formats.appendChild(document.createTextNode('outline'))
   formats.appendChild(document.createElement('br'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'format'
      input.id = mod.div.id+'outline'
      formats.appendChild(input)
   mod.drill = input
   formats.appendChild(document.createTextNode('drill'))
   div.appendChild(formats)
   }
//
// local functions
//
function gformat(x) {
   // 6.6 omit leading
   var s = x.toFixed(6)
   s = s.substr(0,s.length-7)+s.substr(-6,6)
   return s
   }
//
function eformat(x) {
   // 2.4 omit trailing
   var s = (x/100).toFixed(6).substr(2)
   return s
   }
//
function plot() {
   var imgwidth = mod.imageInfo.width/parseFloat(mod.imageInfo.dpi)
   var imgheight = mod.imageInfo.height/parseFloat(mod.imageInfo.dpi)
   var x,y
   //
   str = ''
   //
   if (mod.fill.checked == true) {
      str += "%MOIN*%\n" // inch units
      str += "%LPD*%\n" // layer dark
      str += "%FSLAX66Y66*%\n" // format absolute 6.6
      str += "G01*\n" // linear interpolation
      for (var seg = 0; seg < mod.path.length; ++seg) {
         // 
         // find segment orientation
         //
         sum = 0
         for (var pt = 0; pt < (mod.path[seg].length-1); ++pt) {
            var x0 = imgwidth*mod.path[seg][pt][0]/(mod.imageInfo.width-1)
            var y0 = imgheight*mod.path[seg][pt][1]/(mod.imageInfo.height-1)
            var x1 = imgwidth*mod.path[seg][pt+1][0]/(mod.imageInfo.width-1)
            var y1 = imgheight*mod.path[seg][pt+1][1]/(mod.imageInfo.height-1)
            sum += x0*y1-x1*y0
            }
         //
         // draw filled segments
         //
         if (sum < 0) {
            str += "%LPD*%\n" // layer dark
            str += "G36*\n"
            x = imgwidth*mod.path[seg][0][0]/(mod.imageInfo.width-1)
            y = imgheight*mod.path[seg][0][1]/(mod.imageInfo.height-1)
            str += 'X'+gformat(x)+'Y'+gformat(y)+'D02*\n'
            for (var pt = 1; pt < mod.path[seg].length; ++pt) {
               var x = imgwidth*mod.path[seg][pt][0]/(mod.imageInfo.width-1)
               var y = imgheight*mod.path[seg][pt][1]/(mod.imageInfo.height-1)
               str += 'X'+gformat(x)+'Y'+gformat(y)+'D01*\n'
               }
            x = imgwidth*mod.path[seg][0][0]/(mod.imageInfo.width-1)
            y = imgheight*mod.path[seg][0][1]/(mod.imageInfo.height-1)
            str += 'X'+gformat(x)+'Y'+gformat(y)+'D01*\n'
            str += "G37*\n"
            }
         }
      for (var seg = 0; seg < mod.path.length; ++seg) {
         // 
         // find segment orientation
         //
         sum = 0
         for (var pt = 0; pt < (mod.path[seg].length-1); ++pt) {
            var x0 = imgwidth*mod.path[seg][pt][0]/(mod.imageInfo.width-1)
            var y0 = imgheight*mod.path[seg][pt][1]/(mod.imageInfo.height-1)
            var x1 = imgwidth*mod.path[seg][pt+1][0]/(mod.imageInfo.width-1)
            var y1 = imgheight*mod.path[seg][pt+1][1]/(mod.imageInfo.height-1)
            sum += x0*y1-x1*y0
            }
         //
         // draw hole segments
         //
         if (sum >= 0) {
            str += "%LPC*%\n" // layer clear
            str += "G36*\n"
            x = imgwidth*mod.path[seg][0][0]/(mod.imageInfo.width-1)
            y = imgheight*mod.path[seg][0][1]/(mod.imageInfo.height-1)
            str += 'X'+gformat(x)+'Y'+gformat(y)+'D02*\n'
            for (var pt = (mod.path[seg].length-1); pt > 0; --pt) {
               var x = imgwidth*mod.path[seg][pt][0]/(mod.imageInfo.width-1)
               var y = imgheight*mod.path[seg][pt][1]/(mod.imageInfo.height-1)
               str += 'X'+gformat(x)+'Y'+gformat(y)+'D01*\n'
               }
            x = imgwidth*mod.path[seg][0][0]/(mod.imageInfo.width-1)
            y = imgheight*mod.path[seg][0][1]/(mod.imageInfo.height-1)
            str += 'X'+gformat(x)+'Y'+gformat(y)+'D01*\n'
            str += "G37*\n"
            }
         }
      str += "M02*\n"
      var obj = {}
      obj.type = 'file'
      obj.name = mod.imageInfo.name+'-fill.gbr'
      obj.contents = str
      outputs.Gerber.event(obj)
      }
   else if (mod.outline.checked == true) {
      str += "%MOIN*%\n" // inch units
      str += "%LPD*%\n" // layer dark
      str += "%FSLAX66Y66*%\n" // format absolute 6.6
      str += "G01*\n" // linear interpolation
      str += "%ADD10C,0.001*%\n"
      str += "D10*\n"
      for (var seg = 0; seg < mod.path.length; ++seg) {
         x = imgwidth*mod.path[seg][0][0]/(mod.imageInfo.width-1)
         y = imgheight*mod.path[seg][0][1]/(mod.imageInfo.height-1)
         str += 'X'+gformat(x)+'Y'+gformat(y)+'D02*\n'
         for (var pt = 1; pt < mod.path[seg].length; ++pt) {
            var x = imgwidth*mod.path[seg][pt][0]/(mod.imageInfo.width-1)
            var y = imgheight*mod.path[seg][pt][1]/(mod.imageInfo.height-1)
            str += 'X'+gformat(x)+'Y'+gformat(y)+'D01*\n'
            }
         x = imgwidth*mod.path[seg][0][0]/(mod.imageInfo.width-1)
         y = imgheight*mod.path[seg][0][1]/(mod.imageInfo.height-1)
         str += 'X'+gformat(x)+'Y'+gformat(y)+'D01*\n'
         }
      str += "M02*\n"
      var obj = {}
      obj.type = 'file'
      obj.name = mod.imageInfo.name+'-outline.gbr'
      obj.contents = str
      outputs.Gerber.event(obj)
      }
   else if (mod.drill.checked == true) {
      var ds = []
      var xs = []
      var ys = []
      var sx,sy,sd,x0,y0,d0
      for (var seg = 0; seg < mod.path.length; ++seg) {
         //
         // find center
         //
         sx = sy = 0
         for (var pt = 0; pt < mod.path[seg].length; ++pt) {
            sx += imgwidth*mod.path[seg][pt][0]/(mod.imageInfo.width-1)
            sy += imgheight*mod.path[seg][pt][1]/(mod.imageInfo.height-1)
            }
         x0 = sx/mod.path[seg].length
         y0 = sy/mod.path[seg].length
         sd = 0
         //
         // find diameter
         //
         for (var pt = 0; pt < mod.path[seg].length; ++pt) {
            x = imgwidth*mod.path[seg][pt][0]/(mod.imageInfo.width-1)
            y = imgheight*mod.path[seg][pt][1]/(mod.imageInfo.height-1)
            sd += 2*Math.sqrt((x-x0)*(x-x0)+(y-y0)*(y-y0))
            }
         d0 = sd/mod.path[seg].length
         xs.push(x0)
         ys.push(y0)
         ds.push(d0)
         }
      //
      // sort diameters
      //
      var drills = {}
      var tool = 0
      for (var hole = 0; hole < ds.length; ++hole) {
         key = ds[hole].toFixed(3).toString()
         if (key in drills)
            drills[key].push(hole)
         else {
            tool += 1
            drills[key] = [tool,hole]
            }
         }
      //
      // write file
      //
      str += "M48\n" // start of header
      str += "INCH,LZ\n" // inch units with leading zeros
      str += "VER,1\n" // version 1
      str += "FMAT,2\n" // format 2
      for (var key in drills) {
         str += 'T'+drills[key][0]+'C'+key+"\n" // define tools
         }
      str += "M95\n" // end of header
      str += "G05\n" // drill mode
      for (var key in drills) {
         str += 'T'+drills[key][0]+'\n' // tool selection
         for (var i = 1; i < drills[key].length; ++i) {
            var hole = drills[key][i]
            str += 'X'+eformat(xs[hole])+'Y'+eformat(ys[hole])+'\n'
            }
         }
      str += "M30\n" // end of program
      var obj = {}
      obj.type = 'file'
      obj.name = mod.imageInfo.name+'-drill.xln'
      obj.contents = str
      outputs.Gerber.event(obj)
      }
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

