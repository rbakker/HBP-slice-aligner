"use strict";
import { imageStack_class } from './imagestack.js'
import { blobToCanvas,canvasFromBlob,filmStrip_class } from './filmstrip.js'

const plotlyStyle = {
  'fixed': {
    'line': { 'color': '#666666', 'width': 2, 'visible': 'legendonly' },
    'soma': { 'color': '#00DD00' },
    'axon': { 'color': '#0066DD' },
    'dend': { 'color': '#FF0000' },
    'apic': { 'color': '#880000' },
    'up-e': { 'color': '#FF0044', 'visible': 'legendonly' },
    'down': { 'color': '#00DD99' }
  },
  'moving': {
    'line': { 'color': '#000000', 'width': 2, 'visible': 'legendonly' },
    'soma': { 'color': '#00DD00' },
    'axon': { 'color': '#AA00DD' },
    'dend': { 'color': '#FF0000' },
    'apic': { 'color': '#880000' },
    'up-e': { 'color': '#FF0044' },
    'down': { 'color': '#00DD99', 'visible': 'legendonly' }
  }
}

// essential matrix routines
function inv3x3(M) {
  const [a,b,c,x,d,e,f,y,g,h,i,z] = M;
  const aa = e*i-f*h;
  const bb = c*h-b*i;
  const cc = b*f-c*e;
  const dd = f*g-d*i;
  const ee = a*i-c*g;
  const ff = c*d-a*f;
  const gg = d*h-e*g;
  const hh = b*g-a*h;
  const ii = a*e-b*d;
  const det = a*aa+b*dd+c*gg;
  if (det==0) return undefined;
  return new Float32Array([aa/det,bb/det,cc/det,0,dd/det,ee/det,ff/det,0,gg/det,hh/det,ii/det,0]);
}

// EDITWINDOW CLASS
function editWindow_class(fixedDiv,movingDiv) {
  this.fixedDiv = typeof fixedDiv === 'string' ? document.getElementById(fixedDiv) : fixedDiv;
  this.movingDiv = typeof movingDiv === 'string' ? document.getElementById(movingDiv) : movingDiv;
  this.init();
}

