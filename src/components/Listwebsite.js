import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import axios from 'axios';
import { Baseurl } from './Baseurl';

function Listwebsite() {
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ name_website: '', url_website: '', web_status: 1 });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchWebsites = () => {
        setLoading(true);
        axios.get(Baseurl + '/app_listwebsite')
            .then(res => {
                setWebsites(res.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
            });
    };

    useEffect(() => {
        fetchWebsites();
    }, []);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!form.name_website || !form.url_website) {
            setError('กรุณากรอกข้อมูลให้ครบ');
            return;
        }
        const method = editId ? 'put' : 'post';
        const url = Baseurl + '/app_listwebsite' + (editId ? `/${editId}` : '');
        axios[method](url, form)
            .then(() => {
                setSuccess(editId ? 'แก้ไขสำเร็จ' : 'เพิ่มสำเร็จ');
                setForm({ name_website: '', url_website: '', web_status: 1 });
                setEditId(null);
                fetchWebsites();
            })
            .catch(() => setError('บันทึกข้อมูลไม่สำเร็จ'));
    };

    const handleEdit = w => {
        setEditId(w.id);
        setForm({ name_website: w.name_website, url_website: w.url_website, web_status: w.web_status });
    };

    const handleDelete = id => {
        if (!window.confirm('ยืนยันการลบ?')) return;
        axios.delete(Baseurl + `/app_listwebsite/${id}`)
            .then(() => {
                setSuccess('ลบสำเร็จ');
                fetchWebsites();
            })
            .catch(() => setError('ลบไม่สำเร็จ'));
    };

    return (
        <div className="container-fluid min-vh-100 bg-light">
            <div className="row">
                <aside className="col-12 col-md-3 col-lg-2 bg-white shadow-sm p-0 border-end">
                    <Menu />
                </aside>
                <main className="col p-4 d-flex flex-column align-items-center justify-content-start">
                    <h4 className="fw-bold mb-2 text-center text-primary kanit-light" style={{ fontSize: 26 }}>แหล่งที่มาเว็บไซต์</h4>
                    <form className="card mb-4 p-3 shadow-sm" style={{ width: '80%', maxWidth: 800 }} onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label className="form-label">ชื่อเว็บไซต์</label>
                            <input type="text" className="form-control" name="name_website" value={form.name_website} onChange={handleChange} required />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">URL</label>
                            <input type="url" className="form-control" name="url_website" value={form.url_website} onChange={handleChange} required />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">สถานะ</label>
                            <select className="form-select" name="web_status" value={form.web_status} onChange={handleChange}>
                                <option value={1}>ใช้งาน</option>
                                <option value={0}>ไม่ใช้งาน</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-success">{editId ? 'บันทึกการแก้ไข' : 'เพิ่ม'}</button>
                        {editId && <button type="button" className="btn btn-secondary ms-2" onClick={() => { setEditId(null); setForm({ name_website: '', url_website: '', web_status: 1 }); }}>ยกเลิก</button>}
                        {error && <div className="alert alert-danger mt-2">{error}</div>}
                        {success && <div className="alert alert-success mt-2">{success}</div>}
                    </form>
                    <div className="w-100" style={{ maxWidth: 1000 }}>
                        {loading ? <div>กำลังโหลด...</div> : (
                            <div className="list-group">
                                {websites.length === 0 ? <div className="text-center">ไม่พบข้อมูล</div> : websites.map((w, idx) => (
                                    <div key={w.id} className="list-group-item mb-3" style={{ borderRadius: 8, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="badge bg-primary me-2">{idx + 1}</span>
                                            <span className="fw-bold">{w.name_website}</span>
                                            <span className={`badge ms-2 ${w.web_status ? 'bg-success' : 'bg-secondary'}`}>{w.web_status ? 'ใช้งาน' : 'ไม่ใช้งาน'}</span>
                                        </div>
                                        <div className="mb-2">
                                            <a href={w.url_website} target="_blank" rel="noopener noreferrer">{w.url_website}</a>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-warning btn-sm" onClick={() => handleEdit(w)}><i className="bi bi-pencil-square"></i> แก้ไข</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(w.id)}><i className="bi bi-trash"></i> ลบ</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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

export default Listwebsite;
