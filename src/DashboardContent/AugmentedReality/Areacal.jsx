import React, { useState } from "react";
import { useEffect } from "react";
import "./Areacal.css";
import Swal from "sweetalert2";
const Areacal = () => {
  const [width, setWidth] = useState(0);
  const [length, setLength] = useState(0);
  const [roomType, setRoomType] = useState("750");
  const [airInventory, setAirInventory] = useState({
    air5ton: 0,
    air10ton: 0,
    air20ton: 0,
  });
  const [btuResult, setBtuResult] = useState("");
  const [acCountResult, setAcCountResult] = useState("");
  const [acUsageResult, setAcUsageResult] = useState("");
  const [acSelections, setAcSelections] = useState([]);
  const [hasQuickPlacedAC, setHasQuickPlacedAC] = useState(false);
  const [isEraserMode, setIsEraserMode] = useState(false);

  let acCount = 1; // ตัวแปรที่เก็บจำนวนแอร์ที่เพิ่มเข้ามาแล้ว
  let originalBox = null;
  let isDragging = false; // สถานะการลาก
  let isDraggingMode = false;

  useEffect(() => {
    const toolboxItems = document.querySelectorAll(".toolbox .box"); // ดึง box ทั้งหมดใน toolbox

    toolboxItems.forEach((item) => {
      item.addEventListener("mousedown", () => {
        if (item.classList.contains("selected")) {
          // ถ้า box นี้ถูกเลือกอยู่แล้ว ให้ลบคลาส 'selected'
          item.classList.remove("selected");
          console.log(`ยกเลิกการเลือก ${item.textContent} ใน toolbox`);
        } else {
          // ลบคลาส 'selected' จากทุก box ก่อน
          toolboxItems.forEach((box) => box.classList.remove("selected"));

          // เพิ่มคลาส 'selected' ให้กับ box ที่ถูกกด
          item.classList.add("selected");
          console.log(`เลือก ${item.textContent} ใน toolbox`);
        }
      });
    });
  });

  useEffect(() => {
    // Monitor input changes for air-input class
    document.querySelectorAll(".air-input").forEach((input) => {
      input.addEventListener("input", (event) => {
        const id = event.target.id;
        const value = parseInt(event.target.value, 10) || 0;
        console.log(`${id} updated to: ${value}`);
      });
    });
    // Drag-and-drop event listeners
    const acBox = document.getElementById("acBox");
    const obsBox = document.getElementById("obsBox");
    const obs2Box = document.getElementById("obs2Box");
    const onetonBox = document.getElementById("onetonBox");
    const fivetonBox = document.getElementById("fivetonBox");
    const tentonBox = document.getElementById("tentonBox");
    const twentytonBox = document.getElementById("twentytonBox");

    const setupDragEvent = (box, boxId) => {
      if (box) {
        box.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("boxId", boxId);
        });
      }
    };

    setupDragEvent(acBox, "newBox");
    setupDragEvent(obsBox, "newObstacle");
    setupDragEvent(obs2Box, "newObstacle2");
    setupDragEvent(onetonBox, "newOnetonBox");
    setupDragEvent(fivetonBox, "newFivetonBox");
    setupDragEvent(tentonBox, "newTentonBox");
    setupDragEvent(twentytonBox, "newTwentytonBox");
    // Cleanup event listeners on component unmount
    return () => {
      document.querySelectorAll(".air-input").forEach((input) => {
        input.removeEventListener("input", () => {});
      });

      const removeDragEvent = (box) => {
        if (box) {
          box.removeEventListener("dragstart", () => {});
        }
      };

      removeDragEvent(acBox);
      removeDragEvent(obsBox);
      removeDragEvent(obs2Box);
      removeDragEvent(onetonBox);
      removeDragEvent(fivetonBox);
      removeDragEvent(tentonBox);
      removeDragEvent(twentytonBox);
    };
  }, []);

  useEffect(() => {
    calculateBTUWithMinAC();
  }, [width, length, roomType, airInventory]);


  function handleDraggingMode(event) {
    if (event.target.checked) {
      isDraggingMode = true
      enableDragCopyMode();
      console.log("เปิดโหมดลากค้างและคัดลอก");
    } else {
      isDraggingMode = false
      disableDragCopyMode();
      console.log("ปิดโหมดลากค้างและคัดลอก");
    }
  }

  
  function handleEraserButton() {
    setIsEraserMode(!isEraserMode);
    if (!isEraserMode) {
      eraserButton.classList.add("active");
      document.body.style.cursor = "crosshair"; // เปลี่ยน cursor เป็นรูปยางลบ
      console.log("เปิดโหมดยางลบ");
    } else {
      eraserButton.classList.remove("active");
      document.body.style.cursor = "default"; // เปลี่ยน cursor กลับเป็นปกติ
      console.log("ปิดโหมดยางลบ");
    }
  }

  function handleEraserGrid() {
    if (isEraserMode) {
      const targetBox = event.target.closest(".box");
      
      if (targetBox) {
        console.log(targetBox)
        const parentCell = targetBox.parentElement;
        // console.log(parentCell)
        // ลบ boxElement
        targetBox.remove();

        console.log("ลบ box:", targetBox.id);

        // เรียกใช้ฟังก์ชันลบ cooling effect
        removeCoolingEffect(targetBox);

        // อัปเดตจำนวนแอร์ในกริด
        calculateBTU();

        // ล็อกการลบสำเร็จ
        console.log(`ลบ ${targetBox.id} ออกจาก cell:`, parentCell);
      }
    }
  }

  function calculateBTUWithMinAC() {
    const width = parseInt(document.getElementById("width").value, 10);
    const length = parseInt(document.getElementById("length").value, 10);
    const roomType = parseInt(document.getElementById("room-type").value, 10);

    if (!width || !length) {
      document.getElementById("btu-result").textContent =
        "กรุณากรอกข้อมูลให้ครบถ้วน";
      return;
    }

    const roomArea = width * length;
    const requiredBTU = roomArea * roomType;

    const airOptions = [
      {
        size: 240000,
        count: parseInt(document.getElementById("air-20ton").value, 10) || 0,
      },
      {
        size: 120000,
        count: parseInt(document.getElementById("air-10ton").value, 10) || 0,
      },
      {
        size: 60000,
        count: parseInt(document.getElementById("air-5ton").value, 10) || 0,
      },
    ];

    airOptions.sort((a, b) => b.size - a.size);

    let remainingBTU = requiredBTU;
    let result = [];
    let totalBTU = 0;

    for (let option of airOptions) {
      if (remainingBTU <= 0) break;

      const useCount = Math.min(
        option.count,
        Math.ceil(remainingBTU / option.size)
      );
      if (useCount > 0) {
        result.push({ size: option.size, count: useCount });
        remainingBTU -= useCount * option.size;
        totalBTU += useCount * option.size;
      }
    }

    const btuDifferenceMessage =
      remainingBTU > 0 ? `ยังขาด BTU อีก: ${remainingBTU}` : `BTU เพียงพอแล้ว`;

    document.getElementById(
      "btu-result"
    ).textContent = `BTU ที่ต้องการ: ${requiredBTU}`;
    document.getElementById(
      "ac-count-result"
    ).textContent = `BTU รวมจากแอร์: ${totalBTU}, ${btuDifferenceMessage}`;

    const usageResult = document.getElementById("ac-usage-result");
    usageResult.innerHTML = "";
    result.forEach(({ size, count }) => {
      const sizeInTons = size / 12000; // แปลง BTU เป็นตัน
      usageResult.innerHTML += `<div>แอร์ขนาด ${sizeInTons} ตัน: ${count} ตัว</div>`;
    });

    // เพิ่มปุ่ม "ต้องการใช้ค่านี้"
    addApplyButton(result);
  }

  function addApplyButton(result) {
    // ตรวจสอบว่าปุ่มมีอยู่แล้วหรือยัง
    if (document.getElementById("applyButton")) return;

    const buttonContainer = document.createElement("div");
    const applyButton = document.createElement("button");
    applyButton.id = "applyButton";
    applyButton.textContent = "ต้องการใช้ค่านี้";
    applyButton.addEventListener("click", () => applyResultToDropdown(result));

    buttonContainer.appendChild(applyButton);
    document.getElementById("ac-usage-result").appendChild(buttonContainer);
  }

  function applyResultToDropdown(result) {
    const acContainer = document.getElementById("ac-container");
    acContainer.innerHTML = ""; // ล้างค่าเดิมในฟอร์ม

    result.forEach(({ size, count }) => {
      // สร้าง dropdown และ input
      const acDiv = document.createElement("div");
      acDiv.classList.add("ac-selection");

      const acSelect = document.createElement("select");
      acSelect.classList.add("ac-type");
      acSelect.classList.add("select-air");

      acSelect.innerHTML = `
          <option value="60000">5 ตัน (60,000 BTU)</option>
          <option value="120000">10 ตัน (120,000 BTU)</option>
          <option value="240000">20 ตัน (240,000 BTU)</option>
      `;
      acSelect.value = size; // ตั้งค่า BTU ที่เลือก

      const quantityInput = document.createElement("input");
      quantityInput.type = "number";
      quantityInput.classList.add("input-air");
      quantityInput.classList.add("ac-quantity");
      quantityInput.min = 1;
      quantityInput.value = count; // ตั้งค่าจำนวนแอร์ที่ต้องใช้

      acDiv.appendChild(acSelect);
      acDiv.appendChild(quantityInput);
      acContainer.appendChild(acDiv);
    });
  }

  function enableDragCopyMode() {
    const toolboxItems = document.querySelectorAll(".toolbox .box");
      toolboxItems.forEach((item) => {
        item.addEventListener("mousedown", startDragCopy); // เริ่มลากค้าง
    });
  }
  // ปิดโหมดลากค้าง
  function disableDragCopyMode() {
      const toolboxItems = document.querySelectorAll(".toolbox .box");
      toolboxItems.forEach((item) => {
        item.removeEventListener("mousedown", startDragCopy); // ยกเลิกการลากค้าง
      });
  }
  // ฟังก์ชันเริ่มลากค้าง
  function startDragCopy(event) {
    event.preventDefault(); // ป้องกัน Default behavior
    originalBox = event.target; // เก็บกล่องต้นฉบับที่ถูกลากค้าง
    if (!originalBox.classList.contains('box')) return;

    isDragging = true; // เริ่มสถานะลากค้าง

    // ตรวจจับการลากเมาส์ผ่าน grid
    const grid = document.getElementById('grid');
    grid.addEventListener('mousemove', dragCopy); // คัดลอกเมื่อเมาส์ลากผ่าน
    grid.addEventListener('mouseup', stopDragCopy); // หยุดเมื่อปล่อยเมาส์
}
  // ฟังก์ชันคัดลอก box element
  function dragCopy(event) {
    if (!isDragging || !originalBox ||!isDraggingMode) return; // ตรวจสอบสถานะการคลิกค้าง
    console.log("drag copy")
    const cell = event.target;
    if (!cell.classList.contains('cell')) return; // หยุดถ้าไม่ใช่ cell
    if (cell.querySelector('.box')) return; // หยุดถ้า cell มี box อยู่แล้ว

    // คัดลอกกล่องต้นฉบับ
    const newBox = createBoxCopy(originalBox);
    console.log("สร้าง box ใหม่:", newBox);

    // ปรับขนาด box ให้ตรงกับ cell
    adjustBoxSize(newBox, cell);

    cell.appendChild(newBox); // เพิ่มลงใน cell
    console.log("เพิ่ม box ลงใน cell:", cell);

    // แพร่ผล (เช่น Cooling Effect) ถ้าจำเป็น
    if (newBox.classList.contains('ac') || newBox.classList.contains('oneton') ||
        newBox.classList.contains('fiveton') || newBox.classList.contains('tenton') ||
        newBox.classList.contains('twentyton')) {
        spreadCoolingEffect(cell, newBox); // ฟังก์ชันแพร่ความเย็น
    }
}


