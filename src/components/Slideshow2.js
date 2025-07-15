import React, { useState, useEffect, useRef, useMemo } from 'react';
import Menu from './Menu'; // Adjust the import path as necessary
import axios from 'axios';
import { Baseurl, msg } from './Baseurl'; // Uncomment if you need to use Baseurl
import './Slideshow.css'; // เพิ่มไฟล์ CSS สำหรับ fade-in
// import img_hot1 from '../assets/img_hot.png'; // Adjust the path as necessary
// import img_green from '../assets/img_green.png'; // Adjust the path as necessary
// import img_celery from '../assets/img_celery.png'; // Adjust the path as necessary
// import img_hot from '../assets/img_hot.png'; // Adjust the path as necessary
// import img_kale from '../assets/img_green2.png'; // Adjust the path as necessary
// import img_cabbage from '../assets/img_cabbage.png'; // Adjust the path as necessary
// import img_lettuce from '../assets/img_lettuce.png'; // Adjust the path as necessary
// import img_glory from '../assets/img_glory.png'; // Adjust the path as necessary
// import img_spinach from '../assets/img_spinach.png'; // Adjust the path as necessary
// import img_kana from '../assets/img_kana.png'; // Adjust the path as necessary
// import img_beans from '../assets/img_beans.png'; // Adjust the path as necessary
// import img_onion from '../assets/img_onion.png'; // Adjust the path as necessary
// import img_coriander from '../assets/img_coriander.png'; // Adjust the path as necessary
// import img_parsley from '../assets/img_parsley.png'; // Adjust the path as necessary
// import img_coriander2 from '../assets/img_coriander2.png'; // Adjust the path as necessary
// import img_leaves from '../assets/img_leaves.png'; // Adjust the path as necessary
// import img_mint from '../assets/img_mint.png'; // Adjust the path as necessary
// import img_basil from '../assets/img_basil.png'; // Adjust the path as necessary
// import img_pepper from '../assets/img_pepper.png'; // Adjust the path as necessary

import pak2u from '../assets/pak2u.png'; // Adjust the path as necessary
import gsap from "gsap";



