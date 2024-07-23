import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CommuniqueDetail = () => {
  const { id } = useParams();
  const [communique, setCommunique] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8086/api/v1/communiques/${id}`)
      .then((response) => {
        const communique = response.data;
        if (communique.image) {
          // Convertir l'image base64 en un Blob
          const byteCharacters = atob(communique.image);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/jpeg" });

          // Créer une URL pour le Blob
          const imageUrl = URL.createObjectURL(blob);
          setCommunique({ ...communique, imageUrl });
        } else {
          setCommunique(communique);
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
  if (!communique)
    return <p className="text-center mt-5">Aucune actualité trouvée</p>;

  return (
    <div
      className="communique-card"
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
            <div className="text-muted mb-3">
              
            </div>
            <h1
              className="card-title"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "2rem",
                color: "#333",
                marginBottom: "10px",
              }}
            >
              {communique.titre}
            </h1>
            {communique.datePublication && (
              <p
                className="card-subtitle"
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "1rem",
                  color: "#666",
                  marginBottom: "20px",
                }}
              >
                Publié le : {communique.datePublication}
              </p>
            )}
            <br />
            <br />
            {communique.imageUrl && (
              <img
                src={communique.imageUrl}
                alt={communique.titre}
                className="img-fluid rounded mb-4"
              />
            )}

            <br />
            <br />

            <p
              className="card-text"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.1rem",
                lineHeight: "1.75",
                color: "#333",
                backgroundColor: "#f9f9f9",
                padding: "10px 15px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                whiteSpace: "pre-line",
              }}
            >
              {communique.contenu}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommuniqueDetail;
