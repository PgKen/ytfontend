import React from "react";
import { Baseurl } from "./Baseurl";
import axios from "axios";

import logo from "../assets/logo.png"; // Adjust the path as necessary

const Menu = () => {
    const handleLogout = () => {
        document.cookie = "iduser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        window.location.href = "/login";
    };

    return (
        <div className="d-flex flex-column h-100 bg-dark text-white p-3 shadow" style={{ minHeight: '100vh', width: 220 }}>
            <div className="mb-4 text-center">
                <img src={logo} alt="Logo" className="mb-2" style={{ height: 60 }} />
                <div className="fw-bold fs-5">Price Management System</div>
            </div>
            <nav className="nav flex-column gap-2">
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