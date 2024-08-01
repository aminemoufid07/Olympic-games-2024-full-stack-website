import React, { useState, useEffect } from "react";
import { db } from "../../util/firebase"; // Assurez-vous d'importer db depuis votre fichier firebase.js
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import modifyPic from "../../assets/bouton-modifier.png";
import deletePic from "../../assets/supprimer.png";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [formError, setFormError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error("Error loading users: ", error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user: ", error);
      setError(error);
    }
  };

  const handleEdit = (id) => {
    const user = users.find((user) => user.id === id);
    setCurrentUserId(id);
    setNewRole(user.role);
    setShow(true);
  };

  const handleUpdate = async () => {
    if (!newRole) {
      setFormError("Le champ rôle ne peut pas être vide");
      return;
    }

    try {
      const userRef = doc(db, "users", currentUserId);
      await updateDoc(userRef, {
        role: newRole,
      });
      setUsers(
        users.map((user) =>
          user.id === currentUserId ? { ...user, role: newRole } : user
        )
      );
      setShow(false);
      setFormError("");
      setCurrentUserId(null);
    } catch (error) {
      console.error("Error updating user role: ", error);
      setError(error);
    }
  };

  const handleClose = () => {
    setShow(false);
    setFormError("");
    setCurrentUserId(null);
    setNewRole("");
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <Container>
      <style>{`
        h1 {
          font-size: 2rem;
          color: #333;
        }
        .table {
          margin-top: 20px;
        }
        .table th, .table td {
          text-align: center;
        }
        .table img {
          cursor: pointer;
        }
        .modal-title {
          color: #007bff;
        }
        .btn-outline-primary img {
          width: 30px;
          height: 30px;
        }
        .btn-link img {
          width: 30px;
          height: 30px;
        }
      `}</style>
      <br />
      <br />

      <Row className="my-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>Gestion des utilisateurs</h1>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>username</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button variant="link" onClick={() => handleEdit(user.id)}>
                      <img src={modifyPic} alt="Modifier" />
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => handleDelete(user.id)}
                    >
                      <img src={deletePic} alt="Supprimer" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier le rôle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nouveau rôle</Form.Label>
              <Form.Select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                aria-label="Sélectionnez le nouveau rôle"
              >
                
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
              {formError && <p className="text-danger">{formError}</p>}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Modifier
          </Button>
        </Modal.Footer>
      </Modal>

      {/* <Button onClick={() => navigate("/")}>Retour à l'accueil</Button> */}
    </Container>
  );
};

export default UsersManagement;
