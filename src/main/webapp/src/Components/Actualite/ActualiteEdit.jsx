import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ActualiteEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formError, setFormError] = useState(""); // État pour le message d'erreur du formulaire
  const [actualite, setActualite] = useState({
    titre: "",
    contenu: "",
    sportId: "",
    datePublication: "",
    image: null, // État pour stocker l'image sous forme de Blob
  });
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActualite = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8086/api/v1/actualites/${id}`
        );
        const data = response.data;
        setActualite({
          titre: data.titre,
          contenu: data.contenu,
          sportId: data.sport.id,
          datePublication: data.datePublication,
          image: null,
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

    fetchActualite();
    fetchSports();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      // Vérifier si un fichier est sélectionné
      if (files.length > 0) {
        const selectedFile = files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
          // Convertir le fichier en Blob
          const blob = new Blob([reader.result], { sport: selectedFile.sport });
          setActualite((prevActualite) => ({
            ...prevActualite,
            image: blob,
          }));
        };

        reader.readAsArrayBuffer(selectedFile);
      }
    } else {
      setActualite((prevActualite) => ({
        ...prevActualite,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !actualite.titre ||
      !actualite.contenu ||
      !actualite.sportId ||
      !actualite.datePublication
    ) {
      setFormError("Tous les champs sont obligatoires.");
      return;
    }

    const formData = new FormData();
    formData.append("titre", actualite.titre);
    formData.append("contenu", actualite.contenu);
    formData.append("sportId", actualite.sportId);
    formData.append("datePublication", actualite.datePublication);
    if (actualite.image) {
      formData.append("image", actualite.image);
    }

    axios
      .put(`http://localhost:8086/api/v1/actualites/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        navigate(`/actualites/${id}`);
      })
      .catch((error) => {
        setError(error);
      });
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div className="container">
      <br />
      <br />
      <h1>Modifier l'Actualité</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="titre" className="form-label">
            Titre
          </label>
          <input
            type="text"
            className="form-control"
            id="titre"
            name="titre"
            value={actualite.titre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="sportId" className="form-label">
            Sport
          </label>
          <select
            className="form-control"
            id="sportId"
            name="sportId"
            value={actualite.sportId}
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
          <label htmlFor="contenu" className="form-label">
            Contenu
          </label>
          <textarea
            className="form-control"
            id="contenu"
            name="contenu"
            rows="5"
            value={actualite.contenu}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="datePublication" className="form-label">
            Date de Publication
          </label>
          <input
            type="date"
            className="form-control"
            id="datePublication"
            name="datePublication"
            value={actualite.datePublication}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Image
          </label>
          <input
            type="file"
            className="form-control"
            id="image"
            name="image"
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

export default ActualiteEdit;