editWindow_class.prototype = {
  plotly: undefined,
  edgeColor: [230,77,0],
  maxWidth: 2800,
  maxHeight: 2100,
  init: async function() {
    if (this.gm) {
      // already initialized, reset
      this.clear();
      return;
    }
    this.gm = await import('./jsm/gammacv.es6.js');
    for (let mode of ['fixed','moving']) {
      //const cv = this.gm.canvasCreate(100,100);
      //cv.style.height = '100%';
      const cv = new OffscreenCanvas(100,100);
      //this[mode+'Div'].appendChild(cv);
      this[mode+'Canvas'] = cv;
    }
    this.plotlyGraphDiv = document.getElementById('plotlyOverlay')
    window.addEventListener('resize', (event) => { 
      //this.plotlyGraphDiv.style.width = ''+this.fixedCanvas.clientWidth+'px';
      this.plotlyGraphDiv.style.width = '100%';
      //this.plotlyGraphDiv.style.height = ''+this.fixedCanvas.clientHeight+'px';
      this.plotlyGraphDiv.style.height = '100%';
    });
  },
  clearCanvas: function(cv) {
    const ctx = cv.getContext('2d');
    ctx.clearRect(0,0,cv.width,cv.height);
  },
  clear: function() {
    for (let cv of [this.fixedCanvas,this.movingCanvas]) this.clearCanvas(cv);
  },
  applyAffine: function(origTraceX,origTraceY,A,height) {
    const traceX = new Float32Array(origTraceX.length);
    const traceY = new Float32Array(origTraceY.length);
    A = inv3x3(A);
    for (let i=0; i<traceX.length; i++) {
      //traceX[i] = A[0]*origTraceX[i]+A[1]*(height-1-origTraceY[i])+A[2];
      traceX[i] = A[0]*origTraceX[i]+A[1]*origTraceY[i]+A[2];
      //traceY[i] = height-1-(A[4]*origTraceX[i]+A[5]*(height-1-origTraceY[i])+A[6]);
      traceY[i] = A[4]*origTraceX[i]+A[5]*origTraceY[i]+A[6];
    }
    return [traceX,traceY];
  },
  recenterTransform(transform,cx,cy) {
    const A0 = this.getMovingAffine(transform);
    transform.cx = parseFloat(cx);
    transform.cy = parseFloat(cy);
    const A = this.getMovingAffine(transform);
    transform.dx += A[2]-A0[2];
    transform.dy += A[6]-A0[6];
    return transform;
  },
  getMovingAffine: function(transform) {
    // compute affine matrix from angle and displacement, 
    // where angle is in degrees and positive rotates right. 
    const theta = -transform.angle*Math.PI/180;
    const ctrX = transform.cx;
    const ctrY = transform.cy;
    return new Float32Array([
     Math.cos(theta),-Math.sin(theta), -ctrX*Math.cos(theta)+ctrY*Math.sin(theta)+ctrX-transform.dx, 0,
     Math.sin(theta),Math.cos(theta), -ctrX*Math.sin(theta)-ctrY*Math.cos(theta)+ctrY-transform.dy, 0,
     0, 0, 1, 0,
    ]);
  },
  transformMovingImage: function(affine) {
    let canvas = this.movingCanvas;
    const tMatrix = new this.gm.Tensor('float32', [3, 1, 4], affine);
    // start from the preprocessed image
    let input = this.movingPreprocessedTensor;
    // add operation that applies the affine transformation
    input = this.gm.perspectiveProjection(input, tMatrix, input.shape);  
    // allocate output tensor
    const output = this.gm.tensorFrom(input);
    // run all operations
    const sess = new this.gm.Session();
    sess.init(input);
    sess.runOp(input, 0, output);
    // transfer output to canvas
    this.gm.canvasFromTensor(canvas, output);    
  },
  moveCenterOfRotation: function(transform) {
    const traceIndices = this.centerMarkerTraceIndices;
    if (traceIndices) {
      const xUpdates = [];
      const yUpdates = [];
      const graphDiv = this.plotlyGraphDiv;
      for (let idx of traceIndices) {
        xUpdates.push([]);
        yUpdates.push([]);
        graphDiv.data[idx].x = [transform.cx];
        graphDiv.data[idx].y = [transform.cy];
      }
      Plotly.extendTraces(graphDiv,{x:xUpdates,y:yUpdates},traceIndices);
    }
  },
  canvasToDataURL: function(cv) {
    if (cv.toDataURL) return cv.toDataURL();
    return cv.convertToBlob().then( (blob) => {
      const urlCreator = window.URL || window.webkitURL; 
      return urlCreator.createObjectURL(blob);
    } );
  },
  applyTransformation: async function(transform) {
    const movingAffine = this.getMovingAffine(transform);
    this.transformMovingImage(movingAffine);
    const xUpdates = [];
    const yUpdates = [];
    const traceIndices = [];
    const graphDiv = this.plotlyGraphDiv;
    const movingX = this.plotlyMovingX;
    const movingY = this.plotlyMovingY;
    if (!graphDiv) return;
    if (movingX && movingY) {
      const startIdx = 0;
      for (let i=0; i<movingX.length; i++) {
        let [traceX,traceY] = this.applyAffine(movingX[i],movingY[i],movingAffine,this.fixedCanvas.height);
        xUpdates.push(new Float32Array());
        yUpdates.push(new Float32Array());
        traceIndices.push(startIdx+i);
        graphDiv.data[startIdx+i].x = traceX;
        graphDiv.data[startIdx+i].y = traceY;
      }
      Plotly.extendTraces(graphDiv,{x:xUpdates,y:yUpdates},traceIndices);
    }
    this.moveCenterOfRotation(transform);
    // update background images of the plotly overlay
    const images = graphDiv.layout.images
    images[1].source = await this.canvasToDataURL(this.movingCanvas);
    const layoutChange = {
      images: images
    }
    Plotly.relayout(graphDiv,layoutChange)
  },
  makeBlackTransparent: function(previous) {
    return new this.gm.RegisterOperation("makeBlackTransparent")
    .Input("tSrc", "uint8")
    .Output("uint8")
    //.SetShapeFn(() => [height, width, 4])
    .LoadChunk("pickValue")
    .GLSLKernel(`
vec4 operation(float y, float x) {
  vec4 data = pickValue_tSrc(y, x);
  float alpha = (data.r+data.g+data.b)*0.333;
  return vec4(
    `+this.edgeColor[0]/255+`,
    `+this.edgeColor[1]/255+`,
    `+this.edgeColor[2]/255+`,
    alpha
  );
}
    `)
    .Compile({ tSrc: previous });
  },  
  preprocessMoving: function(input) {
    // operations always return a valid input for another operation.
    input = this.gm.grayscale(input);
    input = this.gm.gaussianBlur(input, 3, 3);
    input = this.gm.sobelOperator(input);
    input = this.gm.cannyEdges(input, 0.15, 0.75);
    input = this.makeBlackTransparent(input);
    
    // allocate output tensor
    const output = this.gm.tensorFrom(input);

    // run your operation
    const sess = new this.gm.Session();
    sess.init(input);
    sess.runOp(input, 0, output);
    return output;
  },
  tensorFromSource: async function(source,mediaType) {
    if (typeof source === 'string') {
      return this.gm.imageTensorFromURL(source,'uint8');
    } else {
      // assume unzipit object
      const B = await source.blob(mediaType);
      const canvas = await canvasFromBlob(B,this.maxWidth,this.maxHeight);
      const T = new this.gm.Tensor('uint8', [canvas.height, canvas.width, 4])
      this.gm.canvasToTensor(canvas,T);
      return T;
    }
  },
  sourceToCanvas: async function(canvas,source,mediaType) {
    if (typeof source === 'string') {
      const T = await this.gm.imageTensorFromURL(source,'uint8');
      const h = T.shape[0]
      const w = T.shape[1];
      if (this.maxWidth/this.maxHeight > w/h) {
        // height priority
        canvas.height = this.maxHeight<h ? this.maxHeight : im.height;
        canvas.width = parseInt(Math.round(canvas.height*w/h));
      } else {
        // width priority
        canvas.width = this.maxWidth<w ? this.maxWidth : w;
        canvas.height = parseInt(Math.round(canvas.width*h/w));
      }
      return this.gm.canvasFromTensor(canvas,T);
    } else {
      // assume unzipit object
      await source.blob(mediaType).then( (B) => blobToCanvas(canvas, B,this.maxWidth,this.maxHeight) )
      //const cv = source.blob(mediaType).then( (B) => canvasFromBlob(B,maxWidth,maxHeight) )
      //return canvasFromBlob(B,widthAvail,heightAvail);
      //const tensor = new this.gm.Tensor('uint8', [canvas.height, canvas.width, 4])
      //this.gm.canvasToTensor(canvas,tensor);
      //return tensor;
    }
  },
  plotlyFromSource: async function(layer) {
    if (layer.mediaType != 'application/plotly') return;
    if (typeof layer.source === 'string') {
      return fetch(layer.source).then( (response) => { 
        if (response.status == 200) return response.json();
        else return { error: response }
      } );
    } else {
      // assume unzipit object
      return layer.source.json();
    }
  },
  setFixed: async function(source,mediaType) {
    if (!source) return this.clearCanvas(this.fixedCanvas);
    this.sourceToCanvas(this.fixedCanvas, source,mediaType)
  },
  setMoving: async function(source,mediaType,transform) {
    if (!source) return this.clearCanvas(this.movingCanvas);
    await this.sourceToCanvas(this.movingCanvas, source,mediaType);
    let T = new this.gm.Tensor('uint8', [this.movingCanvas.height, this.movingCanvas.width, 4])
    await this.gm.canvasToTensor(this.movingCanvas, T);
    T = this.preprocessMoving(T);
    this.movingPreprocessedTensor = T;
    //this.movingCanvas.height = T.shape[0];
    //this.movingCanvas.width = T.shape[1];
    if (transform) this.transformMovingImage(this.getMovingAffine(transform))
    else this.gm.canvasFromTensor(this.movingCanvas,T);
  },
  initTrace: function(trace,mode,positionIndex) {
    trace = Object.assign({},trace);
    const traceX = new Float32Array(trace.x);
    const traceY = new Float32Array(trace.y);
    for (let i=0; i<traceX.length; i++) if (trace.x[i] === null) {
      traceX[i] = NaN;
      traceY[i] = NaN;
    }
    trace.x = traceX;
    trace.y = traceY;

    const startsWith = trace.name && trace.name.slice(0,4);
    const props = plotlyStyle[mode][startsWith];
    if (props) {
      trace.line.color = props.color;
      trace.line.width = props.width || 3;
      if (props.visible) {
        trace.visible = props.visible;
      }
    }
    trace.name += '('+positionIndex+')';
    return trace;
  },
  setPlotlyOverlay: async function(fixedSlice,movingSlice,transform,objectManager) {
    const [plotly,plotlyFixed,plotlyMoving] = await Promise.all([
      this.plotly || import("./jsm/plotly-2.18.1.min.js"),
      fixedSlice.layers && fixedSlice.layers[1] && this.plotlyFromSource(fixedSlice.layers[1]),
      movingSlice.layers && movingSlice.layers[1] && this.plotlyFromSource(movingSlice.layers[1])
    ]);
    // initialize plotly data
    const plotlyData = [];
    // moving part
    const movingAffine = this.getMovingAffine(transform);
    const movingX = this.plotlyMovingX = [];
    const movingY = this.plotlyMovingY = [];
    if (plotlyMoving && plotlyMoving.data) for (let trace of plotlyMoving.data) {
      trace = this.initTrace(trace,'moving',movingSlice.positionIndex);
      // save original, unrotated traces
      movingX.push(trace.x.slice(0))
      movingY.push(trace.y.slice(0))
      // apply transform
      const [traceX,traceY] = this.applyAffine(trace.x,trace.y,movingAffine,this.fixedCanvas.height);
      trace.x = traceX;
      trace.y = traceY;
      plotlyData.push(trace);
    }
    // fixed part
    if (plotlyFixed && plotlyFixed.data) for (let trace of plotlyFixed.data) {
      trace = this.initTrace(trace,'fixed',fixedSlice.positionIndex);
      plotlyData.push(trace);
    }
    // center of rotation
    const centerMarkers = [{ 
      x:[transform.cx], y:[transform.cy], type:'scatter', mode:'markers', 
      marker: { symbol: 'circle-open-dot',size:32,color:'#ffffff',line: { 'width':3 } }, 
      showlegend: false
    },{ 
      x:[transform.cx], y:[transform.cy], type:'scatter', mode:'markers', 
      marker: { symbol: 'circle-open-dot',size:32,color:'#000000',line: { 'width':1 } }, 
      showlegend: false, name: 'rotation ctr.'
    }]
    this.centerMarkerTraceIndices = [plotlyData.length,plotlyData.length+1];
    plotlyData.push(...centerMarkers);
    // figure layout
    const plotlyLayout = Object.assign( (plotlyFixed && plotlyFixed.layout) || (plotlyMoving && plotlyMoving.layout) || {}, {
      autosize: true,
      margin: { autoexpand: false, t:0, l:0, r:0, b:0, pad: 0 },
      paper_bgcolor: 'rgba(0,0.5,0,0.0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    } );
    if (!plotlyLayout.xaxis) plotlyLayout.xaxis = { range: [0,this.fixedCanvas.width] }
    plotlyLayout.xaxis.showgrid = false;
    if (!plotlyLayout.yaxis) plotlyLayout.yaxis = { range: [this.fixedCanvas.height,0] }  // reversed y-axis
    plotlyLayout.yaxis.showgrid = false;
    plotlyLayout.legend = { x: 0.02, y: 0.02, yanchor: 'bottom' }
console.log('this.fixedCanvas.width and height',this.fixedCanvas.width,this.fixedCanvas.height)
    plotlyLayout.images = [
      {
        "source": await this.canvasToDataURL(this.fixedCanvas),
        "xref": "x",
        "yref": "y",
        "x": 0,
        "y": 0,
        "sizex": this.fixedCanvas.width,
        "sizey": this.fixedCanvas.height,
        "sizing": "stretch",
        "opacity": 1.0,
        "xanchor": "left",
        "yanchor": "top",
        "layer": "below"
     }, {
        "source": await this.canvasToDataURL(this.movingCanvas),
        "xref": "x",
        "yref": "y",
        "x": 0,
        "y": 0,
        "sizex": this.movingCanvas.width,
        "sizey": this.movingCanvas.height,
        "sizing": "stretch",
        "opacity": 1.0,
        "xanchor": "left",
        "yanchor": "top",
        "layer": "below"
     }
    ];
    const plotlyConfig = {
      displayModeBar: false,
      responsive: true
    }
    const graphDiv = this.plotlyGraphDiv;
let [maxWidth,maxHeight] = [this.fixedDiv.clientWidth,this.fixedDiv.clientHeight];
if (maxWidth/maxHeight > this.fixedCanvas.width/this.fixedCanvas.height) {
  maxWidth = parseInt(maxHeight*this.fixedCanvas.width/this.fixedCanvas.height);
} else {
  maxHeight = parseInt(maxWidth*this.fixedCanvas.height/this.fixedCanvas.width);
}

    graphDiv.style.width = ''+maxWidth+'px';
    graphDiv.style.height = ''+maxHeight+'px';
    //graphDiv.style.width = ''+this.fixedDiv.clientWidth+'px';
    //graphDiv.style.height = ''+this.fixedDiv.clientHeight+'px';
console.log('graphDiv.style.width,graphDiv.style.height',graphDiv.style.width,graphDiv.style.height)
    Plotly.newPlot(graphDiv, plotlyData, plotlyLayout, plotlyConfig);
    
    const d3 = Plotly.d3;
    const gd = graphDiv;

    gd.addEventListener('click', (evt) => {
      if (evt.target.getAttribute('data-subplot')) {
        const bb = evt.target.getBoundingClientRect();
        const x = gd._fullLayout.xaxis.p2d(evt.clientX - bb.left);
        const y = gd._fullLayout.yaxis.p2d(evt.clientY - bb.top);
        objectManager.plotlySingleClick(x,y);
        console.log('Clicked on',x,y);
      }
    });
  }
}

// CLASS SLICEALIGNER
function sliceAligner_class() {
  let elem = document.getElementById('openImageStack');
  elem.addEventListener('change',(event) => this.openImageStack(event));
  elem.accept = '.zip,.nii,.nii.gz,.plotly';
  
  this.filmStrip = new filmStrip_class('filmStrip');
  this.filmStrip.container.addEventListener("keydown",(event)=>{this.filmstripKeydown(event)});
  this.editWindow = new editWindow_class('sliceFixed','sliceMoving')
  
  this.selectedSliceIndex = -1;
}

sliceAligner_class.prototype = {
  init: async function(files) {
    this.imageStack = new imageStack_class();
    await this.imageStack.init(files);
    // show images in filmstrip
    this.filmStrip.empty();
    for (let [i,slice] of this.imageStack.slices.entries()) {
      if (slice.layers && slice.layers.length>0) {
        // the first layer contains the background image
        const layer = slice.layers[0];
        let blob;
        if (layer) {
          if (typeof layer.source == 'string') {
            const response = await fetch(layer.source);
            blob = new Blob([await response.arrayBuffer()],{type:layer.mediaType});
          } else {
            blob = await layer.source.blob(layer.mediaType);
          }
        }
        let item = await this.filmStrip.add(blob,slice.name);
        item.addEventListener('click',(event) => { this.filmstripClickSlice(event,i) })
      }
    }
    this.filmStrip.focus();
    await this.editWindow.init();
    this.initEditorControls();    
    this.selectSlice(0);
  },
  getSliceIndexPair: function(sliceIndex) {
    return [sliceIndex+1,sliceIndex];
  },
  getSlicePair: function(sliceIndex) {
    const [fixedSliceIndex,movingSliceIndex] = this.getSliceIndexPair(sliceIndex);
    return [ this.imageStack.slices[fixedSliceIndex],this.imageStack.slices[movingSliceIndex] ];
  },
  selectSlice: async function(sliceIndex) {    
    const [fixedSlice,movingSlice] = this.getSlicePair(sliceIndex);
    if (fixedSlice && movingSlice) {
      const [fixedSliceIndex,movingSliceIndex] = this.getSliceIndexPair(sliceIndex);
      const selection2rgb = {};
      selection2rgb[fixedSliceIndex] = '#888';
      selection2rgb[movingSliceIndex] = 'rgb('+this.editWindow.edgeColor.join(',')+')';
      // set fixed slice
      await this.editWindow.setFixed(fixedSlice.layers[0].source,fixedSlice.layers[0].mediaType);
      let transforms = this.imageStack.transformations[fixedSlice.positionIndex];
      if (!transforms) transforms = this.imageStack.transformations[fixedSlice.positionIndex] = {};
      let transform = transforms[movingSlice.positionIndex];
      // set moving slice, and apply transform
      const movingImageLayer = (movingSlice.layers && movingSlice.layers[0]) || {}
      await this.editWindow.setMoving(movingImageLayer.source,movingImageLayer.mediaType,transform);
      let movingCanvas = this.editWindow.movingCanvas;
      if (!transform) transform = transforms[movingSlice.positionIndex] = { dx:0,dy:0,angle:0,cx:movingCanvas.width/2,cy:movingCanvas.height/2 }
      this.editWindow.setPlotlyOverlay(fixedSlice,movingSlice,transform,this);
      //if (transform) this.editWindow.applyTransformation(transform);
      this.selectedSliceIndex = sliceIndex; //Pair = [fixedSliceIndex,movingSliceIndex];
      this.setEditorState(transform);
      this.filmStrip.select(selection2rgb);
    }
  },
  plotlySingleClick: function(x,y) {
    const [fixedSlice,movingSlice] = this.getSlicePair(this.selectedSliceIndex);
    let transform = this.imageStack.transformations[fixedSlice.positionIndex][movingSlice.positionIndex];
    transform = this.editWindow.recenterTransform(transform,x,y)
    this.editWindow.moveCenterOfRotation(transform);
    this.setEditorState(transform);
  },
  onchangeAffine: function(event,changes) {
    const [fixedSlice,movingSlice] = this.getSlicePair(this.selectedSliceIndex);
    let transform = this.imageStack.transformations[fixedSlice.positionIndex][movingSlice.positionIndex];
    for (let [k,v] of Object.entries(changes)) transform[k] += v;
    this.editWindow.applyTransformation(transform);
    this.setEditorState(transform);
  },
  setEditorState(transform) {
    document.getElementById('moveX').innerHTML = transform.dx.toFixed(1);
    document.getElementById('moveY').innerHTML = transform.dy.toFixed(1);   
    document.getElementById('rotationAngle').innerHTML = transform.angle.toFixed(1);
    document.getElementById('ctrX').innerHTML = transform.cx.toFixed(1);
    document.getElementById('ctrY').innerHTML = transform.cy.toFixed(1);
  },
  initEditorControls: function() {
    document.getElementById('moveRight').addEventListener('click', (event) => this.onchangeAffine(event,{dx:1}));
    document.getElementById('moveLeft').addEventListener('click', (event) => this.onchangeAffine(event,{dx:-1}));
    document.getElementById('moveUp').addEventListener('click', (event) => this.onchangeAffine(event,{dy:-1}));
    document.getElementById('moveDown').addEventListener('click', (event) => this.onchangeAffine(event,{dy:1}));
    document.getElementById('rotateLeft1').addEventListener('click', (event) => this.onchangeAffine(event,{angle:-1}));
    document.getElementById('rotateLeft01').addEventListener('click', (event) => this.onchangeAffine(event,{angle:-0.1}));
    document.getElementById('rotateRight1').addEventListener('click', (event) => this.onchangeAffine(event,{angle:1}));
    document.getElementById('rotateRight01').addEventListener('click', (event) => this.onchangeAffine(event,{angle:0.1}));
  },
  filmstripClickSlice: function(event,sliceIndex) {
    this.selectSlice(sliceIndex);
  },
  filmstripKeydown: function(event) {
    if (event.keyCode == 38) this.selectSlice(this.selectedSliceIndex-1); // UP 
    if (event.keyCode == 40) this.selectSlice(this.selectedSliceIndex+1); // DOWN
  },
  openImageStack: async function(event) {
    await this.init(event.target.files);
  }
}

function run() {
  const sliceAligner = new sliceAligner_class();
  const testImages = [
    'sampledata/MS1821_2201_preprocessed.png',
    'sampledata/MS1821_2202_preprocessed.png',
    'sampledata/MS1821_2203_preprocessed.png',
    'sampledata/MS1821_2204_preprocessed.png',
    'sampledata/MS1821_2205_preprocessed.png',
    'sampledata/MS1821_2206_preprocessed.png',
    'sampledata/MS1821_2207_preprocessed.png',
    'sampledata/MS1821_2301_preprocessed.png',
    'sampledata/MS1821_2302_preprocessed.png',
    'sampledata/MS1821_2303_preprocessed.png',
    'sampledata/MS1821_2304_preprocessed.png',
    'sampledata/MS1821_2305_preprocessed.png',
    'sampledata/MS1821_2306_preprocessed.png',
    'sampledata/MS1821_2307_preprocessed.png',
    'sampledata/MS1821_2401_preprocessed.png',
    'sampledata/MS1821_2402_preprocessed.png',
    'sampledata/MS1821_2403_preprocessed.png',
    'sampledata/MS1821_2404_preprocessed.png',
    'sampledata/MS1821_2405_preprocessed.png',
    'sampledata/MS1821_2406_preprocessed.png',
    'sampledata/MS1821_2407_preprocessed.png',
    'sampledata/MS1821_2501_preprocessed.png',
    'sampledata/MS1821_2502_preprocessed.png',
    'sampledata/MS1821_2503_preprocessed.png',
    'sampledata/MS1821_2504_preprocessed.png',
    'sampledata/MS1821_2505_preprocessed.png',
    'sampledata/MS1821_2506_preprocessed.png',
    'sampledata/MS1821_2507_preprocessed.png',
    'sampledata/MS1821_3101_preprocessed.png',
    'sampledata/MS1821_3102_preprocessed.png',
    'sampledata/MS1821_3103_preprocessed.png',
    'sampledata/MS1821_3104_preprocessed.png',
    'sampledata/MS1821_3105_preprocessed.png',
    'sampledata/MS1821_3106_preprocessed.png',
    
    'sampledata/MS1821_2201_morphology.plotly',
    'sampledata/MS1821_2202_morphology.plotly',
    'sampledata/MS1821_2203_morphology.plotly',
    'sampledata/MS1821_2204_morphology.plotly',
    'sampledata/MS1821_2205_morphology.plotly',
    'sampledata/MS1821_2206_morphology.plotly',
    'sampledata/MS1821_2207_morphology.plotly',
    'sampledata/MS1821_2301_morphology.plotly',
    'sampledata/MS1821_2302_morphology.plotly',
    'sampledata/MS1821_2303_morphology.plotly',
    'sampledata/MS1821_2304_morphology.plotly',
    'sampledata/MS1821_2305_morphology.plotly',
    'sampledata/MS1821_2306_morphology.plotly',
    'sampledata/MS1821_2307_morphology.plotly',
    'sampledata/MS1821_2401_morphology.plotly',
    'sampledata/MS1821_2402_morphology.plotly',
    'sampledata/MS1821_2403_morphology.plotly',
    'sampledata/MS1821_2404_morphology.plotly',
    'sampledata/MS1821_2405_morphology.plotly',
    'sampledata/MS1821_2406_morphology.plotly',
    'sampledata/MS1821_2407_morphology.plotly',
    'sampledata/MS1821_2501_morphology.plotly',
    'sampledata/MS1821_2502_morphology.plotly',
    'sampledata/MS1821_2503_morphology.plotly',
    'sampledata/MS1821_2504_morphology.plotly',
    'sampledata/MS1821_2505_morphology.plotly',
    'sampledata/MS1821_2506_morphology.plotly',
    'sampledata/MS1821_2507_morphology.plotly',
    'sampledata/MS1821_3101_morphology.plotly',
    'sampledata/MS1821_3102_morphology.plotly',
    'sampledata/MS1821_3103_morphology.plotly',
    'sampledata/MS1821_3104_morphology.plotly',
    'sampledata/MS1821_3105_morphology.plotly',
    'sampledata/MS1821_3106_morphology.plotly'
  ];
  sliceAligner.init(testImages);
}

export { run };
