//
// line scan
//
// (c) MIT CBA Neil Gershenfeld 9/26/21
// 
// This work may be reproduced, modified, distributed, performed, and 
// displayed for any purpose, but must acknowledge the fab modules 
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
var name = 'line scan'
//
// initialization
//
var init = function() {
   mod.width.value = 10
   //
   // open scan window
   //
   var win = window.open('')
   win.document.title = "scan window"
   win.document.body.appendChild(document.createElement('br'))
   var canvas = document.createElement('canvas')
   win.document.body.appendChild(canvas)
   mod.scan = canvas
   mod.win = win
   }
//
// inputs
//
var inputs = {
   image:{type:'RGBA',
      event:function(evt) {
         scanloop(evt.detail)
         }
      }
   }
//
// outputs
//
var outputs = {
   trigger:{type:'event',
      event:function(){
         mods.output(mod,'trigger',null)
         }
      }
   }
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // on-screen drawing canvas
   //
   var canvas = document.createElement('canvas')
      canvas.width = mods.ui.canvas
      canvas.height = mods.ui.canvas
      canvas.style.backgroundColor = 'rgb(255,255,255)'
      div.appendChild(canvas)
      mod.img = canvas
   div.appendChild(document.createElement('br'))
   //
   // line width
   //
   div.appendChild(document.createTextNode('scan line width (pixels): '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         alert('width')
         })
      div.appendChild(input)
      mod.width = input
   //
   // background scan button
   //
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode(' '))
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('background scan'))
      btn.addEventListener('click',function(){
         linescan()
         })
      div.appendChild(btn)
   //
   // object scan button
   //
   div.appendChild(document.createTextNode(' '))
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('object scan'))
      btn.addEventListener('click',function(){
         linescan()
         })
      div.appendChild(btn)
   }
//
// local functions
//
// line scan
//
function linescan() {
   mod.l = parseFloat(mod.width.value)
   mod.w = mod.win.innerWidth
   mod.h = mod.win.innerHeight
   mod.scan.width = mod.w
   mod.scan.height = mod.h
   mod.y = 0
   mod.state = 'start'
   scanloop(null)
   }
//
// scan loop
//
function scanloop(input) {
   if (mod.state == 'start') {
      //
      // take background
      //
      var ctx = mod.scan.getContext("2d")
      ctx.fillStyle = "black"
      ctx.fillRect(0,0,mod.w,mod.h)
      mod.state = 'background'
      outputs.trigger.event()
      }
   else if (mod.state == 'background') {
      //
      // save background, start scan
      //
      mod.state = 'scan'
      outputs.trigger.event()
      }
   else if (mod.state == 'scan') {
      //
      // scan
      //
      mod.y += mod.l
      var ctx = mod.scan.getContext("2d")
      ctx.lineWidth = mod.l
      ctx.fillStyle = "black"
      ctx.fillRect(0,0,mod.w,mod.h)
      ctx.strokeStyle = "white"
      ctx.beginPath()
      ctx.moveTo(0,mod.y)
      ctx.lineTo(mod.w,mod.y)
      ctx.stroke()
      if (mod.y < mod.h)
         outputs.trigger.event()
      }
   }
//
// return values
//
return ({
   name:name,
   init:init,
   inputs:inputs,
   outputs:outputs,
   interface:interface
   })
}())
