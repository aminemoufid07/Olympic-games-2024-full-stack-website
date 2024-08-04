import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./SportList.css";
import { useUserRole } from "../../util/userRoleContext";
import addPic from "../../assets/stylo.png";


const SportList = ({currentUser}) => {
  const userRole = useUserRole();
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [newSport, setNewSport] = useState("");
  const [formError, setFormError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentSportId, setCurrentSportId] = useState(null);

 
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
  const groupedSportsKeys = Object.keys(groupedSports).sort();

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8086/api/v1/sports/${id}`)
      .then(() => {
        setSports(sports.filter((sport) => sport.id !== id));
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
          setSports([...sports, response.data]);
          setNewSport("");
          setShow(false);
          setFormError("");
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
    setNewSport("");
    setFormError("");
    setShow(true);
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  const renderSportsGroups = () => {
    const rows = [];
    for (let i = 0; i < groupedSportsKeys.length; i += 3) {
      const group = groupedSportsKeys.slice(i, i + 3);
      rows.push(
        <Row key={i} className="mb-4">
          {group.map((letter) => (
            <Col key={letter} className="sports-group">
              <h2>{letter}</h2>
              <ul>
                {groupedSports[letter].map((sport) => (
                  <li key={sport.id} className="sport-item">
                    <Link to={`/sports/${sport.id}`} className="sport-link">
                      {sport.nom}
                    </Link>
                  </li>
                ))}
              </ul>
            </Col>
          ))}
        </Row>
      );
    }
    return rows;
  };

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div className="heading-container">
              <h1 className="text-center my-4">Sports</h1>
            </div>
            
          </div>
        </Col>
      </Row>

      {renderSportsGroups()}

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
                type="text"
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
