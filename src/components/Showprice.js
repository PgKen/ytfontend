import React, { useState, useEffect } from 'react';
import Menu from './Menu'; // Adjust the import path as necessary
import axios from 'axios';
import { Baseurl, msg } from './Baseurl'; // Uncomment if you need to use Baseurl

function Showprice() {

    // State for main types

    const [mainTypes, setMainTypes] = React.useState([]);
    const [result, setResult] = React.useState([]); // State for results if needed

    const [indexImg, setIndexImg] = React.useState(0); // State for image index


    const [dataProducts, setDataProducts] = React.useState([]); // State for products if needed

    const [loading, setLoading] = React.useState(false);

    const [showMsg, setShowMsg] = useState(false);


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
    const groupedByMainType = dataProducts.reduce((acc, item) => {
        const mainType = item.name_maintype || 'ไม่ระบุประเภทหลัก';
        if (!acc[mainType]) acc[mainType] = [];
        acc[mainType].push(item);
        return acc;
    }, {});

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
    const [showTai, setShowTai] = useState(true);
    const [showSimummuang, setShowSimummuang] = useState(true);
    const [showSrimuang, setShowSrimuang] = useState(true);
    const [showSurvey, setShowSurvey] = useState(true);

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

    return (
        <div className="container-fluid min-vh-100 bg-light">
            <div className="row">
                <aside className="col-12 col-md-3 col-lg-2 bg-white shadow-sm p-0 border-end">
                    <Menu />
                </aside>
                <main className="col p-4 d-flex flex-column align-items-center justify-content-start">
                    {/* <h2 className="display-5 fw-bold mb-2 text-center text-primary kanit-light">ราคาผักวันนี้</h2>
                    <div className="mb-4 text-center text-secondary">
                        ลงวันที่ {formatThaiDate(date)}
                    </div> */}
                    <div className="row w-100 mb-4">
                        <div className="col-md-4 mb-2">
                            <label className="form-label">เลือกชนิด (ประเภทหลัก)</label>
                            <select
                                className="form-select"
                                value={mainTypeValue}
                                onChange={handleMainTypeChange}
                            >
                                <option value="0">-- เลือกทั้งหมด --</option>
                                {mainTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name_maintype}</option>
                                ))}
                            </select>
                            {mainTypeError && <div className="text-danger small">{mainTypeError}</div>}
                        </div>
                        {/* ...existing form code... */}
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
                        <div className="mb-4 d-flex justify-content-end gap-2">
                            {/*  */}
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                style={{ maxWidth: 180, display: 'inline-block' }}
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
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
                            &nbsp;&nbsp;
                            <button
                                type="button"
                                className="btn btn-outline-info btn-sm"
                                onClick={() => setShowMsg(v => !v)}
                                style={{ float: 'right' }}
                            >
                                {showMsg ? 'ซ่อนข้อความ' : 'แสดงข้อความ'}
                            </button>
                            {/*  */}
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => setTableWidth(w => Math.max(30, w - 10))}
                            >
                                - ลดความกว้าง
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => setTableWidth(w => Math.min(100, w + 10))}
                            >
                                + เพิ่มความกว้าง
                            </button>
                            <button
                                type="button"
                                className={`btn btn-${showBg ? 'danger' : 'success'} btn-sm`}
                                onClick={() => setShowBg(v => !v)}
                            >
                                {showBg ? 'ปิดพื้นหลัง' : 'แสดงพื้นหลัง'}
                            </button>
                            {/* ปุ่มเปลี่ยนรูปพื้นหลัง */}
                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => setIndexImg(i => Math.max(0, i - 1))}
                                disabled={indexImg <= 0}
                            >
                                &lt; รูปก่อนหน้า
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => setIndexImg(i => (dataImges.length > 0 ? Math.min(dataImges.length - 1, i + 1) : 0))}
                                disabled={indexImg >= dataImges.length - 1}
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
                            (() => {
                                let globalIndex = 1;
                                return Object.entries(groupedByMainType).map(([mainType, items]) => (
                                    <div key={mainType} className="mb-5"
                                        style={{
                                            width: tableWidth === 'fixed' ? '576px' : `${tableWidth}%`,
                                            height: tableWidth === 'fixed' ? '1024px' : undefined,
                                            transition: 'width 0.3s',
                                            border: '1px solid #CCC',
                                            borderRadius: 8,
                                            padding: '30px 40px',

                                            // backgroundImage: showBg && dataImges.length > 0 && dataImges[0]?.name_img ? `url(http://localhost:4222/upload/${encodeURIComponent(dataImges[0].name_img)})` : 'none',
                                            // backgroundImage: showBg && dataImges[0]?.name_img ? `url('http://localhost:4222/upload/image%20(11)_20250625_212337-528746713.png')` : 'none',
                                            backgroundImage: showBg && dataImges[0]?.name_img ? `url('${Baseurl}/upload/${dataImges[indexImg].name_img}')` : 'none',
                                            backgroundSize: 'cover',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'top center',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                            // ลด Opacity เพื่อให้เห็นภาพ background ด้านหลังมากขึ้น
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
                                                    {items.map((item) => {
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

                                                        const row = (
                                                            <tr key={item.id_product}>
                                                                <td className="text-center align-middle" style={{ background: 'rgba(255,255,255,0.85)' }}>{globalIndex}</td>
                                                                <td className="text-center align-middle" style={{ background: 'rgba(255,255,255,0.85)' }}>{item.name_pro || '-'}</td>
                                                                {/* <td>{item. || '-'}</td> */}
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
                                                        );
                                                        globalIndex++;
                                                        return row;
                                                    })}
                                                </tbody>
                                            </table>
                                            <div className="mt-3 text-secondary small text-center"
                                                style={{
                                                    background: 'linear-gradient(90deg, #ffe066 0%, #ffd700 100%)',
                                                    borderRadius: 8,
                                                    padding: '10px 0',
                                                    color: '#7a4f01',
                                                    fontWeight: 'bold',
                                                    letterSpacing: 0.5,
                                                    boxShadow: '0 2px 8px rgba(255, 215, 0, 0.15)'
                                                }}
                                            >
                                                ราคาอ้างอิงจากเว็ปไซต์ ตลาดศรีเมือง ตลาดไท ตลาดสี่มุมเมือง และการสำรวจตลาด
                                            </div>

                                        </div>

                                    </div>
                                ));
                            })()
                        )}
                    </div>

                    <div className="d-flex flex-wrap gap-2 justify-content-center my-3">
                        <span className="fw-bold">แสดง/ซ่อนคอลัมน์:</span>
                        <button type="button" className={`btn btn-sm btn-${showSrimuang ? 'primary' : 'outline-primary'}`} onClick={() => setShowSrimuang(v => !v)}>
                            ตลาดศรีเมือง
                        </button>
                        <button type="button" className={`btn btn-sm btn-${showTai ? 'primary' : 'outline-primary'}`} onClick={() => setShowTai(v => !v)}>
                            ตลาดไท
                        </button>
                        <button type="button" className={`btn btn-sm btn-${showSimummuang ? 'primary' : 'outline-primary'}`} onClick={() => setShowSimummuang(v => !v)}>
                            ตลาดสี่มุมเมือง
                        </button>
                        <button type="button" className={`btn btn-sm btn-${showSurvey ? 'primary' : 'outline-primary'}`} onClick={() => setShowSurvey(v => !v)}>
                            สำรวจ
                        </button>
                    </div>
                    <br />

                    <button
                        type="button"
                        className="btn btn-primary position-fixed"
                        style={{ bottom: '30px', right: '30px', zIndex: 1000 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        เลื่อนไปด้านบน
                    </button>
                </main>
            </div>
            <br />
            <br />

        </div>
    );
}

export default Showprice;