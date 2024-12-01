import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SentimentBlob } from './SentimentBlob';
import { useTweetStore } from '../store/tweetStore';
import { useLoadingStore } from '../store/loadingStore';
import { 
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
  DepthOfField
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export function Scene() {
  const currentSentiment = useTweetStore((state) => state.currentSentiment);
  const isModelLoading = useLoadingStore((state) => state.isModelLoading);

  console.log('Scene: Rendering with sentiment:', currentSentiment);

  if (isModelLoading) {
    console.log('Scene: Model is still loading');
    return null;
  }

  return (
    <Canvas className="w-full h-full">
      <color attach="background" args={['#0a0a0f']} />
      
      <ambientLight intensity={0.1} />
      <pointLight 
        position={[4, 3, 5]} 
        intensity={0.4} 
        color="#ffffff"
      />
      <pointLight 
        position={[-3, -2, 3]} 
        intensity={0.2} 
        color="#4080ff"
      />
      <pointLight 
        position={[-2, 3, -4]} 
        intensity={0.3} 
        color="#ff8040"
      />
      
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
        enableRotate={false}
      />
      
      {currentSentiment && (
        console.log('Scene: Rendering blob with sentiment:', currentSentiment),
        <SentimentBlob sentiment={currentSentiment} />
      )}
      
      <EffectComposer>
        <DepthOfField 
          focusDistance={0.01}
          focalLength={0.2}
          bokehScale={3}
        />
        <Bloom 
          intensity={0.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.SCREEN}
          mipmapBlur
        />
        <Noise
          premultiply
          blendFunction={BlendFunction.OVERLAY}
          opacity={0.05}
        />
        <Vignette
          offset={0.5}
          darkness={0.4}
          opacity={0.2}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </Canvas>
  );
}