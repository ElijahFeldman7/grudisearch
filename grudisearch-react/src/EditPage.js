import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

function EditPage() {
  const [tools, setTools] = useState([]);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [newToolName, setNewToolName] = useState('');
  const [newToolLocation, setNewToolLocation] = useState('');

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await fetch('/api/getItems');
      const data = await response.json();
      setTools(data.map((tool, index) => ({ id: index, name: tool[0], location: tool[1] })));
    } catch (error) {
      console.error('Error fetching tools:', error);
      setMessage('Error fetching tools.');
    }
  };

  const handleToolChange = (id, field, value) => {
    setTools(prevTools =>
      prevTools.map(tool => (tool.id === id ? { ...tool, [field]: value } : tool))
    );
  };

  const handleAddTool = () => {
    if (newToolName.trim() && newToolLocation.trim()) {
      setTools(prevTools => [
        ...prevTools,
        { id: prevTools.length > 0 ? Math.max(...prevTools.map(t => t.id)) + 1 : 0, name: newToolName, location: newToolLocation },
      ]);
      setNewToolName('');
      setNewToolLocation('');
    } else {
      setMessage('Please enter both name and location for the new tool.');
    }
  };

  const handleDeleteTool = (id) => {
    setTools(prevTools => prevTools.filter(tool => tool.id !== id));
  };

  const handleSave = async () => {
    setMessage('');
    try {
      const toolsToSave = tools.map(tool => [tool.name, tool.location]);
      const response = await fetch('/api/updateItems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tools: toolsToSave, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Tools updated successfully!');
        // Re-fetch tools to ensure IDs are consistent after save/reload
        fetchTools(); 
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('Error saving tools.');
      console.error('Error saving tools:', error);
    }
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Edit Tool List</h1>
        <nav>
          <Link to="/">Back to Search</Link>
        </nav>
      </header>
      <main>
        <div className="edit-section">
          <h2>Current Tools</h2>
          {tools.length === 0 && <p>No tools found. Add some below!</p>}
          {tools.map(tool => (
            <div key={tool.id} className="tool-item">
              <input
                type="text"
                value={tool.name}
                onChange={(e) => handleToolChange(tool.id, 'name', e.target.value)}
                className="edit-input"
              />
              <input
                type="text"
                value={tool.location}
                onChange={(e) => handleToolChange(tool.id, 'location', e.target.value)}
                className="edit-input"
              />
              <button onClick={() => handleDeleteTool(tool.id)} className="delete-button">Delete</button>
            </div>
          ))}
        </div>

        <div className="edit-section">
          <h2>Add New Tool</h2>
          <div className="add-tool-form">
            <input
              type="text"
              placeholder="Tool Name"
              value={newToolName}
              onChange={(e) => setNewToolName(e.target.value)}
              className="edit-input"
            />
            <input
              type="text"
              placeholder="Location"
              value={newToolLocation}
              onChange={(e) => setNewToolLocation(e.target.value)}
              className="edit-input"
            />
            <button onClick={handleAddTool} className="add-button">Add Tool</button>
          </div>
        </div>

        <div className="edit-section">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="edit-input"
          />
          <button onClick={handleSave} className="save-button">Save All Changes</button>
        </div>
        {message && <p style={{ marginTop: '1rem', color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}
      </main>
    </div>
  );
}

export default EditPage;