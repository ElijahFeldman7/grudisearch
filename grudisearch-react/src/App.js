import React, { useState, useEffect } from 'react';
import './App.css';

const WooperSpam = ({ count }) => {
  const woopers = [];
  for (let i = 0; i < count; i++) {
    const style = {
      position: 'fixed',
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      width: `${Math.random() * 100 + 50}px`,
      transform: `rotate(${Math.random() * 360}deg)`,
      zIndex: -1,
    };
        const wooperImage = '/wooper1.jpeg';
    woopers.push(<img key={i} src={wooperImage} alt="Wooper" style={style} />);
  }
  return <>{woopers}</>;
};

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classroomTools, setClassroomTools] = useState([]);

  useEffect(() => {
    fetch('/api/getItems')
      .then(response => response.json())
      .then(data => setClassroomTools(data))
      .catch(error => console.error('Error fetching tools:', error));
  }, []);

  const performSearch = async () => {
    if (!query) {
      alert("Please enter a search term.");
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          classroomTools
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      const recommendedTools = JSON.parse(content);
      setResults(recommendedTools);
    } catch (error) {
      console.error("Error fetching from backend:", error);
      setResults([["Error", "Sorry, there was an error. Please check the console for details."]]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <WooperSpam count={50} />
      <header>
        <h1>Grudi/Lipman Tool Finder</h1>
        <nav>
          <a href="/edit" style={{ marginLeft: '1rem', color: 'white' }}>Edit Tools</a>
        </nav>
      </header>
      <main>
        <div className="search-wrapper">
          <input
            type="text"
            id="searchInput"
            placeholder="e.g., 'something to measure with'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && performSearch()}
          />
          <button id="searchButton" onClick={performSearch}>Search</button>
        </div>
        <div id="resultsContainer">
          <ul id="resultsList">
            {loading && <li>Loading...</li>}
            {results.map((tool, index) => (
              <li key={index}>
                <span className="tool-name">{tool[0]}</span>
                <span className="tool-location">{tool[1]}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
