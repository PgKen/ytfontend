import React, { useState } from "react";
import YTShortFrame from "./YTShortFrame";
import "./CharacterAnimation.css";
import Menu from "./Menu";

import veg from "../assets/veg.gif";
import veg2 from "../assets/veg.gif";
import veg3 from "../assets/veg.gif";
import veg4 from "../assets/veg.gif";
import veg5 from "../assets/veg.gif";

import msg from "../assets/msg.gif"; // Assuming you have a message image

function CharacterAnimation() {
  // --- แทนที่ isVisible, currentMessageIndex ด้วย charactersState ---
  const initialCharactersState = [
    { visible: false, msgIndex: 0 },
    { visible: false, msgIndex: 0 },
    { visible: false, msgIndex: 0 },
    { visible: false, msgIndex: 0 },
    { visible: false, msgIndex: 0 },
  ];
  const [charactersState, setCharactersState] = useState(initialCharactersState);
  const [activeCharacter, setActiveCharacter] = useState(null);

  const characters = [
    { img: veg, label: "กระหล่ำ" },
    { img: veg2, label: "ผักชี" },
    { img: veg3, label: "แครอท" },
    { img: veg4, label: "พริก" },
    { img: veg5, label: "กล้วย" },
  ];

  // ค่าเริ่มต้นของข้อความแต่ละตัวละคร (4 ช่องต่อ 1 ตัว) - deep copy
  const defaultMessages = () => [
    ["สวัสดี! ฉันคือกระหล่ำ", "ฉันชอบผัก", "กินผักดีต่อสุขภาพ", "ขอบคุณที่รับชม!"],
    ["ผักชีสดใหม่จ้า", "กลิ่นหอมมาก", "ใส่ในต้มยำอร่อย", "เจอกันใหม่!"],
    ["แครอทหวานกรอบ!", "สีส้มสดใส", "มีวิตามินเอเยอะ", "ลาก่อน!"],
    ["พริกเผ็ดจี๊ดจ๊าด!", "กินแล้วตื่นตัว", "ใส่ในอาหารไทย", "โชคดีนะ!"],
    ["กล้วยอร่อยมาก!", "มีโพแทสเซียมสูง", "กินแล้วแข็งแรง", "บ๊ายบาย!"],
  ];

  // ข้อความแต่ละตัวละคร (editable, 4 ช่องต่อ 1 ตัว)
  const [messages, setMessages] = useState(defaultMessages());

  // handle เปลี่ยนข้อความในแต่ละช่อง
  const handleMessageChange = (charIdx, msgIdx, value) => {
    setMessages(msgs =>
      msgs.map((arr, i) =>
        i === charIdx ? arr.map((msg, j) => j === msgIdx ? value : msg) : arr
      )
    );
  };

  // handle แสดงตัวละครและวนข้อความ (input ของใครของมัน)
  const handleShow = idx => {
    setCharactersState(state =>
      state.map((c, i) => {
        if (i === idx) {
          if (!c.visible && c.msgIndex === 0) {
            // กดตัวละครนี้ครั้งแรก: เริ่มที่ 0
            return { visible: true, msgIndex: 0 };
          } else {
            // ทุกกรณีอื่น (กดซ้ำ/กลับมากด) วน input ถัดไป
            return { visible: true, msgIndex: (c.msgIndex + 1) % 4 };
          }
        } else {
          return { ...c, visible: false };
        }
      })
    );
    setActiveCharacter(idx);
  };

  // handle ซ่อนตัวละคร
  const handleHide = idx => {
    setCharactersState(state =>
      state.map((c, i) => i === idx ? { ...c, visible: false } : c)
    );
  };

  // reset ทุก state
  const handleReset = () => {
    setCharactersState(initialCharactersState);
    setMessages(defaultMessages());
    setActiveCharacter(null);
  };

  // reset เมื่อโหลดหน้าใหม่
  React.useEffect(() => {
    handleReset();
    // eslint-disable-next-line
  }, []);

  // ฟังก์ชันสร้างกรอบข้อความด้านบน (แสดงเฉพาะตัวที่ active)
  const topContent = () => {
    const idx = activeCharacter;
    if (idx === null || !charactersState[idx].visible) return null;
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 60 }}>
        <img src={msg} alt="msg" style={{ height: 48, marginRight: 8 }} />
        <span style={{ fontSize: 20, color: '#1a237e', fontWeight: 'bold', textShadow: '0 1px 6px #fff' }}>{messages[idx][charactersState[idx].msgIndex]}</span>
      </div>
    );
  };

  // ฟังก์ชันสำหรับ render ข้อความพูดด้านบน (msg ใหญ่สุดเต็มกรอบ เหนือตัวละคร)
  const renderTopContent = () => {
    const idx = activeCharacter;
    if (idx === null || !charactersState[idx].visible) return null;
    const msgIdx = charactersState[idx].msgIndex;
    return (
      <div style={{
        width: 'unset',
        margin: '0 auto',
        marginBottom: 8,
        // display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        position: 'relative',
        zIndex: 10,
        pointerEvents: 'none',
        overflow: 'visible',
        marginTop: 50,
      }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            minWidth: 600,
            maxWidth: 900,
            left: '50%',
            transform: 'translateX(-50%)',
            height: 180,
            zIndex: 20,
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          <img
            src={msg}
            alt="msg"
            style={{
              width: '100%',
              height: 420,
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
              marginLeft: '30px',
              position: 'relative',
              left: '50%',
              transform: 'translateX(-50%)',
              filter: 'drop-shadow(0 2px 12px #0002)',
              overflow: 'visible',
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              fontWeight: 'bold',
              fontSize: 22,
              color: '#1a237e',
              textShadow: '0 1px 8px #fff, 0 0 2px #fff',
              width: '90%',
              textAlign: 'center',
              lineHeight: 1.2,
              pointerEvents: 'none',
              padding: '0 8px',
              wordBreak: 'break-word',
              whiteSpace: 'pre-line',
              // border: '1px solid red',
              marginTop: 80,
            }}
          >
            {messages[idx][msgIdx]}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid min-vh-100 bg-light" style={{ minHeight: '100vh', height: '100vh', overflow: 'hidden' }}>
      <div className="row" style={{ height: '100vh', overflow: 'hidden' }}>
        <aside className="col-12 col-md-3 col-lg-2 bg-white shadow-sm p-0 border-end" style={{ height: '100vh', overflow: 'auto' }}>
          <Menu />
        </aside>
        <main className="col p-4 d-flex flex-column align-items-center justify-content-start" style={{ height: '100vh', overflow: 'hidden' }}>
          <h2 className="display-5 fw-bold mb-4 text-center text-primary" style={{ fontSize: "22px" }}>
            Character Animation
          </h2>
          <div style={{ textAlign: "center", marginTop: 32, width: '1200px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch', gap: 24, height: 'calc(100vh - 120px)', overflow: 'hidden' }}>
            {/* Sidebar Controls */}
            <div style={{ minWidth: 340, maxWidth: 850, width: 1200, background: '#f8fafc', borderRadius: 16, boxShadow: '0 2px 8px #0001', padding: 16, marginTop: 0, marginBottom: 0, height: '100%', overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1', marginBottom: 12, textAlign: 'right' }}>
                <button className="btn btn-danger btn-sm" onClick={handleReset}>
                  Reset
                </button>
              </div>
              {characters.map((char, idx) => (
                <div key={idx} className="d-flex flex-column align-items-center mb-3" style={{ width: '100%' }}>
                  <div className="d-flex flex-row justify-content-center align-items-center mb-1" style={{ width: '100%' }}>
                    <button
                      onClick={() => handleShow(idx)}
                      className="btn btn-success btn-sm me-2"
                      style={{ width: '48%', maxWidth: '48%' }}
                    >
                      แสดง {char.label}
                    </button>
                    <button
                      onClick={() => handleHide(idx)}
                      className="btn btn-secondary btn-sm"
                      style={{ width: '48%', maxWidth: '48%' }}
                    >
                      ซ่อน
                    </button>
                  </div>
                  {[0,1,2,3].map(msgIdx => (
                    <textarea
                      key={msgIdx}
                      className="form-control form-control-sm mb-1"
                      style={{ width: '100%', maxWidth: '100%', resize: 'vertical' }}
                      value={messages[idx][msgIdx]}
                      onChange={e => handleMessageChange(idx, msgIdx, e.target.value)}
                      placeholder={`ข้อความที่ ${msgIdx+1} ของ${char.label}`}
                      rows={2}
                    />
                  ))}
                </div>
              ))}
            </div>
            {/* Main Animation Frame */}
            <div style={{ flex: 1, minWidth: 360, maxWidth: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', overflow: 'auto', justifyContent: 'center' }}>
              <YTShortFrame topContent={renderTopContent()}>
                <div style={{ width: '100%', height: 180, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                  {characters.map((char, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bottom: 0,
                        zIndex: idx + 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pointerEvents: charactersState[idx].visible ? 'auto' : 'none',
                      }}
                    >
                      <div
                        className={`character ${charactersState[idx].visible ? "fade-in" : "fade-out"}`}
                        style={{ minHeight: 120 }}
                      >
                        <img src={char.img} alt={char.label} style={{ width: 200, height: 200, objectFit: 'contain' }} />
                        {charactersState[idx].visible && (
                          <div className="small text-secondary mt-1" style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 22, color: '#1a237e', textShadow: '0 1px 6px #fff' }}>{char.label}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </YTShortFrame>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CharacterAnimation;