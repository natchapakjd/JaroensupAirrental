import { Canvas } from "@react-three/fiber";
import { ARButton } from "@react-three/xr";
import { XR } from "@react-three/xr";
import XrOverlay from "./XrOverlay";
import { CharacterAnimationsProvider } from "../contexts/CharacterAnimations";
import Interface from "./Interface";
import "./Interface.css";
import { useCallback, useState } from "react";
const XrOverlayContainer = () => {

  const [overlayContent,setOverlayContent] = useState(null);

  let interfaceRef =useCallback((node)=>{
    if(node!==null){
      setOverlayContent(node)
    }
  });
  return (
    <>
      <CharacterAnimationsProvider>
        <ARButton
          className="ar-button"
          sessionInit={{
            requiredFeatures: ["hit-test"],
            optionalFeatures: ["dom-overlay"],
            domOverlay: { root: overlayContent },
          }}
        />
        <div className="h-screen bg-black">
          <Canvas>
            <XR>
              <XrOverlay />
            </XR>
          </Canvas>
          <Interface ref={interfaceRef}/>
        </div>
      </CharacterAnimationsProvider>
    </>
  );
};

export default XrOverlayContainer;
