"use client";

import { useState } from "react";

const QRCode = () => (
  <svg viewBox="0 0 100 100" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="white"/>
    <rect x="10" y="10" width="30" height="30" fill="none" stroke="#111" strokeWidth="3"/>
    <rect x="15" y="15" width="20" height="20" fill="#111"/>
    <rect x="60" y="10" width="30" height="30" fill="none" stroke="#111" strokeWidth="3"/>
    <rect x="65" y="15" width="20" height="20" fill="#111"/>
    <rect x="10" y="60" width="30" height="30" fill="none" stroke="#111" strokeWidth="3"/>
    <rect x="15" y="65" width="20" height="20" fill="#111"/>
    {[45,50,55,60,65,70,75,80,85].map((x,i) => [45,50,55,60,65,70,75,80,85].map((y,j) =>
      (i+j) % 3 === 0 ? <rect key={`${i}-${j}`} x={x} y={y} width="4" height="4" fill="#111"/> : null
    ))}
  </svg>
);

export default function IconixLanding() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = () => {
    if (form.firstName && form.lastName && form.email && form.phone) {
      setSubmitted(true);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f0eb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Georgia', serif",
      padding: "20px"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        maxWidth: "420px",
        width: "100%",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.12)"
      }}>

        {/* Header */}
        <div style={{ padding: "28px 32px 0", textAlign: "center" }}>
          <div style={{ letterSpacing: "0.25em", fontSize: "26px", fontWeight: "700", color: "#1a1a1a" }}>
            ICONIX
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", margin: "6px 0 0" }}>
            <div style={{ height: "1px", width: "40px", background: "#c9a96e" }}/>
            <span style={{ color: "#c9a96e", fontSize: "10px", letterSpacing: "0.3em" }}>NAIL BAR</span>
            <div style={{ height: "1px", width: "40px", background: "#c9a96e" }}/>
          </div>
        </div>

        {/* Hero */}
        <div style={{
          margin: "20px 0 0",
          background: "linear-gradient(135deg, #e8d5b7 0%, #d4b896 40%, #c9a96e 100%)",
          padding: "36px 24px 28px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: "-20px", left: "-20px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.12)" }}/>
          <div style={{ position: "absolute", bottom: "-30px", right: "-10px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255,255,255,0.08)" }}/>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: "32px", fontWeight: "900", color: "#1a1a1a", letterSpacing: "0.05em", lineHeight: 1.1 }}>
              COMING SOON!
            </div>
            <div style={{ marginTop: "14px" }}>
              <div style={{ fontSize: "20px", color: "#3d2f1a", fontWeight: "400", fontStyle: "italic" }}>Enter to Win</div>
              <div style={{ fontSize: "38px", fontWeight: "700", color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.2)", lineHeight: 1.1 }}>$500</div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: "#fff", letterSpacing: "0.05em" }}>Gift Card</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
              <div style={{ fontSize: "13px", color: "#3d2f1a", fontStyle: "italic", textAlign: "left", maxWidth: "60%", lineHeight: 1.4 }}>
                Iconix Nail Bar is coming to Houston, TX!
              </div>
              <div style={{ background: "white", borderRadius: "8px", padding: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                <QRCode />
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: "24px 28px 28px" }}>
          <p style={{ textAlign: "center", color: "#555", fontSize: "14px", margin: "0 0 20px", lineHeight: 1.5 }}>
            Iconix Nail Bar is coming soon to <strong>Houston, TX!</strong>
          </p>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "32px 16px", background: "#faf6f0", borderRadius: "12px" }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>✨</div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#c9a96e", marginBottom: "8px" }}>You&apos;re entered!</div>
              <div style={{ fontSize: "13px", color: "#888" }}>We&apos;ll notify you when we open and announce the winner.</div>
            </div>
          ) : (
            <>
              {[
                { key: "firstName", label: "First Name*", type: "text" },
                { key: "lastName", label: "Last Name*", type: "text" },
                { key: "email", label: "Email*", type: "email" },
                { key: "phone", label: "Phone*", type: "tel" },
              ].map(({ key, label, type }) => (
                <input
                  key={key}
                  type={type}
                  placeholder={label}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  onFocus={() => setFocused(key)}
                  onBlur={() => setFocused(null)}
                  style={{
                    display: "block", width: "100%", padding: "13px 16px",
                    marginBottom: "10px",
                    border: `1px solid ${focused === key ? "#c9a96e" : "#e8e0d8"}`,
                    borderRadius: "8px", fontSize: "14px", color: "#333",
                    background: "#faf8f5", outline: "none",
                    boxSizing: "border-box", fontFamily: "inherit",
                    transition: "border-color 0.2s"
                  }}
                />
              ))}

              <button
                onClick={handleSubmit}
                style={{
                  width: "100%", padding: "15px",
                  background: "linear-gradient(135deg, #c9a96e, #b8924f)",
                  color: "white", border: "none", borderRadius: "8px",
                  fontSize: "16px", fontWeight: "600", cursor: "pointer",
                  letterSpacing: "0.05em", marginTop: "4px",
                  fontFamily: "'Georgia', serif",
                  boxShadow: "0 4px 16px rgba(180,145,80,0.35)"
                }}
              >
                Enter to Win
              </button>
            </>
          )}

          <p style={{ textAlign: "center", fontSize: "11px", color: "#aaa", marginTop: "16px", lineHeight: 1.6 }}>
            By submitting this form, you agree to receive SMS updates about our opening.
            Reply STOP to unsubscribe. Message &amp; data rates may apply.
          </p>
        </div>
      </div>
    </div>
  );
}
