import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./AthleteDetail.css";
import goldPic from "../../assets/gold.png";
import silverPic from "../../assets/silver.png";
import bronzePic from "../../assets/bronze.png";

const AthleteDetail = () => {
  const { id } = useParams();
  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8086/api/v1/athletes/${id}`)
      .then((response) => {
        const athlete = response.data;
        if (athlete.photo) {
          const byteCharacters = atob(athlete.photo);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/jpeg" });
          const imageUrl = URL.createObjectURL(blob);
          setAthlete({ ...athlete, imageUrl });
        } else {
          setAthlete(athlete);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  const renderMedals = (medalString) => {
    if (!medalString) return null;

    const [gold, silver, bronze] = medalString.split('/').map(medal => {
      const count = medal.slice(0, -1);
      const type = medal.slice(-1);
      return { count: parseInt(count), type };
    });

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

  if (loading) return <p className="text-center mt-5">Chargement...</p>;
  if (error) return <p className="text-center mt-5">Erreur : {error.message}</p>;
  if (!athlete) return <p className="text-center mt-5">Aucun athlète trouvé</p>;

  return (
    <div className="athlete-detail-container">
      <div className="athlete-detail">
        <img
          src={athlete.imageUrl}
          className="athlete-photo"
          alt={athlete.nom}
        />
        <div className="athlete-info">
          <h1 className="athlete-prenom">{athlete.prenom.toUpperCase()}</h1> 
          <h2 className="athlete-nom">{athlete.nom.toUpperCase()}</h2> 
          <div className="athlete-country-sport">
            <div className="athlete-country">
              <img src={athlete.pays.imageUrl} alt={athlete.pays.nom} />
              <span>{athlete.pays.nom}</span>
            </div>
            <div className="athlete-sport">
              <span>{athlete.sport.nom}</span>
              </div>
              <div className="athlete-stats">
            <div className="stat-row">
              <div className="stat-label">Médailles Olympiques</div>
              <div className="stat-value">{renderMedals(athlete.medaille)}</div>
            </div>
            <div className="stat-row">
              <div className="stat-label">Année de naissance</div>
              <div className="stat-value">{athlete.dateDeNaissance}</div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  
  };

export default AthleteDetail;
