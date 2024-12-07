import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Interactive, useHitTest, useXR } from "@react-three/xr";
import Cube from "./Cube";

const XrHitCube = () => {
  const reticleRef = useRef();
  const [cubes, setCubes] = useState([]);
  const { isPresenting } = useXR();


  useThree(({camera})=>{
    if(!isPresenting){
        camera.position.z = 3;
    }
  })
  useHitTest((hitMatrix, hit) => {
    hitMatrix.decompose(
      reticleRef.current.position,
      reticleRef.current.quaternion,
      reticleRef.current.scale
    );

    reticleRef.current.rotation.set(-Math.PI / 2, 0, 0);
  });
  const placeCube = (e) => {
    let position = e.intersection.object.position.clone();
    let id = Date.now();
    setCubes([...cubes, { position, id }]);
    console.log(cubes)
  };
  return (
    <>
      <OrbitControls />
      <ambientLight />
      {isPresenting &&
        cubes.map(({ position, id }) => {
          return <Cube key={id} position={position} />;
        })}
      {isPresenting && (
        <Interactive onSelect={placeCube}>
          <mesh ref={reticleRef} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[0.1, 0.2, 32]} />
            <meshStandardMaterial color={"mediumpurple"} />
          </mesh>
        </Interactive>
      )}

      {!isPresenting && <Cube/>}
    </>
  );
};

export default XrHitCube;
