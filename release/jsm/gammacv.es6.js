/**
 * GammaCV v0.3.6
 * @license MIT
 * @author Arkadiy Pilguk(apilguk@gmail.com)
 * @author Mihail Zachepilo(mihailzachepilo@gmail.com)
 * Copyright 2018 Peculiar Ventures and Pentatonica.
 * All rights reserved.
 */

"use strict";
var _createClass = function() {
    function t(t, e) {
        for (var a = 0; a < e.length; a++) {
            var n = e[a];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
        }
    }
    return function(e, a, n) {
        return a && t(e.prototype, a), n && t(e, n), e
    }
}();

function _classCallCheck(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}
var GraphNode = function() {
    function t(e) {
        _classCallCheck(this, t), this.id = t.GlobalCountIncrease(), this.name = e + ":" + this.id
    }
    return _createClass(t, null, [{
        key: "GlobalCountIncrease",
        value: function() {
            return t.GlobalNodesCount += 1, t.GlobalNodesCount
        }
    }]), t
}();
GraphNode.GlobalNodesCount = 0;
var _createClass$1 = function() {
    function t(t, e) {
        for (var a = 0; a < e.length; a++) {
            var n = e[a];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
        }
    }
    return function(e, a, n) {
        return a && t(e.prototype, a), n && t(e, n), e
    }
}();

function _classCallCheck$1(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}
var GLUniform = function() {
        function t(e, a, n, r) {
            _classCallCheck$1(this, t), this.gl = e, this.name = n, this.dtype = r, this.location = e.getUniformLocation(a, this.name)
        }
        return _createClass$1(t, [{
            key: "set",
            value: function(t) {
                var e = this.gl;
                switch (this.dtype) {
                    case "int":
                        e.uniform1i(this.location, t);
                        break;
                    case "float":
                        e.uniform1f(this.location, t);
                        break;
                    case "vec2":
                        e.uniform2fv(this.location, t);
                        break;
                    case "vec3":
                        e.uniform3fv(this.location, t);
                        break;
                    case "vec4":
                        e.uniform4fv(this.location, t);
                        break;
                    case "mat3":
                        e.uniformMatrix3fv(this.location, !1, t);
                        break;
                    case "mat4":
                        e.uniformMatrix4fv(this.location, !1, t);
                        break;
                    default:
                        return !1
                }
                return !0
            }
        }]), t
    }(),
    _createClass$2 = function() {
        function t(t, e) {
            for (var a = 0; a < e.length; a++) {
                var n = e[a];
                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
            }
        }
        return function(e, a, n) {
            return a && t(e.prototype, a), n && t(e, n), e
        }
    }();

function _classCallCheck$2(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}
var GLBuffer = function() {
        function t(e, a, n, r) {
            _classCallCheck$2(this, t), this.program = a, this.gl = e, this.name = n, this.dtype = r, this.location = e.getAttribLocation(this.program, this.name), this.ctx = e.createBuffer(), this.empty = new ArrayBuffer(1), "float" === r || "int" === r ? this.size = 1 : (this.size = parseInt(/\d/g.exec(r)[0], 10), e.enableVertexAttribArray(this.location))
        }
        return _createClass$2(t, [{
            key: "set",
            value: function(t) {
                var e = this.gl;
                this.bind(this.ctx), "int" === this.dtype ? e.bufferData(e.ELEMENT_ARRAY_BUFFER, new Uint16Array(t), e.STATIC_DRAW) : e.bufferData(e.ARRAY_BUFFER, new Float32Array(t), e.STATIC_DRAW)
            }
        }, {
            key: "bind",
            value: function() {
                var t = this.gl;
                "int" === this.dtype ? t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, this.ctx) : (t.bindBuffer(t.ARRAY_BUFFER, this.ctx), t.vertexAttribPointer(this.location, this.size, t.FLOAT, !1, 0, 0))
            }
        }, {
            key: "unbind",
            value: function() {
                var t = this.gl;
                "int" === this.dtype ? t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, null) : (t.bindBuffer(t.ARRAY_BUFFER, null), t.vertexAttribPointer(this.location, this.size, t.FLOAT, !1, 0, 0))
            }
        }, {
            key: "disable",
            value: function() {
                this.gl.disableVertexAttribArray(this.ctx)
            }
        }, {
            key: "enable",
            value: function() {
                this.gl.enableVertexAttribArray(this.ctx)
            }
        }, {
            key: "delete",
            value: function() {
                this.gl.deleteBuffer(this.ctx), this.program = null, this.gl = null, this.ctx = null
            }
        }]), t
    }(),
    vertexShader = "precision highp float;attribute vec3 aVertexPosition;attribute vec2 aTextureCoords;varying vec2 texCoords;void main(void){texCoords=aTextureCoords;gl_Position=vec4(aVertexPosition,1.0);}";

function _toConsumableArray(t) {
    if (Array.isArray(t)) {
        for (var e = 0, a = Array(t.length); e < t.length; e++) a[e] = t[e];
        return a
    }
    return Array.from(t)
}
var errorStart = "Error: An error occurred compiling the shaders: ";

function getOffset(t) {
    var e = /\d+\|(\s+)/.exec(t);
    return " ".repeat(e ? e[1].length : 2)
}

function prepareSourceLines(t) {
    var e = t.split("\n"),
        a = (e.length + 1).toString().length;
    return e = e.map(function(t, e) {
        return (e + 1).toString().padStart(a) + "|  " + t
    })
}

function calcErrorStats(t) {
    for (var e = 0, a = 0, n = 0; n < t.length; n += 1) /ERROR/.exec(t[n]) && (e += 1), /WARNING/.exec(t[n]) && (a += 1);
    return {
        errCount: e,
        warnCount: a
    }
}

function injectAll(t, e) {
    var a = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2],
        n = prepareSourceLines(t),
        r = (n.length + 1).toString().length,
        i = e.toString(),
        o = [],
        s = [];
    i.startsWith(errorStart) && (i = i.substr(errorStart.length));
    for (var l = i.split("\n"), u = calcErrorStats(l), c = 0, h = 0; h < l.length; h += 1) {
        var f = l[h],
            p = /0:(\d+)/.exec(f);
        if (p) {
            var d = +p[1] + c,
                v = " ".repeat(r) + "|" + getOffset(n[d - 1]);
            o.push(f + "\n" + n[d - 2] + "\n" + n[d - 1] + "\n" + v + "^\n" + n[d]);
            var g = a ? "%c" : "";
            n.splice(d, 0, "" + g + v + "^--" + f + g), a && (s.push("color: red;"), s.push("color: inherit;")), c += 1
        }
    }
    return {
        fullText: n.join("\n"),
        firstError: o[0],
        errorsStats: u,
        fullTextStyle: s
    }
}

function processError(t, e, a) {
    try {
        var n, r = injectAll(t, a),
            i = r.errorsStats;
        console.group("Error: An error occurred compiling the shader " + e + ": " + i.errCount + " ERRORS, " + i.warnCount + " WARNINGS"), console.log(r.firstError), console.groupCollapsed("Show more"), (n = console).log.apply(n, [r.fullText].concat(_toConsumableArray(r.fullTextStyle))), console.groupEnd(), console.groupEnd()
    } catch (t) {
        console.warn("Unable to process GLSG compiling error.")
    }
}
var parameters = {};

function testFloatTextures() {
    var t = document.createElement("canvas").getContext("webgl");
    if (!t) return !1;
    if (!t.getExtension("OES_texture_float")) return !1;
    var e = t.createFramebuffer(),
        a = t.createTexture();
    parameters.MAX_TEXTURE_SIZE = t.getParameter(t.MAX_TEXTURE_SIZE), t.bindTexture(t.TEXTURE_2D, a), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, 1, 1, 0, t.RGBA, t.FLOAT, null), t.bindFramebuffer(t.FRAMEBUFFER, e), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, a, 0);
    var n = t.checkFramebufferStatus(t.FRAMEBUFFER) === t.FRAMEBUFFER_COMPLETE,
        r = void 0;
    try {
        t.readPixels(0, 0, 1, 1, t.RGBA, t.FLOAT, new Float32Array(4)), r = t.getError() === t.NO_ERROR
    } catch (t) {
        r = !1
    }
    return n && r
}
var SOURCE_ENV = {
        SUPPORTS_FLOAT_TEXTURES: testFloatTextures(),
        DEBUG: !1,
        MAX_TEXTURE_SIZE: parameters.MAX_TEXTURE_SIZE
    },
    ENV = Object.assign({}, SOURCE_ENV);

function main(t) {
    var e = "\nvoid main(void) {\n  vec2 coords = gl_FragCoord.xy - 0.5;\n  vec4 result = operation(coords.y, coords.x);\n\n  gl_FragColor = result;\n}\n  ";
    return ENV.SUPPORTS_FLOAT_TEXTURES || "float32" !== t.dtype || (e = "\n    void main(void) {\n      vec2 coords = gl_FragCoord.xy;\n\n      highp float ox = floor(coords.x / 4.0);\n      float dx = floor(coords.x - ox * 4.0 + 0.5);\n    \n      vec4 result = operation(coords.y - 0.5, floor((coords.x - 0.5) / 4.0));\n\n      float value;\n\n      if (dx == 1.0) {\n        value = result.r;\n      } else if (dx == 2.0) {\n        value = result.g;\n      } else if (dx == 3.0) {\n        value = result.b;\n      } else if (dx == 4.0) {\n        value = result.a;\n      }\n    \n      gl_FragColor = encode_float(value);\n    }\n    "), e
}
var floatCode = "precision highp float;highp vec4 encode_float(highp float f){if(f==1./0.){return vec4(0.0,0.0,128.0,127.0)/255.0;}highp vec4 rgba;highp float e=5.0;highp float F=abs(f);highp float sign=step(0.0,-f);highp float exponent=floor(log2(F));highp float mantissa=(exp2(-exponent)*F);exponent=floor(log2(F)+127.0)+floor(log2(mantissa));rgba[0]=128.0*sign+floor(exponent*exp2(-1.0));rgba[1]=128.0*mod(exponent,2.0)+mod(floor(mantissa*64.0*2.0),128.0);rgba[2]=floor(mod(floor(mantissa*exp2(23.0-8.0)),exp2(8.0)));rgba[3]=floor(exp2(23.0)*mod(mantissa,exp2(-15.0)));return rgba.abgr/255.0;}float decode_float(highp vec4 rgba){rgba=rgba.abgr*255.0;highp float sign=1.0-step(128.0,rgba[0])*2.0;highp float exponent=2.0*mod(rgba[0],128.0)+step(128.0,rgba[1])-127.0;exponent=floor(exponent+0.5);highp float mantissa=mod(rgba[1],128.0)*32768.0*2.0+rgba[2]*256.0+rgba[3]+float(0x800000);highp float result=sign*mantissa*exp2(-23.0)*exp2(exponent);return result;}";

function _toConsumableArray$1(t) {
    if (Array.isArray(t)) {
        for (var e = 0, a = Array(t.length); e < t.length; e++) a[e] = t[e];
        return a
    }
    return Array.from(t)
}

function pick_value(t) {
    for (var e = Object.keys(t.input), a = [], n = function(n) {
            var r = e[n];
            if (!t.input[r].shape) return "continue";
            var i = [].concat(_toConsumableArray$1(t.input[r].shape)),
                o = i[1].toFixed(1),
                s = i[0].toFixed(1),
                l = (4 * i[1]).toFixed(1),
                u = function(t, e, a) {
                    return t + " " + e + "_" + r + "(float y, float x) {\n\treturn texture2D(" + r + ", vec2((x + 0.5) / " + o + ", (y + 0.5) / " + s + "))" + a + ";\n}"
                };
            ENV.SUPPORTS_FLOAT_TEXTURES || "float32" !== t.input[r].dtype || (u = function(t, e, a) {
                return "\n        " + t + " " + e + "_" + r + "(float y, float x) {\n          float r = decode_float(texture2D(" + r + ", vec2((x * 4.0 + 0.5) / " + l + ", y / " + s + ")));\n          float g = decode_float(texture2D(" + r + ", vec2((x * 4.0 + 1.5) / " + l + ", y / " + s + ")));\n          float b = decode_float(texture2D(" + r + ", vec2((x * 4.0 + 2.5) / " + l + ", y / " + s + ")));\n          float a = decode_float(texture2D(" + r + ", vec2((x * 4.0 + 3.5) / " + l + ", y / " + s + ")));\n\n          return vec4(r, g, b, a)" + a + ";\n        }\n      "
            }), a.push(u("vec4", "pickValue", "")), a.push(u("float", "pickScalarValue", ".x"))
        }, r = 0; r < e.length; r += 1) n(r);
    return a.join("\n")
}
var float = function() {
        return floatCode
    },
    chunks = Object.freeze({
        main: main,
        pickValue: pick_value,
        float: float
    }),
    _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
        return typeof t
    } : function(t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
    };

function validType(t) {
    return ["bool", "int", "uint", "float", "double", "vec2", "vec3", "vec4", "mat2", "mat3", "mat4", "sampler2D"].indexOf(t) >= 0
}

function getType(t) {
    var e = void 0 === t ? "undefined" : _typeof(t);
    t = String(t);
    var a = /^(vec\d|mat\d)\([^)]+\)$/.exec(t);
    return a ? e = a[1] : /^\d+$/.exec(t) ? e = "int" : /^\d+\.(\d+)?$/.exec(t) ? e = "float" : "boolean" === e && (e = "bool"), e
}

function constructHeading(t) {
    for (var e = Object.assign({}, t.uniform), a = Object.keys(t.input), n = "precision highp float;\n", r = 0; r < a.length; r += 1) {
        e[a[r]] = {
            dtype: "sampler2D"
        }
    }
    for (var i = Object.keys(e), o = 0; o < i.length; o += 1) {
        var s = i[o];
        if (!validType(e[s].dtype)) throw new Error("KernelConstructor: Uniform " + s + ' has invalid type "' + e[s].dtype + '"');
        n += "uniform " + e[s].dtype + " " + s + ";\n"
    }
    n += "varying vec2 texCoords;\n";
    for (var l = Object.keys(t.constant), u = 0; u < l.length; u += 1) {
        var c = l[u],
            h = t.constant[c];
        "number" === (void 0 === h ? "undefined" : _typeof(h)) && h % 1 == 0 && (h = h.toFixed(1));
        var f = getType(h);
        if (!validType(f)) throw new Error("KernelConstructor: Constant " + c + ', has invalid type "' + f + '"');
        n += "#define " + c + " " + h + "\n"
    }
    return n
}

function injectChunks(t) {
    var e = [];
    return ENV.SUPPORTS_FLOAT_TEXTURES || e.push("float"), e.concat(t.chunks.filter(function(t, e, a) {
        return a.indexOf(t) === e
    })).map(function(e) {
        var a = " Chunk " + e + " ",
            n = 35 - a.length,
            r = "" + "-".repeat(Math.floor(n / 2)) + a + "-".repeat(Math.ceil(n / 2));
        if ("function" == typeof chunks[e]) return "/*" + r + "*/\n" + chunks[e](t) + "\n/*" + "-".repeat(35) + "*/";
        throw new TypeError('KernelConstructor: Chunk "' + e + '" is not a function')
    }).join("\n")
}

function hasMain(t) {
    return !!/void main\(([^)]+)?\)([\s]+)?{/.exec(t)
}

function constructKernel(t) {
    var e = void 0;
    if (hasMain(t.kernel)) e = t.kernel;
    else {
        var a = constructHeading(t),
            n = injectChunks(t),
            r = main(t);
        e = [a, n, t.kernel, r].join("\n\n")
    }
    return ENV.DEBUG && (console.groupCollapsed(t.name), console.log(prepareSourceLines(e).join("\n")), console.groupEnd()), e
}

function _classCallCheck$3(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}

function _possibleConstructorReturn(t, e) {
    if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return !e || "object" != typeof e && "function" != typeof e ? t : e
}

