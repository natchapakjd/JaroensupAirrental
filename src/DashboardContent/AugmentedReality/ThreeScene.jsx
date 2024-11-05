

import React, { useState ,useEffect} from "react";

const ThreeScence = () => {
  const [width, setWidth] = useState(8);
  const [height, setHeight] = useState(6);
  const [roomType, setRoomType] = useState(750);
  const [grid, setGrid] = useState([]);
  const [result, setResult] = useState("");

  useEffect(() => {
    calculateBTU();
  }, [width, height, roomType]); 

  const calculateBTU = () => {
    const area = width * height;
    const BTU = area * roomType;
    const numAC = Math.ceil(BTU / 12000);

    setResult(`จำนวนแอร์ที่ต้องใช้: ${numAC} ตัว (BTU ที่ต้องใช้: ${BTU} BTU)`);

    const cells = Array.from({ length: width * height }, (_, i) => ({
      id: i,
      hasAC: false,
      isCoolingArea: false,
    }));
    setGrid(cells);
  };

  const allowDrop = (ev) => ev.preventDefault();

  const drag = (ev) => {
    ev.dataTransfer.setData("text", ev.target.id);
  };

  const drop = (ev, cellIndex) => {
    ev.preventDefault();
    const newGrid = [...grid];
    if (!newGrid[cellIndex].hasAC) {
      newGrid[cellIndex].hasAC = true;
      createCoolingArea(cellIndex, newGrid);
    }
    setGrid(newGrid);
  };

  const createCoolingArea = (index, gridCopy) => {
    const coolingAreaSize = 20;
    const gridWidth = width;
    const startRow = Math.floor(index / gridWidth);
    const startCol = index % gridWidth;

    for (let i = 0; i < coolingAreaSize; i++) {
      const coolingCellIndex =
        (startRow + Math.floor(i / gridWidth)) * gridWidth + (startCol + (i % gridWidth));
      if (gridCopy[coolingCellIndex]) gridCopy[coolingCellIndex].isCoolingArea = true;
    }
  };

  const removeAC = (cellIndex) => {
    const newGrid = [...grid];
    newGrid[cellIndex].hasAC = false;
    removeCoolingArea(cellIndex, newGrid);
    setGrid(newGrid);
  };

  const removeCoolingArea = (index, gridCopy) => {
    const coolingAreaSize = 20;
    const gridWidth = width;
    const startRow = Math.floor(index / gridWidth);
    const startCol = index % gridWidth;

    for (let i = 0; i < coolingAreaSize; i++) {
      const coolingCellIndex =
        (startRow + Math.floor(i / gridWidth)) * gridWidth + (startCol + (i % gridWidth));
      if (gridCopy[coolingCellIndex]) gridCopy[coolingCellIndex].isCoolingArea = false;
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">ระบบประเมินพื้นที่และ BTU</h1>

      <div className="mt-4">
        <label className="block">
          ความกว้าง (เมตร):{" "}
          <input
            type="number"
            className="border rounded p-1 w-20"
            min="1"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value))}
          />
        </label>
      </div>

      <div className="mt-2">
        <label className="block">
          ความยาว (เมตร):{" "}
          <input
            type="number"
            className="border rounded p-1 w-20"
            min="1"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value))}
          />
        </label>
      </div>

      <div className="mt-2">
        <label className="block">
          ประเภทห้อง:{" "}
          <select
            className="border rounded p-1"
            value={roomType}
            onChange={(e) => setRoomType(parseFloat(e.target.value))}
          >
            <option value="750">ห้องนอนปกติ - ไม่โดนแดดโดยตรง</option>
            <option value="800">ห้องนอนปกติ - โดนแดดมาก</option>
            <option value="850">ห้องทำงาน - ไม่โดนแดดโดยตรง</option>
            <option value="900">ห้องทำงาน - โดนแดดมาก</option>
            <option value="950">ร้านอาหาร/ร้านค้า - ไม่โดนแดด</option>
            <option value="1000">ร้านอาหาร/ร้านค้า - โดนแดดมาก</option>
            <option value="1100">ห้องประชุม/ร้านอาหารที่มีหม้อหรือเตาความร้อน</option>
          </select>
        </label>
      </div>

      <button onClick={calculateBTU} className="mt-4 px-4 py-2 bg-blue text-white rounded">
        คำนวณจำนวนแอร์และแสดงพื้นที่
      </button>

      <p className="mt-4 text-lg">{result}</p>

      <div
        id="grid-container"
        className="grid mt-4 gap-1"
        style={{
          gridTemplateColumns: `repeat(${width}, 30px)`,
          gridTemplateRows: `repeat(${height}, 30px)`,
        }}
      >
        {grid.map((cell, index) => (
          <div
            key={cell.id}
            className={`w-8 h-8 border ${
              cell.isCoolingArea ? "bg-blue-200" : "bg-green-200"
            } relative`}
            onDrop={(e) => drop(e, index)}
            onDragOver={allowDrop}
          >
            {cell.hasAC && (
              <>
                <div className="w-8 h-8 bg-orange-400 border-2 border-black">AC</div>
                <button
                  className="absolute bottom-0 right-0 w-6 h-4 bg-red-500 text-white text-xs rounded"
                  onClick={() => removeAC(index)}
                >
                  ลบ
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <h3 className="mt-6 text-xl font-bold">เครื่องปรับอากาศ</h3>
      <div
        id="ac-template"
        className="w-8 h-8 bg-orange-500 border-2 border-black rounded-md cursor-grab hover:bg-orange-600 hover:shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center"
        draggable="true"
        onDragStart={drag}
        onDragEnd={(e) => e.currentTarget.classList.remove("cursor-grabbing")}
        onMouseDown={(e) => e.currentTarget.classList.add("cursor-grabbing")}
      >
      <span className="text-xs font-bold text-black">AC</span>
    </div>

    </div>
  );
};

export default ThreeScence;
