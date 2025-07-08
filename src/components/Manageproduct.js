import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Menu from './Menu';
import { Baseurl } from './Baseurl';

function Manageproduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id_product: '',
    name_pro: '',
    id_group: '',
    name_pro_en: '',
    name_pro_cn: '',
    id_unit: '',
    prod_status: 1,
    chart_status: 0,
  });
  const [mainTypes, setMainTypes] = useState([]);
  const [units, setUnits] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [resultMsg, setResultMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [imageFile, setImageFile] = useState(null); // state สำหรับไฟล์รูปภาพ

  useEffect(() => {
    axios.get(Baseurl + '/app_maintypes').then(res => setMainTypes(res.data || []));
    axios.get(Baseurl + '/app_unit').then(res => setUnits(res.data || []));
    fetchProducts();
    // eslint-disable-next-line
  }, []);

   useEffect(() => {
          document.title = "Manageproducts | จัดการข้อมูลสินค้า";
      }, []);
  

  const fetchProducts = async (search = '', pageNum = 1) => {
    setLoading(true);
    setErrorMsg('');
    try {
      let url = `${Baseurl}/app_manage_product?search=${encodeURIComponent(search)}&page=${pageNum}`;
      if (search === 'chart_status=1') {
        url = `${Baseurl}/app_manage_product?chart_status=1&page=${pageNum}`;
      } else if (search === 'prod_status=1') {
        url = `${Baseurl}/app_manage_product?prod_status=1&page=${pageNum}`;
      }
      const res = await axios.get(url);
      // รองรับทั้งกรณี backend ส่ง { data: [...] } หรือ [...]
      let productsArr = [];
      let pageVal = 1, totalPagesVal = 1, totalVal = 0;
      if (Array.isArray(res.data)) {
        productsArr = res.data;
        pageVal = 1;
        totalPagesVal = 1;
        totalVal = productsArr.length;
      } else if (res.data && Array.isArray(res.data.data)) {
        productsArr = res.data.data;
        pageVal = res.data.page || 1;
        totalPagesVal = res.data.totalPages || 1;
        totalVal = res.data.total || productsArr.length || 0;
      }
      setProducts(productsArr);
      setPage(pageVal);
      setTotalPages(totalPagesVal);
      setTotal(totalVal);
    } catch (err) {
      setErrorMsg('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
    setLoading(false);
  };

  const handleInputChange = e => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setImageFile(files[0] || null);
      return;
    }
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setResultMsg('');
    setErrorMsg('');
    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }
      if (imageFile) {
        formData.append('image', imageFile);
      }
      if (editMode) {
        // update
        await axios.put(`${Baseurl}/app_manage_product/${form.id_product}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setResultMsg('แก้ไขข้อมูลสำเร็จ');
      } else {
        // add
        await axios.post(`${Baseurl}/app_manage_product`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setResultMsg('เพิ่มข้อมูลสำเร็จ');
      }
      setForm({ id_product: '', name_pro: '', id_group: '', name_pro_en: '', name_pro_cn: '', id_unit: '', prod_status: 1, chart_status: 0 });
      setImageFile(null);
      setEditMode(false);
      fetchProducts(searchText);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
    setLoading(false);
  };

  const handleEdit = prod => {
    setForm({ ...prod });
    setEditMode(true);
    setResultMsg('');
    setErrorMsg('');
  };

  const handleDelete = async id => {
    if (!window.confirm('ยืนยันการลบข้อมูลนี้?')) return;
    setLoading(true);
    setResultMsg('');
    setErrorMsg('');
    try {
      await axios.delete(`${Baseurl}/app_manage_product/${id}`);
      setResultMsg('ลบข้อมูลสำเร็จ');
      fetchProducts(searchText);
    } catch (err) {
      setErrorMsg('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
    setLoading(false);
  };

  const handleSearch = e => {
    e.preventDefault();
    setPage(1);
    fetchProducts(searchText, 1);
  };

  const handleReset = () => {
    setForm({ id_product: '', name_pro: '', id_group: '', name_pro_en: '', name_pro_cn: '', id_unit: '', prod_status: 1, chart_status: 0 });
    setImageFile(null);
    setEditMode(false);
    setResultMsg('');
    setErrorMsg('');
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    let sorted = [...products];
    sorted.sort((a, b) => {
      if (a[key] === null || a[key] === undefined) return 1;
      if (b[key] === null || b[key] === undefined) return -1;
      if (typeof a[key] === 'string') {
        return direction === 'asc'
          ? a[key].localeCompare(b[key], 'th')
          : b[key].localeCompare(a[key], 'th');
      } else {
        return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
      }
    });
    setProducts(sorted);
  };

  // ปุ่มเปลี่ยนหน้า
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchProducts(searchText, newPage);
  };

  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row">
        <aside className="col-12 col-md-3 col-lg-2 bg-white shadow-sm p-0 border-end">
          <Menu />
        </aside>
        <main className="col p-4 d-flex flex-column align-items-center justify-content-start">
          <div className="display-5 fw-bold mb-4 text-center text-primary" style={{fontSize:"20px"}}>จัดการสินค้า</div>
          <form className="card w-100 shadow-sm mb-4" style={{ maxWidth: 700 }} onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="row g-2">
                <div className="col-md-6 mb-2">
                  <label className="form-label">ชื่อสินค้า</label>
                  <input type="text" className="form-control" name="name_pro" value={form.name_pro} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label">กลุ่ม</label>
                  <select className="form-select" name="id_group" value={form.id_group} onChange={handleInputChange} required>
                    <option value="">เลือกกลุ่ม</option>
                    {mainTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name_maintype}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label">ชื่อ EN</label>
                  <input type="text" className="form-control" name="name_pro_en" value={form.name_pro_en} onChange={handleInputChange} />
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label">ชื่อ CN</label>
                  <input type="text" className="form-control" name="name_pro_cn" value={form.name_pro_cn} onChange={handleInputChange} />
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label">หน่วย</label>
                  <select className="form-select" name="id_unit" value={form.id_unit} onChange={handleInputChange} required>
                    <option value="">เลือกหน่วย</option>
                    {units.map(u => (
                      <option key={u.id_unit} value={u.id_unit}>{u.unitname}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label">อัปโหลดรูปภาพ</label>
                  <input type="file" className="form-control" name="image" accept="image/*" onChange={handleInputChange} />
                  {imageFile && <div className="mt-2"><img src={URL.createObjectURL(imageFile)} alt="preview" style={{maxHeight:80, borderRadius:8}} /></div>}
                </div>
                <div className="col-md-3 mb-2 d-flex align-items-center">
                  <label className="form-label me-2">prod_status</label>
                  <input type="checkbox" name="prod_status" checked={!!form.prod_status} onChange={handleInputChange} />
                </div>
                <div className="col-md-3 mb-2 d-flex align-items-center">
                  <label className="form-label me-2">chart_status</label>
                  <input type="checkbox" name="chart_status" checked={!!form.chart_status} onChange={handleInputChange} />
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn btn-success" disabled={loading}>
                  {editMode ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={loading}>รีเซ็ต</button>
              </div>
              {resultMsg && <div className="alert alert-success mt-3">{resultMsg}</div>}
              {errorMsg && <div className="alert alert-danger mt-3">{errorMsg}</div>}
            </div>
          </form>
          <form className="w-100 mb-3" style={{ maxWidth: 700 }} onSubmit={handleSearch}>
            <div className="input-group">
              <input type="text" className="form-control" placeholder="ค้นหาชื่อสินค้า..." value={searchText} onChange={e => setSearchText(e.target.value)} />
              
              <button className="btn btn-primary" type="submit" disabled={loading}>ค้นหา</button>
              <button className="btn btn-outline-secondary" type="button" onClick={() => { setSearchText(''); fetchProducts(''); }} disabled={loading}>รีเซ็ต</button>
              <button className="btn btn-info" type="button" onClick={() => fetchProducts('chart_status=1')} disabled={loading}>Show Chart</button>
              <button className="btn btn-success" type="button" onClick={() => fetchProducts('prod_status=1')} disabled={loading}>Show Price</button>
            </div>
          </form>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>แสดง {products.length} จาก {total} รายการ</div>
            <div className="btn-group">
              <button className="btn btn-outline-primary" onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>«</button>
              <span className="btn btn-light disabled">หน้า {page} / {totalPages}</span>
              <button className="btn btn-outline-primary" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>»</button>
            </div>
          </div>
          <div className="table-responsive bg-white rounded shadow-sm p-3 w-100" style={{ maxWidth: 1400 }}>
            <table className="table table-bordered table-striped align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('id_product')}>
                    id_product {sortConfig.key === 'id_product' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name_pro')}>
                    name_pro {sortConfig.key === 'name_pro' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name_maintype')}>
                    กลุ่ม {sortConfig.key === 'name_maintype' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name_pro_en')}>
                    name_pro_en {sortConfig.key === 'name_pro_en' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name_pro_cn')}>
                    name_pro_cn {sortConfig.key === 'name_pro_cn' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('unitname')}>
                    หน่วย {sortConfig.key === 'unitname' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th>รูปภาพ</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('prod_status')}>
                    prod_status {sortConfig.key === 'prod_status' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('chart_status')}>
                    chart_status {sortConfig.key === 'chart_status' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="9" className="text-center">กำลังโหลด...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan="9" className="text-center text-muted">ไม่พบข้อมูล</td></tr>
                ) : (
                  products.map(prod => (
                    <tr key={prod.id_product}>
                      <td>{prod.id_product}</td>
                      <td>{prod.name_pro}</td>
                      <td>{prod.name_maintype}</td>
                      <td>{prod.name_pro_en}</td>
                      <td>{prod.name_pro_cn}</td>
                      <td>{prod.unitname}</td>
                      <td className="text-center">
                        {prod.img_name ? (
                          <img src={`${Baseurl}/upload/${prod.img_name}`} alt={prod.name_pro} style={{maxHeight:40, maxWidth:60, borderRadius:6}} />
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="text-center"><input type="checkbox" checked={!!prod.prod_status} readOnly /></td>
                      <td className="text-center"><input type="checkbox" checked={!!prod.chart_status} readOnly /></td>
                      <td>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(prod)}>แก้ไข</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(prod.id_product)}>ลบ</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Manageproduct;
