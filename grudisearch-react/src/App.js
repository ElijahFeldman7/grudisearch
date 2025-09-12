import React, { useState } from 'react';
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

  const openAIApiKey = process.env.OPEN_API_KEY;

  const classroomTools = [
    ["Computer Mice", "Drawer 1"],
    ["USB to USB-C adapter", "Drawer 1"],
    ["Assorted Chargers", "Drawer 3"],
    ["Wires", "Cabinet 4"],
    ["Craft Paper", "Drawer 5"],
    ["Tape", "Cabinet 3"],
    ["Caulk", "Cabinet 3"],
    ["Glue", "Cabinet 3"],
    ["Paint", "Cabinet 3"],
    ["Paper Clips", "Cabinet 3"],
    ["Scale", "Cabinet 5"],
    ["Yarn", "Cabinet 5"],
    ["Scissors", "Drawer 6"],
    ["Box Cutters", "Drawer 6"],
    ["X-Acto Knives", "Drawer 6"],
    ["Knife Blades", "Drawer 6"],
    ["Force Sensor", "Cabinet 6"],
    ["Foil", "Cabinet 6"],
    ["TI Graph Link Cables", "Cabinet 6"],
    ["Calipers", "Cabinet 6"],
    ["Chloride Ion Selective Electrodes", "Cabinet 6"],
    ["Multimeters", "Drawer 7"],
    ["Container Lids", "Cabinet 7"],
    ["Markers", "Cabinet 7"],
    ["Epoxy", "Cabinet 8"],
    ["Ductile Pipes", "Cabinet 9"],
    ["Paper", "Cabinet 9"],
    ["Batteries", "Drawer 11"],
    ["Battery Snaps", "Drawer 11"],
    ["Rulers and Measuring Tools", "Drawer 13"],
    ["Hot Glue Guns and Hot Glue", "Drawer 14"],
    ["More Cutting Boards", "Drawer 15"],
    ["Servos", "Drawer 16"],
    ["Drill Battery Charger", "Cabinet 17"],
    ["Arduinos", "Drawer 19"],
    ["KN95 Masks", "Drawers 20, 21, and 22"],
    ["Motors", "Drawer 24"],
    ["Scrap Wood", "Drawers 25-28 and Cabinet 15"],
    ["LEDs", "Drawer 31"],
    ["Heat Gun", "Drawer 32"],
    ["Dowels", "Drawer 34"],
    ["Porous Scrap Wood", "Drawer 44"],
    ["Screwdrivers", "gray tool cabinet"],
    ["Hammers", "gray tool cabinet"],
    ["Wire Cutters", "gray tool cabinet"],
    ["Mallets", "gray tool cabinet"],
    ["Saws", "gray tool cabinet"],
    ["Measuring Tape", "gray tool cabinet"],
    ["Drills and Drill Bits", "gray tool cabinet"],
    ["Wrenches", "gray tool cabinet"],
    ["Painters Tape", "gray tool cabinet"],
    ["Black HDMI Cables", "gray tool cabinet"],
    ["Sandpaper and Hand Sanders", "gray tool cabinet"],
    ["Files, Hooks, Spacers, and Washers", "gray tool cabinet"],
    ["Screws and Nails", "gray tool cabinet"],
    ["Clamps", "gray tool cabinet"],
    ["Resistors", "Next to gray tool cabinet"],
    ["IR LEDs", "Next to gray tool cabinet"],
    ["Header Pins", "Next to gray tool cabinet"],
    ["Capacitors", "Next to gray tool cabinet"],
    ["Switches", "Next to gray tool cabinet"],
    ["Buttons", "Next to gray tool cabinet"],
    ["Laser Cutters", "Next to gray tool cabinet"],
    ["Exhaust Pipe for Laser Cutter", "Next to gray tool cabinet"],
    ["Filament", "Ask Ms Grudi"],
    ["Compressed Air Cans", "Ask Ms Grudi"],
    ["3D Printers", "Back of room"],
    ["Soldering Irons", "3D printer corner of the room"],
    ["Computers", "Laptop Cart"],
    ["Arduino Components", "4th large cabinet on your left from view after entering room"],
    ["Board Games", "3rd large cabinet on your left from view after entering room"],
    ["USB B, Micro, and Mini USB Cables", "Hanging on side of 3rd large cabinet on your left from view after entering room"],
    ["Adhesive Hanging Strips", "2nd large cabinet on your left from view after entering room"],
    ["First Aid Kits", "2nd large cabinet on your left from view after entering room"],
    ["Sewing Machines", "2nd large cabinet on your left from view after entering room"],
    ["Quart Storage Bags", "2nd large cabinet on your left from view after entering room"],
    ["Clorox Wipes", "2nd large cabinet on your left from view after entering room"],
    ["Plushies", "2nd large cabinet on your left from view after entering room"],
    ["Multimeter Wires", "Hanging on side of 2nd large cabinet on your left from view after entering room"],
    ["Cutting Boards", "1st large cabinet on your left from view after entering room"],
    ["Thin Cardboard", "1st large cabinet on your left from view after entering room"],
    ["Trash Cans", "Under Ms Grudis desk and near room exit"],
    ["Bandsaws", "Walk left after entering classroom until you walk into one"],
    ["Sander", "Walk left after entering classroom until you walk into one"],
    ["White Boards", "Near large white board at front of room"],
    ["Fire Extinguisher", "Room Entrance"],
    ["Charging Ports", "Hanging from the wall"]
];

  const performSearch = async () => {
    if (!query) {
      alert("Please enter a search term.");
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const prompt = `Given the user's search for "${query}", find the most relevant items from this list of classroom tools: ${JSON.stringify(classroomTools)}. Your response must be a valid JSON array of arrays, where each inner array contains the tool name and its location. For example: [["Tool Name", "Location"]]. Do not include any text outside of the JSON response. If the object is not found, instruct the user to ask Ms. Grudi`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIApiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "user",
            content: prompt
          }],
          temperature: 0.5
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
      console.error("Error fetching from OpenAI:", error);
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
