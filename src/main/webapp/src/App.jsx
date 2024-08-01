import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import ActualiteList from "./Components/Actualite/ActualiteList";
import ActualiteDetail from "./Components/Actualite/ActualiteDetail";
import CommuniqueList from "./Components/Communique/CommuniqueList";
import CommuniqueDetail from "./Components/Communique/CommuniqueDetail";
import CommuniqueEdit from "./Components/Communique/CommuniqueEdit";
import AthleteList from "./Components/Athlete/AthleteList";
import AthleteDetail from "./Components/Athlete/AthleteDetail";
import AthleteEdit from "./Components/Athlete/AthleteEdit";
import Calendar from "./Components/OlympicGame/Calendar";
import Results from "./Components/OlympicGame/Results";
import PaysList from "./Components/Pays/PaysList";
// import OlympicGameDetail from "./Components/OlympicGame/OlympicGameDetail";
// import OlympicGameEdit from "./Components/OlympicGame/OlympicGameEdit";
import ActualiteEdit from "./Components/Actualite/ActualiteEdit";
import LoginPage from "./Components/Authentification/LoginPage.jsx";
import SignUpPage from "./Components/Authentification/SignUpPage.jsx";
import UserManagement from "./Components/Authentification/UserManagement.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import { auth, db } from "./util/firebase"; // Assurez-vous que db est correctement configuré
import { doc, getDoc } from "firebase/firestore";
import { UserRoleProvider } from "./util/userRoleContext.jsx";
import SportList from "./Components/Sport/SportList.jsx";
import SportDetail from "./Components/Sport/SportDetail.jsx";
import Chatbot from "./Components/Chatbot/Chatbot.jsx";

function App() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserRole(userData.role);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error getting document: ", error);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false); // Set loading to false after fetching user data
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <UserRoleProvider>
        <div>
          <Header currentUser={currentUser} userRole={userRole} />
          <main style={{ minHeight: "80vh" }}>
            <Routes>
              <Route path="/" element={<ActualiteList />} />
              {/* <Route
                path="/sports"
                element={<PrivateRoute allowedRoles={["admin"]} />}
              > */}
              <Route path="/sports" element={<SportList />} />
              {/* </Route> */}
              {/* <Route path="/sports/:id" element={<SportDetail />} />
              <Route
                path="/pays"
                element={<PrivateRoute allowedRoles={["admin"]} />}
              >
                <Route path="/pays" element={<PaysList />} />
              </Route> */}
              <Route path="/pays" element={<PaysList />} />

              <Route path="/actualites" element={<ActualiteList />} />
              <Route path="/actualites/edit/:id" element={<ActualiteEdit />} />
              <Route path="/compte" element={<LoginPage />} />
              <Route path="/inscription" element={<SignUpPage />} />
              <Route
                path="/userManagement"
                element={<PrivateRoute allowedRoles={["admin"]} />}
              >
                <Route path="/userManagement" element={<UserManagement />} />
              </Route>
              <Route path="/actualites/:id" element={<ActualiteDetail />} />
              <Route path="/communiques" element={<CommuniqueList />} />
              <Route path="/communiques/:id" element={<CommuniqueDetail />} />
              <Route
                path="/communiques/edit/:id"
                element={<CommuniqueEdit />}
              />
              {/* <Route path="/olympicGames" element={<OlympicGameList />} /> */}
              <Route path="/results" element={<Results />} />
              {/* <Route path="/olympicGames/:id" element={<OlympicGameDetail />} />
              <Route
                path="/olympicGames/edit/:id"
                element={<OlympicGameEdit />}
              /> */}
              <Route path="/athletes" element={<AthleteList />} />
              <Route path="/athletes/:id" element={<AthleteDetail />} />
              <Route path="/athletes/edit/:id" element={<AthleteEdit />} />
              <Route path="/chatbot" element={<Chatbot/>} />
              <Route path="/calendar" element={<Calendar/>} />
            </Routes>
          </main>

          <Footer />
        </div>
      </UserRoleProvider>
    </Router>
  );
}

export default App;
