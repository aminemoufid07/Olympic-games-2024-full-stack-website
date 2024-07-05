import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Container, Row, Col, Table } from "react-bootstrap";
import modifyPic from "../../assets/bouton-modifier.png";
import deletePic from "../../assets/supprimer.png";
import addPic from "../../assets/stylo.png";

const TypeList = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [newType, setNewType] = useState(""); // État pour le nouveau type
  const [formError, setFormError] = useState(""); // État pour le message d'erreur du formulaire
  const [editMode, setEditMode] = useState(false); // État pour mode d'édition
  const [currentTypeId, setCurrentTypeId] = useState(null); // État pour l'ID du type actuel

  useEffect(() => {
    axios
      .get("http://localhost:8086/api/v1/types")
      .then((response) => {
        setTypes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8086/api/v1/types/${id}`)
      .then(() => {
        setTypes(types.filter((type) => type.id !== id)); // Supprimer le type de la liste des types
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleEdit = (id) => {
    const type = types.find((type) => type.id === id);
    setCurrentTypeId(id);
    setNewType(type.nom);
    setEditMode(true);
    setShow(true);
  };

  const handleAddOrUpdate = () => {
    if (!newType) {
      setFormError("Le champ nom ne peut pas être vide");
      return;
    }

    if (editMode) {
      axios
        .put(`http://localhost:8086/api/v1/types/${currentTypeId}`, {
          nom: newType,
        })
        .then((response) => {
          setTypes(
            types.map((type) =>
              type.id === currentTypeId ? response.data : type
            )
          );
          setNewType("");
          setShow(false);
          setFormError("");
          setEditMode(false);
          setCurrentTypeId(null);
        })
        .catch((error) => {
          setError(error);
        });
    } else {
      axios
        .post("http://localhost:8086/api/v1/types", { nom: newType })
        .then((response) => {
          setTypes([...types, response.data]); // Ajouter le nouveau type à la liste des types
          setNewType(""); // Réinitialiser le champ du nouveau type
          setShow(false); // Fermer le modal
          setFormError(""); // Réinitialiser le message d'erreur
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
    setShow(false);
    setEditMode(false);
    setCurrentTypeId(null);
    setNewType("");
    setFormError("");
  };

  const handleShow = () => {
    setNewType(""); // Réinitialiser le champ du nouveau type
    setFormError(""); // Réinitialiser le message d'erreur
    setShow(true);
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
        .table {
          margin-top: 20px;
        }
        .table th, .table td {
          text-align: center;
        }
        .table img {
          cursor: pointer;
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
            <h1>Liste des Types</h1>
            <Button variant="outline-primary" onClick={handleShow}>
              <img
                src={addPic}
                alt="Ajouter"
                style={{ width: "30px", height: "30px" }}
              />
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {types.map((type) => (
                <tr key={type.id}>
                  <td>{type.nom}</td>
                  <td>
                    <Button
                      variant="link"
                      onClick={() => handleEdit(type.id)}
                    >
                      <img
                        src={modifyPic}
                        alt="Modifier"
                        style={{ width: "30px", height: "30px" }}
                      />
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => handleDelete(type.id)}
                    >
                      <img
                        src={deletePic}
                        alt="Supprimer"
                        style={{ width: "30px", height: "30px" }}
                      />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "Modifier le type" : "Ajouter un nouveau type"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nom du type</Form.Label>
              <Form.Control
                type="text"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Entrer le nom du type"
              />
              {formError && <p className="text-danger">{formError}</p>}
            </Form.Group>
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
    </Container>
  );
};

export default TypeList;
