import React from "react";
import "./YTShortFrame.css";

export default function YTShortFrame({ children, topContent }) {
  // ขนาด Youtube Shorts: 9:16 (เช่น 360x640, 576x1024, 720x1280)
  const frameWidth = 360;
  const frameHeight = 640;
  return (
    <div
      className="yt-short-frame"
      style={{
        position: 'relative',
        width: frameWidth,
        height: frameHeight,
        minWidth: frameWidth,
        minHeight: frameHeight,
        maxWidth: frameWidth,
        maxHeight: frameHeight,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        margin: '0 auto',
      }}
    >
      {/* ส่วนบนสำหรับข้อความหรือ speech bubble */}
      {topContent && (
        <div style={{ width: '100%', minHeight: 60, marginBottom: 8 }}>
          {topContent}
        </div>
      )}
      {/* ตัวละครอยู่ล่างสุดของกรอบ */}
      <div style={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
        {children}
      </div>
    </div>
  );
}