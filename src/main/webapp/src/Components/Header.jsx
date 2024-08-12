import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { IonIcon } from "react-ion-icon";
import logo from "../assets/logo-ol.svg";
import { auth } from "../util/firebase";
import { useUserRole } from "../util/userRoleContext";

const Header = ({ currentUser }) => {
  const userRole = useUserRole();
  const [menuOpen, setMenuOpen] = useState(false);
  const [newsMenuOpen, setNewsMenuOpen] = useState(false);
  const newsMenuRef = useRef(null);

  const handleSignOut = () => {
    auth.signOut();
  };

  const onToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const onToggleNewsMenu = () => {
    setNewsMenuOpen(!newsMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (newsMenuRef.current && !newsMenuRef.current.contains(event.target)) {
      setNewsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white">
      <nav className="flex justify-between items-center w-[92%] mx-auto py-4">
        <div>
          <Link to="/">
            <img className="w-16 cursor-pointer" src={logo} alt="Logo" />
          </Link>
        </div>
        <div
          className={`nav-links duration-500 md:static absolute bg-white md:min-h-fit min-h-[60vh] left-0 ${
            menuOpen ? "top-[9%]" : "top-[-100%]"
          } md:w-auto w-full flex items-center px-5`}
        >
          <ul className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8">
            <li>
              <Link className="hover:text-gray-500" to="/">
                Accueil
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-500" to="/athletes">
                Athletes
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-500" to="/sports">
                Sports
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-500" to="/pays">
                Pays
              </Link>
            </li>
            <li className="relative">
              <button
                onClick={onToggleNewsMenu}
                className="flex items-center hover:text-gray-500"
                style={{ padding: "0", border: "none", background: "none" }}
              >
                Actualités
                <IonIcon
                  name={newsMenuOpen ? "chevron-up" : "chevron-down"}
                  className="ml-2 text-xl"
                />
              </button>
              {newsMenuOpen && (
                <ul
                  ref={newsMenuRef}
                  role="menu"
                  className="absolute z-10 min-w-[180px] overflow-auto rounded-md border border-blue-gray-50 bg-white p-3 font-sans text-sm font-normal text-blue-gray-500 shadow-lg shadow-blue-gray-500/10 focus:outline-none"
                >
                  <li
                    role="menuitem"
                    className="block w-full cursor-pointer select-none rounded-md px-3 pt-[9px] pb-2 text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                  >
                    <Link to="/actualites">Actualités principales</Link>
                  </li>
                  <li
                    role="menuitem"
                    className="block w-full cursor-pointer select-none rounded-md px-3 pt-[9px] pb-2 text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                  >
                    <Link to="/communiques">Communiques de presse du cnom</Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link className="hover:text-gray-500" to="/Calendar">
                Calendrier
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-500" to="/results">
                Resultats
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-500" to="/chatbot">
                Chatbot
              </Link>
            </li>
            {userRole === "admin" && (
              <li>
                <Link className="hover:text-gray-500" to="/userManagement">
                  Gestion d'utilisateurs
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="flex items-center gap-6">
          {currentUser ? (
            <button
              className="bg-[#a6c1ee] text-white px-5 py-2 rounded-full hover:bg-[#87acec]"
              onClick={handleSignOut}
            >
              Se déconnecter
            </button>
          ) : (
            <Link
              className="bg-[#a6c1ee] text-white px-5 py-2 rounded-full hover:bg-[#87acec]"
              to="/compte"
            >
              Se connecter
            </Link>
          )}
          <IonIcon
            name={menuOpen ? "close" : "menu"}
            className="text-3xl cursor-pointer md:hidden"
            onClick={onToggleMenu}
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
