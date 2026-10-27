uniform mat4 projectionMatrix; 
uniform mat4 modelMatrix; 
uniform mat4 viewMatrix; 
uniform float uTime;

attribute vec3 position;
attribute vec2 uv;
varying vec2 vUv;
varying float vElevation;

void main(){
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float elevation = sin(modelPosition.x * 5.0 - uTime ) * .1;
    elevation += sin(modelPosition.y * 1.5 - uTime ) * 0.1;
    modelPosition += elevation;
    //modelPosition.y += sin(modelPosition.y * 5.0 + uTime) * 0.1;
    //modelPosition.y += uTime;
    vElevation = elevation;
    vec4 viewPosition = viewMatrix * modelPosition; 
    vec4 projectionPosition = projectionMatrix * viewPosition; 

    gl_Position = projectionPosition ;
}