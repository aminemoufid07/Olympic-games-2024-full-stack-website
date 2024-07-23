package ma.stage.website.entities;

import java.sql.Date;

import org.hibernate.mapping.Collection;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
@Entity
public class OlympicGame {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Sport sport;
    @ManyToMany
    private java.util.Collection<Athlete> athletes;
     @Temporal(TemporalType.DATE)
    private Date datePrevue;
   
    private String typeDeTour;
    private String sexe;
    private String media;

    
    public OlympicGame() {
    }
    public Sport getSport() {
        return sport;
    }
    public void setSport(Sport sport) {
        this.sport = sport;
    }
    public java.util.Collection<Athlete> getAthletes() {
        return athletes;
    }
    public void setAthletes(java.util.Collection<Athlete> athletes) {
        this.athletes = athletes;
    }
    public Date getDatePrevue() {
        return datePrevue;
    }
    public void setDatePrevue(Date datePrevue) {
        this.datePrevue = datePrevue;
    }
    public String getTypeDeTour() {
        return typeDeTour;
    }
    public void setTypeDeTour(String typeDeTour) {
        this.typeDeTour = typeDeTour;
    }
    public String getSexe() {
        return sexe;
    }
    public void setSexe(String sexe) {
        this.sexe = sexe;
    }
    public String getMedia() {
        return media;
    }
    public void setMedia(String media) {
        this.media = media;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    
}
