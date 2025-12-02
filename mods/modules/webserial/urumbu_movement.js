//
// Program movements for Urumbu system
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2017
// Modified by Francisco Sanchez 31-Jan-2020
// Modified by Jani Ylioja 2023
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
    var name = 'Urumbu movement programmer'
    //
    // initialization
    //
    var init = function() {
        mod.text.value = 'Use: x,X,y and Y to move.'
    }
    //
    // inputs
    //
    var inputs = {
        text: {
            type: '',
            event: function(evt) {
                mod.text.value = evt.detail
            }
        }
    }
    //
    // outputs
    //
    var outputs = {
   X:{type:'character',
      event:function(byte){
         mods.output(mod,'X',byte)
         }
      },
   Y:{type:'character',
      event:function(byte){
         mods.output(mod,'Y',byte)
         }
      },
   

   // Uncomment these to add Z output
   //Z:{type:'character',
   //   event:function(byte){
   //      mods.output(mod,'Z',byte)
   //      }
   //   }
   }

    var interface = function(div) {
        mod.div = div
        //
        // file input control
        //
        var file = document.createElement('input')
        file.setAttribute('type', 'file')
        file.setAttribute('id', div.id + 'file_input')
        file.style.position = 'absolute'
        file.style.left = 0
        file.style.top = 0
        file.style.width = 0
        file.style.height = 0
        file.style.opacity = 0
        file.addEventListener('change', function() {
            text_read_handler()
        })
        div.appendChild(file)
        mod.file = file
        //
        // text
        //
        var text = document.createElement('textarea')
        text.setAttribute('rows', mods.ui.rows)
        text.setAttribute('cols', mods.ui.cols)
        text.addEventListener('input', function() {
    
        })
        //
        // watch textarea for resize
        //
        new MutationObserver(update_module).observe(text, {
            attributes: true,
            attributeFilter: ["style"]
        })
        div.appendChild(text)
        mod.text = text
        div.appendChild(document.createElement('br'))
        //
        // file select button
        //
        var btn = document.createElement('button')
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('select text file'))
        btn.addEventListener('click', function() {
            var file = document.getElementById(div.id + 'file_input')
            file.value = null
            file.click()
        })
        div.appendChild(btn)
        div.appendChild(document.createElement('br'))
    }
    //
    // local functions
    //
    // read handler
    //
    function text_read_handler(event) {
        //
        // read as text
        //
        var file_reader = new FileReader()
        file_reader.onload = text_load_handler
        var input_file = mod.file.files[0]
        file_reader.readAsText(input_file)
    }
    //
    // load handler
    //
    function text_load_handler(event) {
        mod.text.value = event.target.result
        

      //Tähän runneri
          var str = mod.text.value;
          var length = str.length;
          console.log(length);
          var n = 0;
    var interval = setInterval(function(){
         var result = str.slice(n , n+1);
         n++;
         if(n >= length){clearInterval(interval);}

         switch (result) {
            case 'x':
              outputs.X.event('f')
              break;
            case 'X':
              outputs.X.event('r')
              break;
            case 'y':
              outputs.Y.event('f')
              break;
            case 'Y':
              outputs.Y.event('r')
              break;

    // Uncomment these to add z-axis
    //      case 'z':
    //        outputs.Z.event('f')
    //        break;
    //      case 'Z':
    //        outputs.Z.event('r')
    //        break;
         }
         
      }, 100); // steps in milliseconds
    }
  



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
