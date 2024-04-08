#version 300 es
precision highp float;

out vec4 fragColor;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec2 uPos;

uniform sampler2D uSampler;
uniform float uKernel[9];
uniform float uKernelWeight;

in vec2 vTextureCoord;

void main(){
	vec2 onePixel = vec2(1) / vec2(textureSize(uSampler, 0));

	vec4 colorSum =
		texture(uSampler, vTextureCoord + onePixel * vec2(-1, -1)) * uKernel[0] +
		texture(uSampler, vTextureCoord + onePixel * vec2( 0, -1)) * uKernel[1] +
		texture(uSampler, vTextureCoord + onePixel * vec2( 1, -1)) * uKernel[2] +
		texture(uSampler, vTextureCoord + onePixel * vec2(-1,  0)) * uKernel[3] +
		texture(uSampler, vTextureCoord + onePixel * vec2( 0,  0)) * uKernel[4] +
		texture(uSampler, vTextureCoord + onePixel * vec2( 1,  0)) * uKernel[5] +
		texture(uSampler, vTextureCoord + onePixel * vec2(-1,  1)) * uKernel[6] +
		texture(uSampler, vTextureCoord + onePixel * vec2( 0,  1)) * uKernel[7] +
		texture(uSampler, vTextureCoord + onePixel * vec2( 1,  1)) * uKernel[8] ;
	fragColor = vec4((colorSum / uKernelWeight).rgb, 1);
}
