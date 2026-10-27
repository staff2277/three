precision mediump float;
varying vec2 vUv;
varying float vElevation;

uniform sampler2D utexture;

void main() {
    vec4 texture = texture2D(utexture, vUv);
    texture.rgb *= vElevation * 2.0 + 0.8;
    gl_FragColor = texture;
}