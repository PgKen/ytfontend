import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Menu from './Menu';
import { Baseurl } from './Baseurl';

const PAGE_SIZE = 20;

function Showproductconf() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [search, setSearch] = useState("");
    const [showOnly, setShowOnly] = useState(false);
    const [promptList, setPromptList] = useState([]);
    const [promptLoading, setPromptLoading] = useState(false);
    const [promptError, setPromptError] = useState("");

    useEffect(() => {
        setLoading(true);
        axios.get(`${Baseurl}/app_listshow?page=${page}&limit=${PAGE_SIZE}&search=${encodeURIComponent(search)}`)
            .then(res => {
                setProducts(res.data.data || []);
                setTotal(res.data.total || 0);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [page, refresh, search]);

    // ดึงรายการสินค้าสำหรับ prompt
    useEffect(() => {
        setPromptLoading(true);
        axios.get(`${Baseurl}/app_product_req`)
            .then(res => {
                setPromptList(res.data || []);
                setPromptLoading(false);
            })
            .catch(() => {
                setPromptError("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า");
                setPromptLoading(false);
            });
    }, []);

    const handleToggleStatus = async (id_product, currentStatus) => {
        try {
            await axios.post(`${Baseurl}/app_update_prodstatus`, {
                id_product,
                prod_status: currentStatus === 1 ? 0 : 1
            });
            setRefresh(r => !r);
        } catch (e) {
            alert('Update failed');
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    // Sort products client-side
    const sortedProducts = React.useMemo(() => {
        if (!sortField) return products;
        return [...products].sort((a, b) => {
            if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
            if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }, [products, sortField, sortOrder]);

    // Sort and filter products client-side
    const filteredProducts = React.useMemo(() => {
        if (!showOnly) return sortedProducts;
        return sortedProducts.filter(prod => prod.prod_status === 1);
    }, [sortedProducts, showOnly]);

    const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
        <div className="container-fluid min-vh-100 bg-light">
            <div className="row">
                <aside className="col-12 col-md-3 col-lg-2 bg-white shadow-sm p-0 border-end">
                    <Menu />
                </aside>
                <main className="col p-4 d-flex flex-column align-items-center justify-content-start">
                    {/* <h4 className="display-3 fw-bold mb-4 text-center text-primary kanit-light">Show Product Config</h4> */}
                    <div className="card w-100 shadow-sm">

                        <div className="card-body">
                            <h3 className="h5 mb-4">Product List</h3>
                            <div className="mb-3 w-100 d-flex justify-content-end gap-2">

                                <input
                                    type="text"
                                    className="form-control w-auto"
                                    placeholder="ค้นหาด้วยชื่อสินค้า..."
                                    value={search}
                                    onChange={e => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                    style={{ maxWidth: 300 }}
                                />
                                <button
                                    className={`btn btn-${showOnly ? 'primary' : 'outline-primary'} ms-2`}
                                    onClick={() => setShowOnly(v => !v)}
                                >
                                    {showOnly ? 'แสดงทั้งหมด' : 'แสดงเฉพาะที่ Show'}
                                </button>
                            </div>
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <table className="table table-bordered table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>#</th>
                                            <th>Product Name</th>
                                            <th>Main Type</th>
                                            <th>Unit</th>
                                            <th>Status</th>
                                            <th
                                                style={{ cursor: 'pointer', userSelect: 'none', background: sortField === 'prod_status' ? '#e9ecef' : undefined }}
                                                onClick={() => handleSort('prod_status')}
                                            >
                                                Action
                                                {sortField === 'prod_status' && (
                                                    <span className="ms-1">
                                                        {sortOrder === 'asc' ? '▲' : '▼'}
                                                    </span>
                                                )}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map((prod, idx) => (
                                            <tr key={prod.id_product}>
                                                <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                                                <td>{prod.name_pro}</td>
                                                <td>{prod.name_maintype}</td>
                                                <td>{prod.unitname}</td>
                                                <td>
                                                    {prod.prod_status === 1 ? (
                                                        <span className="badge bg-success">Show</span>
                                                    ) : (
                                                        <span className="badge bg-secondary">NoShow</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <button
                                                        className={`btn btn-sm ${prod.prod_status === 1 ? 'btn-danger' : 'btn-success'}`}
                                                        onClick={() => handleToggleStatus(prod.id_product, prod.prod_status)}
                                                    >
                                                        {prod.prod_status === 1 ? 'Set NoShow' : 'Set Show'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <button
                                    className="btn btn-outline-primary"
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    Previous
                                </button>
                                <span>Page {page} / {totalPages}</span>
                                <button
                                    className="btn btn-outline-primary"
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="boxprompt">
                        <h3 className="h5 mt-4">Prompt Box</h3>
                        {promptLoading ? (
                            <div>กำลังโหลดรายการสินค้า...</div>
                        ) : promptError ? (
                            <div className="text-danger">{promptError}</div>
                        ) : (
                            <div>
                                <div className="mb-2">คัดลอกข้อความนี้ไปใช้กับ AI เพื่อดึงราคาผักจากแต่ละตลาด (วันปัจจุบัน):</div>
                                <pre className="bg-light p-2 rounded" style={{ fontFamily: 'inherit', fontSize: 15 }}>
                                    {promptList.map(prod =>
                                        [
                                            `ตลาดไท-${prod.name_pro}-??-บาท/${prod.unitname}`,
                                            `ตลาดศรีเมือง-${prod.name_pro}-??-บาท/${prod.unitname}`,
                                            `ตลาดสี่มุมเมือง-${prod.name_pro}-??-บาท/${prod.unitname}`
                                        ].join('\n')
                                    ).join('\n')}
                                </pre>
                                <div className="small text-secondary">*แทนที่ ?? ด้วยราคาที่ได้จาก AI</div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Showproductconf;
