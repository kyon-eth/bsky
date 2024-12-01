import * as THREE from 'three';
import { sentimentConfig } from '../config/sentimentConfig';

export interface BlobUniforms {
  time: { value: number };
  color: { value: THREE.Color };
  colorB: { value: THREE.Color };
  noiseIntensity: { value: number };
  displace: { value: number };
  decay: { value: number };
  complex: { value: number };
  waves: { value: number };
  eqcolor: { value: number };
}

export function createUniforms(): BlobUniforms {
  // Initialize with neutral sentiment values
  const initialConfig = sentimentConfig.neutral;
  
  return {
    time: { value: 0 },
    color: { value: initialConfig.color.clone() },
    colorB: { value: initialConfig.colorB.clone() },
    noiseIntensity: { value: initialConfig.noiseIntensity },
    displace: { value: initialConfig.displace },
    decay: { value: initialConfig.decay },
    complex: { value: initialConfig.complex },
    waves: { value: initialConfig.waves },
    eqcolor: { value: 10.0 }
  };
}