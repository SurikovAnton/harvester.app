import React, { useState } from 'react';
import './styles/App.css';
import logo from './assets/logo.png';
import OcrComponent from './ocr/OcrComponent';
import ComponentList from './components/ComponentList';
import TroubleshootingEditor from './components/TroubleshootingEditor';
import { saveAs } from "file-saver";
import SmartDiagnosis from './components/SmartDiagnosis';


function App() {
  const [page, setPage] = useState('home');

  // Export: Download all components + troubleshooting as a JSON
  const handleExport = () => {
    const components = JSON.parse(localStorage.getItem("components") || "[]");
    const troubleshooting = JSON.parse(localStorage.getItem("troubleshooting") || "[]");
    const exportObj = {
      components,
      troubleshooting,
      exported: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: "application/json" });
    saveAs(blob, "harvest-troubleshooter-export.json");
  };

  // Import: Restore all data from a JSON file
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.components && imported.troubleshooting) {
          localStorage.setItem("components", JSON.stringify(imported.components));
          localStorage.setItem("troubleshooting", JSON.stringify(imported.troubleshooting));
          alert("Import complete! Reload the page to use imported data.");
        } else {
          alert("Invalid file format.");
        }
      } catch (err) {
        alert("Import failed: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="App">
      <header className="App-header" style={{ background: "#003399", color: "#FFCC00" }}>
        <img src={logo} alt="Logo" className="App-logo" />
        <h1>Harvesting Machine Troubleshooter</h1>
      </header>
      <nav className="App-nav">
        <button onClick={() => setPage('home')}>Home</button>
        <button onClick={() => setPage('ocr')}>Import Schema (OCR)</button>
        <button onClick={() => setPage('components')}>Manage Components</button>
        <button onClick={() => setPage('troubleshoot')}>Troubleshooting</button>
        <button onClick={() => setPage('diagnose')}>Smart Diagnosis</button>
      </nav>
      <main>
        {page === 'home' && (
          <div className="App-welcome">
            <h2>Welcome!</h2>
            <p>
              Diagnose, edit, and document electrical/hydraulic issues in the field.
              <br />
              Works offline after first load!
            </p>
            <ul>
              <li>Use <b>Import Schema (OCR)</b> to scan a diagram and auto-extract components.</li>
              <li>Build your own troubleshooting knowledge base—editable any time.</li>
            </ul>
          </div>
        )}
        {page === 'ocr' && <OcrComponent />}
        {page === 'components' && <ComponentList />}
        {page === 'troubleshoot' && <TroubleshootingEditor />}
        {page === 'diagnose' && <SmartDiagnosis />}
      </main>
      <div style={{ margin: "32px 0", textAlign: "center" }}>
        <button onClick={handleExport}>Export All Data (JSON)</button>
        <input
          type="file"
          accept="application/json"
          style={{ marginLeft: 16 }}
          onChange={handleImport}
        />
      </div>
      <footer className="App-footer" style={{ background: "#003399", color: "#fff" }}>
        <small>v1.0 &copy; {new Date().getFullYear()} | New Holland colors | Fully offline PWA</small>
      </footer>
    </div>
  );
}

export default App;

