// PrivateRoute.jsx
import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth, db } from "./util/firebase";
import { doc, getDoc } from "firebase/firestore";

const PrivateRoute = ({ requiredRole }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setIsAuthorized(
            userData.role === requiredRole || userData.role === "admin"
          );
        } else {
          setIsAuthorized(false);
        }
      } else {
        setCurrentUser(null);
        setIsAuthorized(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [requiredRole]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/compte" />;
};

export default PrivateRoute;
