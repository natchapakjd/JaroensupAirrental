import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Interactive, useHitTest, useXR } from "@react-three/xr";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import useXRStore from "../stores/useXRStore"; 
import useModelsStore from "../stores/modelStore";
import Air5tonCC from "../../../../public/models/5ton_AC_CC";
import Air10tonCC from "../../../../public/models/10ton_AC_CC";
import Air20tonCC from "../../../../public/models/20ton_AC_CC";
import { useEffect } from "react";

const XrGallary = () => {
  const reticleRef = useRef();
  const { currentModelName, count, setCount } = useCharacterAnimations();
  const { isPresenting, setIsPresenting } = useXRStore();
  const { isPresenting: xrPresenting } = useXR();
  const { models, setModels, selectedModel, setSelectedModel } =
    useModelsStore();

  useThree(({ camera }) => {
    if (!isPresenting) {
      camera.position.z = 3;
    }
  });

  useEffect(() => {
    setIsPresenting(xrPresenting);
  }, [xrPresenting, setIsPresenting]);

  useHitTest((hitMatrix, hit) => {
    hitMatrix.decompose(
      reticleRef.current.position,
      reticleRef.current.quaternion,
      reticleRef.current.scale
    );
    reticleRef.current.rotation.set(-Math.PI / 2, 0, 0);
  });

  const placeModel = () => {
    let id = Date.now();
    let modelName = currentModelName;
    let position = reticleRef.current.position.clone(); 
    setModels([...models, { position, id, modelName, rotation: 0 }]);
  };

  return (
    <>
      <OrbitControls />
      <ambientLight />
      {xrPresenting &&
        models.map(({ position, id, modelName, rotation }) => (
          <Interactive key={id} onSelect={() => setSelectedModel(id)}>
            {modelName === "air5tonCC" && (
              <Air5tonCC position={position} rotation={[0, rotation, 0]} />
            )}
            {modelName === "air10tonCC" && (
              <Air10tonCC position={position} rotation={[0, rotation, 0]} />
            )}
            {modelName === "air20tonCC" && (
              <Air20tonCC position={position} rotation={[0, rotation, 0]} />
            )}
          </Interactive>
        ))}

      {xrPresenting && (
        <Interactive onSelect={placeModel}>
          <mesh ref={reticleRef} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[0.1, 0.2, 32]} />
            <meshStandardMaterial color={"mediumpurple"} />
          </mesh>
        </Interactive>
      )}

      {!xrPresenting && currentModelName === "air5tonCC" && (
        <Air5tonCC scale={0.1} />
      )}
      {!xrPresenting && currentModelName === "air10tonCC" && (
        <Air10tonCC scale={0.1} />
      )}
      {!xrPresenting && currentModelName === "air20tonCC" && (
        <Air20tonCC scale={0.1} />
      )}
    </>
  );
};

export default XrGallary;
