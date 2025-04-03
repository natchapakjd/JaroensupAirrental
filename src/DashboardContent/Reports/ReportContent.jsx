import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { CSVLink } from "react-csv";
import Loading from "../../components/Loading"; // ใช้คอมโพเนนต์ Loading ที่มีอยู่

const ReportContent = () => {
  const [taskCounts, setTaskCounts] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [userCounts, setUserCounts] = useState({
    technicians: 0,
    customers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api_url = import.meta.env.VITE_SERVER_URL;
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "th"
  );

  const csvHeaders = [
    { label: "เดือน", key: "month" },
    { label: "จำนวนงานทั้งหมด(งาน)", key: "task_count" },
    { label: "จำนวนคำสั่งซื้อทั้งหมด(ออเดอร์)", key: "order_count" },
    { label: "จำนวนการชำระเงินทั้งหมด(บาท)", key: "payment_count" },
    { label: "รายได้รวม(บาท)", key: "income" },
  ];

  const monthNamesTH = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const translations = {
    th: {
      reportTitle: "แดชบอร์ดสรุปผล",
      exportCsvButton: "ส่งออกเป็น CSV",
      summaryTitle: "สรุปข้อมูล",
      totalTasks: "จำนวนงานทั้งหมด",
      totalOrders: "จำนวนคำสั่งซื้อทั้งหมด",
      totalPayments: "จำนวนการชำระเงินทั้งหมด",
      totalIncome: "รายได้รวม",
      totalUsers: "จำนวนผู้ใช้งานทั้งหมด",
      totalTechnicians: "จำนวนช่างทั้งหมด",
      taskOrderPaymentCounts: "จำนวนงาน, คำสั่งซื้อ, และการชำระเงินตามเดือน",
      monthlyIncome: "รายได้ประจำเดือน",
      userCounts: "จำนวนผู้ใช้งาน",
    },
    en: {
      reportTitle: "Report Dashboard",
      exportCsvButton: "Export to CSV",
      summaryTitle: "Summary",
      totalTasks: "Total Tasks",
      totalOrders: "Total Orders",
      totalPayments: "Total Payments",
      totalIncome: "Total Income",
      totalUsers: "Total Users",
      totalTechnicians: "Total Technicians",
      taskOrderPaymentCounts: "Task, Order, and Payment Counts by Month",
      monthlyIncome: "Monthly Income",
      userCounts: "User Counts",
    },
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get(`${api_url}/api/counts`);
        const formattedData = response.data.monthlyData.map(item => ({
          ...item,
          month: monthNamesTH[item.month - 1],
        }));
        setTaskCounts(formattedData);
        setIncomeData(formattedData);
        setUserCounts(response.data.userCounts);
      } catch (error) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [api_url]);
  if (loading) return <Loading />;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="p-6 space-y-6 font-prompt bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {translations[language].reportTitle}
        </h1>
        <CSVLink
  data={[
    ["ห้างร้านเจริญทรัพย์"], 
    ["รายงานสรุปผลในปี 2568"],
    csvHeaders.map(header => header.label), // ใช้ labels ของ headers
    ...taskCounts.map(item => csvHeaders.map(header => item[header.key])) // ดึงค่าตาม headers
  ]}
  filename={"report-data.csv"}
  className="btn btn-success text-white px-4 py-2 rounded-lg shadow-md font-prompt"
  target="_blank"
>
  {translations[language].exportCsvButton}
</CSVLink>

      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {translations[language].summaryTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>{translations[language].totalTasks}:</strong>{" "}
              {taskCounts.reduce((sum, item) => sum + item.task_count, 0)}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>{translations[language].totalOrders}:</strong>{" "}
              {taskCounts.reduce((sum, item) => sum + item.order_count, 0)}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>{translations[language].totalPayments}:</strong>{" "}
              {taskCounts.reduce((sum, item) => sum + item.payment_count, 0)}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>{translations[language].totalIncome}:</strong>{" "}
              {taskCounts
                .reduce((sum, item) => sum + item.income, 0)
                .toLocaleString()}{" "}
              บาท
            </p>
          </div>

          {/* User and Technician Counts */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>{translations[language].totalUsers}:</strong>{" "}
              {userCounts.customers}
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>{translations[language].totalTechnicians}:</strong>{" "}
              {userCounts.technicians}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {translations[language].taskOrderPaymentCounts}
        </h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={taskCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="task_count" fill="#8884d8" name="Task Count" />
              <Bar dataKey="order_count" fill="#82ca9d" name="Order Count" />
              <Bar
                dataKey="payment_count"
                fill="#82cacd"
                name="Payment Count"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {translations[language].monthlyIncome}
        </h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={incomeData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {translations[language].userCounts}
        </h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: "Technicians", count: userCounts.technicians },
                { name: "Customers", count: userCounts.customers },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="count"
                fill="#82ca9d"
                name="User Counts"
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportContent;
