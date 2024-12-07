import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense, useMemo } from "react";

const Model = ({ position }) => {
  const gltf = useMemo(() => useLoader(GLTFLoader, 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bear/model.gltf'), []);

  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene.clone()} position={position} />
    </Suspense>
  );
};

export default Model;
