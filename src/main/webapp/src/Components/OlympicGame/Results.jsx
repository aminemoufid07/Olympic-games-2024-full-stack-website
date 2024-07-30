import React, { useEffect, useState } from "react";
import "./Results.css";
import headerResults from "../../assets/header-results.png";
import addPic from "../../assets/stylo.png";
import {
  Modal,
  Button,
  Form,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
function Results() {
  const [countries, setCountries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [gold, setGold] = useState(0);
  const [silver, setSilver] = useState(0);
  const [bronze, setBronze] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8086/api/v1/pays")
      .then((response) => response.json())
      .then((data) => {
        const initializedData = data.map((country) => ({
          ...country,
          goldMedals: country.goldMedals || 0,
          silverMedals: country.silverMedals || 0,
          bronzeMedals: country.bronzeMedals || 0,
        }));
        setCountries(initializedData);
      });
  }, []);

  const handleAddMedals = () => {
    const selectedId = parseInt(selectedCountry, 10);
    const updatedCountry = countries.find(
      (country) => country.id === selectedId
    );

    if (!updatedCountry) {
      console.error("Selected country not found with ID:", selectedId);
      return;
    }

    updatedCountry.goldMedals = (updatedCountry.goldMedals || 0) + gold;
    updatedCountry.silverMedals = (updatedCountry.silverMedals || 0) + silver;
    updatedCountry.bronzeMedals = (updatedCountry.bronzeMedals || 0) + bronze;

    fetch(`http://localhost:8086/api/v1/pays/${selectedId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCountry),
    })
      .then((response) => response.json())
      .then(() => {
        setCountries(
          countries.map((country) =>
            country.id === selectedId ? updatedCountry : country
          )
        );
        setGold(0);
        setSilver(0);
        setBronze(0);
        setShowModal(false);
      });
  };

  return (
    <div className="app-container">
      
        <div className="header-logo">
          <img src={headerResults} alt="Olympic Games Logo" />
        </div>
        <Button className="add-button" onClick={() => setShowModal(true)}>
          <img
            src={addPic}
            alt="Ajouter"
            style={{ width: '30px', height: '30px' }}
          />
        </Button>
    

      <table>
        <thead>
          <tr>
            <th>TEAM</th>
            <th>GOLD</th>
            <th>SILVER</th>
            <th>BRONZE</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => (
            <tr key={country.id}>
              <td>
                <img src={country.imageUrl} alt={`${country.nom} flag`} />
                {country.nom}
              </td>
              <td>{country.goldMedals}</td>
              <td>{country.silverMedals}</td>
              <td>{country.bronzeMedals}</td>
              <td>
                {country.goldMedals +
                  country.silverMedals +
                  country.bronzeMedals}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <button onClick={() => setShowModal(true)}>Add Medals</button> */}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Medals</h2>
            <label>
              Country:
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.nom}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Gold:
              <input
                type="number"
                value={gold}
                onChange={(e) => setGold(Number(e.target.value))}
              />
            </label>
            <label>
              Silver:
              <input
                type="number"
                value={silver}
                onChange={(e) => setSilver(Number(e.target.value))}
              />
            </label>
            <label>
              Bronze:
              <input
                type="number"
                value={bronze}
                onChange={(e) => setBronze(Number(e.target.value))}
              />
            </label>
            <button onClick={handleAddMedals}>Submit</button>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Results;
