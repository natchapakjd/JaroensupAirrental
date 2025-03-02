import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const AreacalDetails = () => {
  const { area_calculation_id } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "th"
  );

  // Translation variables
  const translations = {
    areaImagesTitle: language === "th" ? "รูปภาพในแต่ละพื้นที่" : "Area Images",
    uploadNewImageButton:
      language === "th" ? "อัปโหลดรูปใหม่" : "Upload New Image",
    noImagesMessage:
      language === "th"
        ? "ไม่มีรูปภาพสำหรับพื้นที่นี้"
        : "No images available for this area",
    uploadedAt: language === "th" ? "อัปโหลดเมื่อ" : "Uploaded on",
    deleteImageButton: language === "th" ? "ลบรูป" : "Delete",
    updateImageButton: language === "th" ? "แก้ไขรูป" : "Update",
    uploadImageSuccess: language === "th" ? "อัปโหลดสำเร็จ!" : "Upload Image",
    uploadImageError:
      language === "th" ? "ไม่สามารถอัปโหลดรูปได้" : "Unable to upload image",
    deleteImageSuccess:
      language === "th" ? "ลบสำเร็จ!" : "Deleted successfully!",
    deleteImageError:
      language === "th" ? "ไม่สามารถลบรูปได้" : "Unable to delete image",
    updateImageSuccess: language === "th" ? "อัปเดตรูปสำเร็จ!" : "Update Image",
    updateImageError:
      language === "th" ? "ไม่สามารถอัปเดตรูปได้" : "Unable to update image",
    uploadImageTitle: language === "th" ? "อัปโหลดรูปภาพ" : "Upload Image",
    chooseFileMessage:
      language === "th"
        ? "กรุณาเลือกไฟล์ก่อนอัปโหลด!"
        : "Please select a file to upload!",
    confirmDeleteMessage:
      language === "th"
        ? "รูปภาพนี้จะถูกลบถาวร!"
        : "This image will be permanently deleted!",
    confirmDeleteTitle:
      language === "th" ? "คุณแน่ใจหรือไม่?" : "Are you sure?",
    confirmButtonText: language === "th" ? "ใช่, ลบเลย!" : "Yes, delete it!",
    cancelButtonText: language === "th" ? "ยกเลิก" : "Cancel",
  };

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
      setError(translations.uploadImageError);
    } finally {
      setLoading(false);
    }
  };

  const uploadImagePopup = () => {
    Swal.fire({
      title: translations.uploadImageTitle,
      html: `
        <input type="file" id="imageInput" class="file-input file-input-bordered w-full" accept="image/*" />
        <br/>
        <img id="previewImage" src="" style="display:none; max-width: 100%; border-radius: 8px; margin-top: 10px;" />
      `,
      showCancelButton: true,
      confirmButtonText: translations.uploadImageSuccess,
      cancelButtonText: translations.cancelButtonText,
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
          Swal.showValidationMessage(translations.chooseFileMessage);
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

          Swal.fire(translations.uploadImageSuccess, "", "success");
          setImages([...images, response.data]);
        } catch (error) {
          Swal.fire(translations.uploadImageError, "", "error");
        }
      },
    });
  };

  const deleteImage = async (id) => {
    Swal.fire({
      title: translations.confirmDeleteTitle,
      text: translations.confirmDeleteMessage,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: translations.confirmButtonText,
      cancelButtonText: translations.cancelButtonText,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${import.meta.env.VITE_SERVER_URL}/area_images/${id}`
          );
          Swal.fire(translations.deleteImageSuccess, "", "success");
          setImages(images.filter((img) => img.id !== id));
        } catch (error) {
          Swal.fire(translations.deleteImageError, "", "error");
        }
      }
    });
  };

  const updateImagePopup = (id) => {
    Swal.fire({
      title: translations.uploadImageTitle,
      html: `
        <input type="file" id="updateImageInput" class="file-input file-input-bordered w-full" accept="image/*" />
        <br/>
        <img id="updatePreviewImage" src="" style="display:none; max-width: 100%; border-radius: 8px; margin-top: 10px;" />
      `,
      showCancelButton: true,
      confirmButtonText: translations.updateImageSuccess,
      cancelButtonText: translations.cancelButtonText,
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
          Swal.showValidationMessage(translations.chooseFileMessage);
          return false;
        }

        const formData = new FormData();
        formData.append("image", fileInput);
        formData.append("area_calculation_id", area_calculation_id);

        try {
          await axios.delete(
            `${import.meta.env.VITE_SERVER_URL}/area_images/${id}`
          ); // Delete old image
          const response = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/area_images`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          Swal.fire(translations.updateImageSuccess, "", "success");
          setImages(images.map((img) => (img.id === id ? response.data : img)));
        } catch (error) {
          Swal.fire(translations.updateImageError, "", "error");
        }
      },
    });
  };

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-6xl mx-auto p-6 font-prompt">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {translations.areaImagesTitle}
        </h2>

        <div className="flex justify-end mb-6">
          <button
            onClick={uploadImagePopup}
            className="btn bg-blue text-white hover:bg-blue"
          >
            {translations.uploadNewImageButton}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : images.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            {translations.noImagesMessage}
          </p>
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
                    📅 {translations.uploadedAt}:{" "}
                    {new Date(image.uploaded_at).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteImage(image.id)}
                      className="btn bg-red-500 text-white hover:bg-red-600 mt-2"
                    >
                      {translations.deleteImageButton}
                    </button>
                    <button
                      onClick={() => updateImagePopup(image.id)}
                      className="btn bg-success text-white hover:bg-success mt-2"
                    >
                      {translations.updateImageButton}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AreacalDetails;
