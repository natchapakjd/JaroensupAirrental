import { Canvas } from "@react-three/fiber"
import { ARButton } from "@react-three/xr"
import XrCube from "./XrCube"
import { XR } from "@react-three/xr"
const XrCubeContainer = () => {
   
  return (
   <>
    <ARButton />
    <Canvas>
        <XR>
            <XrCube />
        </XR>
    </Canvas>
   </>
  )
}

export default XrCubeContainer