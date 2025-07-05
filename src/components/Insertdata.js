import React, { useState, useEffect } from 'react';
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
  const [productList, setProductList] = useState([]);
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState('');
  const [insertedNames, setInsertedNames] = useState([]);
  const [updatedNames, setUpdatedNames] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState('');
  const [marketList, setMarketList] = useState([]);
  const [marketLoading, setMarketLoading] = useState(false);
  const [marketError, setMarketError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  let recognition = null;
  let searchTimeout = null;
  if (typeof window !== 'undefined') {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.lang = 'th-TH';
      recognition.continuous = true; // ฟังต่อเนื่อง
      recognition.interimResults = false;
    }
  }

  useEffect(() => {
    setProductLoading(true);
    axios.get(`${Baseurl}/app_product_req`)
      .then(res => {
        setProductList(res.data || []);
        setProductLoading(false);
      })
      .catch(() => {
        setProductError('เกิดข้อผิดพลาดในการดึงรายการผัก');
        setProductLoading(false);
      });
  }, []);

  useEffect(() => {
    setMarketLoading(true);
    axios.get(`${Baseurl}/listresult`)
      .then(res => {
        setMarketList(res.data || []);
        setMarketLoading(false);
      })
      .catch(() => {
        setMarketError('เกิดข้อผิดพลาดในการดึงรายการตลาด');
        setMarketLoading(false);
      });
  }, []);

  // ตรวจจับคำว่า "บันทึก" ใน textarea แล้ว submit อัตโนมัติ
  useEffect(() => {
    if (!loading && typeof data === 'string' && data.includes('บันทึก')) {
      // ลบคำว่า "บันทึก" ออก แล้ว submit
      const newData = data.replace('บันทึก', '').trim();
      setData(newData);
      setTimeout(() => {
        // หา form แล้ว trigger submit
        const form = document.querySelector('form');
        if (form) form.requestSubmit();
      }, 100); // รอ setData เสร็จ
    }
    // eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    document.title = "Copy Price | ลงข้อมูลชุดราคา";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultMsg('');
    setErrorMsg('');
    setInsertedNames([]);
    setUpdatedNames([]);
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
      setInsertedNames(res.data.insertedNames || []);
      setUpdatedNames(res.data.updatedNames || []);
      setData('');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    setMicError('');
    setData(''); // clear textarea เมื่อเริ่มฟังไมค์
    if (!recognition) {
      setMicError('เบราว์เซอร์นี้ไม่รองรับการใช้ไมโครโฟน');
      return;
    }
    setIsListening(true);
    recognition.start();
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      // แทนที่การขึ้นบรรทัดใหม่ (\n, \r, \r\n) ด้วยช่องว่างเดียว
      transcript = transcript.replace(/\r?\n|\r/g, ' ');
      // แทนที่ช่องว่างติดกันหลายตัวด้วยช่องว่างเดียว (normalize space)
      transcript = transcript.replace(/\s+/g, ' ');
      // ถ้าเจอคำว่า "ขีด" ให้เว้นวรรค 1 ช่องหลัง "ขีด"
      transcript = transcript.replace(/ขีด/g, 'ขีด ');
      // ถ้าเจอคำว่า "บาท" ให้ขึ้นบรรทัดใหม่หลัง "บาท"
      transcript = transcript.replace(/บาท/g, 'บาท\n');
      // ถ้าเจอคำว่า ตลาดไท, ตลาดสี่มุมเมือง, ตลาดศรีเมือง, สำรวจ ให้เว้นวรรค 1 ช่องหลังคำนั้น
      transcript = transcript.replace(/(ตลาดไท|ตลาดสี่มุมเมือง|ตลาดศรีเมือง|สำรวจ)/g, '$1 ');
      setData(prev => prev ? prev + transcript : transcript);
      if (transcript.includes('บันทึก')) {
        recognition.stop();
        setIsListening(false);
      }
    };
    recognition.onerror = (event) => {
      setMicError('เกิดข้อผิดพลาด: ' + event.error);
      setIsListening(false);
    };
    recognition.onend = () => {
      // ถ้าไม่ได้หยุดเพราะพูด "บันทึก" ให้ฟังต่อ (auto restart)
      if (isListening) recognition.start();
    };
  };

  const stopListening = () => {
    if (recognition) recognition.stop();
    setIsListening(false);
  };

  const handleAddMarket = (marketName) => {
    // เติมชื่อและ - ต่อท้าย ถ้ามีข้อมูลแล้วให้ขึ้นบรรทัดใหม่ จากนั้นเลื่อน cursor ไปท้ายสุด
    const insertText = (data ? '\n' : '') + marketName + '-';
    setData(prev => prev ? prev + '\n' + marketName + '-' : marketName + '-');
    setTimeout(() => {
      const textarea = document.getElementById('data-input');
      if (textarea) {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
      }
    }, 0);
  };

  // ฟังก์ชันค้นหาชื่อสินค้า
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setSearchError('');
    setSearchResults([]);
    if (searchTimeout) clearTimeout(searchTimeout);
    if (value.length >= 3) {
      setSearchLoading(true);
      searchTimeout = setTimeout(() => {
        axios.get(`${Baseurl}/app_searchname?q=${encodeURIComponent(value)}`)
          .then(res => {
            setSearchResults(res.data || []);
            setSearchLoading(false);
          })
          .catch(() => {
            setSearchError('เกิดข้อผิดพลาดในการค้นหา');
            setSearchLoading(false);
          });
      }, 350); // debounce 350ms
    }
  };

  const handleSelectProduct = (name) => {
    // เติมชื่อผักต่อท้าย cursor ใน textarea โดยไม่ขึ้นบรรทัดใหม่ และมี - ต่อท้าย
    const textarea = document.getElementById('data-input');
    const insertText = name + '-';
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = data.substring(0, start);
      const after = data.substring(end);
      const newValue = before + insertText + after;
      setData(newValue);
      // set cursor ต่อท้ายชื่อที่แทรก
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + insertText.length;
      }, 0);
    } else {
      setData(prev => prev ? prev + insertText : insertText);
    }
    setSearchText('');
    setSearchResults([]);
  };

  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row">
        <aside className="col-12 col-md-3 col-lg-2 bg-white shadow-sm p-0 border-end">
          <Menu />
        </aside>
        <main className="col p-4 d-flex flex-column align-items-center justify-content-start">
          <h2 className="display-5 fw-bold mb-4 text-center text-primary kanit-light" style={{fontSize:"24px"}}>Insert Data</h2>
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
              {/* ปุ่มเลือกตลาด */}
              <div className="mb-3">
                <label className="form-label">เลือกตลาด (คลิกเพื่อเติมในช่องข้อมูล)</label>
                {marketLoading ? (
                  <div>กำลังโหลด...</div>
                ) : marketError ? (
                  <div className="text-danger">{marketError}</div>
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {marketList.map((market, idx) => (
                      <button
                        type="button"
                        key={market.id || idx}
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleAddMarket(market.name_result)}
                      >
                        {market.name_result}
                      </button>
                    ))}
                  </div>
                )}
              </div>

                    <div className="mb-3">
                <label className="form-label">ค้นหาชื่อผัก (พิมพ์อย่างน้อย 3 ตัวอักษร)</label>
                <input
                  type="text"
                  className="form-control"
                  value={searchText}
                  onChange={handleSearchChange}
                  placeholder="ค้นหาชื่อผัก..."
                />
                {searchLoading && <div className="small text-muted">กำลังค้นหา...</div>}
                {searchError && <div className="text-danger small">{searchError}</div>}
                {searchResults.length > 0 && (
                  <ul className="list-group position-absolute w-100" style={{ zIndex: 10, maxHeight: 200, overflowY: 'auto' }}>
                    {searchResults.map(prod => (
                      <li
                        key={prod.id_product}
                        className="list-group-item list-group-item-action"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSelectProduct(prod.name_pro)}
                      >
                        {prod.name_pro}
                      </li>
                    ))}
                  </ul>
                )}
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
              <div className="mb-3 d-flex align-items-center gap-2">
                <button type="button" className={`btn btn-${isListening ? 'danger' : 'primary'} btn-sm`} onClick={isListening ? stopListening : startListening} style={{ minWidth: 90 }}>
                  {isListening ? 'หยุดพูด' : 'พูดใส่ไมค์'} <i className={`bi bi-mic${isListening ? '-mute' : ''}`}></i>
                </button>
                {micError && <span className="text-danger small">{micError}</span>}
              </div>
        
              {/* <div className="mb-3">
                <label className="form-label">รายการผักที่สามารถ Insert/Update ได้</label>
                {productLoading ? (
                  <div>กำลังโหลด...</div>
                ) : productError ? (
                  <div className="text-danger">{productError}</div>
                ) : (
                  <div className="border rounded p-2 bg-light" style={{ maxHeight: 120, overflowY: 'auto', fontSize: 15 }}>
                    {productList.map((prod, idx) => (
                      <span key={prod.id_product} className="badge bg-info text-dark me-2 mb-1">{prod.name_pro}</span>
                    ))}
                  </div>
                )}
              </div> */}
              <button type="submit" className="btn btn-success" disabled={loading || !data}>
                {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
              </button>
              {/* ปุ่ม Clear Input */}
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => setData('')}
                disabled={loading || !data}
              >
                ล้างข้อมูล
              </button>
              
              {resultMsg && <div className="alert alert-success mt-3">{resultMsg}
                {(insertedNames.length > 0 || updatedNames.length > 0) && (
                  <div className="mt-2">
                    {insertedNames.length > 0 && (
                      <div>
                        <span className="fw-bold text-success">Insert:</span> {insertedNames.map((name, i) => <span key={i} className="badge bg-success text-light me-1">{name}</span>)}
                      </div>
                    )}
                    {updatedNames.length > 0 && (
                      <div>
                        <span className="fw-bold text-warning">Update:</span> {updatedNames.map((name, i) => <span key={i} className="badge bg-warning text-dark me-1">{name}</span>)}
                      </div>
                    )}
                  </div>
                )}
              </div>}
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
