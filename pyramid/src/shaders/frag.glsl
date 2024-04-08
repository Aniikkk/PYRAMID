#version 300 es
precision highp float;

out vec4 fragColor;

in vec3 vColor;

uniform float uTime;
uniform vec2 uResolution;

void main() {
    fragColor = vec4(vColor,1.0);

    // vec2 uv = (gl_FragCoord.xy) /uResolution.y;
    // vec2 uv = (gl_FragCoord.xy*2.0-uResolution.xy ) /uResolution.y;
    // fragColor = vec4(uv, 0.0, 1.0);
}
