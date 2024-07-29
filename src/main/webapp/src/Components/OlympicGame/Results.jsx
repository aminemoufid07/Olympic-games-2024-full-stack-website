import React, { useEffect, useState } from 'react';

function App() {
  const [countries, setCountries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [gold, setGold] = useState(0);
  const [silver, setSilver] = useState(0);
  const [bronze, setBronze] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8086/api/v1/pays')
      .then(response => response.json())
      .then(data => {
        // Initialize medals to zero if they are missing
        const initializedData = data.map(country => ({
          ...country,
          goldMedals: country.goldMedals || 0,
          silverMedals: country.silverMedals || 0,
          bronzeMedals: country.bronzeMedals || 0,
        }));
        setCountries(initializedData);
      });
  }, []);

  const handleAddMedals = () => {
    console.log('Selected Country ID:', selectedCountry);

    // Ensure `selectedCountry` is a number if IDs are numbers
    const selectedId = parseInt(selectedCountry, 10);

    // Check if country exists
    const updatedCountry = countries.find(country => country.id === selectedId);
    if (!updatedCountry) {
      console.error('Selected country not found with ID:', selectedId);
      return;
    }

    console.log('Updating country:', updatedCountry);

    // Update medals
    updatedCountry.goldMedals = (updatedCountry.goldMedals || 0) + gold;
    updatedCountry.silverMedals = (updatedCountry.silverMedals || 0) + silver;
    updatedCountry.bronzeMedals = (updatedCountry.bronzeMedals || 0) + bronze;

    // Send updated data to the server
    fetch(`http://localhost:8086/api/v1/pays/${selectedId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedCountry)
    })
      .then(response => response.json())
      .then(() => {
        setCountries(countries.map(country => country.id === selectedId ? updatedCountry : country));
        setGold(0);
        setSilver(0);
        setBronze(0);
        setShowModal(false); // Close the modal after updating
      });
  };

  return (
    <div>
      <h1>Olympic Medal Table</h1>
      <table>
        <thead>
          <tr>
            <th>Country</th>
            <th>Gold</th>
            <th>Silver</th>
            <th>Bronze</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {countries.map(country => (
            <tr key={country.id}>
              <td>{country.nom}</td>
              <td>{country.goldMedals}</td>
              <td>{country.silverMedals}</td>
              <td>{country.bronzeMedals}</td>
              <td>{country.goldMedals + country.silverMedals + country.bronzeMedals}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setShowModal(true)}>Add Medals</button>
      
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Medals</h2>
            <label>
              Country:
              <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}>
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country.id} value={country.id}>
                    {country.nom}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Gold:
              <input type="number" value={gold} onChange={e => setGold(Number(e.target.value))} />
            </label>
            <label>
              Silver:
              <input type="number" value={silver} onChange={e => setSilver(Number(e.target.value))} />
            </label>
            <label>
              Bronze:
              <input type="number" value={bronze} onChange={e => setBronze(Number(e.target.value))} />
            </label>
            <button onClick={handleAddMedals}>Submit</button>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
        }
        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: left;
        }
      `}</style>
    </div>
  );
}

export default App;
