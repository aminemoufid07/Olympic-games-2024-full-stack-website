// package ma.stage.website.entities;

// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;
// @Entity
// public class Abonnement {
// @Id
// @GeneratedValue(strategy = GenerationType.IDENTITY)
// private Long id;

// @ManyToOne
// @JoinColumn(name = "user_id")
// private User user;

// private String type;
// private boolean subscribed;

// public Abonnement() {
// }
// public User getUser() {
// return user;
// }
// public void setUser(User user) {
// this.user = user;
// }
// public String getType() {
// return type;
// }
// public void setType(String type) {
// this.type = type;
// }
// public boolean isSubscribed() {
// return subscribed;
// }
// public void setSubscribed(boolean subscribed) {
// this.subscribed = subscribed;
// }

// }