function _inherits(t, e) {
    if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
    t.prototype = Object.create(e && e.prototype, {
        constructor: {
            value: t,
            enumerable: !1,
            writable: !0,
            configurable: !0
        }
    }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
}
var AVAILABLE_GLSL_CHUNKS = ["pickCurrentValue", "pickValue", "float"],
    assert$$1 = function(t, e) {
        if (!t) throw new Error(e)
    },
    assertShapesAreEqual$$1 = function(t, e) {
        if (t.shape.length !== e.shape.length) return !1;
        for (var a = 0; a < t.shape.length; a += 1)
            if (t.shape[a] !== e.shape[a]) return !1;
        return !0
    },
    isValidShape$$1 = function(t) {
        return Array.isArray(t) && t.length > 0 && !t.some(function(t) {
            return t % 1 != 0
        })
    },
    isOperation$$1 = function(t) {
        return t instanceof Operation
    },
    isTensor$$1 = function(t) {
        return t instanceof Tensor
    },
    isValidGLSLChunk$$1 = function(t) {
        return AVAILABLE_GLSL_CHUNKS.includes(t)
    },
    isValidGLSLVariableName$$1 = function(t) {
        return /^[A-Za-z](\w+)?$/.test(t)
    },
    isValidOperationShape$$1 = function(t) {
        return t[0] > 0 && t[1] > 0
    },
    DeprecationError$$1 = function(t) {
        function e() {
            return _classCallCheck$3(this, e), _possibleConstructorReturn(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
        }
        return _inherits(e, Error), e
    }();

function deprecationWarning$$1(t, e) {
    console.warn('GammaCV Deprecation Warning: "' + t + '" is deprecated' + (e ? ", " + e : "") + '. "' + t + '" will be removed in next major version.')
}

function deprecationError$$1(t, e) {
    throw new DeprecationError$$1('GammaCV Deprecation Error: "' + t + '" is deprecated' + (e ? ", " + e : "") + '. "' + t + '" and was removed.')
}
var _createClass$3 = function() {
    function t(t, e) {
        for (var a = 0; a < e.length; a++) {
            var n = e[a];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
        }
    }
    return function(e, a, n) {
        return a && t(e.prototype, a), n && t(e, n), e
    }
}();

function _classCallCheck$4(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}

function _possibleConstructorReturn$1(t, e) {
    if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return !e || "object" != typeof e && "function" != typeof e ? t : e
}

function _inherits$1(t, e) {
    if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
    t.prototype = Object.create(e && e.prototype, {
        constructor: {
            value: t,
            enumerable: !1,
            writable: !0,
            configurable: !0
        }
    }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
}
var Operation = function(t) {
        function e(t) {
            _classCallCheck$4(this, e), assert$$1(void 0 !== t, "Operation: Operation should have a name");
            var a = _possibleConstructorReturn$1(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t));
            return a.dtype = null, a.input = {}, a.uniform = {}, a.constant = {}, a.chunks = [], a.inputKeys = [], a.isInitialized = !1, a.lastCtx = Math.random(), a.cache = !0, a
        }
        return _inherits$1(e, GraphNode), _createClass$3(e, [{
            key: "run",
            value: function(t, e, a) {
                assert$$1(this.isInitialized, "Operation: Unable to run unitialized operation.");
                var n = this.gl,
                    r = t.texture[this.name];
                if (e === this.lastCtx && this.cache && !a) return r.bind(this.program, !1, this.inputKeys.length), this.bindBuffer(), !1;
                this.lastCtx = e, n.useProgram(this.program);
                for (var i = 0; i < this.inputKeys.length; i += 1) {
                    var o = this.inputKeys[i],
                        s = this.input[o],
                        l = s.name,
                        u = t.texture[l];
                    u.bind(this.program, o, i), isTensor$$1(s) && u.set(s)
                }
                return r.bind(this.program, !1, this.inputKeys.length), this.bindBuffer(), ENV.SUPPORTS_FLOAT_TEXTURES ? n.viewport(0, 0, this.shape[1], this.shape[0]) : n.viewport(0, 0, ("float32" === this.dtype ? 4 : 1) * this.shape[1], this.shape[0]), n.clearColor(0, 0, 0, 1), n.clear(n.COLOR_BUFFER_BIT | n.DEPTH_BUFFER_BIT), n.drawElements(n.TRIANGLES, 6, n.UNSIGNED_SHORT, 0), !0
            }
        }, {
            key: "unbindBuffer",
            value: function() {
                var t = this.gl;
                t.bindFramebuffer(t.FRAMEBUFFER, null)
            }
        }, {
            key: "bindBuffer",
            value: function() {
                var t = this.gl;
                t.bindFramebuffer(t.FRAMEBUFFER, this.framebuffer)
            }
        }, {
            key: "init",
            value: function(t) {
                if (!this.isInitialized) {
                    if (this.gl = t, this.program = t.createProgram(), this.framebuffer = t.createFramebuffer(), this.isInitialized) return !1;
                    this.name = this.name, this.shape = this.shape, this.constant.OUT_VIEW = "vec2(" + this.shape[1] + ", " + this.shape[0] + ")", this.kernel = constructKernel(this);
                    try {
                        this.vertexShader = this.getShader("vertex", vertexShader), t.attachShader(this.program, this.vertexShader), this.fragmentShader = this.getShader("fragment", this.kernel), t.attachShader(this.program, this.fragmentShader), t.linkProgram(this.program), t.useProgram(this.program)
                    } catch (t) {
                        throw processError(this.kernel, this.name, t), new Error("Operation: Error during shader compilation.\n" + t.message)
                    }
                    this.attributes = {
                        aVertexPosition: new GLBuffer(this.gl, this.program, "aVertexPosition", "vec3"),
                        aTextureCoords: new GLBuffer(this.gl, this.program, "aTextureCoords", "vec2"),
                        aIndices: new GLBuffer(this.gl, this.program, "aIndices", "int")
                    }, this.attributes.aVertexPosition.set([1, 1, 0, -1, 1, 0, -1, -1, 0, 1, -1, 0]), this.attributes.aTextureCoords.set([1, 1, 0, 1, 0, 0, 1, 0]), this.attributes.aIndices.set([0, 1, 2, 0, 2, 3]);
                    for (var e = Object.keys(this.uniform), a = 0; a < e.length; a += 1) {
                        var n = this.uniform[e[a]];
                        this.uniform[e[a]] = new GLUniform(this.gl, this.program, n.name, n.dtype), n.defaultValue && this.uniform[e[a]].set(n.defaultValue)
                    }
                    this.isInitialized = !0
                }
                return !0
            }
        }, {
            key: "getShader",
            value: function(t, e) {
                var a = this.gl,
                    n = null;
                if (n = "fragment" === t ? a.createShader(a.FRAGMENT_SHADER) : a.createShader(a.VERTEX_SHADER), a.shaderSource(n, e), a.compileShader(n), !a.getShaderParameter(n, a.COMPILE_STATUS)) throw new Error("Operation: An error occurred compiling the shaders.\n" + a.getShaderInfoLog(n));
                return n
            }
        }, {
            key: "traverse",
            value: function(t, a) {
                for (var n = Object.keys(this.input), r = 0; r < n.length; r += 1) {
                    var i = n[r];
                    this.input[i] instanceof e ? this.input[i].traverse(t, a) : t(this.input[i], a)
                }
                t(this, a)
            }
        }, {
            key: "getDependencies",
            value: function() {
                for (var t = [], a = Object.keys(this.input), n = 0; n < a.length; n += 1) {
                    var r = a[n];
                    if (this.input[r] instanceof e)
                        for (var i = this.input[r].getDependencies(), o = 0; o < i.length; o += 1) - 1 === t.indexOf(i[o]) && t.push(i[o])
                }
                return t.push(this.name), t
            }
        }, {
            key: "assignInput",
            value: function(t, e) {
                this.input[t] = e, -1 === this.inputKeys.indexOf(t) && this.inputKeys.push(t)
            }
        }, {
            key: "cloneProp",
            value: function(t) {
                for (var e = Object.keys(this[t]), a = {}, n = 0; n < e.length; n += 1) {
                    var r = e[n];
                    a[r] = this[t][r]
                }
                return a
            }
        }, {
            key: "destroy",
            value: function() {
                this.program && this.gl.deleteProgram(this.program), this.vertexShader && this.gl.deleteShader(this.vertexShader), this.fragmentShader && this.gl.deleteShader(this.fragmentShader), this.framebuffer && this.gl.deleteFramebuffer(this.framebuffer)
            }
        }, {
            key: "clone",
            value: function() {
                var t = new e(this.name.split(":")[0]);
                return t.input = this.cloneProp("input"), t.uniform = this.cloneProp("uniform"), t.constant = this.cloneProp("constant"), t.dtype = this.dtype, t.kernel = this.kernel, t.chunks = this.chunks, t
            }
        }]), e
    }(),
    _createClass$4 = function() {
        function t(t, e) {
            for (var a = 0; a < e.length; a++) {
                var n = e[a];
                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
            }
        }
        return function(e, a, n) {
            return a && t(e.prototype, a), n && t(e, n), e
        }
    }();

function _classCallCheck$5(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}
var GPUTexture = function() {
    function t(e, a, n, r) {
        if (_classCallCheck$5(this, t), "float32" !== e && "uint8" !== e) throw new Error("GPUTexture: Invalid texture type, currently supported is: float32, uint8, but got " + e + " ");
        this.unit = n, this.dtype = e, this.gl = a, this.ctx = a.createTexture(), this.shape = r, a.bindTexture(a.TEXTURE_2D, this.ctx), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.NEAREST), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.NEAREST), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, a.CLAMP_TO_EDGE), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_T, a.CLAMP_TO_EDGE), this.allocate()
    }
    return _createClass$4(t, [{
        key: "allocate",
        value: function() {
            var t = this.gl,
                e = this.shape[1],
                a = t.UNSIGNED_BYTE;
            "float32" === this.dtype && (ENV.SUPPORTS_FLOAT_TEXTURES ? a = t.FLOAT : e *= 4), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, e, this.shape[0], 0, t.RGBA, a, null)
        }
    }, {
        key: "set",
        value: function() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
                e = this.gl,
                a = t.shape[1],
                n = e.UNSIGNED_BYTE,
                r = t.data;
            "float32" === t.dtype && (ENV.SUPPORTS_FLOAT_TEXTURES ? n = e.FLOAT : (a *= 4, r = t.uint8View)), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, a, this.shape[0], 0, e.RGBA, n, r)
        }
    }, {
        key: "bind",
        value: function(t, e, a) {
            var n = this.gl;
            if (e) {
                var r = n.getUniformLocation(t, e);
                n.uniform1i(r, a)
            }
            n.activeTexture(n.TEXTURE0 + a), n.bindTexture(n.TEXTURE_2D, this.ctx), this.unit = a
        }
    }, {
        key: "unbind",
        value: function() {
            var t = this.gl;
            t.activeTexture(t.TEXTURE0 + this.unit), t.bindTexture(t.TEXTURE_2D, null)
        }
    }, {
        key: "delete",
        value: function() {
            var t = this.gl;
            t.deleteTexture(this.ctx), this.gl = null, this.program = null, this.ctx = null, t.bindTexture(t.TEXTURE_2D, null)
        }
    }]), t
}();

function _toConsumableArray$2(t) {
    if (Array.isArray(t)) {
        for (var e = 0, a = Array(t.length); e < t.length; e++) a[e] = t[e];
        return a
    }
    return Array.from(t)
}

function range(t) {
    for (var e = new Array(t), a = 0; a < t; a += 1) e[a] = a;
    return e
}

function tensorFrom(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
        a = null;
    return t instanceof Operation && (a = new Tensor(e || t.dtype, t.shape)), t instanceof Tensor && (a = new Tensor(e || t.dtype, t.shape)), a
}

function tensorClone(t, e) {
    if (e.data.set) e.data.set(t.data);
    else
        for (var a = 0; a < e.size; a += 1) e.data[a] = t.data[a]
}

function tensorInvert(input) {
    var output = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : input,
        invertShape = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : new Array(input.shape.length).fill(!0),
        shape = input.shape;
    if (input === output && (input = input.clone()), input.shape.length !== output.shape.length) throw new Error("invertTensor: Unable to invert, input and output has different shapes");
    var tmpArr = new Array(shape.length),
        invert = function() {};
    eval("invert = function (coords) { " + invertShape.map(function(t, e) {
        return t ? "tmpArr[" + e + "] = shape[" + e + "] - 1 - coords[" + e + "]" : "tmpArr[" + e + "] = coords[" + e + "]"
    }).join(";") + "; return tmpArr; }");
    for (var i = 0; i < input.size; i += 1) {
        var _input, coords = Tensor.IndexToCoord(shape, i),
            inverted = invert(coords, tmpArr);
        output.set.apply(output, _toConsumableArray$2(inverted).concat([(_input = input).get.apply(_input, _toConsumableArray$2(coords))]))
    }
    return output
}
var tensorAssertEqual = function(t, e) {
        if (!assertShapesAreEqual$$1(t, e)) return !1;
        for (var a = 0; a < t.size; a += 1)
            if (t.data[a] !== e.data[a]) return !1;
        return !0
    },
    tensorAssertCloseEqual = function(t, e) {
        var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
        if (!assertShapesAreEqual$$1(t, e)) return !1;
        for (var n = 0; n < t.size; n += 1)
            if (Math.abs(t.data[n] - e.data[n]) > a) return !1;
        return !0
    },
    tensorAssertMSEEqual = function(t, e) {
        var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
        if (!assertShapesAreEqual$$1(t, e)) return !1;
        for (var n = 0, r = 0; r < t.size; r += 1) n += Math.pow(t.data[r] - e.data[r], 2);
        return (n = Math.sqrt(n) / t.size) < a
    };

function flipTensor(input) {
    var output = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : input,
        invertShape = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : new Array(input.shape.length).fill(!0),
        shape = input.shape;
    if (input === output && (input = input.clone()), input.shape.length !== output.shape.length) throw new Error("invertTensor: Unable to invert, input and output has different shapes");
    var tmpArr = new Array(shape.length),
        invert = function() {};
    eval("invert = function (coords) { " + invertShape.map(function(t, e) {
        return t ? "tmpArr[" + e + "] = shape[" + e + "] - 1 - coords[" + e + "]" : "tmpArr[" + e + "] = coords[" + e + "]"
    }).join(";") + "; return tmpArr; }");
    for (var i = 0; i < input.size; i += 1) {
        var _input2, coords = Tensor.IndexToCoord(shape, i),
            inverted = invert(coords, tmpArr);
        output.set.apply(output, _toConsumableArray$2(inverted).concat([(_input2 = input).get.apply(_input2, _toConsumableArray$2(coords))]))
    }
    return output
}

function invertTensor() {
    return deprecationWarning$$1("invertTensor", 'use "flipTensor" instead'), flipTensor.apply(void 0, arguments)
}

function tensorMap(t, e) {
    for (var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : t, n = 0; n < t.size; n += 1) a.data[n] = e(t.data[n], n)
}

function tensorOnes(t, e) {
    var a = new Tensor(t, e);
    return tensorMap(a, function() {
        return 1
    }), a
}

function tensorFromFlat(t) {
    for (var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [1, t.length, 4], a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "float32", n = arguments[3], r = new Array(4 * t.length), i = 0; i < r.length; i += 1) r[i] = (i + 1) % 4 == 0 && "number" == typeof n ? n : t[~~(i / 4)];
    return new Tensor(a, e, Tensor.GetTypedArray(a, r))
}
var _createClass$5 = function() {
    function t(t, e) {
        for (var a = 0; a < e.length; a++) {
            var n = e[a];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
        }
    }
    return function(e, a, n) {
        return a && t(e.prototype, a), n && t(e, n), e
    }
}();

function _classCallCheck$6(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}

function _possibleConstructorReturn$2(t, e) {
    if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return !e || "object" != typeof e && "function" != typeof e ? t : e
}

function _inherits$2(t, e) {
    if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
    t.prototype = Object.create(e && e.prototype, {
        constructor: {
            value: t,
            enumerable: !1,
            writable: !0,
            configurable: !0
        }
    }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
}
var Tensor = function(t) {
        function e(t, a, n, r) {
            var i = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0;
            _classCallCheck$6(this, e);
            var o = _possibleConstructorReturn$2(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, "Tensor"));
            return o.dtype = t, o.shape = a || [n.length], assert$$1(isValidShape$$1(o.shape), "Tensor: Shape is not valid"), r && (assert$$1(isValidShape$$1(r), "Tensor: Stride is not valid"), assert$$1(o.shape.length === r.length, "Tensor: Stride length should be equal to shape length")), assert$$1("number" == typeof i && i % 1 == 0, "Tensor: Offset should be integer, but got " + i), o.size = e.GetSize(o.shape), o.stride = r || o._defineStride(o.shape), o.offset = i, o._compileJITMethods(), void 0 === n ? (o.data = e.Malloc(t, o.size), o.empty = e.Malloc(t, o.size)) : o.assign(n), ENV.SUPPORTS_FLOAT_TEXTURES || "float32" !== t || (o.uint8View = new Uint8Array(o.data.buffer)), o
        }
        return _inherits$2(e, GraphNode), _createClass$5(e, [{
            key: "_compileJITMethods",
            value: function() {
                var t = this,
                    e = range(this.shape.length),
                    a = e.map(function(t) {
                        return "i" + t
                    }).join(","),
                    n = this.offset + "+" + e.map(function(e) {
                        return t.stride[e] + "*i" + e
                    }).join("+");
                this.get = new Function("return function get(" + a + ") { return this.data[" + n + "]; }")(), this.set = new Function("return function get(" + a + ", v) { this.data[" + n + "] = v; }")(), this.index = new Function("return function get(" + a + ", v) { return " + n + "; }")()
            }
        }, {
            key: "_defineStride",
            value: function(t) {
                for (var e = t.length, a = new Array(e), n = e - 1, r = 1; n >= 0; n -= 1) a[n] = r, r *= this.shape[n];
                return a
            }
        }, {
            key: "assign",
            value: function(t) {
                var a = e.DefineType(t),
                    n = t.length;
                return assert$$1(a === this.dtype, "Tensor: Different dtypes assigned: \n   expected - " + this.dtype + " \n   actual - " + a), assert$$1(n === this.size + this.offset, "Tensor: Different sizes assigned: \n   expected - " + (this.size + this.offset) + " \n   actual - " + n), this.data = t, this
            }
        }, {
            key: "release",
            value: function() {
                return this.empty ? this.data.set(this.empty) : this.data = e.Malloc(this.dtype, this.size), this
            }
        }, {
            key: "clone",
            value: function() {
                var t = new e(this.dtype, this.shape, void 0, this.stride, this.offset);
                return tensorClone(this, t), t
            }
        }], [{
            key: "IndexToCoord",
            value: function(t, e) {
                for (var a = new Array(t.length), n = e, r = t.reduce(function(t, e) {
                        return t * e
                    }), i = 0; i <= t.length - 2; i += 1) {
                    var o = ~~(n / (r /= t[i]));
                    n %= r, a[i] = o
                }
                return a[a.length - 1] = n % t[t.length - 1], a
            }
        }, {
            key: "CoordToIndex",
            value: function(t, e) {
                for (var a = 1, n = 0, r = t.length - 1; r >= 0; r -= 1) n += a * e[r], a *= t[r];
                return n
            }
        }, {
            key: "Malloc",
            value: function(t, e) {
                switch (t) {
                    case "uint8":
                        return new Uint8Array(e);
                    case "uint16":
                        return new Uint16Array(e);
                    case "uint32":
                        return new Uint32Array(e);
                    case "int8":
                        return new Int8Array(e);
                    case "int16":
                        return new Int16Array(e);
                    case "int32":
                        return new Int32Array(e);
                    case "float32":
                        return new Float32Array(e);
                    case "float64":
                        return new Float64Array(e);
                    case "uint8c":
                        return new Uint8ClampedArray(e);
                    case "array":
                        return new Array(e);
                    default:
                        throw new Error("Tensor: Unexpected type: " + t + ".")
                }
            }
        }, {
            key: "DefineType",
            value: function(t) {
                var e = Object.prototype.toString.call(t);
                switch (e) {
                    case "[object Uint8Array]":
                        return "uint8";
                    case "[object Uint16Array]":
                        return "uint16";
                    case "[object Uint32Array]":
                        return "uint32";
                    case "[object Int8Array]":
                        return "int8";
                    case "[object Int16Array]":
                        return "int16";
                    case "[object Int32Array]":
                        return "int32";
                    case "[object Float32Array]":
                        return "float32";
                    case "[object Float64Array]":
                        return "float64";
                    case "[object Uint8ClampedArray]":
                        return "uint8c";
                    case "[object Array]":
                        return "array";
                    default:
                        throw new Error("Tensor: Unknown dtype: " + e + ".")
                }
            }
        }, {
            key: "GetTypedArray",
            value: function(t, a) {
                if (t === e.DefineType(a)) return a;
                switch (t) {
                    case "uint8":
                        return new Uint8Array(a);
                    case "uint16":
                        return new Uint16Array(a);
                    case "uint32":
                        return new Uint32Array(a);
                    case "int8":
                        return new Int8Array(a);
                    case "int16":
                        return new Int16Array(a);
                    case "int32":
                        return new Int32Array(a);
                    case "float32":
                        return new Float32Array(a);
                    case "float64":
                        return new Float64Array(a);
                    case "uint8c":
                        return new Uint8ClampedArray(a);
                    case "array":
                        return new Array(a);
                    default:
                        throw new Error("Unknown type: " + t + ".")
                }
            }
        }, {
            key: "GetSize",
            value: function(t) {
                return t.reduce(function(t, e) {
                    return t * e
                }, 1)
            }
        }]), e
    }(),
    _createClass$6 = function() {
        function t(t, e) {
            for (var a = 0; a < e.length; a++) {
                var n = e[a];
                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
            }
        }
        return function(e, a, n) {
            return a && t(e.prototype, a), n && t(e, n), e
        }
    }();

