import React, { useState, useEffect, useRef, useMemo } from 'react';
import Menu from './Menu'; // Adjust the import path as necessary
import axios from 'axios';
import { Baseurl, msg } from './Baseurl'; // Uncomment if you need to use Baseurl
import './Slideshow.css'; // เพิ่มไฟล์ CSS สำหรับ fade-in
import img_hot1 from '../assets/img_hot.png'; // Adjust the path as necessary
import img_green from '../assets/img_green.png'; // Adjust the path as necessary
import img_celery from '../assets/img_celery.png'; // Adjust the path as necessary
import img_hot from '../assets/img_hot.png'; // Adjust the path as necessary
import img_kale from '../assets/img_green2.png'; // Adjust the path as necessary
import img_cabbage from '../assets/img_cabbage.png'; // Adjust the path as necessary
import img_lettuce from '../assets/img_lettuce.png'; // Adjust the path as necessary
import img_glory from '../assets/img_glory.png'; // Adjust the path as necessary
import img_spinach from '../assets/img_spinach.png'; // Adjust the path as necessary
import img_kana from '../assets/img_kana.png'; // Adjust the path as necessary
import img_beans from '../assets/img_beans.png'; // Adjust the path as necessary
import img_onion from '../assets/img_onion.png'; // Adjust the path as necessary
import img_coriander from '../assets/img_coriander.png'; // Adjust the path as necessary
import img_parsley from '../assets/img_parsley.png'; // Adjust the path as necessary
import img_coriander2 from '../assets/img_coriander2.png'; // Adjust the path as necessary
import img_leaves from '../assets/img_leaves.png'; // Adjust the path as necessary
import img_mint from '../assets/img_mint.png'; // Adjust the path as necessary
import img_basil from '../assets/img_basil.png'; // Adjust the path as necessary
import img_pepper from '../assets/img_pepper.png'; // Adjust the path as necessary



