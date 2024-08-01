import React, { useState, useEffect } from "react";
import { auth, db } from "../../util/firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { serverTimestamp } from "firebase/firestore";
import {
  Card,
  Form,
  Button,
  Container,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import logo from "../../assets/casanet logo.jpeg";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [sports, setSports] = useState([]);
  const [selectedSports, setSelectedSports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch sports from your backend API
    const fetchSports = async () => {
      const response = await fetch("http://localhost:8086/api/v1/sports");
      const data = await response.json();
      setSports(data);
    };

    fetchSports();
  }, []);

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const emailQuery = query(
        collection(db, "users"),
        where("email", "==", email)
      );
      const emailQuerySnapshot = await getDocs(emailQuery);
      if (!emailQuerySnapshot.empty) {
        setError("Email already exists");
        return;
      }

      const usernameQuery = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const usernameQuerySnapshot = await getDocs(usernameQuery);
      if (!usernameQuerySnapshot.empty) {
        setError("Username already exists");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: email,
        fullName: fullName,
        username: username,
        role: "user",
        createdAt: serverTimestamp(),
        sports: selectedSports,
      });

      await signOut(auth);
      navigate("/compte");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCheckboxChange = (sport) => {
    setSelectedSports((prevSelectedSports) =>
      prevSelectedSports.includes(sport)
        ? prevSelectedSports.filter((s) => s !== sport)
        : [...prevSelectedSports, sport]
    );
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
                Créez votre compte
              </Card.Title>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
              >
                <Form.Group className="mb-3" controlId="formBasicFullName">
                  <Form.Label>Nom complet</Form.Label>
                  <Form.Control
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Nom d'utilisateur</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>
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
                <Form.Group
                  className="mb-3"
                  controlId="formBasicConfirmPassword"
                >
                  <Form.Label>Confirmer le mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <Button variant="primary" type="submit" className="w-100 mb-3">
                  Créer un compte
                </Button>
                <div className="text-center">
                  Vous avez déjà un compte ?{" "}
                  <Button
                    variant="link"
                    onClick={() => navigate("/compte")}
                    className="p-0"
                  >
                    Connectez-vous
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          <br />
        </Col>
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Choisissez vos sports préférés</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSignUp}>
            {sports.map((sport) => (
              <Form.Check
                type="checkbox"
                key={sport.id}
                id={sport.id}
                label={sport.nom}
                onChange={() => handleCheckboxChange(sport.nom)}
              />
            ))}
            <Button variant="primary" type="submit" className="w-100 mt-3">
              Confirmer
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default SignUpPage;
