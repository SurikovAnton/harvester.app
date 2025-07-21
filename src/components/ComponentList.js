import React, { useState, useEffect } from "react";
import sampleData from "../data/components.json";

export default function ComponentList() {
  const [components, setComponents] = useState([]);
  const [newComp, setNewComp] = useState({
    id: "",
    name: "",
    type: "",
    description: "",
    location: "",
    notes: ""
  });

  useEffect(() => {
    // Load from localStorage if present, else use sampleData
    const local = localStorage.getItem("components");
    if (local) {
      setComponents(JSON.parse(local));
    } else {
      setComponents(sampleData);
    }
  }, []);

  const handleChange = (e) => {
    setNewComp({ ...newComp, [e.target.name]: e.target.value });
  };

  const addComponent = () => {
    if (!newComp.id || !newComp.name) return;
    const updatedComponents = [...components, newComp];
    setComponents(updatedComponents);
    localStorage.setItem("components", JSON.stringify(updatedComponents));
    setNewComp({ id: "", name: "", type: "", description: "", location: "", notes: "" });
  };

  const deleteComponent = (id) => {
    const updatedComponents = components.filter(c => c.id !== id);
    setComponents(updatedComponents);
    localStorage.setItem("components", JSON.stringify(updatedComponents));
  };

  return (
    <div>
      <h2>Component Manager</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Location</th>
            <th>Notes</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {components.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.type}</td>
              <td>{c.description}</td>
              <td>{c.location}</td>
              <td>{c.notes}</td>
              <td>
                <button onClick={() => deleteComponent(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Add New Component</h3>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input name="id" value={newComp.id} onChange={handleChange} placeholder="ID" />
        <input name="name" value={newComp.name} onChange={handleChange} placeholder="Name" />
        <input name="type" value={newComp.type} onChange={handleChange} placeholder="Type" />
        <input name="description" value={newComp.description} onChange={handleChange} placeholder="Description" />
        <input name="location" value={newComp.location} onChange={handleChange} placeholder="Location" />
        <input name="notes" value={newComp.notes} onChange={handleChange} placeholder="Notes" />
        <button onClick={addComponent}>Add</button>
      </div>
    </div>
  );
}