function _classCallCheck$7(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}
var Session = function() {
        function t() {
            _classCallCheck$7(this, t), this.canvas = document.createElement("canvas"), this.canvas.width = 1, this.canvas.height = 1, this.initWebGL(this.canvas), this.operation = {}, this.texture = {}, this.textureCount = 0
        }
        return _createClass$6(t, [{
            key: "initWebGL",
            value: function(t, e) {
                this.canvas = t;
                var a = this.canvas.getContext("webgl", e),
                    n = a.getExtension("OES_texture_float");
                assert$$1(!!a, "Session: WebGL not supported."), assert$$1(!!n, "Session: Unable to find extension OES_texture_float"), a.clear(a.COLOR_BUFFER_BIT | a.DEPTH_BUFFER_BIT), this.gl = a
            }
        }, {
            key: "init",
            value: function(t) {
                assert$$1(!!t, "Session: Unable to initialize undefined operation"), assert$$1(isOperation$$1(t) || isTensor$$1(t), "Session: Unable to initialize operation with invalid input type"), isOperation$$1(t) && t.traverse(function(t, e) {
                    e.operation[t.name] = t
                }, this), isTensor$$1(t) && (this.operation[t.name] = t), this.update()
            }
        }, {
            key: "update",
            value: function() {
                for (var t = this.gl, e = Object.keys(this.operation), a = 0; a < e.length; a += 1) {
                    var n = this.operation[e[a]];
                    n instanceof Operation && n.init(this.gl), this.texture[e[a]] || (this.texture[e[a]] = new GPUTexture(n.dtype, this.gl, this.textureCount, n.shape), n instanceof Operation && (t.bindFramebuffer(t.FRAMEBUFFER, n.framebuffer), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, this.texture[e[a]].ctx, 0), t.bindFramebuffer(t.FRAMEBUFFER, null)), this.textureCount += 1)
                }
            }
        }, {
            key: "runOp",
            value: function(t, e) {
                for (var a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], n = t.sequence, r = !1, i = 0; i < n.length; i += 1) {
                    var o = n[i],
                        s = this.operation[o],
                        l = i === n.length - 1;
                    r = !!s.run(this, e, r), a && a instanceof Tensor && l && this.readToTensor(a)
                }
            }
        }, {
            key: "destroy",
            value: function() {
                var t = this.gl.getExtension("WEBGL_lose_context"),
                    e = Object.keys(this.texture),
                    a = Object.keys(this.operation);
                t && t.loseContext();
                for (var n = 0; n < e.length; n += 1) this.texture[e[n]].delete();
                for (var r = 0; r < a.length; r += 1) {
                    var i = this.operation[a[r]];
                    i instanceof Operation && i.destroy()
                }
                this.canvas = null, this.operation = {}, this.texture = {}, this.gl = null, this.textureCount = 0
            }
        }, {
            key: "readToTensor",
            value: function(t) {
                var e = this.gl,
                    a = t.shape[1],
                    n = e.UNSIGNED_BYTE,
                    r = t.data;
                "float32" === t.dtype && (ENV.SUPPORTS_FLOAT_TEXTURES ? n = e.FLOAT : (a *= 4, r = t.uint8View)), e.readPixels(0, 0, a, t.shape[0], e.RGBA, n, r)
            }
        }]), t
    }(),
    _createClass$7 = function() {
        function t(t, e) {
            for (var a = 0; a < e.length; a++) {
                var n = e[a];
                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
            }
        }
        return function(e, a, n) {
            return a && t(e.prototype, a), n && t(e, n), e
        }
    }();

function _classCallCheck$8(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}
var RegisterOperation = function() {
    function t(e) {
        _classCallCheck$8(this, t), this.op = new Operation(e), this.name = e, this.checkShape = function(t) {
            return t[Object.keys(t)[0]]
        }, this.preCompile = function() {}, this.postCompile = function() {}, this.chunks = []
    }
    return _createClass$7(t, [{
        key: "GLSLKernel",
        value: function(t) {
            return assert$$1("string" == typeof t, "RegisterOperation: The kernel should be a string but it is not."), this.op.kernel = t, this
        }
    }, {
        key: "LoadChunk",
        value: function() {
            for (var t = arguments.length, e = Array(t), a = 0; a < t; a++) e[a] = arguments[a];
            var n = !0,
                r = !1,
                i = void 0;
            try {
                for (var o, s = e[Symbol.iterator](); !(n = (o = s.next()).done); n = !0) {
                    var l = o.value;
                    assert$$1(isValidGLSLChunk$$1(l), "RegisterOperation: There is no available GLSL chunk supported: " + l)
                }
            } catch (t) {
                r = !0, i = t
            } finally {
                try {
                    !n && s.return && s.return()
                } finally {
                    if (r) throw i
                }
            }
            return this.op.chunks = this.op.chunks.concat(e), this
        }
    }, {
        key: "Input",
        value: function(t, e) {
            return assert$$1(isValidGLSLVariableName$$1(t)), this.op.input[t] = {
                name: t,
                dtype: e
            }, this
        }
    }, {
        key: "Output",
        value: function(t) {
            return assert$$1(null === this.op.dtype, "RegisterOperation: The operation allows a single output."), this.op.dtype = t, this
        }
    }, {
        key: "Constant",
        value: function(t, e) {
            return assert$$1(isValidGLSLVariableName$$1(t)), this.op.constant[t] = e, this
        }
    }, {
        key: "SetShapeFn",
        value: function(t) {
            return assert$$1("function" == typeof t, "RegisterOperation: SetShapeFn should receive function in first argument"), this.checkShape = t, this
        }
    }, {
        key: "PreCompile",
        value: function(t) {
            return assert$$1("function" == typeof t, "RegisterOperation: PreCompile should receive function in first argument"), this.preCompile = t, this
        }
    }, {
        key: "PostCompile",
        value: function(t) {
            return assert$$1("function" == typeof t, "RegisterOperation: PostCompile should receive function in first argument"), this.postCompile = t, this
        }
    }, {
        key: "Uniform",
        value: function(t, e, a) {
            return assert$$1(isValidGLSLVariableName$$1(t)), this.op.uniform[t] = {
                name: t,
                dtype: e,
                defaultValue: a
            }, this
        }
    }, {
        key: "Compile",
        value: function(t) {
            var e = this.op.clone(),
                a = {},
                n = Object.keys(t);
            this.preCompile(e);
            for (var r = 0; r < n.length; r += 1) {
                var i = n[r],
                    o = t[i];
                assert$$1(!!o, "RegisterOperation:" + e.name + "." + i + ":\n         Can't compile operation with undefined input."), assert$$1(isTensor$$1(o) || isOperation$$1(o), "RegisterOperation:" + e.name + "." + i + ":\n         Can't compile operation with invalid input type.\n         You can only use Tensor or another Operation to be an input"), a[i] = t[i].shape, e.assignInput(i, t[i])
            }
            return e.shape = this.checkShape(a), e.sequence = e.getDependencies(), e
        }
    }]), t
}();

function initDrawable(t, e, a) {
    var n = !1;
    return t.onmousedown = function() {
            n = !0
        }, t.onmouseup = function() {
            n = !1
        }, t.onmousemove = function(t) {
            n && (e.set(t.offsetY, t.offsetX, 255), a && a())
        },
        function() {
            t.onmousedown = null, t.onmouseup = null, t.onmousemove = null
        }
}

function initMouseTracking(t, e) {
    return t.onmousemove = function(t) {
            return e(t.offsetX, t.offsetY)
        },
        function() {
            t.onmousemove = null
        }
}

function toImageData(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
        a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
        n = new ImageData(t.shape[1], t.shape[0]),
        r = t.shape[0] * t.shape[1];
    if (e && "uint8" === t.dtype) return n.data.set(t.data), n;
    if (!e) {
        for (var i = 0; i < r; i += 1) {
            var o = ~~(i / t.shape[0]),
                s = i - o * t.shape[1],
                l = t.data[i],
                u = 0;
            u = a ? 4 * (s * t.shape[0] + o) : 4 * (o * t.shape[1] + s), n.data[u + 0] = l, n.data[u + 1] = l, n.data[u + 2] = l, n.data[u + 3] = 255
        }
        return n
    }
    if ("float32" === t.dtype)
        for (var c = 0; c < t.size; c += 1) n.data[c] = 255 * t.data[c];
    else
        for (var h = 0; h < t.size; h += 1) n.data[h] = t.data[h];
    return n
}

function getImageData(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
        a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
        n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : t.width,
        r = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : t.height;
    return t.getContext("2d").getImageData(e, a, n, r)
}

function putImageData(t, e) {
    var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
        n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0,
        r = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0,
        i = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 0,
        o = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : e.width,
        s = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : e.height,
        l = arguments[8];
    return (e.width !== t.width || e.height !== t.height || l) && t.getContext("2d").clearRect(0, 0, t.width, t.height), t.getContext("2d").putImageData(e, a, n, r, i, o, s)
}

function canvasFromTensor(t, e) {
    var a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
        n = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
    if (!(e instanceof Tensor)) throw Error("tensorToCanvas: Input tensor invalid");
    e.shape[2] && 4 === e.shape[2] && (a = !0);
    var r = toImageData(e, a, n);
    t.getContext("2d").putImageData(r, 0, 0)
}

function canvasToTensor(t, e) {
    var a = t.getContext("2d").getImageData(0, 0, e.shape[1], e.shape[0]);
    if (e) switch (e.dtype) {
        case "uint8":
            e.assign(new Uint8Array(a.data));
            break;
        case "uint8c":
            e.assign(a.data);
            break;
        case "float32":
        default:
            e.assign(new Float32Array(a.data))
    }
}
var canvasDrawLine = function(t, e) {
        var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "rgba(255, 0, 0, 0.5)",
            n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1,
            r = t.getContext("2d");
        r.beginPath(), Array.isArray(e) ? (r.moveTo(e[0], e[1]), r.lineTo(e[2], e[3])) : (r.moveTo(e.data[0], e.data[1]), r.lineTo(e.data[2], e.data[3])), r.strokeStyle = a, r.lineWidth = n, r.stroke(), r.closePath()
    },
    canvasDrawCircle = function(t, e) {
        var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 5,
            n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "#ff0000",
            r = t.getContext("2d");
        r.beginPath(), r.arc(e[0], e[1], a, 0, 2 * Math.PI), r.strokeStyle = n, r.stroke()
    },
    canvasFillCircle = function(t, e, a) {
        var n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "#ff0000",
            r = t.getContext("2d");
        r.beginPath(), r.arc(e[0], e[1], a, 0, 2 * Math.PI), r.fillStyle = n, r.fill()
    },
    clearCanvas = function(t) {
        t.getContext("2d").clearRect(0, 0, t.width, t.height)
    },
    canvasDrawRect = function(t, e) {
        var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "rgba(255, 0, 0, 1)",
            n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1,
            r = arguments.length > 4 && void 0 !== arguments[4] && arguments[4],
            i = arguments.length > 5 && void 0 !== arguments[5] && arguments[5],
            o = t.getContext("2d");
        o.beginPath(), o.moveTo(e.ax, e.ay), o.lineTo(e.bx, e.by), o.lineTo(e.cx, e.cy), o.lineTo(e.dx, e.dy), o.lineTo(e.ax, e.ay), r && (o.lineTo(e.ax, e.ay), o.lineTo(e.cx, e.cy), o.lineTo(e.bx, e.by), o.lineTo(e.dx, e.dy), o.lineTo(e.ax, e.ay)), o.strokeStyle = a, i && (o.fillStyle = a, o.fill()), o.stroke(), o.lineWidth = n, o.closePath()
    };

function canvasFill(t, e) {
    var a = t.getContext("2d");
    a.fillStyle = e, a.fillRect(0, 0, t.width, t.height)
}
var canvasClear = function(t) {
        t.width = t.width, t.height = t.height
    },
    canvasInit = function(t, e, a) {
        var n = document.querySelector(t);
        return n.width = e, n.height = a, n
    },
    canvasCreate = function(t, e) {
        var a = document.createElement("canvas");
        return a.width = t, a.height = e, a
    };

function imageTensorFromURL(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "uint8",
        a = arguments[2],
        n = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
    return new Promise(function(r, i) {
        var o = document.createElement("img"),
            s = document.createElement("canvas"),
            l = s.getContext("2d"),
            u = void 0,
            c = void 0;
        o.src = t, n && (o.crossOrigin = "Anonimus"), o.onload = function() {
            a ? (u = a[1], c = a[0]) : (u = o.width, c = o.height), s.width = u, s.height = c, l.drawImage(o, 0, 0, u, c);
            var t = void 0,
                n = l.getImageData(0, 0, u, c);
            switch (e) {
                case "uint8":
                    t = new Uint8Array(n.data.buffer);
                    break;
                case "float32":
                    t = new Float32Array(n.data);
                    break;
                default:
                    t = n.data
            }
            var i = new Tensor(e, [c, u, 4], t);
            r(i)
        }, o.onerror = i
    })
}
var _createClass$8 = function() {
    function t(t, e) {
        for (var a = 0; a < e.length; a++) {
            var n = e[a];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
        }
    }
    return function(e, a, n) {
        return a && t(e.prototype, a), n && t(e, n), e
    }
}();

function _classCallCheck$9(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}

function getWidth(t, e) {
    return t * e
}

function getHeight(t, e) {
    return e / t
}

function getMaxAvailableSize(t, e, a) {
    if (e) {
        var n = getHeight(t, e);
        if (n <= a) return {
            width: e,
            height: n
        }
    }
    return {
        width: getWidth(t, a),
        height: a
    }
}

function getMinAvailableSize(t, e, a) {
    if (e) {
        var n = getHeight(t, e);
        if (n > a) return {
            width: e,
            height: n
        }
    }
    return {
        width: getWidth(t, a),
        height: a
    }
}
var CaptureVideo = function() {
        function t(e, a) {
            _classCallCheck$9(this, t), this.video = document.createElement("video"), this.video.muted = !0, this.video.playsInline = !0, this.canvas = document.createElement("canvas"), this.canvasCtx = this.canvas.getContext("2d"), this.sourceCanvas = document.createElement("canvas"), this.sourceCanvasCtx = this.sourceCanvas.getContext("2d"), this.width = e, this.height = a, this.sourceWidth = e, this.sourceHeight = a, this.setSize(e, a), this.track = null
        }
        return _createClass$8(t, null, [{
            key: "IsAvailable",
            value: function() {
                var t = {
                    video: {
                        width: {
                            min: 480,
                            ideal: 1080,
                            max: 1920
                        },
                        height: {
                            min: 480,
                            ideal: 1080,
                            max: 1920
                        }
                    }
                };
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
                var e = navigator.userAgent; - 1 !== e.indexOf("Safari") && -1 === e.indexOf("Chrome") && (delete t.video.width, delete t.video.height);
                var a = Promise.resolve();
                return navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? a = a.then(function() {
                    return navigator.mediaDevices.getUserMedia(t)
                }) : navigator.getUserMedia && (a = a.then(function() {
                    return new Promise(function(e) {
                        return navigator.getUserMedia(t, e)
                    })
                })), a.then(function(t) {
                    var e = t.getTracks(),
                        a = e[0].getSettings().deviceId;
                    return e.forEach(function(t) {
                        return t.stop()
                    }), a || !0
                }).catch(function() {
                    return Promise.resolve(!1)
                })
            }
        }, {
            key: "getDevices",
            value: function() {
                return "mediaDevices" in navigator && "enumerateDevices" in navigator.mediaDevices ? navigator.mediaDevices.enumerateDevices().then(function(t) {
                    return t.filter(function(t) {
                        return "videoinput" === t.kind
                    })
                }) : Promise.resolve(null)
            }
        }]), _createClass$8(t, [{
            key: "setSize",
            value: function(t, e) {
                this.width = t, this.height = e, this.canvas.width = t, this.canvas.height = e, this.sourceCanvas.width = t, this.sourceCanvas.height = e, this.sourceMinWidth = t, this.sourceMinHeight = e
            }
        }, {
            key: "setSourceSize",
            value: function(t, e) {
                var a = getMinAvailableSize(t / e, this.width, this.height),
                    n = getMaxAvailableSize(this.width / this.height, t, e),
                    r = getMinAvailableSize(t / e, n.width, n.height);
                this.sourceMinWidth = a.width, this.sourceMinHeight = a.height, this.sourceWidth = r.width, this.sourceHeight = r.height, this.sourceCanvas.width = n.width, this.sourceCanvas.height = n.height
            }
        }, {
            key: "getDevice",
            value: function() {
                return this.track ? this.track.getSettings().deviceId : null
            }
        }, {
            key: "start",
            value: function(t) {
                var e = this,
                    a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
                this.started = !0;
                var n = {
                        video: {
                            width: {
                                min: 240,
                                ideal: 1080,
                                max: 1920
                            },
                            height: {
                                min: 240,
                                ideal: 1080,
                                max: 1920
                            },
                            aspectRatio: {
                                exact: this.width / this.height
                            },
                            deviceId: t ? {
                                ideal: t
                            } : void 0,
                            facingMode: a ? {
                                exact: a
                            } : null
                        }
                    },
                    r = navigator.userAgent,
                    i = !(-90 === window.orientation || 90 === window.orientation || window.offsetWidth > window.offsetHeight);
                /android/i.test(r) && i && (n.video.aspectRatio.exact = 1 / n.video.aspectRatio.exact), -1 !== r.indexOf("Safari") && -1 === r.indexOf("Chrome") && (delete n.video.width, delete n.video.height, delete n.video.aspectRatio), navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
                var o = Promise.resolve();
                return navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? o = o.then(function() {
                    return navigator.mediaDevices.getUserMedia(n)
                }) : navigator.getUserMedia && (o = o.then(function() {
                    return new Promise(function(t) {
                        return navigator.getUserMedia(n, t)
                    })
                })), o.then(function(t) {
                    if (t) {
                        var a = t.getTracks();
                        return e.started ? ("srcObject" in e.video ? e.video.srcObject = t : e.video.src = window.URL.createObjectURL(t), e.track = a[0], e.video.play().then(function() {
                            return e.setSourceSize(e.video.videoWidth, e.video.videoHeight)
                        })) : (a.forEach(function(t) {
                            return t.stop()
                        }), null)
                    }
                    throw new Error("getUserMedia not found or no stream was created")
                })
            }
        }, {
            key: "stop",
            value: function() {
                this.started = !1, this.track && (this.track.stop(), this.track = null)
            }
        }, {
            key: "drawImage",
            value: function(t, e, a, n, r) {
                t.drawImage(this.video, (n - e) / -2, (r - a) / -2, n, r)
            }
        }, {
            key: "getImageBuffer",
            value: function(t) {
                var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.canvasCtx,
                    a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.width,
                    n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : this.height,
                    r = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0,
                    i = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 0,
                    o = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : a,
                    s = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : n,
                    l = arguments.length > 8 && void 0 !== arguments[8] ? arguments[8] : this.sourceMinWidth,
                    u = arguments.length > 9 && void 0 !== arguments[9] ? arguments[9] : this.sourceMinHeight;
                this.drawImage(e, o, s, l, u);
                var c = e.getImageData(r, i, o, s);
                if (t instanceof Tensor) return t.data.set(c.data), t;
                switch (t) {
                    case "uint8":
                        return new Uint8Array(c.data);
                    case "uint8c":
                        return c.data;
                    case "float32":
                        return new Float32Array(c.data);
                    default:
                        return c
                }
            }
        }, {
            key: "getImageBufferTo",
            value: function(t) {
                var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.canvasCtx,
                    a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.width,
                    n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : this.height,
                    r = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0,
                    i = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 0,
                    o = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : a,
                    s = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : n,
                    l = arguments[8];
                e.drawImage(this.video, (this.sourceWidth - this.width) / -2, (this.sourceHeight - this.height) / -2, this.sourceWidth, this.sourceHeight);
                var u = e.getImageData(r, i, o, s);
                l.data = u.data.buffer
            }
        }, {
            key: "getSourceImageBuffer",
            value: function(t, e, a, n, r) {
                return this.getImageBuffer(t, this.sourceCanvasCtx, this.sourceCanvas.width, this.sourceCanvas.height, e, a, n, r, this.sourceWidth, this.sourceHeight)
            }
        }]), t
    }(),
    kernel = "const vec3 k=vec3(0.2128,0.7148,0.0724);vec4 operation(float y,float x){float value=dot(pickValue_tSrc(y,x).rgb,k);return vec4(value,value,value,1.0);}",
    index = function(t) {
        return new RegisterOperation("Grayscale").Input("tSrc", "uint8").Output("uint8").LoadChunk("pickValue").GLSLKernel(kernel).Compile({
            tSrc: t
        })
    },
    kernel$1 = "const float hWidth=(KERNEL_WIDTH-1.0)/2.0;const float hHeight=(KERNEL_HEIGHT-1.0)/2.0;vec4 operation(float y,float x){vec3 finalColour=vec3(0.0);for(float dy=-hHeight;dy<=hHeight;dy+=1.0){for(float dx=-hWidth;dx<=hWidth;dx+=1.0){vec3 k=pickValue_tKernel(float(dy+hHeight),float(dx+hWidth)).rgb;finalColour+=pickValue_tSrc(y+dy,x+dx).rgb*k;}}return vec4(finalColour*factor+bias,1.0);}";

