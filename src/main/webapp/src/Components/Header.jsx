import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/casanet logo.jpeg";

const Header = () => {
  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        backgroundColor: "#f6f6f6",
        fontFamily: "'Open Sans', serif",
        fontSize: "20px",
        color: "#666666",
        lineHeight: "40.1px",
      }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand me-10" to="/">
          {/* <img src={logo} alt="Logo" width="200" height="60" /> */}
          <img src={logo} alt="Logo" width="100" height="80" />
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-5">
            <li className="nav-item">
              <Link className="nav-link" to="/" style={{ color: "#666666" }}>
                Accueil
              </Link>
            </li>
            <li className="nav-item ms-4">
              <Link
                className="nav-link"
                to="/types"
                style={{ color: "#666666" }}
              >
                Types
              </Link>
            </li>
            <li className="nav-item ms-4">
              <Link
                className="nav-link"
                to="/actualites"
                style={{ color: "#666666" }}
              >
                Actualités
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav mb-2 mb-lg-0 ms-auto">
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/compte"
                style={{ color: "#666666" }}
              >
                Compte
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
