import React, { useState } from "react";
import { auth, db } from "../../util/firebase"; // Assurez-vous que db est correctement configuré
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
import logo from "../../assets/casanet logo.jpeg";
import { collection, query, where, getDocs } from "firebase/firestore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignUp = () => {
    navigate("/inscription");
  };

  const handleForgotPassword = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", forgotPasswordEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        await sendPasswordResetEmail(auth, forgotPasswordEmail);
        alert("E-mail de réinitialisation envoyé.");
        setShowForgotPasswordModal(false);
      } else {
        setForgotPasswordError("Aucun utilisateur trouvé avec cet e-mail.");
      }
    } catch (error) {
      setForgotPasswordError(error.message);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4">
            <Card.Body>
              <div className="text-center mb-4">
                <img src={logo} alt="Logo" width="100" />
              </div>
              <Card.Title className="text-center mb-4">
                Connectez-vous à votre compte
              </Card.Title>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <Button variant="primary" type="submit" className="w-100 mb-3">
                  Connexion
                </Button>

                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => setShowForgotPasswordModal(true)}
                    
                  >
                    Mot de passe oublié ?
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <Button variant="link" onClick={handleSignUp}>
                    Vous découvrez ce site ? Créez un compte
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showForgotPasswordModal} onHide={() => setShowForgotPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Réinitialiser le mot de passe</Modal.Title>
        </Modal.Header>
        <Modal.Body>  
          <Form>
            <Form.Group controlId="formForgotPasswordEmail">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                required
              />
            </Form.Group>
            {forgotPasswordError && <p style={{ color: "red" }}>{forgotPasswordError}</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowForgotPasswordModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleForgotPassword}>
            Envoyer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LoginPage;
