import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import axios from 'axios';
import { Baseurl } from './Baseurl';

function ListImg() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${Baseurl}/app_listimg`)
            .then(res => {
                setImages(res.data);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                alert('เกิดข้อผิดพลาดในการโหลดข้อมูลรูปภาพ');
            });
    }, []);

    return (
        <div className="container-fluid min-vh-100 bg-light">
            <div className="row">
                <aside className="col-12 col-md-3 col-lg-2 bg-white shadow-sm p-0 border-end">
                    <Menu />
                </aside>
                <main className="col p-4 d-flex flex-column align-items-center justify-content-start">
                    <h2 className="display-5 fw-bold mb-4 text-center text-primary kanit-light">รายการรูปภาพ</h2>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <div className="row w-100">
                            {images.length === 0 ? (
                                <div className="text-center">ไม่พบรูปภาพ</div>
                            ) : (
                                images.map(img => (
                                    <div key={img.id_img} className="col-6 col-md-4 col-lg-3 mb-4 d-flex flex-column align-items-center">
                                        <div className="card shadow-sm w-100">
                                            <img
                                                src={`${Baseurl}/public/upload/${img.name_img}`}
                                                alt={img.name_img}
                                                className="card-img-top img-thumbnail"
                                                style={{ maxHeight: 200, objectFit: 'contain' }}
                                            />
                                            <div className="card-body p-2">
                                                <div className="small text-truncate">{img.name_img}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default ListImg;