function gaussianBlur() {
    for (var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 3, e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1, a = new Tensor("float32", [t, t]), n = (t - 1) / 2, r = new Tensor("float32", [t, t, 4]), i = 0, o = 0; o < t; o += 1)
        for (var s = 0; s < t; s += 1) {
            var l = Math.exp(-.5 * (Math.pow((s - n) / e, 2) + Math.pow((o - n) / e, 2))) / (2 * Math.PI * e * e);
            a.set(s, o, l), i += a.get(s, o)
        }
    for (var u = 0; u < t; u += 1)
        for (var c = 0; c < t; c += 1) r.set(c, u, 0, a.get(c, u) / i), r.set(c, u, 1, a.get(c, u) / i), r.set(c, u, 2, a.get(c, u) / i);
    return r
}

function boxBlur() {
    for (var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 3, e = new Tensor("float32", [t, t, 4]), a = Math.pow(t, 2), n = 0; n < e.data.length; n += 1) e.data[n] = 1 / a;
    return e
}

function sharpen() {
    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
        e = -1 * t;
    return tensorFromFlat([0, e, 0, e, 1 + 4 * t, e, 0, e, 0], [3, 3, 4], "float32")
}

function invert() {
    return tensorFromFlat([0, 0, 0, 0, -1, 0, 0, 0, 0], [3, 3, 4], "float32")
}

function edgeDetection() {
    return tensorFromFlat([1, 0, -1, 0, 0, 0, -1, 0, 1], [3, 3, 4], "float32")
}

function edgeDetection2() {
    return tensorFromFlat([0, 1, 0, 1, -4, 1, 0, 1, 0], [3, 3, 4], "float32")
}

function edgeDetection3() {
    return tensorFromFlat([-1, -1, -1, -1, 8, -1, -1, -1, -1], [3, 3, 4], "float32")
}

function unsharpMasking() {
    for (var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 3, e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1, a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1, n = gaussianBlur(t, e), r = ~~((t - 1) / 2), i = 1 + 1 * a - n.get(r, r, 0), o = 1 + 1 * a - n.get(r, r, 1), s = 1 + 1 * a - n.get(r, r, 2), l = 0; l < n.size; l += 1) n.data[l] = -n.data[l];
    return n.set(r, r, 0, i), n.set(r, r, 1, o), n.set(r, r, 2, s), n
}
var convolutionKernels = Object.freeze({
        gaussianBlur: gaussianBlur,
        boxBlur: boxBlur,
        sharpen: sharpen,
        invert: invert,
        edgeDetection: edgeDetection,
        edgeDetection2: edgeDetection2,
        edgeDetection3: edgeDetection3,
        unsharpMasking: unsharpMasking
    }),
    Convolutiion = function(t, e) {
        var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1,
            n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0;
        return new RegisterOperation("Convolution2d").Input("tSrc", t.dtype).Input("tKernel", "float32").Output(t.dtype).LoadChunk("pickValue").Constant("KERNEL_WIDTH", e.shape[1]).Constant("KERNEL_HEIGHT", e.shape[0]).Uniform("bias", "float", n).Uniform("factor", "float", a).GLSLKernel(kernel$1).Compile({
            tSrc: t,
            tKernel: e
        })
    },
    kernels = convolutionKernels,
    index$1 = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 3,
            a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 3;
        return assert$$1(e >= 3, "Kernel size should be greater equal 3"), assert$$1(a > 0, "Sigma should be greater then 0"), Convolutiion(t, gaussianBlur(e, a))
    },
    kernel$2 = "vec4 operation(float y,float x){vec4 value=vec4(0.0);for(float dx=0.0;dx<K;dx+=1.0){for(float dy=0.0;dy<K;dy+=1.0){vec4 v=pickValue_tSrc((y*K)+dy,(x*K)+dx);if(S==0.0){value=v;}if(S==1.0){value+=v;}}}if(S==1.0){value/=K*K;}return value;}",
    index$2 = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2,
            a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "mean";
        assert$$1("mean" === a || "max" === a, 'DownsampleOp: Unsupported type of operation. Currently supported only "mean" and "max"');
        var n = 0;
        return "max" === a ? n = 0 : "mean" === a && (n = 1), new RegisterOperation("Downsample").Input("tSrc", t.dtype).Output(t.dtype).Constant("K", e).Constant("S", n).SetShapeFn(function() {
            var a = [~~(t.shape[0] / e), ~~(t.shape[1] / e), 4];
            return assert$$1(isValidOperationShape$$1(a), "DownsampleOperation: Invalid operation shape"), a
        }).LoadChunk("pickValue").GLSLKernel(kernel$2).Compile({
            tSrc: t
        })
    },
    kernel$3 = "vec4 operation(float y,float x){float wk=1.0;float hk=1.0;float dx=0.0;float dy=0.0;dx+=-1.0*pickScalarValue_tSrc(y-hk,x-wk);dx+=-2.0*pickScalarValue_tSrc(y,x-wk);dx+=-1.0*pickScalarValue_tSrc(y+wk,x-wk);dx+=+1.0*pickScalarValue_tSrc(y-wk,x+wk);dx+=+2.0*pickScalarValue_tSrc(y,x+wk);dx+=+1.0*pickScalarValue_tSrc(y+wk,x+wk);dy+=-1.0*pickScalarValue_tSrc(y-wk,x-wk);dy+=-2.0*pickScalarValue_tSrc(y-wk,x);dy+=-1.0*pickScalarValue_tSrc(y-wk,x+wk);dy+=+1.0*pickScalarValue_tSrc(y+wk,x-wk);dy+=+2.0*pickScalarValue_tSrc(y+wk,x);dy+=+1.0*pickScalarValue_tSrc(y+wk,x+wk);float magniture=sqrt((dx*dx)+(dy*dy));float theta=atan(dy/dx);return vec4(magniture,dx,dy,theta);}",
    index$3 = function(t) {
        return new RegisterOperation("SobelOperator").Input("tSrc", t.dtype).Output("float32").Uniform("uWidth", "float", t.shape[0]).Uniform("uHeight", "float", t.shape[1]).Constant("PI", Math.PI).GLSLKernel(kernel$3).LoadChunk("pickValue").Compile({
            tSrc: t
        })
    },
    dirrectionKernel = "vec4 operation(float y,float x){float dx=pickValue_tSrc(y,x+1.0).r-pickValue_tSrc(y,x-1.0).r;float dy=pickValue_tSrc(y+1.0,x).r-pickValue_tSrc(y-1.0,x).r;float magniture=sqrt((dx*dx)+(dy*dy));return vec4(magniture,atan(dy/dx),dx,dy);}",
    groupKernel = "float A=180.0/9.0;float S=3.0;vec4 operation(float y,float x){float my=y-(S*floor(y/S));float mx=x-(S*floor(x/S));x=x/S;y=y/S;float index=mx+(my*S);float sum=0.0;for(float dx=0.0;dx<K;dx+=1.0){for(float dy=0.0;dy<K;dy+=1.0){vec4 v=pickValue_tSrc(((y*K)+dy),((x*K)+dx));float theta=abs(PI/2.0-v.g);float deg=theta*(180.0/PI);float i=floor(deg/A);if(i==index){sum+=v.r;}}}float rad=(index/9.0*PI);return vec4(sum,rad,0.0,0.0);}",
    groupMaxKernel = "const int w=int(W);const int h=int(H);const int k=int(K);const float S=3.0;float A=180.0/9.0;vec4 getPixel(float y,float x){float x1=x/float(w);float y1=y/float(h);return pickValue_tSrc(floor(y1*uSrcHeight),floor(x1*uSrcWidth));}vec4 getPixel(float y,float x,float xOffset,float yOffset){float x1=x/float(w);float y1=y/float(h);return pickValue_tSrc(floor(y1*uSrcHeight)+yOffset,floor(x1*uSrcWidth)+xOffset);}vec4 operation(float y,float x){float x1=x/W;float y1=y/H;float res=0.0;float tmpx=x/S;float tmpy=y/S;float sum[9];int count=0;vec4 value=getPixel(y,x);for(int _x=0;_x<k;_x+=1){for(int _y=0;_y<k;_y+=1){vec4 v=getPixel(y,x,float(_y),float(_x));float theta=abs(PI/2.0-v.g);float deg=theta*(180.0/PI);int i=int(floor(deg/A));if(i==1){sum[1]+=v.r;}if(i==2){sum[2]+=v.r;}if(i==3){sum[3]+=v.r;}if(i==4){sum[4]+=v.r;}if(i==5){sum[5]+=v.r;}if(i==6){sum[6]+=v.r;}if(i==7){sum[7]+=v.r;}if(i==8){sum[8]+=v.r;}}}int maxI=0;float maxV=0.0;for(int i=0;i<9;i++){if(maxV<sum[i]){maxI=i;maxV=sum[i];}}return vec4(maxI,maxV,0.0,0.0);}",
    hogDirrection = function(t) {
        return new RegisterOperation("HOGDirection").Input("tSrc", "uint8").Output("float32").Uniform("uWidth", "float", t.shape[1]).Uniform("uHeight", "float", t.shape[0]).LoadChunk("pickValue").GLSLKernel(dirrectionKernel).Compile({
            tSrc: t
        })
    },
    hogGroup = function(t, e) {
        return new RegisterOperation("HOG").Input("tSrc", "uint8").Output("float32").Uniform("uSrcWidth", "float", t.shape[1]).Uniform("uSrcHeight", "float", t.shape[0]).Uniform("uWidth", "float", 3 * ~~(t.shape[1] / e)).Uniform("uHeight", "float", 3 * ~~(t.shape[0] / e)).Constant("PI", Math.PI).Constant("W", ~~(t.shape[1] / e)).Constant("H", ~~(t.shape[0] / e)).Constant("K", e).LoadChunk("pickValue").SetShapeFn(function() {
            return [3 * ~~(t.shape[0] / e), 3 * ~~(t.shape[1] / e), 4]
        }).GLSLKernel(groupKernel).Compile({
            tSrc: t
        })
    },
    hogGroupMax = function(t, e) {
        return new RegisterOperation("HOGMax").Input("tSrc", "uint8").Output("float32").Uniform("uSrcWidth", "float", t.shape[1]).Uniform("uSrcHeight", "float", t.shape[0]).Uniform("uWidth", "float", ~~(t.shape[1] / e)).Uniform("uHeight", "float", ~~(t.shape[0] / e)).Constant("PI", Math.PI).Constant("W", ~~(t.shape[1] / e)).Constant("H", ~~(t.shape[0] / e)).Constant("K", e).LoadChunk("pickValue").SetShapeFn(function() {
            return [~~(t.shape[0] / e), ~~(t.shape[1] / e), 4]
        }).GLSLKernel(groupMaxKernel).Compile({
            tSrc: t
        })
    },
    index$4 = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 10,
            a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "max";
        assert$$1("max" === a || "visualize" === a, "Unsupported type of HOG operation.\n     Currently availiable max and visualize.");
        var n = null;
        return "max" === a && (n = hogGroupMax(hogDirrection(t), e)), "visualize" === a && (n = hogGroup(hogDirrection(t), e)), n
    },
    kernel$4 = "vec4 operation(float y,float x){return pickValue_tSrc(y,x);}",
    index$5 = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : t.dtype;
        return new RegisterOperation("Cast").Input("tSrc", t.dtype).Output(e).LoadChunk("pickValue").GLSLKernel(kernel$4).Compile({
            tSrc: t
        })
    },
    nmsKernel = "\n#define STROKE uSize\nvec4 operation(float y,float x){vec4 M=pickValue_tSrc(y,x);float N=pickValue_tSrc(y+STROKE,x).r;float S=pickValue_tSrc(y-STROKE,x).r;float W=pickValue_tSrc(y,x-STROKE).r;float E=pickValue_tSrc(y,x+STROKE).r;float SE=pickValue_tSrc(y-STROKE,x+STROKE).r;float NW=pickValue_tSrc(y+STROKE,x-STROKE).r;float NE=pickValue_tSrc(y+STROKE,x+STROKE).r;float SW=pickValue_tSrc(y-STROKE,x-STROKE).r;float H=0.0;float V=M.r;float dx=M.g;float dy=M.b;float theta=atan(dy/dx);float deg=theta*(180.0/PI);float angle=0.0;if(deg<0.0){deg=180.0+deg;}if(deg<22.5||deg>=157.5){if(V>W&&V>E){H+=1.0;}}if(deg<67.5&&deg>=22.5){if(V>SW&&V>NE){H+=1.0;}}if(deg<112.5&&deg>=67.5){if(V>N&&V>S){H+=1.0;}}if(deg<157.5&&deg>=112.5){if(V>NW&&V>SE){H+=1.0;}}if(H==1.0){return vec4(V,V,V,255);}else{return vec4(0,0,0,255);}}",
    hysteresisKernel = "\n#define STROKE uSize\nvec4 operation(float y,float x){vec4 M=pickValue_tSrc(y,x);float N=pickValue_tSrc(y+STROKE,x).r;float S=pickValue_tSrc(y-STROKE,x).r;float W=pickValue_tSrc(y,x-STROKE).r;float E=pickValue_tSrc(y,x+STROKE).r;float SE=pickValue_tSrc(y-STROKE,x+STROKE).r;float NW=pickValue_tSrc(y+STROKE,x-STROKE).r;float NE=pickValue_tSrc(y+STROKE,x+STROKE).r;float SW=pickValue_tSrc(y-STROKE,x-STROKE).r;float V=M.r;float H=0.0;if(V>uThresholdHigh){H+=1.0;}if(V>uThresholdLow&&V<uThresholdHigh){if(N>0.0||S>0.0||W>0.0||E>0.0||SE>0.0||NW>0.0||NE>0.0||SW>0.0){H+=1.0;}}if(H==1.0){return vec4(255,255,255,255);}else{return vec4(0,0,0,255);}}",
    CannyNMS = function(t) {
        return new RegisterOperation("ImageCannyEdgesNMS").Input("tSrc", t.dtype).Output(t.dtype).LoadChunk("pickValue").Uniform("uSize", "float", 1).Constant("PI", Math.PI).GLSLKernel(nmsKernel).Compile({
            tSrc: t
        })
    },
    CannyHysteresis = function(t, e, a) {
        return assert$$1(e >= 0, "Canny low threshold should be greater equal 0"), assert$$1(a <= 1, "Canny high threshold should be less equal 1"), new RegisterOperation("ImageCannyEdgesHysteresis").Input("tSrc", t.dtype).Output(t.dtype).LoadChunk("pickValue").Uniform("uSize", "float", 1).Uniform("uThresholdLow", "float", e).Uniform("uThresholdHigh", "float", a).GLSLKernel(hysteresisKernel).Compile({
            tSrc: t
        })
    },
    index$6 = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : .25,
            a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : .75;
        return CannyHysteresis(CannyNMS(t), e, a)
    },
    kernel$5 = "const float _step=1.0/CLUSTERS;vec4 operation(float y,float x){float minDistance=256.0;float label=0.0;vec3 value=pickValue_tSrc(y,x).rgb;for(int i=0;i<int(CLUSTERS);i+=1){vec3 curr=pickValue_tCentroids(float(i),0.0).rgb;float distance=sqrt(((value.r-curr.r)*(value.r-curr.r)));if(distance<minDistance){minDistance=distance;label=float(i)/CLUSTERS;}}return vec4(label,label,label,1.0);}",
    index$7 = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 3;
        return assert$$1("uint8" === t.dtype, "Color Segmentation currently available for uint8 image input"), assert$$1(e > 1, "Number of clusters should be greater than 1"), new RegisterOperation("ImageColorSegmentation").Input("tSrc", "uint8").Input("tCentroids", "uint8").Output("uint8").LoadChunk("pickValue").Constant("CLUSTERS", e).GLSLKernel(kernel$5).PreCompile(function(t) {
            var a = ~~(256 / e);
            t.centroids = new Tensor("uint8", [e, 1, 4]);
            for (var n = 0; n < e; n += 1) t.centroids.set(n, 0, 0, n * a);
            t.assignInput("tCentroids", t.centroids)
        }).Compile({
            tSrc: t
        })
    };

function parallelReductionCheckSteps() {
    for (var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [1], a = t, n = 0; n < e.length; n += 1) a /= e[n];
    return 1 === a
}

