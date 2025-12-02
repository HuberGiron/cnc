//
// panelize toolpath
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2016
// Modified by Francisco Sanchez Arroyo 27-March-2022 (r139)
// Modified by Alan Han 14-April-2022
// 
// This work may be reproduced, modified, distributed, performed, and 
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is 
// provided as is; no warranty is provided, and users accept all 
// liability.
//
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
   var name = 'panelize toolpath'
   //
   // initialization
   //
   var init = function() {
      }
   //
   // inputs
   //
   var inputs = {
      toolpath:{type:'object',
         event:function(evt){
            mod.path = evt.detail.path
            mod.name = evt.detail.name
            mod.dpi = evt.detail.dpi
            mod.width = evt.detail.width
            mod.height = evt.detail.height
            mod.depth = evt.detail.depth
            panelize_path()
            outputs.toolpath.event()
            }}}
   //
   // outputs
   //
   var outputs = {
      toolpath:{type:'object',
         event:function(){
            cmd = {}
            cmd.path = mod.path
            cmd.name = mod.name
            cmd.dpi = mod.dpi
            cmd.width = mod.width
            cmd.height = mod.height
            mods.output(mod,'toolpath',cmd)
            }}}
   //
   // interface
   //
   var interface = function(div){
      mod.div = div
      //
      // info
      //
      var text = document.createTextNode('name: ')
         div.appendChild(text)
         mod.nametext = text
      div.appendChild(document.createElement('br'))
      var text = document.createTextNode('(mm)')
         div.appendChild(text)
         mod.mmtext = text
      div.appendChild(document.createElement('br'))
      var text = document.createTextNode('(in)')
         div.appendChild(text)
         mod.intext = text
      //
      // view
      //   
      div.appendChild(document.createElement('br'))   
      var btn = document.createElement('button')
         btn.style.padding = mods.ui.padding
         btn.style.margin = 1
         var span = document.createElement('span')
            var text = document.createTextNode('view')
               span.appendChild(text)
            btn.appendChild(span)
         btn.addEventListener('click',function(){
            open_view_window()
            })
         div.appendChild(btn)
      }
   //
   // local functions
   //
   // panelize_path
   //
   function panelize_path() {
      // input vars: 
      // path (multilevel array object)   - will append to this and return this
      //    [segments]
      //       [x,y,z] coordinates
      //          [x pos]
      //          [y pos]
      //          [z pos]
      // row         - number of copies in x direction
      // col         - number of copies in y direction
      //
      // row_offset  - offset border around each copy (redundant, handled by offset module)
      //
      // more inputs: (imageinfo? in correct units)
      // img_x       - width of copy
      // img_y       - height of copy

      var img_x = mod.width
      var img_y = mod.height
      var path = mod.path
      var working_path = [].concat(path)  //clones existing path

      for (var r = 0; r < row; ++r) {     //iterate row of panel
         for (var c = 0; c < col; ++c) {  //iterate col of panel
            //start iterating through segments and translating points
            for (var seg = 0; seg < path.length; ++seg) {
               for (var i = 0; i < path[seg].length; ++i) {    //iterate and modify points of segment
                  working_path[seg][i][0] = path[seg][i][0] + r*img_x   //row/x offset
                  working_path[seg][i][1] = path[seg][i][1] + c*img_y   //col/y offset
                  working_path[seg][i][2] = path[seg][i][2]             //no change
               }
            }
            path.push(working_path)    //append translated path to existing toolpath
            //move onto next path
         }
      }
      outputs.toolpath.event(path)
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
   
