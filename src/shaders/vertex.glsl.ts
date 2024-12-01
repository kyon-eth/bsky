import { noiseShader } from './noise.glsl';

export const vertexShader = `
${noiseShader}

varying vec2 vUv;
varying float noise;
varying float qnoise;
varying vec3 vPosition;
varying vec3 vNormal;

uniform float time;
uniform float displace;
uniform float decay;
uniform float complex;
uniform float waves;
uniform float eqcolor;

float turbulence(vec3 p) {
  float t = -0.005;
  for (float f = 1.0; f <= 1.0; f++) {
    float power = pow(1.3, f);
    t += abs(pnoise(vec3(power * p), vec3(10.0, 10.0, 10.0)) / power);
  }
  return t;
}

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normal;

  // Calculate base noise without rotation influence
  vec3 noisePosition = position + vec3(time * 0.1);
  noise = waves * turbulence(decay * noisePosition);
  qnoise = eqcolor * 0.1 * turbulence(decay * noisePosition);
  
  // Simplified displacement calculation
  float displacement = noise * displace;
  displacement += pnoise(complex * position + vec3(time * 0.2), vec3(100.0)) * displace * 0.5;
  
  vec3 newPosition = position + (normal * displacement);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;