import { Canvas } from "@react-three/fiber"
import { ARButton } from "@react-three/xr"
import { XR } from "@react-three/xr"
import XrHitCube from "./XrHitCube"
const XrHitCubeContainer = () => {
   
  return (
   <>
    <ARButton sessionInit={{
      requiredFeatures:["hit-test"],
    }}/>
    <Canvas>
        <XR>
            <XrHitCube />
        </XR>
    </Canvas>
   </>
  )
}

export default XrHitCubeContainer