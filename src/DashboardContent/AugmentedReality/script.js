// let acCount = 1; // ตัวแปรที่เก็บจำนวนแอร์ที่เพิ่มเข้ามาแล้ว

// function calculateBTU() {
//   const width = document.getElementById("width").value;
//   const length = document.getElementById("length").value;
//   const roomType = parseInt(document.getElementById("room-type").value, 10);

//   if (!width || !length) {
//     document.getElementById("btu-result").textContent =
//       "กรุณากรอกข้อมูลให้ครบถ้วน";
//     return;
//   }

//   const roomArea = parseInt(width, 10) * parseInt(length, 10);
//   const requiredBTU = roomArea * roomType;

//   let totalACBTU = 0;
//   const acTypes = document.querySelectorAll(".ac-type");
//   const acQuantities = document.querySelectorAll(".ac-quantity");

//   for (let i = 0; i < acTypes.length; i++) {
//     const acType = parseInt(acTypes[i].value, 10);
//     const acQuantity = parseInt(acQuantities[i].value, 10);
//     totalACBTU += acType * acQuantity;
//   }

//   document.getElementById(
//     "btu-result"
//   ).textContent = `BTU ที่ต้องการ: ${requiredBTU}`;
//   document.getElementById(
//     "ac-count-result"
//   ).textContent = `BTU รวมจากแอร์: ${totalACBTU}`;
//   calculateACCount(requiredBTU, totalACBTU);
// }

// function calculateACCount(requiredBTU, totalACBTU) {
//   const acCount = Math.ceil(totalACBTU / requiredBTU);
//   document.getElementById(
//     "ac-count-result"
//   ).textContent += `, จำนวนแอร์ที่ต้องใช้: ${acCount} เครื่อง`;
// }

// document.getElementById("add-ac").addEventListener("click", function () {
//   if (acCount >= 4) {
//     alert("คุณสามารถเพิ่มแอร์ได้สูงสุด 4 ชนิด");
//     return;
//   }

//   const acDiv = document.createElement("div");
//   acDiv.classList.add("ac-selection");

//   const acSelect = document.createElement("select");
//   acSelect.classList.add("ac-type");
//   acSelect.innerHTML = `
//         <option value="12000">1 ตัน (12,000 BTU)</option>
//         <option value="60000">5 ตัน (60,000 BTU)</option>
//         <option value="120000">10 ตัน (120,000 BTU)</option>
//         <option value="240000">20 ตัน (240,000 BTU)</option>
//     `;

//   const quantityDiv = document.createElement("div");
//   quantityDiv.classList.add("quantity-container");
//   const quantityInput = document.createElement("input");
//   quantityInput.type = "number";
//   quantityInput.classList.add("ac-quantity");
//   quantityInput.min = 1;
//   quantityInput.value = 1;
//   quantityInput.placeholder = "จำนวน";

//   quantityDiv.appendChild(quantityInput);

//   const deleteButton = document.createElement("button");
//   deleteButton.textContent = "ลบ";
//   deleteButton.classList.add("delete-ac");

//   deleteButton.addEventListener("click", function () {
//     acDiv.remove();
//     acCount--; 
//     calculateBTU(); 
//   });

//   acDiv.appendChild(acSelect);
//   acDiv.appendChild(quantityDiv);
//   acDiv.appendChild(deleteButton);

//   document.getElementById("ac-container").appendChild(acDiv);

//   acCount++; 
//   calculateBTU(); 
// });

// document.getElementById("createGrid").addEventListener("click", () => {
//   const width = parseInt(document.getElementById("width").value, 10);
//   const length = parseInt(document.getElementById("length").value, 10);

//   if (isNaN(width) || isNaN(length) || width < 1 || length < 1) {
//     alert("กรุณากรอกความกว้างและความยาวเป็นตัวเลขที่ถูกต้อง");
//     return;
//   }

//   const grid = document.getElementById("grid");
//   grid.innerHTML = ""; 

//   let cellSize = 40; 
//   if (width > 30 || length > 30) {
//     cellSize = 20; 
//   }

//   grid.style.gridTemplateColumns = `repeat(${width}, ${cellSize}px)`;
//   grid.style.gridTemplateRows = `repeat(${length}, ${cellSize}px)`;

//   for (let i = 0; i < width * length; i++) {
//     const cell = document.createElement("div");
//     cell.classList.add("cell");
//     cell.style.width = `${cellSize}px`;
//     cell.style.height = `${cellSize}px`;
//     cell.addEventListener("dragover", (e) => e.preventDefault());
//     cell.addEventListener("drop", handleDrop);
//     grid.appendChild(cell);
//   }

//   calculateBTU(); 
// });

// const acBox = document.getElementById("acBox");
// acBox.addEventListener("dragstart", (e) => {
//   e.dataTransfer.setData("boxId", "newBox");
// });

// const obsBox = document.getElementById("obsBox");
// obsBox.addEventListener("dragstart", (e) => {
//   e.dataTransfer.setData("boxId", "newObstacle");
// });

