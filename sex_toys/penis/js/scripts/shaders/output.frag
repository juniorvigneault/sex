#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uDiffuse;
varying vec2 vUv;

void main(){
  vec4 diffuse = texture2D(uDiffuse, vUv);

  // Gooey contrast
  diffuse.a = clamp(diffuse.a * 80.0 - 10.0, 0.0, 1.0);

  // Optional: Discard transparent fragments to avoid edge artifacts
  if (diffuse.a <= 0.0) discard;

  gl_FragColor = vec4(diffuse.rgb, diffuse.a);
}
