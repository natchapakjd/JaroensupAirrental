import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Interactive, useHitTest, useXR } from "@react-three/xr";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import { Fragment } from "react";
import Air5Ton from "../../../../public/models/oldModels/5ton_AC";
import Air10Ton from "../../../../public/models/oldModels/10ton_AC";
import Air20Ton from "../../../../public/models/oldModels/20ton_AC";
import useModelsStore from "../stores/modelStore";
import Air5tonCC from "../../../../public/models/5ton_AC_CC";
import Air10tonCC from "../../../../public/models/10ton_AC_CC";
import Air20tonCC from "../../../../public/models/20ton_AC_CC";

const XrGallary = () => {
  const reticleRef = useRef();
  const { currentModelName, count, setCount } = useCharacterAnimations();
  const { isPresenting } = useXR();
  const { models, setModels, selectedModel, setSelectedModel } =
    useModelsStore();

  useThree(({ camera }) => {
    if (!isPresenting) {
      camera.position.z = 3;
    }
  });

  useHitTest((hitMatrix, hit) => {
    hitMatrix.decompose(
      reticleRef.current.position,
      reticleRef.current.quaternion,
      reticleRef.current.scale
    );

    reticleRef.current.rotation.set(-Math.PI / 2, 0, 0);
  });

  // const placeModel = (e) => {
  //   // สร้างตำแหน่งของโมเดลจาก hit point
  //   let position = e.intersection.object.position.clone();
  //   let id = Date.now();
  //   let modelName = currentModelName; // เก็บชื่อโมเดลที่ต้องการวาง

  //   // เพิ่มโมเดลใหม่เข้าไปใน state models
  //   setModels([...models, { position, id, modelName, rotation: 0 }]);
  // };
  const placeModel = () => {
    let id = Date.now();
    let modelName = currentModelName;
    let position = reticleRef.current.position.clone(); // ใช้ตำแหน่งจาก reticleRef

    setModels([...models, { position, id, modelName, rotation: 0 }]);
  };

  return (
    <>
      <OrbitControls />
      <ambientLight />
      {isPresenting &&
        models.map(({ position, id, modelName, rotation }) => (
          <Interactive key={id} onSelect={() => setSelectedModel(id)}>
            {modelName === "air5ton" && (
              <Air5Ton position={position} rotation={[0, rotation, 0]} />
            )}
            {modelName === "air10ton" && (
              <Air10Ton position={position} rotation={[0, rotation, 0]} />
            )}
            {modelName === "air20ton" && (
              <Air20Ton position={position} rotation={[0, rotation, 0]} />
            )}
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

      {isPresenting && (
        <Interactive onSelect={placeModel}>
          <mesh ref={reticleRef} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[0.1, 0.2, 32]} />
            <meshStandardMaterial color={"mediumpurple"} />
          </mesh>
        </Interactive>
      )}

      {!isPresenting && currentModelName === "air5ton" && <Air5Ton />}
      {!isPresenting && currentModelName === "air10ton" && <Air10Ton />}
      {!isPresenting && currentModelName === "air20ton" && <Air20Ton />}
      {!isPresenting && currentModelName === "air5tonCC" && <Air5tonCC />}
      {!isPresenting && currentModelName === "air10tonCC" && <Air10tonCC />}
      {!isPresenting && currentModelName === "air20tonCC" && <Air20tonCC />}
    
    </>
  );
};

export default XrGallary;
