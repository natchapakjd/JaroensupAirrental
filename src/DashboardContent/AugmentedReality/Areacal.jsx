import React, { useState } from "react";
import "./Areacal.css";
import "./script.js"
const Areacal = () => {
  const [width, setWidth] = useState(0);
  const [length, setLength] = useState(0);
  const [roomType, setRoomType] = useState(750);
  const [acSelections, setAcSelections] = useState([]);
  const [btuResult, setBtuResult] = useState(0);

  const calculateBTU = () => {
    const area = width * length;
    const requiredBTU = area * roomType;
    setBtuResult(requiredBTU);
  };

  const addAcSelection = () => {
    setAcSelections([
      ...acSelections,
      { type: 12000, quantity: 1 }, // Default AC selection
    ]);
  };

  const updateAcSelection = (index, field, value) => {
    const updatedSelections = [...acSelections];
    updatedSelections[index][field] = value;
    setAcSelections(updatedSelections);
  };

  return (
    <div className="areacal-container">
      <div className="input-container">
        <label htmlFor="width">Width (m):</label>
        <input
          type="number"
          id="width"
          min="1"
          placeholder="Enter width"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />

        <label htmlFor="length">Length (m):</label>
        <input
          type="number"
          id="length"
          min="1"
          placeholder="Enter length"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
        />

        <label htmlFor="room-type">ประเภทห้อง:</label>
        <select
          id="room-type"
          value={roomType}
          onChange={(e) => setRoomType(Number(e.target.value))}
        >
          <option value="750">1.ห้องนอนปกติ - ไม่โดนแดดโดยตรง</option>
          <option value="800">2.ห้องนอนปกติ - โดนแดดมาก</option>
          <option value="850">3.ห้องทำงาน - ไม่โดนแดดโดยตรง</option>
          <option value="900">4.ห้องทำงาน - โดนแดดมาก</option>
          <option value="950">5.ร้านอาหาร/ร้านค้า - ไม่โดนแดด</option>
          <option value="1000">6.ร้านอาหาร/ร้านค้า - โดนแดดมาก</option>
          <option value="1100">7.ห้องประชุม</option>
          <option value="1200">8.ห้องประชุมขนาดใหญ่เพดานสูง</option>
          <option value="1300">9.สนามเปิด/พื้นที่เปิด</option>
        </select>

        <div id="ac-container">
          <label htmlFor="ac-type">เลือกชนิดแอร์:</label>
          {acSelections.map((ac, index) => (
            <div className="ac-selection" key={index}>
              <select
                className="ac-type"
                value={ac.type}
                onChange={(e) =>
                  updateAcSelection(index, "type", Number(e.target.value))
                }
              >
                <option value="12000">1 ตัน (12,000 BTU)</option>
                <option value="60000">5 ตัน (60,000 BTU)</option>
                <option value="120000">10 ตัน (120,000 BTU)</option>
                <option value="240000">20 ตัน (240,000 BTU)</option>
              </select>
              <input
                type="number"
                className="ac-quantity"
                min="1"
                value={ac.quantity}
                onChange={(e) =>
                  updateAcSelection(index, "quantity", Number(e.target.value))
                }
              />
            </div>
          ))}
          <button onClick={addAcSelection}>เพิ่มแอร์</button>
        </div>

        <button id="createGrid" onClick={calculateBTU}>
          คำนวณ BTU
        </button>
      </div>

      <div id="btu-result">ผล BTU ที่ต้องการ: {btuResult} BTU</div>

      <div id="grid" className="grid">
        {/* Grid layout and draggable elements will go here */}
      </div>

      <div className="toolbox">
        <div id="acBox" className="box ac" draggable="true">
          AC
        </div>
        <div id="obsBox" className="box obstacle" draggable="true">
          OBS
        </div>
        <div id="onetonBox" className="box oneton" draggable="true">
          1 Ton
        </div>
        <div id="fivetonBox" className="box fiveton" draggable="true">
          5 Ton
        </div>
        <div id="tentonBox" className="box tenton" draggable="true">
          10 Ton
        </div>
        <div id="twentytonBox" className="box twentyton" draggable="true">
          20 Ton
        </div>
      </div>
        <script src="script.js"></script>

    </div>
  );
};

export default Areacal;
