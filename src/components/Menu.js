import React, { useRef, useState } from "react";
import { Baseurl } from "./Baseurl";
import axios from "axios";

import logo from "../assets/logo.png"; // Adjust the path as necessary

const Menu = () => {
    const [isVoiceListening, setIsVoiceListening] = useState(false);
    const [voiceText, setVoiceText] = useState('');
    const recognitionRef = useRef(null);

    const handleLogout = () => {
        document.cookie = "iduser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        window.location.href = "/login";
    };

    // Voice command logic
    const menuVoiceMap = [
        { keywords: ["แสดงราคา", "show price"], path: "/showprice" },
        { keywords: ["รูป", "upload", "อัปโหลด", "upload img"], path: "/uploadimg" },
        { keywords: ["เปรียบเทียบราคา", "compare", "compare prices"], path: "/compareprices" },
        { keywords: ["กราฟผัก", "vegetable chart", "ผัก"], path: "/vegetable-chart" },
        { keywords: ["เพิ่มข้อมูล", "insert data"], path: "/insertdata" },
        { keywords: ["ตั้งค่า", "product config", "config"], path: "/showproductconf" },
        { keywords: ["เว็บไซต์", "list website", "web"], path: "/listwebsite" },
        { keywords: ["prompt", "พรอมต์"], path: "/prompt" },
        { keywords: ["ออกจากระบบ", "logout"], path: "logout" },
        { keywords: ["หน้าหลัก", "home", "list price"], path: "/home" },
        { keywords: ["กรอกข้อมูล", "input price"], path: "/inputprice" },
    ];

    const startVoiceMenu = () => {
        setIsVoiceListening(true);
        setVoiceText('');
        let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("เบราว์เซอร์นี้ไม่รองรับ Voice Recognition");
            setIsVoiceListening(false);
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'th-TH';
        recognition.continuous = false; // กลับไปฟังครั้งเดียว
        recognition.interimResults = false;
        recognitionRef.current = recognition;
        recognition.start();
        recognition.onresult = (event) => {
            let transcript = event.results[0][0].transcript.trim();
            setVoiceText(transcript); // แสดงคำพูด
            transcript = transcript.replace(/\s+/g, ''); // remove all spaces for easier matching
            let found = false;
            for (const menu of menuVoiceMap) {
                for (const kw of menu.keywords) {
                    if (transcript.includes(kw.replace(/\s+/g, ''))) {
                        found = true;
                        setIsVoiceListening(false);
                        if (menu.path === "logout") {
                            handleLogout();
                        } else {
                            window.location.href = menu.path;
                        }
                        return;
                    }
                }
            }
            alert("ไม่พบเมนูที่ตรงกับเสียงที่พูด");
            setIsVoiceListening(false);
        };
        recognition.onerror = () => {
            setIsVoiceListening(false);
        };
        recognition.onend = () => {
            setIsVoiceListening(false);
        };
    };
    const stopVoiceMenu = () => {
        setIsVoiceListening(false);
        if (recognitionRef.current) recognitionRef.current.stop();
    };

    return (
        <div className="d-flex flex-column h-100 bg-dark text-white p-3 shadow" style={{ minHeight: '100vh', width: 220 }}>
            <div className="mb-4 text-center">
                <img src={logo} alt="Logo" className="mb-2" style={{ height: 60 }} />
                <div className="fw-bold fs-5">Price Management System</div>
            </div>
            <div className="mb-2 text-center">
                <button className={`btn btn-${isVoiceListening ? 'danger' : 'primary'} btn-sm w-100`} onClick={isVoiceListening ? stopVoiceMenu : startVoiceMenu}>
                    <i className={`bi bi-mic${isVoiceListening ? '-mute' : ''} me-2`}></i>
                    {isVoiceListening ? 'หยุดฟังเสียง' : 'Voice Menu'}
                </button>
                {isVoiceListening && (
                    <div className="mt-2 small text-warning">พูด: <span className="fw-bold">{voiceText || '...'}</span></div>
                )}
            </div>
            <nav className="nav flex-column gap-2">
                <button
                    className="btn btn-outline-light text-start mb-2"
                    onClick={() => window.location.href = "/manageproduct"}
                >
                    <i className="bi bi-boxes me-2"></i> Manage Product
                </button>
                <button
                    className="btn btn-outline-light text-start mb-2"
                    onClick={() => window.location.href = "/home"}
                >
                    <i className="bi bi-list me-2"></i> List Price
                </button>

                <button
                    className="btn btn-outline-light text-start mb-2"
                    onClick={() => window.location.href = "/inputprice"}
                >
                    <i className="bi bi-pencil-square me-2"></i> Input Price
                </button>
                <button
                    className="btn btn-outline-light text-start mb-2"
                    onClick={() => window.location.href = "/showprice"}
                >
                    <i className="bi bi-currency-dollar me-2"></i> Show Price
                </button>
                <button
                    className="btn btn-outline-light text-start mb-2"
                    onClick={() => window.location.href = "/prompt"}
                >
                    <i className="bi bi-chat-dots me-2"></i> Prompt
                </button>
                <button
                    className="btn btn-outline-light text-start mb-2"
                    onClick={() => window.location.href = "/uploadimg"}
                >
                    <i className="bi bi-upload me-2"></i> Upload Img
                </button>
                <button
                    className="btn btn-outline-light text-start mb-2"
                    onClick={() => window.location.href = "/compareprices"}
                >
                    <i className="bi bi-bar-chart-line me-2"></i> Compare Prices
                </button>
                <button
                    className="btn btn-outline-light text-start mb-2"
                    onClick={() => window.location.href = "/vegetable-chart"}
                >
                    <i className="bi bi-graph-up-arrow me-2"></i> Vegetable Chart
                </button>
                <button
                    className="btn btn-outline-light text-start mb-2"
                    onClick={() => window.location.href = "/insertdata"}
                >
                    <i className="bi bi-file-earmark-plus me-2"></i> Insert Data
                </button>
                <button
                    className="btn btn-outline-light text-start mb-2"
                    onClick={() => window.location.href = "/showproductconf"}
                >
                    <i className="bi bi-gear me-2"></i> Product Config
                </button>
                <button
                    className="btn btn-outline-light text-start mb-2"
                    onClick={() => window.location.href = "/listwebsite"}
                >
                    <i className="bi bi-link-45deg me-2"></i> List Website
                </button>
                <button
                    className="btn btn-outline-light text-start mb-2"
                    onClick={() => window.location.href = "/datecompareprices"}
                >
                    <i className="bi bi-calendar-range me-2"></i> Date Compare
                </button>
                <button
                    className="btn btn-outline-light text-start mb-2"
                    onClick={() => window.location.href = "/datecomparepricesslideshow"}
                >
                    <i className="bi bi-calendar2-range me-2"></i> Compare Show
                </button>
                {/* <button
                    className="btn btn-outline-light text-start mb-2"
                    onClick={() => window.location.href = "/character-animation"}
                >
                    <i className="bi bi-emoji-smile me-2"></i> Character Animation
                </button> */}
                <button
                    className="btn btn-outline-light text-start mb-2"
                    onClick={() => window.location.href = "/slideshow"}
                >
                    <i className="bi bi-sliders me-2"></i> Slideshow
                </button>

                <button
                    className="btn btn-outline-danger text-start mt-auto"
                    onClick={handleLogout}
                >
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                </button>
            </nav>
        </div>
    );
};

export default Menu;