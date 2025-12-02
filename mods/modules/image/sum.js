//
// image sum
//
// Quentin Bolsee
// (c) Massachusetts Institute of Technology 2024
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
    var name = 'image sum'
    //
    // initialization
    //
    var init = function() { }
    //
    // inputs
    //
    var inputs = {
        image1: {
            type: 'RGBA',
            event: function(evt) {
                mod.input1 = evt.detail
                var ctx = mod.img1.getContext("2d")
                ctx.canvas.width = mod.input1.width
                ctx.canvas.height = mod.input1.height
                ctx.putImageData(mod.input1, 0, 0)
                if (mod.input2 !== undefined) {
                    image_sum()
                }
            }
        },
        image2: {
            type: 'RGBA',
            event: function(evt) {
                mod.input2 = evt.detail
                var ctx = mod.img2.getContext("2d")
                ctx.canvas.width = mod.input2.width
                ctx.canvas.height = mod.input2.height
                ctx.putImageData(mod.input2, 0, 0)
                if (mod.input1 !== undefined) {
                    image_sum()
                }
            }
        }
    }
    //
    // outputs
    //
    var outputs = {
        image: {
            type: 'RGBA',
            event: function() {
                var ctx = mod.img2.getContext("2d")
                var img = ctx.getImageData(0,0,mod.img2.width,mod.img2.height)
                mods.output(mod,'image',img)
            }
        }
    }
    //
    // interface
    //
    var interface = function(div) {
        mod.div = div
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
        mod.img1 = canvas
        var canvas = document.createElement('canvas')
        mod.img2 = canvas
        //
        // view button
        //
        var btn = document.createElement('button')
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('view'))
        btn.addEventListener('click', function() {
            var win = window.open('')
            var btn = document.createElement('button')
            btn.appendChild(document.createTextNode('close'))
            btn.style.padding = mods.ui.padding
            btn.style.margin = 1
            btn.addEventListener('click', function() {
                win.close()
            })
            win.document.body.appendChild(btn)
            win.document.body.appendChild(document.createElement('br'))
            var canvas = document.createElement('canvas')
            canvas.width = mod.img2.width
            canvas.height = mod.img2.height
            win.document.body.appendChild(canvas)
            var ctx = canvas.getContext("2d")
            ctx.drawImage(mod.img2, 0, 0)
        })
        div.appendChild(btn)
    }
    //
    // local functions
    //
    function image_sum() {
        var blob = new Blob(['(' + worker.toString() + '())'])
        var url = window.URL.createObjectURL(blob)
        var webworker = new Worker(url)
        webworker.addEventListener('message', function(evt) {
            window.URL.revokeObjectURL(url)
            var h = mod.img2.height
            var w = mod.img2.width
            var buf = new Uint8ClampedArray(evt.data.buffer2)
            var imgdata = new ImageData(buf,w,h)
            var ctx = mod.img2.getContext("2d")
            ctx.putImageData(imgdata,0,0)
            if (w > h) {
                var x0 = 0
                var y0 = mod.canvas.height * .5 * (1 - h / w)
                var wd = mod.canvas.width
                var hd = mod.canvas.width * h / w
            } else {
                var x0 = mod.canvas.width * .5 * (1 - w / h)
                var y0 = 0
                var wd = mod.canvas.height * w / h
                var hd = mod.canvas.height
            }
            var ctx = mod.canvas.getContext("2d")
            ctx.clearRect(0,0,mod.canvas.width,mod.canvas.height)
            ctx.drawImage(mod.img2,x0,y0,wd,hd)
            webworker.terminate()
            outputs.image.event()
            })
        var ctx = mod.canvas.getContext("2d")
        ctx.clearRect(0, 0, mod.canvas.width, mod.canvas.height)
        var ctx = mod.img1.getContext("2d")
        ctx.putImageData(mod.input1,0,0)
        var img1 = ctx.getImageData(0,0,mod.img1.width,mod.img1.height)
        var ctx = mod.img2.getContext("2d")
        ctx.putImageData(mod.input2,0,0)
        var img2 = ctx.getImageData(0,0,mod.img2.width,mod.img2.height)
        webworker.postMessage({
            height: mod.input1.height,
            width: mod.input1.width,
            buffer1: img1.data.buffer,
            buffer2: img2.data.buffer
        }, [img2.data.buffer])
    }

    function worker() {
        self.addEventListener('message', function(evt) {
            var h = evt.data.height
            var w = evt.data.width
            var buf1 = new Uint8ClampedArray(evt.data.buffer1)
            var buf2 = new Uint8ClampedArray(evt.data.buffer2)

            for (var row = 0; row < h; ++row) {
                for (var col = 0; col < w; ++col) {
                    buf2[(h-1-row)*w*4+col*4+0] = Math.min(255, buf1[(h-1-row)*w*4+col*4+0]+buf2[(h-1-row)*w*4+col*4+0])
                    buf2[(h-1-row)*w*4+col*4+1] = Math.min(255, buf1[(h-1-row)*w*4+col*4+1]+buf2[(h-1-row)*w*4+col*4+1])
                    buf2[(h-1-row)*w*4+col*4+2] = Math.min(255, buf1[(h-1-row)*w*4+col*4+2]+buf2[(h-1-row)*w*4+col*4+2])
                    buf2[(h-1-row)*w*4+col*4+3] = Math.max(buf1[(h-1-row)*w*4+col*4+3], buf2[(h-1-row)*w*4+col*4+3])
                }
            }
            self.postMessage({
                buffer2: buf2.buffer
            }, [buf2.buffer])
        })
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
