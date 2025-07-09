import React, { useEffect, useState, useRef, useMemo } from "react";
import Menu from "./Menu";
import axios from "axios";
import { Baseurl, msg } from "./Baseurl";
import domtoimage from "dom-to-image";
import pak2u from "../assets/pak2u.png";
import gsap from "gsap";


function DatecomparepricesSlideshow() {
  // --- State ---
  const captureRef = useRef();
  const boxRef = useRef();
  const [dataToday, setDataToday] = useState([]);
  const [dataYesterday, setDataYesterday] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableWidth, setTableWidth] = useState(100); // default 100 (percent)
  const [showBg, setShowBg] = useState(false);
  const [dataImges, setDataImges] = useState([]);
  const [indexImg, setIndexImg] = useState(0);
  const [results, setResults] = useState([]); // tb_result
  const [selectedResult, setSelectedResult] = useState("1");
  const [showMsg, setShowMsg] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState("gold");
  const [dateStyle, setDateStyle] = useState("gold");
  // Animation
  const [animationType, setAnimationType] = useState("fade");
  const [animationSpeed, setAnimationSpeed] = useState("medium");
  const [customSpeed, setCustomSpeed] = useState(0.7);
  const [animationDelay, setAnimationDelay] = useState("0.5");
  const [customDelay, setCustomDelay] = useState("1");
  const delayValue =
    animationDelay === "custom"
      ? parseFloat(customDelay) || 0
      : parseFloat(animationDelay);
  const speedMap = {
    slow: { duration: 1.2, interval: 1200 },
    medium: { duration: 0.7, interval: 800 },
    fast: { duration: 0.3, interval: 300 },
    custom: {
      duration: Number(customSpeed),
      interval: Number(customSpeed) * 1000,
    },
  };
  const { duration } = speedMap[animationSpeed] || speedMap.medium;

  // --- Date State ---
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const formatDate = (d) => d.toISOString().slice(0, 10);
  const todayStr = formatDate(today);
  const yesterdayStr = formatDate(yesterday);
  const [date1, setDate1] = useState(todayStr);
  const [date2, setDate2] = useState(yesterdayStr);
  const [submitted, setSubmitted] = useState(false);

  // --- Fetch Data ---
  useEffect(() => {
    axios.get(`${Baseurl}/app_result`).then((res) => setResults(res.data));
    axios
      .get(Baseurl + "/app_listimg")
      .then((response) => setDataImges(response.data))
      .catch((error) => {
        console.error("Error fetching image list:", error);
      });
    document.title = "Compare Prices | เปรียบเทียบราคา";
    function handleFullscreenChange() {
      setIsFullscreen(
        document.fullscreenElement ||
          document.mozFullScreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
          ? true
          : false
      );
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  // --- Fetch compare data ---
  const handleSubmit = () => {
    setLoading(true);
    setSubmitted(true);
    axios
      .get(Baseurl + "/app_listproducts_startdate", {
        params: { id_result: selectedResult, date: date1 },
      })
      .then((response) => {
        setDataToday(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching today prices:", error);
      });
    axios
      .get(Baseurl + "/app_listproducts_enddate", {
        params: { date: date2, id_result: selectedResult },
      })
      .then((response) => setDataYesterday(response.data))
      .catch((error) => {
        console.error("Error fetching yesterday prices:", error);
      });
  };
  useEffect(() => {
    handleSubmit();
    // eslint-disable-next-line
  }, []);

  // --- Slideshow logic ---
  const allProductItems = useMemo(
    () =>
      Object.values(
        dataToday.reduce((acc, item) => {
          const mainType = item.name_maintype || "ไม่ระบุประเภทหลัก";
          if (!acc[mainType]) acc[mainType] = [];
          acc[mainType].push(item);
          return acc;
        }, {})
      ).flat(),
    [dataToday]
  );

  // เปลี่ยน background ทุก 3 สินค้า
  useEffect(() => {
    if (!allProductItems.length) return;
    const intervalMs = delayValue > 0 ? (delayValue + 2) * 1000 : 2000;
    const timer = setInterval(() => {
      setSlideIndex((idx) => {
        const nextIdx = (idx + 1) % allProductItems.length;
        if (dataImges.length > 0 && nextIdx % 3 === 0) {
          setIndexImg((imgIdx) => (imgIdx + 1) % dataImges.length);
        }
        return nextIdx;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [allProductItems, delayValue, dataImges.length]);

  // Animation effect
  useEffect(() => {
    if (boxRef.current) {
      const gsapOpts = { opacity: 1, duration };
      // (ไม่ต้อง import gsap ถ้าไม่ใช้ effect)
    }
  }, [slideIndex, animationType, duration, delayValue]);

  // Animation effect (ใช้ gsap แบบ Slideshow2.js, ป้องกัน clear backgroundImage)
  useEffect(() => {
    if (boxRef.current) {
      // Reset เฉพาะ property ที่ animate ไม่ลบ backgroundImage
      gsap.set(boxRef.current, { clearProps: "opacity,scale,rotateY,rotateX,y" });
      let anim = {};
      switch (animationType) {
        case "fade":
          anim = { opacity: 0, y: 0 };
          gsap.set(boxRef.current, anim);
          gsap.to(boxRef.current, { opacity: 1, duration });
          break;
        case "slide":
          anim = { opacity: 0, y: 60 };
          gsap.set(boxRef.current, anim);
          gsap.to(boxRef.current, { opacity: 1, y: 0, duration });
          break;
        case "scale":
          anim = { opacity: 0, scale: 0.7 };
          gsap.set(boxRef.current, anim);
          gsap.to(boxRef.current, { opacity: 1, scale: 1, duration });
          break;
        case "rotate":
          anim = { opacity: 0, rotateY: 90 };
          gsap.set(boxRef.current, anim);
          gsap.to(boxRef.current, { opacity: 1, rotateY: 0, duration });
          break;
        case "flip":
          anim = { opacity: 0, rotateX: 90 };
          gsap.set(boxRef.current, anim);
          gsap.to(boxRef.current, { opacity: 1, rotateX: 0, duration });
          break;
        case "bounce":
          anim = { opacity: 0, y: 80 };
          gsap.set(boxRef.current, anim);
          gsap.to(boxRef.current, { opacity: 1, y: 0, duration, ease: "bounce.out" });
          break;
        case "zoom":
          anim = { opacity: 0, scale: 0.3 };
          gsap.set(boxRef.current, anim);
          gsap.to(boxRef.current, { opacity: 1, scale: 1, duration });
          break;
        default:
          gsap.set(boxRef.current, { opacity: 0 });
          gsap.to(boxRef.current, { opacity: 1, duration });
      }
    }
  }, [slideIndex, animationType, duration, delayValue]);

  // --- Format Thai Date ---
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

  // --- ฟังก์ชันวันที่แบบย่อ ---
  function formatThaiShortDate(dateString) {
    if (!dateString) return "-";
    const monthsThaiShort = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    const d = new Date(dateString);
    if (isNaN(d)) return "-";
    const day = d.getDate();
    const month = monthsThaiShort[d.getMonth()];
    const year = (d.getFullYear() + 543).toString().slice(-2); // ปี 2 หลัก
    return `${day} ${month} ${year}`;
  }

  // --- Date styled span ---
  function renderDateStyledSpan(date, style) {
    const dateText = `เปรียบเทียบวันที่ ${formatThaiDate(date1)} | ${formatThaiDate(
      date2
    )}`;
    const baseMargin = { marginBottom: 8, display: "inline-block" };
    switch (style) {
      case "gold":
        return (
          <span
            style={{
              background:
                "linear-gradient(90deg,#fffbe7 60%,#ffe066 100%)",
              color: "#1a237e",
              borderRadius: 8,
              padding: "0 12px",
              fontWeight: 700,
              border: "2px solid #ffd700",
              boxShadow: "0 2px 8px #ffd70080",
              textShadow: "0 1px 0 #fff",
              ...baseMargin,
            }}
          >
            {dateText}
          </span>
        );
      case "classic":
        return (
          <span
            style={{
              background: "#fffbe7",
              color: "#1a237e",
              borderRadius: 4,
              padding: "0 10px",
              border: "1px solid #ffd700",
              fontWeight: 600,
              ...baseMargin,
            }}
          >
            {dateText}
          </span>
        );
      case "modern":
        return (
          <span
            style={{
              background:
                "linear-gradient(90deg,#00c6ff,#0072ff 80%)",
              color: "#fff",
              borderRadius: 8,
              padding: "0 12px",
              fontWeight: 700,
              boxShadow: "0 2px 8px #00c6ff40",
              textShadow: "0 1px 0 #0072ff",
              ...baseMargin,
            }}
          >
            {dateText}
          </span>
        );
      case "neon":
        return (
          <span
            style={{
              background: "#222",
              color: "#0ff",
              borderRadius: 8,
              padding: "0 12px",
              fontWeight: 700,
              boxShadow: "0 2px 8px #0ff80",
              textShadow: "0 0 8px #0ff, 0 0 2px #fff",
              ...baseMargin,
            }}
          >
            {dateText}
          </span>
        );
      case "bubble":
        return (
          <span
            style={{
              background:
                "linear-gradient(90deg,#ffecd2,#fcb69f)",
              color: "#d7263d",
              borderRadius: 16,
              padding: "0 16px",
              fontWeight: 800,
              border: "2px solid #fcb69f",
              boxShadow: "0 2px 8px #fcb69f80",
              ...baseMargin,
            }}
          >
            {dateText}
          </span>
        );
      case "minimal":
        return (
          <span
            style={{
              background: "#fff",
              color: "#222",
              borderRadius: 4,
              padding: "0 10px",
              border: "1px solid #eee",
              fontWeight: 500,
              ...baseMargin,
            }}
          >
            {dateText}
          </span>
        );
      default:
        return (
          <span
            style={{
              backgroundColor: "#e3f0fa",
              color: "#1a237e",
              borderRadius: 4,
              padding: "0 8px",
              ...baseMargin,
            }}
          >
            {dateText}
          </span>
        );
    }
  }

  // --- Map for yesterday ---
  const yesterdayMap = {};
  dataYesterday.forEach((item) => {
    yesterdayMap[item.id_product] = item;
  });

  // --- Slideshow Box ---
  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row">
        <aside className="col-12 col-md-3 col-lg-2 bg-white shadow-sm p-0 border-end">
          <Menu />
        </aside>
        <main className="col p-4 d-flex flex-column align-items-center justify-content-start">
          <div className="w-100">
            {/* --- Controls --- */}
            <div className="mb-2 d-flex justify-content-end gap-2 align-items-end flex-wrap">
              <div className="d-flex gap-1 align-items-end">
                <div>
                  <label htmlFor="result-select" className="form-label mb-1">
                    แหล่งที่มา
                  </label>
                  <select
                    id="result-select"
                    className="form-select form-select-sm"
                    style={{ minWidth: 140 }}
                    value={selectedResult}
                    onChange={(e) => setSelectedResult(e.target.value)}
                  >
                    {results.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name_result}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label mb-1">วันที่ 1</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={date1}
                    onChange={(e) => setDate1(e.target.value)}
                    style={{ minWidth: 120 }}
                  />
                </div>
                <div>
                  <label className="form-label mb-1">วันที่ 2</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={date2}
                    onChange={(e) => setDate2(e.target.value)}
                    style={{ minWidth: 120 }}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm ms-1"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-outline-info btn-sm ms-1"
                  onClick={() => setShowMsg((v) => !v)}
                >
                  {showMsg ? "ซ่อนข้อความ" : "แสดงข้อความ"}
                </button>
              </div>
              {/* ปุ่มอื่นๆ */}
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() =>
                  domtoimage
                    .toPng(captureRef.current)
                    .then((dataUrl) => {
                      const link = document.createElement("a");
                      link.download = "capture.png";
                      link.href = dataUrl;
                      link.click();
                    })
                }
              >
                แคปภาพส่วนนี้
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setTableWidth(w => Math.max(30, Number(w) - 10))}
              >
                - ลดความกว้าง
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setTableWidth(w => Math.min(100, Number(w) + 10))}
              >
                + เพิ่มความกว้าง
              </button>
              <button
                type="button"
                className={`btn btn-${
                  showBg ? "danger" : "success"
                } btn-sm`}
                onClick={() => setShowBg((v) => !v)}
              >
                {showBg ? "ปิดพื้นหลัง" : "แสดงพื้นหลัง"}
              </button>
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
            {/* --- Style Selectors --- */}
            <div
              className="d-flex align-items-center mb-2"
              style={{ gap: 12 }}
            >
              <label className="me-2">รูปแบบหัวข้อ:</label>
              <select
                className="form-select form-select-sm"
                style={{ width: 180, maxWidth: 220 }}
                value={highlightStyle}
                onChange={(e) => setHighlightStyle(e.target.value)}
              >
                <option value="gold">ทองเด่น (TikTok)</option>
                <option value="classic">Classic</option>
                <option value="modern">Modern Gradient</option>
                <option value="neon">Neon</option>
                <option value="bubble">Bubble</option>
                <option value="minimal">Minimal</option>
              </select>
              <label className="ms-3 me-2">รูปแบบวันที่:</label>
              <select
                className="form-select form-select-sm"
                style={{ width: 150, maxWidth: 180 }}
                value={dateStyle}
                onChange={(e) => setDateStyle(e.target.value)}
              >
                <option value="gold">ทองเด่น</option>
                <option value="classic">Classic</option>
                <option value="modern">Modern</option>
                <option value="neon">Neon</option>
                <option value="bubble">Bubble</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
            {/* Animation Controls (เหมือน Slideshow2.js) */}
            <div className="mb-3 d-flex gap-2 justify-content-center align-items-center">
              <label className="me-2">ความเร็ว Animation:</label>
              <select
                className="form-select form-select-sm"
                style={{ width: 120 }}
                value={animationSpeed}
                onChange={e => setAnimationSpeed(e.target.value)}
              >
                <option value="slow">ช้า</option>
                <option value="medium">กลาง</option>
                <option value="fast">เร็ว</option>
                <option value="custom">กำหนดเอง</option>
              </select>
              {animationSpeed === 'custom' && (
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={customSpeed}
                  onChange={e => setCustomSpeed(e.target.value)}
                  className="form-control form-control-sm ms-2"
                  style={{ width: 70 }}
                  placeholder="วินาที"
                />
              )}
              <label className="ms-3 me-2">หน่วงเวลา:</label>
              <select
                className="form-select form-select-sm"
                style={{ width: 100 }}
                value={animationDelay}
                onChange={e => setAnimationDelay(e.target.value)}
              >
                <option value="0.5">0.5 วินาที</option>
                <option value="1">1 วินาที</option>
                <option value="3">3 วินาที</option>
                <option value="5">5 วินาที</option>
                <option value="custom">กำหนดเอง</option>
              </select>
              {animationDelay === 'custom' && (
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={customDelay}
                  onChange={e => setCustomDelay(e.target.value)}
                  className="form-control form-control-sm ms-2"
                  style={{ width: 70 }}
                  placeholder="วินาที"
                />
              )}
              {/* ปุ่มเลือก Animation Type */}
              <div className="btn-group ms-3" role="group" aria-label="Animation type">
                <button type="button" className={`btn btn-sm btn-${animationType === 'fade' ? 'primary' : 'outline-primary'}`} onClick={() => setAnimationType('fade')}>Fade</button>
                <button type="button" className={`btn btn-sm btn-${animationType === 'slide' ? 'primary' : 'outline-primary'}`} onClick={() => setAnimationType('slide')}>Slide Up</button>
                <button type="button" className={`btn btn-sm btn-${animationType === 'scale' ? 'primary' : 'outline-primary'}`} onClick={() => setAnimationType('scale')}>Scale</button>
                <button type="button" className={`btn btn-sm btn-${animationType === 'rotate' ? 'primary' : 'outline-primary'}`} onClick={() => setAnimationType('rotate')}>Rotate</button>
                <button type="button" className={`btn btn-sm btn-${animationType === 'flip' ? 'primary' : 'outline-primary'}`} onClick={() => setAnimationType('flip')}>Flip</button>
                <button type="button" className={`btn btn-sm btn-${animationType === 'bounce' ? 'primary' : 'outline-primary'}`} onClick={() => setAnimationType('bounce')}>Bounce</button>
                <button type="button" className={`btn btn-sm btn-${animationType === 'zoom' ? 'primary' : 'outline-primary'}`} onClick={() => setAnimationType('zoom')}>Zoom</button>
                <button type="button" className={`btn btn-sm btn-${animationType === 'default' ? 'primary' : 'outline-primary'}`} onClick={() => setAnimationType('default')}>Default</button>
              </div>
            </div>
            {/* --- Slideshow Box --- */}
            {loading ? (
              <div className="text-center my-4">กำลังโหลด...</div>
            ) : allProductItems.length === 0 ? (
              <div className="text-center my-4">ไม่พบข้อมูล</div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <div
                  className="position-relative"
                  style={{
                    width: tableWidth + '%',
                    minWidth: 320,
                    maxWidth: 1000,
                    margin: '10 auto',
                    padding : 16, // หรือ padding: '32px 16px' ตามต้องการ
                    overflow: "hidden",
                    backgroundImage:
                      showBg && dataImges[0]?.name_img
                        ? `url('${Baseurl}/upload/${dataImges[indexImg].name_img}')`
                        : 'none',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'top center',
                    minHeight: 600,
                    transition: 'background-image 0.5s, width 0.4s',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {(() => {
                    const item = allProductItems[slideIndex];
                    const yesterday = yesterdayMap[item.id_product];
                    const priceToday =
                      item.result?.find((r) => r.id_result == selectedResult)
                        ?.price ?? "-";
                    const priceYesterday =
                      yesterday?.result?.find((r) => r.id_result == selectedResult)
                        ?.price ?? "-";
                    let diff = "-";
                    let arrow = "";
                    if (
                      !isNaN(parseFloat(priceToday)) &&
                      !isNaN(parseFloat(priceYesterday))
                    ) {
                      const diffVal = parseFloat(priceToday) - parseFloat(priceYesterday);
                      diff = diffVal.toFixed(2);
                      if (diffVal > 0) arrow = "▲";
                      else if (diffVal < 0) arrow = "▼";
                    }
                    // --- Render highlight style ---
                    function renderHighlightTitle(mainType) {
                      if (highlightStyle === "gold") {
                        return (
                          <h2
                            className="mb-3 fw-bold text-primary"
                            style={{
                              textAlign: "center",
                              fontSize: "2.6rem",
                              letterSpacing: "1px",
                              textShadow:
                                "0 4px 16px #ffd700, 0 1px 0 #fff",
                              position: "relative",
                              zIndex: 2,
                            }}
                          >
                            <span
                              style={{
                                background:
                                  "linear-gradient(90deg, #fffbe7 60%, #ffe066 100%)",
                                color: "#1a237e",
                                borderRadius: "16px",
                                padding: "8px 32px",
                                fontSize: "2.2rem",
                                fontWeight: 900,
                                boxShadow: "0 4px 24px #ffd70080",
                                border: "3px solid #ffd700",
                                display: "inline-block",
                                textShadow:
                                  "0 2px 8px #ffd700, 0 1px 0 #fff",
                                letterSpacing: "2px",
                                marginBottom: 0,
                              }}
                            >
                              <span
                                style={{
                                  color: "#ff9100",
                                  fontWeight: 900,
                                  fontSize: "2.5rem",
                                  marginRight: 8,
                                  verticalAlign: "middle",
                                  filter: "drop-shadow(0 2px 8px #ffd700)",
                                }}
                              >
                                <i
                                  className="fa-solid fa-crown"
                                  style={{ marginRight: 8 }}
                                ></i>
                              </span>
                              เปรียบเทียบราคา {item.name_maintype || "-"}
                            </span>
                          </h2>
                        );
                      } else if (highlightStyle === "classic") {
                        return (
                          <h2
                            className="mb-3 fw-bold text-primary"
                            style={{
                              textAlign: "center",
                              fontSize: "2.2rem",
                              letterSpacing: "1px",
                            }}
                          >
                            <span
                              style={{
                                background: "#fffbe7",
                                color: "#1a237e",
                                borderRadius: 8,
                                padding: "6px 24px",
                                border: "2px solid #ffd700",
                                fontWeight: 700,
                                display: "inline-block",
                                position: "relative",
                                overflow: "hidden",
                              }}
                            >
                              <span
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background:
                                    "linear-gradient(45deg, #ffeb3b, #ffc107)",
                                  zIndex: 1,
                                  borderRadius: "8px",
                                  filter: "blur(4px)",
                                }}
                              ></span>
                              เปรียบเทียบราคา {item.name_maintype || "-"}
                            </span>
                          </h2>
                        );
                      } else if (highlightStyle === "modern") {
                        return (
                          <h2
                            className="mb-3 fw-bold text-primary"
                            style={{
                              textAlign: "center",
                              fontSize: "2.4rem",
                              letterSpacing: "1px",
                              position: "relative",
                              zIndex: 2,
                            }}
                          >
                            <span
                              style={{
                                background:
                                  "linear-gradient(90deg, #00c6ff, #0072ff 80%)",
                                color: "#fff",
                                borderRadius: "8px",
                                padding: "8px 24px",
                                fontSize: "2rem",
                                fontWeight: 700,
                                display: "inline-block",
                                boxShadow: "0 4px 24px rgba(0, 198, 255, 0.4)",
                                border: "2px solid #0072ff",
                                textShadow: "0 1px 0 #0072ff",
                                marginBottom: 0,
                              }}
                            >
                              เปรียบเทียบราคา {item.name_maintype || "-"}
                            </span>
                          </h2>
                        );
                      } else if (highlightStyle === "neon") {
                        return (
                          <h2
                            className="mb-3 fw-bold text-primary"
                            style={{
                              textAlign: "center",
                              fontSize: "2.4rem",
                              letterSpacing: "1px",
                              position: "relative",
                              zIndex: 2,
                            }}
                          >
                            <span
                              style={{
                                background: "#222",
                                color: "#0ff",
                                borderRadius: "8px",
                                padding: "8px 24px",
                                fontSize: "2rem",
                                fontWeight: 700,
                                display: "inline-block",
                                boxShadow: "0 4px 24px rgba(255, 145, 0, 0.4)",
                                border: "2px solid #0ff",
                                textShadow: "0 1px 0 #0ff",
                                marginBottom: 0,
                              }}
                            >
                              เปรียบเทียบราคา {item.name_maintype || "-"}
                            </span>
                          </h2>
                        );
                      } else if (highlightStyle === "bubble") {
                        return (
                          <h2
                            className="mb-3 fw-bold text-primary"
                            style={{
                              textAlign: "center",
                              fontSize: "2.4rem",
                              letterSpacing: "1px",
                              position: "relative",
                              zIndex: 2,
                            }}
                          >
                            <span
                              style={{
                                background:
                                  "linear-gradient(90deg, #ffecd2, #fcb69f)",
                                color: "#d7263d",
                                borderRadius: "16px",
                                padding: "8px 32px",
                                fontSize: "2rem",
                                fontWeight: 800,
                                display: "inline-block",
                                border: "2px solid #fcb69f",
                                boxShadow: "0 4px 24px rgba(253, 186, 116, 0.4)",
                                textShadow: "0 1px 0 #fcb69f",
                                marginBottom: 0,
                              }}
                            >
                              เปรียบเทียบราคา {item.name_maintype || "-"}
                            </span>
                          </h2>
                        );
                      } else if (highlightStyle === "minimal") {
                        return (
                          <h2
                            className="mb-3 fw-bold text-primary"
                            style={{
                              textAlign: "center",
                              fontSize: "2rem",
                              letterSpacing: "1px",
                              position: "relative",
                              zIndex: 2,
                            }}
                          >
                            <span
                              style={{
                                background: "#fff",
                                color: "#222",
                                borderRadius: "4px",
                                padding: "8px 16px",
                                fontSize: "1.8rem",
                                fontWeight: 700,
                                display: "inline-block",
                                border: "2px solid #ddd",
                                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
                                marginBottom: 0,
                              }}
                            >
                              เปรียบเทียบราคา {item.name_maintype || "-"}
                            </span>
                          </h2>
                        );
                      } else {
                        return (
                          <h2
                            className="mb-3 fw-bold text-primary"
                            style={{
                              textAlign: "center",
                              fontSize: "2rem",
                              letterSpacing: "1px",
                              position: "relative",
                              zIndex: 2,
                            }}
                          >
                            <span
                              style={{
                                backgroundColor: "#e3f0fa",
                                color: "#1a237e",
                                borderRadius: 4,
                                padding: "8px 16px",
                                fontSize: "1.8rem",
                                fontWeight: 700,
                                display: "inline-block",
                                border: "2px solid #007bff",
                                boxShadow: "0 2px 12px rgba(0, 123, 255, 0.2)",
                                marginBottom: 0,
                              }}
                            >
                              เปรียบเทียบราคา {item.name_maintype || "-"}
                            </span>
                          </h2>
                        );
                      }
                    }
                    return (
                      <div>
                        {renderHighlightTitle(item.name_maintype)}
                        {renderDateStyledSpan(date1, dateStyle)}
                        <div className="mb-3">
                          {showMsg && (
                            <span
                              className="text-success ms-2"
                              style={{
                                fontSize: "16px",
                                display: "block",
                                width: "80%",
                                backgroundColor: "#e3f0fa",
                                marginLeft: "auto",
                                marginRight: 0,
                                paddingRight: "10px",
                              }}
                            >
                              {msg}
                            </span>
                          )}
                        </div>
                        {/* กรอบสินค้า */}
                        <div ref={boxRef} style={{
                          background: 'rgba(255,255,255,0.95)',
                          border: '2px solid #ffd700',
                          borderRadius: 18,
                          boxShadow: '0 2px 16px #ffd70040',
                          padding: 24,
                          margin: '0 auto 18px auto',
                          maxWidth: 400,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}>
                          {/* รูปภาพสินค้า */}
                          {item.image ? (
                            <img
                              src={Baseurl + "/upload/" + item.image}
                              alt={item.name_product}
                              style={{
                                maxHeight: 180,
                                maxWidth: 320,
                                marginBottom: 18,
                                borderRadius: 12,
                                boxShadow: "0 2px 12px #ffd70080",
                                border: '2px solid #eee',
                                background: '#fff',
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = pak2u;
                              }}
                            />
                          ) : (
                            <img
                              src={pak2u}
                              alt="No Image"
                              style={{
                                maxHeight: 180,
                                maxWidth: 320,
                                marginBottom: 18,
                                borderRadius: 12,
                                boxShadow: "0 2px 12px #ffd70080",
                                border: '2px solid #eee',
                                background: '#fff',
                              }}
                            />
                          )}
                          <h2 className="fw-bold text-primary mb-2" style={{fontSize: '1.5rem', background: '#fffbe7', borderRadius: 8, padding: '6px 18px', border: '1.5px solid #ffd700', fontWeight: 700, marginBottom: 12}}>
                            {item.name_product || "-"}
                          </h2>
                          <div className="mb-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 6 }}>
                              <span className="badge bg-info text-dark mb-1" style={{ fontSize: "22px" }}>
                                {formatThaiShortDate(date1)} <span className="fw-bold">&nbsp;&nbsp;ราคา&nbsp;&nbsp;{priceToday}&nbsp;&nbsp;บาท</span>
                              </span>
                              {/* <span className="text-secondary small"></span> */}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 6 }}>
                              <span className="badge bg-danger text-light mb-1" style={{ fontSize: "22px" }}>
                                {formatThaiShortDate(date2)} <span className="fw-bold">&nbsp;&nbsp;ราคา&nbsp;&nbsp;{priceYesterday}&nbsp;&nbsp;บาท</span>
                              </span>
                              {/* <span className="text-secondary small"></span> */}
                            </div>
                            <span className={`fw-bold ${diff.startsWith("-") ? "text-danger" : "text-success"}`} style={{ fontSize: "1.2rem", marginLeft: 0, marginBottom: 2 }}>
                              {arrow} {diff}
                            </span>
                            <span className="ms-2">{item.unit}</span>
                          </div>
                        </div>
                        <div className="position-absolute top-0 end-0 p-2">
                          <span className="badge bg-warning text-dark">{slideIndex + 1} / {allProductItems.length}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DatecomparepricesSlideshow;
