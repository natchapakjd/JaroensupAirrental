import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";

const Service = () => {
  const [taskTypes, setTaskTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskTypes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/tasktypes`
        );
        setTaskTypes(response.data);
      } catch (error) {
        console.error("Error fetching task types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskTypes();
  }, []);

  const filteredTaskTypes = taskTypes.filter(
    (taskType) =>
      taskType.type_name === "งานเช่าเครื่องปรับอากาศ" ||
      taskType.type_name === "จำหน่ายสินค้า"
  );

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex flex-col font-prompt">
        <div className="container mx-auto p-6">
          <h1 className="text-4xl font-bold text-center mb-6">บริการของเรา</h1>
          {loading ? (
            <p className="text-center">Loading task types...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTaskTypes.length > 0 ? (
                filteredTaskTypes.map((taskType) => (
                  <div
                    key={taskType.task_type_id}
                    className="bg-white shadow-lg rounded-lg overflow-hidden"
                  >
                    <img
                      src={
                        taskType.image_url ||
                        "https://inwfile.com/s-ck/woh7eq.jpg"
                      }
                      alt={taskType.type_name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        {taskType.type_name}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {taskType.description}
                      </p>
                      <div className="flex justify-end">
                        <Link
                          to={
                            taskType.type_name === "จำหน่ายสินค้า"
                              ? "/product"
                              : `/service/rental/${taskType.task_type_id}`
                          }
                          className="bg-blue text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                        >
                          ดูรายละเอียดเพิ่มเติม
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">ไม่มีบริการให้เช่าหรือซื้อสินค้า</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Service;