// const onetonBox = document.getElementById("onetonBox");
// onetonBox.addEventListener("dragstart", (e) => {
//   e.dataTransfer.setData("boxId", "newOnetonBox");
// });

// const fivetonBox = document.getElementById("fivetonBox");
// fivetonBox.addEventListener("dragstart", (e) => {
//   e.dataTransfer.setData("boxId", "newFivetonBox"); 
// });

// const tentonBox = document.getElementById("tentonBox");
// tentonBox.addEventListener("dragstart", (e) => {
//   e.dataTransfer.setData("boxId", "newTentonBox"); 
// });

// const twentytonBox = document.getElementById("twentytonBox");
// twentytonBox.addEventListener("dragstart", (e) => {
//   e.dataTransfer.setData("boxId", "newTwentytonBox");
// });

// function handleDrop(e) {
//   e.preventDefault();
//   const boxType = e.dataTransfer.getData("boxId");
//   let boxElement;

//   const cell = e.target;

//   if (cell.classList.contains("obstacle")) {
//     alert("Cannot place here. Obstacle is blocking this cell.");
//     return; 
//   }

//   if (
//     boxType === "newBox" ||
//     boxType === "newObstacle" ||
//     boxType === "newOnetonBox" ||
//     boxType === "newFivetonBox" ||
//     boxType === "newTentonBox" ||
//     boxType === "newTwentytonBox"
//   ) {
//     boxElement = document.createElement("div");

//     if (boxType === "newBox") {
//       boxElement.className = "box ac";
//       boxElement.textContent = "AC";
//       boxElement.setAttribute("data-rotation", "0"); 
//     } else if (boxType === "newObstacle") {
//       boxElement.className = "box obstacle";
//       boxElement.textContent = "OBS";
//     } else if (boxType === "newOnetonBox") {
//       boxElement.className = "box oneton";
//       boxElement.textContent = "1Ton";
//       boxElement.setAttribute("data-rotation", "0"); 
//     } else if (boxType === "newFivetonBox") {
//       boxElement.className = "box fiveton";
//       boxElement.textContent = "5Ton";
//       boxElement.setAttribute("data-rotation", "0"); 
//     } else if (boxType === "newTentonBox") {
//       boxElement.className = "box tenton";
//       boxElement.textContent = "10Ton";
//       boxElement.setAttribute("data-rotation", "0"); 
//     } else if (boxType === "newTwentytonBox") {
//       boxElement.className = "box twentyton";
//       boxElement.textContent = "20Ton";
//       boxElement.setAttribute("data-rotation", "0"); 
//     }

//     boxElement.id = `box-${Date.now()}`;
//     boxElement.setAttribute("draggable", "true");

//     const deleteButton = createDeleteButton(boxElement);

//     adjustBoxSize(boxElement, cell);
//     adjustDeleteButtonSize(deleteButton, boxElement);

//     boxElement.appendChild(deleteButton);
//     cell.appendChild(boxElement);

//     if (
//       boxType === "newBox" ||
//       boxType === "newOnetonBox" ||
//       boxType === "newFivetonBox" ||
//       boxType === "newTentonBox" ||
//       boxType === "newTwentytonBox"
//     ) {
//       spreadCoolingEffect(cell, boxElement); 
//       boxElement.addEventListener("click", () => rotateAC(boxElement)); 
//     }

//     boxElement.addEventListener("dragstart", (event) => {
//       event.dataTransfer.setData("boxId", boxElement.id);
//     });
//   } else {
//     boxElement = document.getElementById(boxType);

//     if (
//       boxElement.classList.contains("ac") ||
//       boxElement.classList.contains("oneton") ||
//       boxElement.classList.contains("fiveton") ||
//       boxElement.classList.contains("tenton") ||
//       boxElement.classList.contains("twentyton")
//     ) {
//       removeCoolingEffect(boxElement); 
//     }

//     adjustBoxSize(boxElement, cell);
//     cell.appendChild(boxElement);

//     if (
//       boxElement.classList.contains("ac") ||
//       boxElement.classList.contains("oneton") ||
//       boxElement.classList.contains("fiveton") ||
//       boxElement.classList.contains("tenton") ||
//       boxElement.classList.contains("twentyton")
//     ) {
//       spreadCoolingEffect(cell, boxElement);
//     }
//   }
// }

// function adjustBoxSize(boxElement, cell) {
//   const cellSize = cell.getBoundingClientRect();
//   boxElement.style.width = `${cellSize.width}px`;
//   boxElement.style.height = `${cellSize.height}px`;
//   boxElement.style.margin = "0";
//   boxElement.style.position = "relative";
// }

// function createDeleteButton(boxElement) {
//   const deleteButton = document.createElement("button");
//   deleteButton.textContent = "ลบ";
//   deleteButton.className = "delete-button";
//   deleteButton.style.position = "absolute";
//   deleteButton.style.top = "2px";
//   deleteButton.style.right = "2px";

//   deleteButton.addEventListener("click", () => {
//     if (boxElement.classList.contains("ac")) {
//       removeCoolingEffect(boxElement); 
//     }
//     boxElement.remove();
//   });

