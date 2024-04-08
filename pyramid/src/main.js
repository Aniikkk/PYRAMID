import Shader from "./Shader";
import Texture from "./Texture";
import { Pyramid } from "./Model";
import { keys, mouseX, mouseY } from "./Input";
import { mat4 } from "gl-matrix"; // Import mat4 from gl-matrix library

import vertexShaderSource from "./shaders/ortho.glsl";
import fragmentShaderSource from "./shaders/frag.glsl";

const canvas = document.querySelector("#glcanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const resolution = [canvas.width, canvas.height];

const gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl2"));

if (gl === null) {
  alert("Unable to initialize WebGL.");
} else {
  // SHADER
  const vert = Shader.compileShader(vertexShaderSource, gl.VERTEX_SHADER, gl);
  const frag0 = Shader.compileShader(
    fragmentShaderSource,
    gl.FRAGMENT_SHADER,
    gl
  );

  const globalShader = new Shader(gl);
  globalShader.createShaders(vert, frag0);

  // DATA
  const data = new Pyramid(gl);
  data.setup();

  gl.useProgram(globalShader.program);

  // UNIFORMS
  const uSamplerLocation = gl.getUniformLocation(
    globalShader.program,
    "uSampler"
  );
  gl.uniform1i(uSamplerLocation, 0);

  const startTime = performance.now();
  let currentTime, elapsedTime;
  const uTimeLocation = gl.getUniformLocation(globalShader.program, "uTime");
  const uResolutionLocation = gl.getUniformLocation(
    globalShader.program,
    "uResolution"
  );
  const uMouseLocation = gl.getUniformLocation(globalShader.program, "uMouse");
  let posX = 0;
  let posY = 0;

  const uPosLocation = gl.getUniformLocation(globalShader.program, "uPos");

  const kernels = {
    normal: [0, 0, 0, 0, 1, 0, 0, 0, 0],
    // Add more kernels if needed
  };

  function computeKernelWeight(kernel) {
    var weight = kernel.reduce(function (prev, curr) {
      return prev + curr;
    });
    return weight <= 0 ? 1 : weight;
  }

  const uKernelLocation = gl.getUniformLocation(
    globalShader.program,
    "uKernel"
  );
  const uKernelWeightLocation = gl.getUniformLocation(
    globalShader.program,
    "uKernelWeight"
  );

  const cc = kernels.normal; // Select the desired kernel

  gl.uniform1fv(uKernelLocation, cc);
  gl.uniform1f(uKernelWeightLocation, computeKernelWeight(cc));

  const uPMLocation = gl.getUniformLocation(globalShader.program, "uPM");
  const uMVMLocation = gl.getUniformLocation(globalShader.program, "uMVM");

  const fieldOfView = (45 * Math.PI) / 180;
  const aspect = resolution[0] / resolution[1];
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  function updatePos(movementSpeed) {
    if (keys[72]) posX -= movementSpeed;
    if (keys[76]) posX += movementSpeed;
    if (keys[75]) posY += movementSpeed;
    if (keys[74]) posY -= movementSpeed;
  }

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  const modelViewMatrix = mat4.create();

  gl.uniformMatrix4fv(uPMLocation, false, projectionMatrix);
  gl.uniformMatrix4fv(uMVMLocation, false, modelViewMatrix);

  gl.uniform2fv(uResolutionLocation, resolution);

  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  function renderLoop() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // UPDATE
    currentTime = performance.now();
    elapsedTime = (currentTime - startTime) / 1000;
    gl.uniform1f(uTimeLocation, elapsedTime);

    updatePos(0.01);
    gl.uniform2f(uPosLocation, posX, posY);

    gl.uniform2f(
      uMouseLocation,
      mouseX / resolution[0] - 0.5,
      0.5 - mouseY / resolution[1]
    );

    // Apply rotation around X and Y axes
    const rotationX = (currentTime / 1000) * Math.PI; // Rotate around X-axis
    const rotationY = (currentTime / 1000) * Math.PI; // Rotate around Y-axis

    mat4.identity(modelViewMatrix);
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -5.0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotationX, [1, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotationY, [0, 1, 0]);

    gl.uniformMatrix4fv(uMVMLocation, false, modelViewMatrix);

    data.render();

    requestAnimationFrame(renderLoop);
  }

  renderLoop();
}
