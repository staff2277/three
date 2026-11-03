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
    /* float strength = mod(-vUv.y * 10.0, 1.0)  ;
    strength = step(0.5, strength );
    gl_FragColor = vec4(strength,strength,strength ,1.); */  

    
    //pattern 9
    /* float strength = mod(-vUv.y * 10.0, 1.0)  ;
    strength = step(0.8, strength );
    gl_FragColor = vec4(strength,strength,strength ,1.); */  

    //pattern 10
    /* float strength = mod(-vUv.x * 10.0, 1.0)  ;
    strength = step(0.8, strength );
    gl_FragColor = vec4(strength,strength,strength ,1.);  */

    //pattern 11
    /* float count = 1.0;
    float strength = step(0.8, mod(vUv.x * count, 1.0) );
    strength += step(0.8, mod(vUv.y * count, 1.0) );
    gl_FragColor = vec4(strength,strength,strength,1.);  */

    //pattern 12
    /* float count = 10.0;
    float strength = step(0.8, mod(vUv.x * count, 1.0) );
    strength *= step(0.8, mod(vUv.y * count, 1.0) );
    gl_FragColor = vec4(strength,strength,strength,1.); */

    //pattern 14
    /* float count = 10.0;
    float strength = step(0.5, mod(vUv.x * count, 1.0) );
    strength *= step(0.8, mod(vUv.y * count, 1.0) );
    gl_FragColor = vec4(strength,strength,strength,1.); */

    //pattern 15
    /* float count = 1.0;
 
    float strengthX = step(0.5, mod(vUv.x * count, 1.0) );
    strengthX *= step(0.8, mod(vUv.y * count, 1.0) );

    float strengthY = step(0.8, mod(vUv.x * count, 1.0) );
    strengthY *= step(0.5, mod(vUv.y * count, 1.0) );
    
    float strength = strengthX + strengthY;
    gl_FragColor = vec4(strength,strength,strength,1.);  */

    //pattern 16
    /* float count = 10.0   ;
 
    float strengthX = step(0.3, mod(vUv.x * count, 1.0) );
    strengthX *= step(0.8, mod(vUv.y * count + .25, 1.0) );

    float strengthY = step(0.8, mod(vUv.x * count + .25, 1.0) );
    strengthY *= step(0.3, mod(vUv.y * count , 1.0) );

    float strength = strengthX + strengthY ;
    gl_FragColor = vec4(strength,strength,strength,1.);  */
    

    //pattern 17
    /* float strengthX = smoothstep(0.4,1.5, mod(-vUv.x, 1.0));
    float strengthXX = smoothstep(0.4,1.5, mod(vUv.x, 1.0));;
    float strength = strengthX + strengthXX;

    gl_FragColor = vec4(strength,strength,strength,1.);   */

    //pattern 17
    /* float strength = abs(vUv.x -0.5);
    gl_FragColor = vec4(strength,strength,strength,1.); */ 

    /* //pattern 18
    float strength = min(abs(vUv.y -0.5), abs(vUv.x -0.5));
    gl_FragColor = vec4(strength,strength,strength,1.);  */

    /* //pattern 19
    float strength = max(abs(vUv.y -0.5), abs(vUv.x -0.5));
    gl_FragColor = vec4(strength,strength,strength,1.);  */

    //pattern 20
    /* float strengthX = step(0.2, abs(vUv.x -.5)) + step(0.2, abs(vUv.x -.5));
    float strengthY = step(0.2, abs(vUv.y -.5)) + step(0.2, abs(vUv.y -.5));
    float strength = strengthX + strengthY;
    gl_FragColor = vec4(strength,strength,strength,1.);  */

     //pattern 20
    float strength = step(0.2,max(abs(vUv.y -0.5), abs(vUv.x -0.5)));
    gl_FragColor = vec4(strength,strength,strength,1.);  

    //pattern 21
   /*  float strengthX = step(0.2, abs(vUv.x -.5)) + step(0.2, abs(vUv.x -.5));
    float strengthY = step(0.2, abs(vUv.y -.5)) + step(0.2, abs(vUv.y -.5));
    float strength = strengthX + strengthY;
    gl_FragColor = vec4(strength,strength,strength,1.); */ 
    
}