//   return deleteButton;
// }

// function adjustACSize(boxElement, cell) {
//   const cellSize = cell.getBoundingClientRect();
//   boxElement.style.width = `${cellSize.width}px`;
//   boxElement.style.height = `${cellSize.height}px`;
//   boxElement.style.margin = "0";
//   boxElement.style.position = "relative";
// }

// function adjustDeleteButtonSize(deleteButton, boxElement) {
//   deleteButton.style.width = "16px";
//   deleteButton.style.height = "16px";
//   deleteButton.style.lineHeight = "14px";
// }

// function rotateAC(boxElement) {
//   const currentRotation = parseInt(
//     boxElement.getAttribute("data-rotation"),
//     10
//   );
//   const newRotation = (currentRotation + 90) % 360;
//   boxElement.setAttribute("data-rotation", newRotation);
//   boxElement.style.transform = `rotate(${newRotation}deg)`;

//   const parentCell = boxElement.parentElement;
//   removeCoolingEffect(boxElement);
//   spreadCoolingEffect(parentCell, boxElement);

//   updateRemoveButtonPosition(boxElement);
// }

// function updateRemoveButtonPosition(boxElement) {
//   const removeBtn = boxElement.querySelector(".remove-btn");
//   if (removeBtn) {
//     removeBtn.style.position = "absolute";
//     removeBtn.style.top = "0";
//     removeBtn.style.left = "0";
//   }
// }

// function removeAC(boxElement) {
//   const parentCell = boxElement.parentElement;
//   parentCell.removeChild(boxElement);
//   removeCoolingEffect(boxElement);
// }

// function spreadCoolingEffect(cell, boxElement) {
//   const gridCells = document.querySelectorAll(".cell");
//   const gridWidth = parseInt(document.getElementById("width").value, 10); 
//   const gridHeight = parseInt(document.getElementById("length").value, 10); 
//   let coolingRange, rowOff;

//   if (
//     boxElement.classList.contains("oneton") ||
//     boxElement.classList.contains("fiveton") ||
//     boxElement.classList.contains("tenton") ||
//     boxElement.classList.contains("twentyton")
//   ) {
//     coolingRange = 5; 
//     rowOff = -2; 
//   }
//   if (
//     boxElement.classList.contains("fiveton") ||
//     boxElement.classList.contains("tenton") ||
//     boxElement.classList.contains("twentyton")
//   ) {
//     coolingRange = 9;
//     rowOff = -4; 
//   }
//   if (
//     boxElement.classList.contains("tenton") ||
//     boxElement.classList.contains("twentyton")
//   ) {
//     coolingRange = 13; 
//     rowOff = -6; 
//   }
//   if (boxElement.classList.contains("twentyton")) {
//     // สำหรับ fivetonBox
//     coolingRange = 19; 
//     rowOff = -9; 
//   }

//   const cellIndex = Array.from(gridCells).indexOf(cell);
//   const startingRow = Math.floor(cellIndex / gridWidth); 
//   const startingCol = cellIndex % gridWidth; 

//   const coolingCells = [];

//   for (let rowOffset = rowOff; rowOffset < coolingRange + rowOff; rowOffset++) {
//     for (let colOffset = 0; colOffset < coolingRange; colOffset++) {
//       let targetRow, targetCol;

//       // การปรับตำแหน่งตามการหมุน
//       const rotation = parseInt(boxElement.getAttribute("data-rotation"), 10);
//       if (rotation === 0) {
//         [targetRow, targetCol] = [
//           startingRow + rowOffset,
//           startingCol + colOffset,
//         ];
//       } else if (rotation === 90) {
//         [targetRow, targetCol] = [
//           startingRow + colOffset,
//           startingCol - rowOffset,
//         ];
//       } else if (rotation === 180) {
//         [targetRow, targetCol] = [
//           startingRow - rowOffset,
//           startingCol - colOffset,
//         ];
//       } else if (rotation === 270) {
//         [targetRow, targetCol] = [
//           startingRow - colOffset,
//           startingCol + rowOffset,
//         ];
//       }

//       const targetIndex = targetRow * gridWidth + targetCol; 

//       if (
//         targetRow >= 0 &&
//         targetRow < gridHeight &&
//         targetCol >= 0 &&
//         targetCol < gridWidth
//       ) {
//         const targetCell = gridCells[targetIndex];
//         coolingCells.push(targetCell);
//       }
//     }
//   }

//   coolingCells.forEach((targetCell) => {
//     if (!targetCell.coolingSources) targetCell.coolingSources = new Set();
//     targetCell.coolingSources.add(boxElement.id);
//     targetCell.classList.add("cooling-effect");
//   });
// }

// function removeCoolingEffect(boxElement) {
//   const gridCells = document.querySelectorAll(".cell");

//   gridCells.forEach((cell) => {
//     if (cell.coolingSources) {
//       cell.coolingSources.delete(boxElement.id);
//       if (cell.coolingSources.size === 0) {
//         cell.classList.remove("cooling-effect");
//       }
//     }
//   });
// }

