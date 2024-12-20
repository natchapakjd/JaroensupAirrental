import React from 'react'
import { useGLTF } from '@react-three/drei'
import { useCharacterAnimations } from '../../src/components/AugmentedReality/contexts/CharacterAnimations';
import { useEffect } from 'react';
export default function Air(props) {
  const { nodes, materials } = useGLTF('/models/Air.gltf')


    const {setAnimations} = useCharacterAnimations();
    useEffect(() => {
      setAnimations([]);
    }, [setAnimations]);
  
  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>
        <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.Plane002_gird_wire__0.geometry} material={materials.gird_wire} />
          <mesh geometry={nodes.Plane002_gird_wire__0_1.geometry} material={materials.gird_wire} />
        </group>
        <mesh geometry={nodes.Plane_body_0.geometry} material={materials.body} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Cylinder_fan_0.geometry} material={materials.material} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Plane001_block_0.geometry} material={materials.block} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.NurbsPath_wire_0.geometry} material={materials.wire} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Plane005_stand__0.geometry} material={materials.stand} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/Air.gltf')
