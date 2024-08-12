import React, { useEffect, useState } from "react";
import "./Results.css";
import headerResults from "../../assets/header-results.png";
import addPic from "../../assets/stylo.png";
import modifyPic from "../../assets/bouton-modifier.png";
import { Modal, Button, Form } from "react-bootstrap";
import { useUserRole } from "../../util/userRoleContext";

function Results({ currentUser }) {
  const userRole = useUserRole();
  const [countries, setCountries] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
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
    const selectedId = parseInt(selectedCountryId, 10);
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
        setShowAddModal(false);
      });
  };

  const handleEditMedals = (country) => {
    setSelectedCountry(country);
    setGold(country.goldMedals);
    setSilver(country.silverMedals);
    setBronze(country.bronzeMedals);
    setShowEditModal(true);
  };

  const handleSaveEditMedals = () => {
    if (!selectedCountry) return;

    const updatedCountry = { ...selectedCountry };
    updatedCountry.goldMedals = gold;
    updatedCountry.silverMedals = silver;
    updatedCountry.bronzeMedals = bronze;

    fetch(`http://localhost:8086/api/v1/pays/${updatedCountry.id}`, {
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
            country.id === updatedCountry.id ? updatedCountry : country
          )
        );
        setShowEditModal(false);
      });
  };

  return (
    <div className="app-container">
      <div className="header-logo">
        <img src={headerResults} alt="Olympic Games Logo" />
      </div>
      <Button
        style={{ padding: "0", border: "none", background: "none" }}
        className="add-button"
        onClick={() => setShowAddModal(true)}
      >
        <img
          src={addPic}
          alt="Ajouter"
          style={{ width: "50px", height: "50px", marginRight: "20px" }}
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
            {userRole === "admin" && <th>ACTIONS</th>}
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
              {userRole === "admin" && (
                <td>
                  <Button
                    onClick={() => handleEditMedals(country)}
                    style={{ padding: "0", border: "none", background: "none" }}
                  >
                    <img
                      src={modifyPic}
                      alt="Modifier"
                      style={{ width: "30px", height: "30px" }}
                    />
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal pour ajouter des médailles */}
      {showAddModal && (
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Medals</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Country</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedCountryId}
                  onChange={(e) => setSelectedCountryId(e.target.value)}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.nom}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Gold</Form.Label>
                <Form.Control
                  type="number"
                  value={gold}
                  onChange={(e) => setGold(Number(e.target.value))}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Silver</Form.Label>
                <Form.Control
                  type="number"
                  value={silver}
                  onChange={(e) => setSilver(Number(e.target.value))}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Bronze</Form.Label>
                <Form.Control
                  type="number"
                  value={bronze}
                  onChange={(e) => setBronze(Number(e.target.value))}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleAddMedals}>
                Submit
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowAddModal(false)}
              >
                Close
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      {/* Modal pour éditer les médailles */}
      {showEditModal && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Medals</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Gold</Form.Label>
                <Form.Control
                  type="number"
                  value={gold}
                  onChange={(e) => setGold(Number(e.target.value))}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Silver</Form.Label>
                <Form.Control
                  type="number"
                  value={silver}
                  onChange={(e) => setSilver(Number(e.target.value))}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Bronze</Form.Label>
                <Form.Control
                  type="number"
                  value={bronze}
                  onChange={(e) => setBronze(Number(e.target.value))}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleSaveEditMedals}>
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                Close
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default Results;
