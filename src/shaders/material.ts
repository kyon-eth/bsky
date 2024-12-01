import * as THREE from 'three';
import { vertexShader } from './vertex.glsl';
import { fragmentShader } from './fragment.glsl';
import { createUniforms } from './uniforms';

export function createBlobMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: createUniforms(),
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    transparent: true
  });
}