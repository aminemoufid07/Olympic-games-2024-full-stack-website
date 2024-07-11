import React, { useState } from "react";
import { auth } from "../../util/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap"; // Import des composants Card, Form et Button de Bootstrap

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Accès à l'utilisateur connecté si nécessaire
      const user = userCredential.user;
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignUp = () => {
    navigate("/inscription"); // Redirection vers la page d'inscription
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Card>
            <Card.Body>
              <Card.Title className="text-center">Login</Card.Title>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <Button variant="primary" type="submit" className="me-2">
                  Login
                </Button>

                <Button variant="secondary" onClick={handleSignUp}>
                  S'inscrire
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
