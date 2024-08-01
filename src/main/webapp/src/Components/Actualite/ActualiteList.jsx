import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import deletePic from "../../assets/supprimer-fichier.png";
import modifyPic from "../../assets/bouton-modifier.png";
import resetPic from "../../assets/reset.png";
import searchPic from "../../assets/search.png";
import addPic from "../../assets/stylo.png";
import filtrePic from "../../assets/filtre-on.png";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useUserRole } from "../../util/userRoleContext";
import maroc from "../../assets/maroc.png";
import monde from "../../assets/monde.png";
import "./ToggleButton.css";

const ActualiteList = ({ currentUser }) => {
  const userRole = useUserRole();
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newActualite, setNewActualite] = useState({
    titre: "",
    contenu: "",
    datePublication: "",
    sportId: "",
    image: null,
    paysIds: [],
  });
  const [sports, setSports] = useState([]);
  const [pays, setPays] = useState([]);
  const [selectedSportId, setSelectedSportId] = useState("");
  const [filteredSportId, setFilteredSportId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchVisible, setSearchVisible] = useState(true);
  const [isActivated, setIsActivated] = useState(false); // State for toggle button
  const navigate = useNavigate();

  const fetchActualites = async (sportId = "") => {
    try {
      let url = "http://localhost:8086/api/v1/actualites";
      if (sportId) {
        url += `/sportId/${sportId}`;
      }
      const response = await axios.get(url);
      const actualitesWithImageUrls = response.data.map((actualite) => {
        if (actualite.image) {
          const byteCharacters = atob(actualite.image);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/jpeg" });
          const imageUrl = URL.createObjectURL(blob);
          return { ...actualite, imageUrl };
        }
        return actualite;
      });

      setActualites(actualitesWithImageUrls);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const fetchSports = async () => {
    try {
      const response = await axios.get("http://localhost:8086/api/v1/sports");
      setSports(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des sports :", error);
    }
  };

  const fetchPays = async () => {
    try {
      const response = await axios.get("http://localhost:8086/api/v1/pays");
      setPays(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des pays :", error);
    }
  };

  useEffect(() => {
    fetchActualites(filteredSportId);
  }, [filteredSportId]);

  useEffect(() => {
    fetchActualites();
    fetchSports();
    fetchPays();
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8086/api/v1/actualites/${id}`)
      .then(() => {
        const updatedActualites = actualites.filter(
          (actualite) => actualite.id !== id
        );
        setActualites(updatedActualites);
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression :", error);
      });
  };

  const handleCardClick = (id) => {
    navigate(`/actualites/${id}`);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewActualite({
      titre: "",
      contenu: "",
      datePublication: "",
      sportId: "",
      image: null,
      paysIds: [],
    });
  };

  const handleAddActualite = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titre", newActualite.titre);
    formData.append("contenu", newActualite.contenu);
    formData.append("datePublication", newActualite.datePublication);
    formData.append("sportId", newActualite.sportId);
    if (newActualite.image) {
      formData.append("image", newActualite.image);
    }
    newActualite.paysIds.forEach((paysId) => {
      formData.append("paysIds", paysId);
    });

    axios
      .post("http://localhost:8086/api/v1/actualites", formData)
      .then((response) => {
        const updatedActualites = [...actualites, response.data];
        setActualites(updatedActualites);
        handleModalClose();
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout :", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActualite((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewActualite((prevState) => ({
      ...prevState,
      image: e.target.files[0],
    }));
  };

  const handleSportChange = (e) => {
    setSelectedSportId(e.target.value);
  };

  const handlePaysChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedPaysIds = selectedOptions.map((option) => option.value);
    setNewActualite((prevState) => ({
      ...prevState,
      paysIds: selectedPaysIds,
    }));
  };

  const handleFilterClick = () => {
    setFilteredSportId(selectedSportId);
  };

  const handleResetActualities = () => {
    setFilteredSportId("");
  };

  const handleToggleSearch = () => {
    setSearchVisible(!searchVisible);
    setSearchTerm(""); // Clear search term when hiding the search input
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleToggleClick = () => {
    setIsActivated(!isActivated);
  };

  const filteredActualitesByTitle = actualites.filter((actualite) =>
    actualite.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActualites = isActivated
    ? filteredActualitesByTitle.filter((actualite) =>
        actualite.pays.some((pays) => pays.nom === "Morocco")
      )
    : filteredActualitesByTitle;

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div className="container">
      <br />
      <br />
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="my-4">Actualités</h1>
        {searchVisible && (
          <input
            type="text"
            className="form-control ms-auto"
            style={{ width: "200px" }}
            placeholder="Rechercher par titre..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        )}
        <div className="theme-toggle-button" onClick={handleToggleClick}>
          <div
            id="switch-toggle"
            className={`toggle-switch ${
              isActivated ? "bg-gray-700 translate-x-full" : "-translate-x-2"
            }`}
          >
            <img
              id="toggle-image"
              src={isActivated ? maroc : monde}
              alt="Toggle Image"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>

        <button style={{ padding: "0", border: "none", background: "none" }}>
          <img
            src={searchPic}
            alt="Rechercher"
            style={{ width: "40px", height: "40px", marginLeft: "10px" }}
            onClick={handleToggleSearch}
          />
        </button>
      </div>
      <br />
      <br />

      <div className="d-flex justify-content-center align-items-center mb-4">
        <span style={{ marginRight: "10px", fontWeight: "bold" }}>
          Catégories d'actualités
        </span>

        <Form.Select
          className="ms-2"
          style={{ width: "300px", marginRight: "10px" }}
          value={selectedSportId}
          onChange={handleSportChange}
        >
          <option value="">Tous les sports</option>
          {sports.map((sport) => (
            <option key={sport.id} value={sport.id}>
              {sport.nom}
            </option>
          ))}
        </Form.Select>

        <button
          className="btn btn-primary me-2"
          style={{ padding: "0", border: "none", background: "none" }}
          onClick={handleFilterClick}
        >
          <img
            src={filtrePic}
            alt="Filtrer"
            style={{ width: "40px", height: "40px" }}
          />
        </button>
        <button
          className="btn btn-secondary"
          style={{ padding: "0", border: "none", background: "none" }}
          onClick={handleResetActualities}
        >
          <img
            src={resetPic}
            alt="Réinitialiser"
            style={{ width: "40px", height: "40px" }}
          />
        </button>
      </div>

      {userRole === "admin" && (
        <button
          className="btn btn-primary mb-4"
          style={{ padding: "0", border: "none", background: "none" }}
          onClick={() => setShowModal(true)}
        >
          <img
            src={addPic}
            alt="Ajouter une actualité"
            style={{ width: "40px", height: "40px" }}
          />
        </button>
      )}

      <div className="row">
        {filteredActualites.map((actualite) => (
          <div className="col-lg-4 mb-4" key={actualite.id}>
            <div
              className="card h-100"
              onClick={() => handleCardClick(actualite.id)}
              style={{ cursor: "pointer" }}
            >
              {actualite.imageUrl && (
                <img
                  src={actualite.imageUrl}
                  alt={actualite.titre}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{actualite.titre}</h5>
                <p className="card-text">{actualite.contenu}</p>
              </div>
              {userRole === "admin" && (
                <div className="d-flex justify-content-between align-items-center p-3">
                  <button
                    className="btn btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(actualite.id);
                    }}
                    style={{
                      padding: "0",
                      border: "none",
                      background: "none",
                    }}
                  >
                    <img
                      src={deletePic}
                      alt="Supprimer"
                      style={{ width: "30px", height: "30px" }}
                    />
                  </button>
                  <Link to={`/actualites/${actualite.id}/edit`}>
                    <button
                      className="btn btn-warning"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        padding: "0",
                        border: "none",
                        background: "none",
                      }}
                    >
                      <img
                        src={modifyPic}
                        alt="Modifier"
                        style={{ width: "30px", height: "30px" }}
                      />
                    </button>
                  </Link>
                </div>
              )}
            </div>
            
          </div>
        ))}
        <div style={{ height: "100px" }}></div>
      </div>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une nouvelle actualité</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddActualite}>
            <Form.Group controlId="titre">
              <Form.Label>Titre</Form.Label>
              <Form.Control
                type="text"
                name="titre"
                value={newActualite.titre}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="contenu">
              <Form.Label>Contenu</Form.Label>
              <Form.Control
                as="textarea"
                name="contenu"
                rows={3}
                value={newActualite.contenu}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="datePublication">
              <Form.Label>Date de publication</Form.Label>
              <Form.Control
                type="date"
                name="datePublication"
                value={newActualite.datePublication}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="sportId">
              <Form.Label>Sport</Form.Label>
              <Form.Select
                name="sportId"
                value={newActualite.sportId}
                onChange={handleInputChange}
              >
                <option value="">Sélectionnez un sport</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.nom}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>
            <Form.Group controlId="paysIds">
              <Form.Label>Pays</Form.Label>
              <Form.Select
                multiple
                name="paysIds"
                value={newActualite.paysIds}
                onChange={handlePaysChange}
              >
                {Array.isArray(pays) && pays.map((pays) => (
                  <option key={pays.id} value={pays.id}>
                    {pays.nom}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Ajouter
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ActualiteList;
