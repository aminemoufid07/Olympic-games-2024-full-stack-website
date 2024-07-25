import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const SportDetail = () => {
  const { id } = useParams();
  const [sport, setSport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8086/api/v1/sports/${id}`)
      .then((response) => {
        const sport = response.data;
        if (sport.image) {
          // Convertir l'image base64 en un Blob
          const byteCharacters = atob(sport.image);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/jpeg" });

          // Créer une URL pour le Blob
          const imageUrl = URL.createObjectURL(blob);
          setSport({ ...sport, imageUrl });
        } else {
          setSport(sport);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-5">Chargement...</p>;
  if (error)
    return <p className="text-center mt-5">Erreur : {error.message}</p>;
  if (!sport) return <p className="text-center mt-5">Aucun sport trouvé</p>;

  return (
    <div
      className="sport-card"
      style={{
        padding: "20px",
        backgroundColor: "#fefefe",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        marginBottom: "30px",
      }}
    >
      <div className="container py-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h1
              className="card-title"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "2rem",
                color: "#333",
                marginBottom: "10px",
              }}
            >
              {sport.nom}
            </h1>
            <p
              className="card-subtitle"
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "1rem",
                color: "#666",
                marginBottom: "20px",
              }}
            >
              {sport.detail}
            </p>
            {sport.imageUrl && (
              <img
                src={sport.imageUrl}
                alt={sport.nom}
                className="img-fluid rounded mb-4"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportDetail;
