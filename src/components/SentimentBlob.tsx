import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sentiment } from '../types/tweet';
import * as THREE from 'three';
import { createBlobMaterial } from '../shaders/material';
import { sentimentConfig } from '../config/sentimentConfig';
import { useRotation } from '../hooks/useRotation';

export function SentimentBlob({ sentiment }: { sentiment: Sentiment }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useMemo(() => createBlobMaterial(), []);
  
  useRotation(meshRef, sentiment);

  useFrame((_, delta) => {
    if (!material.uniforms) return;
    
    material.uniforms.time.value += delta * 0.3;
    
    const config = sentimentConfig[sentiment];
    
    material.uniforms.color.value.lerp(config.color, 0.05);
    material.uniforms.colorB.value.lerp(config.colorB, 0.05);
    material.uniforms.noiseIntensity.value += (config.noiseIntensity - material.uniforms.noiseIntensity.value) * 0.05;
    material.uniforms.waves.value += (config.waves - material.uniforms.waves.value) * 0.05;
    material.uniforms.complex.value += (config.complex - material.uniforms.complex.value) * 0.05;
    material.uniforms.displace.value += (config.displace - material.uniforms.displace.value) * 0.05;
    material.uniforms.decay.value += (config.decay - material.uniforms.decay.value) * 0.05;
  });

  return (
    <mesh ref={meshRef} material={material}>
      <icosahedronGeometry args={[1, 20]} />
    </mesh>
  );
}