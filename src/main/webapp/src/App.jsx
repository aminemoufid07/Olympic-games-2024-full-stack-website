import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import TypeList from "./Components/Type/TypeList";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import "./index.css";
import ActualiteList from "./Components/Actualite/ActualiteList";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ActualiteDetail from "./Components/Actualite/ActualiteDetail";
import ActualiteEdit from "./Components/Actualite/ActualiteEdit";

function App() {
  return (
    <Router>
      <div>
        <Header />
        <main style={{ minHeight: "80vh" }}>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/types" element={<TypeList />} />
            <Route path="/actualites" element={<ActualiteList />} />
            <Route path="/actualites/edit/:id" element={<ActualiteEdit />} />

            <Route path="/actualites/:id" element={<ActualiteDetail />} />
            {/* <Route path="/compte" element={<Compte />} /> */}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
