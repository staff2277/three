varying vec2 vUv;

void main(){
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z += sin(position * 5 );
    vec4 viewPosition = viewMatrix * modelPosition; 
    //viewPosition.y += 2.0;
    vec4 projectionPosition = projectionMatrix * viewPosition; 
    //projectionPosition.x += 2.0;

    gl_Position = projectionPosition ;
}