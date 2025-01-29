import React, { forwardRef } from "react";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import "./Interface.css";
import useModelsStore from "../stores/modelStore";

const Interface = forwardRef(({ props }, ref) => {
  const { animations, animationIndex, setAnimationIndex } = useCharacterAnimations();
  const { rotateSelectedModel, selectedModel, setModels, removeModelById } = useModelsStore();

  const clearModels = () => {
    setModels([]); // ล้างโมเดลทั้งหมด
  };


  return (
    <div id="overlay-content" ref={ref}>
      <div className="dom-container">
        <div className="button-container">
          {animations.map((animation, index) => (
            <button
              key={animation}
              className={`button ${index === animationIndex ? "active" : ""}`}
              onClick={() => setAnimationIndex(index)}
            >
              {animation.split("_").map((partOfName) => partOfName[0].toUpperCase() + partOfName.substring(1)).join(" ")}
            </button>
          ))}

          <button className="button" onClick={() => rotateSelectedModel(-Math.PI / 8)} disabled={!selectedModel}>
            Rotate Left
          </button>
          <button className="button" onClick={() => rotateSelectedModel(Math.PI / 8)} disabled={!selectedModel}>
            Rotate Right
          </button>
          <button className="button" onClick={() => removeModelById(selectedModel)} disabled={!selectedModel}>
            Remove Selected
          </button>
          <button className="button" onClick={clearModels}>
            Clear All Models
          </button>
          
        </div>
      </div>
    </div>
  );
});

export default Interface;
