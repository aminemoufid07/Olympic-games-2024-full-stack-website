import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import deletePic from "../../assets/supprimer-fichier.png";
import modifyPic from "../../assets/bouton-modifier.png";
import addPic from "../../assets/stylo.png";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is included

const ActualiteList = () => {
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for controlling modal visibility
  const [newActualite, setNewActualite] = useState({
    titre: "",
    contenu: "",
    datePublication: "", // Field for publication date
    typeId: "", // Field for selected type ID
    types: [], // To store types fetched from API
    image: null, // Field for the image
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActualites = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8086/api/v1/actualites"
        );
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
    formData.append("typeId", newActualite.typeId); // Change this line
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

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div className="container">
      <br />
      <br />
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="my-4">Liste des Actualités</h1>
        <button
          style={{ padding: "0", border: "none", background: "none" }}
          onClick={() => setShowModal(true)}
        >
          <img
            src={addPic}
            alt="Ajouter"
            style={{ width: "50px", height: "50px" }}
          />
        </button>
      </div>
      <br />
      <br />
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {actualites.map((actualite) => (
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
                  <Link to={`/actualites/edit/${actualite.id}`}>
                    <img
                      src={modifyPic}
                      alt="Modifier"
                      style={{ width: "30px", height: "30px" }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(actualite.id);
                    }}
                    style={{ padding: "0", border: "none", background: "none" }}
                  >
                    <img
                      src={deletePic}
                      alt="Supprimer"
                      style={{ width: "30px", height: "30px" }}
                    />
                  </button>
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

      {/* Modal for adding an actualite */}
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
