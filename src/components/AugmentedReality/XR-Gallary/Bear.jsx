import React, { useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
export default function Bear(props) {
  const group = useRef();
  const { nodes, materials } = useMemo(
    () => useGLTF(
      "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bear/model.gltf"
    ),
    []
  );

  const {setAnimations} = useCharacterAnimations();

  useEffect(() => {
    setAnimations([]);
  }, [setAnimations]);

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        geometry={nodes.character_bear.geometry}
        material={nodes.character_bear.material}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <mesh
          geometry={nodes.character_bearArmLeft.geometry}
          material={nodes.character_bearArmLeft.material}
          position={[0.2, 0, -0.63]}
        />
        <mesh
          geometry={nodes.character_bearArmRight.geometry}
          material={nodes.character_bearArmRight.material}
          position={[-0.2, 0, -0.63]}
        />
        <group position={[0, 0, -0.7]}>
          <mesh
            geometry={nodes.Cube1337.geometry}
            material={materials["Black.025"]}
          />
          <mesh
            geometry={nodes.Cube1337_1.geometry}
            material={nodes.Cube1337_1.material}
          />
        </group>
      </mesh>
    </group>
  );
}

// Preloading the model to ensure it’s ready before rendering
useGLTF.preload(
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bear/model.gltf"
);
