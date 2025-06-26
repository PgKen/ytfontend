import Menu from "./Menu";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { Baseurl } from "./Baseurl"; // Adjust the import path as necessary
import moment from "moment";
import "moment/locale/th";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const VegetablePriceChart = () => {
  const [vegetableData, setVegetableData] = useState([]);
  const [results, setResults] = useState([]); // tb_result
  const [selectedResult, setSelectedResult] = useState('1');

  useEffect(() => {
    // ดึง tb_result สำหรับ select
    axios.get(`${Baseurl}/app_result`).then(res => {
      setResults(res.data);
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching vegetable prices......");
      
      try {
        const response = await fetch(`${Baseurl}/app_vegetable-prices?id_result=${selectedResult}`);
        const data = await response.json();
        setVegetableData(data);
      } catch (error) {
        console.error("Error fetching vegetable prices:", error);
      }
    };
    fetchData();
  }, [selectedResult]);

  // สร้าง labelsRaw (วันที่ไม่ซ้ำและเรียงแบบ YYYY-MM-DD)
  const labelsRaw = Array.from(
    new Set(vegetableData.map(item => item.price_date))
    // new Set(vegetableData.map(item => item.date))
  ).sort();

  // labels สำหรับแสดง (format 10/ม.ค./68)
  const labels = labelsRaw.map(date => {
    if (!date) return "";
    const m = moment(date, "YYYY-MM-DD").locale("th");
    const buddhistYear = m.year() + 543;
    const buddhistYearShort = ("" + buddhistYear).slice(-2);
    return m.format("D/MMM/") + buddhistYearShort;
    // return date;
  });

  // ดึงชนิดผักทั้งหมด
  const productNames = Array.from(
    new Set(vegetableData.map(item => item.name_pro))
  );

  // สีแต่ละเส้น
  const chartColors = [
    "green", "orange", "blue", "red", "purple", "brown", "teal", "pink", "gray"
  ];

  // จัดกลุ่มข้อมูลตามชนิดผัก
  const datasets = productNames.map((name, idx) => {
    // สร้าง array ราคาตามวัน (ถ้าวันไหนไม่มีข้อมูล จะใส่ null)
    const data = labelsRaw.map(date => {
      const found = vegetableData.find(
        item => item.name_pro === name && item.price_date === date
      );
      return found ? found.price : null;
    });
    return {
      label: name,
      data,
      borderColor: chartColors[idx % chartColors.length],
      backgroundColor: chartColors[idx % chartColors.length] + "33",
      tension: 0.1,
      spanGaps: true,
    };
  });

  const chartData = {
    labels,
    datasets
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "ราคาผักย้อนหลัง 7 วัน" }
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row">
        <aside className="col-12 col-md-3 col-lg-2 bg-white shadow-sm p-0 border-end">
          <Menu />
        </aside>
        <main className="col p-4 d-flex flex-column align-items-center justify-content-start">
          <div className="mb-3 w-100" style={{ maxWidth: 400 }}>
            <label htmlFor="result-select" className="form-label">เลือกแหล่งที่มา</label>
            <select
              id="result-select"
              className="form-select"
              value={selectedResult}
              onChange={e => setSelectedResult(e.target.value)}
            >
              {results.map(r => (
                <option key={r.id} value={r.id}>{r.name_result}</option>
              ))}
            </select>
          </div>
          {/* <h2 className="display-5 fw-bold mb-2 text-center text-primary kanit-light">กราฟราคาผักย้อนหลัง 7 วัน</h2> */}
          <div className="w-100" style={{ maxWidth: 900, minHeight: 350, background: 'rgba(255,255,255,0.85)', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: 24 }}>
            <Line data={chartData} options={options} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default VegetablePriceChart;