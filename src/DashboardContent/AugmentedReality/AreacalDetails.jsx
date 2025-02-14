import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const AreacalDetails = () => {
  const { area_calculation_id } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/area_images/${area_calculation_id}`
      );
      setImages(response.data);
    } catch (err) {
      setError("ไม่สามารถโหลดรูปภาพได้");
    } finally {
      setLoading(false);
    }
  };

  const uploadImagePopup = () => {
    Swal.fire({
      title: "อัปโหลดรูปภาพ",
      html: `
        <input type="file" id="imageInput" class="swal2-file" accept="image/*" />
        <br/>
        <img id="previewImage" src="" style="display:none; max-width: 100%; border-radius: 8px; margin-top: 10px;" />
      `,
      showCancelButton: true,
      confirmButtonText: "อัปโหลด",
      cancelButtonText: "ยกเลิก",
      didOpen: () => {
        const imageInput = document.getElementById("imageInput");
        const previewImage = document.getElementById("previewImage");

        imageInput.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              previewImage.src = reader.result;
              previewImage.style.display = "block";
            };
            reader.readAsDataURL(file);
          }
        });
      },
      preConfirm: async () => {
        const fileInput = document.getElementById("imageInput").files[0];

        if (!fileInput) {
          Swal.showValidationMessage("กรุณาเลือกไฟล์ก่อนอัปโหลด!");
          return false;
        }

        const formData = new FormData();
        formData.append("image", fileInput);
        formData.append("area_calculation_id", area_calculation_id);

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/area_images`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          Swal.fire("อัปโหลดสำเร็จ!", "ภาพถูกอัปโหลดเรียบร้อย", "success");
          setImages([...images, response.data]);
        } catch (error) {
          Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถอัปโหลดรูปได้", "error");
        }
      },
    });
  };

  const deleteImage = async (id) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "รูปภาพนี้จะถูกลบถาวร!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${import.meta.env.VITE_SERVER_URL}/area_images/${id}`);
          Swal.fire("ลบสำเร็จ!", "รูปภาพถูกลบเรียบร้อย", "success");
          setImages(images.filter((img) => img.id !== id));
        } catch (error) {
          Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถลบรูปได้", "error");
        }
      }
    });
  };

  const updateImagePopup = (id) => {
    Swal.fire({
      title: "แก้ไขรูปภาพ",
      html: `
        <input type="file" id="updateImageInput" class="swal2-file" accept="image/*" />
        <br/>
        <img id="updatePreviewImage" src="" style="display:none; max-width: 100%; border-radius: 8px; margin-top: 10px;" />
      `,
      showCancelButton: true,
      confirmButtonText: "ยืนยันการแก้ไข",
      cancelButtonText: "ยกเลิก",
      didOpen: () => {
        const imageInput = document.getElementById("updateImageInput");
        const previewImage = document.getElementById("updatePreviewImage");

        imageInput.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              previewImage.src = reader.result;
              previewImage.style.display = "block";
            };
            reader.readAsDataURL(file);
          }
        });
      },
      preConfirm: async () => {
        const fileInput = document.getElementById("updateImageInput").files[0];

        if (!fileInput) {
          Swal.showValidationMessage("กรุณาเลือกไฟล์ใหม่!");
          return false;
        }

        const formData = new FormData();
        formData.append("image", fileInput);
        formData.append("area_calculation_id", area_calculation_id);

        try {
          await axios.delete(`${import.meta.env.VITE_SERVER_URL}/area_images/${id}`); // ลบรูปเก่า
          const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/area_images`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          Swal.fire("อัปเดตรูปสำเร็จ!", "รูปภาพถูกอัปเดตเรียบร้อย", "success");
          setImages(images.map((img) => (img.id === id ? response.data : img)));
        } catch (error) {
          Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถอัปเดตรูปได้", "error");
        }
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-prompt">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
         รูปภาพในแต่ละพื้นที่
      </h2>

      <div className="flex justify-end mb-6">
        <button
          onClick={uploadImagePopup}
          className="btn bg-blue text-white hover:bg-blue"
        >
           อัปโหลดรูปใหม่
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <p className="text-center text-red-500 text-lg">{error}</p>
      ) : images.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">ไม่มีรูปภาพสำหรับพื้นที่นี้</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative bg-white shadow-lg rounded-xl overflow-hidden transition-all transform hover:scale-105 cursor-pointer"
            >
              <img
                src={image.image_url}
                alt="Area"
                className="w-full h-52 object-cover"
              />
              <div className="p-4 bg-gray-50 flex flex-col items-center">
                <p className="text-sm text-gray-500 text-center">
                  📅 อัปโหลดเมื่อ: {new Date(image.uploaded_at).toLocaleDateString()}
                </p>
                <div className="flex gap-2"><button
                  onClick={() => deleteImage(image.id)}
                  className="btn bg-red-500 text-white hover:bg-red-600 mt-2"
                >
                  ลบรูป
                </button>
                <button
                  onClick={() => updateImagePopup(image.id)}
                  className="btn bg-success text-white hover:bg-success mt-2"
                >
                  แก้ไขรูป
                </button></div>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AreacalDetails;
