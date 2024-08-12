import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import deletePic from "../../assets/supprimer-fichier.png";
import modifyPic from "../../assets/bouton-modifier.png";
import addPic from "../../assets/stylo.png";
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
    image: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchCommuniques = async () => {
    try {
      const response = await axios.get("http://localhost:8086/api/v1/communiques");
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
      <h1 className="text-center my-4">Communiqués</h1>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex justify-content-center w-100">
          <div className="d-flex align-items-center w-100" style={{ maxWidth: "700px" }}>
            <input
              type="search"
              className="form-control"
              placeholder="Rechercher un communiqué..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {userRole === "admin" && (
        <button
          className="btn btn-primary mb-4"
          onClick={() => setShowModal(true)}
        >
          <img
            src={addPic}
            alt="Ajouter un communiqué"
            style={{ width: "40px", height: "40px" }}
          />
        </button>
      )}

      <div className="row row-cols-1 row-cols-md-4 g-4">
        {filteredCommuniquesByTitle.map((communique) => (
          <div className="col" key={communique.id}>
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
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                {userRole === "admin" && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      display: "flex",
                      gap: "5px",
                    }}
                  >
                    <Link to={`/communiques/${communique.id}/edit`}>
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
                  </div>
                )}
              </div>
              <div className="card-body">
                <h5 className="card-title fw-bold">{communique.titre}</h5>
                <p className="card-text">{communique.contenu}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un nouveau communiqué</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddCommunique}>
            <Form.Group controlId="titre">
              <Form.Label>Titre</Form.Label>
              <Form.Control
                type="text"
                name="titre"
                value={newCommunique.titre}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="contenu">
              <Form.Label>Contenu</Form.Label>
              <Form.Control
                as="textarea"
                name="contenu"
                rows={3}
                value={newCommunique.contenu}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="datePublication">
              <Form.Label>Date de publication</Form.Label>
              <Form.Control
                type="date"
                name="datePublication"
                value={newCommunique.datePublication}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
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

export default CommuniqueList;
