import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CommuniqueEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formError, setFormError] = useState(""); // État pour le message d'erreur du formulaire
  const [communique, setCommunique] = useState({
    titre: "",
    contenu: "",

    datePublication: "",
    image: null, // État pour stocker l'image sous forme de Blob
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunique = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8086/api/v1/communiques/${id}`
        );
        const data = response.data;
        setCommunique({
          titre: data.titre,
          contenu: data.contenu,
          datePublication: data.datePublication,
          image: null,
        });
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchCommunique();
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
          const blob = new Blob([reader.result], { type: selectedFile.type });
          setCommunique((prevCommunique) => ({
            ...prevCommunique,
            image: blob,
          }));
        };

        reader.readAsArrayBuffer(selectedFile);
      }
    } else {
      setCommunique((prevCommunique) => ({
        ...prevCommunique,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !communique.titre ||
      !communique.contenu ||
      !communique.datePublication
    ) {
      setFormError("Tous les champs sont obligatoires.");
      return;
    }

    const formData = new FormData();
    formData.append("titre", communique.titre);
    formData.append("contenu", communique.contenu);
    formData.append("datePublication", communique.datePublication);
    if (communique.image) {
      formData.append("image", communique.image);
    }

    axios
      .put(`http://localhost:8086/api/v1/communiques/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        navigate(`/communiques/${id}`);
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
            value={communique.titre}
            onChange={handleChange}
            required
          />
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
            value={communique.contenu}
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
            value={communique.datePublication}
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

export default CommuniqueEdit;