function Slideshow() {
    // State สำหรับควบคุมการเริ่ม slideshow
    const [isStarted, setIsStarted] = useState(false);

    // State for main types
    const [mainTypes, setMainTypes] = React.useState([]);
    const [result, setResult] = React.useState([]); // State for results if needed
    const [indexImg, setIndexImg] = React.useState(0); // State for image index
    const [dataProducts, setDataProducts] = React.useState([]); // State for products if needed
    const [loading, setLoading] = React.useState(false);
    const [showMsg, setShowMsg] = useState(false);
    const [showMenu, setShowMenu] = useState(true);


    // Fetch main types from backend

    function selectmaintypesid(id) {
        // console.log('selectmaintypesid function called' + id);
        setLoading(true);
        axios.get(`${Baseurl}/app_showprice/${id}`)
            .then(response => {
                // console.log('Fetched maintype data:', response.data);
                // You can set state here if you want to use the data
                if (response.data.length === 0 || response.data === null) {
                    setDataProducts([]);
                    setLoading(false);
                    return;
                }
                setLoading(false);
                // console.log('Setting data products:', response.data[0]);
                setDataProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching maintype by id:', error);
            });
    }


    useEffect(() => {
        axios.get(Baseurl + '/app_maintypes')

            .then(response => {
                // console.log('Fetched main types:', response.data[0]);
                setMainTypes(response.data);
            })
            .catch(error => {
                console.error('Error fetching main types:', error);
            });
    }, []);

    const [dataImges, setDataImges] = React.useState([]); // State for images if needed
    useEffect(() => {
        axios.get(Baseurl + '/app_listimg')
            .then(response => {
                // Handle image list if needed
                // Example: setImages(response.data);
                console.log('Fetched images:', response.data[0].name_img);
                setDataImges(response.data);
            })
            .catch(error => {
                console.error('Error fetching image list:', error);
            });
    }, []);


    useEffect(() => {
        axios.get(Baseurl + '/app_result')
            .then(response => {
                // console.log('Fetched results:', response.data[0]);
                setResult(response.data);
            })
            .catch(error => {
                console.error('Error fetching results:', error);
            });
    }, []);

    useEffect(() => {
        console.log('Fetching products from backend...');
        axios.get(Baseurl + '/app_listproducts')
            .then(response => {
                // console.log('Fetched products Length:', response.data.length);
                // console.log('Fetched products:', response.data);
                setDataProducts(response.data);

            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    useEffect(() => {

        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        const iduserCookie = cookies.find(cookie => cookie.startsWith('iduser='));
        if (!iduserCookie) {
            window.location.href = '/login';
        }
    }, []);

    useEffect(() => {
        document.title = "Show Price | ระบบแสดงราคา";
    }, []);

    // State for date input
    const [date, setDate] = React.useState(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    });

    // Handle main type selection
    // (Removed duplicate definition to avoid conflict)

    // State for validation
    const [mainTypeError, setMainTypeError] = React.useState('');
    const [sourceTypeError, setSourceTypeError] = React.useState('');
    const [mainTypeValue, setMainTypeValue] = React.useState('0');
    const [sourceTypeValue, setSourceTypeValue] = React.useState('0');

    // Update main type selection and validation
    function handleMainTypeChange(e) {
        const value = e.target.value;
        setMainTypeValue(value);
        if (value === "0") {
            setMainTypeError('กรุณาเลือกประเภทหลัก');
            setLoading(false);
            setDataProducts([]);
            return;
        } else {
            setMainTypeError('');
        }
        selectmaintypesid(value);
    }

    // Update source type selection and validation
    function handleSourceTypeChange(e) {
        const value = e.target.value;
        setSourceTypeValue(value);
        if (value === "0") {
            setSourceTypeError('กรุณาเลือกแหล่งที่มา');
        } else {
            setSourceTypeError('');
        }
    }

    // Check if submit should be disabled
    const isSubmitDisabled = mainTypeValue === "0" || sourceTypeValue === "0";

    // Group products by "ประเภทหลัก" (main type)
    const groupedByMainType = useMemo(() => {
        return dataProducts.reduce((acc, item) => {
            const mainType = item.name_maintype || 'ไม่ระบุประเภทหลัก';
            if (!acc[mainType]) acc[mainType] = [];
            acc[mainType].push(item);
            return acc;
        }, {});
    }, [dataProducts]);

    // ฟังก์ชันแปลงวันที่เป็นภาษาไทย
    function formatThaiDate(dateString) {
        if (!dateString) return '-';
        const monthsThai = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];
        const d = new Date(dateString);
        if (isNaN(d)) return '-';
        const day = d.getDate();
        const month = monthsThai[d.getMonth()];
        const year = d.getFullYear() + 543;
        return `${day} ${month} ${year}`;
    }

    const [tableWidth, setTableWidth] = React.useState(100);
    const [showBg, setShowBg] = React.useState(false);
    const [showTai, setShowTai] = useState(false); // default: ไม่แสดงตลาดไท
    const [showSimummuang, setShowSimummuang] = useState(false); // default: ไม่แสดงตลาดสี่มุมเมือง
    const [showSrimuang, setShowSrimuang] = useState(true); // default: แสดงตลาดศรีเมือง
    const [showSurvey, setShowSurvey] = useState(false); // default: ไม่แสดงสำรวจ

    const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

    useEffect(() => {
        function handleFullscreenChange() {
            setIsFullscreen(!!document.fullscreenElement);
        }
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    // State สำหรับควบคุมการแสดงทีละบรรทัดแบบ fade-in
    const [visibleRows, setVisibleRows] = useState({}); // { mainType: จำนวนแถวที่แสดง }
    const intervalsRef = useRef({}); // เก็บ interval id ของแต่ละ group

    // --- Animation Speed State ---
    const [animationSpeed, setAnimationSpeed] = useState('medium'); // slow, medium, fast, custom
    const [customSpeed, setCustomSpeed] = useState(0.7); // seconds

    // --- Animation Delay State ---
    const [animationDelay, setAnimationDelay] = useState('0.5'); // default เป็น 0.5 วินาที
    const [customDelay, setCustomDelay] = useState('1'); // default เป็น string '1' เพื่อป้องกัน NaN
    const delayValue = animationDelay === 'custom' ? (parseFloat(customDelay) || 0) : parseFloat(animationDelay);

    // Map speed to duration/interval
    const speedMap = {
        slow: { duration: 1.2, interval: 1200 },
        medium: { duration: 0.7, interval: 800 },
        fast: { duration: 0.3, interval: 300 },
        custom: { duration: Number(customSpeed), interval: Number(customSpeed) * 1000 }
    };
    const { duration, interval } = speedMap[animationSpeed] || speedMap.medium;

    useEffect(() => {
        // Clear interval เดิมทุก group ก่อนเริ่มใหม่
        Object.values(intervalsRef.current).forEach(clearInterval);
        intervalsRef.current = {};
        if (loading) return;
        const newVisible = {};
        Object.entries(groupedByMainType).forEach(([mainType, items]) => {
            newVisible[mainType] = 0;
        });
        setVisibleRows(newVisible);
        // ค่อยๆ เพิ่มแถวแต่ละกลุ่ม
        Object.entries(groupedByMainType).forEach(([mainType, items]) => {
            let i = 0;
            intervalsRef.current[mainType] = setInterval(() => {
                setVisibleRows(prev => {
                    // ถ้า group เปลี่ยนระหว่าง fade ให้หยุด
                    if (!groupedByMainType[mainType]) return prev;
                    return { ...prev, [mainType]: Math.min((prev[mainType] || 0) + 1, items.length) };
                });
                i++;
                if (i >= items.length) {
                    clearInterval(intervalsRef.current[mainType]);
                }
            }, interval); // ใช้ interval จาก speedMap
        });
        // cleanup เมื่อ unmount หรือ group เปลี่ยน
        return () => {
            Object.values(intervalsRef.current).forEach(clearInterval);
            intervalsRef.current = {};
        };
    }, [groupedByMainType, loading, interval]);

    const [activeTooltip, setActiveTooltip] = useState({ mainType: null, idx: null }); // สำหรับ tooltip สินค้า/ราคา

    // ปิด tooltip เมื่อคลิกที่ว่าง (นอกตาราง)
    useEffect(() => {
        function handleClickOutside(e) {
            // ถ้าไม่ได้คลิกใน <table> หรือในกล่อง tooltip
            if (!e.target.closest('table')) {
                setActiveTooltip({ mainType: null, idx: null });
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- Slideshow Box State ---
    const [slideIndex, setSlideIndex] = useState(0);
    const [animationType, setAnimationType] = useState('fade'); // fade, slide, scale, rotate, default, flip, bounce, zoom
    const boxRef = useRef(); // <--- เพิ่ม useRef สำหรับ boxRef

    // เมื่อ dataProducts เปลี่ยน ให้ reset slideIndex
    useEffect(() => {
        setSlideIndex(0);
    }, [dataProducts]);

    // สร้าง flat array ของสินค้าทั้งหมด (flatten จาก groupedByMainType)
    const allProductItems = useMemo(() => {
        return Object.values(groupedByMainType).flat();
    }, [groupedByMainType]);

    // Auto slide ตาม hold time (delayValue + 2 วินาที)
    useEffect(() => {
        if (!allProductItems.length || !isStarted) return;
        const intervalMs = delayValue > 0 ? (delayValue + 2) * 1000 : 2000;
        const timer = setInterval(() => {
            setSlideIndex(idx => {
                const nextIdx = (idx + 1) % allProductItems.length;
                if (dataImges.length > 0 && (nextIdx % 3 === 0)) {
                    setIndexImg(imgIdx => (imgIdx + 1) % dataImges.length);
                }
                return nextIdx;
            });
        }, intervalMs);
        return () => clearInterval(timer);
    }, [allProductItems, delayValue, dataImges.length, isStarted]);

    // --- ปรับ: ไม่ต้องหน่วงเวลา (delay) ตอนเปลี่ยนภาพ ให้แสดงผลทันที ---
    // ปรับ delay ของ gsapOpts เป็น 0 ตอน slideIndex เปลี่ยน
    useEffect(() => {
        if (boxRef.current) {
            const gsapOpts = { opacity: 1, duration };
            if (animationType === 'fade') {
                gsap.fromTo(boxRef.current, { opacity: 0 }, { ...gsapOpts });
            } else if (animationType === 'slide') {
                gsap.fromTo(boxRef.current, { opacity: 0, y: 60 }, { ...gsapOpts, y: 0, ease: 'power2.out' });
            } else if (animationType === 'scale') {
                gsap.fromTo(boxRef.current, { opacity: 0, scale: 0.7 }, { ...gsapOpts, scale: 1, ease: 'back.out(1.7)' });
            } else if (animationType === 'rotate') {
                gsap.fromTo(boxRef.current, { opacity: 0, rotateY: 90 }, { ...gsapOpts, rotateY: 0, ease: 'power2.out' });
            } else if (animationType === 'flip') {
                gsap.fromTo(boxRef.current, { opacity: 0, rotateX: 90 }, { ...gsapOpts, rotateX: 0, ease: 'power2.out' });
            } else if (animationType === 'bounce') {
                gsap.fromTo(boxRef.current, { opacity: 0, y: 100 }, { ...gsapOpts, y: 0, ease: 'bounce.out' });
            } else if (animationType === 'zoom') {
                gsap.fromTo(boxRef.current, { opacity: 0, scale: 1.5 }, { ...gsapOpts, scale: 1, ease: 'power2.out' });
            } else {
                gsap.fromTo(boxRef.current, { opacity: 0, y: 40, scale: 0.95 }, { ...gsapOpts, y: 0, scale: 1, ease: 'power2.out' });
            }
        }
    }, [slideIndex, animationType, duration, delayValue]);

    // State for highlight style
    const [highlightStyle, setHighlightStyle] = useState('gold');
    // State for date style
    const [dateStyle, setDateStyle] = useState('gold');

    // ฟังก์ชัน render date styled span
    function renderDateStyledSpan(date, style) {
        const dateText = `ลงวันที่ ${formatThaiDate(date)}`;
        const baseMargin = { marginBottom: 8, display: 'inline-block' };
        switch (style) {
            case 'gold':
                return (
                    <span style={{ background: 'linear-gradient(90deg,#fffbe7 60%,#ffe066 100%)', color: '#1a237e', borderRadius: 8, padding: '0 12px', fontWeight: 700, border: '2px solid #ffd700', boxShadow: '0 2px 8px #ffd70080', textShadow: '0 1px 0 #fff', ...baseMargin }}>{dateText}</span>
                );
            case 'classic':
                return (
                    <span style={{ background: '#fffbe7', color: '#1a237e', borderRadius: 4, padding: '0 10px', border: '1px solid #ffd700', fontWeight: 600, ...baseMargin }}>{dateText}</span>
                );
            case 'modern':
                return (
                    <span style={{
                        background: 'linear-gradient(90deg,#00c6ff,#0072ff 80%)',
                        color: '#fff',
                        borderRadius: 8,
                        padding: '0 12px',
                        fontWeight: 700,
                        boxShadow: '0 2px 8px #00c6ff40',
                        textShadow: '0 1px 0 #0072ff',
                        ...baseMargin
                    }}>{dateText}
                    </span>
                );
            case 'neon':
                return (
                    <span style={{ background: '#222', color: '#0ff', borderRadius: 8, padding: '0 12px', fontWeight: 700, boxShadow: '0 2px 8px #0ff80', textShadow: '0 0 8px #0ff, 0 0 2px #fff', ...baseMargin }}>{dateText}</span>
                );
            case 'bubble':
                return (
                    <span style={{ background: 'linear-gradient(90deg,#ffecd2,#fcb69f)', color: '#d7263d', borderRadius: 16, padding: '0 16px', fontWeight: 800, border: '2px solid #fcb69f', boxShadow: '0 2px 8px #fcb69f80', ...baseMargin }}>{dateText}</span>
                );
            case 'minimal':
                return (
                    <span style={{ background: '#fff', color: '#222', borderRadius: 4, padding: '0 10px', border: '1px solid #eee', fontWeight: 500, ...baseMargin }}>{dateText}</span>
                );
            default:
                return (
                    <span style={{ backgroundColor: '#e3f0fa', color: '#1a237e', borderRadius: 4, padding: '0 8px', ...baseMargin }}>{dateText}</span>
                );
        }
    }

    return (
        <div className="container-fluid min-vh-100 bg-light">
            <div className="row">
                {showMenu && (
                    <aside className="col-12 col-md-3 col-lg-2 bg-white shadow-sm p-0 border-end">
                        <Menu />
                    </aside>
                )}
                <main className={`col p-4 d-flex flex-column align-items-center justify-content-start${!showMenu ? ' w-100' : ''}`}>
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm mb-3 align-self-start"
                        onClick={() => setShowMenu(v => !v)}
                        style={{ zIndex: 1100 }}
                    >
                        {showMenu ? 'ซ่อนเมนู' : 'แสดงเมนู'}
                    </button>
                    {/* <h2 className="display-5 fw-bold mb-2 text-center text-primary kanit-light">ราคาผักวันนี้</h2>
                    <div className="mb-4 text-center text-secondary">
                        ลงวันที่ {formatThaiDate(date)}
                    </div> */}
                    <div className="row w-100 mb-4">

                    </div>

                    <div className="w-100">
                        {/* ปุ่มขนาดคงที่/อัตโนมัติ */}
                        <div className="mb-3 d-flex gap-2 justify-content-center">
                            <button
                                type="button"
                                className={`btn btn-sm btn-${tableWidth === 'fixed' ? 'primary' : 'outline-primary'}`}
                                onClick={() => setTableWidth('fixed')}
                            >
                                ขนาดคงที่ 576x1024
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm btn-${tableWidth !== 'fixed' ? 'primary' : 'outline-primary'}`}
                                onClick={() => setTableWidth(100)}
                            >
                                ขนาดอัตโนมัติ
                            </button>

                            {/* ปุ่ม Fullscreen Toggle */}
                            <button
                                type="button"
                                className={`btn btn-sm btn-${isFullscreen ? 'danger' : 'success'}`}
                                onClick={() => {
                                    const elem = document.documentElement;
                                    if (!isFullscreen) {
                                        if (elem.requestFullscreen) {
                                            elem.requestFullscreen();
                                        } else if (elem.mozRequestFullScreen) {
                                            elem.mozRequestFullScreen();
                                        } else if (elem.webkitRequestFullscreen) {
                                            elem.webkitRequestFullscreen();
                                        } else if (elem.msRequestFullscreen) {
                                            elem.msRequestFullscreen();
                                        }
                                    } else {
                                        if (document.exitFullscreen) {
                                            document.exitFullscreen();
                                        } else if (document.mozCancelFullScreen) {
                                            document.mozCancelFullScreen();
                                        } else if (document.webkitExitFullscreen) {
                                            document.webkitExitFullscreen();
                                        } else if (document.msExitFullscreen) {
                                            document.msExitFullscreen();
                                        }
                                    }
                                }}
                            >
                                {isFullscreen ? 'ออกจากโหมดเต็มจอ' : 'เต็มจอ'}
                            </button>

                            {/* เลือกความเร็ว Animation */}
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
                                {/* เลือกหน่วงเวลา Animation */}
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
                            </div>

                            {/* ปุ่มเลือก Animation */}
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
                        <div className="mb-4 d-flex flex-wrap gap-2 justify-content-start align-items-center">
                            {/* เลือกประเภทหลัก */}
                            <select
                                className="form-select"
                                style={{ maxWidth: 220, minWidth: 120 }}
                                value={mainTypeValue}
                                onChange={handleMainTypeChange}
                            >
                                <option value="0">-- เลือกทั้งหมด --</option>
                                {mainTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name_maintype}</option>
                                ))}
                            </select>

                            {/* เลือกวันที่ */}
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                style={{ maxWidth: 150, minWidth: 120 }}
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />

                            {/* ปุ่มแสดงข้อมูล */}
                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                    setLoading(true);
                                    const params = { date };
                                    if (mainTypeValue && mainTypeValue !== '0') {
                                        params.id_maintype = mainTypeValue;
                                    }
                                    axios.get(`${Baseurl}/app_listproducts`, { params })
                                        .then(response => {
                                            setDataProducts(response.data);
                                            setLoading(false);
                                        })
                                        .catch(error => {
                                            console.error('Error fetching products by date:', error);
                                            setLoading(false);
                                        });
                                }}
                            >
                                แสดงข้อมูล
                            </button>

                            {/* ปุ่มแสดง/ซ่อนข้อความ */}
                            <button
                                type="button"
                                className="btn btn-outline-info btn-sm"
                                onClick={() => setShowMsg(v => !v)}
                                style={{ minWidth: 110 }}
                            >
                                {showMsg ? 'ซ่อนข้อความ' : 'แสดงข้อความ'}
                            </button>

                            {/* ปุ่มปรับขนาดตาราง */}
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => setTableWidth(w => Math.max(30, w - 10))}
                                title="ลดความกว้าง"
                            >
                                - ลดความกว้าง
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => setTableWidth(w => Math.min(100, w + 10))}
                                title="เพิ่มความกว้าง"
                            >
                                + เพิ่มความกว้าง
                            </button>

                        {/* ปุ่มเริ่ม Slide Show */}
                        <button
                            type="button"
                            className={`btn btn-${isStarted ? 'danger' : 'success'} btn-sm`}
                            onClick={() => setIsStarted(v => !v)}
                            style={{ minWidth: 110 }}
                        >
                            {isStarted ? 'หยุด Slide Show' : 'Start Slide Show'}
                        </button>
                        {/* ปุ่มแสดง/ซ่อนพื้นหลัง */}
                        <button
                            type="button"
                            className={`btn btn-${showBg ? 'danger' : 'success'} btn-sm`}
                            onClick={() => setShowBg(v => !v)}
                            style={{ minWidth: 110 }}
                        >
                            {showBg ? 'ปิดพื้นหลัง' : 'แสดงพื้นหลัง'}
                        </button>

                            {/* ปุ่มเปลี่ยนรูปพื้นหลัง */}
                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => setIndexImg(i => Math.max(0, i - 1))}
                                disabled={indexImg <= 0}
                                title="รูปก่อนหน้า"
                            >
                                &lt; รูปก่อนหน้า
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => setIndexImg(i => (dataImges.length > 0 ? Math.min(dataImges.length - 1, i + 1) : 0))}
                                disabled={indexImg >= dataImges.length - 1}
                                title="รูปถัดไป"
                            >
                                รูปถัดไป &gt;
                            </button>
                            <span className="align-self-center small text-secondary ms-2">
                                {dataImges.length > 0 ? `รูปที่ ${indexImg + 1} / ${dataImges.length}` : ''}
                            </span>
                        </div>

                        {/* ตัวเลือกสไตล์หัวข้อเด่น */}
                        <div className="d-flex align-items-center mb-2" style={{ gap: 12 }}>
                            <label className="me-2">รูปแบบหัวข้อ:</label>
                            <select
                                className="form-select form-select-sm"
                                style={{ width: 180, maxWidth: 220 }}
                                value={highlightStyle}
                                onChange={e => setHighlightStyle(e.target.value)}
                            >
                                <option value="gold">ทองเด่น (TikTok)</option>
                                <option value="classic">Classic</option>
                                <option value="modern">Modern Gradient</option>
                                <option value="neon">Neon</option>
                                <option value="bubble">Bubble</option>
                                <option value="minimal">Minimal</option>
                            </select>
                            {/* ตัวเลือกสไตล์วันที่ */}
                            <label className="ms-3 me-2">รูปแบบวันที่:</label>
                            <select
                                className="form-select form-select-sm"
                                style={{ width: 150, maxWidth: 180 }}
                                value={dateStyle}
                                onChange={e => setDateStyle(e.target.value)}
                            >
                                <option value="gold">ทองเด่น</option>
                                <option value="classic">Classic</option>
                                <option value="modern">Modern</option>
                                <option value="neon">Neon</option>
                                <option value="bubble">Bubble</option>
                                <option value="minimal">Minimal</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="text-center my-4">กำลังโหลด...</div>
                        ) : Object.keys(groupedByMainType).length === 0 ? (
                            <div className="text-center my-4">ไม่พบข้อมูล</div>
                        ) : (
                            Object.entries(groupedByMainType).map(([mainType, items]) => (
                                <div key={mainType} className="mb-5"
                                    style={{
                                        width: tableWidth === 'fixed' ? '576px' : `${tableWidth}%`,
                                        height: tableWidth === 'fixed' ? '1024px' : undefined,
                                        transition: 'width 0.3s',
                                        border: '1px solid #CCC',
                                        borderRadius: 8,
                                        padding: '30px 40px',
                                        backgroundImage: showBg && dataImges[0]?.name_img ? `url('${Baseurl}/upload/${dataImges[indexImg].name_img}')` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'top center',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    }}
                                >
                                    {/* หัวข้อ "ราคา {mainType}" แบบ dynamic ตาม highlightStyle */}
                                    {(() => {
                                        if (highlightStyle === 'gold') {
                                            return (
                                                <h2 className="mb-3 fw-bold text-primary" style={{
                                                    textAlign: 'center', fontSize: '2.6rem', letterSpacing: '1px', textShadow: '0 4px 16px #ffd700, 0 1px 0 #fff', position: 'relative', zIndex: 2
                                                }}>
                                                    <span style={{
                                                        background: 'linear-gradient(90deg, #fffbe7 60%, #ffe066 100%)', color: '#1a237e', borderRadius: '16px', padding: '8px 32px', fontSize: '2.2rem', fontWeight: 900, boxShadow: '0 4px 24px #ffd70080', border: '3px solid #ffd700', display: 'inline-block', textShadow: '0 2px 8px #ffd700, 0 1px 0 #fff', letterSpacing: '2px', marginBottom: 0
                                                    }}>
                                                        <span style={{ color: '#ff9100', fontWeight: 900, fontSize: '2.5rem', marginRight: 8, verticalAlign: 'middle', filter: 'drop-shadow(0 2px 8px #ffd700)' }}>
                                                            <i className="fa-solid fa-crown" style={{ marginRight: 8 }}></i>
                                                        </span>
                                                        ราคา {mainType}
                                                        {(() => {
                                                            const today = new Date();
                                                            const yyyy = today.getFullYear();
                                                            const mm = String(today.getMonth() + 1).padStart(2, '0');
                                                            const dd = String(today.getDate()).padStart(2, '0');
                                                            const todayStr = `${yyyy}-${mm}-${dd}`;
                                                            return date === todayStr ? <span style={{ color: '#d7263d', fontWeight: 900, fontSize: '2.1rem', marginLeft: 12, textShadow: '0 2px 8px #ffd700' }}>วันนี้</span> : '';
                                                        })()}
                                                    </span>
                                                </h2>
                                            );
                                        } else if (highlightStyle === 'classic') {
                                            return (
                                                <h2 className="mb-3 fw-bold text-primary" style={{ textAlign: 'center', fontSize: '2.2rem', letterSpacing: '1px' }}>
                                                    <span style={{ background: '#fffbe7', color: '#1a237e', borderRadius: 8, padding: '6px 24px', border: '2px solid #ffd700', fontWeight: 700 }}>
                                                        ราคา {mainType} {(() => {
                                                            const today = new Date();
                                                            const yyyy = today.getFullYear();
                                                            const mm = String(today.getMonth() + 1).padStart(2, '0');
                                                            const dd = String(today.getDate()).padStart(2, '0');
                                                            const todayStr = `${yyyy}-${mm}-${dd}`;
                                                            return date === todayStr ? <span style={{ color: '#d7263d', fontWeight: 700, marginLeft: 8 }}>วันนี้</span> : '';
                                                        })()}
                                                    </span>
                                                </h2>
                                            );
                                        } else if (highlightStyle === 'modern') {
                                            return (
                                                <h2 className="mb-3 fw-bold" style={{ textAlign: 'center', fontSize: '2.3rem', background: 'linear-gradient(90deg,#00c6ff,#0072ff 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '2px' }}>
                                                    <span style={{ background: '#fff', borderRadius: 12, padding: '6px 24px', boxShadow: '0 2px 12px #00c6ff40', fontWeight: 800 }}>
                                                        ราคา {mainType} {(() => {
                                                            const today = new Date();
                                                            const yyyy = today.getFullYear();
                                                            const mm = String(today.getMonth() + 1).padStart(2, '0');
                                                            const dd = String(today.getDate()).padStart(2, '0');
                                                            const todayStr = `${yyyy}-${mm}-${dd}`;
                                                            return date === todayStr ? <span style={{ color: '#ff9100', fontWeight: 800, marginLeft: 8 }}>วันนี้</span> : '';
                                                        })()}
                                                    </span>
                                                </h2>
                                            );
                                        } else if (highlightStyle === 'neon') {
                                            return (
                                                <h2 className="mb-3 fw-bold" style={{ textAlign: 'center', fontSize: '2.3rem', color: '#fff', textShadow: '0 0 8px #0ff, 0 0 24px #0ff, 0 0 2px #fff', letterSpacing: '2px' }}>
                                                    <span style={{ background: '#222', borderRadius: 12, padding: '6px 24px', boxShadow: '0 2px 12px #0ff80', fontWeight: 800 }}>
                                                        ราคา {mainType} {(() => {
                                                            const today = new Date();
                                                            const yyyy = today.getFullYear();
                                                            const mm = String(today.getMonth() + 1).padStart(2, '0');
                                                            const dd = String(today.getDate()).padStart(2, '0');
                                                            const todayStr = `${yyyy}-${mm}-${dd}`;
                                                            return date === todayStr ? <span style={{ color: '#0ff', fontWeight: 800, marginLeft: 8, textShadow: '0 0 8px #0ff, 0 0 24px #0ff' }}>วันนี้</span> : '';
                                                        })()}
                                                    </span>
                                                </h2>
                                            );
                                        } else if (highlightStyle === 'bubble') {
                                            return (
                                                <h2 className="mb-3 fw-bold" style={{ textAlign: 'center', fontSize: '2.3rem', color: '#fff', letterSpacing: '2px' }}>
                                                    <span style={{ background: 'linear-gradient(90deg,#ffecd2,#fcb69f)', borderRadius: 32, padding: '10px 36px', boxShadow: '0 2px 16px #fcb69f80', fontWeight: 900, border: '2px solid #fcb69f', color: '#d7263d' }}>
                                                        <span style={{ fontSize: '2.1rem', marginRight: 8, verticalAlign: 'middle' }}>🍉</span>
                                                        ราคา {mainType} {(() => {
                                                            const today = new Date();
                                                            const yyyy = today.getFullYear();
                                                            const mm = String(today.getMonth() + 1).padStart(2, '0');
                                                            const dd = String(today.getDate()).padStart(2, '0');
                                                            const todayStr = `${yyyy}-${mm}-${dd}`;
                                                            return date === todayStr ? <span style={{ color: '#d7263d', fontWeight: 900, marginLeft: 8 }}>วันนี้</span> : '';
                                                        })()}
                                                    </span>
                                                </h2>
                                            );
                                        } else if (highlightStyle === 'minimal') {
                                            return (
                                                <h2 className="mb-3 fw-bold" style={{ textAlign: 'center', fontSize: '2.1rem', color: '#222', letterSpacing: '1px' }}>
                                                    <span style={{ background: '#fff', borderRadius: 8, padding: '4px 18px', border: '1px solid #eee', fontWeight: 600 }}>
                                                        ราคา {mainType} {(() => {
                                                            const today = new Date();
                                                            const yyyy = today.getFullYear();
                                                            const mm = String(today.getMonth() + 1).padStart(2, '0');
                                                            const dd = String(today.getDate()).padStart(2, '0');
                                                            const todayStr = `${yyyy}-${mm}-${dd}`;
                                                            return date === todayStr ? <span style={{ color: '#d7263d', fontWeight: 700, marginLeft: 8 }}>วันนี้</span> : '';
                                                        })()}
                                                    </span>
                                                </h2>
                                            );
                                        }
                                        // fallback
                                        return null;
                                    })()}
                                    {/* <img src={`${Baseurl}/upload/${dataImges[0]?.name_img}`}
                                                                                        alt="Background"
                                                                                        className="img-fluid mb-3"
                                                                                        style={{ maxHeight: 200, objectFit: 'cover', borderRadius: 8 }}
                                                                                    /> */}
                                    <h4 className="mb-3 text-success">
                                        {renderDateStyledSpan(date, dateStyle)}
                                        <div className="mb-3">
                                            {showMsg && (
                                                <span className="text-success ms-2"
                                                    style={{
                                                        fontSize: '16px',
                                                        display: 'block',
                                                        width: '80%',
                                                        backgroundColor: "#e3f0fa",
                                                        marginLeft: 'auto',
                                                        marginRight: 0,
                                                        paddingRight: '10px',
                                                    }}>
                                                    {msg}
                                                </span>
                                            )}
                                        </div>
                                    </h4>


                                    {/* --- SLIDESHOW BOX --- */}
                                    {allProductItems.length === 0 ? (
                                        <div className="text-center my-4">ไม่พบข้อมูล</div>
                                    ) : (
                                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                            {(() => {
                                                const item = allProductItems[slideIndex];
                                                // ตรวจสอบและดึงราคาจาก item.result (ถ้ามี)
                                                let price = '-';
                                                if (item.result && Array.isArray(item.result)) {
                                                    // หาราคาตลาดศรีเมืองเป็นค่า default
                                                    const srimuang = item.result.find(r => r.name_result === 'ตลาดศรีเมือง');
                                                    if (srimuang && srimuang.price !== undefined && srimuang.price !== null) {
                                                        price = srimuang.price;
                                                    } else if (item.result.length > 0 && item.result[0].price !== undefined && item.result[0].price !== null) {
                                                        price = item.result[0].price;
                                                    }
                                                } else if (item.price !== undefined && item.price !== null) {
                                                    price = item.price;
                                                }
                                                return (
                                                    <div
                                                        ref={boxRef}
                                                        className="shadow-lg p-4 rounded-4"
                                                        id="boxmain-content"
                                                        style={{
                                                            minWidth: 420,
                                                            maxWidth: 520,
                                                            minHeight: 440,
                                                            textAlign: 'center',
                                                            border: '3px solid #ffd700',
                                                            position: 'relative',
                                                            boxShadow: '0 2px 12px #ffd70080',
                                                            backgroundColor: 'rgba(255,255,255,0.7)',
                                                            backdropFilter: 'blur(2px)'
                                                        }}
                                                    >
                                                        {/* รูปภาพสินค้า */}
                                                        {item.img_name ? (
                                                            <img
                                                                src={Baseurl + '/upload/' + item.img_name}
                                                                alt={item.name_pro}
                                                                style={{ maxHeight: 180, maxWidth: 320, marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 12px #ffd70080' }}
                                                                onError={e => { e.target.onerror = null; e.target.src = pak2u; }}
                                                            />
                                                        ) : (
                                                            <img
                                                                src={pak2u}
                                                                alt="No Image"
                                                                style={{ maxHeight: 180, maxWidth: 320, marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 12px #ffd70080' }}
                                                            />
                                                        )}
                                                        <h2 className="fw-bold text-primary mb-2">{item.name_pro || '-'}</h2>
                                                        <div className="mb-2">
                                                            {(() => {
                                                                // ดึงราคาตลาดศรีเมืองจาก item.result (ถ้ามี)
                                                                let priceSrimuang = null;
                                                                let unitSrimuang = null;
                                                                if (Array.isArray(item.result)) {
                                                                    const found = item.result.find(r => r.name_result === 'ตลาดศรีเมือง');
                                                                    if (found) {
                                                                        priceSrimuang = found.price;
                                                                        unitSrimuang = found.unitname || item.unitname;
                                                                    }
                                                                }
                                                                // ถ้าไม่มีราคาตลาดศรีเมือง ให้ fallback เป็น item.price
                                                                const showPrice = priceSrimuang !== undefined && priceSrimuang !== null && priceSrimuang !== '-' ? priceSrimuang : item.price;
                                                                const showUnit = unitSrimuang || item.unitname || '';
                                                                return (
                                                                    <span className="badge bg-info text-dark me-2" style={{ fontSize: '28px' }}>
                                                                        {showPrice !== undefined && showPrice !== null && showPrice !== '-' ? `ราคา ${showPrice} บาท / ${showUnit}` : (showUnit ? `บาท / ${showUnit}` : '')}
                                                                    </span>
                                                                );
                                                            })()}
                                                        </div>
                                                        <div className="mt-3 small text-secondary">ลงวันที่ {formatThaiDate(date)}</div>
                                                        <div className="position-absolute top-0 end-0 p-2">
                                                            <span className="badge bg-warning text-dark">{slideIndex + 1} / {allProductItems.length}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}
                                    {/* --- END SLIDESHOW BOX --- */}
                                </div> /* Close mainType group div here */
                            ))
                        )}
                    </div>

                </main>
            </div>
        </div>
    );
}

export default Slideshow;