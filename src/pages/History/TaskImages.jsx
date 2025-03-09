import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import BackButtonEdit from "../../components/BackButtonEdit";
const MySwal = withReactContent(Swal);

const TaskImages = () => {
  const { taskId } = useParams(); // รับ task_id จาก URL
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState(null); // เก็บไฟล์จริงที่ผู้ใช้อัปโหลด
  const apiUrl = import.meta.env.VITE_SERVER_URL;
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    fetchImages();
  }, [taskId]);

  // 📌 โหลดรูปภาพจากเซิร์ฟเวอร์
  const fetchImages = async () => {
    try {
      const res = await axios.get(`${apiUrl}/task_images/${taskId}`);
      setImages(res.data);
    } catch (error) {
      console.error("Error fetching images:", error);
      MySwal.fire("Error", "Failed to load images.", "error");
    }
  };

  // 📌 อัปโหลดรูปใหม่ (POST)
  const handleAddImage = async () => {
    if (!newImage)
      return MySwal.fire("Warning", "Please select an image.", "warning");

    const formData = new FormData();
    formData.append("task_id", taskId);
    formData.append("image", newImage);

    try {
      await axios.post(`${apiUrl}/task_images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      MySwal.fire("Success", "Image uploaded successfully!", "success");
      setNewImage(null);
      fetchImages(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Error adding image:", error);
      MySwal.fire("Error", "Failed to upload image.", "error");
    }
  };

  // ✏️ แก้ไข URL รูปภาพ (PUT)
  const handleEditImage = async (imageId, oldUrl) => {
    const { value: newUrl } = await MySwal.fire({
      title: "Edit Image URL",
      input: "text",
      inputValue: oldUrl,
      showCancelButton: true,
      confirmButtonText: "Update",
    });

    if (newUrl) {
      try {
        await axios.put(`${apiUrl}/task_images/${imageId}`, {
          task_id: taskId,
          image_url: newUrl,
        });
        MySwal.fire("Success", "Image updated successfully!", "success");
        fetchImages();
      } catch (error) {
        console.error("Error updating image:", error);
        MySwal.fire("Error", "Failed to update image.", "error");
      }
    }
  };

  // 🗑️ ลบรูปภาพ (DELETE)
  const handleDeleteImage = async (imageId) => {
    const confirm = await MySwal.fire({
      title: "Are you sure?",
      text: "This image will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${apiUrl}/task_images/${imageId}`);
        MySwal.fire("Deleted!", "Image has been removed.", "success");
        fetchImages();
      } catch (error) {
        console.error("Error deleting image:", error);
        MySwal.fire("Error", "Failed to delete image.", "error");
      }
    }
  };

    const showImagePopup = (imageUrl) => {
      MySwal.fire({
        imageUrl: imageUrl,
        imageAlt: "Task Image",
        showCloseButton: true,
        showConfirmButton: false,
        customClass: {
          popup: "rounded-lg shadow-lg",
        },
      });
    };
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}
      <div className="container mx-2 my-10 font-prompt md:mx-auto ">
        <div className="p-8 w-full mx-auto">
            <div className="flex  w-full my-2">
                <BackButtonEdit/>
                <h1 className="text-2xl font-semibold mx-2">Task Images</h1>
            </div>

          {/* 📌 อัปโหลดรูป */}
          <div className="mb-6 flex gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImage(e.target.files[0])}
              className="file-input file-input-bordered w-full h-10"
              />
            <button
              onClick={handleAddImage}
              className="bg-blue text-white px-4 py-2 rounded hover:bg-blue"
            >
              Upload
            </button>
          </div>

          {/* 🖼️ แสดงรูปภาพเดิม */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group" >
                <img
                  src={image.image_url}
                  alt="Task Image"
                  className="w-full h-40 object-cover rounded shadow-lg"
                />

                {/* 🛠 ปุ่มแก้ไข & ลบ */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center gap-2">
                  <button
                    onClick={() =>
                      handleEditImage(image.id, image.image_url)
                    }
                    className="btn btn-success text-white px-3 py-1 rounded hover:btn-success hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="btn btn-error text-white px-3 py-1 rounded hover:error  hover:text-white "
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {!isDashboard && <Footer />}
    </>
  );
};

export default TaskImages;
