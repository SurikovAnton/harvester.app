import React, { useState, useEffect } from "react";

// Loads default from bundled JSON if nothing in localStorage
const defaultSteps = [];

export default function TroubleshootingEditor() {
  const [symptom, setSymptom] = useState("");
  const [step, setStep] = useState("");
  const [troubleshooting, setTroubleshooting] = useState(defaultSteps);

  // Load from localStorage if available
  useEffect(() => {
    const stored = localStorage.getItem("troubleshooting");
    if (stored) {
      setTroubleshooting(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever troubleshooting changes
  useEffect(() => {
    localStorage.setItem("troubleshooting", JSON.stringify(troubleshooting));
  }, [troubleshooting]);

  // Add new troubleshooting symptom + steps
  const addSymptom = () => {
    if (!symptom) return;
    setTroubleshooting([...troubleshooting, { symptom, steps: [step].filter(Boolean) }]);
    setSymptom("");
    setStep("");
  };

  // Add step to existing symptom
  const addStep = (idx) => {
    if (!step) return;
    const copy = [...troubleshooting];
    copy[idx].steps.push(step);
    setTroubleshooting(copy);
    setStep("");
  };

  // Delete a troubleshooting entry
  const deleteSymptom = (idx) => {
    setTroubleshooting(troubleshooting.filter((_, i) => i !== idx));
  };

  // Delete individual step
  const deleteStep = (symIdx, stepIdx) => {
    const copy = [...troubleshooting];
    copy[symIdx].steps.splice(stepIdx, 1);
    setTroubleshooting(copy);
  };

  return (
    <div>
      <h2> Troubleshooting Knowledge Base </h2>
      <div style={{ marginBottom: 20 }}>
        <input
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          placeholder="Symptom (e.g. 'Header won't lift')"
          style={{ width: 300, marginRight: 8 }}
        />
        <input
          value={step}
          onChange={(e) => setStep(e.target.value)}
          placeholder="First step or solution"
          style={{ width: 300, marginRight: 8 }}
        />
        <button onClick={addSymptom}>Add Symptom + Step</button>
      </div>
      <div>
        {troubleshooting.length === 0 && <p>No troubleshooting steps added yet.</p>}
        {troubleshooting.map((item, idx) => (
          <div key={idx} style={{ marginBottom: 28, background: "#f7f7fa", borderRadius: 8, padding: 12 }}>
            <strong>{item.symptom}</strong>
            <button style={{ marginLeft: 12 }} onClick={() => deleteSymptom(idx)}>Delete Symptom</button>
            <ul>
              {item.steps.map((s, sIdx) => (
                <li key={sIdx}>
                  {s}
                  <button style={{ marginLeft: 6 }} onClick={() => deleteStep(idx, sIdx)}>Delete Step</button>
                </li>
              ))}
            </ul>
            <div>
              <input
                placeholder="Add another step"
                value={step}
                onChange={(e) => setStep(e.target.value)}
                style={{ width: 260, marginRight: 8 }}
              />
              <button onClick={() => addStep(idx)}>Add Step</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

