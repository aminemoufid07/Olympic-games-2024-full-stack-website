import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './SportDetail.css'; // Import the CSS file

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
          const byteCharacters = atob(sport.image);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/jpeg" });
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

  const detail = sport.detail || "";
  const enBrefIndex = detail.toLowerCase().indexOf("en bref");
  const histoireOlympiqueIndex = detail
    .toLowerCase()
    .indexOf("histoire olympique");

  const beforeEnBref =
    enBrefIndex !== -1 ? detail.substring(0, enBrefIndex).trim() : null;
  const enBref =
    enBrefIndex !== -1 && histoireOlympiqueIndex !== -1
      ? detail.substring(enBrefIndex + "en bref".length, histoireOlympiqueIndex).trim()
      : null;
  const histoireOlympique =
    histoireOlympiqueIndex !== -1
      ? detail.substring(histoireOlympiqueIndex + "histoire olympique".length).trim()
      : null;

  const commonTextStyle = {
    fontFamily: '"Olympic Sans", Arial, Helvetica, sans-serif',
    fontSize: "24px", 
    lineHeight: "32px",
    textAlign: "justify",
    letterSpacing: "normal",
    color: "#333",
  };

  const titleStyle = {
    fontFamily: '"Olympic Sans", Arial, Helvetica, sans-serif',
    fontSize: "2rem",
    fontWeight: "bold",
    marginTop: "30px",
    marginBottom: "20px", 
    color: "#333",
  };

  const paragraphStyle = {
    ...commonTextStyle,
    marginBottom: "20px",
  };

  const sectionTitleStyle = {
    ...titleStyle,
    marginBottom: "40px",
  };

  const handleButtonClick = () => {
    const searchQuery = `résultats JO 2024 ${sport.nom}`;
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(googleSearchUrl, "_blank");
  };

  return (
    <div>
      <div
        className="sport-header"
        style={{
          backgroundImage: `url(${sport.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "900px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-start",
          padding: "20px",
          color: "white",
          width: "100%",
          position: "relative",
          fontWeight: "bolder",
          fontSize: "58px",
          textAlign: "start",
          letterSpacing: "-2px",
          lineHeight: "58px",
        }}
      >
        <h1
          style={{
            marginLeft: "20px",
            fontFamily: '"Olympic Sans", Helvetica, sans-serif',
            color: "white",
            WebkitTextStrokeWidth: "0.5px",
            fontSize: "58px",
            fontWeight: "bolder",
          }}
        >
          {sport.nom}
        </h1>
      </div>

      <div className="container mt-4">
        {beforeEnBref && (
          <section className="before-en-bref" style={{ marginBottom: "100px" }}>
            <p style={{ ...paragraphStyle, marginTop: "100px" }}>
              {beforeEnBref}
            </p>
          </section>
        )}

        {enBref && (
          <section className="en-bref" style={{ marginBottom: "200px" }}>
            <h2 style={sectionTitleStyle}>EN BREF</h2>
            <p style={paragraphStyle}>{enBref}</p>
          </section>
        )}

        {histoireOlympique && (
          <section
            className="histoire-olympique"
            style={{ marginBottom: "30px" }}
          >
            <h2 style={sectionTitleStyle}>HISTOIRE OLYMPIQUE</h2>
            <p style={paragraphStyle}>{histoireOlympique}</p>
          </section>
        )}

        {/* New Results section */}
        <section className="results button-container">
          <h2 style={sectionTitleStyle}>RÉSULTATS</h2>
          <button
            className="button"
            style={{ padding: "0", border: "none", background: "none" }}
            onClick={handleButtonClick}
          >
            <span className="button-text">Cliquez ici pour voir les résultats</span>
          </button>
        </section>
      </div>
    </div>
  );
};

export default SportDetail;
