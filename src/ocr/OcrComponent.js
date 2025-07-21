import React, { useState } from "react";
import Tesseract from "tesseract.js";

export default function OcrComponent() {
  const [image, setImage] = useState(null);
  const [ocrResult, setOcrResult] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
    setOcrResult("");
  };

  const handleOcr = () => {
    if (!image) return;
    setProcessing(true);
    Tesseract.recognize(image, "eng", {
      logger: (m) => {
        // Optional: display progress
      }
    }).then(({ data: { text } }) => {
      setOcrResult(text);
      setProcessing(false);
    });
  };

  // Simple parser for extracting component-like strings (IDs + names)
  const extractComponents = () => {
    // Split OCR result into lines, find lines that look like "ID Name" or "Y1 Valve"
    const lines = ocrResult.split("\n");
    return lines
      .map((line) => {
        const m = line.match(/^([A-Z]\d+)\s*-\s*(.+)$/i) || line.match(/^([A-Z]\d+)\s+(.+)/i);
        if (m) {
          return { id: m[1].trim(), name: m[2].trim() };
        }
        return null;
      })
      .filter(Boolean);
  };

  const handleAddAll = () => {
    // Import all extracted components into your localStorage database
    const newComps = extractComponents();
    const prev = JSON.parse(localStorage.getItem("components") || "[]");
    // Prevent duplicate IDs
    const merged = [
      ...prev,
      ...newComps.filter(
        (nc) => !prev.some((p) => p.id === nc.id)
      ),
    ];
    localStorage.setItem("components", JSON.stringify(merged));
    alert(`Added ${merged.length - prev.length} new components!`);
  };

  return (
    <div>
      <h2>OCR Schema Import</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {image && (
        <div>
          <img src={image} alt="schema preview" style={{ maxWidth: 480, margin: "12px 0" }} />
          <button onClick={handleOcr} disabled={processing}>
            {processing ? "Processing…" : "Run OCR"}
          </button>
        </div>
      )}
      {ocrResult && (
        <div>
          <h3>Raw OCR Result</h3>
          <pre style={{ background: "#eee", padding: 12 }}>{ocrResult}</pre>
          <h3>Extracted Components</h3>
          <ul>
            {extractComponents().map((c, i) => (
              <li key={i}>
                <b>{c.id}</b>: {c.name}
              </li>
            ))}
          </ul>
          <button onClick={handleAddAll}>Add All to Database</button>
        </div>
      )}
    </div>
  );
}

