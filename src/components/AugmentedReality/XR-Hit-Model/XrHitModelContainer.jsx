import { Canvas } from "@react-three/fiber"
import { ARButton } from "@react-three/xr"
import { XR } from "@react-three/xr"
import XrHitModel from "./XrHitModel"
const XrHitModelContainer = () => {
   
  return (
   <>
    <ARButton sessionInit={{
      requiredFeatures:["hit-test"],
    }}/>
    <div className="h-screen bg-black">
    <Canvas>
        <XR>
            <XrHitModel />
        </XR>
    </Canvas>
    </div>
   
   </>
  )
}

export default XrHitModelContainer