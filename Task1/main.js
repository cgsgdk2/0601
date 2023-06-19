//let canvas, gl, time_loc = -2, frameBuffer, posBuffer, frameVertexArray;
let canvas, gl;
 
// Timer data
let startTime,
  oldTime,
  oldTimeFPS,
  pauseTime,
  timePerSec,
  frameCounter,
  FPS,
  globalTime,
  globalDeltaTime,
  localTime,
  localDeltaTime;

  const frameUniformBufferIndex = 5;

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
  }
  return shader;
}

async function fetchShader(shaderURL){
  try {
      const response = await fetch(shaderURL);
      const text = await response.text();

      return  text;
    // console.log(rext);
  } catch(err) {
      console.error(err);
  }
 }

 function myDragHandle(e){
  let x = 0;
 }

 function myWheelHandle(e){
  let 
  x = e.x / gl.canvas.width,
  y = e.y / gl.canvas.height;
  offx = x - frameData[0];
  let z = e.wheelDelta;
 }

function initGL() {
 canvas = document.getElementById("glCanvas");
 gl = canvas.getContext("webgl2");

  gl.clearColor(0.3, 0.47, 0.8, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // const vs = fetchShader("./vert.glsl");
  // const fs = fetchShader("./frag.glsl");

  const vs = `#version 300 es
    in vec4 in_pos;
    out vec2 tpos;
    out highp vec4 color;

    uniform float Time;

    void main() {
        gl_Position = in_pos;
        tpos = in_pos.xy;
        color = in_pos;
    }
  `;
  const fs = `#version 300 es
    precision highp float;
    out vec4 o_color;
    in vec2 tpos;
    in vec4 color;

    uniform float Time;
    
    vec2 CmplSet( float Re, float Im )
    {
      vec2 res = vec2(Re, Im);
      return res;
    }

    vec2 CmplAddCmpl( vec2 Z1, vec2 Z2 )
    {
      vec2 res = vec2(Z1.x + Z2.x, Z1.y + Z2.y);
      return res;
    }

    vec2 CmplMulCmpl( vec2 Z1, vec2 Z2 )
    {
      vec2 res = vec2(Z1.x * Z2.x - Z1.y * Z2.y, Z1.x * Z2.y + Z2.x * Z1.y);
      return res;
    }

    float CmplNorm( vec2 Z )
    {
      return sqrt(Z.x * Z.x + Z.y * Z.y);
    }
  
    float Mandelbrot( vec2 Z )
    {
      float n = 0.0;
      vec2 Z0 = Z;
      while (n < 255.0 && CmplNorm(Z) < 2.0)
        Z = CmplAddCmpl(CmplMulCmpl(Z, Z), Z0), n++;
      return n;
    }

    float Julia( vec2 Z, vec2 C )
    {
      float n = 0.0;

      while (n < 255.0 && CmplNorm(Z) < 2.0)
        Z = CmplAddCmpl(CmplMulCmpl(Z, Z), C), n++;
      return n;
    }

    void main() {
      float n = 0.0;
      vec2 z, c;

      //o_color = color * Julia(tpos, vec2(0.35, 0.38)) / 256.0;
      float x0 = -2.0, x1 = 2.0, y0 = -2.0, y1 = 2.0; 

      z = CmplSet(x0 + gl_FragCoord.x * (x1 - x0) / 200.0, y0 + gl_FragCoord.y * (y1 - y0) / 200.0);
      c = CmplSet(0.35 + 0.08 * sin(Time + 3.0), 0.39 + 0.08 * sin(1.1 * Time));
      
      n = Julia(z, vec2(0.35, 0.38));
      //n = Mandelbrot(z);

      o_color = vec4(n / 255.0, n / (8.0 * 255.0), n * 8.0 / 255.0, 1);
      //o_color = vec4(n / 16.0, n / 128.0, n * 2.0, 1);
}
  `;

  const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vs);
  const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fs);

  const program = gl.createProgram();
  gl.attachShader(program, vertexSh);
  gl.attachShader(program, fragmentSh);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert("!!!!!");
  }

  const posLoc = gl.getAttribLocation(program, "in_pos");

  frameVertexArray = gl.createVertexArray();
  gl.bindVertexArray(frameVertexArray);
  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  //const pos = [-1, -1, 0, 1, 1, -1, 0, -1, 1, 1, 0, 1];
  //const pos = [-1, -1, 0, 1, 1, -1, 0, -1, 1, 1, 0, 1];
  const pos = [-1, 1, 0, 1, -1, -1, 0, 1, 1, 1, 0, 1, 1, -1, 0, 1];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
  gl.vertexAttribPointer(posLoc, 4, gl.FLOAT, false, 0, 0);
  //gl.enableVertexAttribArray(posLoc);
  gl.enableVertexAttribArray(0);
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
  time_loc = gl.getUniformLocation(program, "Time");
  frameBuffer = gl.createBuffer();
  gl.bindBuffer(gl.UNIFORM_BUFFER, frameBuffer);
  gl.bufferData(gl.UNIFORM_BUFFER, 8  * 4, gl.STATIC_DRAW);
  gl.uniformBlockBinding(program, gl.getUniformBlockIndex(program, 'frameBuffer'), frameUniformBufferIndex);
  //Timer();
}
 
function initGL1() {
  canvas = document.getElementById("glCanvas");
  gl = canvas.getContext("webgl2");
  gl.clearColor(0.3, 0.47, 0.8, 1);
 
  // Shader initialization
  let vs, fs;
  const ft1 = fetch("/vert.glsl")
    .then((res) => res.text())
    .then((data) => {
      vs = data;
    });
  const ft2 = fetch("/frag.glsl")
    .then((res) => res.text())
    .then((data) => {
      fs = data;
    });
  const allData = Promise.all([ft1, ft2]);
  allData.then((res) => {
    // Shaders
    const vertexShader = loadShader(gl.VERTEX_SHADER, vs);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fs);
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      const Buf = gl.getProgramInfoLog(shaderProgram);
      console.log(Buf);
    }
 
    // Vertex array/buffer
    const posLoc = gl.getAttribLocation(shaderProgram, "in_pos");
 
    frameVertexArray = gl.createVertexArray();
    gl.bindVertexArray(frameVertexArray);
 
    posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    const x = 1;
    const pos = [-x, x, 0, -x, -x, 0, x, x, 0, x, -x, 0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    gl.useProgram(shaderProgram);
    time_loc = gl.getUniformLocation(shaderProgram, "Time");
 
    frameBuffer = gl.createBuffer();
    gl.bindBuffer(gl.UNIFORM_BUFFER, frameBuffer);
    gl.bufferData(gl.UNIFORM_BUFFER, 12 * 4, gl.STATIC_DRAW);
 
    gl.uniformBlockBinding(
      shaderProgram,
      gl.getUniformBlockIndex(shaderProgram, "frameBuffer"),
      frameUniformBufferIndex
    );
    //    Timer();
  });
} 

function Render(){
  if (time_loc = -2) return;

  if (time_loc != -1){
    const date = new Date();
    let t = 
    date.getMilliseconds() / 1000.0 +
    date.getSeconds() +
    date.getMinutes() * 60;
    gl.uniform1f(time_loc, t);
  }
  gl.bindBuffer(gl.UNIFORM_BUFFER, frameBuffer);
  frameData[4] = t;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
  gl.bindBufferBase(gl.UNIFORM_BUFFER, frameUniformBufferIndex, frameBuffer);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}