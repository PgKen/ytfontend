import React, { useEffect } from 'react';
import { Baseurl } from './Baseurl';
import axios from 'axios';
//
import Menu from './Menu';

function Home() {

    // const [username, setUsername] = useState('');
    const [mainTypes, setMainTypes] = React.useState([]);
    const [dataProducts, setDataProducts] = React.useState([]); // State for products if needed


    async function selectmaintypesid(id) {

        console.log('selectmaintypesid function called' + id);
      
        try {
            const response = await axios.get(`${Baseurl}/app_getmaintypes/${id}`);
            // You can set state here if you want to use the data
            // console.log('Fetched maintype data:', response.data);
        } catch (error) {
            console.error('Error fetching maintype by id:', error);
        }
    }

    useEffect(() => {
        axios.get(Baseurl + '/app_maintypes')
            .then(response => {
                setMainTypes(response.data);
            })
            .catch(error => {
                console.error('Error fetching main types:', error);
            });
    }, []);


    useEffect(() => {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        const iduserCookie = cookies.find(cookie => cookie.startsWith('iduser='));
        if (!iduserCookie) {
            window.location.href = '/login';
        }
    }, []);

    return (
        
        <div className="container-fluid min-vh-100 bg-light">
            <div className="row">
                <aside className="col-12 col-md-3 col-lg-2 bg-white shadow-sm p-0 border-end">
                    <Menu />
                </aside>
                <main className="col p-4 d-flex flex-column align-items-center justify-content-start">
                    <h2 className="display-5 fw-bold mb-4 text-center text-primary">List Price</h2>
                    <div className="w-100">
                        <div className="d-flex flex-wrap gap-2 mb-4 justify-content-center">
                            {mainTypes.map((type) => (
                                <button
                                    key={type.id}
                                    className="btn btn-outline-primary btn-lg rounded-pill shadow-sm px-4 py-2 fw-semibold mb-2"
                                    onClick={() => selectmaintypesid(type.id)}
                                >
                                    {type.name_maintype}
                                </button>
                            ))}
                        </div>
                        {/* ส่วนอื่นๆ ของหน้า Home */}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Home;