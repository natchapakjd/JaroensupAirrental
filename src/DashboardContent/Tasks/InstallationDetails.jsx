import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";

// กำหนดการแปลภาษา
const translation =
  localStorage.getItem("language") === "en"
    ? {
        title: "Air Conditioner Installation Summary (Room: {room})",
        grid_title: "Installation Simulation (Size: {width}m x {height}m)",
        ac_5ton: "5-Ton AC",
        ac_10ton: "10-Ton AC",
        ac_20ton: "20-Ton AC",
        obstacle1: "Obstacle 1",
        obstacle2: "Obstacle 2",
        type: "Type",
        position: "Position (Row, Column)",
        meters: "Meters",
        direction: "Direction",
        summary_title: "AC Quantity Summary",
        ac_5ton_count: "5-Ton AC: {count} units",
        ac_10ton_count: "10-Ton AC: {count} units",
        ac_20ton_count: "20-Ton AC: {count} units",
        loading: "Loading data...",
        error: "Error: {message}",
        east: "East",
        south: "South",
        west: "West",
        north: "North",
        unknown: "Unknown",
        type_position: "Type And Position",

      }
    : {
        title: "แผนผังตำแหน่งการติดตั้งเครื่องปรับอากาศ (ห้อง: {room})",
        grid_title: "ภาพจำลองการติดตั้ง (ขนาด: {width}m x {height}m)",
        ac_5ton: "แอร์ 5 ตัน",
        ac_10ton: "แอร์ 10 ตัน",
        ac_20ton: "แอร์ 20 ตัน",
        obstacle1: "สิ่งกีดขวาง 1 (ความเย็นสามารถผ่านได้)",
        obstacle2: "สิ่งกีดขวาง 2 (ความเย็นไม่สามารถผ่านได้)",
        type: "ประเภท",
        type_position: "ประเภทและตำแหน่งการวาง",
        position: "ตำแหน่ง (แถว, คอลัมน์)",
        meters: "หน่วย (เมตร)",
        direction: "ทิศที่หัน",
        summary_title: "สรุปจำนวนแอร์",
        ac_5ton_count: "แอร์ 5 ตัน: {count} ตัว",
        ac_10ton_count: "แอร์ 10 ตัน: {count} ตัว",
        ac_20ton_count: "แอร์ 20 ตัน: {count} ตัว",
        loading: "กำลังโหลดข้อมูล...",
        error: "เกิดข้อผิดพลาด: {message}",
        east: "ตะวันออก",
        south: "ใต้",
        west: "ตะวันตก",
        north: "เหนือ",
        unknown: "ไม่ระบุ",
      };

