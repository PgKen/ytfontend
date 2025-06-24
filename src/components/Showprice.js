import React, { use, useEffect } from 'react';
import Menu from './Menu'; // Adjust the import path as necessary
import axios from 'axios';
import { Baseurl } from './Baseurl'; // Uncomment if you need to use Baseurl

function Showprice() {

    // State for main types

    const [mainTypes, setMainTypes] = React.useState([]);
    const [result, setResult] = React.useState([]); // State for results if needed


    const [dataProducts, setDataProducts] = React.useState([]); // State for products if needed

    const [loading, setLoading] = React.useState(false);

    // Fetch main types from backend

    function selectmaintypesid(id) {
        console.log('selectmaintypesid function called' + id);
        setLoading(true);
        axios.get(`${Baseurl}/app_showprice/${id}`)
            .then(response => {
                console.log('Fetched maintype data:', response.data);
                // You can set state here if you want to use the data
                if (response.data.length === 0 || response.data === null) {
                    setDataProducts([]);
                    setLoading(false);
                    return;
                }
                setLoading(false);
                console.log('Setting data products:', response.data[0]);
                setDataProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching maintype by id:', error);
            });
    }


    useEffect(() => {
        axios.get(Baseurl + '/app_maintypes')

            .then(response => {
                console.log('Fetched main types:', response.data[0]);
                setMainTypes(response.data);
            })
            .catch(error => {
                console.error('Error fetching main types:', error);
            });
    }, []);


    useEffect(() => {
        axios.get(Baseurl + '/app_result')
            .then(response => {
                console.log('Fetched results:', response.data[0]);
                setResult(response.data);
            })
            .catch(error => {
                console.error('Error fetching results:', error);
            });
    }, []);

    useEffect(() => {

        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        const iduserCookie = cookies.find(cookie => cookie.startsWith('iduser='));
        if (!iduserCookie) {
            window.location.href = '/login';
        }
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
    function handleMainTypeChange(e) {
        const value = e.target.value;
        if (value === "0") {
            setLoading(false);
            setDataProducts([]);
            return;
        }
        selectmaintypesid(value);
    }

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

    return (
        <div className="container-fluid min-vh-100 bg-light">
            <div className="row">
                <aside className="col-12 col-md-3 col-lg-2 bg-white shadow-sm p-0 border-end">
                    <Menu />
                </aside>
                <main className="col p-4 d-flex flex-column align-items-center justify-content-start">
                    <h2 className="display-5 fw-bold mb-4 text-center text-primary kanit-light">Show Price</h2>
                    <div className="row w-100 mb-4">
                        <div className="col-md-3 mb-3">
                            <label htmlFor="price-date" className="form-label">Date</label>
                            <input
                                type="date"
                                id="price-date"
                                name="price-date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label htmlFor="main-type" className="form-label kanit-light">ประเภทหลัก</label>
                            <select
                                id="main-type"
                                name="main-type"
                                className="form-select"
                                onChange={handleMainTypeChange}
                                value={mainTypeValue}
                            >
                                <option value="0">เลือกประเภท</option>
                                <option value="-1">เลือกทั้งหมด</option>
                                {mainTypes.map((type, index) => (
                                    <option key={index} value={type.id}>
                                        {type.name_maintype}
                                    </option>
                                ))}
                            </select>
                            {mainTypeError && (
                                <div className="text-danger small mt-1">{mainTypeError}</div>
                            )}
                        </div>
                        <div className="col-md-3 mb-3">
                            <label htmlFor="source-type" className="form-label kanit-light">แหล่งที่มา</label>
                            <select
                                id="source-type"
                                name="source-type"
                                className="form-select"
                                value={sourceTypeValue}
                                onChange={handleSourceTypeChange}
                            >
                                <option value="0">เลือกแหล่งที่มา</option>
                                <option value="-1">เลือกทั้งหมด</option>
                                {result.map((result, index) => (
                                    <option key={index} value={result.id}>
                                        {result.name_result}
                                    </option>
                                ))}
                            </select>
                            {sourceTypeError && (
                                <div className="text-danger small mt-1">{sourceTypeError}</div>
                            )}
                        </div>
                        <div className="col-md-3 mb-3 d-flex align-items-end">
                            <button
                                type="button"
                                className="btn btn-success w-100"
                                disabled={isSubmitDisabled}
                                onClick={async () => {
                                    setLoading(true);
                                    let hasError = false;
                                    if (mainTypeValue === "0") {
                                        setMainTypeError('กรุณาเลือกประเภทหลัก');
                                        hasError = true;
                                    }
                                    if (sourceTypeValue === "0") {
                                        setSourceTypeError('กรุณาเลือกแหล่งที่มา');
                                        hasError = true;
                                    }
                                    if (hasError) return;

                                    try {
                                        const response = await axios.post(`${Baseurl}/app_showprice`, {
                                            date: date,
                                            id_result: sourceTypeValue,
                                            id_maintype: mainTypeValue,
                                        });
                                        if (response.data && response.status === 200) {
                                            setLoading(false);
                                            setDataProducts(response.data);
                                        } else {
                                            alert('เกิดข้อผิดพลาดในการบันทึก');
                                        }
                                    } catch (error) {
                                        alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
                                        console.error(error);
                                    }
                                }}
                            >
                                ตกลง
                            </button>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-secondary mb-3"
                        style={{ alignSelf: 'flex-end' }}
                        onClick={() => {
                            const target = document.body.scrollHeight - window.innerHeight;
                            window.scrollTo({ top: target, behavior: 'smooth' });
                        }}
                    >
                        เลื่อนไปด้านล่าง
                    </button>
                    <div className="card w-100 shadow-sm">
                        <div className="card-body">
                            <h3 className="h5 mb-4">Products</h3>
                            {loading ? (
                                <p>Loading products...</p>
                            ) : (
                                <table className="table table-bordered table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>ชื่อสินค้า</th>
                                            <th>ราคา</th>
                                            <th>แหล่งที่มา</th>
                                            {/* <th>id_result_array</th> */}
                                            {/* <th>price_array</th> */}
                                            <th>หน่วย</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataProducts.map((product, index) => (
                                            <tr key={index}>
                                                <td>{product.name_pro}</td>
                                                <td>{product.price_array}</td>
                                                {/* <td>{product.price}</td> */}
                                                <td>{product.id_result_array}</td>
                                                {/* <td>{product.id_unit}</td> */}
                                                {/* <td>xxx</td> */}
                                                <td>{product.unitname}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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

export default Showprice;