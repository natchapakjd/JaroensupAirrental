import { useControls } from "leva";
import { createContext, useContext, useState } from "react";

const CharacterAnimationContext = createContext({});

export const CharacterAnimationsProvider = (props) => {
    const {Color,Model} = useControls({
        Color:"#ffffff",
        Model:{
            options:{
                "Druid": "druid",
                "Young Korrigan": "young-korrigan",
                "Korrigan Hat": "korrigan-hat",
                "Bear" :"bear"
            },
            onChange:(value)=>{
                setCurrentModelName(value);
                setAnimationIndex(0);
                setCount(0);
            }
        }
    })
  const [count,setCount] = useState(0);
  const [animations, setAnimations] = useState([]);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [currentModelName, setCurrentModelName] = useState(Model)
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
