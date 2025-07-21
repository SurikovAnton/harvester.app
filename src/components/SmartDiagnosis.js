import React, { useState } from "react";

// Loads from localStorage, so it's always current
function getData() {
  const components = JSON.parse(localStorage.getItem("components") || "[]");
  const troubleshooting = JSON.parse(localStorage.getItem("troubleshooting") || "[]");
  return { components, troubleshooting };
}

export default function SmartDiagnosis() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    const { components, troubleshooting } = getData();
    // Match either symptom text, step text, or component IDs/names
    const q = query.trim().toLowerCase();
    let matches = [];
    troubleshooting.forEach((item) => {
      // Simple keyword match
      if (
        item.symptom.toLowerCase().includes(q) ||
        item.steps.some((s) => s.toLowerCase().includes(q))
      ) {
        matches.push(item);
      }
    });
    // Also search components
    const compMatches = components.filter(
      c =>
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        (c.notes && c.notes.toLowerCase().includes(q))
    );
    setResults([
      ...matches.map(m => ({ type: "troubleshoot", ...m })),
      ...compMatches.map(c => ({ type: "component", ...c }))
    ]);
  };

  return (
    <div>
      <h2>Smart Diagnosis</h2>
      <input
        type="text"
        placeholder="Enter error code or symptom"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ width: 320, marginRight: 8 }}
        onKeyDown={e => { if (e.key === "Enter") handleSearch(); }}
      />
      <button onClick={handleSearch}>Diagnose</button>

      <div style={{ marginTop: 24 }}>
        {results.length === 0 && <p>Enter an error code or symptom to see solutions.</p>}
        {results.map((r, i) =>
          r.type === "troubleshoot" ? (
            <div key={i} style={{ background: "#fff8d0", margin: "16px 0", borderRadius: 6, padding: 10 }}>
              <b>Symptom:</b> {r.symptom}
              <ul>
                {r.steps.map((s, idx) => <li key={idx}>{s}</li>)}
              </ul>
            </div>
          ) : (
            <div key={i} style={{ background: "#e8f4ff", margin: "16px 0", borderRadius: 6, padding: 10 }}>
              <b>Component:</b> {r.id} — {r.name}<br />
              <i>{r.description}</i><br />
              <b>Location:</b> {r.location} <br />
              <b>Notes:</b> {r.notes}
            </div>
          )
        )}
      </div>
    </div>
  );
}

