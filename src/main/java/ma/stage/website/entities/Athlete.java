package ma.stage.website.entities;

import java.sql.Date;

import org.hibernate.mapping.Collection;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
@Entity
public class Athlete {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String prenom;
    @Lob
    @Column(length = 100000000)
    private byte[] photo;
    private String sexe;
    @Temporal(TemporalType.DATE)
    private Date dateDeNaissance;
    @ManyToOne
    private Pays pays;
    @ManyToOne
    private Sport sport;
    @ManyToMany
    private java.util.Collection<OlympicGame> olympicGames;
    private String medaille;
    public Athlete() {
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNom() {
        return nom;
    }
    public void setNom(String nom) {
        this.nom = nom;
    }
    public String getPrenom() {
        return prenom;
    }
    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }
    public byte[] getPhoto() {
        return photo;
    }
    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }
    public String getSexe() {
        return sexe;
    }
    public void setSexe(String sexe) {
        this.sexe = sexe;
    }
    public Date getDateDeNaissance() {
        return dateDeNaissance;
    }
   
    public Pays getPays() {
        return pays;
    }
    public void setPays(Pays pays) {
        this.pays = pays;
    }
    public Sport getSport() {
        return sport;
    }
    public void setSport(Sport sport) {
        this.sport = sport;
    }
    public java.util.Collection<OlympicGame> getOlympicGames() {
        return olympicGames;
    }
    public void setOlympicGames(java.util.Collection<OlympicGame> olympicGames) {
        this.olympicGames = olympicGames;
    }
    public String getMedaille() {
        return medaille;
    }
    public void setMedaille(String medaille) {
        this.medaille = medaille;
    }
    public void setDateDeNaissance(Date dateDeNaissance) {
        this.dateDeNaissance = dateDeNaissance;
    }

    
   

}
