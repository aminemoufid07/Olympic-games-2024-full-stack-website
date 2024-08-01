import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import modifyPic from "../../assets/bouton-modifier.png";
import deletePic from "../../assets/supprimer.png";
import addPic from "../../assets/stylo.png";

const PaysList = () => {
  const [pays, setPays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [newPays, setNewPays] = useState({ nom: "", image: null });
  const [formError, setFormError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentPaysId, setCurrentPaysId] = useState(null);

  useEffect(() => {
    fetchPays();
  }, []);

  const fetchPays = async () => {
    try {
      let url = "http://localhost:8086/api/v1/pays";
      const response = await axios.get(url);
      const paysWithImageUrls = response.data.map((pays) => {
        if (pays.image) {
          const byteCharacters = atob(pays.image);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/jpeg" });
          const imageUrl = URL.createObjectURL(blob);
          return { ...pays, imageUrl };
        }
        return pays;
      });
      setPays(paysWithImageUrls);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8086/api/v1/pays/${id}`)
      .then(() => {
        setPays(pays.filter((pays) => pays.id !== id));
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleEdit = (id) => {
    const selectedPays = pays.find((pays) => pays.id === id);
    setCurrentPaysId(id);
    setNewPays({ nom: selectedPays.nom, image: selectedPays.image });
    setEditMode(true);
    setShow(true);
  };

 


  const handleAddOrUpdate = () => {
    if (!newPays.nom) {
      setFormError("Le champ nom ne peut pas être vide");
      return;
    }

    const formData = new FormData();
    formData.append("nom", newPays.nom);
    if (newPays.image) {
      formData.append("image", newPays.imageUrl);
    }

    if (editMode) {
      axios
        .put(`http://localhost:8086/api/v1/pays/${currentPaysId}`, formData)
        .then((response) => {
          setPays(
            pays.map((pays) =>
              pays.id === currentPaysId ? response.data : pays
            )
          );
          resetForm();
        })
        .catch((error) => {
          setError(error);
        });
    } else {
      axios
        .post("http://localhost:8086/api/v1/pays", formData)
        .then((response) => {
          setPays([...pays, response.data]);
          resetForm();
        })
        .catch((error) => {
          setError(error);
        });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleAddOrUpdate();
    }
  };

  const handleClose = () => {
    resetForm();
  };

  const handleShow = () => {
    resetForm();
    setShow(true);
  };

  const handleImageChange = (e) => {
    setNewPays((prevState) => ({
      ...prevState,
      image: e.target.files[0],
    }));
  };

  const resetForm = () => {
    setShow(false);
    setEditMode(false);
    setCurrentPaysId(null);
    setNewPays({ nom: "", image: null });
    setFormError("");
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <Container>
      <style jsx>{`
        h1 {
          font-size: 2rem;
          color: #333;
        }
        .card-deck {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
        }
        .card {
          width: 150px;
        }
        .card img {
          width: 100%;
          height: 100px;
          object-fit: contain;
        }
        .modal-title {
          color: #007bff;
        }
        .btn-outline-primary img {
          width: 30px;
          height: 30px;
        }
        .btn-link img {
          width: 30px;
          height: 30px;
        }
      `}</style>
      <Row className="my-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>Liste des Pays</h1>
            {/* <Button variant="outline-primary" onClick={handleShow}>
              <img
                src={addPic}
                alt="Ajouter"
                style={{ width: "30px", height: "30px" }}
              />
            </Button> */}
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="card-deck">
            {pays.map((pays) => (
              <Card key={pays.id}>
                <Card.Img variant="top" src={pays.imageUrl} />
                <Card.Body>
                  <Card.Title>{pays.nom}</Card.Title>
                </Card.Body>
                {/* <Card.Footer>
                  <Button variant="link" onClick={() => handleEdit(pays.id)}>
                    <img
                      src={modifyPic}
                      alt="Modifier"
                      style={{ width: "30px", height: "30px" }}
                    />
                  </Button>
                  <Button
                    variant="link"
                    onClick={() => handleDelete(pays.id)}
                  >
                    <img
                      src={deletePic}
                      alt="Supprimer"
                      style={{ width: "30px", height: "30px" }}
                    />
                  </Button>
                </Card.Footer> */}
              </Card>
            ))}
          </div>
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "Modifier le pays" : "Ajouter un nouveau pays"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nom du pays</Form.Label>
              <Form.Control
                type="text"
                value={newPays.nom}
                onChange={(e) =>
                  setNewPays((prevState) => ({
                    ...prevState,
                    nom: e.target.value,
                  }))
                }
                onKeyPress={handleKeyPress}
                placeholder="Nom"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Drapeau</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange}
                accept="image/*"
              />
            </Form.Group>
            {formError && <p style={{ color: "red" }}>{formError}</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleAddOrUpdate}>
            {editMode ? "Modifier" : "Ajouter"}
          </Button>
        </Modal.Footer>
      </Modal>
      <Row>
        <Col>
        <div>
        <div style={{ height: "100px" }}></div>
        </div>
        </Col>
    </Row>
    </Container>
     
  );
};

export default PaysList;
