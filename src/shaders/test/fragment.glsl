 varying vec2 vUv;
void main(){
    //pattern3
    /* float strength = vUv.x;
    gl_FragColor = vec4(strength,strength,strength ,1.); */

    //pattern 4
    /* float strength = vUv.y;
    gl_FragColor = vec4(strength,strength,strength ,1.); */

    //pattern 5
    /* float strength = 1.0 - vUv.y;
    gl_FragColor = vec4(strength,strength,strength ,1.);  */

    //pattern 6
    /* float strength = vUv.y * 5.0 ;
    gl_FragColor = vec4(strength,strength,strength ,1.);   */


    //pattern 7
    /* float strength = mod(vUv.y * 2.0,1.0)  ;
    gl_FragColor = vec4(strength,strength,strength ,1.);   */

    //pattern 8
    float strength = mod(-vUv.y * 2.0, 1.0)  ;
    strength *= step(0.5, strength );
    gl_FragColor = vec4(strength,strength,strength ,1.);  
    
}