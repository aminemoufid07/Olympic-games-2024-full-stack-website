import React, { useEffect, useState } from "react";
import axios from "axios";

function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      const response = await axios.get("http://localhost:3001/api/events"); // Remplacez par l'URL de votre serveur de scraping
      setEvents(response.data);
    }

    fetchEvents();
  }, []);

  return (
    <div>
      {events.map((event, index) => (
        <div key={index} className="event-card">
          <h3>{event.title}</h3>
          <p>{event.category}</p>
          <p>{event.location}</p>
          <p>{event.date}</p>
          <p>{event.time}</p>
          <p>{event.price}</p>
        </div>
      ))}
    </div>
  );
}

export default EventList;
