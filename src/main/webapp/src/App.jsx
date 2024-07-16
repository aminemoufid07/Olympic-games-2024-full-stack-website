import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TypeList from "./Components/Type/TypeList";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import ActualiteList from "./Components/Actualite/ActualiteList";
import ActualiteDetail from "./Components/Actualite/ActualiteDetail";
import ActualiteEdit from "./Components/Actualite/ActualiteEdit";
import LoginPage from "./Components/Authentification/LoginPage.jsx";
import SignUpPage from "./Components/Authentification/SignUpPage.jsx";
import UserManagement from "./Components/Authentification/UserManagement.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import { auth, db } from "./util/firebase"; // Assurez-vous que db est correctement configuré
import { doc, getDoc } from "firebase/firestore";
import { UserRoleProvider } from "./util/userRoleContext.jsx";
import EventList from "./Components/Scrapping/EventList.jsx";

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
              <Route
                path="/types"
                element={<PrivateRoute allowedRoles={["admin"]} />}
              >
                <Route path="/types" element={<TypeList />} />
              </Route>

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
              <Route path="/Events" element={<EventList />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </UserRoleProvider>
    </Router>
  );
}

export default App;
