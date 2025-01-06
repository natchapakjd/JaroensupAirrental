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
import Air from "../../../../public/models/Air";
import Monkey from "../../../../public/models/Monkey";
import useModelsStore from "../stores/modelStore";
import Panda from "../../../../public/models/Panda";
const XrGallary = () => {
  const reticleRef = useRef();
  const [models, setModels] = useState([]);
  const { currentModelName ,count,setCount} = useCharacterAnimations();
  const { isPresenting } = useXR();
  // const { modelsStore, setModelsStore } = useModelsStore();

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
    // setModelsStore([...useModelsStore.getState().models, { position, id }]);
  };

  //useModelsStore.getState().models?.map(({ position, id }) => {

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
              {currentModelName === "air" && <Air position={position}/>}
              {currentModelName === "monkey" && <Monkey position={position}/>}
              {currentModelName === "panda" && <Panda position={position}/>}


            </Fragment>
          );
        })}
      {isPresenting && (
        <Interactive onSelect={placeModel} >
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
      {!isPresenting && currentModelName ==='air' && <Air />}
      {!isPresenting && currentModelName ==='monkey' && <Monkey />}
      {!isPresenting && currentModelName ==='panda' && <Panda />}

    </>
  );
};

export default XrGallary;
