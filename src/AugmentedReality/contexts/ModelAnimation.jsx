import { useControls } from "leva";
import { createContext, useContext, useState } from "react";

const CharacterAnimationContext = createContext({});

export const CharacterAnimationsProvider = (props) => {
    const {Color,Model} = useControls({
        // Color:"#ffffff",
        // Model:{
        //     options:{
        //         "Air5TonCC":"air5tonCC",
        //         "Air10TonCC":"air10tonCC",
        //         "Air20TonCC":"air20tonCC",


        //     },
        //     onChange:(value)=>{
        //         setCurrentModelName(value);
        //         setAnimationIndex(0);
        //         setCount(0);
        //     }
        // }
    })
  const [count,setCount] = useState(0);
  const [animations, setAnimations] = useState([]);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [currentModelName, setCurrentModelName] = useState("air5tonCC")
  return (
    <CharacterAnimationContext.Provider
      value={{
        animations,
        setAnimations,
        animationIndex,
        setAnimationIndex,
        currentModelName,
        setCurrentModelName,
        Color,
        count,
        setCount,
      }}
    >
      {props.children}
    </CharacterAnimationContext.Provider>
  );
  
};

export const useCharacterAnimations = () => {
  return useContext(CharacterAnimationContext);
};
