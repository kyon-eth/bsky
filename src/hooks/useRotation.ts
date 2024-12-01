import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sentiment } from '../types/tweet';

const ROTATION_SPEEDS = {
  positive: 0.2,
  neutral: 0.1,
  negative: 0.3
};

export function useRotation(meshRef: React.RefObject<THREE.Mesh>, sentiment: Sentiment) {
  const rotationRef = useRef(0);
  
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    
    // Smoothly interpolate rotation speed based on sentiment
    const targetSpeed = ROTATION_SPEEDS[sentiment];
    const currentSpeed = rotationRef.current;
    const newSpeed = currentSpeed + (targetSpeed - currentSpeed) * 0.1;
    
    rotationRef.current = newSpeed;
    meshRef.current.rotation.y += delta * newSpeed;
  });
}