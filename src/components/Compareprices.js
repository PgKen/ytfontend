import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import axios from "axios";
import { Baseurl } from "./Baseurl";

function Compareprices() {
  const [dataToday, setDataToday] = useState([]);
  const [dataYesterday, setDataYesterday] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableWidth, setTableWidth] = useState(100);
  const [showBg, setShowBg] = useState(false);
  const [dataImges, setDataImges] = useState([]);
  const [indexImg, setIndexImg] = useState(0);

  // วันที่วันนี้และเมื่อวาน
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const formatDate = (d) => d.toISOString().slice(0, 10);
  const todayStr = formatDate(today);
  const yesterdayStr = formatDate(yesterday);

  useEffect(() => {
    setLoading(true);
    // ดึงราคาวันนี้
    axios
      .get(Baseurl + "/app_listproducts")
      .then((response) => {
        setDataToday(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching today prices:", error);
      });
    // ดึงราคาของเมื่อวาน (สมมุติว่ามี endpoint /app_listproducts?date=YYYY-MM-DD)
    axios
      .get(Baseurl + "/app_listproducts_yeserday?date=" + yesterdayStr)
      .then((response) => {
        setDataYesterday(response.data);
      })
      .catch((error) => {
        console.error("Error fetching yesterday prices:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(Baseurl + "/app_listimg")
      .then((response) => {
        setDataImges(response.data);
      })
      .catch((error) => {
        console.error("Error fetching image list:", error);
      });
  }, []);

  // ฟังก์ชันแปลงวันที่เป็นภาษาไทย
  function formatThaiDate(dateString) {
    if (!dateString) return "-";
    const monthsThai = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    const d = new Date(dateString);
    if (isNaN(d)) return "-";
    const day = d.getDate();
    const month = monthsThai[d.getMonth()];
    const year = d.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  }

  // สร้าง map สำหรับเปรียบเทียบราคาของเมื่อวานกับวันนี้
  const yesterdayMap = {};
  dataYesterday.forEach((item) => {
    yesterdayMap[item.id_product] = item;
  });

  // Group products by main type
  const groupedByMainType = dataToday.reduce((acc, item) => {
    const mainType = item.name_maintype || "ไม่ระบุประเภทหลัก";
    if (!acc[mainType]) acc[mainType] = [];
    acc[mainType].push(item);
    return acc;
  }, {});

  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row">
        <aside className="col-12 col-md-3 col-lg-2 bg-white shadow-sm p-0 border-end">
          <Menu />
        </aside>
        <main className="col p-4 d-flex flex-column align-items-center justify-content-start">
          {/* <h2 className="display-5 fw-bold mb-2 text-center text-primary kanit-light">
            เปรียบเทียบราคาสินค้า วันนี้ vs เมื่อวาน
          </h2> */}
          {/* <div className="mb-4 text-center text-secondary">
            วันนี้: {formatThaiDate(todayStr)} | เมื่อวาน:{" "}
            {formatThaiDate(yesterdayStr)}
          </div> */}
          <div className="w-100">
            <div className="mb-2 d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setTableWidth((w) => Math.max(30, w - 10))}
              >
                - ลดความกว้าง
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setTableWidth((w) => Math.min(100, w + 10))}
              >
                + เพิ่มความกว้าง
              </button>
              <button
                type="button"
                className={`btn btn-${showBg ? "danger" : "success"} btn-sm`}
                onClick={() => setShowBg((v) => !v)}
              >
                {showBg ? "ปิดพื้นหลัง" : "แสดงพื้นหลัง"}
              </button>
              {/* ปุ่มเปลี่ยนรูปพื้นหลัง */}
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => setIndexImg((i) => Math.max(0, i - 1))}
                disabled={indexImg <= 0}
              >
                &lt; รูปก่อนหน้า
              </button>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() =>
                  setIndexImg((i) =>
                    dataImges.length > 0
                      ? Math.min(dataImges.length - 1, i + 1)
                      : 0
                  )
                }
                disabled={indexImg >= dataImges.length - 1}
              >
                รูปถัดไป &gt;
              </button>
              <span className="align-self-center small text-secondary ms-2">
                {dataImges.length > 0
                  ? `รูปที่ ${indexImg + 1} / ${dataImges.length}`
                  : ""}
              </span>
            </div>
            {loading ? (
              <div className="text-center my-4">กำลังโหลด...</div>
            ) : Object.keys(groupedByMainType).length === 0 ? (
              <div className="text-center my-4">ไม่พบข้อมูล</div>
            ) : (
              (() => {
                let globalIndex = 1;
                return Object.entries(groupedByMainType).map(
                  ([mainType, items]) => (
                    <div
                      key={mainType}
                      className="mb-5"
                      style={{
                        width: `${tableWidth}%`,
                        transition: "width 0.3s",
                        border: "1px solid #CCC",
                        borderRadius: 8,
                        padding: "30px 100px",
                        // backgroundImage: showBg && dataImges[0]?.name_img ? `url(${Baseurl}/upload/${dataImges[0].name_img})` : 'none',
                        backgroundImage:
                          showBg && dataImges[0]?.name_img
                            ? `url('${Baseurl}/upload/${dataImges[indexImg].name_img}')`
                            : "none",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundColor: showBg
                          ? "rgba(255,255,255,0.85)"
                          : "#f8fafc",
                        color: "#222",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      }}
                    >
                      <h2 className="mb-3 fw-bold  text-primary">
                        <span
                          style={{
                            backgroundColor: "#e3f0fa",
                            color: "#1a237e",
                            borderRadius: 4,
                            padding: "0 8px",
                          }}
                        >
                          &nbsp;เปรียบเทียบราคาสินค้า วันนี้ vs เมื่อวาน &nbsp;
                        </span>
                      </h2>
                      <h6 className="text-secondary mb-4">
                        <span
                          className=" small"
                          style={{
                            backgroundColor: "#e3f0fa",
                            color: "#1a237e",
                            borderRadius: 4,
                            padding: "0 8px",
                          }}
                        >
                          วันนี้: {formatThaiDate(todayStr)} | เมื่อวาน:{" "}
                          {formatThaiDate(yesterdayStr)}
                        </span>
                      </h6>
                      <div className="table-responsive">
                        <table
                          className="table table-bordered table-striped"
                          style={{ background: "rgba(255,255,255,0.4)" }}
                        >
                          <thead className="table-primary">
                            <tr>
                              <th
                                style={{ background: "rgba(207,226,255,0.70)" }}
                              >
                                #
                              </th>
                              <th
                                className="text-center align-middle"
                                style={{ background: "rgba(207,226,255,0.70)" }}
                              >
                                รายการ
                              </th>
                              <th
                                className="text-center align-middle"
                                style={{ background: "rgba(207,226,255,0.70)" }}
                              >
                                ราคาวันนี้
                              </th>
                              <th
                                className="text-center align-middle"
                                style={{ background: "rgba(207,226,255,0.70)" }}
                              >
                                ราคาเมื่อวาน
                              </th>
                              <th
                                className="text-center align-middle"
                                style={{ background: "rgba(207,226,255,0.70)" }}
                              >
                                ส่วนต่าง
                              </th>
                              <th
                                className="text-center align-middle"
                                style={{ background: "rgba(207,226,255,0.70)" }}
                              >
                                หน่วย
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item) => {
                              const yesterday = yesterdayMap[item.id_product];
                              const priceToday =
                                item.result?.find(
                                  (r) => r.name_result === "ตลาดศรีเมือง"
                                )?.price ?? "-";
                              const priceYesterday =
                                yesterday?.result?.find(
                                  (r) => r.name_result === "ตลาดศรีเมือง"
                                )?.price ?? "-";
                              let diff = "-";
                              let arrow = "";
                              if (
                                !isNaN(parseFloat(priceToday)) &&
                                !isNaN(parseFloat(priceYesterday))
                              ) {
                                const diffVal =
                                  parseFloat(priceToday) -
                                  parseFloat(priceYesterday);
                                diff = diffVal.toFixed(2);
                                if (diffVal > 0) {
                                  arrow = (
                                    <span
                                      style={{
                                        color: "green",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      &uarr;
                                    </span>
                                  );
                                } else if (diffVal < 0) {
                                  arrow = (
                                    <span
                                      style={{
                                        color: "red",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      &darr;
                                    </span>
                                  );
                                } else {
                                  arrow = (
                                    <span style={{ color: "#888" }}>-</span>
                                  );
                                }
                              }
                              const row = (
                                <tr key={item.id_product}>
                                  <td
                                    className="text-center align-middle"
                                    style={{
                                      background: "rgba(255,255,255,0.70)",
                                    }}
                                  >
                                    {globalIndex}
                                  </td>
                                  <td
                                    className="text-center align-middle"
                                    style={{
                                      background: "rgba(255,255,255,0.70)",
                                    }}
                                  >
                                    {item.name_pro || "-"}
                                  </td>
                                  <td
                                    className="text-center align-middle"
                                    style={{
                                      background: "rgba(255,255,255,0.70)",
                                    }}
                                  >
                                    {priceToday}
                                  </td>
                                  <td
                                    className="text-center align-middle"
                                    style={{
                                      background: "rgba(255,255,255,0.70)",
                                    }}
                                  >
                                    {priceYesterday}
                                  </td>
                                  <td
                                    className="text-center align-middle"
                                    style={{
                                      background: "rgba(255,255,255,0.70)",
                                    }}
                                  >
                                    {diff} {arrow}
                                  </td>
                                  <td
                                    className="text-center align-middle"
                                    style={{
                                      background: "rgba(255,255,255,0.70)",
                                    }}
                                  >
                                    บาท&nbsp;/&nbsp;{item.unitname || "-"}
                                  </td>
                                </tr>
                              );
                              globalIndex++;
                              return row;
                            })}
                          </tbody>
                        </table>
                        <div className="mt-3 text-secondary small text-center">
                          <span
                            style={{
                              backgroundColor: "#e3f0fa",
                            //   color: "#1a237e",
                              borderRadius: 4,
                              padding: "0 8px",
                            }}
                          >
                            เปรียบเทียบราคาสินค้าระหว่างวันนี้และเมื่อวาน
                            (เฉพาะตลาดศรีเมือง)
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                );
              })()
            )}
          </div>
        </main>
      </div>
      <button
        type="button"
        className="btn btn-primary position-fixed"
        style={{ bottom: "30px", right: "30px", zIndex: 1000 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        เลื่อนไปด้านบน
      </button>
    </div>
  );
}

export default Compareprices;
