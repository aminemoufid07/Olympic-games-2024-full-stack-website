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
    typeId: "",
    types: [],
    image: null,
  });
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [filteredTypeId, setFilteredTypeId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchVisible, setSearchVisible] = useState(true); // State for search input visibility
  const navigate = useNavigate();
 
  const fetchActualites = async (typeId = "") => {
    try {
      let url = "http://localhost:8086/api/v1/actualites";
      if (typeId) {
        url += `/typeId/${typeId}`;
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

  const fetchTypes = async () => {
    try {
      const response = await axios.get("http://localhost:8086/api/v1/types");
      setNewActualite((prevState) => ({
        ...prevState,
        types: response.data,
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des types :", error);
    }
  };

  useEffect(() => {
    fetchActualites(filteredTypeId);
  }, [filteredTypeId]);

  useEffect(() => {
    fetchActualites();
    fetchTypes();
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
      typeId: "",
      image: null,
      types: newActualite.types,
    });
  };

  const handleAddActualite = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titre", newActualite.titre);
    formData.append("contenu", newActualite.contenu);
    formData.append("datePublication", newActualite.datePublication);
    formData.append("typeId", newActualite.typeId);
    if (newActualite.image) {
      formData.append("image", newActualite.image);
    }

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

  const handleTypeChange = (e) => {
    setSelectedTypeId(e.target.value);
  };

  const handleFilterClick = () => {
    setFilteredTypeId(selectedTypeId);
  };

  const handleResetActualities = () => {
    setFilteredTypeId("");
  };

  const handleToggleSearch = () => {
    setSearchVisible(!searchVisible);
    setSearchTerm(""); // Clear search term when hiding the search input
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredActualitesByTitle = actualites.filter((actualite) =>
    actualite.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <button
          // onClick={handleToggleSearch}
          style={{ padding: "0", border: "none", background: "none" }}
        >
          <img  
            src={searchPic}
            alt="Rechercher"
            style={{ width: "40px", height: "40px", marginLeft: "10px" }}
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
          value={selectedTypeId}
          onChange={handleTypeChange}
          aria-label="Filtrer par type"
        >
          <option value="">Sélectionnez un type</option>
          {newActualite.types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.nom}
            </option>
          ))}
        </Form.Select>

        <button
          onClick={handleFilterClick}
          style={{ padding: "0", border: "none", background: "none" }}
        >
          <img
            src={filtrePic}
            alt="Filtrer"
            style={{ width: "40px", height: "40px", marginLeft: "10px" }}
          />
        </button>

        <button
          onClick={handleResetActualities}
          style={{ padding: "0", border: "none", background: "none" }}
        >
          <img
            src={resetPic}
            alt="Réinitialiser"
            style={{ width: "40px", height: "40px", marginLeft: "10px" }}
          />
        </button>
      </div>
      <br />

      <div className="d-flex justify-content-end align-items-center mb-4">
        {userRole === "admin" && (
          <button
            style={{ padding: "0", border: "none", background: "none" }}
            onClick={() => setShowModal(true)}
          >
            <img
              src={addPic}
              alt="Ajouter"
              style={{ width: "40px", height: "40px" }}
            />
          </button>
        )}
      </div>
      <br />
      <br />

      <div className="row row-cols-1 row-cols-md-4 g-4">
        {filteredActualitesByTitle.map((actualite) => (
          <div key={actualite.id} className="col">
            <div
              className="card h-100"
              onClick={() => handleCardClick(actualite.id)}
              style={{ cursor: "pointer" }}
            >
              <div style={{ position: "relative" }}>
                {actualite.imageUrl && (
                  <img
                    src={actualite.imageUrl}
                    alt={actualite.titre}
                    className="card-img-top"
                  />
                )}
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  {userRole === "admin" && (
                    <Link to={`/actualites/edit/${actualite.id}`}>
                      <img
                        src={modifyPic}
                        alt="Modifier"
                        style={{ width: "30px", height: "30px" }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Link>
                  )}
                  {userRole === "admin" && (
                    <button
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
                  )}
                </div>
              </div>
              <div className="card-body">
                {actualite.titre && (
                  <h5 className="card-title fw-bold">{actualite.titre}</h5>
                )}
                {actualite.type && actualite.type.nom && (
                  <p className="card-text">{actualite.type.nom}</p>
                )}
                {actualite.datePublication && (
                  <p className="card-text">
                    <small className="text-muted">
                      Date de publication : {actualite.datePublication}
                    </small>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une Actualité</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddActualite}>
            <Form.Group controlId="formTitre">
              <Form.Label>Titre</Form.Label>
              <Form.Control
                type="text"
                name="titre"
                value={newActualite.titre}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formContenu">
              <Form.Label>Contenu</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="contenu"
                value={newActualite.contenu}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDatePublication">
              <Form.Label>Date de Publication</Form.Label>
              <Form.Control
                type="date"
                name="datePublication"
                value={newActualite.datePublication}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formType">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                name="typeId"
                value={newActualite.typeId}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionnez un type</option>
                {newActualite.types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.nom}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleImageChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Ajouter
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <div style={{ height: "200px" }}></div>
    </div>
  );
};

export default ActualiteList;
