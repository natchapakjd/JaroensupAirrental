import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  AreaChart,
  ScatterChart,
  Area,
  ZAxis,
  Scatter
} from "recharts";
import { CSVLink } from "react-csv";

const data = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
];

const data01 = [
  { x: 10, y: 2000, z: 100 },
  { x: 20, y: 3000, z: 120 },
  { x: 30, y: 4000, z: 130 },
  { x: 40, y: 5000, z: 140 },
  { x: 50, y: 6000, z: 150 },
  { x: 60, y: 7000, z: 160 },
  { x: 70, y: 8000, z: 170 },
];

const data02 = [
  { x: 15, y: 2500, z: 110 },
  { x: 25, y: 3500, z: 130 },
  { x: 35, y: 4500, z: 140 },
  { x: 45, y: 5500, z: 150 },
  { x: 55, y: 6500, z: 160 },
  { x: 65, y: 7500, z: 170 },
  { x: 75, y: 8500, z: 180 },
];

const ReportContent = () => {
  // Combine all data into one array for CSV export

  const [taskCounts, setTaskCounts] = useState([]);

  const api_url = import.meta.env.VITE_SERVER_URL;
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const tasksResponse = await axios.get(`${api_url}/api/counts`);
    

        setTaskCounts(tasksResponse.data);
        console.log(tasksResponse.data)
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, [api_url]);

    
  const combinedData = [...data, ...data01.map((d, i) => ({ ...d, type: "A school" })), ...data02.map((d, i) => ({ ...d, type: "B school" }))];

  return (
    <div className="p-6 space-y-6 font-inter">
        <div className="flex justify-end">
        <CSVLink
          data={combinedData}
          filename={"report-data.csv"}
          className="btn btn-success hover:btn-success text-white hover:text-white"
          target="_blank"
        >
          Export to CSV
        </CSVLink>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Bar Chart</h2>
        <BarChart width={730} height={250} data={taskCounts} className="mx-auto">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="task_count" fill="#8884d8" />
          <Bar dataKey="order_count" fill="#82ca9d" />
          <Bar dataKey="payment_count" fill="#ff7300" />
          </BarChart>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Area Chart</h2>
        <AreaChart
          width={730}
          height={250}
          data={taskCounts}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          className="mx-auto"
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ff7300" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="task_count"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          <Area
            type="monotone"
            dataKey="order_count"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorPv)"
          />
          <Area
            type="monotone"
            dataKey="payment_count"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorAv)"
          />
        </AreaChart>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Scatter Chart</h2>
        <ScatterChart
          width={730}
          height={250}
          margin={{
            top: 20,
            right: 20,
            bottom: 10,
            left: 10,
          }}
          className="mx-auto"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" type="number" name="stature" unit="cm" />
          <YAxis dataKey="y" type="number" name="weight" unit="kg" />
          <ZAxis
            dataKey="z"
            type="number"
            range={[64, 144]}
            name="score"
            unit="km"
          />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Legend />
          <Scatter name="A school" data={data01} fill="#8884d8" />
          <Scatter name="B school" data={data02} fill="#82ca9d" />
        </ScatterChart>
      </div>

      
    </div>
  );
};

export default ReportContent;
