import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IonIcon } from "react-ion-icon";
import logo from "../assets/logo-ol.svg";
import { auth } from "../util/firebase";
import { useUserRole } from "../util/userRoleContext";

const Header = ({ currentUser }) => {
  const userRole = useUserRole();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    auth.signOut();
  };

  const onToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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
            {userRole === "admin" && (
              <li>
                <Link className="hover:text-gray-500" to="/sports">
                  Sports
                </Link>
              </li>
            )}
            <li>
              <Link className="hover:text-gray-500" to="/pays">
                Pays
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-500" to="/actualites">
                Actualités
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-500" to="/communiques">
                Communiques de presse du cnom
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-500" to="/olympicGames">
                Events
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