// ฟังก์ชันหยุดลากค้าง
function stopDragCopy() {
    if (!isDragging) return;

    isDragging = false; // ยกเลิกสถานะลากค้าง
    originalBox = null; // รีเซ็ตกล่องต้นฉบับ

    const grid = document.getElementById('grid');
    grid.removeEventListener('mousemove', dragCopy); // ยกเลิก Event Listener
    grid.removeEventListener('mouseup', stopDragCopy); // ยกเลิก Event Listener
}

  // ฟังก์ชันสร้างสำเนาของกล่อง
  function createBoxCopy(originalBox) {
    const newBox = originalBox.cloneNode(true); // คัดลอกกล่องพร้อมเนื้อหา
    newBox.id = `box-${Date.now()}`; // กำหนด ID ใหม่

    console.log("สร้าง box ใหม่:", newBox);

    // เพิ่มฟังก์ชันการทำงานเดิมทั้งหมด
    addFunctionalityToBox(newBox);

    return newBox;
  }

  // เพิ่มฟังก์ชันการทำงานให้กับ box ใหม่
  function addFunctionalityToBox(boxElement) {
    // ฟังก์ชันหมุน
    boxElement.addEventListener("click", () => {
      console.log("กำลังหมุน:", boxElement.id);
      rotateAC(boxElement); // เรียกฟังก์ชันหมุน
    });

    // ฟังก์ชันลากและวาง
    boxElement.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("boxId", boxElement.id);
    });

    // เพิ่มปุ่มลบ
    const deleteButton = createDeleteButton(boxElement);
    boxElement.appendChild(deleteButton);

    console.log("เพิ่มฟังก์ชันให้ box:", boxElement.id);
  }

  const handleAddAC = () => {
    if (acCount >= 4) {
      Swal.fire({
        title: "จำกัดการเพิ่มแอร์",
        text: "คุณสามารถเพิ่มแอร์ได้สูงสุด 4 ชนิด",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    // สร้าง div ใหม่สำหรับแอร์
    const acDiv = document.createElement("div");
    acDiv.classList.add("ac-selection");

    // สร้าง dropdown สำหรับเลือกประเภทแอร์
    const acSelect = document.createElement("select");
    acSelect.classList.add("ac-type");

    acSelect.innerHTML = `
      <option value="60000">5 ตัน (60,000 BTU)</option>
      <option value="120000">10 ตัน (120,000 BTU)</option>
      <option value="240000">20 ตัน (240,000 BTU)</option>
  `;

    // สร้าง input สำหรับจำนวนแอร์
    const quantityDiv = document.createElement("div");
    quantityDiv.classList.add("quantity-container");
    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.classList.add("ac-quantity");
    quantityInput.min = 1;
    quantityInput.value = 1;
    quantityInput.placeholder = "จำนวน";

    quantityDiv.appendChild(quantityInput);

    // สร้างปุ่มลบ
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "ลบ";
    deleteButton.classList.add("delete-ac");

    // เพิ่ม event listener ให้ปุ่มลบลบ div ที่สร้างขึ้น
    deleteButton.addEventListener("click", function () {
      acDiv.remove();
      acCount--; // ลดจำนวนแอร์ที่เพิ่มไป
      calculateBTU(); // อัปเดต BTU หลังลบแอร์
    });

    // เพิ่มทุกส่วนเข้าไปใน div
    acDiv.appendChild(acSelect);
    acDiv.appendChild(quantityDiv);
    acDiv.appendChild(deleteButton);

    // เพิ่ม div นี้ไปยัง #ac-container
    document.getElementById("ac-container").appendChild(acDiv);

    acCount++; // เพิ่มจำนวนแอร์ที่เพิ่มไป
    calculateBTU(); // คำนวณ BTU ใหม่ทุกครั้งที่เพิ่มแอร์
  };

  const handleAirInventoryChange = (e, key) => {
    const value = parseInt(e.target.value, 10) || 0;
    setAirInventory({
      ...airInventory,
      [key]: value,
    });
  };

  function calculateBTU() {
    if (!width || !length) {
      document.getElementById("btu-result").textContent =
        "กรุณากรอกข้อมูลให้ครบถ้วน";
      return;
    }

    // คำนวณพื้นที่และ BTU ที่ต้องการ
    const roomArea = width * length;
    const requiredBTU = roomArea * roomType;

    // ดึงค่าจากกล่องจำนวนแอร์ที่มีอยู่
    const air5tonCount =
      parseInt(document.getElementById("air-5ton").value, 10) || 0;
    const air10tonCount =
      parseInt(document.getElementById("air-10ton").value, 10) || 0;
    const air20tonCount =
      parseInt(document.getElementById("air-20ton").value, 10) || 0;

    // คำนวณ BTU รวมจากจำนวนแอร์ที่มีอยู่
    const totalACBTU =
      air5tonCount * 60000 + air10tonCount * 120000 + air20tonCount * 240000;

    // คำนวณผลต่าง BTU
    const btuDifference = requiredBTU - totalACBTU;
    const btuDifferenceMessage =
      btuDifference > 0
        ? `ยังขาด BTU อีก: ${btuDifference}`
        : `BTU เพียงพอแล้ว`;

    // แสดงผลลัพธ์
    document.getElementById(
      "btu-result"
    ).textContent = `BTU ที่ต้องการ: ${requiredBTU}`;
    setBtuResult(requiredBTU);
    document.getElementById(
      "ac-count-result"
    ).textContent = `BTU รวมจากแอร์: ${totalACBTU}, ${btuDifferenceMessage}`;
  }

  const createGrid = () => {
    if (isNaN(width) || isNaN(length) || width < 1 || length < 1) {
      Swal.fire({
        title: "จำกัดความกว้างความยาว",
        text: "กรุณากรอกความกว้างและความยาวเป็นตัวเลขที่ถูกต้อง",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    const grid = document.getElementById("grid");
    grid.innerHTML = ""; // ล้าง Grid เดิม

    let cellSize = 40; // ขนาดเริ่มต้นของ cell (40px)
    if (width > 30 || length > 30) {
      cellSize = 20; // ลดขนาด cell สำหรับกริดใหญ่
    }

    grid.style.gridTemplateColumns = `repeat(${width}, ${cellSize}px)`;
    grid.style.gridTemplateRows = `repeat(${length}, ${cellSize}px)`;

    for (let i = 0; i < width * length; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.style.width = `${cellSize}px`;
      cell.style.height = `${cellSize}px`;
      cell.addEventListener("dragover", (e) => e.preventDefault());
      cell.addEventListener("drop", handleDrop);
      grid.appendChild(cell);
    }

    setHasQuickPlacedAC(false); // รีเซ็ตสถานะเมื่อสร้าง Grid ใหม่
  };

  function handleDrop(e) {
    e.preventDefault();
    const boxType = e.dataTransfer.getData("boxId");
    let boxElement;

    const cell = e.target;

    // Ensure the target is a valid cell
    if (!cell.classList.contains("cell")) {
      Swal.fire({
        title: "Valid grid position",
        text: "Please drop the item inside a valid grid cell.",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    // Prevent placing on a cell already occupied by another box
    if (cell.querySelector(".box")) {
      Swal.fire({
        title: "Valid grid position",
        text: "This cell is already occupied. Please choose another cell.",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    if (
      boxType === "newBox" ||
      boxType === "newObstacle" ||
      boxType === "newObstacle2" ||
      boxType === "newOnetonBox" ||
      boxType === "newFivetonBox" ||
      boxType === "newTentonBox" ||
      boxType === "newTwentytonBox"
    ) {
      boxElement = document.createElement("div");

      if (boxType === "newBox") {
        boxElement.className = "box ac";
        boxElement.textContent = "AC";
        boxElement.setAttribute("data-rotation", "0");
      } else if (boxType === "newObstacle") {
        boxElement.className = "box obstacle";
        boxElement.textContent = "OBS";
      } else if (boxType === "newObstacle2") {
        boxElement.className = "box obstacle2";
        boxElement.textContent = "OBS2";
        cell.classList.add("obstacle2"); // Add obstacle2 class to the cell
      } else if (boxType === "newOnetonBox") {
        boxElement.className = "box oneton";
        boxElement.textContent = "1Ton";
        boxElement.setAttribute("data-rotation", "0");
      } else if (boxType === "newFivetonBox") {
        boxElement.className = "box fiveton";
        boxElement.textContent = "5Ton";
        boxElement.setAttribute("data-rotation", "0");
      } else if (boxType === "newTentonBox") {
        boxElement.className = "box tenton";
        boxElement.textContent = "10Ton";
        boxElement.setAttribute("data-rotation", "0");
      } else if (boxType === "newTwentytonBox") {
        boxElement.className = "box twentyton";
        boxElement.textContent = "20Ton";
        boxElement.setAttribute("data-rotation", "0");
      }

      boxElement.id = `box-${Date.now()}`;
      boxElement.setAttribute("draggable", "true");

      // Add delete button
      const deleteButton = createDeleteButton(boxElement);
      adjustBoxSize(boxElement, cell);
      adjustDeleteButtonSize(deleteButton, boxElement);

      boxElement.appendChild(deleteButton);
      cell.appendChild(boxElement);

      if (
        boxType === "newBox" ||
        boxType === "newOnetonBox" ||
        boxType === "newFivetonBox" ||
        boxType === "newTentonBox" ||
        boxType === "newTwentytonBox"
      ) {
        spreadCoolingEffect(cell, boxElement);
        boxElement.addEventListener("click", () => rotateAC(boxElement));
      }

      boxElement.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("boxId", boxElement.id);
      });

      // Add obstacle2 specific behavior
      if (boxType === "newObstacle2") {
        cell.classList.add("obstacle2");
      }
    } else {
      boxElement = document.getElementById(boxType);

      if (
        boxElement.classList.contains("ac") ||
        boxElement.classList.contains("oneton") ||
        boxElement.classList.contains("fiveton") ||
        boxElement.classList.contains("tenton") ||
        boxElement.classList.contains("twentyton")
      ) {
        removeCoolingEffect(boxElement);
      }

      const previousParent = boxElement.parentElement;

      if (previousParent && previousParent.classList.contains("obstacle2")) {
        previousParent.classList.remove("obstacle2");
      }

      adjustBoxSize(boxElement, cell);
      cell.appendChild(boxElement);

      if (boxElement.classList.contains("obstacle2")) {
        cell.classList.add("obstacle2");
      }

      if (
        boxElement.classList.contains("ac") ||
        boxElement.classList.contains("oneton") ||
        boxElement.classList.contains("fiveton") ||
        boxElement.classList.contains("tenton") ||
        boxElement.classList.contains("twentyton")
      ) {
        spreadCoolingEffect(cell, boxElement);
      }
    }
    updateACUsageInGrid(); // Update AC usage after placing
  }

  function updateRemoveButtonPosition(boxElement) {
    const removeBtn = boxElement.querySelector(".remove-btn");
    if (removeBtn) {
      removeBtn.style.position = "absolute";
      removeBtn.style.top = "0";
      removeBtn.style.left = "0";
    }
  }

  function removeAC(boxElement) {
    const parentCell = boxElement.parentElement;
    parentCell.removeChild(boxElement);
    removeCoolingEffect(boxElement);
  }

  function createDeleteButton(boxElement) {
    const deleteButton = document.createElement("delete");
    // deleteButton.textContent = "ลบ";
    // deleteButton.className = "delete-button";
    // deleteButton.style.position = "absolute";
    // deleteButton.style.top = "2px";
    // deleteButton.style.right = "2px";

    // deleteButton.addEventListener("click", () => {
    //   const parentCell = boxElement.parentElement;
    //   if (boxElement.classList.contains("ac")){
    //     removeCoolingEffect(parentCell); // ลบความเย็น
    //   }
    //   if (boxElement.classList.contains("obstacle2")) {
    //     removeObstacle(parentCell, boxElement); // Remove obs2 effect
    //   }
    //   boxElement.remove();
    // });

    return deleteButton;
  }

  function adjustBoxSize(boxElement, cell) {
    const cellSize = cell.getBoundingClientRect();
    boxElement.style.width = `${cellSize.width}px`;
    boxElement.style.height = `${cellSize.height}px`;
    boxElement.style.margin = "0";
    boxElement.style.position = "relative";
  }

  function removeObstacle(cell, boxElement) {
    if (boxElement.classList.contains("obstacle2")) {
      cell.classList.remove("obstacle2");
    }
  }

  function adjustDeleteButtonSize(deleteButton, boxElement) {
    deleteButton.style.width = "16px";
    deleteButton.style.height = "16px";
    deleteButton.style.lineHeight = "14px";
  }

  function spreadCoolingEffect(cell, boxElement) {
    const gridCells = document.querySelectorAll(".cell");
    const gridWidth = parseInt(document.getElementById("width").value, 10); // ใช้ขนาดกริดที่กำหนดจาก input
    const gridHeight = parseInt(document.getElementById("length").value, 10); // ใช้ขนาดกริดที่กำหนดจาก input
    let coolingRange, rowOff;

    // ตรวจสอบว่า boxElement มี attribute data-rotation หรือไม่
    if (!boxElement.hasAttribute("data-rotation")) {
      boxElement.setAttribute("data-rotation", "0"); // กำหนดค่าเริ่มต้นสำหรับ box ใหม่
    }

    if (boxElement.classList.contains("oneton")) {
      coolingRange = 5; // 5x5 grid
      rowOff = -2; // เริ่มต้นจากแถว -2
    } else if (boxElement.classList.contains("fiveton")) {
      coolingRange = 9; // 9x9 grid
      rowOff = -4; // เริ่มต้นจากแถว -4
    } else if (boxElement.classList.contains("tenton")) {
      coolingRange = 13; // 13x13 grid
      rowOff = -6; // เริ่มต้นจากแถว -6
    } else if (boxElement.classList.contains("twentyton")) {
      coolingRange = 19; // 19x19 grid
      rowOff = -9; // เริ่มต้นจากแถว -9
    }

    const cellIndex = Array.from(gridCells).indexOf(cell);
    const startingRow = Math.floor(cellIndex / gridWidth); // แถวที่เริ่มต้น
    const startingCol = cellIndex % gridWidth; // คอลัมน์ที่เริ่มต้น

    // ลิสต์เซลล์ที่ได้รับผลจากความเย็น
    const coolingCells = [];

    // ดึง obs2 ทั้งหมด
    const obstacles = document.querySelectorAll(".obstacle2");

    // คำนวณเซลล์ที่จะได้รับผลจากความเย็น
    for (
      let rowOffset = rowOff;
      rowOffset < coolingRange + rowOff;
      rowOffset++
    ) {
      for (let colOffset = 0; colOffset < coolingRange; colOffset++) {
        let targetRow, targetCol;

        // การปรับตำแหน่งตามการหมุน
        const rotation = parseInt(boxElement.getAttribute("data-rotation"), 10);
        if (rotation === 0) {
          [targetRow, targetCol] = [
            startingRow + rowOffset,
            startingCol + colOffset,
          ];
        } else if (rotation === 90) {
          [targetRow, targetCol] = [
            startingRow + colOffset,
            startingCol - rowOffset,
          ];
        } else if (rotation === 180) {
          [targetRow, targetCol] = [
            startingRow - rowOffset,
            startingCol - colOffset,
          ];
        } else if (rotation === 270) {
          [targetRow, targetCol] = [
            startingRow - colOffset,
            startingCol + rowOffset,
          ];
        }

        // ตรวจสอบว่าเซลล์ที่คำนวณได้อยู่ในกริดหรือไม่
        if (
          targetRow >= 0 &&
          targetRow < gridHeight &&
          targetCol >= 0 &&
          targetCol < gridWidth
        ) {
          const targetIndex = targetRow * gridWidth + targetCol;
          const targetCell = gridCells[targetIndex];

          // หากเจอ obs2 หยุดกระจายในแนว row หรือ col เท่านั้น
          if (targetCell.querySelector(".obstacle2")) {
            // ถ้าพบ obstacle2 ในเซลล์เป้าหมาย
            console.log(
              `เจอ obstacle2 ใน cell ที่ rowOffset: ${rowOffset}, colOffset: ${colOffset}`
            );
            if (rotation === 0 || rotation === 180) {
              break; // หยุดในลูป colOffset สำหรับการแพร่ในแนว row
            } else if (rotation === 90 || rotation === 270) {
              break; // หยุดในลูป rowOffset สำหรับการแพร่ในแนว col
            }
          }

          coolingCells.push(targetCell);
        }
      }
    }

    // เพิ่มความเย็นในเซลล์ที่ได้รับผล
    coolingCells.forEach((targetCell) => {
      if (!targetCell.coolingSources) targetCell.coolingSources = new Set();
      targetCell.coolingSources.add(boxElement.id);
      targetCell.classList.add("cooling-effect");
    });
  }

  // ฟังก์ชันลบ cooling effect
  async function removeCoolingEffect(boxElement) {
    const gridCells = document.querySelectorAll(".cell");
    gridCells.forEach((cell) => {
      if (cell.coolingSources) {
        cell.coolingSources.delete(boxElement.id);
        if (cell.coolingSources.size === 0) {
          cell.classList.remove("cooling-effect");
        }
      }
    });
    await updateACUsageInGrid(); // เรียกใช้เมื่อมีการลบแอร์
  }

  function createACBox(acType) {
    const acBox = document.createElement("div");
    acBox.className = `box ${getACClassName(acType)}`;
    acBox.textContent = `${getACLabel(acType)}`;
    acBox.setAttribute("data-rotation", "0");
    acBox.setAttribute("draggable", "true");
    acBox.id = `ac-${Date.now()}`; // เพิ่ม id เฉพาะตัว

    // เพิ่ม Event Listener สำหรับการลากและย้าย
    acBox.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("boxId", acBox.id);
      removeCoolingEffect(acBox); // ลบผลความเย็นเก่าเมื่อเริ่มลาก
    });

    document.querySelectorAll(".cell").forEach((cell) => {
      cell.addEventListener("dragover", (e) => {
        e.preventDefault();
      });

      cell.addEventListener("drop", (e) => {
        e.preventDefault();
        const boxId = e.dataTransfer.getData("boxId");
        const draggedBox = document.getElementById(boxId);
        const targetCell = e.target;

        if (targetCell.classList.contains("cell")) {
          targetCell.appendChild(draggedBox);
          spreadCoolingEffect(
            targetCell,
            draggedBox,
            uncoveredCells,
            gridWidth
          ); // กระจายผลความเย็นใหม่เมื่อวางใน cell ใหม่
        }
      });
    });

    acBox.addEventListener("dragend", () => {
      const parentCell = acBox.parentElement;
      if (parentCell.classList.contains("cell")) {
        spreadCoolingEffect(parentCell, acBox, uncoveredCells, gridWidth); // กระจายผลความเย็นใหม่เมื่อวาง
      }
    });

    acBox.addEventListener("click", () => rotateAC(acBox));

    // เพิ่มปุ่มลบ
    const deleteButton = createDeleteButton(acBox);
    acBox.appendChild(deleteButton);

    return acBox;
  }

  function updateACUsageInGrid() {
    const gridCells = document.querySelectorAll(".cell");
    const acUsage = {};

    gridCells.forEach((cell) => {
      const acBox = cell.querySelector(".box");
      if (acBox) {
        const acType = acBox.className
          .split(" ")
          .find((cls) => cls.endsWith("ton"));
        if (acType) {
          acUsage[acType] = (acUsage[acType] || 0) + 1;
        }
      }
    });

    const usageResult = document.getElementById("ac-usage-result");
    usageResult.innerHTML = ""; // ล้างข้อมูลเดิมก่อน
    for (const [acType, count] of Object.entries(acUsage)) {
      const acLabel = getACLabelFromClassName(acType);
      usageResult.innerHTML += `<div>แอร์ขนาด ${acLabel}: ${count} ตัว</div>`;
    }
  }

  function handleQuickPlaceAc() {
    if (hasQuickPlacedAC) {
      Swal.fire({
        title: "จำกัดการวางแอร์",
        text: "คุณได้วางแอร์อย่างรวดเร็วไปแล้ว กรุณาสร้าง Grid ใหม่ก่อน",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });

      return;
    }

    const gridCells = document.querySelectorAll(".cell");
    const gridWidth = parseInt(document.getElementById("width").value, 10);
    const gridHeight = parseInt(document.getElementById("length").value, 10);

    if (isNaN(gridWidth) || isNaN(gridHeight)) {
      Swal.fire({
        title: "จำกัดขนาดห้อง",
        text: "กรุณากรอกขนาดห้องให้ครบถ้วน",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    const acSelections = document.querySelectorAll(".ac-selection");
    const uncoveredCells = new Map();

    gridCells.forEach((cell, index) => {
      uncoveredCells.set(index, cell);
      cell.setAttribute("data-index", index);
    });

    acSelections.forEach((selection) => {
      const acType = selection.querySelector(".ac-type").value;
      const acQuantity = parseInt(
        selection.querySelector(".ac-quantity").value,
        10
      );

      if (!acQuantity || acQuantity < 1) return;

      for (let i = 0; i < acQuantity; i++) {
        const placed = placeACInOptimalPosition(
          uncoveredCells,
          gridWidth,
          gridHeight,
          acType
        );
        if (!placed) {
          placeACInFallbackPosition(uncoveredCells, acType);
        }
      }
    });
    Swal.fire({
      title: "เสร็จสิ้น",
      text: "การวางแอร์อย่างรวดเร็วเสร็จสิ้น",
      icon: "success",
      confirmButtonText: "ตกลง",
    });
    setHasQuickPlacedAC(true); // ตั้งค่าสถานะเมื่อวางแอร์เสร็จ

    updateACUsageInGrid(); // เรียกใช้เมื่อมีการลบแอร์
  }

  function rotateAC(boxElement) {
    // ตรวจสอบว่า boxElement มี attribute data-rotation หรือไม่
    if (!boxElement.hasAttribute("data-rotation")) {
      boxElement.setAttribute("data-rotation", "0"); // กำหนดค่าเริ่มต้น
    }

    const currentRotation = parseInt(
      boxElement.getAttribute("data-rotation"),
      10
    );
    const newRotation = (currentRotation + 90) % 360;
    boxElement.setAttribute("data-rotation", newRotation);
    boxElement.style.transform = `rotate(${newRotation}deg)`;

    const parentCell = boxElement.parentElement;

    // ฟังก์ชันที่มีอยู่เดิม: ลบผลความเย็นเก่าและแพร่ผลใหม่
    removeCoolingEffect(boxElement);
    spreadCoolingEffect(parentCell, boxElement);

    // ฟังก์ชันที่มีอยู่เดิม: อัปเดตตำแหน่งปุ่มลบให้ตรงกับ box
    updateRemoveButtonPosition(boxElement);
  }

  function placeACInOptimalPosition(
    uncoveredCells,
    gridWidth,
    gridHeight,
    acType
  ) {
    if (uncoveredCells.size === 0) return false;

    const bestCell = findBestCellForAC(
      uncoveredCells,
      gridWidth,
      gridHeight,
      acType
    );
    if (!bestCell) return false;

    const acBox = createACBox(acType);
    adjustBoxSize(acBox, bestCell); // ปรับขนาดของแอร์ตามเซลล์
    adjustRotationForRoomEdge(acBox, bestCell, gridWidth, gridHeight);
    bestCell.appendChild(acBox);
    spreadCoolingEffect(bestCell, acBox, uncoveredCells, gridWidth);
    uncoveredCells.delete(parseInt(bestCell.getAttribute("data-index")));
    return true;
  }

  // ฟังก์ชันวางแอร์ในตำแหน่ง fallback
  function placeACInFallbackPosition(uncoveredCells, acType) {
    if (uncoveredCells.size === 0) return;

    const fallbackCellIndex = Array.from(uncoveredCells.keys())[0];
    const fallbackCell = uncoveredCells.get(fallbackCellIndex);
    const acBox = createACBox(acType);
    adjustBoxSize(acBox, fallbackCell); // ปรับขนาดของแอร์ตามเซลล์
    fallbackCell.appendChild(acBox);
    spreadCoolingEffect(fallbackCell, acBox, uncoveredCells, gridWidth);
    uncoveredCells.delete(fallbackCellIndex);
  }

  function findBestCellForAC(uncoveredCells, gridWidth, gridHeight, acType) {
    let bestCell = null;
    let bestScore = -Infinity;
    const spacing = getACSpacing(acType); // ระยะห่างสำหรับแต่ละประเภทแอร์

    //เปลี่ยน index เป็น row, column
    for (const [index, cell] of uncoveredCells.entries()) {
      const row = Math.floor(index / gridWidth);
      const col = index % gridWidth;

      const isCorner =
        (row === 0 || row === gridHeight - 1) &&
        (col === 0 || col === gridWidth - 1);
      const score = isCorner
        ? 200
        : calculateCellScore(row, col, gridWidth, gridHeight);

      if (
        isCellValidForPlacement(
          row,
          col,
          gridWidth,
          gridHeight,
          spacing,
          uncoveredCells
        )
      ) {
        if (score > bestScore) {
          bestScore = score;
          bestCell = cell;
        }
      }
    }

    return bestCell;
  }

  // ฟังก์ชันตรวจสอบความถูกต้องของตำแหน่งเซลล์สำหรับวางแอร์
  function isCellValidForPlacement(
    row,
    col,
    gridWidth,
    gridHeight,
    spacing,
    uncoveredCells
  ) {
    for (
      let r = Math.max(0, row - spacing);
      r <= Math.min(gridHeight - 1, row + spacing);
      r++
    ) {
      for (
        let c = Math.max(0, col - spacing);
        c <= Math.min(gridWidth - 1, col + spacing);
        c++
      ) {
        const index = r * gridWidth + c;
        if (!uncoveredCells.has(index)) return false;
      }
    }
    return true;
  }

  // ฟังก์ชันคำนวณคะแนนของเซลล์
  function calculateCellScore(row, col, gridWidth, gridHeight) {
    let score = 0;

    // เพิ่มคะแนนสำหรับตำแหน่งขอบ
    if (
      row === 0 ||
      row === gridHeight - 1 ||
      col === 0 ||
      col === gridWidth - 1
    ) {
      score += 50;
    }

    return score;
  }

  // ฟังก์ชันปรับการหมุนของแอร์เมื่อวางชิดขอบห้อง
  function adjustRotationForRoomEdge(acBox, cell, gridWidth, gridHeight) {
    const cellIndex = parseInt(cell.getAttribute("data-index"), 10);
    const row = Math.floor(cellIndex / gridWidth);
    const col = cellIndex % gridWidth;

    if (row === 0) {
      acBox.setAttribute("data-rotation", "90"); // หันไปทางขวา
    } else if (row === gridHeight - 1) {
      acBox.setAttribute("data-rotation", "270"); // หันไปทางซ้าย
    } else if (col === 0) {
      acBox.setAttribute("data-rotation", "0"); // หันขึ้นบน
    } else if (col === gridWidth - 1) {
      acBox.setAttribute("data-rotation", "180"); // หันลงล่าง
    }
  }

  function getACLabelFromClassName(className) {
    switch (className) {
      case "oneton":
        return "1 ตัน";
      case "fiveton":
        return "5 ตัน";
      case "tenton":
        return "10 ตัน";
      case "twentyton":
        return "20 ตัน";
      default:
        return "ไม่ระบุ";
    }
  }

  function getACClassName(acType) {
    switch (acType) {
      case "12000":
        return "oneton";
      case "60000":
        return "fiveton";
      case "120000":
        return "tenton";
      case "240000":
        return "twentyton";
      default:
        return "ac";
    }
  }

  // ฟังก์ชันรับชื่อของแอร์
  function getACLabel(acType) {
    switch (acType) {
      case "12000":
        return "1Ton";
      case "60000":
        return "5Ton";
      case "120000":
        return "10Ton";
      case "240000":
        return "20Ton";
      default:
        return "AC";
    }
  }

  // ฟังก์ชันคำนวณระยะห่างของแอร์
  function getACSpacing(acType) {
    switch (acType) {
      case "12000":
        return 4; // ระยะห่าง 4 ช่องสำหรับ 1 ตัน
      case "60000":
        return 8; // ระยะห่าง 8 ช่องสำหรับ 5 ตัน
      case "120000":
        return 12; // ระยะห่าง 12 ช่องสำหรับ 10 ตัน
      case "240000":
        return 18; // ระยะห่าง 18 ช่องสำหรับ 20 ตัน
      default:
        return 4;
    }
  }

  return (
    <>
      <div className="mx-5 my-5 font-inter">
        <div
          id="air-container"
          className="p-6 bg-base-100 shadow-md rounded-lg w-full  mx-auto"
        >
          <h3 className="text-xl font-bold mb-4 text-center ">
            จำนวนแอร์ที่มีอยู่
          </h3>
          <div className="air-row mb-4">
            <label
              htmlFor="air-5ton"
              className="block text-md font-medium mb-2"
            >
              แอร์ 5 ตันมีอยู่:
            </label>
            <input
              type="number"
              id="air-5ton"
              className="input input-bordered w-full"
              value={airInventory.air5ton}
              min="0"
              onChange={(e) => handleAirInventoryChange(e, "air5ton")}
            />
          </div>
          <div className="air-row mb-4">
            <label
              htmlFor="air-10ton"
              className="block text-md font-medium mb-2"
            >
              แอร์ 10 ตันมีอยู่:
            </label>
            <input
              type="number"
              id="air-10ton"
              className="input input-bordered w-full"
              value={airInventory.air10ton}
              min="0"
              onChange={(e) => handleAirInventoryChange(e, "air10ton")}
            />
          </div>
          <div className="air-row mb-4">
            <label
              htmlFor="air-20ton"
              className="block text-md font-medium mb-2"
            >
              แอร์ 20 ตันมีอยู่:
            </label>
            <input
              type="number"
              id="air-20ton"
              className="input input-bordered w-full"
              value={airInventory.air20ton}
              min="0"
              onChange={(e) => handleAirInventoryChange(e, "air20ton")}
            />
          </div>
        </div>

        <label htmlFor="width">Width (m):</label>
        <input
          type="number"
          id="width"
          min="1"
          placeholder="Enter width"
          value={width}
          className="input-air"
          onChange={(e) => setWidth(e.target.value)}
        />

        <label htmlFor="length">Length (m):</label>
        <input
          type="number"
          id="length"
          min="1"
          placeholder="Enter length"
          value={length}
          className="input-air"
          onChange={(e) => setLength(e.target.value)}
        />

        <label htmlFor="room-type">ประเภทห้อง: </label>
        <select
          id="room-type"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          className="select-air"
        >
          <option value="750">1. ห้องนอนปกติ - ไม่โดนแดดโดยตรง</option>
          <option value="800">2. ห้องนอนปกติ - โดนแดดมาก</option>
          <option value="850">3.ห้องทำงาน - ไม่โดนแดดโดยตรง</option>
          <option value="900">4.ห้องทำงาน - โดนแดดมาก</option>
          <option value="950">5.ร้านอาหาร/ร้านค้า - ไม่โดนแดด</option>
          <option value="1000">6.ร้านอาหาร/ร้านค้า - โดนแดดมาก</option>
          <option value="1100">7.ห้องประชุม</option>
          <option value="1200">8.ห้องประชุมขนาดใหญ่เพดานสูง</option>
          <option value="1300">9.สนามเปิด/พื้นที่เปิด</option>
        </select>
        <br />
        <br />

        <div id="ac-container">
          <label htmlFor="ac-type">เลือกชนิดแอร์:</label>
          <div className="ac-selection">
            <select className="ac-type select-air">
              {/* <option value="12000">1 ตัน (12,000 BTU)</option> */}
              <option value="60000">5 ตัน (60,000 BTU)</option>
              <option value="120000">10 ตัน (120,000 BTU)</option>
              <option value="240000">20 ตัน (240,000 BTU)</option>
            </select>
            <div className="quantity-container">
              <input
                type="number"
                className="ac-quantity"
                min="1"
                placeholder="จำนวน"
              />
            </div>
            <button id="add-ac" onClick={handleAddAC}>
              เพิ่มแอร์
            </button>
          </div>
        </div>
        <br />
        {/* <button id="calculateACCount" onClick={calculateBTUWithMinAC}>
          คำนวณจำนวนแอร์ที่ต้องใช้
        </button> */}
        <br />
        <button id="createGrid" className="my-2 mr-2" onClick={createGrid}>
          Create Grid
        </button>
        <button id="quickPlaceAC" onClick={handleQuickPlaceAc}>
          วางแอร์อย่างรวดเร็ว
        </button>

        <br />
        <br />

        <div id="btu-result">{btuResult}</div>
        <div id="ac-count-result">{acCountResult}</div>
        <div id="ac-usage-result">{acUsageResult}</div>
        <div
          id="grid"
          className="x"
          onClick={handleEraserGrid}
        ></div>
        <div className="toolbox">
          {/* <div id="acBox" className="box ac" draggable="true">
            AC
          </div> */}
          <div id="obsBox" className="box obstacle" draggable="true">
            OBS
          </div>
          <div id="obs2Box" className="box obstacle2" draggable="true">
            OBS2
          </div>
          {/* <div id="onetonBox" className="box oneton" draggable="true">
            1 Ton
          </div> */}
          <div id="fivetonBox" className="box fiveton" draggable="true">
            5 Ton
          </div>
          <div id="tentonBox" className="box tenton" draggable="true">
            10 Ton
          </div>
          <div id="twentytonBox" className="box twentyton" draggable="true">
            20 Ton
          </div>
          <div className="drag-mode-container">
            <input
              type="checkbox"
              id="dragModeToggle"
              onChange={handleDraggingMode}
              className="input-air"
            />
            <label htmlFor="dragModeToggle">เปิดใช้งานการคลิกค้าง</label>
          </div>
          <div
            className="eraser-button"
            id="eraserButton"
            onClick={handleEraserButton}
          >
            Eraser
          </div>
        </div>
      </div>
    </>
  );
};

export default Areacal;
