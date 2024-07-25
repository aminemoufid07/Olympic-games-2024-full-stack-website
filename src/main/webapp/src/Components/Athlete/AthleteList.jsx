import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useUserRole } from "../../util/userRoleContext";
import searchPic from "../../assets/search.png"; // Update this path based on your assets folder
import addPic from "../../assets/stylo.png"; // Update this path based on your assets folder
import deletePic from "../../assets/supprimer-fichier.png";
import modifyPic from "../../assets/bouton-modifier.png";
import resetPic from "../../assets/reset.png";
import filtrePic from "../../assets/filtre-on.png";

const AthleteList = ({ currentUser }) => {
  const userRole = useUserRole();
  const [selectedSportId, setSelectedSportId] = useState("");
  const [filteredSportId, setFilteredSportId] = useState("");
  const [selectedPaysId, setSelectedPaysId] = useState("");
  const [filteredPaysId, setFilteredPaysId] = useState("");
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newAthlete, setNewAthlete] = useState({
    prenom: "",
    nom: "",
    photo: null,
    sexe: "",
    dateDeNaissance: "",
    paysId: "",
    pays: [],
    sportId: "",
    sports: [],
    medaille: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const fetchAthletes = async (sportId = "", paysId = "") => {
    try {
      let url = "http://localhost:8086/api/v1/athletes/filter";
      if (sportId || paysId) {
        url += `?${sportId ? `sportId=${sportId}&` : ""}${
          paysId ? `paysId=${paysId}` : ""
        }`;
      }
      console.log("URL de l'API:", url);
      const response = await axios.get(url);
      const athletesWithImageUrls = response.data.map((athlete) => {
        if (athlete.photo) {
          const byteCharacters = atob(athlete.photo);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/jpeg" });
          const photoUrl = URL.createObjectURL(blob);
          return { ...athlete, photoUrl };
        }
        return athlete;
      });

      setAthletes(athletesWithImageUrls);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const fetchSports = async () => {
    try {
      const response = await axios.get("http://localhost:8086/api/v1/sports");
      setNewAthlete((prevState) => ({
        ...prevState,
        sports: response.data,
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des sports :", error);
    }
  };

  const fetchPays = async () => {
    try {
      const response = await axios.get("http://localhost:8086/api/v1/pays");
      setNewAthlete((prevState) => ({
        ...prevState,
        pays: response.data,
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des pays :", error);
    }
  };

  useEffect(() => {
    fetchAthletes(filteredSportId, filteredPaysId);
  }, [filteredSportId, filteredPaysId]);

  useEffect(() => {
    fetchAthletes();
    fetchSports();
    fetchPays();
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8086/api/v1/athletes/${id}`)
      .then(() => {
        const updatedAthletes = athletes.filter((athlete) => athlete.id !== id);
        setAthletes(updatedAthletes);
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression :", error);
      });
  };

  const handleCardClick = (id) => {
    navigate(`/athletes/${id}`);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewAthlete({
      prenom: "",
      nom: "",
      photo: null,
      sexe: "",
      dateDeNaissance: "",
      paysId: "",
      pays: newAthlete.pays,
      sportId: "",
      sports: newAthlete.sports,
      medaille: "",
    });
  };

  const handleAddAthlete = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("prenom", newAthlete.prenom);
    formData.append("nom", newAthlete.nom);
    formData.append("photo", newAthlete.photo);
    formData.append("sexe", newAthlete.sexe);
    formData.append("dateDeNaissance", newAthlete.dateDeNaissance);
    formData.append("paysId", newAthlete.paysId);
    formData.append("sportId", newAthlete.sportId);
    formData.append("medaille", newAthlete.medaille);

    axios
      .post("http://localhost:8086/api/v1/athletes", formData)
      .then((response) => {
        const updatedAthletes = [...athletes, response.data];
        setAthletes(updatedAthletes);
        handleModalClose();
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout :", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAthlete((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewAthlete((prevState) => ({
      ...prevState,
      photo: e.target.files[0],
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleFilterClick = () => {
    setFilteredSportId(selectedSportId);
    setFilteredPaysId(selectedPaysId);
  };

  const handleSportChange = (e) => {
    setSelectedSportId(e.target.value);
  };
  const handlePaysChange = (e) => {
    setSelectedPaysId(e.target.value);
  };
  const handleResetActualities = () => {
    setFilteredSportId("");
    setFilteredPaysId("");
  };
  const filteredAthletes = athletes.filter(
    (athlete) =>
      athlete.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div className="container">
      <h1 className="text-center my-4">ATHLÈTES</h1>
      <div className="d-flex justify-content-center mb-4">
        <input
          type="text"
          className="form-control"
          style={{ width: "300px" }}
          placeholder="Rechercher un athlète..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button style={{ border: "none", background: "none" }}>
          <img
            src={searchPic}
            alt="Rechercher"
            style={{ width: "30px", height: "30px" }}
          />
        </button>
      </div>
      <div className="d-flex justify-content-center align-items-center mb-4">
        <span style={{ marginRight: "10px", fontWeight: "bold" }}>
          Catégories d'actualités
        </span>

        <Form.Select
          className="ms-2"
          style={{ width: "300px", marginRight: "10px" }}
          value={selectedSportId}
          onChange={handleSportChange}
          aria-label="Filtrer par sport"
        >
          <option value="">Sélectionnez un sport</option>
          {newAthlete.sports.map((sport) => (
            <option key={sport.id} value={sport.id}>
              {sport.nom}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          className="ms-2"
          style={{ width: "300px", marginRight: "10px" }}
          value={selectedPaysId}
          onChange={handlePaysChange}
          aria-label="Filtrer par pays"
        >
          <option value="">Sélectionnez un pays</option>
          {newAthlete.pays.map((pays) => (
            <option key={pays.id} value={pays.id}>
              {pays.nom}
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
      <div className="d-flex justify-content-end mb-4">
        {userRole === "admin" && (
          <button
            style={{ padding: "0", border: "none", background: "none" }}
            onClick={() => setShowModal(true)}
          >
            <img
              src={addPic}
              alt="Ajouter"
              style={{ width: "30px", height: "30px" }}
            />
          </button>
        )}
      </div>
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {filteredAthletes.map((athlete) => (
          <div key={athlete.id} className="col text-center">
            <div
              onClick={() => handleCardClick(athlete.id)}
              style={{ cursor: "pointer" }}
            >
              {athlete.photoUrl && (
                <img
                  src={athlete.photoUrl}
                  alt={athlete.nom}
                  className="rounded-circle"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              )}
              <h5 className="mt-2">
                {athlete.prenom} {athlete.nom}
              </h5>
              <p>
                {athlete.pays.nom} , {athlete.sport.nom}
              </p>
              {userRole === "admin" && (
                <div className="d-flex justify-content-center mt-2">
                  {userRole === "admin" && (
                    <Link to={`/athletes/edit/${athlete.id}`}>
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
                        handleDelete(athlete.id);
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
              )}
            </div>
          </div>
        ))}
      </div>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Athlète</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddAthlete}>
            <Form.Group controlId="formPrenom">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                name="prenom"
                value={newAthlete.prenom}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formNom">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={newAthlete.nom}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPhoto">
              <Form.Label>Photo</Form.Label>
              <Form.Control
                type="file"
                name="photo"
                onChange={handleImageChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formSexe">
              <Form.Label>Sexe</Form.Label>
              <Form.Control
                type="text"
                name="sexe"
                value={newAthlete.sexe}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDateDeNaissance">
              <Form.Label>Date de Naissance</Form.Label>
              <Form.Control
                type="date"
                name="dateDeNaissance"
                value={newAthlete.dateDeNaissance}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPaysId">
              <Form.Label>Pays</Form.Label>
              <Form.Control
                as="select"
                name="paysId"
                value={newAthlete.paysId}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionner un pays</option>
                {newAthlete.pays &&
                  newAthlete.pays.map((pays) => (
                    <option key={pays.id} value={pays.id}>
                      {pays.nom}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formSportId">
              <Form.Label>Sport</Form.Label>
              <Form.Control
                as="select"
                name="sportId"
                value={newAthlete.sportId}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionner un sport</option>
                {newAthlete.sports &&
                  newAthlete.sports.map((sport) => (
                    <option key={sport.id} value={sport.id}>
                      {sport.nom}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formMedaille">
              <Form.Label>Médaille</Form.Label>
              <Form.Control
                type="text"
                name="medaille"
                value={newAthlete.medaille}
                onChange={handleInputChange}
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

export default AthleteList;
