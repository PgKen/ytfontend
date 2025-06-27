import React, { useState } from 'react';
import axios from 'axios';
import Menu from './Menu';
import { Baseurl } from './Baseurl';

function Insertdata() {
  const [data, setData] = useState('');
  const [priceDate, setPriceDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [priceTime, setPriceTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 8);
  });
  const [loading, setLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultMsg('');
    setErrorMsg('');
    try {
      const res = await axios.post(`${Baseurl}/app_insertdata`, {
        data,
        price_date: priceDate,
        price_time: priceTime,
      });
      setResultMsg(
        (res.data.inserted > 0 ? `Insert: ${res.data.inserted} รายการ` : '') +
        (res.data.updated > 0 ? (res.data.inserted > 0 ? ' | ' : '') + `Update: ${res.data.updated} รายการ` : '')
      );
      setData('');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row">
        <aside className="col-12 col-md-3 col-lg-2 bg-white shadow-sm p-0 border-end">
          <Menu />
        </aside>
        <main className="col p-4 d-flex flex-column align-items-center justify-content-start">
          <h2 className="display-5 fw-bold mb-4 text-center text-primary kanit-light">Insert Data (Text/Array)</h2>
          <form className="card w-100 shadow-sm mb-4" style={{ maxWidth: 700 }} onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="price-date" className="form-label">Date</label>
                <input
                  type="date"
                  id="price-date"
                  name="price-date"
                  value={priceDate}
                  onChange={e => setPriceDate(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="price-time" className="form-label">Time</label>
                <input
                  type="time"
                  id="price-time"
                  name="price-time"
                  value={priceTime}
                  onChange={e => setPriceTime(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="data-input" className="form-label">Data (1 บรรทัดต่อ 1 รายการ เช่น ตลาดไท-ผักบุ้งไทย-24-บาท/มัด)</label>
                <textarea
                  id="data-input"
                  name="data-input"
                  className="form-control"
                  rows={8}
                  value={data}
                  onChange={e => setData(e.target.value)}
                  placeholder="ตลาดไท-ผักบุ้งไทย-24-บาท/มัด\nตลาดสี่มุมเมือง-ผักบุ้งจีน-30-บาท/มัด"
                  required
                />
              </div>
              <button type="submit" className="btn btn-success" disabled={loading || !data}>
                {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
              </button>
              {resultMsg && <div className="alert alert-success mt-3">{resultMsg}</div>}
              {errorMsg && <div className="alert alert-danger mt-3">{errorMsg}</div>}
            </div>
          </form>
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

export default Insertdata;
