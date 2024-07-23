import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Container, Row, Col } from "react-bootstrap";
import modifyPic from "../../assets/bouton-modifier.png";
import deletePic from "../../assets/supprimer.png";
import addPic from "../../assets/stylo.png";

const SportList = () => {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [newSport, setNewSport] = useState(""); // État pour le nouveau sport
  const [formError, setFormError] = useState(""); // État pour le message d'erreur du formulaire
  const [editMode, setEditMode] = useState(false); // État pour mode d'édition
  const [currentSportId, setCurrentSportId] = useState(null); // État pour l'ID du sport actuel

  useEffect(() => {
    axios
      .get("http://localhost:8086/api/v1/sports")
      .then((response) => {
        setSports(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const groupSportsByLetter = (sports) => {
    const grouped = {};
    sports.forEach((sport) => {
      const firstLetter = sport.nom.charAt(0).toUpperCase();
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(sport);
    });
    return grouped;
  };

  const groupedSports = groupSportsByLetter(sports);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8086/api/v1/sports/${id}`)
      .then(() => {
        setSports(sports.filter((sport) => sport.id !== id)); // Supprimer le sport de la liste des sports
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleEdit = (id) => {
    const sport = sports.find((sport) => sport.id === id);
    setCurrentSportId(id);
    setNewSport(sport.nom);
    setEditMode(true);
    setShow(true);
  };

  const handleAddOrUpdate = () => {
    if (!newSport) {
      setFormError("Le champ nom ne peut pas être vide");
      return;
    }

    if (editMode) {
      axios
        .put(`http://localhost:8086/api/v1/sports/${currentSportId}`, {
          nom: newSport,
        })
        .then((response) => {
          setSports(
            sports.map((sport) =>
              sport.id === currentSportId ? response.data : sport
            )
          );
          setNewSport("");
          setShow(false);
          setFormError("");
          setEditMode(false);
          setCurrentSportId(null);
        })
        .catch((error) => {
          setError(error);
        });
    } else {
      axios
        .post("http://localhost:8086/api/v1/sports", { nom: newSport })
        .then((response) => {
          setSports([...sports, response.data]); // Ajouter le nouveau sport à la liste des sports
          setNewSport(""); // Réinitialiser le champ du nouveau sport
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
    setCurrentSportId(null);
    setNewSport("");
    setFormError("");
  };

  const handleShow = () => {
    setNewSport(""); // Réinitialiser le champ du nouveau sport
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
        .sports-group {
          margin-bottom: 1.5rem;
        }
        .sports-group h2 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .sports-group ul {
          list-style: none;
          padding: 0;
        }
        .sports-group li {
          font-size: 1rem;
          line-height: 1.5;
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
        .sports-group {
          margin-bottom: 1.5rem;
        }

        .sports-group h2 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .sports-group ul {
          list-style: none;
          padding: 0;
        }

        .sports-group li {
          font-size: 1rem;
          line-height: 1.5;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      `}</style>
      <Row className="my-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>Liste des Sports</h1>
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
        {Object.keys(groupedSports)
          .sort()
          .map((letter) => (
            <Col key={letter} className="sports-group">
              <h2>{letter}</h2>
              <ul>
                {groupedSports[letter].map((sport) => (
                  <li key={sport.id}>
                    {sport.nom}
                    <Button variant="link" onClick={() => handleEdit(sport.id)}>
                      <img
                        src={modifyPic}
                        alt="Modifier"
                        style={{ width: "20px", height: "20px" }}
                      />
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => handleDelete(sport.id)}
                    >
                      <img
                        src={deletePic}
                        alt="Supprimer"
                        style={{ width: "20px", height: "20px" }}
                      />
                    </Button>
                  </li>
                ))}
              </ul>
            </Col>
          ))}
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "Modifier le sport" : "Ajouter un nouveau sport"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nom du sport</Form.Label>
              <Form.Control
                sport="text"
                value={newSport}
                onChange={(e) => setNewSport(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Entrer le nom du sport"
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

export default SportList;