function Slideshow() {

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
            }, 800); // ปรับความเร็วในการเพิ่มแถวได้ที่นี่ (450ms)
        });
        // cleanup เมื่อ unmount หรือ group เปลี่ยน
        return () => {
            Object.values(intervalsRef.current).forEach(clearInterval);
            intervalsRef.current = {};
        };
    }, [groupedByMainType, loading]);

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

    // รวมรูปภาพทั้งหมดไว้ใน array
    const imgList = [img_green, img_celery, img_kale, img_cabbage, 
        img_lettuce, img_glory, img_spinach, img_kana, img_beans,
        img_onion, img_coriander, img_parsley, img_coriander2,
        img_leaves,img_mint, img_basil,img_pepper

    ];
    // ฟังก์ชันดึง url รูปภาพสินค้า (เลือกตามลำดับ index)
    function getProductImage(idx) {
        if (typeof idx !== 'number' || idx < 0) return img_green;
        return imgList[idx % imgList.length];
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
                                    <h2 className="mb-3 fw-bold text-primary">
                                        <span style={{ backgroundColor: '#e3f0fa', color: '#1a237e', borderRadius: 4, padding: '0 8px' }}>
                                            &nbsp;ราคา {mainType}
                                            {(() => {
                                                const today = new Date();
                                                const yyyy = today.getFullYear();
                                                const mm = String(today.getMonth() + 1).padStart(2, '0');
                                                const dd = String(today.getDate()).padStart(2, '0');
                                                const todayStr = `${yyyy}-${mm}-${dd}`;
                                                return date === todayStr ? ' วันนี้ ' : '';
                                            })()}
                                            &nbsp;
                                        </span>
                                    </h2>
                                    {/* <img src={`${Baseurl}/upload/${dataImges[0]?.name_img}`}
                                                                                        alt="Background"
                                                                                        className="img-fluid mb-3"
                                                                                        style={{ maxHeight: 200, objectFit: 'cover', borderRadius: 8 }}
                                                                                    /> */}
                                    <h4 className="mb-3 text-success">
                                        <span style={{ backgroundColor: '#e3f0fa', color: '#1a237e', borderRadius: 4, padding: '0 8px', marginRight: 0, marginLeft: 0 }}>
                                            ลงวันที่ {formatThaiDate(date)}
                                        </span>
                                        <div className="mb-3">
                                            {showMsg && (
                                                <span className="text-success ms-2"
                                                    style={{
                                                        fontSize: '16px',
                                                        // textAlign: 'right',
                                                        // alignSelf: 'flex-end',
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
                                    <div className="table-responsive">
                                        <table
                                            className="table table-bordered table-striped"
                                            style={{ background: 'rgba(255,255,255,0.4)' }}
                                        >
                                            <thead
                                                className="table-primary"
                                            >
                                                <tr>
                                                    <th
                                                        style={{ background: 'rgba(207,226,255,0.85)' }}
                                                    >#</th>
                                                    <th
                                                        className="text-center align-middle"
                                                        style={{ background: 'rgba(207,226,255,0.85)' }}
                                                    >รายการ</th>
                                                    {/* <th>ประเภทหลัก</th> */}
                                                    {showSrimuang && (
                                                        <th
                                                            className="text-center align-middle"
                                                            style={{ background: 'rgba(207,226,255,0.85)' }}
                                                        >ตลาดศรีเมือง</th>
                                                    )}
                                                    {showTai && (
                                                        <th
                                                            className="text-center align-middle"
                                                            style={{ background: 'rgba(207,226,255,0.85)' }}
                                                        >ตลาดไท</th>
                                                    )}
                                                    {showSimummuang && (
                                                        <th
                                                            className="text-center align-middle"
                                                            style={{ background: 'rgba(207,226,255,0.85)' }}
                                                        >ตลาดสี่มุมเมือง</th>
                                                    )}
                                                    {showSurvey && (
                                                        <th
                                                            className="text-center align-middle"
                                                            style={{ background: 'rgba(207,226,255,0.85)' }}
                                                        >ราคาสำรวจ</th>
                                                    )}
                                                    <th
                                                        className="text-center align-middle"
                                                        style={{ background: 'rgba(207,226,255,0.85)' }}
                                                    >หน่วย</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map((item, idx) => {
                                                    // เงื่อนไข: แสดงเฉพาะแถวที่ idx < visibleRows[mainType]
                                                    if (idx >= (visibleRows[mainType] || 0)) return null;

                                                    // เตรียมราคาตามแหล่ง
                                                    let priceSrimuang = '-';
                                                    let priceTai = '-';
                                                    let priceSimummuang = '-';
                                                    let priceSurvey = '-';

                                                    if (Array.isArray(item.result)) {
                                                        item.result.forEach(r => {
                                                            if (r.name_result === 'ตลาดศรีเมือง') {
                                                                priceSrimuang = r.price ?? '-';
                                                            } else if (r.name_result === 'ตลาดไท') {
                                                                priceTai = r.price ?? '-';
                                                            } else if (r.name_result === 'ตลาดสี่มุมเมือง') {
                                                                priceSimummuang = r.price ?? '-';
                                                            } else if (r.name_result === 'สำรวจ') {
                                                                priceSurvey = r.price ?? '-';
                                                            }
                                                        });
                                                    } else if (item.result && typeof item.result === 'object') {
                                                        // กรณีเป็น object เดี่ยว
                                                        if (item.result.name_result === 'ตลาดศรีเมือง') {
                                                            priceSrimuang = item.result.price ?? '-';
                                                        } else if (item.result.name_result === 'ตลาดไท') {
                                                            priceTai = item.result.price ?? '-';
                                                        } else if (item.result.name_result === 'ตลาดสี่มุมเมือง') {
                                                            priceSimummuang = item.result.price ?? '-';
                                                        } else if (item.result.name_result === 'สำรวจ') {
                                                            priceSurvey = item.result.price ?? '-';
                                                        }
                                                    }

                                                    const isTooltipActive = activeTooltip.mainType === mainType && activeTooltip.idx === idx;
                                                    const handleRowClick = () => {
                                                        if (isTooltipActive) {
                                                            setActiveTooltip({ mainType: null, idx: null });
                                                        } else {
                                                            setActiveTooltip({ mainType, idx });
                                                        }
                                                    };
                                                    return (
                                                        <React.Fragment key={item.id_product}>
                                                            <tr className="fadein-row" onClick={handleRowClick} style={{ cursor: 'pointer', position: 'relative' }}>
                                                                <td className="text-center align-middle" style={{ background: 'rgba(255,255,255,0.85)' }}>{idx + 1}</td>
                                                                <td className="text-center align-middle" style={{ background: 'rgba(255,255,255,0.85)' }}>{item.name_pro || '-'}</td>
                                                                {showSrimuang && (
                                                                    <td className="text-center align-middle" style={{ background: 'rgba(255,255,255,0.85)' }}>{priceSrimuang}</td>
                                                                )}
                                                                {showTai && (
                                                                    <td className="text-center align-middle" style={{ background: 'rgba(255,255,255,0.85)' }}>{priceTai}</td>
                                                                )}
                                                                {showSimummuang && (
                                                                    <td className="text-center align-middle" style={{ background: 'rgba(255,255,255,0.85)' }}>{priceSimummuang}</td>
                                                                )}
                                                                {showSurvey && (
                                                                    <td className="text-center align-middle" style={{ background: 'rgba(255,255,255,0.85)' }}>{priceSurvey}</td>
                                                                )}
                                                                <td className="text-center align-middle" style={{ background: 'rgba(255,255,255,0.85)' }}>บาท&nbsp;/&nbsp;{item.unitname || '-'}</td>
                                                            </tr>
                                                            {isTooltipActive && (
                                                                <tr>
                                                                    <td colSpan={2 + [showSrimuang, showTai, showSimummuang, showSurvey].filter(Boolean).length} style={{ position: 'relative', padding: 0, border: 'none', background: 'transparent' }}>
                                                                        <div style={{
                                                                            position: 'absolute',
                                                                            left: '60%',
                                                                            top: -10,
                                                                            transform: 'translateX(-50%)',
                                                                            background: '#fffbe7e0',
                                                                            color: '#1a237e',
                                                                            border: '2.5px solid #ffd700',
                                                                            borderRadius: 16,
                                                                            boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
                                                                            padding: '40px 60px',
                                                                            zIndex: 10,
                                                                            fontWeight: 'bold',
                                                                            fontSize: 36,
                                                                            minWidth: 620,
                                                                            maxWidth: 900,
                                                                            marginTop: 0,
                                                                            marginBottom: 0,
                                                                            marginLeft: 0,
                                                                            marginRight: 0,
                                                                            pointerEvents: 'auto',
                                                                            textAlign: 'center',
                                                                        }}>
                                                                            {/* แสดงรูปภาพสินค้า ถ้ามี */}
                                                                            {typeof getProductImage === 'function' && getProductImage(idx) && (
                                                                                <img src={getProductImage(idx)} alt={item.name_pro} style={{ maxHeight: 180, maxWidth: 320, marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 12px #ffd70080' }} />
                                                                            )}
                                                                            <br />
                                                                            {item.name_pro || '-'}<br />
                                                                            ราคา&nbsp;{showSrimuang && priceSrimuang !== '-' ? priceSrimuang : ''}
                                                                            {showTai && priceTai !== '-' ? ` / ${priceTai}` : ''}
                                                                            {showSimummuang && priceSimummuang !== '-' ? ` / ${priceSimummuang}` : ''}
                                                                            {showSurvey && priceSurvey !== '-' ? ` / ${priceSurvey}` : ''}
                                                                            &nbsp;บาท&nbsp;/ {item.unitname || '-'}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </React.Fragment>
                                                    );

                                                })}
                                            </tbody>
                                        </table>
                                    </div> {/* Close table-responsive div here */}
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