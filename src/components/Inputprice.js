import React, { useEffect } from 'react';
import Menu from './Menu'; // Adjust the import path as necessary
import axios from 'axios';
import { Baseurl } from './Baseurl'; // Uncomment if you need to use Baseurl

function InputPrice() {

    // State for main types
    const [mainTypes, setMainTypes] = React.useState([]);
    const [dataProducts, setDataProducts] = React.useState([]); // State for products if needed
    const [unit, setUnit] = React.useState([]); // State for units if needed
    const [loading, setLoading] = React.useState(false);

    // Fetch main types from backend

    function selectmaintypesid(id) {
        console.log('selectmaintypesid function called' + id);
        setLoading(true);
        axios.get(`${Baseurl}/app_getmaintypes/${id}`)
            .then(response => {
                console.log('Fetched maintype data:', response.data);
                // You can set state here if you want to use the data
                if( response.data.length === 0 || response.data === null) {
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
        axios.get(Baseurl + '/app_unit')
            .then(response => {
                console.log('Fetched units:', response.data);
                
                setUnit(response.data);
            })
            .catch(error => {   
                console.error('Error fetching units:', error);
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

    return (
        <div className="container-fluid min-vh-100 bg-light">
            <div className="row">
                <aside className="col-12 col-md-3 col-lg-2 bg-white shadow-sm p-0 border-end">
                    <Menu />
                </aside>
                <main className="col p-4 d-flex flex-column align-items-center justify-content-start">
                    <h2 className="display-5 fw-bold mb-4 text-center text-primary kanit-light">Input Price</h2>
                    <div className="row w-100 mb-4">
                        <div className="col-md-6 mb-3">
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
                        <div className="col-md-6 mb-3">
                            <label htmlFor="main-type" className="form-label kanit-light">ประเภทหลัก</label>
                            <select
                                id="main-type"
                                name="main-type"
                                className="form-select"
                                onChange={handleMainTypeChange}
                            >
                                <option value="0">เลือกประเภท</option>
                                {mainTypes.map((type, index) => (
                                    <option key={index} value={type.id}>
                                        {type.name_maintype}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="card w-100 shadow-sm">
                        <div className="card-body">
                            <h3 className="h5 mb-4">Products</h3>
                            {loading ? (
                                <p>Loading products...</p>
                            ) : (
                                <table className="table table-bordered table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            {/* <th>Product ID</th> */}
                                            <th>Product Name</th>
                                            <th>Price</th>
                                            <th>Unit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataProducts.map((product, index) => (
                                            <tr key={index}>
                                                {/* <td>{product.id_prod}</td> */}
                                                <td>{product.name_pro}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Enter price"
                                                        min="0"
                                                        step="0.01"
                                                        onKeyDown={e => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                const next = document.querySelector(
                                                                    `input[data-input-index='${index + 1}-0']`
                                                                );
                                                                if (next) next.focus();
                                                            }
                                                        }}
                                                        data-input-index={`${index}-0`}
                                                    />
                                                </td>
                                                <td>
                                                    <select
                                                        className="form-select"
                                                        value={product.id_unit || ''}
                                                        onChange={e => console.log(`Selected unit for product ${product.id_prod}: ${e.target.value}`)}
                                                    >
                                                        <option value="">Select unit</option>
                                                        {unit.map((u, idx) => (
                                                            <option key={idx} value={u.id_unit}>
                                                                {u.unitname}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                             
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default InputPrice;