import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer
      className="py-3"
      style={{
        backgroundColor: "#61B4E6",
        fontFamily: "'Open Sans', serif",
        fontSize: "14px",
        color: "#FFFFFF",
        textAlign: "center",
      }}
    >
      <div className="container">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} AMINE Moufid. Tous droits réservés.
        </p>
        <p className="mb-0">
          <a href="/terms" style={{ color: "#FFFFFF", textDecoration: "none" }}>
            Conditions d'utilisation
          </a>{" "}
          |
          <a
            href="/privacy"
            style={{
              color: "#FFFFFF",
              textDecoration: "none",
              marginLeft: "10px",
            }}
          >
            Politique de confidentialité
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