function parallelReductionCheckSteps2d() {
    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [1, 1],
        e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [
            [1, 1]
        ];
    return parallelReductionCheckSteps(t[0], e.map(function(t) {
        return t[0]
    })) && parallelReductionCheckSteps(t[0], e.map(function(t) {
        return t[1]
    }))
}

function parallelReductionGetSteps() {
    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
        e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1,
        a = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2],
        n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : t,
        r = Math.pow(t, 1 / e);
    if (t % 1 != 0) throw new RangeError("Can't get parallel reduction steps for non-integer, got \"" + t + '"');
    if (n < 1) throw new RangeError("Can't get parallel reduction steps for maxLayerSize below less than 1, got \"" + n + '"');
    if (r % 1 == 0 && r < n) return new Array(e).fill(r);
    for (var i = [], o = t, s = r, l = 0; l < e; l += 1) {
        s = Math.pow(o, 1 / (e - l));
        for (var u = Math.ceil(s);
            (o % u != 0 || o / u > n) && o / u != 1;) u += 1;
        if (1 === u && a) break;
        o /= u, i.push(u)
    }
    return i
}

function parallelReductionGetSteps2d() {
    for (var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [1, 1], e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1, a = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2], n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : t, r = parallelReductionGetSteps(t[0], e, a, n[0]), i = parallelReductionGetSteps(t[1], e, a, n[1]), o = [], s = 0; s < e && (r[s] || i[s]); s += 1) o.push([r[s] || 1, i[s] || 1]);
    return o
}

function clacConvolution(t, e) {
    var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
    return Math.ceil((t - e + 1) / a)
}
var getMean = "const int kx=int(KX);const int ky=int(KY);const int w=int(WIDTH);const int h=int(HEIGHT);vec4 operation(float gly,float glx){float size=KY*KX;float mean=0.0;float std=0.0;vec3 color=vec3(0.0,0.0,0.0);for(int y=0;y<ky;y+=1){for(int x=0;x<kx;x+=1){vec3 value=pickValue_tSrc(gly*KY+float(y),glx*KX+float(x)).rgb;color+=value.rgb;}}color/=size;mean=color.r;for(int y=0;y<ky;y+=1){for(int x=0;x<kx;x+=1){vec3 value=pickValue_tSrc(gly*KY+float(y),glx*KX+float(x)).rgb;std+=(value.r-mean)*(value.r-mean);}}std/=size;std=sqrt(std);if(std==0.0){std=1.0;}return vec4(color,255.0);}",
    getStd = "const int kx=int(KX);const int ky=int(KY);const int w=int(WIDTH);const int h=int(HEIGHT);vec4 operation(float gly,float glx){float size=KX*KY;vec3 std=vec3(0.0,0.0,0.0);vec3 mean=pickValue_tMean(0.0,0.0).rgb;for(int y=0;y<ky;y+=1){for(int x=0;x<kx;x+=1){vec3 value=pickValue_tSrc(gly*KY+float(y),glx*KX+float(x)).rgb;std+=(value-mean)*(value-mean);}}std/=size;std=sqrt(std);if(std.r==0.0){std.r=255.0;}if(std.g==0.0){std.g=255.0;}if(std.b==0.0){std.b=255.0;}return vec4(std,255.0);}",
    reduceStd = "const int kx=int(KX);const int ky=int(KY);const int w=int(WIDTH);const int h=int(HEIGHT);vec4 operation(float gly,float glx){float size=KX*KY;vec3 std=vec3(0.0,0.0,0.0);for(int y=0;y<ky;y+=1){for(int x=0;x<kx;x+=1){vec3 mstd=pickValue_tStd(gly*KY+float(y),glx*KX+float(x)).rgb;std+=mstd*mstd;}}std/=size;std=sqrt(std);if(std.r==0.0){std.r=255.0;}if(std.g==0.0){std.g=255.0;}if(std.b==0.0){std.b=255.0;}return vec4(std,255.0);}",
    joinKernel = "vec4 operation(float gly,float glx){if(gly==0.0){return texture2D(tMean,vec2(0,0));}else{return texture2D(tStd,vec2(0,0));}}",
    ImageReduceStd = function(t, e) {
        return new RegisterOperation("ImageReduceStd").Input("tStd", t.dtype).Output(t.dtype).Constant("WIDTH", t.shape[1]).Constant("HEIGHT", t.shape[0]).Uniform("uWidth", "float", t.shape[1] / e[1]).Uniform("uHeight", "float", t.shape[0] / e[0]).Constant("KX", e[1]).Constant("KY", e[0]).LoadChunk("pickValue").SetShapeFn(function() {
            return [~~(t.shape[0] / e[0]), ~~(t.shape[1] / e[1]), 4]
        }).GLSLKernel(reduceStd).Compile({
            tStd: t
        })
    },
    ImageExtractStd = function(t, e, a) {
        return new RegisterOperation("ImageExtractStd").Input("tSrc", t.dtype).Input("tMean", e.dtype).Output(t.dtype).Constant("WIDTH", t.shape[1]).Constant("HEIGHT", t.shape[0]).Uniform("uWidth", "float", t.shape[1] / a[1]).Uniform("uHeight", "float", t.shape[0] / a[0]).Constant("KX", a[1]).Constant("KY", a[0]).LoadChunk("pickValue").SetShapeFn(function() {
            return [~~(t.shape[0] / a[0]), ~~(t.shape[1] / a[1]), 4]
        }).GLSLKernel(getStd).Compile({
            tSrc: t,
            tMean: e
        })
    },
    ImageExtractMean = function(t, e) {
        return new RegisterOperation("ImageExtractMean").Input("tSrc", t.dtype).Output(t.dtype).Constant("WIDTH", t.shape[1]).Constant("HEIGHT", t.shape[0]).Uniform("uWidth", "float", t.shape[1] / e[1]).Uniform("uHeight", "float", t.shape[0] / e[0]).Constant("KX", e[1]).Constant("KY", e[0]).LoadChunk("pickValue").SetShapeFn(function() {
            return [~~(t.shape[0] / e[0]), ~~(t.shape[1] / e[1]), 4]
        }).GLSLKernel(getMean).Compile({
            tSrc: t
        })
    },
    JoinOp = function(t, e) {
        return new RegisterOperation("ImageJoin").Input("tMean", t.dtype).Input("tStd", e.dtype).Output(t.dtype).SetShapeFn(function() {
            return [2, 1, 4]
        }).GLSLKernel(joinKernel).Compile({
            tMean: t,
            tStd: e
        })
    },
    meanStdOp = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1,
            a = arguments[2],
            n = [
                [t.shape[0], t.shape[1]]
            ];
        Array.isArray(e) ? (assert$$1(parallelReductionCheckSteps2d(t.shape, e), "ImageMeanStd: Provided steps doesn't converge in 1 px in ImageExtractMeanStd operation"), n = e) : "number" == typeof e && e > 0 && (n = parallelReductionGetSteps2d(t.shape, e));
        for (var r = ImageExtractMean(t, n[0]), i = 1; i < n.length; i += 1) r = ImageExtractMean(r, n[i]);
        if (a) return r;
        for (var o = ImageExtractStd(t, r, n[0]), s = 1; s < n.length; s += 1) o = ImageReduceStd(o, n[s]);
        return JoinOp(r, o)
    },
    getHistogramKernel = "const int kx=int(KX);const int ky=int(KY);precision highp float;vec4 operation(float gly,float iglx){float size=KX*KY;float glx=floor(iglx/COUNT);float currentIndex=iglx-(glx*COUNT);vec4 count=vec4(0.0);vec4 ones=vec4(1.0);vec4 twos=vec4(2.0);vec4 currentIndex4=vec4(currentIndex);vec4 value;for(int y=0;y<ky;y+=1){for(int x=0;x<kx;x+=1){value=pickValue_tSrc(gly*KY+float(y),glx*KX+float(x));vec4 index=floor((value-MIN)/STEP+0.5);count+=step(twos,ones/(abs(index-currentIndex4)));}}return count;}",
    reduceKernel = "const int kx=int(KX);const int ky=int(KY);vec4 operation(float gly,float iglx){float size=KX*KY;float glx=floor(iglx/COUNT);float currentIndex=iglx-(glx*COUNT);vec4 count=vec4(0.0);for(int y=0;y<ky;y+=1){for(int x=0;x<kx;x+=1){count+=pickValue_tSrc(gly*KY+float(y),(glx*KX+float(x))*COUNT+currentIndex);}}return count;}",
    ImageExtractHistogram = function(t, e, a, n, r, i) {
        return new RegisterOperation("ImageExtractHistogram").Input("tSrc", t.dtype).Output("float32").Constant("KX", e[1]).Constant("KY", e[0]).LoadChunk("pickValue").Constant("MIN", a).Constant("MAX", n).Constant("STEP", r).Constant("COUNT", i).SetShapeFn(function() {
            return [~~(t.shape[0] / e[0]), ~~(t.shape[1] / e[1]) * i, 4]
        }).GLSLKernel(getHistogramKernel).Compile({
            tSrc: t
        })
    },
    ImageReduceHistogram = function(t, e, a) {
        return new RegisterOperation("ImageReduceHistogram").Input("tSrc", "float32").Output("float32").Constant("KX", e[1]).Constant("KY", e[0]).LoadChunk("pickValue").Constant("COUNT", a).SetShapeFn(function() {
            return [~~(t.shape[0] / e[0]), ~~(t.shape[1] / e[1]), 4]
        }).GLSLKernel(reduceKernel).Compile({
            tSrc: t
        })
    },
    histogramOp = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1,
            a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
            n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1,
            r = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 1 / 255,
            i = [
                [t.shape[0], t.shape[1]]
            ],
            o = ~~((n - a + r) / r);
        Array.isArray(e) ? (assert$$1(parallelReductionCheckSteps2d(t.shape, e), "ImageExtractHistogram: Provided steps doesn't converge in 1 px in operation"), i = e) : "number" == typeof e && e > 0 && (i = parallelReductionGetSteps2d(t.shape, e, !0, [ENV.MAX_TEXTURE_SIZE, ENV.MAX_TEXTURE_SIZE / 256 / (ENV.SUPPORTS_FLOAT_TEXTURES ? 1 : 4)]));
        for (var s = ImageExtractHistogram(t, i[0], a, n, r, o), l = 1; l < i.length; l += 1) s = ImageReduceHistogram(s, i[l], o);
        return s
    },
    getMinMax = "const int kx=int(KX);const int ky=int(KY);const float INF=1.0/0.0;const float h2=OUT_VIEW.y/2.0;vec4 operation(float igly,float glx){float size=KX*KY;vec3 minV=vec3(INF);vec3 maxV=vec3(-INF);float gly=igly;if(gly>=h2){gly-=h2;}for(int y=0;y<ky*2;y+=1){for(int x=0;x<kx;x+=1){vec3 value=pickValue_tSrc(gly*KY+float(y),glx*KX+float(x)).rgb;minV=min(minV,value.rgb);maxV=max(maxV,value.rgb);}}if(igly<h2){return vec4(minV,255.0);}else{return vec4(maxV,255.0);}}",
    reduceMinMax = "const int kx=int(KX);const int ky=int(KY);const float INF=1.0/0.0;const float h2=OUT_VIEW.y/2.0;vec4 operation(float gly,float glx){float size=KX*KY;vec3 minV=vec3(INF);vec3 maxV=vec3(-INF);vec3 value;for(int y=0;y<ky;y+=1){for(int x=0;x<kx;x+=1){value=pickValue_tSrc(gly*KY+float(y),glx*KX+float(x)).rgb;minV=min(minV,value);maxV=max(maxV,value);}}if(gly<h2){return vec4(minV,255.0);}return vec4(maxV,255.0);}",
    ImageExtractMinMax = function(t, e) {
        return new RegisterOperation("ImageExtractMinMax").Input("tSrc", t.dtype).Output(t.dtype).Constant("KX", e[1]).Constant("KY", e[0]).LoadChunk("pickValue").SetShapeFn(function() {
            return [2 * ~~(t.shape[0] / e[0]), ~~(t.shape[1] / e[1]), 4]
        }).GLSLKernel(getMinMax).Compile({
            tSrc: t
        })
    },
    ImageReduceMinMax = function(t, e) {
        return new RegisterOperation("ImageReduceMinMax").Input("tSrc", t.dtype).Output(t.dtype).Constant("KX", e[1]).Constant("KY", e[0]).LoadChunk("pickValue").SetShapeFn(function() {
            return [~~(t.shape[0] / e[0]), ~~(t.shape[1] / e[1]), 4]
        }).GLSLKernel(reduceMinMax).Compile({
            tSrc: t
        })
    },
    minMaxOp = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1,
            a = [
                [t.shape[0], t.shape[1]]
            ];
        Array.isArray(e) ? (assert$$1(parallelReductionCheckSteps2d(t.shape, e), "ImageMeanStd: Provided steps doesn't converge in 1 px in ImageExtractMeanStd operation"), a = e) : "number" == typeof e && e > 0 && (a = parallelReductionGetSteps2d(t.shape, e));
        for (var n = ImageExtractMinMax(t, a[0]), r = 1; r < a.length; r += 1) n = ImageReduceMinMax(n, a[r]);
        return n
    },
    kernel$6 = "vec4 operation(float y,float x){vec4 prev=pickValue_tPrev(y,x);vec4 curr=pickValue_tCurr(y,x);float v=sqrt((curr.x-prev.x)*(curr.x-prev.x)+(curr.y-prev.y)*(curr.y-prev.y)+(curr.w-prev.w)*(curr.w-prev.w));return vec4(v,v,v,1.0);}",
    index$8 = function(t, e) {
        return assert$$1(assertShapesAreEqual$$1(t, e), "MotionDetect: Current and previous input should have the same shape."), new RegisterOperation("MotionDetect").Input("tCurr", t.dtype).Input("tPrev", e.dtype).Output(t.dtype).LoadChunk("pickValue").GLSLKernel(kernel$6).Compile({
            tCurr: t,
            tPrev: e
        })
    },
    kernel$7 = "vec4 operation(float y,float x){vec4 col=pickValue_tSrc(y,x)*255.0;float res=0.0;if((col.r>uRThreshold)&&(col.g>uGThreshold)&&(col.b>uBThreshold)&&(col.r>col.g)&&(col.r>col.b)&&(col.r-min(col.g,col.b)>uRtoMinDiffThreshold)&&(abs(col.r-col.g)>uRtoGDiffThreshold)){res=1.0;}return vec4(res,0.0,0.0,1.0);}",
    index$9 = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return new RegisterOperation("SkinTest").Input("tSrc", t.dtype).Output(t.dtype).Uniform("uRThreshold", "float", e.uRThreshold || 95).Uniform("uGThreshold", "float", e.uGThreshold || 40).Uniform("uBThreshold", "float", e.uBThreshold || 20).Uniform("uRtoMinDiffThreshold", "float", e.uRtoMinDiffThreshold || 15).Uniform("uRtoGDiffThreshold", "float", e.uRtoGDiffThreshold || 15).LoadChunk("pickValue").GLSLKernel(kernel$7).Compile({
            tSrc: t
        })
    },
    kernel$8 = "vec4 operation(float gly,float glx){float x;float y;if(SWAP_COORDS){x=gly;y=glx;}else{x=glx;y=gly;}float _sy=floor(x/SX);float _sx=x-(_sy*SX);float _y=floor(y/WIN_SIZE_X);float _x=y-(_y*WIN_SIZE_X);return pickValue_tSrc(_sy*STRIDE_Y+_y,_sx*STRIDE_X+_x);}",
    kernelFlat = "\n#define WIN_LENGTH WIN_SIZE_X * WIN_SIZE_Y\nvec4 operation(float gly,float glx){float i;if(SWAP_COORDS){i=gly;}else{i=glx;}float x=floor(i/WIN_LENGTH);float y=i-x*WIN_LENGTH;float _sy=floor(x/SX);float _sx=x-(_sy*SX);float _y=floor(y/WIN_SIZE_X);float _x=y-(_y*WIN_SIZE_X);return pickValue_tSrc(_sy*STRIDE_Y+_y,_sx*STRIDE_X+_x);}";

