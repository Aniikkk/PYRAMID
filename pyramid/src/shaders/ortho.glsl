#version 300 es

layout (location=0) in vec3 position;
layout (location=1) in vec3 color;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec2 uPos;

uniform mat4 uPM;
uniform mat4 uMVM;

out vec3 vColor;

void main() {
	gl_Position = uPM * uMVM * vec4(position, 1.0);
	vColor = color;
}
