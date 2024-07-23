import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-ol.svg";
import { auth } from "../util/firebase";
import { useUserRole } from "../util/userRoleContext";

const Header = ({ currentUser }) => {
  const userRole = useUserRole();

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        backgroundColor: "#61B4E6",
        fontFamily: "'Open Sans', serif",
        fontSize: "20px",
        color: "#FFFFFF",
        lineHeight: "40.1px",
      }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand me-10" to="/">
          <img src={logo} alt="Logo" width="100" height="80" />
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-5">
            <li className="nav-item">
              <Link className="nav-link" to="/" style={{ color: "#FFFFFF" }}>
                Accueil
              </Link>
            </li>
            <li className="nav-item ms-4">
              <Link
                className="nav-link"
                to="/athletes"
                style={{ color: "#FFFFFF" }}
              >
                Athletes
              </Link>
            </li>
            {userRole === "admin" && (
              <li className="nav-item ms-4">
                <Link
                  className="nav-link"
                  to="/sports"
                  style={{ color: "#FFFFFF" }}
                >
                  Sports
                </Link>
              </li>
            )}

            <li className="nav-item ms-4">
              <Link
                className="nav-link"
                to="/pays"
                style={{ color: "#FFFFFF" }}
              >
                Pays
              </Link>
            </li>
            <li className="nav-item ms-4">
              <Link
                className="nav-link"
                to="/actualites"
                style={{ color: "#FFFFFF" }}
              >
                Actualités
              </Link>
            </li>
            <li className="nav-item ms-4">
              <Link
                className="nav-link"
                to="/communiques"
                style={{ color: "#FFFFFF" }}
              >
                Communiques de presse du cnom
              </Link>
            </li>

            {userRole === "admin" && (
              <li className="nav-item ms-4">
                <Link
                  className="nav-link"
                  to="/userManagement"
                  style={{ color: "#FFFFFF" }}
                >
                  Gestion d'utilisateurs
                </Link>
              </li>
            )}
          </ul>
          {/* <li className="nav-item ms-4">
                <Link
                  className="nav-link"
                  to="/Events"
                  style={{ color: "#FFFFFF" }}
                >
                  Events
                </Link>
              </li> */}
          <ul className="navbar-nav mb-2 mb-lg-0 ms-auto">
            <li className="nav-item">
              {currentUser ? (
                <button
                  style={{ color: "#FFFFFF" }}
                  className="nav-link"
                  onClick={handleSignOut}
                >
                  Se déconnecter
                </button>
              ) : (
                <Link
                  className="nav-link"
                  to="/compte"
                  style={{ color: "#FFFFFF" }}
                >
                  Se connecter
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