function getParam(t, e) {
    if ("number" == typeof t && t > 0 && isFinite(t)) return [t, t];
    if (Array.isArray(t) && 2 === t.length) return t;
    throw new Error('Invalid parameter "' + e + '", expected a positive finite number or array with 2 those numbers, but got ' + String(t))
}
var slidingWindowOp = function(t, e) {
        var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1,
            n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0,
            r = getParam(e, "windowSize"),
            i = getParam(a, "stride"),
            o = clacConvolution(t.shape[1], r[0], i[0]),
            s = clacConvolution(t.shape[0], r[1], i[1]),
            l = void 0,
            u = void 0,
            c = void 0;
        switch (n) {
            case 1:
                l = [o * s, r[0] * r[1], 4], c = !0, u = kernel$8;
                break;
            case 2:
                l = [1, o * s * r[0] * r[1], 4], c = !1, u = kernelFlat;
                break;
            case 3:
                l = [o * s * r[0] * r[1], 1, 4], c = !0, u = kernelFlat;
                break;
            case 0:
            default:
                l = [r[0] * r[1], o * s, 4], c = !1, u = kernel$8
        }
        return new RegisterOperation("SlidingWindow").Input("tSrc", "float32").Output("float32").Constant("WIDTH", t.shape[1]).Constant("HEIGHT", t.shape[0]).Constant("SX", o).Constant("SY", s).Constant("STRIDE_Y", i[1]).Constant("STRIDE_X", i[0]).Constant("WIN_SIZE_X", r[0]).Constant("WIN_SIZE_Y", r[1]).Constant("SWAP_COORDS", c).LoadChunk("pickValue").SetShapeFn(function() {
            return l
        }).GLSLKernel(u).Compile({
            tSrc: t
        })
    },
    kernel$9 = "vec4 findForAngle(float theta,bool invert,float gly,float glx){const float thetaTreshold=PI/6.0;float PER_STEP=(uStrokeMax-uStrokeMin)/STEPS;if(invert){theta+=PI;}float sn=sin(theta);float cs=cos(theta);float tx=cs*PER_STEP;float ty=sn*PER_STEP;float minX=cs*uStrokeMin;float minY=sn*uStrokeMin;float strokeWidth=0.0;int intersect=0;int cx=0;int cy=0;for(int i=int(STEPS);i>0;i-=1){int nx=int(glx+minX+tx*float(i));int ny=int(gly+minY+ty*float(i));float dist=sqrt(float((nx-int(glx))*(nx-int(glx)))+float((ny-int(gly))*(ny-int(gly))));float cannyValue=pickValue_tCanny(float(ny),float(nx)).r;vec4 sobelValue=pickValue_tSobel(float(ny),float(nx));float theta2=atan(sobelValue.b,sobelValue.g);if(invert){theta2+=PI;}if(cannyValue>0.0&&dist>uStrokeMin&&dist<uStrokeMax&&abs(abs(theta-theta2)-PI)<thetaTreshold){strokeWidth=dist;cx=nx;cy=ny;}}return vec4(strokeWidth,cx,cy,theta);}vec4 operation(float _y,float _x){vec4 sobel=pickValue_tSobel(_y,_x);vec4 canny=pickValue_tCanny(_y,_x);float dx=sobel.g;float dy=sobel.b;float _theta=atan(dy,dx);vec4 result=findForAngle(_theta,INVERT>0.0,_y,_x);float strokeWidth=result.r;int cx=int(result.g);int cy=int(result.b);float theta=result.a;float a=float(cx)-_x;float b=float(cy)-_y;if(C>0.0){if(canny.r>0.0&&cx>0&&cy>0){return vec4(strokeWidth,theta,int(cx),int(cy));}else{return vec4(0,0,0,0);}}if(canny.r>0.0&&cx>0&&cy>0){return vec4(strokeWidth,theta,0,1.0);}else{return vec4(0,0,0,0);}}",
    index$a = function(t, e) {
        var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 3,
            n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 10,
            r = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 10,
            i = arguments.length > 5 && void 0 !== arguments[5] && arguments[5],
            o = !(arguments.length > 6 && void 0 !== arguments[6]) || arguments[6];
        return new RegisterOperation("ImageStrokeWidthTransform").Input("tSobel", "float32").Input("tCanny", "uint8").Output("float32").LoadChunk("pickValue").Uniform("uStrokeMin", "float", a).Uniform("uStrokeMax", "float", n).Uniform("uWidth", "float", t.shape[0]).Uniform("uHeight", "float", t.shape[1]).Constant("STEPS", r).Constant("C", i ? 1 : 0).Constant("INVERT", o ? 1 : 0).Constant("PI", Math.PI).GLSLKernel(kernel$9).Compile({
            tCanny: e,
            tSobel: t
        })
    },
    kernel$a = "vec4 operation(float y,float x){vec4 chanels1=pickValue_tA(y,x);vec4 chanels2=pickValue_tB(y,x);return RESULT;}",
    index$b = function(t, e) {
        var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : ["1.r", "1.g", "2.b", "2.a"];
        assert$$1(t.dtype === e.dtype, "Concat operation: inputs should have the same dtype, got " + t.dtype + " and " + e.dtype), assert$$1(4 === a.length, "Concat operation: wrong input");
        for (var n = 0; n < a.length; n += 1) assert$$1("string" == typeof a[n] || !/^\d\.(r|g|b|a|x|y|z|w)$/.test(a[n]), "Concat operation: wrong input");
        return new RegisterOperation("Concat").Input("tA", t).Input("tB", e).Output(t.dtype).LoadChunk("pickValue").GLSLKernel(kernel$a.replace("RESULT", "vec4(" + a.map(function(t) {
            return "chanels" + t
        }).join(", ") + ")")).Compile({
            tA: t,
            tB: e
        })
    },
    l2Kernel = "vec4 operation(float y,float x){vec3 chanels=pickValue_tSrc(y,x).rgb;vec3 mean=pickValue_tStdMean(0.0,0.0).rgb;vec3 std=pickValue_tStdMean(1.0,0.0).rgb;vec3 value=(chanels-mean)/std;return vec4(value,1.0);}",
    minMaxKernel = "vec4 operation(float y,float x){vec3 chanels=pickValue_tSrc(y,x).rgb;vec3 minV=pickValue_tMinMax(0.0,0.0).rgb;vec3 maxV=pickValue_tMinMax(1.0,0.0).rgb;vec3 value=(chanels-minV)/(maxV-minV);return vec4(value,1.0);}",
    l2Norm = function(t, e) {
        return new RegisterOperation("l2Norm").Input("tSrc", "uint8").Input("tStdMean", "uint8").Output("uint8").LoadChunk("pickValue").GLSLKernel(l2Kernel).Compile({
            tSrc: t,
            tStdMean: e
        })
    },
    minMaxNorm = function(t, e) {
        return new RegisterOperation("minMaxNorm").Input("tSrc", "uint8").Input("tMinMax", "uint8").Output("uint8").LoadChunk("pickValue").GLSLKernel(minMaxKernel).Compile({
            tSrc: t,
            tMinMax: e
        })
    },
    index$c = function(t, e) {
        var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 2;
        assert$$1("l2" === e || "minmax" === e, "Unsupported type of normalization operation.\n     Currently availiable max and visualize.");
        var n = null;
        return "l2" === e && (n = l2Norm(t, meanStdOp(t, a))), "minmax" === e && (n = minMaxNorm(t, minMaxOp(t, a))), n
    },
    histKernel = "const float norm=1.0/(OUT_VIEW.x*OUT_VIEW.y);vec4 operation(float y,float x){vec4 histBase=pickValue_tSrc(y,x)*255.0;float r=pickValue_tHist(0.0,histBase.r).r;float g=pickValue_tHist(0.0,histBase.g).g;float b=pickValue_tHist(0.0,histBase.b).b;float a=pickValue_tHist(0.0,histBase.a).a;return vec4(r,g,b,255.0/norm)*norm;}",
    histCumulateKernel = "vec4 operation(float y,float x){vec4 sum=vec4(0.0);for(float i=0.0;i<255.0;i+=1.0){vec4 value=pickValue_tSrc(0.0,i);if(i<=x){sum+=value;}else{break;}}return sum;}",
    cumulateHistEq = function(t) {
        return new RegisterOperation("histogramCumulation").Input("tSrc", "float32").Output("float32").LoadChunk("pickValue").GLSLKernel(histCumulateKernel).Compile({
            tSrc: t
        })
    },
    histEq = function(t, e) {
        return new RegisterOperation("histogramEqualization").Input("tSrc", "uint8").Input("tHist", "float32").Output("uint8").LoadChunk("pickValue").GLSLKernel(histKernel).Compile({
            tSrc: t,
            tHist: e
        })
    },
    index$d = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2;
        return histEq(t, cumulateHistEq(histogramOp(t, e)))
    },
    kernel$b = "vec4 getPoint(vec2 p){return pickValue_tSrc(p.y,p.x);}mat3 getTransformMatrix(){vec3 r1=pickValue_tTransform(0.0,0.0).rgb;vec3 r2=pickValue_tTransform(1.0,0.0).rgb;vec3 r3=pickValue_tTransform(3.0,0.0).rgb;return mat3(r1,r2,r3);}vec4 operation(float y,float x){mat3 m=getTransformMatrix();float off=0.0;float ixs=0.0;float iys=0.0;float xs=0.0;float ys=0.0;float xs0=0.0;float ys0=0.0;float ws=0.0;float sc=0.0;float a=0.0;float b=0.0;xs0=m[0][1]*y+m[0][2];ys0=m[1][1]*y+m[1][2];ws=m[2][1]*y+m[2][2];xs0+=m[0][0]*x;ys0+=m[1][0]*x;ws+=m[2][0]*x;sc=1.0/ws;xs=xs0*sc;ys=ys0*sc;ixs=xs;iys=ys;a=max(xs-ixs,0.0);b=max(ys-iys,0.0);vec2 mvec=vec2(ixs,iys);vec2 ox=vec2(1.0,0.0);vec2 oy=vec2(1.0,1.0);vec4 p0=getPoint(mvec)+a*(getPoint(mvec+ox)-getPoint(mvec));vec4 p1=getPoint(mvec+oy)+a*(getPoint(mvec+ox+oy)-getPoint(mvec+oy));vec4 pres=p0+b*(p1-p0);return pres;}",
    index$e = function(t, e) {
        var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [10, 10, 4],
            n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : t.dtype;
        return new RegisterOperation("PerspectiveProjection").Input("tSrc", t.dtype).Input("tTransform", "float32").Output(n).LoadChunk("pickValue").Uniform("uSrcWidth", "float", t.shape[1]).Uniform("uSrcHeight", "float", t.shape[0]).Uniform("uWidth", "float", a[1]).Uniform("uHeight", "float", a[0]).SetShapeFn(function() {
            return a
        }).GLSLKernel(kernel$b).Compile({
            tSrc: t,
            tTransform: e
        })
    },
    transformKernel = "precision highp float;float intersectionX(vec4 line,float x){return((x-line.x)/(line.z-line.x)*(line.w-line.y)+line.y);}float intersectionY(vec4 line,float y){return((y-line.y)/(line.w-line.y)*(line.z-line.x)+line.x);}vec4 findSide(float x1,float y1,float x2,float y2){int i=0;vec2 i0=vec2(0,0);vec2 i1=vec2(0,0);float ax=0.0;float ay=intersectionY(vec4(x1,y1,x2,y2),ax);float by=0.0;float bx=intersectionX(vec4(x1,y1,x2,y2),by);float cx=MAX_DIST;float cy=intersectionY(vec4(x1,y1,x2,y2),cx);float dy=MAX_DIST;float dx=intersectionX(vec4(x1,y1,x2,y2),dy);if(ay<=MAX_DIST&&ay>=0.0){if(i==0){i0=vec2(ax,ay);i+=1;}}if(cy<=MAX_DIST&&cy>=0.0){if(i==0){i0=vec2(cx,cy);i+=1;}else{i1=vec2(cx,cy);}}if(bx<=MAX_DIST&&bx>=0.0){if(i==0){i0=vec2(bx,by);i+=1;}else{i1=vec2(bx,by);}}if(dx<=MAX_DIST&&dx>=0.0){if(i==0){i0=vec2(dx,dy);i+=1;}else{i1=vec2(dx,dy);}}return vec4(i0.x,i0.y,i1.x,i1.y);}float pow(float a){return a*a;}vec4 getStraight(float aIndex,float v,float dist,float angles){float y1;float y2;if(aIndex>angles){aIndex-=angles;y1=MAX_ANGLE-(angles*v/aIndex);y2=(-1.0+angles/aIndex)*uWidth+y1;}else{aIndex=angles-aIndex;y1=(angles*v/aIndex);y2=(1.0-angles/aIndex)*uWidth+y1;}return vec4(0.0,y1,uWidth,y2);}float getValue(float i,float lx,float ly,vec4 side){float xx=0.0;float yy=0.0;if(lx<ly){xx=i;yy=intersectionY(side,xx);}else{yy=i;xx=intersectionX(side,yy);}if(xx>0.0&&xx<uWidth&&yy>0.0&&yy<uHeight){float a=pickScalarValue_tSrc(floor(yy),floor(xx));if(a>0.0){return 1.0;}}return 0.0;}vec4 operation(float y,float x){float v_out=0.0;vec4 straight=getStraight(x,y,MAX_DIST,MAX_ANGLE/2.0);vec4 side=findSide(straight.x,straight.y,straight.z,straight.w);float lx=abs(side.z-side.x);float ly=abs(side.w-side.y);float k=1.0/D;for(float i=0.0;i<=D;i+=STEP){float a=getValue(i,lx,ly,side);if(a>0.0){v_out+=k;}}return vec4(v_out,v_out,v_out,255.0);}",
    enhanceKernel = "\n#define X_STEPS 10.0\n#define Y_STEPS 10.0\nvec4 operation(float y,float x){float value=pickValue_tSrc(y,x).r;float c=value*value;float sum=0.0;for(float j=0.0;j<Y_STEPS;j+=1.0){for(float i=0.0;i<X_STEPS;i+=1.0){sum+=pickValue_tSrc((y-Y_STEPS/2.0)+j,(x-X_STEPS/2.0)+i).r;}}float v=(c/sum)*X_STEPS*Y_STEPS;return vec4(v,v,v,1);}",
    peaksKernel = "const int w=int(W);const int h=int(H);vec4 operation(float _y,float _x){float mmax=0.0;float maxX=0.0;float maxY=0.0;float sy=_y*H;float sx=_x*W;float yLimit=O_HEIGHT-sy;float xLimit=O_WIDTH-sx;vec4 value;for(float y=0.0;y<H;y+=1.0){if(y>=yLimit){break;}for(float x=0.0;x<W;x+=1.0){if(x>=xLimit){break;}value=pickValue_tSrc(y+sy,x+sx);if(value.r>=mmax){mmax=value.r;if(uF<0.5){maxX=x+sx;maxY=y+sy;}else{maxX=value.g;maxY=value.b;}}}}return vec4(mmax,maxX,maxY,255.0);}",
    pcLinesReduceMax = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 10,
            a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
            n = ~~(t.shape[0] / e),
            r = ~~(t.shape[1] / e),
            i = Math.ceil(Math.max(t.shape[0] / n, t.shape[1] / r));
        return new RegisterOperation("ReduceMax").Input("tSrc", a ? "float32" : "uint8").Output("float32").Uniform("uF", "float", a).LoadChunk("pickValue").Constant("W", i).Constant("H", i).Constant("O_WIDTH", t.shape[1]).Constant("O_HEIGHT", t.shape[0]).Constant("K", 1 / i).SetShapeFn(function() {
            return [Math.ceil(t.shape[0] / i), Math.ceil(t.shape[1] / i), 4]
        }).GLSLKernel(peaksKernel).Compile({
            tSrc: t
        })
    },
    pcLinesEnhance = function(t) {
        return new RegisterOperation("PCLinesEnhanced").Input("tSrc", "uint8").Output("uint8").Uniform("uWidth", "float", t.shape[0]).Uniform("uHeight", "float", t.shape[0]).LoadChunk("pickValue").GLSLKernel(enhanceKernel).Compile({
            tSrc: t
        })
    },
    pcLinesTransform = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 3,
            a = Math.max(t.shape[0], t.shape[1]);
        return new RegisterOperation("PCLinesTransform").Input("tSrc", "float32").Output("uint8").Uniform("uWidth", "float", t.shape[1]).Uniform("uHeight", "float", t.shape[0]).Constant("PI", Math.PI).Constant("D", a).Constant("STEP", e).Constant("MAX_DIST", a).Constant("MAX_ANGLE", a).LoadChunk("pickValue").SetShapeFn(function() {
            return [a, a, 4]
        }).GLSLKernel(transformKernel).Compile({
            tSrc: t
        })
    },
    index$f = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2,
            a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 2,
            n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 2,
            r = pcLinesTransform(t, a);
        r = pcLinesReduceMax(r, n);
        for (var i = 0; i < e; i += 1) r = pcLinesReduceMax(r, n, 1);
        return r
    },
    RGBToHSVKernel = "vec3 rgb2hsv(vec3 c){vec4 K=vec4(0.0,-1.0/3.0,2.0/3.0,-1.0);vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g));vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r));float d=q.x-min(q.w,q.y);float e=1.0e-10;return vec3(abs(q.z+(q.w-q.y)/(6.0*d+e)),d/(q.x+e),q.x);}vec4 operation(float y,float x){return vec4(rgb2hsv(pickValue_tSrc(y,x).rgb),1);}",
    HSVToRGBKernel = "vec3 hsv2rgb(vec3 c){vec4 K=vec4(1.0,2.0/3.0,1.0/3.0,3.0);vec3 p=abs(fract(c.xxx+K.xyz)*6.0-K.www);return c.z*mix(K.xxx,clamp(p-K.xxx,0.0,1.0),c.y);}vec4 operation(float y,float x){return vec4(hsv2rgb(pickValue_tSrc(y,x).rgb),1);}",
    index$g = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "rgb_to_hsv";
        assert$$1("rgb_to_hsv" === e || "hsv_to_rgb" === e, "Unsupported type " + e + ", currenlty avaliable: rgb_to_hsv, hsv_to_rgb.");
        var a = null;
        return "rgb_to_hsv" === e && (a = RGBToHSVKernel), "hsv_to_rgb" === e && (a = HSVToRGBKernel), new RegisterOperation("HSV").Input("tSrc", t.dtype).Output(t.dtype).LoadChunk("pickValue").GLSLKernel(a).Compile({
            tSrc: t
        })
    },
    kernel$c = "vec4 operation(float y,float x){vec4 pixel=pickValue_tSrc(y,x);if(pixel[int(C)]>uT){return vec4(1.0,1.0,1.0,1.0);}else{return vec4(0.0,0.0,0.0,1.0);}}",
    index$h = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : .5,
            a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
        return assert$$1("number" == typeof e, "Only number available as a threshold value."), assert$$1(0 === a || 1 === a || 2 === a || 3 === a, "Only RGBA available: 0, 1, 2, 3"), new RegisterOperation("Threshold").Input("tSrc", t.dtype).Output(t.dtype).Constant("C", a).Uniform("uT", "float", e).LoadChunk("pickValue").GLSLKernel(kernel$c).Compile({
            tSrc: t
        })
    },
    kernel$d = "float HKW=floor(KW/2.0);float HKH=floor(KW/2.0);vec4 operation(float y,float x){float R=10000.0;float G=10000.0;float B=10000.0;y=y+HKH;x=x+HKW;for(float dx=0.0;dx<KW;dx+=1.0){for(float dy=0.0;dy<KH;dy+=1.0){vec4 v=pickValue_tSrc((y-dy),(x-dx));vec4 m=pickValue_tKernel(dy,dx);if(v.r<R&&m.r>0.0){R=v.r;}if(v.g<G&&m.g>0.0){G=v.g;}if(v.b<B&&m.b>0.0){B=v.b;}}}return vec4(R,G,B,1.0);}",
    erode = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [2, 2],
            a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        if (assert$$1(2 === e.length, "Erosion: Kernel size should be shape of rank 2"), isTensor$$1(a) && assert$$1(e[0] === a.shape[0] && e[1] === a.shape[1], "Erosion: Structure element has wrong size"), !a) {
            a = new Tensor("float32", [e[0], e[1], 4]);
            for (var n = 0; n < e[0]; n += 1)
                for (var r = 0; r < e[1]; r += 1) a.set(n, r, 0, 1), a.set(n, r, 1, 1), a.set(n, r, 2, 1), a.set(n, r, 3, 1)
        }
        return new RegisterOperation("Erosion").Input("tSrc", t.dtype).Input("tKernel", "float32").Output(t.dtype).Constant("KW", e[0]).Constant("KH", e[1]).LoadChunk("pickValue").GLSLKernel(kernel$d).Compile({
            tSrc: t,
            tKernel: a
        })
    },
    kernel$e = "float HKW=floor(KW/2.0);float HKH=floor(KW/2.0);vec4 operation(float y,float x){float R=0.0;float G=0.0;float B=0.0;y=y+HKH;x=x+HKW;for(float dx=0.0;dx<KW;dx+=1.0){for(float dy=0.0;dy<KH;dy+=1.0){vec4 v=pickValue_tSrc((y-dy),(x-dx));vec4 m=pickValue_tKernel(dy,dx);if(v.r>R&&m.r>0.0){R=v.r;}if(v.g>G&&m.g>0.0){G=v.g;}if(v.b>B&&m.b>0.0){B=v.b;}}}return vec4(R,G,B,1.0);}",
    dilate = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [2, 2],
            a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        if (assert$$1(2 === e.length, "Dilation: Kernel size should be shape of rank 2"), isTensor$$1(a) && assert$$1(e[0] === a.shape[0] && e[1] === a.shape[1], "Dilation: Structure element has wrong size"), !a) {
            a = new Tensor("float32", [e[0], e[1], 4]);
            for (var n = 0; n < e[0]; n += 1)
                for (var r = 0; r < e[1]; r += 1) a.set(n, r, 0, 1), a.set(n, r, 1, 1), a.set(n, r, 2, 1), a.set(n, r, 3, 1)
        }
        return new RegisterOperation("Dilation").Input("tSrc", t.dtype).Input("tKernel", "float32").Output(t.dtype).Constant("KW", e[0]).Constant("KH", e[1]).LoadChunk("pickValue").GLSLKernel(kernel$e).Compile({
            tSrc: t,
            tKernel: a
        })
    },
    kernelSub = "vec4 operation(float y,float x){vec4 A=pickValue_tA(y,x);vec4 B=pickValue_tB(y,x);return vec4(A.rgb-B.rgb,1.0);}",
    kernelAdd = "vec4 operation(float y,float x){vec4 A=pickValue_tA(y,x);vec4 B=pickValue_tB(y,x);return vec4(A.rgb+B.rgb,1.0);}",
    kernelMult = "vec4 operation(float y,float x){vec4 A=pickValue_tA(y,x);vec4 B=pickValue_tB(y,x);return vec4(A.rgb*B.rgb,1.0);}",
    kernelDiv = "vec4 operation(float y,float x){vec4 A=pickValue_tA(y,x);vec4 B=pickValue_tB(y,x);return vec4(A.rgb/B.rgb,1.0);}",
    kernelSubScalar = "vec4 operation(float y,float x){vec4 A=pickValue_tA(y,x);return vec4(A.rgb-uScalar,1.0);}",
    kernelAddScalar = "vec4 operation(float y,float x){vec4 A=pickValue_tA(y,x);return vec4(A.rgb+uScalar,1.0);}",
    kernelMultScalar = "vec4 operation(float y,float x){vec4 A=pickValue_tA(y,x);return vec4(A.rgb*uScalar,1.0);}",
    kernelDivScalar = "vec4 operation(float y,float x){vec4 A=pickValue_tA(y,x);return vec4(A.rgb/uScalar,1.0);}",
    pixelwiseMathOpValidation = function(t, e, a) {
        assert$$1(isTensor$$1(e) || isOperation$$1(e), t + ": A input is not a Tensor or Operation instance"), assert$$1(isTensor$$1(a) || isOperation$$1(a), t + ": B input is not a Tensor or Operation instance"), assert$$1(e.dtype === a.dtype, t + ": inputs should have the same dtype, got " + e.dtype + " and " + a.dtype), assert$$1(e.shape[0] === a.shape[0] && e.shape[1] === a.shape[1] && e.shape[3] === a.shape[3], t + ": inputs should have the same shapes, got " + e.shape + " and " + a.shape)
    },
    scalarMathOpValidation = function(t, e, a) {
        assert$$1("number" == typeof a, t + ": scalar value is not a number"), assert$$1(isTensor$$1(e) || isOperation$$1(e), t + ": A input is not a Tensor or Operation instance")
    },
    sub = function(t, e) {
        return pixelwiseMathOpValidation("Sub", t, e), new RegisterOperation("Sub").Input("tA", t).Input("tB", e).Output(t.dtype).LoadChunk("pickValue").GLSLKernel(kernelSub).Compile({
            tA: t,
            tB: e
        })
    },
    add = function(t, e) {
        return pixelwiseMathOpValidation("Add", t, e), new RegisterOperation("Add").Input("tA", t).Input("tB", e).Output(t.dtype).LoadChunk("pickValue").GLSLKernel(kernelAdd).Compile({
            tA: t,
            tB: e
        })
    },
    div = function(t, e) {
        return pixelwiseMathOpValidation("Div", t, e), new RegisterOperation("Div").Input("tA", t).Input("tB", e).Output(t.dtype).LoadChunk("pickValue").GLSLKernel(kernelDiv).Compile({
            tA: t,
            tB: e
        })
    },
    mult = function(t, e) {
        return pixelwiseMathOpValidation("Mult", t, e), new RegisterOperation("Mult").Input("tA", t).Input("tB", e).Output(t.dtype).LoadChunk("pickValue").GLSLKernel(kernelMult).Compile({
            tA: t,
            tB: e
        })
    },
    subScalar = function(t, e) {
        return scalarMathOpValidation("SubScalar", t, e), new RegisterOperation("SubScalar").Input("tA", t).Output(t.dtype).Uniform("uScalar", "float", e).LoadChunk("pickValue").GLSLKernel(kernelSubScalar).Compile({
            tA: t
        })
    },
    addScalar = function(t, e) {
        return scalarMathOpValidation("AddScalar", t, e), new RegisterOperation("AddScalar").Input("tA", t).Output(t.dtype).Uniform("uScalar", "float", e).LoadChunk("pickValue").GLSLKernel(kernelAddScalar).Compile({
            tA: t
        })
    },
    divScalar = function(t, e) {
        return scalarMathOpValidation("DivScalar", t, e), new RegisterOperation("DivScalar").Input("tA", t).Output(t.dtype).Uniform("uScalar", "float", e).LoadChunk("pickValue").GLSLKernel(kernelDivScalar).Compile({
            tA: t
        })
    },
    multScalar = function(t, e) {
        return scalarMathOpValidation("MultScalar", t, e), new RegisterOperation("MultScalar").Input("tA", t).Output(t.dtype).Uniform("uScalar", "float", e).LoadChunk("pickValue").GLSLKernel(kernelMultScalar).Compile({
            tA: t
        })
    },
    index$i = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "open",
            a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [2, 2],
            n = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
        switch (e) {
            case "open":
                return dilate(erode(t, a, n), a, n);
            case "close":
                return erode(dilate(t, a, n), a, n);
            case "gradient":
                return sub(dilate(t, a, n), erode(t, a, n));
            case "tophat":
                return sub(t, dilate(erode(t, a, n), a, n));
            case "blackhat":
                return sub(erode(dilate(t, a, n), a, n), t);
            default:
                return new Error("MorphTransform: unsopported operation type " + e)
        }
    },
    kernel$f = "vec4 operation(float y,float x){vec4 value;if(S==0.0){value=pickValue_tSrc(floor(y/K),floor(x/K));}else{float _y=y/K-0.501;float _x=x/K-0.501;float fy=floor(_y);float fx=floor(_x);float cy=ceil(_y);float cx=ceil(_x);float dcy=cy-_y;float dcx=cx-_x;float dfy=_y-fy;float dfx=_x-fx;value=pickValue_tSrc(fy,fx)*(dcy*dcx)+pickValue_tSrc(cy,fx)*(dfy*dcx)+pickValue_tSrc(cy,cx)*(dfy*dfx)+pickValue_tSrc(fy,cx)*(dcy*dfx);}return value;}",
    index$j = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2,
            a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "nearest";
        assert$$1("nearest" === a || "linear" === a, 'UpsampleOp: Unsupported interpolation type. Currently supported "nearest" and "linear"');
        var n = 0;
        return "nearest" === a ? n = 0 : "linear" === a && (n = 1), new RegisterOperation("Upsample").Input("tSrc", t.dtype).Output(t.dtype).Constant("K", e).Constant("S", n).SetShapeFn(function() {
            var a = [~~(t.shape[0] * e), ~~(t.shape[1] * e), 4];
            return assert$$1(isValidOperationShape$$1(a), "UpsampleOperation: Invalid operation shape"), a
        }).LoadChunk("pickValue").GLSLKernel(kernel$f).Compile({
            tSrc: t
        })
    },
    kernelX = "vec4 operation(float y,float x){vec4 res=pickValue_tSrc(y,x);for(float I=1.0;I<=SAMPLES_PER_PASS;I+=1.0){float cx=x-ceil(pow(1.0+SAMPLES_PER_PASS,PASSI)*I);if(cx<0.0){break;}res+=pickValue_tSrc(y,cx);}return res;}",
    kernelSQXS = "vec4 operation(float y,float x){vec4 res=pickValue_tSrc(y,x);res=res*res;vec4 v=vec4(0.0);for(float I=1.0;I<=SAMPLES_PER_PASS;I+=1.0){float cx=x-ceil(pow(1.0+SAMPLES_PER_PASS,PASSI)*I);if(cx<0.0){break;}v=pickValue_tSrc(y,cx);res+=v*v;}return res;}",
    kernelY = "vec4 operation(float y,float x){vec4 res=pickValue_tSrc(y,x);for(float I=1.0;I<=SAMPLES_PER_PASS;I+=1.0){float cy=y-ceil(pow(1.0+SAMPLES_PER_PASS,PASSI)*I);if(cy<0.0){break;}res+=pickValue_tSrc(cy,x);}return res;}",
    sumOp = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "x",
            a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
            n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1;
        return new RegisterOperation("SummedAreaTable").Input("tSrc", t.dtype).Output("float32").LoadChunk("pickValue").Constant("PASSI", a).Constant("LAST", !1).Constant("SAMPLES_PER_PASS", n).GLSLKernel("x" === e ? kernelX : kernelY).Compile({
            tSrc: t
        })
    },
    sqsumOp = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
            a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
        return new RegisterOperation("SquaredSummedAreaTable").Input("tSrc", t.dtype).Output("float32").LoadChunk("pickValue").Constant("PASSI", e).Constant("LAST", !1).Constant("SAMPLES_PER_PASS", a).GLSLKernel(kernelSQXS).Compile({
            tSrc: t
        })
    },
    summedAreaTableBase = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2,
            a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
            n = Math.ceil(Math.pow(t.shape[1], 1 / e)),
            r = Math.ceil(Math.pow(t.shape[0], 1 / e)),
            i = t,
            o = Math.log(t.shape[1]) / Math.log(Math.max(n + 1, 2)),
            s = Math.log(t.shape[0]) / Math.log(Math.max(r + 1, 2));
        a && (i = sqsumOp(i, 0, Math.min(n, t.shape[1] - 1)));
        for (var l = a ? 1 : 0; l < o; l += 1) i = sumOp(i, "x", l, Math.min(n, t.shape[1] - 1));
        for (var u = 0; u < s; u += 1) i = sumOp(i, "y", u, Math.min(r, t.shape[0] - 1));
        return i
    },
    sat = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2;
        return summedAreaTableBase(t, e, !1)
    },
    sqsat = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2;
        return summedAreaTableBase(t, e, !0)
    },
    kernel$g = "const int Channel=int(C);float pickValue(float y,float x){if(y<0.0||x<0.0){return 0.0;}return pickValue_tIntegralImage(y,x)[Channel];}vec4 operation(float y,float x){vec4 pixel=pickValue_tSrc(y,x);float huS=uS/2.0;vec2 p1=max(floor(vec2(x,y)-huS),vec2(0.0));vec2 p2=min(floor(vec2(x,y)+huS),OUT_VIEW-1.0);vec2 pd=p2+1.0-p1;float s=pd.x*pd.y;p1-=1.0;float sum=pickValue(p2.y,p2.x)-pickValue(p1.y,p2.x)-pickValue(p2.y,p1.x)+pickValue(p1.y,p1.x);if(pixel[Channel]*s<=sum*(100.0-uT)/100.0){return vec4(0.0,0.0,0.0,1.0);}else{return vec4(1.0,1.0,1.0,1.0);}}",
    index$k = function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 5,
            a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 50,
            n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0,
            r = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : sat(t);
        return assert$$1("number" == typeof a, "Only number available as a threshold value."), assert$$1("number" == typeof e, "Only number available as a size value."), assert$$1(0 === n || 1 === n || 2 === n || 3 === n, "Only RGBA available: 0, 1, 2, 3"), new RegisterOperation("Threshold").Input("tSrc", t.dtype).Input("tIntegralImage", r.dtype).Output(t.dtype).Constant("C", n).Uniform("uS", "float", e).Uniform("uT", "float", a).LoadChunk("pickValue").GLSLKernel(kernel$g).Compile({
            tSrc: t,
            tIntegralImage: r
        })
    },
    _createClass$9 = function() {
        function t(t, e) {
            for (var a = 0; a < e.length; a++) {
                var n = e[a];
                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
            }
        }
        return function(e, a, n) {
            return a && t(e.prototype, a), n && t(e, n), e
        }
    }();

