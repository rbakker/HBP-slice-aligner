"use strict" 

export async function blobToCanvas(canvas, B,maxWidth,maxHeight) {
  let im;
  if (B.type == 'image/tiff') {
    const tiff = await tiff2rgba(B);
    const imageData = new ImageData(new Uint8ClampedArray(tiff.rgba.buffer),tiff.width,tiff.height);
    im = await createImageBitmap(imageData);
  } else {
    im = await createImageBitmap(B);
  }
  const w = im.width;
  const h = im.height;
  if (maxWidth/maxHeight > w/h) {
    // height priority
    canvas.height = maxHeight<h ? maxHeight : im.height;
    canvas.width = parseInt(Math.round(canvas.height*w/h));
  } else {
    // width priority
    canvas.width = maxWidth<w ? maxWidth : w;
    canvas.height = parseInt(Math.round(canvas.width*h/w));
  }
  const ctx = canvas.getContext('2d');
  ctx.drawImage(im,0,0,canvas.width,canvas.height);
}

export async function canvasFromBlob(B,maxWidth,maxHeight) {
  const canvas = document.createElement('canvas');
  await blobToCanvas(canvas, B,maxWidth,maxHeight);
  return canvas
}

// CLASS FILMSTRIP
export function filmStrip_class(container,rows,columns) {
  this.container = typeof container === 'string' ? document.getElementById(container) : container;
  this.selected = [];
  this.rows = rows || 8;
  this.columns = columns || 1;
}

filmStrip_class.prototype = {
  empty: function() {
    while (this.container.lastChild) {
      this.container.removeChild(this.container.lastChild);
    }
  },
  baseName: function(name) {
    for (let i=0; i<2; i++) {
      const parts = name.split('.');
      if (parts.length>1) {
        const ext = parts.pop();
        if (ext.length>4 || re.match(/\d+/,ext)) break;
      }
      name = parts.join('.')
    }
    if (ext.length<5 && name.length-ext.length>3) name = name.substr(0,name.length-ext.length)
    return name.replace('\\','/').split('/').pop();
  },
  add: async function(imageBlob,name) {
    const widthAvail = (this.container.clientWidth/this.columns)-6;
    const heightAvail = (this.container.clientHeight/this.rows)-6;
    const sizeAvail = widthAvail < heightAvail ? widthAvail : heightAvail;
    const wrap = document.createElement('div');
    let canvas;
    if (imageBlob) {
      canvas = await canvasFromBlob(imageBlob,widthAvail,heightAvail);
      wrap.style = 'display:inline-block;position:relative;border:3px solid white';
      wrap.appendChild(canvas);
    }
    const div = document.createElement('div');
    div.innerHTML = name;
    div.style = 'position:absolute;left:1em;bottom:0px;font-size:70%;background:#FFF8';
    wrap.appendChild(div);
    this.container.appendChild(wrap);
    return wrap;
  },
  select: function(selection2rgb) {
    const children = this.container.children;
    for (let idx of this.selected) {
      const ch = children[idx]
      if (ch) ch.style.border = '3px solid white';
    }
    for (let idx in selection2rgb) {
      const ch = children[idx]
      if (ch) ch.style.border = '3px solid '+selection2rgb[idx];
    }
    this.selected = Object.keys(selection2rgb);
  },
  focus: function() {
    this.container.tabIndex = 0;
    this.container.focus();    
  }
}

