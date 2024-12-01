import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { Sentiment } from '../types/tweet';
import { sentimentConfig } from '../config/sentimentConfig';
import { BlobUniforms } from '../shaders/uniforms';

interface AnimationState {
  rotation: number;
}

export function useShaderAnimation(
  mesh: React.RefObject<THREE.Mesh>,
  material: THREE.ShaderMaterial,
  sentiment: Sentiment
) {
  const state = useRef<AnimationState>({ rotation: 0 });

  useFrame((_, delta) => {
    if (!mesh.current) return;

    // Update time uniform
    material.uniforms.time.value += delta * 0.3;

    // Get current config based on sentiment
    const config = sentimentConfig[sentiment];

    // Smoothly interpolate material uniforms
    material.uniforms.color.value.lerp(config.color, 0.05);
    material.uniforms.waves.value += (config.waves - material.uniforms.waves.value) * 0.05;
    material.uniforms.complex.value += (config.complex - material.uniforms.complex.value) * 0.05;
    material.uniforms.displace.value += (config.displace - material.uniforms.displace.value) * 0.05;
    material.uniforms.decay.value += (config.decay - material.uniforms.decay.value) * 0.05;

    // Apply smooth rotation
    state.current.rotation += delta * 0.5;
    mesh.current.rotation.y = state.current.rotation;
  });
}