function _classCallCheck$a(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}
var eps = 1e-7;

function between(t, e, a) {
    return t - eps <= e && e <= a + eps
}
var Line = function() {
    function t(e, a, n, r, i, o) {
        if (_classCallCheck$a(this, t), e instanceof ArrayBuffer) this.data = new Float32Array(e, a, 8);
        else if (Array.isArray(e)) {
            if (e.length < 8)
                for (var s = e.length; s <= 8; s += 1) e.push(0);
            this.data = new Float32Array(e)
        } else this.data = void 0 !== e && void 0 !== a ? new Float32Array([e, a, n, r, i, o, 0, 0]) : new Float32Array(8)
    }
    return _createClass$9(t, null, [{
        key: "Intersection",
        value: function(t, e) {
            var a = t.x1,
                n = t.y1,
                r = t.x2,
                i = t.y2,
                o = e.x1,
                s = e.y1,
                l = e.x2,
                u = e.y2,
                c = ((a * i - n * r) * (o - l) - (a - r) * (o * u - s * l)) / ((a - r) * (s - u) - (n - i) * (o - l)),
                h = ((a * i - n * r) * (s - u) - (n - i) * (o * u - s * l)) / ((a - r) * (s - u) - (n - i) * (o - l));
            if (isNaN(c) || isNaN(h)) return !1;
            if (a >= r) {
                if (!between(r, c, a)) return !1
            } else if (!between(a, c, r)) return !1;
            if (n >= i) {
                if (!between(i, h, n)) return !1
            } else if (!between(n, h, i)) return !1;
            if (o >= l) {
                if (!between(l, c, o)) return !1
            } else if (!between(o, c, l)) return !1;
            if (s >= u) {
                if (!between(u, h, s)) return !1
            } else if (!between(s, h, u)) return !1;
            return [c, h]
        }
    }]), _createClass$9(t, [{
        key: "set",
        value: function(t, e, a, n, r, i) {
            this.data[0] = t, this.data[1] = e, this.data[2] = a, this.data[3] = n, this.data[4] = r, this.data[5] = i, this.data[6] = 0, this.data[7] = 0
        }
    }, {
        key: "fromParallelCoords",
        value: function(t, e, a, n, r, i) {
            var o = a,
                s = void 0,
                l = void 0;
            l = t > i ? (i / (t -= i) - 1) * a + (s = r - i * e / t) : (1 - i / (t = i - t)) * a + (s = i * e / t), this.set(0, s, o, l, t, e)
        }
    }, {
        key: "clear",
        value: function() {
            this.data[0] = 0, this.data[1] = 0, this.data[2] = 0, this.data[3] = 0, this.data[4] = 0, this.data[5] = 0, this.data[6] = 0, this.data[7] = 0
        }
    }, {
        key: "fromArray",
        value: function(t) {
            this.data.set(t)
        }
    }, {
        key: "toArray",
        value: function() {
            return Array.prototype.slice.call(this.data)
        }
    }, {
        key: "length",
        get: function() {
            if (this.data[6]) return this.data[6];
            var t = this.data[2] - this.data[0],
                e = this.data[3] - this.data[1],
                a = Math.sqrt(Math.pow(t, 2) + Math.pow(e, 2));
            return this.data[6] = a, a
        }
    }, {
        key: "angle",
        get: function() {
            if (this.data[7]) return this.data[7];
            var t = this.data[2] - this.data[0],
                e = this.data[3] - this.data[1],
                a = Math.atan(e / t) / Math.PI * 180;
            return a < 0 && (a = 180 + a), this.data[7] = a, a
        }
    }, {
        key: "x1",
        get: function() {
            return this.data[0]
        },
        set: function(t) {
            this.data[0] = t
        }
    }, {
        key: "y1",
        get: function() {
            return this.data[1]
        },
        set: function(t) {
            this.data[1] = t
        }
    }, {
        key: "x2",
        get: function() {
            return this.data[2]
        },
        set: function(t) {
            this.data[2] = t
        }
    }, {
        key: "y2",
        get: function() {
            return this.data[3]
        },
        set: function(t) {
            this.data[3] = t
        }
    }, {
        key: "px",
        get: function() {
            return this.data[4]
        },
        set: function(t) {
            this.data[4] = t
        }
    }, {
        key: "py",
        get: function() {
            return this.data[5]
        },
        set: function(t) {
            this.data[5] = t
        }
    }]), t
}();

function sortPoints(t, e) {
    var a = [0, 0],
        n = null,
        r = null,
        i = null,
        o = null;
    a[0] += t[0][0], a[0] += t[1][0], a[0] += t[2][0], a[0] += t[3][0], a[1] += t[0][1], a[1] += t[1][1], a[1] += t[2][1], a[1] += t[3][1], a[0] /= 4, a[1] /= 4;
    for (var s = 0; s < t.length; s += 1) t[s][0] >= a[0] && t[s][1] >= a[1] && (i = t[s]), t[s][0] <= a[0] && t[s][1] <= a[1] && (n = t[s]), t[s][0] >= a[0] && t[s][1] <= a[1] && (r = t[s]), t[s][0] <= a[0] && t[s][1] >= a[1] && (o = t[s]);
    return [n, r, i, o]
}

function angleBetweenLines(t, e) {
    var a = t[2] - t[0],
        n = t[3] - t[1],
        r = e[2] - e[0],
        i = e[3] - e[1],
        o = a * r + n * i,
        s = (a * a + n * n) * (r * r + i * i);
    return Math.acos(o / Math.sqrt(s))
}

function transfromPoint(t, e, a) {
    var n, r = a,
        i = 0,
        o = 0,
        s = 0;
    return i = r.get(0, 1) * e + r.get(0, 2), o = r.get(1, 1) * e + r.get(1, 2), s = r.get(2, 1) * e + r.get(2, 2), i += r.get(0, 0) * t, o += r.get(1, 0) * t, [i * (n = 1 / (s += r.get(2, 0) * t)), o * n]
}

function generateTransformMatrix(t, e, a) {
    var n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0;
    return perspective_4point_transform(a, n, n, t.ax, t.ay, e[1] - n, n, t.bx, t.by, e[1] - n, e[0] - n, t.cx, t.cy, n, e[0] - n, t.dx, t.dy, 3 === a.shape.length && 4 === a.shape[2]), a
}