const InstallationDetails = () => {
  const { taskId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/area_cal/by-task/${taskId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch area calculation data");
        }
        const result = await response.json();
        if (result.length === 0) {
          throw new Error("No data found for this task ID");
        }
        const normalizedData = {
          ...result[0],
          grid_pattern: result[0].grid_pattern.map((item) => ({
            ...item,
            type: normalizeType(item.type),
          })),
        };
        setData(normalizedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (taskId) {
      fetchData();
    }
  }, [taskId, API_URL]);

  const normalizeType = (type) => {
    switch (type) {
      case "fiveton":
        return "60000";
      case "tenton":
        return "120000";
      case "twentyton":
        return "240000";
      case "60000":
      case "120000":
      case "240000":
      case "obstacle":
      case "obstacle2":
        return type;
      default:
        return "unknown";
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "20px",
          fontFamily: "Prompt, sans-serif",
          textAlign: "center",
        }}
      >
        {translation.loading}
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "20px",
          color: "red",
          fontFamily: "Prompt, sans-serif",
          textAlign: "center",
        }}
      >
        {translation.error.replace("{message}", error)}
      </div>
    );
  }

  const airConditioners = data.grid_pattern || [];
  const gridWidth = data.width || 30;
  const gridHeight = data.height || 30;
  const gridSize = Math.max(gridWidth, gridHeight);

  const typeCounts = {
    60000: data.air_5ton_used || 0,
    120000: data.air_10ton_used || 0,
    240000: data.air_20ton_used || 0,
  };

  const filteredAirConditioners = airConditioners.filter(
    (ac) => ac.type !== "obstacle" && ac.type !== "obstacle2"
  );

  const renderGrid = () => {
    const grid = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => null)
    );

    airConditioners.forEach((item) => {
      if (item.row < gridSize && item.col < gridSize) {
        grid[item.row][item.col] = item;
      }
    });

    return (
      <div
        style={{
          display: "inline-block",
          border: "2px solid #e0e0e0",
          borderRadius: "8px",
          padding: "10px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex" }}>
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="grid-cell"
                style={{
                  width: "28px",
                  height: "28px",
                  border: "1px solid #ddd",
                  backgroundColor: cell ? getColor(cell.type) : "#f5f5f5",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  color: "white",
                  position: "relative",
                  fontFamily: "Prompt, sans-serif",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {cell &&
                  cell.type !== "obstacle" &&
                  cell.type !== "obstacle2" && (
                    <span
                      style={{
                        fontSize: "10px",
                        lineHeight: "10px",
                        transform: `rotate(${getArrowRotation(
                          cell.rotation
                        )}deg)`,
                        marginBottom: "2px",
                      }}
                    >
                      ➡️
                    </span>
                  )}
                {cell ? getLabel(cell.type) : ""}
                {cell && (
                  <span className="tooltip">
                    {`${translation.type}: ${getDisplayType(cell.type)}\n${
                      translation.position
                    }: (${cell.row}m, ${cell.col}m)\n${
                      cell.type !== "obstacle" && cell.type !== "obstacle2"
                        ? `${translation.direction}: ${getDirection(
                            cell.rotation
                          )}`
                        : ""
                    }`}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const getColor = (type) => {
    switch (type) {
      case "60000":
        return "#ff9800";
      case "120000":
        return "#388e3c";
      case "240000":
        return "#2196f3";
      case "obstacle":
        return "#495057";
      case "obstacle2":
        return "#ff7043";
      default:
        return "#f5f5f5";
    }
  };

  const getLabel = (type) => {
    switch (type) {
      case "60000":
        return "5T";
      case "120000":
        return "10T";
      case "240000":
        return "20T";
      case "obstacle":
        return "O1";
      case "obstacle2":
        return "O2";
      default:
        return "";
    }
  };

  const getDisplayType = (type) => {
    switch (type) {
      case "60000":
        return translation.ac_5ton;
      case "120000":
        return translation.ac_10ton;
      case "240000":
        return translation.ac_20ton;
      case "obstacle":
        return translation.obstacle1;
      case "obstacle2":
        return translation.obstacle2;
      default:
        return translation.unknown;
    }
  };

  const getDirection = (rotation) => {
    switch (rotation) {
      case 0:
        return translation.east;
      case 90:
        return translation.south;
      case 180:
        return translation.west;
      case 270:
        return translation.north;
      default:
        return translation.unknown;
    }
  };

  const getArrowRotation = (rotation) => {
    switch (rotation) {
      case 0:
        return 0;
      case 90:
        return 90;
      case 180:
        return 180;
      case 270:
        return 270;
      default:
        return 0;
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Prompt, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>
        {`
          .grid-cell {
            position: relative;
          }
          .grid-cell .tooltip {
            visibility: hidden;
            background-color: #1f2937;
            color: white;
            text-align: left;
            border-radius: 6px;
            padding: 10px;
            position: absolute;
            z-index: 10;
            bottom: 120%;
            left: 50%;
            transform: translateX(-50%);
            white-space: pre-line;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s;
            font-family: Prompt, sans-serif;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          .grid-cell:hover .tooltip {
            visibility: visible;
            opacity: 1;
          }
          table {
            width: 100%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            background-color: #fff;
            border-radius: 8px;
            overflow: hidden;
          }
          th, td {
            padding: 12px;
            text-align: center;
            border: 1px solid #e0e0e0;
          }
          th {
            background-color: #f1f5f9;
            font-weight: 600;
          }
          .summary-card {
            background-color: #fff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 20px;
          }
          .summary-item {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 16px;
          }
          .legend {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            padding: 15px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
        `}
      </style>
      <BackButton />
      <div className="flex  w-full my-2">
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "600" }}>
          {translation.title.replace("{room}", data.room_type_name)}
        </h2>{" "}
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h3
          style={{ fontSize: "20px", fontWeight: "500", marginBottom: "15px" }}
        >
          {translation.grid_title
            .replace("{width}", data.width)
            .replace("{height}", data.height)}
        </h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {renderGrid()}
        </div>
        <div className="legend" style={{ marginTop: "15px" }}>
          <p>
            <span style={{ color: "#ff9800", marginRight: "5px" }}>■</span>{" "}
            {translation.ac_5ton}
          </p>
          <p>
            <span style={{ color: "#388e3c", marginRight: "5px" }}>■</span>{" "}
            {translation.ac_10ton}
          </p>
          <p>
            <span style={{ color: "#2196f3", marginRight: "5px" }}>■</span>{" "}
            {translation.ac_20ton}
          </p>
          <p>
            <span style={{ color: "#495057", marginRight: "5px" }}>■</span>{" "}
            {translation.obstacle1}
          </p>
          <p>
            <span style={{ color: "#ff7043", marginRight: "5px" }}>■</span>{" "}
            {translation.obstacle2}
          </p>
        </div>
      </div>
      <div style={{ marginBottom: "30px" }}>
        <h3
          style={{ fontSize: "20px", fontWeight: "500", marginBottom: "15px" }}
        >
          {translation.type}
        </h3>
        <table>
          <thead>
            <tr>
              <th style={{ fontFamily: "Prompt, sans-serif" }}>
                {translation.type}
              </th>
              {/* <th style={{ fontFamily: "Prompt, sans-serif" }}>
                {translation.position}
              </th> */}
              <th style={{ fontFamily: "Prompt, sans-serif" }}>
                {translation.meters}
              </th>
              <th style={{ fontFamily: "Prompt, sans-serif" }}>
                {translation.direction}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAirConditioners.map((ac) => (
              <tr key={ac.id}>
                <td style={{ fontFamily: "Prompt, sans-serif" }}>
                  {getDisplayType(ac.type)}
                </td>
                {/* <td style={{ fontFamily: "Prompt, sans-serif" }}>
                  ({ac.row}, {ac.col})
                </td> */}
                <td style={{ fontFamily: "Prompt, sans-serif" }}>
                  ({ac.row}m, {ac.col}m)
                </td>
                <td style={{ fontFamily: "Prompt, sans-serif" }}>
                  {getDirection(ac.rotation)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3
          style={{ fontSize: "20px", fontWeight: "500", marginBottom: "15px" }}
        >
          {translation.summary_title}
        </h3>
        <div className="summary-card">
          <div className="summary-item">
            <span
              style={{ color: "#ff9800", fontSize: "20px", marginRight: "8px" }}
            >
              ■
            </span>
            {translation.ac_5ton_count.replace("{count}", typeCounts["60000"])}
          </div>
          <div className="summary-item">
            <span
              style={{ color: "#388e3c", fontSize: "20px", marginRight: "8px" }}
            >
              ■
            </span>
            {translation.ac_10ton_count.replace(
              "{count}",
              typeCounts["120000"]
            )}
          </div>
          <div className="summary-item">
            <span
              style={{ color: "#2196f3", fontSize: "20px", marginRight: "8px" }}
            >
              ■
            </span>
            {translation.ac_20ton_count.replace(
              "{count}",
              typeCounts["240000"]
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallationDetails;
