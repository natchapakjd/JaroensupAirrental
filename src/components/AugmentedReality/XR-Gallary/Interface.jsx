import React, { forwardRef } from "react";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import "./Interface.css";
import useModelsStore from "../stores/modelStore";

const Interface = forwardRef(({ props }, ref) => {
  const { animations, animationIndex, setAnimationIndex } = useCharacterAnimations();
  const { modelsStore, setModelsStore } = useModelsStore();
  console.log(useModelsStore.getState().models); // ตรวจสอบว่า models ถูกเคลียร์แล้ว

  const clearModels = () => {
    useModelsStore.getState().setModelsStore([]);
    console.log(useModelsStore.getState().models); // ตรวจสอบว่า models ถูกเคลียร์แล้ว
  };

  return (
    <div id="overlay-content" ref={ref}>
      <div className="dom-container">
        <div className="button-container">
          {/* <button className="button">Rotate Left</button> */}
          {animations.map((animation, index) => (
            <button
              key={animation}
              className={`button ${index === animationIndex ? "active" : ""}`}
              onClick={() => setAnimationIndex(index)}
            >
              {animation
                .split("_")
                .map((partOfName) => partOfName[0].toUpperCase() + partOfName.substring(1))
                .join(" ")}
            </button>
          ))}
          <button className="button" onClick={clearModels}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
});

export default Interface;
