package ma.stage.website.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

@Entity
public class Pays {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    @ManyToOne
    private Sport sport;
    @ManyToMany
    private java.util.Collection<Actualite> actualites;
    @Lob
    @Column(length = 100000000)
    private byte[] image;
    private String imageUrl;
    private int goldMedals;
    private int silverMedals;
    private int bronzeMedals;

    public Pays() {
    }

    public int getGoldMedals() {
        return goldMedals;
    }

    public void setGoldMedals(int goldMedals) {
        this.goldMedals = goldMedals;
    }

    public int getSilverMedals() {
        return silverMedals;
    }

    public void setSilverMedals(int silverMedals) {
        this.silverMedals = silverMedals;
    }

    public int getBronzeMedals() {
        return bronzeMedals;
    }

    public void setBronzeMedals(int bronzeMedals) {
        this.bronzeMedals = bronzeMedals;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Sport getSport() {
        return sport;
    }

    public void setSport(Sport sport) {
        this.sport = sport;
    }

    public java.util.Collection<Actualite> getActualites() {
        return actualites;
    }

    public void setActualites(java.util.Collection<Actualite> actualites) {
        this.actualites = actualites;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public Pays(String nom, String imageUrl) {
        this.nom = nom;
        this.imageUrl = imageUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

}
