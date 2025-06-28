import React, { useEffect } from 'react';
import { Baseurl } from './Baseurl';
import axios from 'axios';
import Menu from './Menu';

function Home() {
    const [mainTypes, setMainTypes] = React.useState([]);
    const [results, setResults] = React.useState([]); // แหล่งข้อมูล (ตลาด)
    const [dataProducts, setDataProducts] = React.useState([]);
    const [selectedDate, setSelectedDate] = React.useState(() => new Date().toISOString().slice(0,10));
    const [selectedMainType, setSelectedMainType] = React.useState('');
    const [selectedResult, setSelectedResult] = React.useState('');
    const [searchText, setSearchText] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        axios.get(Baseurl + '/app_maintypes')
            .then(response => setMainTypes(response.data))
            .catch(error => console.error('Error fetching main types:', error));
        axios.get(Baseurl + '/app_result')
            .then(response => setResults(response.data))
            .catch(error => console.error('Error fetching results:', error));
    }, []);

    useEffect(() => {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        const iduserCookie = cookies.find(cookie => cookie.startsWith('iduser='));
        if (!iduserCookie) {
            window.location.href = '/login';
        }
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {
                date: selectedDate,
                id_result: selectedResult || '-1',
                id_maintype: selectedMainType || ''
            };
            // ใช้ /app_showprice เพื่อ filter หลายเงื่อนไข
            const res = await axios.post(Baseurl + '/app_showprice', params);
            let products = res.data || [];
            // filter ด้วยชื่อถ้ามี
            if (searchText.trim()) {
                products = products.filter(p => (p.name_pro || '').includes(searchText.trim()));
            }
            setDataProducts(products);
        } catch (error) {
            setDataProducts([]);
            console.error('Error fetching products:', error);
        }
        setLoading(false);
    };

    // ดึงข้อมูลครั้งแรกเมื่อโหลดหน้า (optional)
    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="container-fluid min-vh-100 bg-light">
            <div className="row">
                <aside className="col-12 col-md-3 col-lg-2 bg-white shadow-sm p-0 border-end">
                    <Menu />
                </aside>
                <main className="col p-4 d-flex flex-column align-items-center justify-content-start">
                    <h2 className="display-5 fw-bold mb-4 text-center text-primary">List Price</h2>
                    <div className="w-100 mb-3">
                        <div className="row g-2 align-items-end mb-3">
                            <div className="col-auto">
                                <label className="form-label mb-1">วันที่</label>
                                <input type="date" className="form-control" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                            </div>
                            <div className="col-auto">
                                <label className="form-label mb-1">ชนิด</label>
                                <select className="form-select" value={selectedMainType} onChange={e => setSelectedMainType(e.target.value)}>
                                    <option value="">ทั้งหมด</option>
                                    {mainTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.name_maintype}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-auto">
                                <label className="form-label mb-1">แหล่งข้อมูล</label>
                                <select className="form-select" value={selectedResult} onChange={e => setSelectedResult(e.target.value)}>
                                    <option value="">ทั้งหมด</option>
                                    {results.map(r => (
                                        <option key={r.id} value={r.id}>{r.name_result}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-auto">
                                <label className="form-label mb-1">ค้นหาชื่อสินค้า</label>
                                <input type="text" className="form-control" placeholder="ค้นหาชื่อสินค้า..." value={searchText} onChange={e => setSearchText(e.target.value)} />
                            </div>
                            <div className="col-auto">
                                <button className="btn btn-primary" onClick={fetchProducts} disabled={loading}>
                                    {loading ? 'กำลังโหลด...' : 'ค้นหา'}
                                </button>
                            </div>
                            <div className="col-auto">
                                <button className="btn btn-outline-secondary" onClick={() => {
                                    setSelectedDate(new Date().toISOString().slice(0,10));
                                    setSelectedMainType('');
                                    setSelectedResult('');
                                    setSearchText('');
                                    fetchProducts();
                                }}>
                                    รีเซ็ต
                                </button>
                            </div>
                        </div>
                        <div className="table-responsive bg-white rounded shadow-sm p-3">
                            <table className="table table-bordered table-striped align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>ลำดับ</th>
                                        <th>ชื่อสินค้า</th>
                                        {['ตลาดศรีเมือง', 'ตลาดไท', 'ตลาดสี่มุมเมือง', 'สำรวจ'].map((col, i) => (
                                            <th key={i} className="text-center align-middle">{col}</th>
                                        ))}
                                        <th>หน่วย</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataProducts.length === 0 ? (
                                        <tr><td colSpan="7" className="text-center text-muted">ไม่พบข้อมูล</td></tr>
                                    ) : (
                                        dataProducts.map((item, idx) => {
                                            // เตรียมราคาตามแหล่ง
                                            let priceSrimuang = '-';
                                            let priceTai = '-';
                                            let priceSimummuang = '-';
                                            let priceSurvey = '-';
                                            if (Array.isArray(item.result)) {
                                                item.result.forEach(r => {
                                                    if (r.name_result === 'ตลาดศรีเมือง') priceSrimuang = r.price ?? '-';
                                                    else if (r.name_result === 'ตลาดไท') priceTai = r.price ?? '-';
                                                    else if (r.name_result === 'ตลาดสี่มุมเมือง') priceSimummuang = r.price ?? '-';
                                                    else if (r.name_result === 'สำรวจ') priceSurvey = r.price ?? '-';
                                                });
                                            } else if (item.result && typeof item.result === 'object') {
                                                if (item.result.name_result === 'ตลาดศรีเมือง') priceSrimuang = item.result.price ?? '-';
                                                else if (item.result.name_result === 'ตลาดไท') priceTai = item.result.price ?? '-';
                                                else if (item.result.name_result === 'ตลาดสี่มุมเมือง') priceSimummuang = item.result.price ?? '-';
                                                else if (item.result.name_result === 'สำรวจ') priceSurvey = item.result.price ?? '-';
                                            }
                                            return (
                                                <tr key={item.id_product + '-' + idx}>
                                                    <td className="text-center align-middle">{idx + 1}</td>
                                                    <td className="text-center align-middle">{item.name_pro || '-'}</td>
                                                    <td className="text-center align-middle">{priceSrimuang}</td>
                                                    <td className="text-center align-middle">{priceTai}</td>
                                                    <td className="text-center align-middle">{priceSimummuang}</td>
                                                    <td className="text-center align-middle">{priceSurvey}</td>
                                                    <td className="text-center align-middle">บาท&nbsp;/&nbsp;{item.unitname || '-'}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Home;