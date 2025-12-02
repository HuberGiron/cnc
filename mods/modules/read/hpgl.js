//
// read HPGL
//
// Eyal Perry
// (c) Massachusetts Institute of Technology 2021
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
var name = 'read HPGL'
//
// initialization
//
var init = function() {
   }
//
// inputs
//
var inputs = {
   HPGL:{type:'string',
      event:function(evt) {
         hpgl_load_handler({target:{result:evt.detail}})
       }}
}
//
// outputs
//
var outputs = {
  toolpath:{type:'object',
     event:function(){
        cmd = {}
        cmd.path = mod.path
        cmd.name = mod.name
        cmd.dpi = parseFloat(mod.dpitext.value)
        cmd.width = mod.width
        cmd.height = mod.height
        mods.output(mod,'toolpath',cmd)
        }}
}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // file input control
   //
   var file = document.createElement('input')
      file.setAttribute('type','file')
      file.setAttribute('id',div.id+'file_input')
      file.style.position = 'absolute'
      file.style.left = 0
      file.style.top = 0
      file.style.width = 0
      file.style.height = 0
      file.style.opacity = 0
      file.addEventListener('change',function() {
         hpgl_read_handler()
         })
      div.appendChild(file)
      mod.file = file
   //
   // on-screen drawing canvas
   //
   var canvas = document.createElement('canvas')
      canvas.width = mods.ui.canvas
      canvas.height = mods.ui.canvas
      canvas.style.backgroundColor = 'rgb(255,255,255)'
      div.appendChild(canvas)
      mod.canvas = canvas
   div.appendChild(document.createElement('br'))
   //
   // off-screen image canvas
   //
   var canvas = document.createElement('canvas')
      mod.img = canvas
   //
   // file select button
   //
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('select HPGL file'))
      btn.addEventListener('click',function(){
         var file = document.getElementById(div.id+'file_input')
         file.value = null
         file.click()
         })
      div.appendChild(btn)
   div.appendChild(document.createElement('br'))
   //
   // info div
   //
   var info = document.createElement('div')
      info.setAttribute('id',div.id+'info')
      info.appendChild(document.createTextNode('dpi: '))
      var input = document.createElement('input')
         input.type = 'text'
         input.size = 6
         input.addEventListener('input',function(){
            mod.dpi = parseFloat(mod.dpitext.value)
            mod.mmtext.nodeValue = (25.4*mod.width/mod.dpi).toFixed(3)
               +' x '+(25.4*mod.height/mod.dpi).toFixed(3)+' mm'
            mod.intext.nodeValue = (mod.width/mod.dpi).toFixed(3)
               +' x '+(mod.height/mod.dpi).toFixed(3)+' in'
            outputs.toolpath.event()
            })
         info.appendChild(input)
         mod.dpitext = input
      info.appendChild(document.createElement('br'))
      var text = document.createTextNode('px: ')
         info.appendChild(text)
         mod.pxtext = text
      info.appendChild(document.createElement('br'))
      var text = document.createTextNode('mm: ')
         info.appendChild(text)
         mod.mmtext = text
      info.appendChild(document.createElement('br'))
      var text = document.createTextNode('in: ')
         info.appendChild(text)
         mod.intext = text
      info.appendChild(document.createElement('br'))
      var text = document.createTextNode('')
         info.appendChild(text)
         mod.name = text
      div.appendChild(info)
   }
//
// local functions
//
// read handler
//
function hpgl_read_handler(event) {
   //
   // read as text
   //
   var file_reader = new FileReader()
   file_reader.onload = hpgl_load_handler
   var input_file = mod.file.files[0]
   var file_name = input_file.name
   mod.name.nodeValue = file_name
   file_reader.readAsText(input_file)
   }
//
// load handler
//
function hpgl_load_handler(event) {
   var cmds = event.target.result.split(";");
   var path = [];
   for (var i = 0; i < cmds.length; i++) {
     var cmd = cmds[i];
     if (cmd.startsWith("IN")) {
       // initialize, start a plotting job
     } else if (cmd.startsWith("SP")) {
       // select pen
       //console.log("Select pen:", cmd.substring(2));
     } else if (cmd.startsWith("PU")) {
       // pen up
       //console.log("Pen up", cmd.substring(2));
       var xy = cmd.substring(2).split(",");
     } else if (cmd.startsWith("PD")) {
       // pen down
       //console.log("Pen down:", cmd.substring(2));
       var pathRaw = cmd.substring(2).split(",");
       var segment = [];
       for (var j = 0; j < pathRaw.length; j += 2) {
         segment.push([parseInt(pathRaw[j]), parseInt(pathRaw[j+1])])
       }
       path.push(segment);
     }
   }

   if (path.length > 0 && path[0].length > 0){
     //
     // parse size
     //
     var minX = path[0][0][0];
     var maxX = path[0][0][0];
     var minY = path[0][0][1];
     var maxY = path[0][0][1];
     for (var segment in path) {
       for (var i = 0; i < path[segment].length; i++) {
         if (path[segment][i][0] < minX) minX = path[segment][i][0];
         if (path[segment][i][0] > maxX) maxX = path[segment][i][0];
         if (path[segment][i][1] < minY) minY = path[segment][i][1];
         if (path[segment][i][1] > maxY) maxY = path[segment][i][1];
       }
     }
     var x0 = minX;
     var width = maxX-minX;
     var y0 = minY;
     var height = maxY-minY;
     mod.width = width;
     mod.height = height;
     var dpi = Math.max(width, height) / 10
     mod.dpitext.value = dpi.toFixed(3)
     mod.pxtext.nodeValue = width+' x '+height+' px'
     mod.mmtext.nodeValue = (25.4*width/dpi).toFixed(3)
        +' x '+(25.4*height/dpi).toFixed(3)+' mm'
     mod.intext.nodeValue = (width/dpi).toFixed(3)
        +' x '+(height/dpi).toFixed(3)+' in'
     //
     // display
     //
     var scaleX = mod.canvas.width / width;
     var scaleY = mod.canvas.height / height;
     var scale = scaleX > scaleY ? scaleY : scaleX;

     var ctx = mod.canvas.getContext('2d');
     ctx.clearRect(0,0,mod.canvas.width,mod.canvas.height)

     for (var segment in path) {
       ctx.beginPath();
       ctx.moveTo((path[segment][0][0] - x0) * scale, (path[segment][0][1] - y0) * scale);
       for (var i = 1; i < path[segment].length; i++) {
         ctx.lineTo((path[segment][i][0] - x0) * scale, (path[segment][i][1] - y0) * scale);
       }
       ctx.strokeStyle = "red";
       ctx.stroke();
     }

     mod.path = path;
     outputs.toolpath.event();
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
