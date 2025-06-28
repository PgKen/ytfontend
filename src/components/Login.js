// import React from 'react';
import React, { useState, useRef } from 'react';
import { Baseurl } from './Baseurl';
import axios from 'axios';



function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [voiceText, setVoiceText] = useState('');
    const recognitionRef = useRef(null);

    // Voice command for auto login
    const startVoiceLogin = () => {
        setVoiceText('');
        let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('เบราว์เซอร์นี้ไม่รองรับ Voice Recognition');
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'th-TH';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognitionRef.current = recognition;
        recognition.start();
        recognition.onresult = (event) => {
            let transcript = event.results[0][0].transcript.trim();
            setVoiceText(transcript);
            if (transcript.replace(/\s+/g, '').includes('เข้าระบบ')) {
                setUsername('admin');
                setPassword('pass');
                setTimeout(() => {
                    document.getElementById('login-btn')?.click();
                }, 300);
            }
        };
        recognition.onerror = () => {};
        recognition.onend = () => {};
    };

    const handleLogin = async (e) => {
        console.log('Login attempt with:', Baseurl);
        e.preventDefault();

        try {
            axios.post(`${Baseurl}/app_login`, {
                username,
                password
            }).then(response => {
                if (response.data.success) {
                    console.log('Login successful:', response.data.user);
                    alert('Login successful!');
                    // Redirect or perform further actions here
                    document.cookie = `iduser=${response.data.user.id}; path=/;`;
                    window.location.href = '/home';
                }
                else {
                    console.error('Login failed:', response.data.message);
                    alert('Login failed: ' + response.data.message);
                }
            }).catch(error => {
                console.error('Error during login:', error);
                alert('An error occurred during login. Please try again.');
            });


        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login. Please try again.');
        }


    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="bg-white p-4 rounded shadow w-100" style={{ maxWidth: 400 }}>
                <h2 className="mb-4 text-center">Login</h2>
                <div className="mb-3 text-center">
                    <button className="btn btn-secondary btn-sm" type="button" onClick={startVoiceLogin}>
                        <i className="bi bi-mic me-2"></i> Voice Login
                    </button>
                    {voiceText && <div className="mt-2 small text-warning">พูด: <span className="fw-bold">{voiceText}</span></div>}
                </div>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="form-control"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <button id="login-btn" type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;