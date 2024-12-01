import * as THREE from 'three';

export const sentimentConfig = {
  positive: {
    color: new THREE.Color(0.063, 0.725, 0.506),
    colorB: new THREE.Color(0.1, 0.9, 0.6),
    noiseIntensity: 0.3,
    waves: 2.0,
    complex: 0.3,
    displace: 0.2,
    decay: 0.5
  },
  neutral: {
    color: new THREE.Color(0.2, 0.7, 0.9),
    colorB: new THREE.Color(0.3, 0.8, 1.0),
    noiseIntensity: 0.2,
    waves: 0.8,
    complex: 0.15,
    displace: 0.1,
    decay: 0.3
  },
  negative: {
    color: new THREE.Color(0.937, 0.267, 0.267),
    colorB: new THREE.Color(1.0, 0.4, 0.2),
    noiseIntensity: 0.5,
    waves: 4.0,
    complex: 0.6,
    displace: 0.5,
    decay: 0.8
  }
};