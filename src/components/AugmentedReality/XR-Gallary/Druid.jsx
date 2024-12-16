import React, { useEffect, useRef, useMemo } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import { useThree, useFrame } from "@react-three/fiber"; // Import useThree and useFrame

export default function Druid(props) {
  const group = useRef();
  const meshRef = useRef(); // Ref for the skinnedMesh

  const { nodes, materials, animations } = useMemo(
    () => useGLTF("/models/druid.gltf"),
    []
  );

  const { actions, names } = useAnimations(animations, group);
  const { setAnimations, animationIndex, Color } = useCharacterAnimations();

  // Set animations once when component mounts
  useEffect(() => {
    setAnimations(names);
  }, [setAnimations, names]);

  // Update the animation based on animationIndex
  useEffect(() => {
    if (actions && names[animationIndex]) {
      actions[names[animationIndex]].reset().fadeIn(0.5).play();

      return () => {
        actions[names[animationIndex]]?.fadeOut(0.5);
      };
    }
  }, [animationIndex, actions, names]);
 

  return (
    <group ref={group} {...props} dispose={null}>
      <group scale={1.91}>
        <primitive object={nodes.root} />
        <skinnedMesh 
          ref={meshRef} // Attach ref to the mesh
          geometry={nodes.druid.geometry}
          material={materials.color_main}
          skeleton={nodes.druid.skeleton}
          material-color={Color}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/druid.gltf");
