import React from 'react'
import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import { useCharacterAnimations } from '../../../src/components/AugmentedReality/contexts/CharacterAnimations'
export default function Air10Ton(props) {
  const { nodes, materials } = useGLTF('/models/oldModels/10ton_AC.gltf')
  const {setAnimations} = useCharacterAnimations();
            useEffect(() => {
              setAnimations([]);
            }, [setAnimations]);
          
  return (
    <group {...props} dispose={null} scale={0.1}>
      <group position={[0.108, 10.457, -0.166]}>
        <mesh geometry={nodes.Cube002_1.geometry} material={materials['Material.004']} />
        <mesh geometry={nodes.Cube002_2.geometry} material={materials['Material.007']} />
      </group>
      <mesh geometry={nodes.Cube008.geometry} material={nodes.Cube008.material} position={[0.23, 16.79, 1.566]} scale={[0.018, 1.072, 1]} />
      <mesh geometry={nodes.Cube009.geometry} material={materials['Material.001']} position={[0.248, 16.769, 1.556]} scale={[1.483, 1, 1]} />
      <mesh geometry={nodes.Cube010.geometry} material={nodes.Cube010.material} position={[-3.326, 4.826, 1.689]} />
      <mesh geometry={nodes.Cube011.geometry} material={nodes.Cube011.material} position={[-1.869, 4.826, 1.689]} />
      <mesh geometry={nodes.Cube012.geometry} material={materials['Material.001']} position={[-2.667, 4.744, 1.556]} scale={[1.483, 1, 1]} />
      <mesh geometry={nodes.Cube013.geometry} material={nodes.Cube013.material} position={[2.48, 4.826, 1.689]} />
      <mesh geometry={nodes.Cube014.geometry} material={nodes.Cube014.material} position={[3.937, 4.826, 1.689]} />
      <mesh geometry={nodes.Cube015.geometry} material={materials['Material.001']} position={[3.139, 4.744, 1.556]} scale={[1.483, 1, 1]} />
    </group>
  )
}
useGLTF.preload('/models/oldModels/10ton_AC.gltf')
