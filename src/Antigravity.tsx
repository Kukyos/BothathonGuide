import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleSystem = ({
  count, magnetRadius, ringRadius, waveSpeed, waveAmplitude, 
  particleSize, lerpSpeed, color, rotationSpeed, pulseSpeed, 
  particleShape, fieldStrength
}: any) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  // Basic setup
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const radius = ringRadius + (Math.random() - 0.5) * magnetRadius;
        const y = (Math.random() - 0.5) * fieldStrength;
        temp.push({ 
            angle: theta, 
            r: radius, 
            y: y, 
            speed: waveSpeed + Math.random() * 0.2,
            phase: Math.random() * Math.PI * 2
        });
    }
    return temp;
  }, [count, ringRadius, magnetRadius, fieldStrength, waveSpeed]);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime();
    
    particles.forEach((p, i) => {
      p.angle += rotationSpeed;
      const x = Math.cos(p.angle) * p.r;
      const z = Math.sin(p.angle) * p.r;
      const yOffset = Math.sin(time * p.speed + p.phase) * waveAmplitude;
      const currentY = THREE.MathUtils.lerp(p.y, p.y + yOffset, lerpSpeed);
      
      const pulseSize = particleSize + Math.sin(time * pulseSpeed + p.phase) * (particleSize * 0.5);

      dummy.position.set(x, currentY, z);
      dummy.scale.set(pulseSize, pulseSize, pulseSize);
      dummy.rotation.set(time * 0.2, time * 0.3, time * 0.1);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    mesh.current.rotation.y = time * rotationSpeed * 0.5;
  });

  const getGeometry = () => {
    switch(particleShape) {
      case 'box': return <boxGeometry args={[0.05, 0.05, 0.05]} />;
      case 'sphere': return <sphereGeometry args={[0.05, 16, 16]} />;
      default: return <capsuleGeometry args={[0.02, 0.08, 4, 8]} />;
    }
  };

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      {getGeometry()}
      <meshBasicMaterial color={new THREE.Color(color)} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
};

export default function Antigravity(props: any) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
      <Canvas camera={{ position: [0, 5, 15], fov: 45 }}>
        <ParticleSystem {...props} />
      </Canvas>
    </div>
  );
}
