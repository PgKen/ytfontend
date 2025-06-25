import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import axios from 'axios';
import { Baseurl } from './Baseurl';

function Prompt() {
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableWidth, setTableWidth] = useState(100);
    const [showBg, setShowBg] = useState(false);
    const [dataImges, setDataImges] = useState([]);

    useEffect(() => {
        setLoading(true);
        axios.get(Baseurl + '/app_listprompts')
            .then(response => {
                setPrompts(response.data);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                console.error('Error fetching prompts:', error);
            });
    }, []);

    useEffect(() => {
        axios.get(Baseurl + '/app_listimg')
            .then(response => {
                setDataImges(response.data);
            })
            .catch(error => {
                console.error('Error fetching image list:', error);
            });
    }, []);

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

    // ฟังก์ชันคัดลอกข้อความไปยัง clipboard
    function handleCopy(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            // fallback สำหรับ browser เก่า
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    }

    return (
        <div className="container-fluid min-vh-100 bg-light">
            <div className="row">
                <aside className="col-12 col-md-3 col-lg-2 bg-white shadow-sm p-0 border-end">
                    <Menu />
                </aside>
                <main className="col p-4 d-flex flex-column align-items-center justify-content-start">
                    <h2 className="display-5 fw-bold mb-2 text-center text-primary kanit-light">รายการ Prompt</h2>
                    <div className="mb-4 text-center text-secondary">
                        อัปเดตล่าสุด {prompts[0]?.created_at ? formatThaiDate(prompts[0].created_at) : '-'}
                    </div>
                    <div className="w-100">
                        <div className="mb-2 d-flex justify-content-end gap-2">
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
                        </div>
                        <div
                            className="mb-5"
                            style={{
                                width: `${tableWidth}%`,
                                transition: 'width 0.3s',
                                border: '1px solid #CCC',
                                borderRadius: 8,
                                padding: '30px 100px',
                                backgroundImage: showBg && dataImges[0]?.name_img ? `url(${Baseurl}/upload/${dataImges[0].name_img})` : 'none',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                backgroundColor: showBg
                                    ? 'rgba(255,255,255,0.85)'
                                    : '#f8fafc',
                                color: '#222',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                        >
                            {loading ? (
                                <div className="text-center my-4">กำลังโหลด...</div>
                            ) : prompts.length === 0 ? (
                                <div className="text-center my-4">ไม่พบข้อมูล</div>
                            ) : (
                                <div className="list-group">
                                    {prompts.map((item, idx) => (
                                        <div key={item.id} className="list-group-item mb-3" style={{ borderRadius: 8, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                            <div className="d-flex align-items-center mb-2">
                                                <span className="badge bg-primary me-2">{idx + 1}</span>
                                                <span className="fw-bold">{item.title_prompt || 'Prompt'}</span>
                                            </div>
                                            <div className="text-secondary mb-1" style={{ fontSize: 15 }}>
                                                {item.name_prompt}
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary btn-sm ms-2"
                                                    title="Copy to clipboard"
                                                    onClick={() => handleCopy(item.name_prompt)}
                                                    style={{ padding: '2px 8px', fontSize: 13 }}
                                                >
                                                    Copy
                                                </button>
                                            </div>
                                            <div className="text-end text-muted small">{item.created_at ? formatThaiDate(item.created_at) : '-'}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            <button
                type="button"
                className="btn btn-primary position-fixed"
                style={{ bottom: '30px', right: '30px', zIndex: 1000 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                เลื่อนไปด้านบน
            </button>
        </div>
    );
}

export default Prompt;
