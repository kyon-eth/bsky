export const fragmentShader = `
varying vec2 vUv;
varying float qnoise;
varying float noise;
varying vec3 vPosition;
varying vec3 vNormal;

uniform vec3 color;
uniform vec3 colorB;
uniform float time;
uniform float noiseIntensity;

// Gradient noise function
float rand(vec2 n) { 
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise2D(vec2 p) {
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u * u * (3.0 - 2.0 * u);
  
  float res = mix(
    mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
    mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
  return res * res;
}

// Fast subsurface scattering approximation
vec3 subsurfaceScattering(vec3 baseColor, vec3 normal, vec3 lightDir, vec3 viewDir, float thickness) {
  float sss = pow(max(0.0, dot(normalize(-normal), normalize(lightDir))), 2.0) * thickness;
  float rim = pow(1.0 - max(0.0, dot(normal, viewDir)), 4.0);
  
  // Add some noise to the scattering
  float scatterNoise = noise2D(vUv * 5.0 + time * 0.1) * 0.5 + 0.5;
  sss *= scatterNoise;
  
  // Combine direct and scattered light
  return baseColor * (1.0 + sss * 2.0 + rim * 0.5);
}

void main() {
  // Base lighting setup
  vec3 lightPos = vec3(4.0, 3.0, 5.0);
  vec3 viewDir = normalize(-vPosition);
  vec3 lightDir = normalize(lightPos - vPosition);
  vec3 normal = normalize(vNormal);
  
  // Basic Phong lighting
  float diffuse = max(dot(normal, lightDir), 0.0);
  vec3 reflectDir = reflect(-lightDir, normal);
  float specular = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
  
  // Dynamic noise for gradient
  float gradientNoise = noise2D(vUv * 5.0 + time * 0.1) * noiseIntensity;
  
  // Create dynamic gradient based on position and noise
  float gradientFactor = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0) * 0.7 + noise * 0.2 + gradientNoise;
  vec3 baseColor = mix(color, colorB, gradientFactor);
  
  // Apply subsurface scattering
  float thickness = 0.5 + noise * 0.5;
  vec3 sssColor = subsurfaceScattering(baseColor, normal, lightDir, viewDir, thickness);
  
  // Combine all lighting components
  vec3 finalColor = sssColor * (0.2 + diffuse * 0.8);
  finalColor += vec3(specular) * 0.3;
  finalColor *= 0.8 + qnoise * 0.4;
  
  gl_FragColor = vec4(finalColor, 1.0);
}`;