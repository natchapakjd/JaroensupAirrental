import React, { useEffect, useRef, useMemo } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";

export default function Model(props) {
  const group = useRef();
  
  const { nodes, materials, animations } = useMemo(
    () => useGLTF(
      "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/druid/model.gltf"
    ),
    []
  );

  const { actions, names } = useAnimations(animations, group);
  const { setAnimations, animationIndex } = useCharacterAnimations();

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
          geometry={nodes.druid.geometry}
          material={materials.color_main}
          skeleton={nodes.druid.skeleton}
        />
      </group>
    </group>
  );
}

