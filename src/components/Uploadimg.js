import React, { useState, useEffect } from "react";
import Menu from "./Menu"; // เพิ่ม Menu เหมือน InputPrice.js
import axios from "axios";
import { Baseurl } from "./Baseurl"; // สมมติว่ามีไฟล์นี้เหมือน InputPrice.js

function Uploadimg({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      console.log("Fetching images from server...");

      setListLoading(true);
      try {
        const response = await axios.get(`${Baseurl}/app_listimg`);
        console.log("Images fetched:", response.data);
        
        setImagesSorted(response.data);
      } catch (error) {
        setImages([]);
      } finally {
        setListLoading(false);
      }
    };
    fetchImages();
  }, [loading]); // reload list after upload

   useEffect(() => {
          document.title = "Upload img | อัปโหลดรูปภาพ";
      }, []);
  

  const handleUpload = async () => {
    if (selectedFile) {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", selectedFile);
      try {
        const response = await axios.post(
          `${Baseurl}/app_uploadimg`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data && response.data.success) {
          alert("อัปโหลดรูปภาพสำเร็จ");
          setSelectedFile(null);
          setPreviewUrl(null);
        } else {
          alert("เกิดข้อผิดพลาดในการอัปโหลด");
        }
      } catch (error) {
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteImage = async (id) => {
    if (!window.confirm('คุณต้องการลบรูปภาพนี้ใช่หรือไม่?')) return;
    try {
      setListLoading(true);
      await axios.delete(`${Baseurl}/app_deleteimg/${id}`);
      // รีเฟรชรายการรูปภาพ
      const response = await axios.get(`${Baseurl}/app_listimg`);
      setImagesSorted(response.data);
      setListLoading(false);
    } catch (err) {
      setListLoading(false);
      alert('เกิดข้อผิดพลาดในการลบรูปภาพ');
    }
  };

  const handleChangeOrder = async (id, targetOrder) => {
    try {
      const currentIdx = images.findIndex(img => img.id === id);
      if (currentIdx === -1) return;
      let targetIdx = null;
      if (targetOrder !== undefined) {
        targetIdx = images.findIndex(img => img.id_order === targetOrder && img.id !== id);
      }
      if (targetIdx === -1 || targetIdx === null) {
        if (targetOrder === images[currentIdx - 1]?.id_order && currentIdx > 0) {
          targetIdx = currentIdx - 1;
        } else if (targetOrder === images[currentIdx + 1]?.id_order && currentIdx < images.length - 1) {
          targetIdx = currentIdx + 1;
        }
      }
      if (targetIdx === null || targetIdx === -1) return;
      const currentImage = images[currentIdx];
      const targetImage = images[targetIdx];
      if (!currentImage || !targetImage) {
        alert('ข้อมูลลำดับรูปภาพไม่ถูกต้อง');
        return;
      }
      // เรียก backend สลับลำดับภาพใน transaction เดียว
      await axios.put(`${Baseurl}/app_swapimgorder`, { id1: currentImage.id, id2: targetImage.id });
      // รีเฟรชรายการรูปภาพ
      const response = await axios.get(`${Baseurl}/app_listimg`);
      setImagesSorted(response.data);
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการเปลี่ยนลำดับรูปภาพ');
    }
  };

  const setImagesSorted = (data) => {
    setImages((data || []).sort((a, b) => ((a.id_order ?? a.id ?? 0) - (b.id_order ?? b.id ?? 0))));
  };

  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row">
        <aside className="col-12 col-md-3 col-lg-2 bg-white shadow-sm p-0 border-end">
          <Menu />
        </aside>
        <main className="col p-4 d-flex flex-column align-items-center justify-content-start">
          <h2 className="display-5 fw-bold mb-4 text-center text-primary kanit-light">
            Upload Image
          </h2>
          <div className="card w-100 shadow-sm" style={{ maxWidth: 500 }}>
            <div className="card-body d-flex flex-column align-items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="form-control mb-3"
                disabled={loading}
              />
              {previewUrl && (
                <div className="mb-3">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ maxWidth: "200px", marginTop: "10px" }}
                    className="img-thumbnail"
                  />
                </div>
              )}
              <button
                onClick={handleUpload}
                disabled={!selectedFile || loading}
                className="btn btn-success"
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
          <div className="container mt-4">
            <h4 className="mb-3">รายการรูปภาพที่อัปโหลด</h4>
            {listLoading ? (
              <div>กำลังโหลด...</div>
            ) : images.length === 0 ? (
              <div>ไม่มีรูปภาพ</div>
            ) : (
              <div className="row">
                {images.map((img, idx) => (
                  <div key={img.id} className="col-6 col-md-4 col-lg-3 mb-3">
                    <div className="card h-100">
                        <img
                          src={Baseurl + "/upload/" + img.name_img}
                          alt={`img-${img.id}`}
                        className="card-img-top"
                        style={{ objectFit: "cover", height: 150 }}
                      />
                      <div className="card-body p-2 d-flex flex-column align-items-center gap-2">
                        <a
                          href={Baseurl + "/upload/" + img.name_img}
                          download={img.name_img}
                          className="btn btn-outline-primary btn-sm"
                          style={{ width: '100%' }}
                        >
                          ดาวน์โหลด
                        </a>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          style={{ width: '100%' }}
                          onClick={() => handleDeleteImage(img.id)}
                        >
                          ลบรูปภาพ
                        </button>
                        <div className="d-flex w-100 justify-content-between mt-2">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={idx === 0}
                            onClick={() => handleChangeOrder(img.id, images[idx - 1]?.id_order)}
                          >
                            ▲ ขึ้น
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={idx === images.length - 1}
                            onClick={() => handleChangeOrder(img.id, images[idx + 1]?.id_order)}
                          >
                            ▼ ลง
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <div className="d-flex justify-content-center mt-4 mb-4">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          เลื่อนไปด้านบน
        </button>
      </div>
    </div>
  );
}

export default Uploadimg;
