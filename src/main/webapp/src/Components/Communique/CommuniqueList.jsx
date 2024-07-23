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

const CommuniqueList = ({ currentUser }) => {
  const userRole = useUserRole();
  const [communiques, setCommuniques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newCommunique, setNewCommunique] = useState({
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

  const fetchCommuniques = async (typeId = "") => {
    try {
      let url = "http://localhost:8086/api/v1/communiques";
      if (typeId) {
        url += `/typeId/${typeId}`;
      }
      const response = await axios.get(url);
      const communiquesWithImageUrls = response.data.map((communique) => {
        if (communique.image) {
          const byteCharacters = atob(communique.image);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/jpeg" });
          const imageUrl = URL.createObjectURL(blob);
          return { ...communique, imageUrl };
        }
        return communique;
      });

      setCommuniques(communiquesWithImageUrls);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommuniques();
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8086/api/v1/communiques/${id}`)
      .then(() => {
        const updatedCommuniques = communiques.filter(
          (communique) => communique.id !== id
        );
        setCommuniques(updatedCommuniques);
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression :", error);
      });
  };

  const handleCardClick = (id) => {
    navigate(`/communiques/${id}`);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewCommunique({
      titre: "",
      contenu: "",
      datePublication: "",

      image: null,
    });
  };

  const handleAddCommunique = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titre", newCommunique.titre);
    formData.append("contenu", newCommunique.contenu);
    formData.append("datePublication", newCommunique.datePublication);

    if (newCommunique.image) {
      formData.append("image", newCommunique.image);
    }

    axios
      .post("http://localhost:8086/api/v1/communiques", formData)
      .then((response) => {
        const updatedCommuniques = [...communiques, response.data];
        setCommuniques(updatedCommuniques);
        handleModalClose();
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout :", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCommunique((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewCommunique((prevState) => ({
      ...prevState,
      image: e.target.files[0],
    }));
  };

  // const handleToggleSearch = () => {
  //   setSearchVisible(!searchVisible);
  //   setSearchTerm(""); // Clear search term when hiding the search input
  // };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCommuniquesByTitle = communiques.filter((communique) =>
    communique.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div className="container">
      <br />
      <br />
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="my-4">Communiques de presse</h1>
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
        {filteredCommuniquesByTitle.map((communique) => (
          <div key={communique.id} className="col">
            <div
              className="card h-100"
              onClick={() => handleCardClick(communique.id)}
              style={{ cursor: "pointer" }}
            >
              <div style={{ position: "relative" }}>
                {communique.imageUrl && (
                  <img
                    src={communique.imageUrl}
                    alt={communique.titre}
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
                    <Link to={`/communiques/edit/${communique.id}`}>
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
                        handleDelete(communique.id);
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
                {communique.titre && (
                  <h5 className="card-title fw-bold">{communique.titre}</h5>
                )}
                {communique.type && communique.type.nom && (
                  <p className="card-text">{communique.type.nom}</p>
                )}
                {communique.datePublication && (
                  <p className="card-text">
                    <small className="text-muted">
                      Date de publication : {communique.datePublication}
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
          <Form onSubmit={handleAddCommunique}>
            <Form.Group controlId="formTitre">
              <Form.Label>Titre</Form.Label>
              <Form.Control
                type="text"
                name="titre"
                value={newCommunique.titre}
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
                value={newCommunique.contenu}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDatePublication">
              <Form.Label>Date de Publication</Form.Label>
              <Form.Control
                type="date"
                name="datePublication"
                value={newCommunique.datePublication}
                onChange={handleInputChange}
                required
              />
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

export default CommuniqueList;
