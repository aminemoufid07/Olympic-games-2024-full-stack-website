import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AthleteEdit.css"; // Assurez-vous d'ajouter les styles nécessaires
import goldPic from "../../assets/gold.png";
import silverPic from "../../assets/silver.png";
import bronzePic from "../../assets/bronze.png";
const AthleteEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formError, setFormError] = useState(""); // État pour le message d'erreur du formulaire
  const [athlete, setAthlete] = useState({
    prenom: "",
    nom: "",
    photo: null,
    sexe: "",
    dateDeNaissance: "",
    paysId: "",
    sportId: "",
    medaille: "",
  });
  const [sports, setSports] = useState([]);
  const [pays, setPays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAthlete = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8086/api/v1/athletes/${id}`
        );
        const data = response.data;
        setAthlete({
          prenom: data.prenom,
          nom: data.nom,
          photo: null,
          sexe: data.sexe,
          dateDeNaissance: data.dateDeNaissance,
          paysId: data.pays.id,
          sportId: data.sport.id,
          medaille: data.medaille,
        });
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

    fetchAthlete();
    fetchSports();
    fetchPays();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      // Vérifier si un fichier est sélectionné
      if (files.length > 0) {
        const selectedFile = files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
          // Convertir le fichier en Blob
          const blob = new Blob([reader.result], { type: selectedFile.type });
          setAthlete((prevAthlete) => ({
            ...prevAthlete,
            photo: blob,
          }));
        };

        reader.readAsArrayBuffer(selectedFile);
      }
    } else {
      setAthlete((prevAthlete) => ({
        ...prevAthlete,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !athlete.prenom ||
      !athlete.nom ||
      !athlete.sexe ||
      !athlete.dateDeNaissance ||
      !athlete.paysId ||
      !athlete.sportId ||
      !athlete.medaille
    ) {
      setFormError("Tous les champs sont obligatoires.");
      return;
    }

    const formData = new FormData();
    formData.append("prenom", athlete.prenom);
    formData.append("nom", athlete.nom);
    formData.append("sexe", athlete.sexe);
    formData.append("dateDeNaissance", athlete.dateDeNaissance);
    formData.append("paysId", athlete.paysId);
    formData.append("sportId", athlete.sportId);
    formData.append("medaille", athlete.medaille);
    if (athlete.photo) {
      formData.append("photo", athlete.photo);
    }

    axios
      .put(`http://localhost:8086/api/v1/athletes/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        navigate(`/athletes/${id}`);
      })
      .catch((error) => {
        setError(error);
      });
  };

  const renderMedals = (medalString) => {
    if (!medalString) return null;

    const [gold, silver, bronze] = medalString.split("/").map((medal) => {
      const count = medal.slice(0, -1);
      const type = medal.slice(-1);
      return { count: parseInt(count), type };
    });

    const medalIcons = {
      G: "gold-medal.png",
      S: "silver-medal.png",
      B: "bronze-medal.png",
    };

    return (
      <div className="medal-icons">
        {Array.from({ length: gold.count }).map((_, index) => (
          <img
            key={`gold-${index}`}
            src={goldPic}
            alt="Gold Medal"
            className="medal-icon"
          />
        ))}
        {Array.from({ length: silver.count }).map((_, index) => (
          <img
            key={`silver-${index}`}
            src={silverPic}
            alt="Silver Medal"
            className="medal-icon"
          />
        ))}
        {Array.from({ length: bronze.count }).map((_, index) => (
          <img
            key={`bronze-${index}`}
            src={bronzePic}
            alt="Bronze Medal"
            className="medal-icon"
          />
        ))}
      </div>
    );
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div className="container">
      <br />
      <br />
      <h1>Modifier l'Athlète</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="prenom" className="form-label">
            Prénom
          </label>
          <input
            type="text"
            className="form-control"
            id="prenom"
            name="prenom"
            value={athlete.prenom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="nom" className="form-label">
            Nom
          </label>
          <input
            type="text"
            className="form-control"
            id="nom"
            name="nom"
            value={athlete.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="sexe" className="form-label">
            Sexe
          </label>
          <input
            type="text"
            className="form-control"
            id="sexe"
            name="sexe"
            value={athlete.sexe}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dateDeNaissance" className="form-label">
            Date de Naissance
          </label>
          <input
            type="date"
            className="form-control"
            id="dateDeNaissance"
            name="dateDeNaissance"
            value={athlete.dateDeNaissance}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="paysId" className="form-label">
            Pays
          </label>
          <select
            className="form-control"
            id="paysId"
            name="paysId"
            value={athlete.paysId}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez un pays</option>
            {pays.map((pays) => (
              <option key={pays.id} value={pays.id}>
                {pays.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="sportId" className="form-label">
            Sport
          </label>
          <select
            className="form-control"
            id="sportId"
            name="sportId"
            value={athlete.sportId}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez un sport</option>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.id}>
                {sport.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="medaille" className="form-label">
            Médaille
          </label>
          <div className="medal-container">{athlete.medaille}</div>
          <input
            type="text"
            className="form-control"
            id="medaille"
            name="medaille"
            value={athlete.medaille}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="photo" className="form-label">
            Photo
          </label>
          <input
            type="file"
            className="form-control"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        {formError && <p style={{ color: "red" }}>{formError}</p>}
        <button type="submit" className="btn btn-primary">
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default AthleteEdit;
