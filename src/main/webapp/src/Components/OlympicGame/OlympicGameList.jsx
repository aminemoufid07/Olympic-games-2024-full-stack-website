import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const OlympicGameList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get("http://localhost:8086/api/v1/olympicGames");
        setGames(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const deleteGame = async (id) => {
    try {
      await axios.delete(`http://localhost:8086/api/v1/olympicGames/${id}`);
      setGames(games.filter((game) => game.id !== id));
    } catch (error) {
      setError(error);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div className="container">
      <br />
      <h1>Liste des Jeux Olympiques</h1>
      <Link to="/olympicGames/new" className="btn btn-primary mb-3">Ajouter un nouveau jeu</Link>
      <table className="table">
        <thead>
          <tr>
            
            <th>Nom</th>
            <th>Sport</th>
            <th>Date Prévue</th>
            {/* <th>Heure de debut</th>
            <th>Heure de fin</th> */}
            <th>Sexe</th>
            {/* <th>Médias</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id}>
             
              <td>{game.nom}</td>
              <td>{game.sport.nom}</td>
              <td>{new Date(game.datePrevue).toLocaleDateString()}</td>

              {/* <td>{game.heureDepart}</td>
              <td>{game.heureFin}</td> */}
              <td>{game.sexe}</td>
              {/* <td>{game.media}</td> */}
              <td>
                <Link to={`/olympicGames/${game.id}/edit`} className="btn btn-warning btn-sm">Modifier</Link>
                <button onClick={() => deleteGame(game.id)} className="btn btn-danger btn-sm ml-2">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OlympicGameList;