function perspective_4point_transform(t, e, a, n, r, i, o, s, l, u, c, h, f, p, d, v, g) {
    var y = arguments.length > 17 && void 0 !== arguments[17] && arguments[17],
        x = e,
        m = u,
        S = o,
        k = x * m * S,
        b = d,
        _ = x * b,
        C = m * _,
        T = c,
        E = x * T,
        w = i,
        A = a,
        $ = p,
        O = A * $,
        I = O * w,
        R = $ * w * T,
        V = $ * S,
        M = $ * T,
        L = m * S,
        K = b * m,
        U = b * w,
        P = T * w,
        F = 1 / (V - M - L + K - U + P),
        G = x * $,
        D = A * w,
        H = S * x,
        N = b * H,
        B = A * m,
        W = O * T,
        X = A * T * w,
        z = S * b * m,
        j = b * A,
        Y = -(C - k + E * w - w * _ - O * m + I - R + V * m) * F,
        q = (k - C - G * S + G * T + I - m * D + U * m - R) * F,
        Z = x,
        J = (-T * _ + N + B * S - O * S + W - X + U * T - z) * F,
        Q = (H * T - N - j * m + W - X + j * w + z - V * T) * F,
        tt = A,
        et = (-E + H + B - D + M - V - K + U) * F,
        at = (-_ + E + O - B + U - P - V + L) * F,
        nt = -((C = (m = h) * (_ = (x = n) * (b = g))) - (k = x * m * (S = l)) + (E = x * (T = f)) * (w = s) - w * _ - (O = (A = r) * ($ = v)) * m + (I = O * w) - (R = $ * w * T) + (V = $ * S) * m) * (F = 1 / (V - (M = $ * T) - (L = m * S) + (K = b * m) - (U = b * w) + (P = T * w))),
        rt = (k - C - (G = x * $) * S + G * T + I - m * (D = A * w) + U * m - R) * F,
        it = x,
        ot = (-T * _ + (N = b * (H = S * x)) + (B = A * m) * S - O * S + (W = O * T) - (X = A * T * w) + U * T - (z = S * b * m)) * F,
        st = (H * T - N - (j = b * A) * m + W - X + j * w + z - V * T) * F,
        lt = A,
        ut = (-E + H + B - D + M - V - K + U) * F,
        ct = (-_ + E + O - B + U - P - V + L) * F,
        ht = Z * et;
    I = tt * et - J;
    var ft = -J * at + Q * et,
        pt = Y - ht;
    D = Y * at - (E = q * et);
    var dt = (k = Y * tt) - (C = Z * J),
        vt = (S = Y * Q) - (_ = J * q);
    X = (m = Q - at * tt) * ($ = 1 / (S - k * at - _ + C * at + E * tt - ht * Q));
    var gt = (P = Z * at - q) * $,
        yt = (H = -q * tt + Z * Q) * $,
        xt = t.data;
    y ? (xt[0] = nt * X + rt * (I * $) - it * (ft * $), xt[1] = nt * gt + rt * (pt * $) - it * (D * $), xt[2] = -nt * yt - rt * (dt * $) + it * (vt * $), xt[4] = ot * X + st * (I * $) - lt * (ft * $), xt[5] = ot * gt + st * (pt * $) - lt * (D * $), xt[6] = -ot * yt - st * (dt * $) + lt * (vt * $), xt[8] = ut * X + ct * (I * $) - ft * $, xt[9] = ut * gt + ct * (pt * $) - D * $, xt[10] = -ut * yt - ct * (dt * $) + vt * $) : (xt[0] = nt * X + rt * (I * $) - it * (ft * $), xt[1] = nt * gt + rt * (pt * $) - it * (D * $), xt[2] = -nt * yt - rt * (dt * $) + it * (vt * $), xt[3] = ot * X + st * (I * $) - lt * (ft * $), xt[4] = ot * gt + st * (pt * $) - lt * (D * $), xt[5] = -ot * yt - st * (dt * $) + lt * (vt * $), xt[6] = ut * X + ct * (I * $) - ft * $, xt[7] = ut * gt + ct * (pt * $) - D * $, xt[8] = -ut * yt - ct * (dt * $) + vt * $)
}

function calcIntegralSum(t, e, a, n, r) {
    var i = (a - 1) * t.stride[0],
        o = (a + r) * t.stride[0],
        s = 4 * (e - 1),
        l = 4 * (e + n);
    return t.data[o + l] - (a > 0 ? t.data[i + l] : 0) - (e > 0 ? t.data[o + s] : 0) + (a > 0 && e > 0 ? t.data[i + s] : 0)
}

function calcHAARFeature(t, e, a, n, r, i) {
    for (var o = 0, s = a / i, l = 0; l < e.length; l += 1) o += calcIntegralSum(t, ~~(e[l][0] * s) + n, ~~(e[l][1] * s) + r, ~~(e[l][2] * s) - 1, ~~(e[l][3] * s) - 1) * e[l][4];
    return o
}
Line.BYTES_PER_ELEMENT = 36;
var _createClass$a = function() {
    function t(t, e) {
        for (var a = 0; a < e.length; a++) {
            var n = e[a];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
        }
    }
    return function(e, a, n) {
        return a && t(e.prototype, a), n && t(e, n), e
    }
}();

function _classCallCheck$b(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}
var Rect = function() {
    function t() {
        _classCallCheck$b(this, t);
        for (var e = arguments.length, a = Array(e), n = 0; n < e; n++) a[n] = arguments[n];
        a[0] instanceof ArrayBuffer ? this.data = new Float32Array(a[0], a[1], t.NUM_ELEMENTS) : Array.isArray(a[0]) ? this.data = new Float32Array(a[0]) : a[0] && a.length === t.NUM_ELEMENTS ? this.data = new Float32Array(a) : this.data = new Float32Array(t.NUM_ELEMENTS)
    }
    return _createClass$a(t, null, [{
        key: "Distance",
        value: function(t, e) {
            for (var a = 0, n = 0; n < 8; n += 2) {
                var r = Math.sqrt(Math.pow(t.data[n] - e.data[n], 2) + Math.pow(t.data[n + 1] - e.data[n + 1], 2));
                a += Math.pow(r, 2)
            }
            return (a = Math.sqrt(a / 8)) === 1 / 0 ? 0 : a
        }
    }, {
        key: "TriangleS",
        value: function(t, e, a, n, r, i) {
            return Math.abs(t * (n - i) + a * (i - e) + r * (e - n)) / 2
        }
    }]), _createClass$a(t, [{
        key: "isInRect",
        value: function(e, a) {
            return !(t.TriangleS(e, a, this.ax, this.ay, this.bx, this.by) + t.TriangleS(e, a, this.cx, this.cy, this.bx, this.by) + t.TriangleS(this.cx, this.cy, e, a, this.dx, this.dy) + t.TriangleS(this.dx, this.dy, e, a, this.ax, this.ay) - this.area > 0)
        }
    }, {
        key: "isNotEmpty",
        value: function() {
            return this.data[0] > 0 && this.data[1] > 0 && this.data[2] > 0 && this.data[3] > 0 && this.data[4] > 0 && this.data[5] > 0 && this.data[6] > 0 && this.data[7] > 0
        }
    }, {
        key: "clone",
        value: function() {
            return new t(this.toArray())
        }
    }, {
        key: "set",
        value: function(t, e, a, n, r, i, o, s) {
            this.data[0] = t, this.data[1] = e, this.data[2] = a, this.data[3] = n, this.data[4] = r, this.data[5] = i, this.data[6] = o, this.data[7] = s
        }
    }, {
        key: "assign",
        value: function(t) {
            return this.data.set(t.data), this
        }
    }, {
        key: "scale",
        value: function(t, e) {
            return this.data[0] *= t, this.data[1] *= e, this.data[2] *= t, this.data[3] *= e, this.data[4] *= t, this.data[5] *= e, this.data[6] *= t, this.data[7] *= e, this
        }
    }, {
        key: "fromLines",
        value: function(t, e, a, n) {
            var r = sortPoints([Line.Intersection(t, e), Line.Intersection(e, a), Line.Intersection(a, n), Line.Intersection(n, t)]);
            return !!(r[0] && r[1] && r[2] && r[3]) && (this.data[0] = r[0][0], this.data[1] = r[0][1], this.data[2] = r[1][0], this.data[3] = r[1][1], this.data[4] = r[2][0], this.data[5] = r[2][1], this.data[6] = r[3][0], this.data[7] = r[3][1], !0)
        }
    }, {
        key: "mul",
        value: function(t) {
            return this.data[0] *= t, this.data[1] *= t, this.data[2] *= t, this.data[3] *= t, this.data[4] *= t, this.data[5] *= t, this.data[6] *= t, this.data[7] *= t, this
        }
    }, {
        key: "scaleAt",
        value: function(t) {
            return this.data[0] -= t, this.data[1] -= t, this.data[2] -= t, this.data[3] += t, this.data[4] += t, this.data[5] += t, this.data[6] += t, this.data[7] -= t, this
        }
    }, {
        key: "clear",
        value: function() {
            this.data[0] = 0, this.data[1] = 0, this.data[2] = 0, this.data[3] = 0, this.data[4] = 0, this.data[5] = 0, this.data[6] = 0, this.data[7] = 0
        }
    }, {
        key: "fromDeep",
        value: function(t) {
            return this.data[0] = t[0][0], this.data[1] = t[0][1], this.data[2] = t[1][0], this.data[3] = t[1][1], this.data[4] = t[2][0], this.data[5] = t[2][1], this.data[6] = t[3][0], this.data[7] = t[3][1], this
        }
    }, {
        key: "perspective",
        value: function(t) {
            var e = transfromPoint(this.data[0], this.data[1], t),
                a = transfromPoint(this.data[2], this.data[3], t),
                n = transfromPoint(this.data[4], this.data[5], t),
                r = transfromPoint(this.data[6], this.data[7], t);
            return this.data[0] = e[0], this.data[1] = e[1], this.data[2] = a[0], this.data[3] = a[1], this.data[4] = n[0], this.data[5] = n[1], this.data[6] = r[0], this.data[7] = r[1], this
        }
    }, {
        key: "fromArray",
        value: function(t) {
            return this.data.set(t), this
        }
    }, {
        key: "toArray",
        value: function() {
            return Array.prototype.slice.call(this.data)
        }
    }, {
        key: "isInside",
        value: function(t) {
            return t.ax > this.ax && t.ay > this.ay && t.bx < this.bx && t.by > this.by && t.cx < this.cx && t.cy < this.cy && t.dx > this.dx && t.dy < this.dy
        }
    }, {
        key: "toJSON",
        value: function() {
            return this.toArray()
        }
    }, {
        key: "ax",
        get: function() {
            return this.data[0]
        },
        set: function(t) {
            this.data[0] = t
        }
    }, {
        key: "ay",
        get: function() {
            return this.data[1]
        },
        set: function(t) {
            this.data[1] = t
        }
    }, {
        key: "bx",
        get: function() {
            return this.data[2]
        },
        set: function(t) {
            this.data[2] = t
        }
    }, {
        key: "by",
        get: function() {
            return this.data[3]
        },
        set: function(t) {
            this.data[3] = t
        }
    }, {
        key: "cx",
        get: function() {
            return this.data[4]
        },
        set: function(t) {
            this.data[4] = t
        }
    }, {
        key: "cy",
        get: function() {
            return this.data[5]
        },
        set: function(t) {
            this.data[5] = t
        }
    }, {
        key: "dx",
        get: function() {
            return this.data[6]
        },
        set: function(t) {
            this.data[6] = t
        }
    }, {
        key: "dy",
        get: function() {
            return this.data[7]
        },
        set: function(t) {
            this.data[7] = t
        }
    }, {
        key: "distA",
        get: function() {
            return Math.sqrt(Math.pow(this.data[6] - this.data[0], 2) + Math.pow(this.data[7] - this.data[1], 2))
        }
    }, {
        key: "distB",
        get: function() {
            return Math.sqrt(Math.pow(this.data[4] - this.data[2], 2) + Math.pow(this.data[5] - this.data[3], 2))
        }
    }, {
        key: "distC",
        get: function() {
            return Math.sqrt(Math.pow(this.data[0] - this.data[2], 2) + Math.pow(this.data[1] - this.data[3], 2))
        }
    }, {
        key: "distD",
        get: function() {
            return Math.sqrt(Math.pow(this.data[6] - this.data[4], 2) + Math.pow(this.data[7] - this.data[5], 2))
        }
    }, {
        key: "distE",
        get: function() {
            return Math.sqrt(Math.pow(this.data[0] - this.data[4], 2) + Math.pow(this.data[1] - this.data[5], 2))
        }
    }, {
        key: "distF",
        get: function() {
            return Math.sqrt(Math.pow(this.data[6] - this.data[2], 2) + Math.pow(this.data[7] - this.data[3], 2))
        }
    }, {
        key: "angleA",
        get: function() {
            return angleBetweenLines([this.data[6], this.data[7], this.data[0], this.data[1]], [this.data[0], this.data[1], this.data[2], this.data[3]])
        }
    }, {
        key: "angleB",
        get: function() {
            return angleBetweenLines([this.data[0], this.data[1], this.data[2], this.data[3]], [this.data[2], this.data[3], this.data[4], this.data[5]])
        }
    }, {
        key: "angleC",
        get: function() {
            return angleBetweenLines([this.data[2], this.data[3], this.data[4], this.data[5]], [this.data[4], this.data[5], this.data[6], this.data[7]])
        }
    }, {
        key: "angleD",
        get: function() {
            return angleBetweenLines([this.data[4], this.data[5], this.data[6], this.data[7]], [this.data[6], this.data[7], this.data[0], this.data[1]])
        }
    }, {
        key: "area",
        get: function() {
            var t = this.distA,
                e = this.distB,
                a = this.distC,
                n = this.distD,
                r = (t + e + a + n) / 2;
            return Math.sqrt((r - t) * (r - e) * (r - a) * (r - n))
        }
    }, {
        key: "P",
        get: function() {
            return this.distA + this.distB + this.distC + this.distD
        }
    }]), t
}();
Rect.NUM_ELEMENTS = 8, Rect.BYTES_PER_ELEMENT = Rect.NUM_ELEMENTS * Float32Array.BYTES_PER_ELEMENT;
var _createClass$b = function() {
    function t(t, e) {
        for (var a = 0; a < e.length; a++) {
            var n = e[a];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
        }
    }
    return function(e, a, n) {
        return a && t(e.prototype, a), n && t(e, n), e
    }
}();

function _classCallCheck$c(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}
var TypedPool = function() {
    function t(e, a) {
        _classCallCheck$c(this, t), this.dataStore = new ArrayBuffer(a * e.BYTES_PER_ELEMENT), this.data = new Array(a), this.size = a;
        for (var n = 0; n < a; n += 1) this.data[n] = new e(this.dataStore, n * e.BYTES_PER_ELEMENT);
        this.length = 0
    }
    return _createClass$b(t, [{
        key: "map",
        value: function(t, e) {
            return this.data.map(t, e)
        }
    }, {
        key: "push",
        value: function(t) {
            if (!(this.length < this.size)) throw new Error("Typed Pool size exceed");
            this.data[this.length].data.set(t.data), this.length += 1
        }
    }, {
        key: "at",
        value: function(t) {
            if (t >= this.size) throw new Error("Out of range requested");
            return this.data[t]
        }
    }, {
        key: "release",
        value: function(t) {
            if (this.length = 0, t)
                for (var e = 0; e < this.size; e += 1) this.data[e].clear()
        }
    }]), t
}

export { index$6 as cannyEdges, canvasCreate, canvasFromTensor, canvasToTensor, index$1 as "gaussianBlur", index as "grayscale", imageTensorFromURL, index$e as "perspectiveProjection", RegisterOperation, Session, index$3 as "sobelOperator", Tensor, tensorFrom } 
//  Session, exports.GLTexture = GPUTexture, exports.RegisterOperation = RegisterOperation, exports.Tensor = Tensor, exports.Operation = Operation, exports.initDrawable = initDrawable, exports.initMouseTracking = initMouseTracking, exports.toImageData = toImageData, exports.getImageData = getImageData, exports.putImageData = putImageData, exports.canvasFromTensor = canvasFromTensor, exports.canvasToTensor = canvasToTensor, exports.canvasDrawLine = canvasDrawLine, exports.canvasDrawCircle = canvasDrawCircle, exports.canvasFillCircle = canvasFillCircle, exports.clearCanvas = clearCanvas, exports.canvasDrawRect = canvasDrawRect, exports.canvasFill = canvasFill, exports.canvasClear = canvasClear, exports.canvasInit = canvasInit, exports.canvasCreate = canvasCreate, exports.imageTensorFromURL = imageTensorFromURL, exports.CaptureVideo = CaptureVideo, exports.assert = assert$$1, exports.assertShapesAreEqual = assertShapesAreEqual$$1, exports.isValidShape = isValidShape$$1, exports.isOperation = isOperation$$1, exports.isTensor = isTensor$$1, exports.isValidGLSLChunk = isValidGLSLChunk$$1, exports.isValidGLSLVariableName = isValidGLSLVariableName$$1, exports.isValidOperationShape = isValidOperationShape$$1, exports.DeprecationError = DeprecationError$$1, exports.deprecationWarning = deprecationWarning$$1, exports.deprecationError = deprecationError$$1, exports.grayscale = index, exports.gaussianBlur = index$1, exports.downsample = index$2, exports.sobelOperator = index$3, exports.hog = index$4, exports.cast = index$5, exports.cannyEdges = index$6, exports.colorSegmentation = index$7, exports.meanStd = meanStdOp, exports.histogram = histogramOp, exports.minMax = minMaxOp, exports.motionDetect = index$8, exports.skinTest = index$9, exports.slidingWindow = slidingWindowOp, exports.swt = index$a, exports.concat = index$b, exports.norm = index$c, exports.histogramEqualization = index$d, exports.perspectiveProjection = index$e, exports.pcLines = index$f, exports.pcLinesEnhance = pcLinesEnhance, exports.pcLinesReduceMax = pcLinesReduceMax, exports.pcLinesTransform = pcLinesTransform, exports.HSVColor = index$g, exports.threshold = index$h, exports.conv2d = Convolutiion, exports.kernels = kernels, exports.erode = erode, exports.dilate = dilate, exports.morphologyEx = index$i, exports.upsample = index$j, exports.sat = sat, exports.sqsat = sqsat, exports.adaptiveThreshold = index$k, exports.sub = sub, exports.div = div, exports.mult = mult, exports.add = add, exports.subScalar = subScalar, exports.divScalar = divScalar, exports.multScalar = multScalar, exports.addScalar = addScalar, exports.range = range, exports.tensorFrom = tensorFrom, exports.tensorClone = tensorClone, exports.tensorInvert = tensorInvert, exports.tensorAssertEqual = tensorAssertEqual, exports.tensorAssertCloseEqual = tensorAssertCloseEqual, exports.tensorAssertMSEEqual = tensorAssertMSEEqual, exports.flipTensor = flipTensor, exports.invertTensor = invertTensor, exports.tensorMap = tensorMap, exports.tensorOnes = tensorOnes, exports.tensorFromFlat = tensorFromFlat, exports.Line = Line, exports.Rect = Rect, exports.TypedPool = TypedPool, exports.calcHAARFeature = calcHAARFeature, exports.calcIntegralSum = calcIntegralSum, exports.generateTransformMatrix = generateTransformMatrix, Object.defineProperty(exports, "__esModule", {
