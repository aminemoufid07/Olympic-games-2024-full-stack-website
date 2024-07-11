import React, { useState } from "react";
import { auth } from "../../util/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../util/firebase";
import { useNavigate } from "react-router-dom";
import { serverTimestamp } from "firebase/firestore";
import { Card, Form, Button } from "react-bootstrap";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Ajouter l'utilisateur à Firestore avec un rôle par défaut
      await setDoc(doc(db, "users", user.uid), {
        username: email, // Utilisation de l'email comme username par défaut
        role: "user", // Rôle par défaut lors de l'inscription
        createdAt: serverTimestamp(), // Timestamp du serveur pour le champ createdAt
      });

      // Redirection après l'inscription réussie
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Card>
            <Card.Body>
              <Card.Title className="text-center">Sign Up</Card.Title>
              <Form onSubmit={handleSignUp}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <Button variant="primary" type="submit">
                  Sign Up
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
