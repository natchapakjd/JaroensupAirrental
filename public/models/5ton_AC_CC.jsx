import React from "react";
import { useGLTF } from "@react-three/drei";
import { useCharacterAnimations } from "../../src/components/AugmentedReality/contexts/CharacterAnimations";
import useModelsStore from "../../src/components/AugmentedReality/stores/modelStore";
import { useEffect } from "react";
export default function Air5tonCC(props) {
  const { nodes, materials } = useGLTF("models/5ton_AC_CC.gltf");
  const { setAnimations } = useCharacterAnimations();
  const { isAnimating, showGeometry } = useModelsStore(); // ดึง state จาก Zustand

  useEffect(() => {
    setAnimations([]); // ตั้งค่า Animation เมื่อโหลดโมเดล
  }, [setAnimations]);

  return (
    <group {...props} dispose={null} scale={props.scale ? props.scale: 1}>
      {/* 🔥 ควบคุมการแสดงผล Geometry */}
      {showGeometry && (
        <mesh material={materials.Material} material-transparent={true} material-opacity={0.5} />
      )}

      <group position={[0, 9.466, 0]}>
        <mesh geometry={nodes.Cube001_1.geometry} material={materials["Material.002"]} />
        <mesh geometry={nodes.Cube001_2.geometry} material={materials["Material.003"]} />
      </group>

      <mesh geometry={nodes.Cube004.geometry} material={nodes.Cube004.material} position={[0, 9.466, -0.048]} scale={1.001} />
      <mesh geometry={nodes.Cube007.geometry} material={materials["Material.001"]} position={[-0.005, 18.192, 1.556]} />
      <mesh geometry={nodes["steel-grill"].geometry} material={materials["steel-grill"]} position={[0, 3.14, 1.762]} rotation={[Math.PI / 2, 0, 0]} scale={[4.994, 8.019, 3.018]} />
      <mesh geometry={nodes.Cube006.geometry} material={nodes.Cube006.material} position={[0, 17.128, 1.617]} scale={[1.017, 1.034, 1]} />

      {/* 🔥 แสดง Animation เมื่อ `isAnimating = true` */}
      {isAnimating && (
        <mesh geometry={nodes.Cube.geometry} material={materials.Material}/>
      )}
    </group>
  );
}

useGLTF.preload("models/5ton_AC_CC.gltf");
