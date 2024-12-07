import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Interactive, useHitTest, useXR } from "@react-three/xr";
import Druid from "./Druid";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import YoungKorrigan from "./YoungKorrigan";
import KorriganHat from "./KorriganHat";
import { Fragment } from "react";
import Bear from "./Bear";
const XrGallary = () => {
  const reticleRef = useRef();
  const [models, setModels] = useState([]);
  const { currentModelName ,count,setCount} = useCharacterAnimations();
  

  const { isPresenting } = useXR();
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

  const placeModel = (e) => {
    let position = e.intersection.object.position.clone();
    let id = Date.now();
    setModels([...models, { position, id }]);
    console.log(id)
  };

  return (
    <>
      <OrbitControls />
      <ambientLight />
      {isPresenting &&
        models.map(({ position, id }) => {
          return (
            <Fragment key ={id}>
              {currentModelName === "druid" && <Druid position={position}/>}
              {currentModelName === "young-korrigan" && <YoungKorrigan position={position}/>}
              {currentModelName === "korrigan-hat" && <KorriganHat position={position}/>}
              {currentModelName === "bear" && <Bear position={position}/>}

            </Fragment>
          );
        })}
      {isPresenting && (
        <Interactive onSelect={placeModel}>
          <mesh ref={reticleRef} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[0.1, 0.2, 32]} />
            <meshStandardMaterial color={"mediumpurple"} />
          </mesh>
        </Interactive>
      )}

      {!isPresenting && currentModelName ==='druid' && <Druid />}
      {!isPresenting && currentModelName ==='young-korrigan' && <YoungKorrigan />}
      {!isPresenting && currentModelName ==='korrigan-hat' && <KorriganHat />}
      {!isPresenting && currentModelName ==='bear' && <Bear />}

    </>
  );
};

export default XrGallary;
