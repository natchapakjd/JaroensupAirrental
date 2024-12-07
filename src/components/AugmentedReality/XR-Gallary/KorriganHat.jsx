
import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import { useEffect } from "react";
export default function KorriganHat(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/korrigan-hat.gltf");
  const { actions ,names} = useAnimations(animations, group);

  const { setAnimations, animationIndex, Color} = useCharacterAnimations();

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
      <group rotation={[0, 0.01, 0]}>
        <primitive object={nodes.root} />
        <skinnedMesh
          geometry={nodes.Chapeau.geometry}
          material={materials["color_main.014"]}
          skeleton={nodes.Chapeau.skeleton}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/korrigan-hat.gltf");
