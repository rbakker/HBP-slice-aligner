// CLASS TEXSLICER
export function texSlicer_class(texImage,canvasElem) {
  this.texImage = texImage;
  if (typeof canvasElem === 'string') canvasElem = document.getElementById(canvasElem);
  this.canvas = canvasElem;
}

texSlicer_class.prototype = {
  init: async function() {
    this.gm = await import('./gammacv.es6.js');
  },
  sliceSampler: function(input,slice) {
    const slicesOverX = this.texImage.slicesOverX;
    const slicesOverY = this.texImage.slicesOverY;
    const width = input.shape[1];
    const height = input.shape[0];
    const row = Math.floor(slice / slicesOverX);
    const y0 = row/slicesOverY;    
    const outputWidth = Math.floor(2*this.texImage.shape[0]/slicesOverX);
    const outputHeight = Math.floor(2*this.texImage.shape[1]/slicesOverY);
    return new this.gm.RegisterOperation("sliceSampler")
    .Input("tSrc", "uint8")
    .Uniform('slice', 'int', slice)
    .Uniform('slicesOverX', 'int', slicesOverX)
    .Uniform('slicesOverY', 'int', slicesOverY)
    .Uniform('width', 'int', width)
    .Uniform('height', 'int', height)
    .Output("uint8")
    .SetShapeFn(() => [height/slicesOverY, width/slicesOverX, 4])
    .LoadChunk("pickValue")
    .GLSLKernel(`
vec4 operation(float y, float x) {
  int row = slice / slicesOverX;
  int col = slice-row*slicesOverX;
  float rowHeight = float(height)/float(slicesOverY);
  float colWidth = float(width)/float(slicesOverX);
  vec4 data = pickValue_tSrc(float(row)*rowHeight+y,float(col)*colWidth+x);
  return data;
}
    `)
    .Compile({ tSrc: input });
  },  
  obliqueSliceSampler: function(input,origin,uX,uY) {
    return new this.gm.RegisterOperation("sliceSampler")
    .Input("tSrc", "uint8")
    .Output("uint8")
    //.SetShapeFn(() => [height, width, 4])
    .LoadChunk("pickValue")
    .GLSLKernel(`
vec4 operation(float y, float x) {
  vec4 data = pickValue_tSrc(y, x);
  return data;
}
    `)
    .Compile({ tSrc: input });
  },  
  tex2slice: async function() {
    const tex2d = await this.texImage.asTexture2d();
    let input = new this.gm.Tensor('uint8',[tex2d.height,tex2d.width,4],new Uint8Array(tex2d.data.buffer));
    
    // operations always return a valid input for another operation.
    input = this.sliceSampler(input,100);
    
    // allocate output tensor
    const output = this.gm.tensorFrom(input);

    // run your operation
    const sess = new this.gm.Session();
    sess.init(input);
    sess.runOp(input, 0, output);
    return output;
  }
}
